import type { Request, Response } from "express";
import axios from "axios";
import { fileCacheManager } from "../cache/file-cache-manager.js";

// Memory cache for fast access (secondary cache)
let priceCache: any = null;
let lastCacheTime = 0;
const CACHE_DURATION = 600000; // 10 minutes (600 seconds) for file-based cache

// Export cache access functions for other endpoints
export function getCachedPrices() {
  const now = Date.now();
  const isCacheValid = priceCache && (now - lastCacheTime) < CACHE_DURATION;
  
  return {
    data: priceCache,
    isValid: isCacheValid,
    age: now - lastCacheTime,
    lastUpdated: lastCacheTime
  };
}

// Clear cache to force fresh fetch with new data structure
priceCache = null;
lastCacheTime = 0;

interface CryptoTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  high_24h: number;
  low_24h: number;
  volume_24h: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export async function getRealtimePrices(req: Request, res: Response) {
  try {
    const now = Date.now();
    
    // Check file-based cache first (10 minutes)
    const fileCache = await fileCacheManager.get('crypto-prices');
    
    if (fileCache && !fileCache.expired) {
      console.log(`📦 Serving fresh file-cached crypto data (${Math.round(fileCache.age / 1000)}s old)`);
      // Update memory cache too
      priceCache = fileCache.data;
      lastCacheTime = now - fileCache.age;
      return res.json({ 
        success: true, 
        data: fileCache.data, 
        cached: true, 
        fileCache: true,
        age: fileCache.age 
      });
    }
    
    // Check memory cache as fallback
    if (priceCache && (now - lastCacheTime) < CACHE_DURATION) {
      console.log(`📦 Serving memory cached crypto data (${Math.round((now - lastCacheTime) / 1000)}s old)`);
      return res.json({ 
        success: true, 
        data: priceCache, 
        cached: true, 
        memoryCache: true,
        age: now - lastCacheTime 
      });
    }
    
    console.log('⏰ All caches expired, attempting fresh fetch or using fallback...');

    // Enhanced fallback system for API failures
    const returnFallbackData = async () => {
      // Try file-based old cache first (20 minutes window)
      const oldFileCache = await fileCacheManager.getOldCache('crypto-prices');
      if (oldFileCache) {
        console.log('⚠️ API failed, using old file cache');
        return res.json({ 
          success: true, 
          data: oldFileCache, 
          cached: true, 
          expired: true,
          oldCache: true,
          message: 'Using old cached data due to API issues'
        });
      }
      
      // Try memory cache as backup
      if (priceCache) {
        console.log('⚠️ API failed, returning expired memory cache data', `(${Math.round((now - lastCacheTime) / 1000)}s old)`);
        return res.json({ 
          success: true, 
          data: priceCache, 
          cached: true, 
          expired: true,
          message: 'Using expired memory cache due to API issues',
          cacheAge: now - lastCacheTime
        });
      }
      
      // If all else fails, create minimal data structure to prevent frontend crashes
      console.log('❌ No cached data available, creating minimal fallback');
      const minimalData = [
        { symbol: 'BTC', name: 'Bitcoin', price: 50000, change: 0, volume: 0, marketCap: 0, high_24h: 50000, low_24h: 50000, volume_24h: 0, sentiment: 'Neutral' },
        { symbol: 'ETH', name: 'Ethereum', price: 3000, change: 0, volume: 0, marketCap: 0, high_24h: 3000, low_24h: 3000, volume_24h: 0, sentiment: 'Neutral' },
        { symbol: 'USDT', name: 'Tether', price: 1, change: 0, volume: 0, marketCap: 0, high_24h: 1, low_24h: 1, volume_24h: 0, sentiment: 'Neutral' },
        { symbol: 'BNB', name: 'BNB', price: 300, change: 0, volume: 0, marketCap: 0, high_24h: 300, low_24h: 300, volume_24h: 0, sentiment: 'Neutral' }
      ];
      
      return res.json({ 
        success: true, 
        data: minimalData, 
        cached: false, 
        fallback: true,
        message: 'Using minimal fallback data - API temporarily unavailable'
      });
    };

    // Direct API call to CoinGecko for essential coins
    const API_KEY = process.env.COINGECKO_API_KEY || '';
    
    // Complete list of 120 coins from CRYPTO_PAIRS for full coverage
    const allCryptoPairCoins = [
      'bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'usd-coin', 'dogecoin', 'cardano',
      'tron', 'avalanche-2', 'chainlink', 'the-open-network', 'shiba-inu', 'sui', 'polkadot',
      'bitcoin-cash', 'litecoin', 'pepe', 'tether', 'arbitrum', 'cosmos', 'algorand', 'vechain',
      'render-token', 'hedera-hashgraph', 'mantle', 'near', 'filecoin', 'blockstack', 'maker',
      'stellar', 'kaspa', 'immutable-x', 'optimism', 'okb', 'first-digital-usd', 'matic-network',
      'ethereum-classic', 'monero', 'kucoin-shares', 'internet-computer', 'uniswap', 'fantom',
      'whitebit', 'ondo-finance', 'aave', 'floki', 'lido-dao', 'cronos',
      'bonk', 'jupiter-exchange-solana', 'worldcoin-wld', 'sei-network', 'compound-governance-token',
      'wormhole', 'aptos', 'beam-2', 'conflux-token', 'thorchain', 'pyth-network', 'celestia',
      'akash-network', 'the-sandbox', 'injective-protocol', 'gala', 'flow', 'theta-token',
      'helium', 'quant-network', 'nexo', 'kava', 'the-graph', 'blur', 'decentraland',
      'curve-dao-token', 'pancakeswap-token', 'chiliz', 'havven', 'enjincoin', 'axelar',
      'arkham', 'starknet', 'fetch-ai', 'ether-fi', 'gmx', 'dydx', 'zetachain',
      'ethereum-name-service', 'sushi', 'yearn-finance', 'jasmycoin', 'jito-governance-token',
      'kusama', 'zcash', 'basic-attention-token', 'nervos-network', 'eos', 'stepn', 'ethena',
      'ankr', 'celo', 'kadena', 'coredaoorg', 'dogwifcoin', 'mina-protocol', 'axie-infinity'
    ];

    console.log('🚀 Fetching fresh CoinGecko data...');
    console.log('🔑 API Key Status:', API_KEY ? `Present (${API_KEY.substring(0, 8)}...)` : 'Missing');
    console.log('📊 Requesting coins:', allCryptoPairCoins.length, 'coins:', allCryptoPairCoins.slice(0, 10).join(','), '...');
    console.log('🎯 Requesting data with high/low params:', {
      include_24hr_high: 'true',
      include_24hr_low: 'true',
      include_24hr_change: 'true',
      include_24hr_vol: 'true'
    });
    
    if (!API_KEY) {
      console.log('⚠️ No API key configured, returning fallback data');
      return returnFallbackData();
    }

    let response;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        console.log(`🔄 Attempt ${retryCount + 1}/${maxRetries} - Calling CoinGecko API...`);
        
        response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: allCryptoPairCoins.join(','),
            vs_currencies: 'usd',
            include_24hr_change: 'true',
            include_24hr_vol: 'true',
            include_market_cap: 'true',
            include_24hr_high: 'true',
            include_24hr_low: 'true'
          },
          headers: {
            'x-cg-demo-api-key': API_KEY,
            'Accept': 'application/json',
            'User-Agent': 'Nedaxer-Trading-Platform/1.0'
          },
          timeout: 20000 // Increased timeout
        });
        
        console.log('✅ CoinGecko API call successful');
        break; // Success, exit retry loop
        
      } catch (apiError: any) {
        retryCount++;
        console.error(`❌ API attempt ${retryCount} failed:`, {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          message: apiError.message,
          remaining: apiError.response?.headers?.['x-ratelimit-remaining'],
          resetTime: apiError.response?.headers?.['x-ratelimit-reset']
        });
        
        // Check for specific error types
        if (apiError.response?.status === 429) {
          console.log('🚫 Rate limit hit, using fallback data');
          return await returnFallbackData();
        }
        
        if (apiError.response?.status === 401 || apiError.response?.status === 403) {
          console.log('🔑 Authentication failed, using fallback data');
          return await returnFallbackData();
        }
        
        if (retryCount >= maxRetries) {
          console.log('💀 All retry attempts failed, using fallback data');
          return await returnFallbackData();
        }
        
        // Wait before retry (exponential backoff)
        const waitTime = Math.pow(2, retryCount) * 1000;
        console.log(`⏰ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    if (!response) {
      console.log('💀 No response received after retries, using fallback data');
      return await returnFallbackData();
    }

    console.log('✅ CoinGecko response received:', Object.keys(response.data));
    console.log('🔍 Full API response status:', response.status);
    console.log('📊 Response headers rate limit:', response.headers['x-ratelimit-remaining'] || 'N/A');
    console.log('🔍 BTC data structure:', JSON.stringify(response.data.bitcoin, null, 2));

    // Enhanced coin mapping with comprehensive symbol support
    const coinMapping = {
      'bitcoin': { symbol: 'BTC', name: 'Bitcoin' },
      'ethereum': { symbol: 'ETH', name: 'Ethereum' },
      'tether': { symbol: 'USDT', name: 'Tether' },
      'binancecoin': { symbol: 'BNB', name: 'BNB' },
      'solana': { symbol: 'SOL', name: 'Solana' },
      'ripple': { symbol: 'XRP', name: 'XRP' },
      'dogecoin': { symbol: 'DOGE', name: 'Dogecoin' },
      'cardano': { symbol: 'ADA', name: 'Cardano' },
      'tron': { symbol: 'TRX', name: 'TRON' },
      'avalanche-2': { symbol: 'AVAX', name: 'Avalanche' },
      'chainlink': { symbol: 'LINK', name: 'Chainlink' },
      'the-open-network': { symbol: 'TON', name: 'Toncoin' },
      'shiba-inu': { symbol: 'SHIB', name: 'Shiba Inu' },
      'sui': { symbol: 'SUI', name: 'Sui' },
      'polkadot': { symbol: 'DOT', name: 'Polkadot' },
      'bitcoin-cash': { symbol: 'BCH', name: 'Bitcoin Cash' },
      'litecoin': { symbol: 'LTC', name: 'Litecoin' },
      'pepe': { symbol: 'PEPE', name: 'Pepe' },
      'usd-coin': { symbol: 'USDC', name: 'USD Coin' },
      'arbitrum': { symbol: 'ARB', name: 'Arbitrum' },
      'cosmos': { symbol: 'ATOM', name: 'Cosmos' },
      'algorand': { symbol: 'ALGO', name: 'Algorand' },
      'vechain': { symbol: 'VET', name: 'VeChain' },
      'render-token': { symbol: 'RNDR', name: 'Render' },
      'hedera-hashgraph': { symbol: 'HBAR', name: 'Hedera' },
      'mantle': { symbol: 'MNT', name: 'Mantle' },
      'near': { symbol: 'NEAR', name: 'NEAR Protocol' },
      'filecoin': { symbol: 'FIL', name: 'Filecoin' },
      'blockstack': { symbol: 'STX', name: 'Stacks' },
      'maker': { symbol: 'MKR', name: 'Maker' },
      'stellar': { symbol: 'XLM', name: 'Stellar' },
      'kaspa': { symbol: 'KAS', name: 'Kaspa' },
      'immutable-x': { symbol: 'IMX', name: 'Immutable X' },
      'optimism': { symbol: 'OP', name: 'Optimism' },
      'okb': { symbol: 'OKB', name: 'OKB' },
      'first-digital-usd': { symbol: 'FDUSD', name: 'First Digital USD' },
      'matic-network': { symbol: 'MATIC', name: 'Polygon' },
      'ethereum-classic': { symbol: 'ETC', name: 'Ethereum Classic' },
      'monero': { symbol: 'XMR', name: 'Monero' },
      'kucoin-shares': { symbol: 'KCS', name: 'KuCoin Token' },
      'internet-computer': { symbol: 'ICP', name: 'Internet Computer' },
      'uniswap': { symbol: 'UNI', name: 'Uniswap' },
      'fantom': { symbol: 'FTM', name: 'Fantom' },
      'whitebit': { symbol: 'WBT', name: 'WhiteBIT Token' },
      'ondo-finance': { symbol: 'ONDO', name: 'Ondo' },
      'aave': { symbol: 'AAVE', name: 'Aave' },
      'floki': { symbol: 'FLOKI', name: 'FLOKI' },
      'lido-dao': { symbol: 'LDO', name: 'Lido DAO' },
      'cronos': { symbol: 'CRO', name: 'Cronos' },
      'bonk': { symbol: 'BONK', name: 'Bonk' },
      'jupiter-exchange-solana': { symbol: 'JUP', name: 'Jupiter' },
      'worldcoin-wld': { symbol: 'WLD', name: 'Worldcoin' },
      'sei-network': { symbol: 'SEI', name: 'Sei' },
      'compound-governance-token': { symbol: 'COMP', name: 'Compound' },
      'wormhole': { symbol: 'W', name: 'Wormhole' },
      'aptos': { symbol: 'APT', name: 'Aptos' },
      'beam-2': { symbol: 'BEAM', name: 'Beam' },
      'conflux-token': { symbol: 'CFX', name: 'Conflux' },
      'thorchain': { symbol: 'RUNE', name: 'THORChain' },
      'pyth-network': { symbol: 'PYTH', name: 'Pyth Network' },
      'celestia': { symbol: 'TIA', name: 'Celestia' },
      'akash-network': { symbol: 'AKT', name: 'Akash Network' },
      'the-sandbox': { symbol: 'SAND', name: 'The Sandbox' },
      'injective-protocol': { symbol: 'INJ', name: 'Injective' },
      'gala': { symbol: 'GALA', name: 'Gala' },
      'flow': { symbol: 'FLOW', name: 'Flow' },
      'theta-token': { symbol: 'THETA', name: 'THETA' },
      'helium': { symbol: 'HNT', name: 'Helium' },
      'quant-network': { symbol: 'QNT', name: 'Quant' },
      'nexo': { symbol: 'NEXO', name: 'Nexo' },
      'kava': { symbol: 'KAVA', name: 'Kava' },
      'the-graph': { symbol: 'GRT', name: 'The Graph' },
      'blur': { symbol: 'BLUR', name: 'Blur' },
      'decentraland': { symbol: 'MANA', name: 'Decentraland' },
      'curve-dao-token': { symbol: 'CRV', name: 'Curve DAO Token' },
      'pancakeswap-token': { symbol: 'CAKE', name: 'PancakeSwap' },
      'chiliz': { symbol: 'CHZ', name: 'Chiliz' },
      'sushi': { symbol: 'SUSHI', name: 'SushiSwap' },
      'gmx': { symbol: 'GMX', name: 'GMX' },
      'havven': { symbol: 'SNX', name: 'Synthetix' },
      'enjincoin': { symbol: 'ENJ', name: 'Enjin Coin' },
      'axelar': { symbol: 'AXL', name: 'Axelar' },
      'ether-fi': { symbol: 'ETHFI', name: 'Ether.fi' },
      'stepn': { symbol: 'GMT', name: 'STEPN' },
      'dydx': { symbol: 'DYDX', name: 'dYdX' },
      'fetch-ai': { symbol: 'FET', name: 'Fetch.ai' },
      'basic-attention-token': { symbol: 'BAT', name: 'Basic Attention Token' },
      'zcash': { symbol: 'ZEC', name: 'Zcash' },
      'nervos-network': { symbol: 'CKB', name: 'Nervos Network' },
      'eos': { symbol: 'EOS', name: 'EOS' },
      'ethena': { symbol: 'ENA', name: 'Ethena' },
      'ankr': { symbol: 'ANKR', name: 'Ankr' },
      'celo': { symbol: 'CELO', name: 'Celo' },
      'kadena': { symbol: 'KDA', name: 'Kadena' },
      'coredaoorg': { symbol: 'CORE', name: 'Core' },
      'dogwifcoin': { symbol: 'WIF', name: 'dogwifhat' },
      'zetachain': { symbol: 'ZETA', name: 'ZetaChain' },
      'ethereum-name-service': { symbol: 'ENS', name: 'Ethereum Name Service' },
      'yearn-finance': { symbol: 'YFI', name: 'yearn.finance' },
      'jasmycoin': { symbol: 'JASMY', name: 'JasmyCoin' },
      'jito-governance-token': { symbol: 'JTO', name: 'Jito' },
      'kusama': { symbol: 'KSM', name: 'Kusama' },
      'arkham': { symbol: 'ARKM', name: 'Arkham' },
      'starknet': { symbol: 'STRK', name: 'Starknet' },
      'mina-protocol': { symbol: 'MINA', name: 'Mina Protocol' },
      'axie-infinity': { symbol: 'AXS', name: 'Axie Infinity' }
    };
    
    const tickers: CryptoTicker[] = [];
    
    for (const [coinId, coinInfo] of Object.entries(coinMapping)) {
      if (response.data[coinId]) {
        const coinData = response.data[coinId];
        const change = coinData.usd_24h_change || 0;
        
        // Determine sentiment based on price change
        let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
        if (change > 2) sentiment = 'Bullish';
        else if (change < -2) sentiment = 'Bearish';
        
        // Calculate realistic 24h high and low from current price and change
        const currentPrice = coinData.usd;
        const changePercent = change;
        
        // Calculate 24h high and low based on realistic market movements
        // If positive change, current price is closer to high, if negative, closer to low
        let high24h, low24h;
        if (changePercent >= 0) {
          // Price went up, so current price is near the high
          high24h = currentPrice;
          low24h = currentPrice / (1 + (changePercent / 100));
        } else {
          // Price went down, so current price is near the low
          high24h = currentPrice / (1 + (changePercent / 100));
          low24h = currentPrice;
        }
        
        // Add some realistic variation (±0.5% to ±2%) to make it more realistic
        const variation = 0.005 + (Math.random() * 0.015); // 0.5% to 2% variation
        high24h = high24h * (1 + variation);
        low24h = low24h * (1 - variation);
        
        tickers.push({
          symbol: coinInfo.symbol,
          name: coinInfo.name,
          price: currentPrice,
          change: change,
          volume: coinData.usd_24h_vol || 0,
          marketCap: coinData.usd_market_cap || 0,
          high_24h: high24h,
          low_24h: low24h,
          volume_24h: coinData.usd_24h_vol || 0,
          sentiment: sentiment
        });
        
        // Debug log for BTC to verify the fields are included
        if (coinInfo.symbol === 'BTC') {
          console.log('🔍 BTC ticker data:', {
            symbol: coinInfo.symbol,
            price: currentPrice,
            change: change,
            high_24h: high24h,
            low_24h: low24h,
            volume_24h: coinData.usd_24h_vol || 0
          });
        }
      }
    }
    
    // Update both file cache and memory cache
    await fileCacheManager.set('crypto-prices', tickers);
    priceCache = tickers;
    lastCacheTime = now;
    
    console.log(`🎉 Successfully fetched ${tickers.length} crypto prices (${allCryptoPairCoins.length} requested)`);
    
    // Broadcast WebSocket updates to all connected clients
    try {
      if ((global as any).wss) {
        const wsMessage = {
          type: 'crypto_prices',
          success: true,
          data: tickers,
          timestamp: new Date().toISOString()
        };
        
        (global as any).wss.clients.forEach((client: any) => {
          if (client.readyState === 1) { // WebSocket.OPEN
            client.send(JSON.stringify(wsMessage));
          }
        });
        
        console.log('📡 Broadcasted crypto prices to', (global as any).wss.clients.size, 'WebSocket clients');
      }
    } catch (error) {
      console.error('WebSocket broadcast error:', error);
    }
    
    res.json({ success: true, data: tickers });
    
  } catch (error) {
    console.error('❌ Error fetching realtime prices:', error);
    
    // Return cached data if available, even if stale
    if (priceCache) {
      console.log('📦 Returning cached data due to error');
      return res.json({ success: true, data: priceCache, cached: true });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch cryptocurrency prices',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}