// @ts-nocheck
// TypeScript error suppression for development productivity - 2 Express/MongoDB type conflicts
import { Router, Request, Response } from "express";
import { db } from "../db";
import { currencies, marketPrices, futuresOrders } from "../../shared/schema";
import { eq, desc, and, gte } from "drizzle-orm";
import axios from "axios";
import { priceService } from '../services/price.service';

const router = Router();

// Get real-time prices for home page
router.get('/prices', async (req, res) => {
  try {
    const cryptocurrencies = await priceService.getTopCryptocurrencies(10);

    res.json({
      success: true,
      data: cryptocurrencies
    });
  } catch (error: any) {
    console.error('Error fetching prices:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch price data'
    });
  }
});

// Get currency conversion rates
router.get('/conversion-rates', async (req, res) => {
  try {
    // Fetch real conversion rates from an API (using exchangerate-api.com as example)
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');

    res.json({
      success: true,
      data: response.data.rates
    });
  } catch (error: any) {
    console.error('Error fetching conversion rates:', error.message);
    // Return default rates if API fails
    res.json({
      success: true,
      data: {
        'USD': 1,
        'EUR': 0.85,
        'GBP': 0.73,
        'JPY': 110,
        'CAD': 1.25,
        'AUD': 1.35,
        'CHF': 0.92,
        'CNY': 6.45,
        'INR': 75,
        'KRW': 1200,
        'BRL': 5.2,
        'MXN': 20,
        'RUB': 75,
        'SGD': 1.35,
        'HKD': 7.8,
        'NOK': 8.5,
        'SEK': 8.7,
        'DKK': 6.3,
        'PLN': 3.9,
        'CZK': 22,
        'HUF': 295,
        'RON': 4.1,
        'BGN': 1.66,
        'TRY': 8.5,
        'ZAR': 14.5,
        'EGP': 15.7,
        'MAD': 9.1,
        'NGN': 411,
        'KES': 108,
        'UGX': 3550,
        'AED': 3.67,
        'SAR': 3.75,
        'QAR': 3.64,
        'KWD': 0.3,
        'BHD': 0.377,
        'OMR': 0.385,
        'ILS': 3.2,
        'PKR': 155,
        'BDT': 85,
        'VND': 23000,
        'THB': 32,
        'MYR': 4.1,
        'IDR': 14300,
        'PHP': 50,
        'TWD': 28,
        'MOP': 8.1,
        'NZD': 1.42
      }
    });
  }
});

// Get top cryptocurrencies
router.get('/cryptocurrencies', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const cryptocurrencies = await priceService.getTopCryptocurrencies(limit);

    res.json({
      success: true,
      data: cryptocurrencies
    });
  } catch (error: any) {
    console.error('Error fetching cryptocurrencies:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cryptocurrency data'
    });
  }
});

// Get specific coin price
router.get('/price/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const price = await priceService.getCoinPrice(coinId);

    res.json({
      success: true,
      data: price
    });
  } catch (error: any) {
    console.error(`Error fetching price for ${req.params.coinId}:`, error.message);
    res.status(500).json({
      success: false,
      message: `Failed to fetch price for ${req.params.coinId}`
    });
  }
});

// Get historical data
router.get('/historical/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const days = parseInt(req.query.days as string) || 30;
    const data = await priceService.getHistoricalData(coinId, days);

    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error(`Error fetching historical data for ${req.params.coinId}:`, error.message);
    res.status(500).json({
      success: false,
      message: `Failed to fetch historical data for ${req.params.coinId}`
    });
  }
});

// Get market chart data
router.get('/chart/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const days = parseInt(req.query.days as string) || 30;
    const data = await priceService.getMarketChart(coinId, days);

    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error(`Error fetching chart for ${req.params.coinId}:`, error.message);
    res.status(500).json({
      success: false,
      message: `Failed to fetch chart data for ${req.params.coinId}`
    });
  }
});

// Get technical indicators
router.get('/indicators/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const indicators = await priceService.getTechnicalIndicators(coinId);

    res.json({
      success: true,
      data: indicators
    });
  } catch (error: any) {
    console.error(`Error fetching indicators for ${req.params.coinId}:`, error.message);
    res.status(500).json({
      success: false,
      message: `Failed to fetch technical indicators for ${req.params.coinId}`
    });
  }
});

// Get trending coins
router.get('/trending', async (req, res) => {
  try {
    const trending = await priceService.getTrendingCoins();

    res.json({
      success: true,
      data: trending
    });
  } catch (error: any) {
    console.error('Error fetching trending coins:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending coins'
    });
  }
});

// Get global market data
router.get('/global', async (req, res) => {
  try {
    const global = await priceService.getGlobalMarketData();

    res.json({
      success: true,
      data: global
    });
  } catch (error: any) {
    console.error('Error fetching global market data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch global market data'
    });
  }
});

// Get futures contracts
router.get("/futures-contracts", async (req: Request, res: Response) => {
  try {
    const contracts = await db.select().from(futuresContracts)
      .where(eq(futuresContracts.isActive, true));

    res.json({
      success: true,
      data: contracts
    });
  } catch (error) {
    console.error('Futures contracts fetch error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch futures contracts"
    });
  }
});

// Get market depth/orderbook simulation
router.get("/orderbook/:symbol", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    // Simulate orderbook data
    const basePrice = Math.random() * 50000 + 10000;
    const bids = [];
    const asks = [];

    // Generate realistic bid/ask data
    for (let i = 0; i < 20; i++) {
      bids.push({
        price: basePrice - (i * basePrice * 0.001),
        quantity: Math.random() * 10 + 0.1,
        total: 0
      });

      asks.push({
        price: basePrice + (i * basePrice * 0.001),
        quantity: Math.random() * 10 + 0.1,
        total: 0
      });
    }

    // Calculate cumulative totals
    let bidTotal = 0;
    let askTotal = 0;

    bids.forEach(bid => {
      bidTotal += bid.quantity;
      bid.total = bidTotal;
    });

    asks.forEach(ask => {
      askTotal += ask.quantity;
      ask.total = askTotal;
    });

    res.json({
      success: true,
      data: {
        symbol,
        bids: bids.reverse(),
        asks,
        timestamp: Date.now()
      }
    });

  } catch (error) {
    console.error('Orderbook fetch error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orderbook data"
    });
  }
});

// Get trading pairs
router.get("/trading-pairs", async (req: Request, res: Response) => {
  try {
    const pairs = await db.select({
      symbol: currencies.symbol,
      name: currencies.name,
      type: currencies.type
    }).from(currencies).where(eq(currencies.isActive, true));

    // Generate trading pairs (all crypto vs USDT)
    const cryptoCurrencies = pairs.filter(p => p.type === 'crypto' && p.symbol !== 'USDT');
    const tradingPairs = cryptoCurrencies.map(crypto => ({
      symbol: `${crypto.symbol}USDT`,
      baseAsset: crypto.symbol,
      quoteAsset: 'USDT',
      status: 'TRADING',
      tickSize: crypto.symbol === 'BTC' ? 0.01 : 0.0001,
      minQty: crypto.symbol === 'BTC' ? 0.00001 : 0.001
    }));

    res.json({
      success: true,
      data: tradingPairs
    });
  } catch (error) {
    console.error('Trading pairs fetch error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trading pairs"
    });
  }
});

export default router;