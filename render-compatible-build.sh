#!/bin/bash

echo "🚀 Building Nedaxer Trading Platform - Compatible Version"
echo "📊 Node version: $(node --version)"
echo "📦 Using existing Vite 6.0.5 (compatible with Node 20.18.1)"

# Set production environment
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=2048"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf client/dist/

# Install root dependencies first
echo "📦 Installing root dependencies..."
npm ci --ignore-scripts --silent || {
    echo "⚠️ Root npm ci failed, trying regular install..."
    npm install --silent
}

# Build client with existing dependencies
echo "📦 Building client with existing Vite 6.0.5..."
cd client

# Ensure client dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing client dependencies..."
    npm install --silent
fi

# Verify Vite is available
if [ ! -f "node_modules/.bin/vite" ]; then
    echo "❌ Vite not found in client node_modules"
    echo "📦 Installing Vite 6.0.5 specifically..."
    npm install vite@6.0.5 --save-dev --silent
fi

echo "🎨 Building React frontend with Vite 6.0.5..."
# Use the local vite installation
./node_modules/.bin/vite build --mode production

if [ ! -d "dist" ]; then
    echo "❌ Client build failed!"
    echo "🔍 Checking for common issues..."
    ls -la node_modules/.bin/ | grep vite
    cat package.json | grep vite
    exit 1
fi

echo "✅ Client build successful!"
cd ..

