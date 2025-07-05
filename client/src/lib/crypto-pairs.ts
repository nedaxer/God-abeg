export interface CryptoPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  name: string;
  tradingViewSymbol: string;
  coinGeckoId?: string;
  price?: number;
  change?: number;
}

export const CRYPTO_PAIRS: CryptoPair[] = [
  // Top Market Cap - Tier 1 (Rank 1-20)
  { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', name: 'Bitcoin', tradingViewSymbol: 'BYBIT:BTCUSDT', coinGeckoId: 'bitcoin' },
  { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', name: 'Ethereum', tradingViewSymbol: 'BYBIT:ETHUSDT', coinGeckoId: 'ethereum' },
  { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT', name: 'Solana', tradingViewSymbol: 'BYBIT:SOLUSDT', coinGeckoId: 'solana' },
  { symbol: 'BNBUSDT', baseAsset: 'BNB', quoteAsset: 'USDT', name: 'BNB', tradingViewSymbol: 'BYBIT:BNBUSDT', coinGeckoId: 'binancecoin' },
  { symbol: 'XRPUSDT', baseAsset: 'XRP', quoteAsset: 'USDT', name: 'XRP', tradingViewSymbol: 'BYBIT:XRPUSDT', coinGeckoId: 'ripple' },
  { symbol: 'USDCUSDT', baseAsset: 'USDC', quoteAsset: 'USDT', name: 'USD Coin', tradingViewSymbol: 'BYBIT:USDCUSDT', coinGeckoId: 'usd-coin' },
  { symbol: 'DOGEUSDT', baseAsset: 'DOGE', quoteAsset: 'USDT', name: 'Dogecoin', tradingViewSymbol: 'BYBIT:DOGEUSDT', coinGeckoId: 'dogecoin' },
  { symbol: 'ADAUSDT', baseAsset: 'ADA', quoteAsset: 'USDT', name: 'Cardano', tradingViewSymbol: 'BYBIT:ADAUSDT', coinGeckoId: 'cardano' },
  { symbol: 'TRXUSDT', baseAsset: 'TRX', quoteAsset: 'USDT', name: 'TRON', tradingViewSymbol: 'BYBIT:TRXUSDT', coinGeckoId: 'tron' },
  { symbol: 'AVAXUSDT', baseAsset: 'AVAX', quoteAsset: 'USDT', name: 'Avalanche', tradingViewSymbol: 'BYBIT:AVAXUSDT', coinGeckoId: 'avalanche-2' },
  { symbol: 'LINKUSDT', baseAsset: 'LINK', quoteAsset: 'USDT', name: 'Chainlink', tradingViewSymbol: 'BYBIT:LINKUSDT', coinGeckoId: 'chainlink' },
  { symbol: 'TONUSDT', baseAsset: 'TON', quoteAsset: 'USDT', name: 'Toncoin', tradingViewSymbol: 'BYBIT:TONUSDT', coinGeckoId: 'the-open-network' },
  { symbol: 'SHIBUSDT', baseAsset: 'SHIB', quoteAsset: 'USDT', name: 'Shiba Inu', tradingViewSymbol: 'BYBIT:SHIBUSDT', coinGeckoId: 'shiba-inu' },
  { symbol: 'SUIUSDT', baseAsset: 'SUI', quoteAsset: 'USDT', name: 'Sui', tradingViewSymbol: 'BYBIT:SUIUSDT', coinGeckoId: 'sui' },
  { symbol: 'DOTUSDT', baseAsset: 'DOT', quoteAsset: 'USDT', name: 'Polkadot', tradingViewSymbol: 'BYBIT:DOTUSDT', coinGeckoId: 'polkadot' },
  { symbol: 'BCHUSDT', baseAsset: 'BCH', quoteAsset: 'USDT', name: 'Bitcoin Cash', tradingViewSymbol: 'BYBIT:BCHUSDT', coinGeckoId: 'bitcoin-cash' },
  { symbol: 'LTCUSDT', baseAsset: 'LTC', quoteAsset: 'USDT', name: 'Litecoin', tradingViewSymbol: 'BYBIT:LTCUSDT', coinGeckoId: 'litecoin' },
  { symbol: 'PEPEUSDT', baseAsset: 'PEPE', quoteAsset: 'USDT', name: 'Pepe', tradingViewSymbol: 'BYBIT:PEPEUSDT', coinGeckoId: 'pepe' },

  // Tier 2 (Rank 21-50)
  { symbol: 'UNIUSDT', baseAsset: 'UNI', quoteAsset: 'USDT', name: 'Uniswap', tradingViewSymbol: 'BYBIT:UNIUSDT', coinGeckoId: 'uniswap' },
  { symbol: 'KASUSDT', baseAsset: 'KAS', quoteAsset: 'USDT', name: 'Kaspa', tradingViewSymbol: 'BYBIT:KASUSDT', coinGeckoId: 'kaspa' },

  { symbol: 'NEARUSDT', baseAsset: 'NEAR', quoteAsset: 'USDT', name: 'NEAR Protocol', tradingViewSymbol: 'BYBIT:NEARUSDT', coinGeckoId: 'near' },
  { symbol: 'APTUSDT', baseAsset: 'APT', quoteAsset: 'USDT', name: 'Aptos', tradingViewSymbol: 'BYBIT:APTUSDT', coinGeckoId: 'aptos' },
  { symbol: 'ICPUSDT', baseAsset: 'ICP', quoteAsset: 'USDT', name: 'Internet Computer', tradingViewSymbol: 'BYBIT:ICPUSDT', coinGeckoId: 'internet-computer' },
  { symbol: 'XLMUSDT', baseAsset: 'XLM', quoteAsset: 'USDT', name: 'Stellar', tradingViewSymbol: 'BYBIT:XLMUSDT', coinGeckoId: 'stellar' },
  { symbol: 'ETCUSDT', baseAsset: 'ETC', quoteAsset: 'USDT', name: 'Ethereum Classic', tradingViewSymbol: 'BYBIT:ETCUSDT', coinGeckoId: 'ethereum-classic' },
  { symbol: 'MATICUSDT', baseAsset: 'MATIC', quoteAsset: 'USDT', name: 'Polygon', tradingViewSymbol: 'BYBIT:MATICUSDT', coinGeckoId: 'matic-network' },
  { symbol: 'FILUSDT', baseAsset: 'FIL', quoteAsset: 'USDT', name: 'Filecoin', tradingViewSymbol: 'BYBIT:FILUSDT', coinGeckoId: 'filecoin' },
  { symbol: 'WIFUSDT', baseAsset: 'WIF', quoteAsset: 'USDT', name: 'dogwifhat', tradingViewSymbol: 'BYBIT:WIFUSDT', coinGeckoId: 'dogwifcoin' },
  { symbol: 'INJUSDT', baseAsset: 'INJ', quoteAsset: 'USDT', name: 'Injective', tradingViewSymbol: 'BYBIT:INJUSDT', coinGeckoId: 'injective-protocol' },
  { symbol: 'BONKUSDT', baseAsset: 'BONK', quoteAsset: 'USDT', name: 'Bonk', tradingViewSymbol: 'BYBIT:BONKUSDT', coinGeckoId: 'bonk' },
  { symbol: 'VETUSDT', baseAsset: 'VET', quoteAsset: 'USDT', name: 'VeChain', tradingViewSymbol: 'BYBIT:VETUSDT', coinGeckoId: 'vechain' },
  { symbol: 'RNDRUSDT', baseAsset: 'RNDR', quoteAsset: 'USDT', name: 'Render', tradingViewSymbol: 'BYBIT:RNDRUSDT', coinGeckoId: 'render-token' },
  { symbol: 'HBARUSDT', baseAsset: 'HBAR', quoteAsset: 'USDT', name: 'Hedera', tradingViewSymbol: 'BYBIT:HBARUSDT', coinGeckoId: 'hedera-hashgraph' },
  { symbol: 'MNTUSDT', baseAsset: 'MNT', quoteAsset: 'USDT', name: 'Mantle', tradingViewSymbol: 'BYBIT:MNTUSDT', coinGeckoId: 'mantle' },
  { symbol: 'ARBUSDT', baseAsset: 'ARB', quoteAsset: 'USDT', name: 'Arbitrum', tradingViewSymbol: 'BYBIT:ARBUSDT', coinGeckoId: 'arbitrum' },
  { symbol: 'ATOMUSDT', baseAsset: 'ATOM', quoteAsset: 'USDT', name: 'Cosmos', tradingViewSymbol: 'BYBIT:ATOMUSDT', coinGeckoId: 'cosmos' },
  { symbol: 'ALGOUSDT', baseAsset: 'ALGO', quoteAsset: 'USDT', name: 'Algorand', tradingViewSymbol: 'BYBIT:ALGOUSDT', coinGeckoId: 'algorand' },

  // Tier 3 (Rank 51-80)
  { symbol: 'OPUSDT', baseAsset: 'OP', quoteAsset: 'USDT', name: 'Optimism', tradingViewSymbol: 'BYBIT:OPUSDT', coinGeckoId: 'optimism' },
  { symbol: 'AAVEUSDT', baseAsset: 'AAVE', quoteAsset: 'USDT', name: 'Aave', tradingViewSymbol: 'BYBIT:AAVEUSDT', coinGeckoId: 'aave' },
  { symbol: 'MKRUSDT', baseAsset: 'MKR', quoteAsset: 'USDT', name: 'Maker', tradingViewSymbol: 'BYBIT:MKRUSDT', coinGeckoId: 'maker' },
  { symbol: 'PYTHUSDT', baseAsset: 'PYTH', quoteAsset: 'USDT', name: 'Pyth Network', tradingViewSymbol: 'BYBIT:PYTHUSDT', coinGeckoId: 'pyth-network' },
  { symbol: 'SEIUSDT', baseAsset: 'SEI', quoteAsset: 'USDT', name: 'Sei', tradingViewSymbol: 'BYBIT:SEIUSDT', coinGeckoId: 'sei-network' },
  { symbol: 'FLOKIUSDT', baseAsset: 'FLOKI', quoteAsset: 'USDT', name: 'Floki', tradingViewSymbol: 'BYBIT:FLOKIUSDT', coinGeckoId: 'floki' },
  { symbol: 'LDOUSDT', baseAsset: 'LDO', quoteAsset: 'USDT', name: 'Lido DAO', tradingViewSymbol: 'BYBIT:LDOUSDT', coinGeckoId: 'lido-dao' },
  { symbol: 'GALAUSDT', baseAsset: 'GALA', quoteAsset: 'USDT', name: 'Gala', tradingViewSymbol: 'BYBIT:GALAUSDT', coinGeckoId: 'gala' },
  { symbol: 'TIAUSDT', baseAsset: 'TIA', quoteAsset: 'USDT', name: 'Celestia', tradingViewSymbol: 'BYBIT:TIAUSDT', coinGeckoId: 'celestia' },
  { symbol: 'SANDUSDT', baseAsset: 'SAND', quoteAsset: 'USDT', name: 'The Sandbox', tradingViewSymbol: 'BYBIT:SANDUSDT', coinGeckoId: 'the-sandbox' },

  { symbol: 'GRTUSDT', baseAsset: 'GRT', quoteAsset: 'USDT', name: 'The Graph', tradingViewSymbol: 'BYBIT:GRTUSDT', coinGeckoId: 'the-graph' },

  { symbol: 'BEAMUSDT', baseAsset: 'BEAM', quoteAsset: 'USDT', name: 'Beam', tradingViewSymbol: 'BYBIT:BEAMUSDT', coinGeckoId: 'beam-2' },
  { symbol: 'MINAUSDT', baseAsset: 'MINA', quoteAsset: 'USDT', name: 'Mina Protocol', tradingViewSymbol: 'BYBIT:MINAUSDT', coinGeckoId: 'mina-protocol' },

  { symbol: 'FLOWUSDT', baseAsset: 'FLOW', quoteAsset: 'USDT', name: 'Flow', tradingViewSymbol: 'BYBIT:FLOWUSDT', coinGeckoId: 'flow' },
  { symbol: 'QNTUSDT', baseAsset: 'QNT', quoteAsset: 'USDT', name: 'Quant', tradingViewSymbol: 'BYBIT:QNTUSDT', coinGeckoId: 'quant-network' },
  { symbol: 'JUPUSDT', baseAsset: 'JUP', quoteAsset: 'USDT', name: 'Jupiter', tradingViewSymbol: 'BYBIT:JUPUSDT', coinGeckoId: 'jupiter-exchange-solana' },
  { symbol: 'WUSDT', baseAsset: 'W', quoteAsset: 'USDT', name: 'Wormhole', tradingViewSymbol: 'BYBIT:WUSDT', coinGeckoId: 'wormhole' },

  // Tier 4 (Rank 81-110)
  { symbol: 'AXSUSDT', baseAsset: 'AXS', quoteAsset: 'USDT', name: 'Axie Infinity', tradingViewSymbol: 'BYBIT:AXSUSDT', coinGeckoId: 'axie-infinity' },

  { symbol: 'IMXUSDT', baseAsset: 'IMX', quoteAsset: 'USDT', name: 'Immutable X', tradingViewSymbol: 'BYBIT:IMXUSDT', coinGeckoId: 'immutable-x' },
  { symbol: 'ARKMUSDT', baseAsset: 'ARKM', quoteAsset: 'USDT', name: 'Arkham', tradingViewSymbol: 'BYBIT:ARKMUSDT', coinGeckoId: 'arkham' },
  { symbol: 'STRKUSDT', baseAsset: 'STRK', quoteAsset: 'USDT', name: 'Starknet', tradingViewSymbol: 'BYBIT:STRKUSDT', coinGeckoId: 'starknet' },
  { symbol: 'FETUSDT', baseAsset: 'FET', quoteAsset: 'USDT', name: 'Fetch.ai', tradingViewSymbol: 'BYBIT:FETUSDT', coinGeckoId: 'fetch-ai' },

  { symbol: 'CHZUSDT', baseAsset: 'CHZ', quoteAsset: 'USDT', name: 'Chiliz', tradingViewSymbol: 'BYBIT:CHZUSDT', coinGeckoId: 'chiliz' },
  { symbol: 'SNXUSDT', baseAsset: 'SNX', quoteAsset: 'USDT', name: 'Synthetix', tradingViewSymbol: 'BYBIT:SNXUSDT', coinGeckoId: 'havven' },
  { symbol: 'CRVUSDT', baseAsset: 'CRV', quoteAsset: 'USDT', name: 'Curve DAO', tradingViewSymbol: 'BYBIT:CRVUSDT', coinGeckoId: 'curve-dao-token' },
  { symbol: 'ENJUSDT', baseAsset: 'ENJ', quoteAsset: 'USDT', name: 'Enjin Coin', tradingViewSymbol: 'BYBIT:ENJUSDT', coinGeckoId: 'enjincoin' },
  { symbol: 'AXLUSDT', baseAsset: 'AXL', quoteAsset: 'USDT', name: 'Axelar', tradingViewSymbol: 'BYBIT:AXLUSDT', coinGeckoId: 'axelar' },

  { symbol: 'ETHFIUSDT', baseAsset: 'ETHFI', quoteAsset: 'USDT', name: 'Ether.fi', tradingViewSymbol: 'BYBIT:ETHFIUSDT', coinGeckoId: 'ether-fi' },
  { symbol: 'GMXUSDT', baseAsset: 'GMX', quoteAsset: 'USDT', name: 'GMX', tradingViewSymbol: 'BYBIT:GMXUSDT', coinGeckoId: 'gmx' },


  { symbol: 'DYDXUSDT', baseAsset: 'DYDX', quoteAsset: 'USDT', name: 'dYdX', tradingViewSymbol: 'BYBIT:DYDXUSDT', coinGeckoId: 'dydx' },
  { symbol: 'COMPUSDT', baseAsset: 'COMP', quoteAsset: 'USDT', name: 'Compound', tradingViewSymbol: 'BYBIT:COMPUSDT', coinGeckoId: 'compound-governance-token' },
  { symbol: 'ZETAUSDT', baseAsset: 'ZETA', quoteAsset: 'USDT', name: 'ZetaChain', tradingViewSymbol: 'BYBIT:ZETAUSDT', coinGeckoId: 'zetachain' },

  // Tier 5 (Rank 111-130)
  { symbol: 'MANAUSDT', baseAsset: 'MANA', quoteAsset: 'USDT', name: 'Decentraland', tradingViewSymbol: 'BYBIT:MANAUSDT', coinGeckoId: 'decentraland' },
  { symbol: 'ENSUSDT', baseAsset: 'ENS', quoteAsset: 'USDT', name: 'Ethereum Name Service', tradingViewSymbol: 'BYBIT:ENSUSDT', coinGeckoId: 'ethereum-name-service' },
  { symbol: 'SUSHIUSDT', baseAsset: 'SUSHI', quoteAsset: 'USDT', name: 'SushiSwap', tradingViewSymbol: 'BYBIT:SUSHIUSDT', coinGeckoId: 'sushi' },
  { symbol: 'ONDOUSDT', baseAsset: 'ONDO', quoteAsset: 'USDT', name: 'Ondo', tradingViewSymbol: 'BYBIT:ONDOUSDT', coinGeckoId: 'ondo-finance' },
  { symbol: 'YFIUSDT', baseAsset: 'YFI', quoteAsset: 'USDT', name: 'yearn.finance', tradingViewSymbol: 'BYBIT:YFIUSDT', coinGeckoId: 'yearn-finance' },
  { symbol: 'JASMYUSDT', baseAsset: 'JASMY', quoteAsset: 'USDT', name: 'JasmyCoin', tradingViewSymbol: 'BYBIT:JASMYUSDT', coinGeckoId: 'jasmycoin' },
  { symbol: 'JTOUSDT', baseAsset: 'JTO', quoteAsset: 'USDT', name: 'Jito', tradingViewSymbol: 'BYBIT:JTOUSDT', coinGeckoId: 'jito-governance-token' },
  { symbol: 'KSMUSDT', baseAsset: 'KSM', quoteAsset: 'USDT', name: 'Kusama', tradingViewSymbol: 'BYBIT:KSMUSDT', coinGeckoId: 'kusama' },
  { symbol: 'ZECUSDT', baseAsset: 'ZEC', quoteAsset: 'USDT', name: 'Zcash', tradingViewSymbol: 'BYBIT:ZECUSDT', coinGeckoId: 'zcash' },
  { symbol: 'BATUSDT', baseAsset: 'BAT', quoteAsset: 'USDT', name: 'Basic Attention Token', tradingViewSymbol: 'BYBIT:BATUSDT', coinGeckoId: 'basic-attention-token' },
  { symbol: 'CKBUSDT', baseAsset: 'CKB', quoteAsset: 'USDT', name: 'Nervos Network', tradingViewSymbol: 'BYBIT:CKBUSDT', coinGeckoId: 'nervos-network' },
  { symbol: 'EOSUSDT', baseAsset: 'EOS', quoteAsset: 'USDT', name: 'EOS', tradingViewSymbol: 'BYBIT:EOSUSDT', coinGeckoId: 'eos' },
  { symbol: 'GMTUSDT', baseAsset: 'GMT', quoteAsset: 'USDT', name: 'STEPN', tradingViewSymbol: 'BYBIT:GMTUSDT', coinGeckoId: 'stepn' },
  { symbol: 'ENAUSDT', baseAsset: 'ENA', quoteAsset: 'USDT', name: 'Ethena', tradingViewSymbol: 'BYBIT:ENAUSDT', coinGeckoId: 'ethena' },
  { symbol: 'FTMUSDT', baseAsset: 'FTM', quoteAsset: 'USDT', name: 'Fantom', tradingViewSymbol: 'BYBIT:FTMUSDT', coinGeckoId: 'fantom' },
  { symbol: 'ANKRUSDT', baseAsset: 'ANKR', quoteAsset: 'USDT', name: 'Ankr', tradingViewSymbol: 'BYBIT:ANKRUSDT', coinGeckoId: 'ankr' },
  { symbol: 'CELOUSDT', baseAsset: 'CELO', quoteAsset: 'USDT', name: 'Celo', tradingViewSymbol: 'BYBIT:CELOUSDT', coinGeckoId: 'celo' },
  { symbol: 'KAVAUSDT', baseAsset: 'KAVA', quoteAsset: 'USDT', name: 'Kava', tradingViewSymbol: 'BYBIT:KAVAUSDT', coinGeckoId: 'kava' },
  { symbol: 'KDAUSDT', baseAsset: 'KDA', quoteAsset: 'USDT', name: 'Kadena', tradingViewSymbol: 'BYBIT:KDAUSDT', coinGeckoId: 'kadena' },
  { symbol: 'COREUSDT', baseAsset: 'CORE', quoteAsset: 'USDT', name: 'Core', tradingViewSymbol: 'BYBIT:COREUSDT', coinGeckoId: 'coredaoorg' }
];

// Helper functions
export const findPairBySymbol = (symbol: string): CryptoPair | undefined => {
  // First try exact match
  let pair = CRYPTO_PAIRS.find(pair => pair.symbol === symbol);
  
  // If no exact match, try different formats
  if (!pair) {
    // Try with USDT suffix if not present
    if (!symbol.includes('USDT')) {
      pair = CRYPTO_PAIRS.find(pair => pair.symbol === `${symbol}USDT`);
    }
    
    // Try matching by base asset
    if (!pair) {
      const baseAsset = symbol.replace('USDT', '').replace('/', '');
      pair = CRYPTO_PAIRS.find(pair => pair.baseAsset === baseAsset);
    }
    
    // Try matching symbol with different separators
    if (!pair) {
      const normalizedSymbol = symbol.replace('/', '').replace('-', '').toUpperCase();
      pair = CRYPTO_PAIRS.find(pair => 
        pair.symbol.replace('/', '').replace('-', '') === normalizedSymbol
      );
    }
  }
  
  return pair;
};

export const findPairByBaseAsset = (baseAsset: string): CryptoPair | undefined => {
  return CRYPTO_PAIRS.find(pair => pair.baseAsset === baseAsset);
};

export const getPairDisplayName = (pair: CryptoPair): string => {
  return `${pair.baseAsset}/${pair.quoteAsset}`;
};

export const getPairTradingViewSymbol = (symbol: string): string => {
  const pair = findPairBySymbol(symbol);
  return pair?.tradingViewSymbol || `BYBIT:${symbol}`;
};

export const getCryptoName = (symbol: string): string => {
  const pair = findPairByBaseAsset(symbol);
  return pair?.name || symbol;
};