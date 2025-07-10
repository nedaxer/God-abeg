/**
 * CoinGecko API service for fetching crypto logos and data
 */

export interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

// Map crypto symbols to CoinGecko IDs
const CRYPTO_ID_MAP: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDT': 'tether',
  'BNB': 'binancecoin',
  'SOL': 'solana',
  'XRP': 'ripple',
  'DOGE': 'dogecoin',
  'ADA': 'cardano',
  'TRX': 'tron',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'TON': 'the-open-network',
  'SHIB': 'shiba-inu',
  'DOT': 'polkadot',
  'BCH': 'bitcoin-cash',
  'LTC': 'litecoin',
  'PEPE': 'pepe',
  'USDC': 'usd-coin',
  'ARB': 'arbitrum',
  'ATOM': 'cosmos',
  'ALGO': 'algorand',
  'VET': 'vechain',
  'HBAR': 'hedera-hashgraph',
  'NEAR': 'near',
  'FIL': 'filecoin',
  'XLM': 'stellar',
  'ICP': 'internet-computer',
  'UNI': 'uniswap',
  'FTM': 'fantom',
  'AAVE': 'aave',
  'CRO': 'crypto-com-chain',
  'BONK': 'bonk',
  'WLD': 'worldcoin-wld',
  'APT': 'aptos',
  'INJ': 'injective-protocol',
  'GALA': 'gala',
  'FLOW': 'flow',
  'THETA': 'theta-token',
  'QNT': 'quant-network',
  'MANA': 'decentraland',
  'SAND': 'the-sandbox',
  'CHZ': 'chiliz',
  'GMT': 'stepn',
  'SNX': 'havven',
  'BAT': 'basic-attention-token',
  'ZEC': 'zcash',
  'EOS': 'eos',
  'ANKR': 'ankr',
  'CELO': 'celo',
  'CORE': 'coredaoorg'
};

/**
 * Get CoinGecko logo URL for a cryptocurrency symbol
 */
export function getCoinGeckoLogo(symbol: string): string {
  const coinId = CRYPTO_ID_MAP[symbol.toUpperCase()];
  if (!coinId) {
    console.warn(`No CoinGecko ID mapping found for symbol: ${symbol}`);
    return '';
  }
  
  // Return CoinGecko image URL (64x64 size)
  return `https://assets.coingecko.com/coins/images/${getCoinImageId(coinId)}/large/${coinId}.png`;
}

/**
 * Get coin image ID for CoinGecko API
 * This maps some common coin IDs to their image IDs
 */
function getCoinImageId(coinId: string): string {
  const imageIdMap: Record<string, string> = {
    'bitcoin': '1',
    'ethereum': '279',
    'tether': '325',
    'binancecoin': '825',
    'solana': '4128',
    'ripple': '44',
    'dogecoin': '5',
    'cardano': '975',
    'tron': '1094',
    'avalanche-2': '12559',
    'chainlink': '877',
    'the-open-network': '17980',
    'shiba-inu': '11939',
    'polkadot': '12171',
    'bitcoin-cash': '1',
    'litecoin': '2',
    'pepe': '29850',
    'usd-coin': '6319',
    'arbitrum': '26045',
    'cosmos': '928',
    'algorand': '4030',
    'vechain': '1063',
    'hedera-hashgraph': '4642',
    'near': '10365',
    'filecoin': '12817',
    'stellar': '100',
    'internet-computer': '24801',
    'uniswap': '12504',
    'fantom': '4001',
    'aave': '12645',
    'crypto-com-chain': '3635',
    'bonk': '28600',
    'worldcoin-wld': '31069',
    'aptos': '26455',
    'injective-protocol': '7226',
    'gala': '12493',
    'flow': '4558',
    'theta-token': '2416',
    'quant-network': '3077',
    'decentraland': '1966',
    'the-sandbox': '12Sand',
    'chiliz': '8834',
    'stepn': '23597',
    'havven': '2586',
    'basic-attention-token': '1914',
    'zcash': '486',
    'eos': '1765',
    'ankr': '8819',
    'celo': '11756',
    'coredaoorg': '28982'
  };
  
  return imageIdMap[coinId] || '1';
}

/**
 * Fetch crypto data from CoinGecko API
 */
export async function fetchCoinGeckoData(symbols: string[]): Promise<CoinGeckoResponse[]> {
  try {
    const coinIds = symbols
      .map(symbol => CRYPTO_ID_MAP[symbol.toUpperCase()])
      .filter(Boolean)
      .join(',');
    
    if (!coinIds) {
      console.warn('No valid CoinGecko IDs found for symbols:', symbols);
      return [];
    }
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
    return [];
  }
}

/**
 * Get simplified crypto logo component using CoinGecko
 */
export function getCoinGeckoImage(symbol: string, size: number = 32): string {
  const coinId = CRYPTO_ID_MAP[symbol.toUpperCase()];
  if (!coinId) {
    return '';
  }
  
  // Use CoinGecko's correct image URLs with proper domain
  const baseUrl = 'https://coin-images.coingecko.com/coins/images';
  const imageId = getCoinImageId(coinId);
  
  // Different sizes: thumb (24x24), small (32x32), large (64x64)
  const sizeParam = size <= 24 ? 'thumb' : size <= 32 ? 'small' : 'large';
  
  // Special handling for specific coins with known image names
  const specialImages: Record<string, string> = {
    'BTC': `${baseUrl}/1/${sizeParam}/bitcoin.png`,
    'ETH': `${baseUrl}/279/${sizeParam}/ethereum.png`,
    'USDT': `${baseUrl}/325/${sizeParam}/Tether.png`,
    'BNB': `${baseUrl}/825/${sizeParam}/bnb-icon2_2x.png`
  };
  
  const upperSymbol = symbol.toUpperCase();
  if (specialImages[upperSymbol]) {
    return specialImages[upperSymbol];
  }
  
  return `${baseUrl}/${imageId}/${sizeParam}/${coinId}.png`;
}