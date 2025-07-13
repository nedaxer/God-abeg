import axios from 'axios';
import { fileCacheManager } from '../cache/file-cache-manager.js';

// Complete list of all 107+ cryptocurrencies matching the realtime-prices API
async function getAllCryptoPairCoins(): Promise<string[]> {
  // Use the same comprehensive list as the realtime-prices API for consistency
  return [
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
}

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

export class ProactivePriceFetcher {
  private isRunning = false;
  private retryInterval = 30000; // Start with 30 seconds
  private maxRetryInterval = 300000; // Max 5 minutes
  private fetchAttempts = 0;
  private lastSuccessfulFetch = 0;
  private fetchTimer: NodeJS.Timeout | null = null;
  private readonly FORCE_FETCH_INTERVAL = 9 * 60 * 1000; // 9 minutes - before cache expires

  constructor() {
    this.startProactiveFetching();
    this.startCacheCleanup();
  }

  private startProactiveFetching(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Starting proactive crypto price fetching...');
    
    // Initial fetch
    this.forceFetch();
    
    // Set up regular force fetching (9 minutes to stay ahead of cache expiry)
    setInterval(() => {
      console.log('⏰ Scheduled proactive fetch triggered');
      this.forceFetch();
    }, this.FORCE_FETCH_INTERVAL);
  }

  private startCacheCleanup(): void {
    // Clean expired cache every hour
    setInterval(async () => {
      console.log('🧹 Running cache cleanup...');
      await fileCacheManager.clearExpiredCache();
    }, 60 * 60 * 1000); // 1 hour
  }

  async forceFetch(): Promise<void> {
    try {
      console.log(`🎯 Force fetch attempt #${this.fetchAttempts + 1}`);
      
      const data = await this.fetchCryptoPrices();
      if (data && data.length > 0) {
        // Save to file cache
        await fileCacheManager.set('crypto-prices', data);
        
        // Reset retry interval on success
        this.retryInterval = 30000;
        this.fetchAttempts = 0;
        this.lastSuccessfulFetch = Date.now();
        
        console.log(`✅ Proactive fetch successful: ${data.length} coins cached`);
        
        // Broadcast to WebSocket clients if available
        this.broadcastToClients(data);
        
        return;
      }
    } catch (error) {
      console.error('❌ Force fetch failed:', error);
    }

    // Handle retry on failure
    this.fetchAttempts++;
    this.scheduleRetry();
  }

  private scheduleRetry(): void {
    if (this.fetchTimer) {
      clearTimeout(this.fetchTimer);
    }

    // Exponential backoff with max limit
    this.retryInterval = Math.min(this.retryInterval * 1.5, this.maxRetryInterval);
    
    console.log(`⏰ Scheduling retry in ${this.retryInterval / 1000}s (attempt ${this.fetchAttempts})`);
    
    this.fetchTimer = setTimeout(() => {
      this.forceFetch();
    }, this.retryInterval);
  }

  private async fetchCryptoPrices(): Promise<CryptoTicker[] | null> {
    const API_KEY = process.env.COINGECKO_API_KEY;
    if (!API_KEY) {
      console.log('⚠️ No API key available for proactive fetch');
      return null;
    }

    const allCryptoPairCoins = await getAllCryptoPairCoins();
    
    try {
      console.log(`📡 Proactive API call to CoinGecko (${allCryptoPairCoins.length} coins)...`);
      
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
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
        timeout: 25000
      });

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }

      const apiData = response.data;
      const tickers: CryptoTicker[] = [];

      // Complete comprehensive crypto pairs mapping for all 106 coins
      const cryptoPairs = [
        { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin' },
        { symbol: 'ETH', name: 'Ethereum', id: 'ethereum' },
        { symbol: 'SOL', name: 'Solana', id: 'solana' },
        { symbol: 'BNB', name: 'BNB', id: 'binancecoin' },
        { symbol: 'XRP', name: 'XRP', id: 'ripple' },
        { symbol: 'USDC', name: 'USD Coin', id: 'usd-coin' },
        { symbol: 'DOGE', name: 'Dogecoin', id: 'dogecoin' },
        { symbol: 'ADA', name: 'Cardano', id: 'cardano' },
        { symbol: 'TRX', name: 'TRON', id: 'tron' },
        { symbol: 'AVAX', name: 'Avalanche', id: 'avalanche-2' },
        { symbol: 'LINK', name: 'Chainlink', id: 'chainlink' },
        { symbol: 'TON', name: 'Toncoin', id: 'the-open-network' },
        { symbol: 'SHIB', name: 'Shiba Inu', id: 'shiba-inu' },
        { symbol: 'SUI', name: 'Sui', id: 'sui' },
        { symbol: 'DOT', name: 'Polkadot', id: 'polkadot' },
        { symbol: 'BCH', name: 'Bitcoin Cash', id: 'bitcoin-cash' },
        { symbol: 'LTC', name: 'Litecoin', id: 'litecoin' },
        { symbol: 'PEPE', name: 'Pepe', id: 'pepe' },
        { symbol: 'USDT', name: 'Tether', id: 'tether' },
        { symbol: 'ARB', name: 'Arbitrum', id: 'arbitrum' },
        { symbol: 'ATOM', name: 'Cosmos', id: 'cosmos' },
        { symbol: 'ALGO', name: 'Algorand', id: 'algorand' },
        { symbol: 'VET', name: 'VeChain', id: 'vechain' },
        { symbol: 'RNDR', name: 'Render Token', id: 'render-token' },
        { symbol: 'HBAR', name: 'Hedera', id: 'hedera-hashgraph' },
        { symbol: 'MNT', name: 'Mantle', id: 'mantle' },
        { symbol: 'NEAR', name: 'NEAR Protocol', id: 'near' },
        { symbol: 'FIL', name: 'Filecoin', id: 'filecoin' },
        { symbol: 'STX', name: 'Stacks', id: 'blockstack' },
        { symbol: 'MKR', name: 'Maker', id: 'maker' },
        { symbol: 'XLM', name: 'Stellar', id: 'stellar' },
        { symbol: 'KAS', name: 'Kaspa', id: 'kaspa' },
        { symbol: 'IMX', name: 'Immutable X', id: 'immutable-x' },
        { symbol: 'OP', name: 'Optimism', id: 'optimism' },
        { symbol: 'OKB', name: 'OKB', id: 'okb' },
        { symbol: 'FDUSD', name: 'First Digital USD', id: 'first-digital-usd' },
        { symbol: 'MATIC', name: 'Polygon', id: 'matic-network' },
        { symbol: 'ETC', name: 'Ethereum Classic', id: 'ethereum-classic' },
        { symbol: 'XMR', name: 'Monero', id: 'monero' },
        { symbol: 'KCS', name: 'KuCoin Shares', id: 'kucoin-shares' },
        { symbol: 'ICP', name: 'Internet Computer', id: 'internet-computer' },
        { symbol: 'UNI', name: 'Uniswap', id: 'uniswap' },
        { symbol: 'FTM', name: 'Fantom', id: 'fantom' },
        { symbol: 'WBT', name: 'WhiteBIT Coin', id: 'whitebit' },
        { symbol: 'ONDO', name: 'Ondo Finance', id: 'ondo-finance' },
        { symbol: 'AAVE', name: 'Aave', id: 'aave' },
        { symbol: 'FLOKI', name: 'FLOKI', id: 'floki' },
        { symbol: 'LDO', name: 'Lido DAO', id: 'lido-dao' },
        { symbol: 'CRO', name: 'Cronos', id: 'cronos' },
        { symbol: 'BONK', name: 'Bonk', id: 'bonk' },
        { symbol: 'JUP', name: 'Jupiter', id: 'jupiter-exchange-solana' },
        { symbol: 'WLD', name: 'Worldcoin', id: 'worldcoin-wld' },
        { symbol: 'SEI', name: 'Sei', id: 'sei-network' },
        { symbol: 'COMP', name: 'Compound', id: 'compound-governance-token' },
        { symbol: 'W', name: 'Wormhole', id: 'wormhole' },
        { symbol: 'APT', name: 'Aptos', id: 'aptos' },
        { symbol: 'BEAM', name: 'Beam', id: 'beam-2' },
        { symbol: 'CFX', name: 'Conflux', id: 'conflux-token' },
        { symbol: 'RUNE', name: 'THORChain', id: 'thorchain' },
        { symbol: 'PYTH', name: 'Pyth Network', id: 'pyth-network' },
        { symbol: 'TIA', name: 'Celestia', id: 'celestia' },
        { symbol: 'AKT', name: 'Akash Network', id: 'akash-network' },
        { symbol: 'SAND', name: 'The Sandbox', id: 'the-sandbox' },
        { symbol: 'INJ', name: 'Injective', id: 'injective-protocol' },
        { symbol: 'GALA', name: 'Gala', id: 'gala' },
        { symbol: 'FLOW', name: 'Flow', id: 'flow' },
        { symbol: 'THETA', name: 'THETA', id: 'theta-token' },
        { symbol: 'HNT', name: 'Helium', id: 'helium' },
        { symbol: 'QNT', name: 'Quant', id: 'quant-network' },
        { symbol: 'NEXO', name: 'Nexo', id: 'nexo' },
        { symbol: 'KAVA', name: 'Kava', id: 'kava' },
        { symbol: 'GRT', name: 'The Graph', id: 'the-graph' },
        { symbol: 'BLUR', name: 'Blur', id: 'blur' },
        { symbol: 'MANA', name: 'Decentraland', id: 'decentraland' },
        { symbol: 'CRV', name: 'Curve DAO Token', id: 'curve-dao-token' },
        { symbol: 'CAKE', name: 'PancakeSwap', id: 'pancakeswap-token' },
        { symbol: 'CHZ', name: 'Chiliz', id: 'chiliz' },
        { symbol: 'SNX', name: 'Synthetix', id: 'havven' },
        { symbol: 'ENJ', name: 'Enjin Coin', id: 'enjincoin' },
        { symbol: 'AXL', name: 'Axelar', id: 'axelar' },
        { symbol: 'ARKM', name: 'Arkham', id: 'arkham' },
        { symbol: 'STRK', name: 'Starknet', id: 'starknet' },
        { symbol: 'FET', name: 'Fetch.ai', id: 'fetch-ai' },
        { symbol: 'ETHFI', name: 'Ether.fi', id: 'ether-fi' },
        { symbol: 'GMX', name: 'GMX', id: 'gmx' },
        { symbol: 'DYDX', name: 'dYdX', id: 'dydx' },
        { symbol: 'ZETA', name: 'ZetaChain', id: 'zetachain' },
        { symbol: 'ENS', name: 'Ethereum Name Service', id: 'ethereum-name-service' },
        { symbol: 'SUSHI', name: 'SushiSwap', id: 'sushi' },
        { symbol: 'YFI', name: 'yearn.finance', id: 'yearn-finance' },
        { symbol: 'JASMY', name: 'JasmyCoin', id: 'jasmycoin' },
        { symbol: 'JTO', name: 'Jito', id: 'jito-governance-token' },
        { symbol: 'KSM', name: 'Kusama', id: 'kusama' },
        { symbol: 'ZEC', name: 'Zcash', id: 'zcash' },
        { symbol: 'BAT', name: 'Basic Attention Token', id: 'basic-attention-token' },
        { symbol: 'CKB', name: 'Nervos Network', id: 'nervos-network' },
        { symbol: 'EOS', name: 'EOS', id: 'eos' },
        { symbol: 'GMT', name: 'STEPN', id: 'stepn' },
        { symbol: 'ENA', name: 'Ethena', id: 'ethena' },
        { symbol: 'ANKR', name: 'Ankr', id: 'ankr' },
        { symbol: 'CELO', name: 'Celo', id: 'celo' },
        { symbol: 'KDA', name: 'Kadena', id: 'kadena' },
        { symbol: 'CORE', name: 'Core', id: 'coredaoorg' },
        { symbol: 'WIF', name: 'dogwifhat', id: 'dogwifcoin' },
        { symbol: 'MINA', name: 'Mina', id: 'mina-protocol' },
        { symbol: 'AXS', name: 'Axie Infinity', id: 'axie-infinity' }
      ];
      
      for (const coinInfo of cryptoPairs) {
        const coinData = apiData[coinInfo.id];
        if (coinData && coinData.usd) {
          const change = coinData.usd_24h_change || 0;
          
          let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
          if (change > 2) sentiment = 'Bullish';
          else if (change < -2) sentiment = 'Bearish';
          
          const currentPrice = coinData.usd;
          const changePercent = change;
          
          let high24h, low24h;
          if (changePercent >= 0) {
            high24h = currentPrice;
            low24h = currentPrice / (1 + (changePercent / 100));
          } else {
            high24h = currentPrice / (1 + (changePercent / 100));
            low24h = currentPrice;
          }
          
          const variation = 0.005 + (Math.random() * 0.015);
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
        }
      }

      console.log(`🎉 Proactive fetch successful: ${tickers.length} prices processed`);
      return tickers;

    } catch (error: any) {
      console.error('❌ Proactive fetch API error:', {
        status: error.response?.status,
        message: error.message,
        remaining: error.response?.headers?.['x-ratelimit-remaining']
      });
      return null;
    }
  }

  private broadcastToClients(data: CryptoTicker[]): void {
    try {
      if ((global as any).wss) {
        const wsMessage = {
          type: 'crypto_prices',
          success: true,
          data: data,
          timestamp: new Date().toISOString(),
          proactive: true
        };
        
        (global as any).wss.clients.forEach((client: any) => {
          if (client.readyState === 1) { // WebSocket.OPEN
            client.send(JSON.stringify(wsMessage));
          }
        });
        
        console.log(`📡 Proactive data broadcasted to ${(global as any).wss.clients.size} WebSocket clients`);
      }
    } catch (error) {
      console.error('❌ Broadcast error:', error);
    }
  }

  getStatus(): any {
    return {
      isRunning: this.isRunning,
      fetchAttempts: this.fetchAttempts,
      lastSuccessfulFetch: this.lastSuccessfulFetch,
      retryInterval: this.retryInterval,
      nextFetch: this.fetchTimer ? 'scheduled' : 'none'
    };
  }
}

// Singleton instance
export const proactiveFetcher = new ProactivePriceFetcher();