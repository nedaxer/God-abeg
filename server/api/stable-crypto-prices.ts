import type { Request, Response } from "express";
import axios from "axios";

// Enhanced caching system for stable price delivery
interface CachedPriceData {
  data: CryptoPrice[];
  timestamp: number;
  isStale: boolean;
}

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

let stableCache: CachedPriceData | null = null;
const CACHE_DURATION = 45000; // 45 seconds - longer for stability
const STALE_THRESHOLD = 30000; // Consider stale after 30 seconds but still serve

// Comprehensive coin mapping with all supported cryptocurrencies
const STABLE_COIN_MAPPING = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH', 
  'tether': 'USDT',
  'binancecoin': 'BNB',
  'solana': 'SOL',
  'ripple': 'XRP',
  'dogecoin': 'DOGE',
  'cardano': 'ADA',
  'tron': 'TRX',
  'avalanche-2': 'AVAX',
  'chainlink': 'LINK',
  'the-open-network': 'TON',
  'shiba-inu': 'SHIB',
  'sui': 'SUI',
  'polkadot': 'DOT',
  'bitcoin-cash': 'BCH',
  'litecoin': 'LTC',
  'pepe': 'PEPE',
  'usd-coin': 'USDC',
  'arbitrum': 'ARB',
  'cosmos': 'ATOM',
  'algorand': 'ALGO',
  'vechain': 'VET',
  'render-token': 'RNDR',
  'hedera-hashgraph': 'HBAR',
  'mantle': 'MNT',
  'near': 'NEAR',
  'filecoin': 'FIL',
  'blockstack': 'STX',
  'maker': 'MKR',
  'stellar': 'XLM',
  'kaspa': 'KAS',
  'immutable-x': 'IMX',
  'optimism': 'OP',
  'okb': 'OKB',
  'first-digital-usd': 'FDUSD',
  'matic-network': 'MATIC',
  'ethereum-classic': 'ETC',
  'monero': 'XMR',
  'kucoin-shares': 'KCS',
  'internet-computer': 'ICP',
  'uniswap': 'UNI',
  'fantom': 'FTM',
  'whitebit': 'WBT',
  'ondo-finance': 'ONDO',
  'aave': 'AAVE',
  'floki': 'FLOKI',
  'lido-dao': 'LDO',
  'cronos': 'CRO',
  'bonk': 'BONK',
  'jupiter-exchange-solana': 'JUP',
  'worldcoin-wld': 'WLD',
  'sei-network': 'SEI',
  'compound-governance-token': 'COMP',
  'wormhole': 'W',
  'aptos': 'APT',
  'beam-2': 'BEAM',
  'conflux-token': 'CFX',
  'thorchain': 'RUNE',
  'pyth-network': 'PYTH',
  'celestia': 'TIA',
  'akash-network': 'AKT',
  'the-sandbox': 'SAND',
  'injective-protocol': 'INJ',
  'gala': 'GALA',
  'flow': 'FLOW',
  'theta-token': 'THETA',
  'helium': 'HNT',
  'quant-network': 'QNT',
  'nexo': 'NEXO',
  'kava': 'KAVA',
  'the-graph': 'GRT',
  'blur': 'BLUR',
  'decentraland': 'MANA',
  'curve-dao-token': 'CRV',
  'pancakeswap-token': 'CAKE',
  'chiliz': 'CHZ',
  'sushi': 'SUSHI',
  'gmx': 'GMX',
  'flare-networks': 'FLR',
  'axie-infinity': 'AXS',
  'havven': 'SNX',
  'mask-network': 'MASK',
  'livepeer': 'LPT',
  'trust-wallet-token': 'TWT',
  'enjincoin': 'ENJ',
  'frax-share': 'FXS',
  'stepn': 'GMT',
  'ocean-protocol': 'OCEAN',
  'dydx': 'DYDX',
  'loopring': 'LRC',
  'fetch-ai': 'FET',
  'singularitynet': 'AGIX',
  'basic-attention-token': 'BAT',
  'zcash': 'ZEC',
  'dash': 'DASH',
  'nervos-network': 'CKB',
  'eos': 'EOS',
  'ethena': 'ENA',
  'ankr': 'ANKR',
  'celo': 'CELO',
  'kadena': 'KDA',
  'coredaoorg': 'CORE',
  'dogwifcoin': 'WIF',
  'mina-protocol': 'MINA',
  'arkham': 'ARKM',
  'starknet': 'STRK',
  'axelar': 'AXL',
  'ether-fi': 'ETHFI',
  'zetachain': 'ZETA',
  'ethereum-name-service': 'ENS',
  'yearn-finance': 'YFI',
  'jasmycoin': 'JASMY',
  'jito-governance-token': 'JTO'
};

