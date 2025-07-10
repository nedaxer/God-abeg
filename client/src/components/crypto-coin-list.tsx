import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

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

interface CoinGeckoResponse {
  success: boolean;
  data: CryptoTicker[];
  timestamp: number;
}

// Comprehensive crypto logo mapping for proper display
const getCryptoLogo = (symbol: string, coinGeckoId?: string) => {
  const logoMap: { [key: string]: string } = {
    'BTC': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    'XRP': 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    'BNB': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    'SOL': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    'USDC': 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    'TRX': 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
    'DOGE': 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
    'ADA': 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
    'HYPE': 'https://assets.coingecko.com/coins/images/44162/small/hype-logo-circle.png',
    'AVAX': 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
    'SHIB': 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
    'LINK': 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    'DOT': 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
    'LTC': 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
    'UNI': 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
    'MATIC': 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    'ATOM': 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
    'FIL': 'https://assets.coingecko.com/coins/images/12817/small/filecoin.png',
    'AAVE': 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
    'AKT': 'https://assets.coingecko.com/coins/images/12785/small/akash-logo.png',
    'ALGO': 'https://assets.coingecko.com/coins/images/4380/small/download.png',
    'ANKR': 'https://assets.coingecko.com/coins/images/4324/small/U85xTl2.png',
    'APT': 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png',
    'ARB': 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
    'ARKM': 'https://assets.coingecko.com/coins/images/31102/small/arkm.png',
    'AXL': 'https://assets.coingecko.com/coins/images/27277/small/V-65_xQ1_400x400.jpeg',
    'AXS': 'https://assets.coingecko.com/coins/images/13029/small/axie_infinity_logo.png',
    'BAT': 'https://assets.coingecko.com/coins/images/677/small/basic-attention-token.png',
    'BEAM': 'https://assets.coingecko.com/coins/images/32417/small/chain-logo.png',
    'BCH': 'https://assets.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png',
    'STX': 'https://assets.coingecko.com/coins/images/2069/small/Stacks_logo_full.png',
    'BLUR': 'https://assets.coingecko.com/coins/images/28453/small/blur.png',
    'BONK': 'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg',
    'TIA': 'https://assets.coingecko.com/coins/images/31967/small/tia.jpg',
    'CELO': 'https://assets.coingecko.com/coins/images/11090/small/icon-celo-CELO-color-500.png',
    'CHZ': 'https://assets.coingecko.com/coins/images/8834/small/Chiliz.png',
    'COMP': 'https://assets.coingecko.com/coins/images/10775/small/COMP.png',
    'CFX': 'https://assets.coingecko.com/coins/images/13079/small/3vuYMbjN.png',
    'CORE': 'https://assets.coingecko.com/coins/images/28938/small/unnamed-2.png',
    'CRO': 'https://assets.coingecko.com/coins/images/7310/small/oCw2s3GI_400x400.jpeg',
    'CRV': 'https://assets.coingecko.com/coins/images/12124/small/Curve.png',
    'MANA': 'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png',
    'WIF': 'https://assets.coingecko.com/coins/images/33767/small/dogwifhat.jpg',
    'DYDX': 'https://assets.coingecko.com/coins/images/17500/small/hjnIm9bV.jpg',
    'ENJ': 'https://assets.coingecko.com/coins/images/1102/small/enjin-coin-logo.png',
    'EOS': 'https://assets.coingecko.com/coins/images/738/small/eos-eos-logo.png',
    'ENA': 'https://assets.coingecko.com/coins/images/36530/small/ethena.png',
    'ETC': 'https://assets.coingecko.com/coins/images/453/small/ethereum-classic-logo.png',
    'ENS': 'https://assets.coingecko.com/coins/images/19785/small/acatxTm8_400x400.jpg',
    'ETHFI': 'https://assets.coingecko.com/coins/images/35958/small/etherfi.png',
    'FTM': 'https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png',
    'FET': 'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg',
    'FDUSD': 'https://assets.coingecko.com/coins/images/31079/small/firstfigital.jpeg',
    'FLOKI': 'https://assets.coingecko.com/coins/images/16746/small/PNG_image.png',
    'FLOW': 'https://assets.coingecko.com/coins/images/13446/small/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.png',
    'GALA': 'https://assets.coingecko.com/coins/images/12493/small/GALA-v2.png',
    'GMX': 'https://assets.coingecko.com/coins/images/18323/small/arbit.png',
    'SNX': 'https://assets.coingecko.com/coins/images/3406/small/SNX.png',
    'HBAR': 'https://assets.coingecko.com/coins/images/3688/small/hbar.png',
    'HNT': 'https://assets.coingecko.com/coins/images/4284/small/Helium_HNT.png',
    'IMX': 'https://assets.coingecko.com/coins/images/17233/small/immutableX-symbol-BLK-RGB.png',
    'INJ': 'https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png',
    'ICP': 'https://assets.coingecko.com/coins/images/14495/small/Internet_Computer_logo.png',
    'JASMY': 'https://assets.coingecko.com/coins/images/13876/small/JASMY200x200.jpg',
    'JTO': 'https://assets.coingecko.com/coins/images/33447/small/jto.png',
    'JUP': 'https://assets.coingecko.com/coins/images/34188/small/jup.png',
    'KDA': 'https://assets.coingecko.com/coins/images/3693/small/djib_nchz_400x400.jpg',
    'KAS': 'https://assets.coingecko.com/coins/images/25751/small/kaspa-icon-exchanges.png',
    'KAVA': 'https://assets.coingecko.com/coins/images/9761/small/kava.png',
    'KCS': 'https://assets.coingecko.com/coins/images/1047/small/sa9z79.png',
    'KSM': 'https://assets.coingecko.com/coins/images/9568/small/m4zRhP5e_400x400.jpg',
    'LDO': 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png',
    'MKR': 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png',
    'MNT': 'https://assets.coingecko.com/coins/images/30980/small/token-logo.png',
    'MINA': 'https://assets.coingecko.com/coins/images/15628/small/JM4_vQ34_400x400.png',
    'XMR': 'https://assets.coingecko.com/coins/images/69/small/monero_logo.png',
    'NEAR': 'https://assets.coingecko.com/coins/images/10365/small/near_icon.png',
    'CKB': 'https://assets.coingecko.com/coins/images/9566/small/nervos-logo.png',
    'NEXO': 'https://assets.coingecko.com/coins/images/3695/small/nexo.png',
    'OKB': 'https://assets.coingecko.com/coins/images/4044/small/okb_token.png',
    'ONDO': 'https://assets.coingecko.com/coins/images/26580/small/ONDO.png',
    'OP': 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
    'CAKE': 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo.png',
    'PEPE': 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
    'PYTH': 'https://assets.coingecko.com/coins/images/31916/small/pyth.png',
    'QNT': 'https://assets.coingecko.com/coins/images/3370/small/5ZOu7brX_400x400.jpg',
    'RENDER': 'https://assets.coingecko.com/coins/images/11636/small/rndr.png',
    'SEI': 'https://assets.coingecko.com/coins/images/28205/small/Sei_Logo_-_Transparent.png',
    'STRK': 'https://assets.coingecko.com/coins/images/26433/small/starknet.png',
    'XLM': 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png',
    'GMT': 'https://assets.coingecko.com/coins/images/23597/small/gmt.png',
    'SUI': 'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg',
    'SUSHI': 'https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png',
    'GRT': 'https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png',
    'TON': 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png',
    'SAND': 'https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg',
    'THETA': 'https://assets.coingecko.com/coins/images/2538/small/theta-token-logo.png',
    'RUNE': 'https://assets.coingecko.com/coins/images/6595/small/RUNE.png',
    'VET': 'https://assets.coingecko.com/coins/images/1167/small/VET_Token_Icon.png'
  };
  
  // If we have a specific logo for this symbol, use it
  if (logoMap[symbol]) {
    return logoMap[symbol];
  }
  
  // Generate a unique fallback based on the symbol
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];
  const colorIndex = symbol.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];
  
  return `data:image/svg+xml;base64,${btoa(
    `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="${bgColor}"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${symbol.slice(0, 3)}</text>
    </svg>`
  )}`;
};