# Create production directory
mkdir -p dist
cp -r client/dist/* dist/

# Check if server directory exists
if [ -d "server" ]; then
    echo "📦 Installing server dependencies..."
    cd server
    npm install --silent --no-optional
    cd ..
fi

# Create optimized production server
echo "🖥️ Creating optimized Nedaxer backend server..."
cat > dist/server.js << 'EOF'
// Nedaxer Trading Platform - Production Server
const express = require('express');
const path = require('path');
const http = require('http');
const compression = require('compression');
const session = require('express-session');
const cors = require('cors');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// MongoDB connection setup
let db = null;
let MongoClient = null;

// Try to load MongoDB
try {
    const mongodb = require('mongodb');
    MongoClient = mongodb.MongoClient;
} catch (error) {
    console.log('⚠️ MongoDB not available, running in demo mode');
}

const MONGODB_URI = process.env.MONGODB_URI;

async function connectMongoDB() {
    if (!MongoClient || !MONGODB_URI) {
        console.log('🔄 Running without MongoDB - using demo data');
        return;
    }
    
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db('nedaxer');
        console.log('✅ MongoDB connected successfully');
        await initializeCollections();
    } catch (error) {
        console.log('⚠️ MongoDB connection failed:', error.message);
        console.log('🔄 Running with demo data');
    }
}

async function initializeCollections() {
    if (!db) return;
    
    try {
        const collections = ['users', 'userBalances', 'transactions', 'currencies'];
        for (const collection of collections) {
            await db.createCollection(collection).catch(() => {});
        }
        
        const currencies = await db.collection('currencies').find({}).toArray();
        if (currencies.length === 0) {
            await db.collection('currencies').insertMany([
                { symbol: 'USD', name: 'US Dollar', rate: 1 },
                { symbol: 'EUR', name: 'Euro', rate: 0.85 },
                { symbol: 'GBP', name: 'British Pound', rate: 0.73 },
                { symbol: 'JPY', name: 'Japanese Yen', rate: 110.5 }
            ]);
        }
        
        console.log('✅ Database collections initialized');
    } catch (error) {
        console.log('⚠️ Database initialization error:', error.message);
    }
}

// Middleware
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'nedaxer-platform-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Nedaxer Trading Platform',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production',
        database: db ? 'connected' : 'demo_mode',
        node_version: process.version
    });
});

// Real-time crypto prices API
app.get('/api/crypto/realtime-prices', async (req, res) => {
    try {
        let axios;
        try {
            axios = require('axios');
        } catch (error) {
            console.log('⚠️ Axios not available, using demo crypto data');
            return res.json({ success: true, data: getDemoCryptoPrices() });
        }
        
        const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
        
        const cryptoIds = [
            'bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 
            'dogecoin', 'cardano', 'tron', 'avalanche-2', 'chainlink',
            'polygon-ecosystem-token', 'usd-coin', 'shiba-inu', 'litecoin',
            'polkadot', 'bitcoin-cash', 'near', 'internet-computer', 'cosmos',
            'pepe', 'maker', 'arbitrum', 'optimism', 'kaspa', 'injective-protocol'
        ];
        
        let url = 'https://api.coingecko.com/api/v3/simple/price';
        const params = {
            ids: cryptoIds.join(','),
            vs_currencies: 'usd',
            include_24hr_change: 'true',
            include_market_cap: 'true'
        };
        
        if (COINGECKO_API_KEY) {
            url = 'https://pro-api.coingecko.com/api/v3/simple/price';
            params.x_cg_pro_api_key = COINGECKO_API_KEY;
        }
        
        const response = await axios.get(url, { params, timeout: 10000 });
        
        const formattedData = Object.entries(response.data).map(([id, data]) => ({
            symbol: id.replace(/-/g, '').toUpperCase(),
            name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            price: data.usd || 0,
            change24h: data.usd_24h_change || 0,
            marketCap: data.usd_market_cap || 0
        }));
        
        console.log(`✅ Fetched ${formattedData.length} crypto prices successfully`);
        res.json({ success: true, data: formattedData });
    } catch (error) {
        console.error('CoinGecko API error:', error.message);
        res.json({ success: true, data: getDemoCryptoPrices() });
    }
});

function getDemoCryptoPrices() {
    return [
        { symbol: 'BITCOIN', name: 'Bitcoin', price: 45000, change24h: 2.5, marketCap: 850000000000 },
        { symbol: 'ETHEREUM', name: 'Ethereum', price: 3200, change24h: 1.8, marketCap: 380000000000 },
        { symbol: 'SOLANA', name: 'Solana', price: 110, change24h: 3.2, marketCap: 45000000000 },
        { symbol: 'BINANCECOIN', name: 'BNB', price: 380, change24h: -0.5, marketCap: 58000000000 },
        { symbol: 'RIPPLE', name: 'XRP', price: 0.65, change24h: -1.2, marketCap: 35000000000 },
        { symbol: 'DOGECOIN', name: 'Dogecoin', price: 0.08, change24h: 5.3, marketCap: 11000000000 },
        { symbol: 'CARDANO', name: 'Cardano', price: 0.45, change24h: -2.1, marketCap: 15000000000 },
        { symbol: 'TRON', name: 'TRON', price: 0.12, change24h: 1.5, marketCap: 10000000000 }
    ];
}

// Authentication APIs
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    
    try {
        let user = null;
        
        if (db) {
            user = await db.collection('users').findOne({ email: email.toLowerCase() });
        }
        
        if (!user) {
            user = {
                id: 'demo-' + Date.now(),
                email: email.toLowerCase(),
                username: email.split('@')[0],
                firstName: 'Demo',
                lastName: 'User',
                verified: true,
                createdAt: new Date()
            };
            
            if (db) {
                await db.collection('users').insertOne(user);
                await db.collection('userBalances').insertOne({
                    userId: user.id,
                    currency: 'USD',
                    amount: 1000,
                    createdAt: new Date()
                });
            }
        }
        
        req.session.userId = user.id;
        req.session.userEmail = user.email;
        
        res.json({ 
            success: true, 
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                verified: user.verified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const { email, password, username } = req.body;
    
    if (!email || !password || !username) {
        return res.status(400).json({ success: false, message: 'All fields required' });
    }
    
    try {
        const user = {
            id: 'user-' + Date.now(),
            email: email.toLowerCase(),
            username: username,
            firstName: username,
            lastName: 'User',
            verified: true,
            createdAt: new Date()
        };
        
        if (db) {
            await db.collection('users').insertOne(user);
            await db.collection('userBalances').insertOne({
                userId: user.id,
                currency: 'USD',
                amount: 1000,
                createdAt: new Date()
            });
        }
        
        req.session.userId = user.id;
        req.session.userEmail = user.email;
        
        res.json({ 
            success: true, 
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                verified: user.verified
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

// User data APIs
app.get('/api/user/balance', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    try {
        let balance = { usd: 1000 };
        
        if (db) {
            const userBalance = await db.collection('userBalances').findOne({ 
                userId: req.session.userId 
            });
            
            if (userBalance) {
                balance = { [userBalance.currency.toLowerCase()]: userBalance.amount };
            }
        }
        
        res.json({ success: true, balance, currency: 'USD' });
    } catch (error) {
        console.error('Balance error:', error);
        res.json({ success: true, balance: { usd: 1000 }, currency: 'USD' });
    }
});

app.get('/api/wallet/summary', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    try {
        let totalBalance = 1000;
        let assets = [{ symbol: 'USD', amount: 1000, value: 1000 }];
        
        if (db) {
            const balances = await db.collection('userBalances').find({ 
                userId: req.session.userId 
            }).toArray();
            
            if (balances.length > 0) {
                totalBalance = balances.reduce((sum, b) => sum + b.amount, 0);
                assets = balances.map(b => ({
                    symbol: b.currency,
                    amount: b.amount,
                    value: b.amount
                }));
            }
        }
        
        res.json({
            success: true,
            totalBalance,
            currency: 'USD',
            assets
        });
    } catch (error) {
        console.error('Wallet summary error:', error);
        res.json({
            success: true,
            totalBalance: 1000,
            currency: 'USD',
            assets: [{ symbol: 'USD', amount: 1000, value: 1000 }]
        });
    }
});

app.get('/api/user/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    try {
        let user = null;
        
        if (db) {
            user = await db.collection('users').findOne({ id: req.session.userId });
        }
        
        if (!user) {
            user = {
                id: req.session.userId,
                email: req.session.userEmail || 'demo@nedaxer.com',
                username: 'demo',
                firstName: 'Demo',
                lastName: 'User',
                verified: true
            };
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ success: false, message: 'Profile fetch failed' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Exchange rates
app.get('/api/exchange/rates', (req, res) => {
    res.json({
        success: true,
        rates: {
            USD: 1,
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110.5,
            CAD: 1.25,
            AUD: 1.35,
            CHF: 0.91,
            CNY: 6.45
        },
        lastUpdated: new Date().toISOString()
    });
});

// Serve static files
app.use(express.static(__dirname, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// Client-side routing fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const port = process.env.PORT || 5000;

async function startServer() {
    await connectMongoDB();
    
    server.listen(port, '0.0.0.0', () => {
        console.log('');
        console.log('🚀 ====================================');
        console.log('🎯 NEDAXER TRADING PLATFORM LIVE');
        console.log('🚀 ====================================');
        console.log(`📍 Port: ${port}`);
        console.log(`🌐 URL: http://localhost:${port}`);
        console.log(`🎨 Frontend: Vite 6.0.5 React Build`);
        console.log(`🔗 Backend: Express.js + MongoDB`);
        console.log(`💰 Crypto API: ${process.env.COINGECKO_API_KEY ? 'Pro CoinGecko' : 'Public CoinGecko'}`);
        console.log(`🗄️ Database: ${db ? 'MongoDB Atlas' : 'Demo Mode'}`);
        console.log(`🔐 Session: Express session store`);
        console.log(`📦 Node: ${process.version}`);
        console.log('🚀 ====================================');
        console.log('');
    });
}

startServer().catch(console.error);
EOF

echo "✅ Nedaxer Trading Platform build completed successfully!"
echo ""
echo "🎯 Build Summary:"
echo "📱 Frontend: Vite 6.0.5 React build (compatible with Node 20.18.1)"
echo "🖥️ Backend: Express.js with MongoDB integration"
echo "🔗 Single command: node dist/server.js"
echo "🌐 Ready for Render deployment"
echo ""
echo "🚀 Test locally: cd dist && node server.js"