async function fetchStablePrices(): Promise<CryptoPrice[]> {
  try {
    const API_KEY = process.env.COINGECKO_API_KEY;
    const coinIds = Object.keys(STABLE_COIN_MAPPING).join(',');
    
    console.log('🔄 Fetching stable crypto prices...');
    
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: coinIds,
        vs_currencies: 'usd',
        include_24hr_change: 'true',
        include_24hr_vol: 'true',
        include_market_cap: 'true'
      },
      headers: API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {},
      timeout: 10000
    });

    const prices: CryptoPrice[] = [];
    
    Object.entries(STABLE_COIN_MAPPING).forEach(([coinId, symbol]) => {
      const coinData = response.data[coinId];
      if (coinData) {
        const change = coinData.usd_24h_change || 0;
        let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
        if (change > 2) sentiment = 'Bullish';
        else if (change < -2) sentiment = 'Bearish';
        
        prices.push({
          symbol,
          name: symbol, // Use symbol as name for consistency
          price: coinData.usd || 0,
          change: change,
          volume: coinData.usd_24h_vol || 0,
          marketCap: coinData.usd_market_cap || 0,
          sentiment
        });
      }
    });
    
    console.log(`✅ Fetched ${prices.length} stable crypto prices`);
    return prices;
    
  } catch (error) {
    console.error('❌ Error fetching stable prices:', error);
    throw error;
  }
}

export async function getStableCryptoPrices(req: Request, res: Response) {
  try {
    const now = Date.now();
    
    // Return fresh cache if available and not stale
    if (stableCache && (now - stableCache.timestamp) < STALE_THRESHOLD) {
      return res.json({ 
        success: true, 
        data: stableCache.data, 
        cached: true,
        timestamp: stableCache.timestamp
      });
    }
    
    // If cache exists but is stale, serve it while fetching new data in background
    if (stableCache && (now - stableCache.timestamp) < CACHE_DURATION) {
      // Serve stale cache immediately
      res.json({ 
        success: true, 
        data: stableCache.data, 
        cached: true,
        stale: true,
        timestamp: stableCache.timestamp
      });
      
      // Fetch fresh data in background (don't await)
      fetchStablePrices().then(freshData => {
        stableCache = {
          data: freshData,
          timestamp: Date.now(),
          isStale: false
        };
      }).catch(err => {
        console.error('Background fetch failed:', err);
      });
      
      return;
    }
    
    // Fetch fresh data
    const freshData = await fetchStablePrices();
    
    // Update cache
    stableCache = {
      data: freshData,
      timestamp: now,
      isStale: false
    };
    
    res.json({ 
      success: true, 
      data: freshData, 
      cached: false,
      timestamp: now
    });
    
  } catch (error) {
    console.error('❌ Stable prices API error:', error);
    
    // Return stale cache if available during errors
    if (stableCache) {
      console.log('📦 Returning stale cache due to error');
      return res.json({ 
        success: true, 
        data: stableCache.data, 
        cached: true,
        stale: true,
        error: 'Fresh data unavailable'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch cryptocurrency prices',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}