export function CryptoCoinList() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // WebSocket connection for real-time updates
  const [wsData, setWsData] = useState<CoinGeckoResponse | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected for crypto prices');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'crypto_prices') {
          setWsData(data);
          setLastUpdate(new Date());
          // Cache WebSocket data as well
          setCachedData(data);
          setCachedDataState(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => {
      ws.close();
    };
  }, []);

  // Cache management functions
  const getCachedData = (): CoinGeckoResponse | null => {
    try {
      const cached = localStorage.getItem('crypto-coin-list-cache');
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const now = Date.now();
        const cacheAge = now - parsedCache.timestamp;
        const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
        
        if (cacheAge < tenMinutes) {
          console.log('Using cached crypto data, age:', Math.round(cacheAge / 1000), 'seconds');
          return parsedCache.data;
        } else {
          console.log('Cache expired, age:', Math.round(cacheAge / 1000), 'seconds');
          localStorage.removeItem('crypto-coin-list-cache');
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
      localStorage.removeItem('crypto-coin-list-cache');
    }
    return null;
  };

  const setCachedData = (data: CoinGeckoResponse) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem('crypto-coin-list-cache', JSON.stringify(cacheData));
      console.log('Crypto data cached successfully');
    } catch (error) {
      console.error('Error caching data:', error);
    }
  };

  // Check for cached data first
  const [cachedData, setCachedDataState] = useState<CoinGeckoResponse | null>(() => getCachedData());

  // Fallback to polling if WebSocket is not available
  const { data: cryptoData, isLoading, error } = useQuery({
    queryKey: ["/api/crypto/realtime-prices"],
    queryFn: async (): Promise<CoinGeckoResponse> => {
      // Check cache first
      const cached = getCachedData();
      if (cached) {
        return cached;
      }

      // Fetch fresh data if no valid cache
      console.log('Fetching fresh crypto data from API...');
      const response = await fetch("/api/crypto/realtime-prices");
      if (!response.ok) {
        // If API fails, try to use expired cache as fallback
        const expiredCache = localStorage.getItem('crypto-coin-list-cache');
        if (expiredCache) {
          const parsedCache = JSON.parse(expiredCache);
          console.log('API failed, using expired cache as fallback');
          return parsedCache.data;
        }
        throw new Error(`Failed to fetch crypto data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache the fresh data
      setCachedData(data);
      setCachedDataState(data);
      
      if (!isConnected) {
        setLastUpdate(new Date());
      }
      return data;
    },
    refetchInterval: isConnected ? false : 600000, // Only refetch every 10 minutes if WebSocket is not connected
    retry: 3,
    staleTime: 600000, // Consider data stale after 10 minutes
    enabled: !isConnected, // Only fetch if WebSocket is not connected
  });

  // Get top 120 coins by market cap - prefer WebSocket data, then fetched data, then cached data
  const activeData = wsData || cryptoData || cachedData;
  const topCoins = activeData?.data?.slice(0, 120) || [];

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0033a0] mb-4">Top Cryptocurrencies by Market Cap</h2>
            <p className="text-gray-600">Real-time cryptocurrency market data</p>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-gray-200 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-6 bg-gray-300 rounded w-20"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0033a0] mb-4">Top Cryptocurrencies by Market Cap</h2>
            <p className="text-red-600">Unable to load cryptocurrency data. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0033a0] mb-4">TOP Cryptocurrencies by Nedaxer</h2>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-6xl mx-auto">
          {topCoins.map((coin, index) => (
            <div
              key={coin.symbol}
              className="flex items-center justify-between py-2 px-3 md:py-3 md:px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Rank and Coin Info */}
              <div className="flex items-center space-x-1 md:space-x-3 flex-1 min-w-0">
                <div className="text-gray-500 font-medium text-xs md:text-sm w-4 md:w-6 text-left">
                  {index + 1}
                </div>
                <div className="flex items-center space-x-1 md:space-x-2">
                  <img 
                    src={getCryptoLogo(coin.symbol)}
                    alt={`${coin.symbol} logo`}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Generate a fallback based on the symbol instead of using BTC
                      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];
                      const colorIndex = coin.symbol.charCodeAt(0) % colors.length;
                      const bgColor = colors[colorIndex];
                      target.src = `data:image/svg+xml;base64,${btoa(
                        `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="16" fill="${bgColor}"/>
                          <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${coin.symbol.slice(0, 3)}</text>
                        </svg>`
                      )}`;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-gray-900 font-semibold text-xs md:text-sm truncate">
                      {coin.name}
                    </div>
                    <div className="text-gray-500 text-xs font-medium">
                      {coin.symbol}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-gray-900 font-semibold text-right min-w-[60px] md:min-w-[80px] text-xs md:text-sm">
                ${coin.price.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: coin.price < 1 ? 4 : 2 
                })}
              </div>

              {/* 24h Change */}
              <div className="text-right min-w-[50px] md:min-w-[60px]">
                <span className={`text-xs font-medium ${
                  coin.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {coin.change >= 0 ? '▲' : '▼'} {Math.abs(coin.change).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
}