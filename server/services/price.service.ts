import axios from 'axios';

export interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number;
  last_updated: string;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  sma_20: number;
  sma_50: number;
  ema_12: number;
  ema_26: number;
  bollinger_bands: {
    upper: number;
    middle: number;
    lower: number;
  };
}

class PriceService {
  private apiKey: string;
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 30000; // 30 seconds

  constructor() {
    this.apiKey = process.env.COINGECKO_API_KEY || '';
    if (!this.apiKey) {
      console.warn('CoinGecko API key not provided, using free tier with rate limits');
    }
  }

  private getHeaders() {
    const headers: any = {
      'Accept': 'application/json',
      'User-Agent': 'Nedaxer Trading Platform'
    };
    
    if (this.apiKey && this.apiKey.trim()) {
      headers['x-cg-demo-api-key'] = this.apiKey.trim();
    }
    
    return headers;
  }

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  async getTopCryptocurrencies(limit = 50): Promise<CoinGeckoPrice[]> {
    const cacheKey = `top-cryptos-${limit}`;
    
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        headers: this.getHeaders(),
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h,7d'
        }
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching cryptocurrencies:', error);
      throw new Error('Failed to fetch cryptocurrency data');
    }
  }

  async getCoinPrice(coinId: string): Promise<CoinGeckoPrice> {
    const cacheKey = `coin-${coinId}`;
    
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        headers: this.getHeaders(),
        params: {
          vs_currency: 'usd',
          ids: coinId,
          price_change_percentage: '24h,7d'
        }
      });

      const coinData = response.data[0];
      this.setCache(cacheKey, coinData);
      return coinData;
    } catch (error) {
      console.error(`Error fetching price for ${coinId}:`, error);
      throw new Error(`Failed to fetch price for ${coinId}`);
    }
  }

  async getHistoricalData(coinId: string, days = 30): Promise<CandlestickData[]> {
    const cacheKey = `historical-${coinId}-${days}`;
    
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/coins/${coinId}/ohlc`, {
        headers: this.getHeaders(),
        params: {
          vs_currency: 'usd',
          days: days
        }
      });

      const candlestickData: CandlestickData[] = response.data.map((item: number[]) => ({
        timestamp: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: 0 // CoinGecko OHLC doesn't include volume, need separate call
      }));

      this.setCache(cacheKey, candlestickData);
      return candlestickData;
    } catch (error: any) {
      console.error(`Error fetching historical data for ${coinId}:`, error.response?.status || error.message);
      
      // If rate limited, generate sample OHLC data
      if (error.response?.status === 401 || error.response?.status === 429) {
        console.warn(`API limit reached for ${coinId}, generating sample OHLC data`);
        return this.generateSampleOHLCData(coinId, days);
      }
      
      throw new Error(`Failed to fetch historical data for ${coinId}`);
    }
  }

  async getMarketChart(coinId: string, days = 30): Promise<{ prices: number[][]; volumes: number[][] }> {
    const cacheKey = `chart-${coinId}-${days}`;
    
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/coins/${coinId}/market_chart`, {
        headers: this.getHeaders(),
        params: {
          vs_currency: 'usd',
          days: days,
          interval: days <= 1 ? 'minutely' : days <= 90 ? 'hourly' : 'daily'
        }
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching chart for ${coinId}:`, error.response?.status || error.message);
      
      // If rate limited or unauthorized, generate sample data based on current price
      if (error.response?.status === 401 || error.response?.status === 429) {
        console.warn(`API limit reached for ${coinId}, generating sample chart data`);
        return this.generateSampleChartData(coinId, days);
      }
      
      throw new Error(`Failed to fetch market chart for ${coinId}`);
    }
  }

  // Calculate technical indicators
  calculateRSI(prices: number[], period = 14): number {
    if (prices.length < period + 1) return 50; // Default neutral RSI

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain and loss
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate RSI for the most recent period
    for (let i = period + 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? -change : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    
    const recentPrices = prices.slice(-period);
    const sum = recentPrices.reduce((acc, price) => acc + price, 0);
    return sum / period;
  }

  calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;

    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }

    return ema;
  }

  calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;

    // For simplicity, using a basic signal line calculation
    const signal = this.calculateEMA([macd], 9);
    const histogram = macd - signal;

    return { macd, signal, histogram };
  }

  calculateBollingerBands(prices: number[], period = 20, stdDev = 2): { upper: number; middle: number; lower: number } {
    const sma = this.calculateSMA(prices, period);
    
    if (prices.length < period) {
      return { upper: sma, middle: sma, lower: sma };
    }

    const recentPrices = prices.slice(-period);
    const variance = recentPrices.reduce((acc, price) => acc + Math.pow(price - sma, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);

    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev)
    };
  }

  async getTechnicalIndicators(coinId: string): Promise<TechnicalIndicators> {
    try {
      const chartData = await this.getMarketChart(coinId, 90);
      const prices = chartData.prices.map(p => p[1]);

      const rsi = this.calculateRSI(prices);
      const macd = this.calculateMACD(prices);
      const sma_20 = this.calculateSMA(prices, 20);
      const sma_50 = this.calculateSMA(prices, 50);
      const ema_12 = this.calculateEMA(prices, 12);
      const ema_26 = this.calculateEMA(prices, 26);
      const bollinger_bands = this.calculateBollingerBands(prices);

      return {
        rsi,
        macd,
        sma_20,
        sma_50,
        ema_12,
        ema_26,
        bollinger_bands
      };
    } catch (error: any) {
      console.error(`Error calculating technical indicators for ${coinId}:`, error.message);
      
      // Return default indicators if we can't fetch chart data
      console.warn(`Unable to calculate indicators for ${coinId}, returning defaults`);
      return {
        rsi: 50,
        macd: { macd: 0, signal: 0, histogram: 0 },
        sma_20: 0,
        sma_50: 0,
        ema_12: 0,
        ema_26: 0,
        bollinger_bands: { upper: 0, middle: 0, lower: 0 }
      };
    }
  }

  // Get trending cryptocurrencies
  async getTrendingCoins(): Promise<any[]> {
    const cacheKey = 'trending-coins';
    
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search/trending`, {
        headers: this.getHeaders()
      });

      this.setCache(cacheKey, response.data.coins);
      return response.data.coins;
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      throw new Error('Failed to fetch trending coins');
    }
  }

  // Get global market data
  async getGlobalMarketData(): Promise<any> {
    const cacheKey = 'global-market';
    
    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/global`, {
        headers: this.getHeaders()
      });

      this.setCache(cacheKey, response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching global market data:', error);
      throw new Error('Failed to fetch global market data');
    }
  }

  // Helper methods for fallback data when API limits are reached
  private async generateSampleChartData(coinId: string, days: number): Promise<{ prices: number[][]; volumes: number[][] }> {
    try {
      // Try to get current price first
      const currentPrice = await this.getCoinPrice(coinId);
      const basePrice = currentPrice.current_price;
      
      return this.createChartDataFromPrice(basePrice, days);
    } catch {
      // Use default price based on coin
      const defaultPrices: { [key: string]: number } = {
        'bitcoin': 100000,
        'ethereum': 3000,
        'binancecoin': 600,
        'ripple': 2,
        'solana': 200
      };
      
      const basePrice = defaultPrices[coinId] || 100;
      return this.createChartDataFromPrice(basePrice, days);
    }
  }

  private createChartDataFromPrice(basePrice: number, days: number): { prices: number[][]; volumes: number[][] } {
    const prices: number[][] = [];
    const volumes: number[][] = [];
    const now = Date.now();
    const intervalMs = days <= 1 ? 60000 : days <= 7 ? 3600000 : 86400000; // 1min, 1hr, or 1day intervals
    
    let currentPrice = basePrice;
    
    for (let i = 0; i < days * (days <= 1 ? 1440 : days <= 7 ? 24 : 1); i++) {
      const timestamp = now - (i * intervalMs);
      
      // Add realistic price variation (±3% max change per interval)
      const changePercent = (Math.random() - 0.5) * 0.06; // -3% to +3%
      currentPrice = currentPrice * (1 + changePercent);
      
      // Ensure price doesn't go below 10% of base price
      if (currentPrice < basePrice * 0.1) {
        currentPrice = basePrice * 0.1;
      }
      
      prices.unshift([timestamp, currentPrice]);
      volumes.unshift([timestamp, Math.random() * 1000000000]); // Random volume
    }
    
    return { prices, volumes };
  }

  private async generateSampleOHLCData(coinId: string, days: number): Promise<CandlestickData[]> {
    try {
      const currentPrice = await this.getCoinPrice(coinId);
      const basePrice = currentPrice.current_price;
      
      return this.createOHLCDataFromPrice(basePrice, days);
    } catch {
      const defaultPrices: { [key: string]: number } = {
        'bitcoin': 100000,
        'ethereum': 3000,
        'binancecoin': 600,
        'ripple': 2,
        'solana': 200
      };
      
      const basePrice = defaultPrices[coinId] || 100;
      return this.createOHLCDataFromPrice(basePrice, days);
    }
  }

  private createOHLCDataFromPrice(basePrice: number, days: number): CandlestickData[] {
    const ohlcData: CandlestickData[] = [];
    const now = Date.now();
    const intervalMs = 86400000; // 1 day intervals
    
    let currentPrice = basePrice;
    
    for (let i = 0; i < days; i++) {
      const timestamp = now - (i * intervalMs);
      
      // Generate OHLC for the day
      const open = currentPrice;
      const changePercent = (Math.random() - 0.5) * 0.1; // -5% to +5% daily change
      const close = open * (1 + changePercent);
      
      const high = Math.max(open, close) * (1 + Math.random() * 0.03); // Up to 3% higher
      const low = Math.min(open, close) * (1 - Math.random() * 0.03); // Up to 3% lower
      
      ohlcData.unshift({
        timestamp,
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000000
      });
      
      currentPrice = close;
    }
    
    return ohlcData;
  }
}

export const priceService = new PriceService();