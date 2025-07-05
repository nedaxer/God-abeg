import type { Request, Response } from "express";
import axios from "axios";

let priceCache: any = null;
let lastCacheTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

interface CryptoTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export async function getRealtimePrices(req: Request, res: Response) {
  try {
    const now = Date.now();
    
    // Force clear cache for testing
    priceCache = null;
    lastCacheTime = 0;
    
    // Use cache if available and fresh
    if (priceCache && (now - lastCacheTime) < CACHE_DURATION) {
      return res.json({ success: true, data: priceCache });
    }

    // Direct API call to CoinGecko for essential coins
    const API_KEY = process.env.COINGECKO_API_KEY || '';
    
    // Complete list of coins from CRYPTO_PAIRS for full coverage
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
    console.log('🔑 Using API key:', API_KEY ? 'Present' : 'Missing');
    console.log('📊 Requesting coins:', allCryptoPairCoins.length, 'coins:', allCryptoPairCoins.slice(0, 10).join(','), '...');
    
    if (!API_KEY) {
      throw new Error('CoinGecko API key not configured');
    }

    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: allCryptoPairCoins.join(','),
        vs_currencies: 'usd',
        include_24hr_change: 'true',
        include_24hr_vol: 'true',
        include_market_cap: 'true'
      },
      headers: {
        'x-cg-demo-api-key': API_KEY,
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    console.log('✅ CoinGecko response received:', Object.keys(response.data));
    console.log('🔍 Full API response status:', response.status);
    console.log('📊 Response headers rate limit:', response.headers['x-ratelimit-remaining'] || 'N/A');

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
        
        tickers.push({
          symbol: coinInfo.symbol,
          name: coinInfo.name,
          price: coinData.usd,
          change: change,
          volume: coinData.usd_24h_vol || 0,
          marketCap: coinData.usd_market_cap || 0,
          sentiment: sentiment
        });
      }
    }
    
    // Update cache
    priceCache = tickers;
    lastCacheTime = now;
    
    console.log(`🎉 Successfully fetched ${tickers.length} crypto prices (${allCryptoPairCoins.length} requested)`);
    
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