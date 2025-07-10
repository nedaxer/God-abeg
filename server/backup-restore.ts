// @ts-nocheck
// Standalone MongoDB Backup & Restore System
import type { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import multer from "multer";
import path from "path";
import fs from "fs";

const RESTORE_PIN = process.env.RESTORE_PIN || "6272";
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB limit for complete data backup

// Configure multer for file uploads
const upload = multer({
  dest: 'temp-uploads/',
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    // Only accept JSON files
    if (file.mimetype === 'application/json' || path.extname(file.originalname).toLowerCase() === '.json') {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'));
    }
  }
});

export function registerBackupRestoreRoutes(app: Express) {
  
  // Serve the backup/restore page HTML
  app.get('/backup-restore', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MongoDB Backup & Restore</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #0a0a2e 0%, #16213e 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                max-width: 500px;
                width: 100%;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .logo {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .logo h1 {
                font-size: 28px;
                font-weight: 700;
                color: #ff6b35;
                margin-bottom: 5px;
            }
            
            .logo p {
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
            }
            
            .pin-section {
                margin-bottom: 30px;
            }
            
            .backup-section {
                display: none;
            }
            
            .section-title {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 20px;
                color: #ff6b35;
                text-align: center;
            }
            
            .input-group {
                margin-bottom: 20px;
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: rgba(255, 255, 255, 0.9);
            }
            
            input[type="password"],
            input[type="file"] {
                width: 100%;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 10px;
                color: white;
                font-size: 16px;
                transition: all 0.3s ease;
            }
            
            input[type="password"]:focus,
            input[type="file"]:focus {
                outline: none;
                border-color: #ff6b35;
                background: rgba(255, 255, 255, 0.15);
            }
            
            .pin-input {
                text-align: center;
                letter-spacing: 8px;
                font-size: 24px;
                font-weight: bold;
            }
            
            .btn {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                border: none;
                border-radius: 10px;
                color: white;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 15px;
            }
            
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(255, 107, 53, 0.3);
            }
            
            .btn:active {
                transform: translateY(0);
            }
            
            .btn-secondary {
                background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            }
            
            .btn-secondary:hover {
                box-shadow: 0 10px 20px rgba(74, 85, 104, 0.3);
            }
            
            .error {
                background: rgba(220, 53, 69, 0.2);
                color: #ff6b6b;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid rgba(220, 53, 69, 0.3);
                text-align: center;
            }
            
            .success {
                background: rgba(40, 167, 69, 0.2);
                color: #51cf66;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid rgba(40, 167, 69, 0.3);
                text-align: center;
            }
            
            .divider {
                height: 1px;
                background: rgba(255, 255, 255, 0.2);
                margin: 30px 0;
            }
            
            .warning {
                background: rgba(255, 193, 7, 0.1);
                color: #ffc107;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                border: 1px solid rgba(255, 193, 7, 0.3);
                font-size: 14px;
                text-align: center;
            }
            
            .file-info {
                background: rgba(255, 255, 255, 0.05);
                padding: 10px;
                border-radius: 8px;
                margin-top: 10px;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.8);
            }
            
            @media (max-width: 600px) {
                .container {
                    padding: 30px 20px;
                }
                
                .logo h1 {
                    font-size: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <h1>🗄️ Database Manager</h1>
                <p>MongoDB Backup & Restore System</p>
            </div>
            
            <!-- PIN Entry Section -->
            <div class="pin-section" id="pinSection">
                <div class="section-title">🔐 Enter Security PIN</div>
                <div class="input-group">
                    <label for="pinInput">4-Digit Access Code</label>
                    <input type="password" id="pinInput" class="pin-input" maxlength="4" placeholder="••••">
                </div>
                <button class="btn" onclick="verifyPin()">Unlock Database Manager</button>
                <div id="pinError" style="display: none;" class="error"></div>
            </div>
            
            <!-- Backup/Restore Section -->
            <div class="backup-section" id="backupSection">
                <div class="section-title">📦 Database Operations</div>
                
                <!-- Download Backup -->
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #51cf66; margin-bottom: 15px;">📤 Download Backup</h3>
                    <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 15px; font-size: 14px;">
                        Create a complete backup of your MongoDB database
                    </p>
                    <button class="btn" onclick="downloadBackup()">Download Full Backup</button>
                </div>
                
                <div class="divider"></div>
                
                <!-- Upload Restore -->
                <div>
                    <h3 style="color: #ff6b35; margin-bottom: 15px;">📥 Restore Database</h3>
                    <div class="warning">
                        ⚠️ This will completely replace your current database with the backup data<br>
                        📦 Maximum file size: 50MB
                    </div>
                    <div class="input-group">
                        <label for="backupFile">Select Backup File (.json only)</label>
                        <input type="file" id="backupFile" accept=".json" onchange="showFileInfo()">
                        <div id="fileInfo" class="file-info" style="display: none;"></div>
                    </div>
                    <button class="btn btn-secondary" onclick="restoreDatabase()">Restore Database</button>
                </div>
                
                <div id="message" style="margin-top: 20px;"></div>
            </div>
        </div>
        
        <script>
            function verifyPin() {
                const pin = document.getElementById('pinInput').value;
                const errorDiv = document.getElementById('pinError');
                
                if (pin.length !== 4) {
                    showError('Please enter a 4-digit PIN');
                    return;
                }
                
                fetch('/api/backup-restore/verify-pin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pin })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('pinSection').style.display = 'none';
                        document.getElementById('backupSection').style.display = 'block';
                    } else {
                        showError('Invalid PIN. Access denied.');
                    }
                })
                .catch(err => showError('Authentication failed. Please try again.'));
            }
            
            function downloadBackup() {
                const pin = document.getElementById('pinInput').value;
                
                // Show progress message
                showMessage('Preparing backup download... This may take a moment.', 'info');
                
                // Create download link
                const downloadUrl = '/api/backup-restore/download?pin=' + encodeURIComponent(pin);
                
                // Try using fetch first for better error handling
                fetch(downloadUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Download failed: ' + response.statusText);
                    }
                    
                    // Create blob and download
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'mongo-backup-' + new Date().toISOString().split('T')[0] + '.json';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    
                    showMessage('Backup downloaded successfully!', 'success');
                })
                .catch(error => {
                    console.error('Download error:', error);
                    showMessage('Download failed: ' + error.message, 'error');
                    
                    // Fallback to direct window.location
                    showMessage('Trying alternative download method...', 'info');
                    window.location.href = downloadUrl;
                });
            }
            
            function restoreDatabase() {
                const fileInput = document.getElementById('backupFile');
                const pin = document.getElementById('pinInput').value;
                
                if (!fileInput.files[0]) {
                    showMessage('Please select a backup file first.', 'error');
                    return;
                }
                
                const formData = new FormData();
                formData.append('backup', fileInput.files[0]);
                formData.append('pin', pin);
                
                showMessage('Restoring database... Please wait.', 'info');
                
                fetch('/api/backup-restore/restore', {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        showMessage('Database restored successfully! ' + data.message, 'success');
                        fileInput.value = '';
                        document.getElementById('fileInfo').style.display = 'none';
                    } else {
                        showMessage('Restore failed: ' + data.error, 'error');
                    }
                })
                .catch(err => showMessage('Restore failed: ' + err.message, 'error'));
            }
            
            function showFileInfo() {
                const fileInput = document.getElementById('backupFile');
                const fileInfo = document.getElementById('fileInfo');
                
                if (fileInput.files[0]) {
                    const file = fileInput.files[0];
                    const size = (file.size / 1024 / 1024).toFixed(2);
                    fileInfo.innerHTML = \`📄 \${file.name}<br>📊 Size: \${size} MB<br>📅 Modified: \${new Date(file.lastModified).toLocaleString()}\`;
                    fileInfo.style.display = 'block';
                } else {
                    fileInfo.style.display = 'none';
                }
            }
            
            function showError(message) {
                const errorDiv = document.getElementById('pinError');
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
                setTimeout(() => errorDiv.style.display = 'none', 3000);
            }
            
            function showMessage(message, type) {
                const messageDiv = document.getElementById('message');
                messageDiv.className = type === 'success' ? 'success' : type === 'error' ? 'error' : 'warning';
                messageDiv.textContent = message;
                messageDiv.style.display = 'block';
                
                if (type === 'success') {
                    setTimeout(() => messageDiv.style.display = 'none', 5000);
                }
            }
            
            // Allow Enter key for PIN entry
            document.getElementById('pinInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    verifyPin();
                }
            });
        </script>
    </body>
    </html>
    `;
    
    res.send(html);
  });

  // PIN verification endpoint
  app.post('/api/backup-restore/verify-pin', (req, res) => {
    const { pin } = req.body;
    
    if (pin === RESTORE_PIN) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: 'Invalid PIN' });
    }
  });

  // Download backup endpoint
  app.get('/api/backup-restore/download', async (req, res) => {
    try {
      const { pin } = req.query;
      
      // Verify PIN
      if (pin !== RESTORE_PIN) {
        return res.status(403).json({ error: 'Invalid PIN' });
      }

      // Enhanced MongoDB connection with SSL error handling  
      const mongoOptions = {
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
        retryWrites: true,
        w: 'majority' as const,
        connectTimeoutMS: 30000,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 30000,
        maxPoolSize: 10,
        minPoolSize: 1
      };
      
      const client = new MongoClient(process.env.MONGODB_URI!, mongoOptions);
      
      try {
        await client.connect();
        console.log('✅ MongoDB connection successful for backup operation');
      } catch (connectionError: any) {
        console.error('❌ MongoDB connection failed:', connectionError.message);
        if (connectionError.message.includes('SSL') || connectionError.message.includes('TLS')) {
          return res.status(500).json({ 
            error: `SSL/TLS Connection Error: ${connectionError.message}. Please check your MongoDB URI and SSL settings.` 
          });
        }
        return res.status(500).json({ 
          error: `Database Connection Failed: ${connectionError.message}` 
        });
      }
      
      // Get all databases
      const admin = client.db().admin();
      const databases = await admin.listDatabases();
      
      const backup: any = {
        metadata: {
          createdAt: new Date().toISOString(),
          mongodbVersion: (await admin.serverStatus()).version,
          totalDatabases: 0,
          totalCollections: 0,
          totalDocuments: 0,
          criticalCollections: []
        }
      };
      
      console.log('🔄 Starting comprehensive MongoDB backup...');
      
      // Backup each database
      for (const dbInfo of databases.databases) {
        // Skip system databases and sample databases
        if (dbInfo.name === 'admin' || 
            dbInfo.name === 'config' || 
            dbInfo.name === 'local' || 
            dbInfo.name.startsWith('sample_')) {
          continue; 
        }
        
        const db = client.db(dbInfo.name);
        const collections = await db.listCollections().toArray();
        
        backup[dbInfo.name] = {};
        backup.metadata.totalDatabases++;
        
        // Backup each collection with detailed logging
        console.log(`📦 Backing up database: ${dbInfo.name}`);
        for (const collInfo of collections) {
          const collection = db.collection(collInfo.name);
          
          // Get ALL documents with complete data structure
          const documents = await collection.find({}).toArray();
          backup[dbInfo.name][collInfo.name] = documents;
          backup.metadata.totalCollections++;
          backup.metadata.totalDocuments += documents.length;
          
          console.log(`  ✅ ${collInfo.name}: ${documents.length} documents`);
          
          // Track critical collections for restoration verification
          if (['users', 'userbalances', 'currencies', 'sessions', 'transfers', 'notifications'].includes(collInfo.name)) {
            backup.metadata.criticalCollections.push({
              database: dbInfo.name,
              collection: collInfo.name,
              documentCount: documents.length
            });
          }
          
          // Special logging for critical collections
          if (collInfo.name === 'users') {
            console.log(`     Users found: ${documents.map(u => u.username || u.email).join(', ')}`);
            // Log user authentication data for verification
            const authData = documents.map(u => ({
              username: u.username || u.email,
              hasPassword: !!u.password,
              isVerified: u.isVerified,
              isAdmin: u.isAdmin,
              balance: u.balance || 0
            }));
            backup.metadata.userAuthData = authData;
          } else if (collInfo.name === 'userbalances') {
            console.log(`     User balances: ${documents.length} balance records`);
            // Calculate total balance for verification
            const totalBalance = documents.reduce((sum, balance) => sum + (balance.amount || 0), 0);
            backup.metadata.totalUserBalance = totalBalance;
          } else if (collInfo.name === 'currencies') {
            console.log(`     Currencies: ${documents.map(c => c.symbol).join(', ')}`);
            backup.metadata.currencies = documents.map(c => c.symbol);
          } else if (collInfo.name === 'sessions') {
            console.log(`     Sessions: ${documents.length} session records`);
            backup.metadata.sessionCount = documents.length;
          }
        }
      }
      
      await client.close();
      
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const filename = `mongo-backup-${timestamp}.json`;
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(JSON.stringify(backup, null, 2));
      
    } catch (error) {
      console.error('Backup failed:', error);
      res.status(500).json({ error: 'Backup failed: ' + error.message });
    }
  });

  // Restore database endpoint
  app.post('/api/backup-restore/restore', (req, res) => {
    // Handle multer upload with error handling
    upload.single('backup')(req, res, async (uploadError) => {
      try {
        // Check for upload errors first
        if (uploadError) {
          console.error('Upload error:', uploadError);
          if (uploadError.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
              success: false,
              error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` 
            });
          }
          return res.status(400).json({ 
            success: false,
            error: 'Upload failed: ' + uploadError.message 
          });
        }

        const { pin } = req.body;
        
        // Verify PIN
        if (pin !== RESTORE_PIN) {
          return res.status(403).json({ success: false, error: 'Invalid PIN' });
        }

        if (!req.file) {
          return res.status(400).json({ success: false, error: 'No backup file provided' });
        }

        // Read and parse the backup file
        const backupData = fs.readFileSync(req.file.path, 'utf8');
        let backup;
        
        try {
          backup = JSON.parse(backupData);
        } catch (parseError) {
          // Clean up temp file
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ success: false, error: 'Invalid JSON format' });
        }

        // Enhanced MongoDB connection with SSL error handling
        const mongoOptions = {
          tls: true,
          tlsAllowInvalidCertificates: true,
          tlsAllowInvalidHostnames: true,
          retryWrites: true,
          w: 'majority' as const,
          connectTimeoutMS: 30000,
          serverSelectionTimeoutMS: 30000,
          socketTimeoutMS: 30000,
          maxPoolSize: 10,
          minPoolSize: 1
        };
        
        const client = new MongoClient(process.env.MONGODB_URI!, mongoOptions);
        
        try {
          await client.connect();
          console.log('✅ MongoDB connection successful for restore operation');
        } catch (connectionError: any) {
          console.error('❌ MongoDB connection failed:', connectionError.message);
          if (connectionError.message.includes('SSL') || connectionError.message.includes('TLS')) {
            return res.status(500).json({ 
              success: false, 
              error: `SSL/TLS Connection Error: ${connectionError.message}. Please check your MongoDB URI and SSL settings.` 
            });
          }
          return res.status(500).json({ 
            success: false, 
            error: `Database Connection Failed: ${connectionError.message}` 
          });
        }
        
        let restoredCollections = 0;
        let restoredDocuments = 0;
        let criticalDataSummary = {
          users: 0,
          userbalances: 0,
          currencies: 0,
          sessions: 0
        };
        
        console.log('🔄 Starting comprehensive database restore...');
        
        // Verify backup integrity first
        if (backup.metadata) {
          console.log('📊 Backup metadata:');
          console.log(`  Created: ${backup.metadata.createdAt}`);
          console.log(`  MongoDB Version: ${backup.metadata.mongodbVersion}`);
          console.log(`  Total Databases: ${backup.metadata.totalDatabases}`);
          console.log(`  Total Collections: ${backup.metadata.totalCollections}`);
          console.log(`  Total Documents: ${backup.metadata.totalDocuments}`);
          
          if (backup.metadata.userAuthData) {
            console.log(`  User Authentication Data: ${backup.metadata.userAuthData.length} users`);
          }
          if (backup.metadata.totalUserBalance) {
            console.log(`  Total User Balance: $${backup.metadata.totalUserBalance}`);
          }
        }
        
        // Restore each database
        for (const [dbName, dbData] of Object.entries(backup)) {
          // Skip metadata
          if (dbName === 'metadata') continue;
          
          const db = client.db(dbName);
          console.log(`📂 Restoring database: ${dbName}`);
          
          // Restore each collection
          for (const [collectionName, documents] of Object.entries(dbData as any)) {
            if (Array.isArray(documents) && documents.length > 0) {
              // Drop existing collection first
              try {
                await db.collection(collectionName).drop();
                console.log(`  🗑️ Dropped existing collection: ${collectionName}`);
              } catch (dropError) {
                // Collection might not exist, continue
                console.log(`  ℹ️ Collection ${collectionName} didn't exist, creating new`);
              }
              
              // Insert documents with complete data preservation
              await db.collection(collectionName).insertMany(documents);
              restoredCollections++;
              restoredDocuments += documents.length;
              
              console.log(`  ✅ Restored ${collectionName}: ${documents.length} documents`);
              
              // Track critical data for summary
              if (collectionName === 'users') {
                criticalDataSummary.users = documents.length;
                console.log(`     👥 Users restored: ${documents.map(u => u.username || u.email).join(', ')}`);
                
                // Verify user authentication data
                const usersWithPasswords = documents.filter(u => u.password);
                const verifiedUsers = documents.filter(u => u.isVerified);
                const adminUsers = documents.filter(u => u.isAdmin);
                console.log(`     🔐 Users with passwords: ${usersWithPasswords.length}`);
                console.log(`     ✅ Verified users: ${verifiedUsers.length}`);
                console.log(`     👑 Admin users: ${adminUsers.length}`);
              } else if (collectionName === 'userbalances') {
                criticalDataSummary.userbalances = documents.length;
                console.log(`     💰 User balance records: ${documents.length}`);
                
                // Calculate total balance
                const totalBalance = documents.reduce((sum, balance) => sum + (balance.amount || 0), 0);
                console.log(`     💵 Total balance amount: $${totalBalance}`);
              } else if (collectionName === 'currencies') {
                criticalDataSummary.currencies = documents.length;
                console.log(`     💱 Currencies: ${documents.map(c => c.symbol || c.name).join(', ')}`);
              } else if (collectionName === 'sessions') {
                criticalDataSummary.sessions = documents.length;
                console.log(`     🔐 Session records: ${documents.length}`);
                
                // Note: Sessions will be cleared after restore for security
                console.log(`     ⚠️ Sessions will be cleared after restore for security`);
              }
            } else {
              console.log(`  ⚠️ Skipping empty collection: ${collectionName}`);
            }
          }
        }
        
        console.log('✅ Database restore completed');
        console.log('📊 Critical data summary:', criticalDataSummary);
        
        // Post-restore authentication fix
        console.log('🔧 Running post-restore authentication fix...');
        
        // Clear all sessions for security and force fresh logins
        let totalSessionsCleared = 0;
        for (const [dbName, dbData] of Object.entries(backup)) {
          if (dbName === 'metadata') continue;
          
          const db = client.db(dbName);
          try {
            const sessionResult = await db.collection('sessions').deleteMany({});
            totalSessionsCleared += sessionResult.deletedCount;
            console.log(`  Cleared ${sessionResult.deletedCount} sessions from ${dbName}`);
          } catch (error) {
            console.log(`  No sessions to clear in ${dbName}`);
          }
        }
        
        // Fix user data integrity
        let usersFixed = 0;
        for (const [dbName, dbData] of Object.entries(backup)) {
          if (dbName === 'metadata') continue;
          
          const db = client.db(dbName);
          
          // Ensure all users have required authentication fields
          const usersNeedingFix = await db.collection('users').find({
            $or: [
              { isVerified: { $exists: false } },
              { isAdmin: { $exists: false } },
              { balance: { $exists: false } }
            ]
          }).toArray();
          
          for (const user of usersNeedingFix) {
            const updates: any = {};
            if (user.isVerified === undefined) updates.isVerified = true;
            if (user.isAdmin === undefined) updates.isAdmin = false;
            if (user.balance === undefined) updates.balance = 0;
            
            await db.collection('users').updateOne(
              { _id: user._id },
              { $set: updates }
            );
            usersFixed++;
          }
        }
        
        console.log(`🔐 Fixed authentication for ${usersFixed} users`);
        console.log(`🧹 Cleared ${totalSessionsCleared} corrupted sessions`);
        
        await client.close();
        
        // Clean up temp file
        fs.unlinkSync(req.file.path);
        
        // After successful restore, provide comprehensive summary and recommendations
        const summary = {
          success: true,
          message: `Restored ${restoredCollections} collections with ${restoredDocuments} documents`,
          criticalDataSummary,
          authenticationFix: {
            usersFixed,
            totalSessionsCleared
          },
          recommendations: []
        };
        
        // Add specific recommendations based on restored data
        summary.recommendations.push('✅ Database restore completed successfully');
        summary.recommendations.push(`🔐 Authentication fixed for ${usersFixed} users`);
        summary.recommendations.push(`🧹 Cleared ${totalSessionsCleared} corrupted sessions`);
        
        if (criticalDataSummary.userbalances > 0) {
          summary.recommendations.push('✅ User balance data restored - balances should display correctly');
        }
        
        if (criticalDataSummary.users === 0) {
          summary.recommendations.push('❌ No user data found - check backup file integrity');
        } else {
          summary.recommendations.push(`👥 ${criticalDataSummary.users} user accounts restored`);
        }
        
        summary.recommendations.push('🔄 Restart the application to ensure all data is properly loaded');
        summary.recommendations.push('🧹 Clear browser cache and cookies for fresh session start');
        summary.recommendations.push('🔑 Users can now log in with their original credentials');
        
        res.json(summary);
        
      } catch (error) {
        console.error('Restore failed:', error);
        
        // Clean up temp file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (cleanupError) {
            console.error('Failed to cleanup temp file:', cleanupError);
          }
        }
        
        res.status(500).json({ 
          success: false, 
          error: 'Restore failed: ' + (error.message || 'Unknown error') 
        });
      }
    });
  });
}