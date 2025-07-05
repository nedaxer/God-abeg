import axios from 'axios';

interface CryptoPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  name: string;
  tradingViewSymbol: string;
  coinGeckoId?: string;
  price?: number;
  change?: number;
}

// Top 130 crypto pairs verified to exist on both CoinGecko and Bybit
const CRYPTO_PAIRS: CryptoPair[] = [
  // Tier 1: Top 20 Market Cap
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
  { symbol: 'UNIUSDT', baseAsset: 'UNI', quoteAsset: 'USDT', name: 'Uniswap', tradingViewSymbol: 'BYBIT:UNIUSDT', coinGeckoId: 'uniswap' },
  { symbol: 'KASUSDT', baseAsset: 'KAS', quoteAsset: 'USDT', name: 'Kaspa', tradingViewSymbol: 'BYBIT:KASUSDT', coinGeckoId: 'kaspa' },

  // Tier 2: Rank 21-40
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
  { symbol: 'OPUSDT', baseAsset: 'OP', quoteAsset: 'USDT', name: 'Optimism', tradingViewSymbol: 'BYBIT:OPUSDT', coinGeckoId: 'optimism' },
  { symbol: 'AAVEUSDT', baseAsset: 'AAVE', quoteAsset: 'USDT', name: 'Aave', tradingViewSymbol: 'BYBIT:AAVEUSDT', coinGeckoId: 'aave' },
  { symbol: 'MKRUSDT', baseAsset: 'MKR', quoteAsset: 'USDT', name: 'Maker', tradingViewSymbol: 'BYBIT:MKRUSDT', coinGeckoId: 'maker' },

  // Tier 3: Rank 41-60
  { symbol: 'PYTHUSDT', baseAsset: 'PYTH', quoteAsset: 'USDT', name: 'Pyth Network', tradingViewSymbol: 'BYBIT:PYTHUSDT', coinGeckoId: 'pyth-network' },
  { symbol: 'SEIUSDT', baseAsset: 'SEI', quoteAsset: 'USDT', name: 'Sei', tradingViewSymbol: 'BYBIT:SEIUSDT', coinGeckoId: 'sei-network' },
  { symbol: 'FLOKIUSDT', baseAsset: 'FLOKI', quoteAsset: 'USDT', name: 'Floki', tradingViewSymbol: 'BYBIT:FLOKIUSDT', coinGeckoId: 'floki' },
  { symbol: 'LDOUSDT', baseAsset: 'LDO', quoteAsset: 'USDT', name: 'Lido DAO', tradingViewSymbol: 'BYBIT:LDOUSDT', coinGeckoId: 'lido-dao' },
  { symbol: 'GALAUSDT', baseAsset: 'GALA', quoteAsset: 'USDT', name: 'Gala', tradingViewSymbol: 'BYBIT:GALAUSDT', coinGeckoId: 'gala' },
  { symbol: 'TIAUSDT', baseAsset: 'TIA', quoteAsset: 'USDT', name: 'Celestia', tradingViewSymbol: 'BYBIT:TIAUSDT', coinGeckoId: 'celestia' },
  { symbol: 'SANDUSDT', baseAsset: 'SAND', quoteAsset: 'USDT', name: 'The Sandbox', tradingViewSymbol: 'BYBIT:SANDUSDT', coinGeckoId: 'the-sandbox' },
  { symbol: 'FTMUSDT', baseAsset: 'FTM', quoteAsset: 'USDT', name: 'Fantom', tradingViewSymbol: 'BYBIT:FTMUSDT', coinGeckoId: 'fantom' },
  { symbol: 'GRTUSDT', baseAsset: 'GRT', quoteAsset: 'USDT', name: 'The Graph', tradingViewSymbol: 'BYBIT:GRTUSDT', coinGeckoId: 'the-graph' },
  { symbol: 'BEAMUSDT', baseAsset: 'BEAM', quoteAsset: 'USDT', name: 'Beam', tradingViewSymbol: 'BYBIT:BEAMUSDT', coinGeckoId: 'beam-2' },
  { symbol: 'MINAUSDT', baseAsset: 'MINA', quoteAsset: 'USDT', name: 'Mina Protocol', tradingViewSymbol: 'BYBIT:MINAUSDT', coinGeckoId: 'mina-protocol' },
  { symbol: 'RUNEUSDT', baseAsset: 'RUNE', quoteAsset: 'USDT', name: 'THORChain', tradingViewSymbol: 'BYBIT:RUNEUSDT', coinGeckoId: 'thorchain' },
  { symbol: 'FLOWUSDT', baseAsset: 'FLOW', quoteAsset: 'USDT', name: 'Flow', tradingViewSymbol: 'BYBIT:FLOWUSDT', coinGeckoId: 'flow' },
  { symbol: 'QNTUSDT', baseAsset: 'QNT', quoteAsset: 'USDT', name: 'Quant', tradingViewSymbol: 'BYBIT:QNTUSDT', coinGeckoId: 'quant-network' },
  { symbol: 'JUPUSDT', baseAsset: 'JUP', quoteAsset: 'USDT', name: 'Jupiter', tradingViewSymbol: 'BYBIT:JUPUSDT', coinGeckoId: 'jupiter-exchange-solana' },
  { symbol: 'WUSDT', baseAsset: 'W', quoteAsset: 'USDT', name: 'Wormhole', tradingViewSymbol: 'BYBIT:WUSDT', coinGeckoId: 'wormhole' },
  { symbol: 'AXSUSDT', baseAsset: 'AXS', quoteAsset: 'USDT', name: 'Axie Infinity', tradingViewSymbol: 'BYBIT:AXSUSDT', coinGeckoId: 'axie-infinity' },
  { symbol: 'IMXUSDT', baseAsset: 'IMX', quoteAsset: 'USDT', name: 'Immutable X', tradingViewSymbol: 'BYBIT:IMXUSDT', coinGeckoId: 'immutable-x' },
  { symbol: 'ARKMUSDT', baseAsset: 'ARKM', quoteAsset: 'USDT', name: 'Arkham', tradingViewSymbol: 'BYBIT:ARKMUSDT', coinGeckoId: 'arkham' },
  { symbol: 'STRKUSDT', baseAsset: 'STRK', quoteAsset: 'USDT', name: 'Starknet', tradingViewSymbol: 'BYBIT:STRKUSDT', coinGeckoId: 'starknet' },

  // Tier 4: Rank 61-80
  { symbol: 'FETUSDT', baseAsset: 'FET', quoteAsset: 'USDT', name: 'Fetch.ai', tradingViewSymbol: 'BYBIT:FETUSDT', coinGeckoId: 'fetch-ai' },
  { symbol: 'CHZUSDT', baseAsset: 'CHZ', quoteAsset: 'USDT', name: 'Chiliz', tradingViewSymbol: 'BYBIT:CHZUSDT', coinGeckoId: 'chiliz' },
  { symbol: 'SNXUSDT', baseAsset: 'SNX', quoteAsset: 'USDT', name: 'Synthetix', tradingViewSymbol: 'BYBIT:SNXUSDT', coinGeckoId: 'havven' },
  { symbol: 'CRVUSDT', baseAsset: 'CRV', quoteAsset: 'USDT', name: 'Curve DAO', tradingViewSymbol: 'BYBIT:CRVUSDT', coinGeckoId: 'curve-dao-token' },
  { symbol: 'ENJUSDT', baseAsset: 'ENJ', quoteAsset: 'USDT', name: 'Enjin Coin', tradingViewSymbol: 'BYBIT:ENJUSDT', coinGeckoId: 'enjincoin' },
  { symbol: 'AXLUSDT', baseAsset: 'AXL', quoteAsset: 'USDT', name: 'Axelar', tradingViewSymbol: 'BYBIT:AXLUSDT', coinGeckoId: 'axelar' },
  { symbol: 'ETHFIUSDT', baseAsset: 'ETHFI', quoteAsset: 'USDT', name: 'Ether.fi', tradingViewSymbol: 'BYBIT:ETHFIUSDT', coinGeckoId: 'ether-fi' },
  { symbol: 'GMXUSDT', baseAsset: 'GMX', quoteAsset: 'USDT', name: 'GMX', tradingViewSymbol: 'BYBIT:GMXUSDT', coinGeckoId: 'gmx' },
  { symbol: 'APEUSDT', baseAsset: 'APE', quoteAsset: 'USDT', name: 'ApeCoin', tradingViewSymbol: 'BYBIT:APEUSDT', coinGeckoId: 'apecoin' },
  { symbol: 'DYDXUSDT', baseAsset: 'DYDX', quoteAsset: 'USDT', name: 'dYdX', tradingViewSymbol: 'BYBIT:DYDXUSDT', coinGeckoId: 'dydx' },
  { symbol: 'COMPUSDT', baseAsset: 'COMP', quoteAsset: 'USDT', name: 'Compound', tradingViewSymbol: 'BYBIT:COMPUSDT', coinGeckoId: 'compound-governance-token' },
  { symbol: 'ZETAUSDT', baseAsset: 'ZETA', quoteAsset: 'USDT', name: 'ZetaChain', tradingViewSymbol: 'BYBIT:ZETAUSDT', coinGeckoId: 'zetachain' },
  { symbol: 'MANAUSDT', baseAsset: 'MANA', quoteAsset: 'USDT', name: 'Decentraland', tradingViewSymbol: 'BYBIT:MANAUSDT', coinGeckoId: 'decentraland' },
  { symbol: 'ENSUSDT', baseAsset: 'ENS', quoteAsset: 'USDT', name: 'Ethereum Name Service', tradingViewSymbol: 'BYBIT:ENSUSDT', coinGeckoId: 'ethereum-name-service' },
  { symbol: 'SUSHIUSDT', baseAsset: 'SUSHI', quoteAsset: 'USDT', name: 'SushiSwap', tradingViewSymbol: 'BYBIT:SUSHIUSDT', coinGeckoId: 'sushi' },
  { symbol: 'ONDOUSDT', baseAsset: 'ONDO', quoteAsset: 'USDT', name: 'Ondo', tradingViewSymbol: 'BYBIT:ONDOUSDT', coinGeckoId: 'ondo-finance' },
  { symbol: 'YFIUSDT', baseAsset: 'YFI', quoteAsset: 'USDT', name: 'yearn.finance', tradingViewSymbol: 'BYBIT:YFIUSDT', coinGeckoId: 'yearn-finance' },
  { symbol: 'JASMYUSDT', baseAsset: 'JASMY', quoteAsset: 'USDT', name: 'JasmyCoin', tradingViewSymbol: 'BYBIT:JASMYUSDT', coinGeckoId: 'jasmycoin' },
  { symbol: 'JTOUSDT', baseAsset: 'JTO', quoteAsset: 'USDT', name: 'Jito', tradingViewSymbol: 'BYBIT:JTOUSDT', coinGeckoId: 'jito-governance-token' },
  { symbol: 'KSMUSDT', baseAsset: 'KSM', quoteAsset: 'USDT', name: 'Kusama', tradingViewSymbol: 'BYBIT:KSMUSDT', coinGeckoId: 'kusama' },

  // Tier 5: Rank 81-100
  { symbol: 'ZECUSDT', baseAsset: 'ZEC', quoteAsset: 'USDT', name: 'Zcash', tradingViewSymbol: 'BYBIT:ZECUSDT', coinGeckoId: 'zcash' },
  { symbol: 'BATUSDT', baseAsset: 'BAT', quoteAsset: 'USDT', name: 'Basic Attention Token', tradingViewSymbol: 'BYBIT:BATUSDT', coinGeckoId: 'basic-attention-token' },
  { symbol: 'CKBUSDT', baseAsset: 'CKB', quoteAsset: 'USDT', name: 'Nervos Network', tradingViewSymbol: 'BYBIT:CKBUSDT', coinGeckoId: 'nervos-network' },
  { symbol: 'EOSUSDT', baseAsset: 'EOS', quoteAsset: 'USDT', name: 'EOS', tradingViewSymbol: 'BYBIT:EOSUSDT', coinGeckoId: 'eos' },
  { symbol: 'GMTUSDT', baseAsset: 'GMT', quoteAsset: 'USDT', name: 'STEPN', tradingViewSymbol: 'BYBIT:GMTUSDT', coinGeckoId: 'stepn' },
  { symbol: 'ENAUSDT', baseAsset: 'ENA', quoteAsset: 'USDT', name: 'Ethena', tradingViewSymbol: 'BYBIT:ENAUSDT', coinGeckoId: 'ethena' },
  { symbol: 'ANKRUSDT', baseAsset: 'ANKR', quoteAsset: 'USDT', name: 'Ankr', tradingViewSymbol: 'BYBIT:ANKRUSDT', coinGeckoId: 'ankr' },
  { symbol: 'CELOUSDT', baseAsset: 'CELO', quoteAsset: 'USDT', name: 'Celo', tradingViewSymbol: 'BYBIT:CELOUSDT', coinGeckoId: 'celo' },
  { symbol: 'KAVAUSDT', baseAsset: 'KAVA', quoteAsset: 'USDT', name: 'Kava', tradingViewSymbol: 'BYBIT:KAVAUSDT', coinGeckoId: 'kava' },
  { symbol: 'KDAUSDT', baseAsset: 'KDA', quoteAsset: 'USDT', name: 'Kadena', tradingViewSymbol: 'BYBIT:KDAUSDT', coinGeckoId: 'kadena' },
  { symbol: 'COREUSDT', baseAsset: 'CORE', quoteAsset: 'USDT', name: 'Core', tradingViewSymbol: 'BYBIT:COREUSDT', coinGeckoId: 'coredaoorg' },
  { symbol: 'ONEUSDT', baseAsset: 'ONE', quoteAsset: 'USDT', name: 'Harmony', tradingViewSymbol: 'BYBIT:ONEUSDT', coinGeckoId: 'harmony' },
  { symbol: 'ZILUSDT', baseAsset: 'ZIL', quoteAsset: 'USDT', name: 'Zilliqa', tradingViewSymbol: 'BYBIT:ZILUSDT', coinGeckoId: 'zilliqa' },
  { symbol: 'WAVESUSDT', baseAsset: 'WAVES', quoteAsset: 'USDT', name: 'Waves', tradingViewSymbol: 'BYBIT:WAVESUSDT', coinGeckoId: 'waves' },
  { symbol: 'IOTXUSDT', baseAsset: 'IOTX', quoteAsset: 'USDT', name: 'IoTeX', tradingViewSymbol: 'BYBIT:IOTXUSDT', coinGeckoId: 'iotex' },
  { symbol: 'COTIUSDT', baseAsset: 'COTI', quoteAsset: 'USDT', name: 'COTI', tradingViewSymbol: 'BYBIT:COTIUSDT', coinGeckoId: 'coti' },
  { symbol: 'CFXUSDT', baseAsset: 'CFX', quoteAsset: 'USDT', name: 'Conflux', tradingViewSymbol: 'BYBIT:CFXUSDT', coinGeckoId: 'conflux-token' },
  { symbol: 'BANDUSDT', baseAsset: 'BAND', quoteAsset: 'USDT', name: 'Band Protocol', tradingViewSymbol: 'BYBIT:BANDUSDT', coinGeckoId: 'band-protocol' },
  { symbol: 'BTTUSDT', baseAsset: 'BTT', quoteAsset: 'USDT', name: 'BitTorrent', tradingViewSymbol: 'BYBIT:BTTUSDT', coinGeckoId: 'bittorrent' },
  { symbol: 'LRCUSDT', baseAsset: 'LRC', quoteAsset: 'USDT', name: 'Loopring', tradingViewSymbol: 'BYBIT:LRCUSDT', coinGeckoId: 'loopring' },

  // Tier 6: Rank 101-120
  { symbol: 'SKLUSDT', baseAsset: 'SKL', quoteAsset: 'USDT', name: 'SKALE Network', tradingViewSymbol: 'BYBIT:SKLUSDT', coinGeckoId: 'skale' },
  { symbol: 'STORJUSDT', baseAsset: 'STORJ', quoteAsset: 'USDT', name: 'Storj', tradingViewSymbol: 'BYBIT:STORJUSDT', coinGeckoId: 'storj' },
  { symbol: 'OCEANUSDT', baseAsset: 'OCEAN', quoteAsset: 'USDT', name: 'Ocean Protocol', tradingViewSymbol: 'BYBIT:OCEANUSDT', coinGeckoId: 'ocean-protocol' },
  { symbol: 'REEFUSDT', baseAsset: 'REEF', quoteAsset: 'USDT', name: 'Reef', tradingViewSymbol: 'BYBIT:REEFUSDT', coinGeckoId: 'reef-finance' },
  { symbol: 'SFPUSDT', baseAsset: 'SFP', quoteAsset: 'USDT', name: 'SafePal', tradingViewSymbol: 'BYBIT:SFPUSDT', coinGeckoId: 'safepal' },
  { symbol: 'CTSIUSDT', baseAsset: 'CTSI', quoteAsset: 'USDT', name: 'Cartesi', tradingViewSymbol: 'BYBIT:CTSIUSDT', coinGeckoId: 'cartesi' },
  { symbol: 'MTLUSDT', baseAsset: 'MTL', quoteAsset: 'USDT', name: 'Metal', tradingViewSymbol: 'BYBIT:MTLUSDT', coinGeckoId: 'metal' },
  { symbol: 'BNTUSDT', baseAsset: 'BNT', quoteAsset: 'USDT', name: 'Bancor', tradingViewSymbol: 'BYBIT:BNTUSDT', coinGeckoId: 'bancor' },
  { symbol: 'ALPACAUSDT', baseAsset: 'ALPACA', quoteAsset: 'USDT', name: 'Alpaca Finance', tradingViewSymbol: 'BYBIT:ALPACAUSDT', coinGeckoId: 'alpaca-finance' },
  { symbol: 'HOTUSDT', baseAsset: 'HOT', quoteAsset: 'USDT', name: 'Holo', tradingViewSymbol: 'BYBIT:HOTUSDT', coinGeckoId: 'holo' },
  { symbol: 'RVNUSDT', baseAsset: 'RVN', quoteAsset: 'USDT', name: 'Ravencoin', tradingViewSymbol: 'BYBIT:RVNUSDT', coinGeckoId: 'ravencoin' },
  { symbol: 'SCUSDT', baseAsset: 'SC', quoteAsset: 'USDT', name: 'Siacoin', tradingViewSymbol: 'BYBIT:SCUSDT', coinGeckoId: 'siacoin' },
  { symbol: 'DCRUSDT', baseAsset: 'DCR', quoteAsset: 'USDT', name: 'Decred', tradingViewSymbol: 'BYBIT:DCRUSDT', coinGeckoId: 'decred' },
  { symbol: 'ZENUSDT', baseAsset: 'ZEN', quoteAsset: 'USDT', name: 'Horizen', tradingViewSymbol: 'BYBIT:ZENUSDT', coinGeckoId: 'zencash' },
  { symbol: 'DIGUSDT', baseAsset: 'DIG', quoteAsset: 'USDT', name: 'Dig Chain', tradingViewSymbol: 'BYBIT:DIGUSDT', coinGeckoId: 'dig-chain' },
  { symbol: 'STMXUSDT', baseAsset: 'STMX', quoteAsset: 'USDT', name: 'StormX', tradingViewSymbol: 'BYBIT:STMXUSDT', coinGeckoId: 'stormx' },
  { symbol: 'SLPUSDT', baseAsset: 'SLP', quoteAsset: 'USDT', name: 'Smooth Love Potion', tradingViewSymbol: 'BYBIT:SLPUSDT', coinGeckoId: 'smooth-love-potion' },
  { symbol: 'DASHUSDT', baseAsset: 'DASH', quoteAsset: 'USDT', name: 'Dash', tradingViewSymbol: 'BYBIT:DASHUSDT', coinGeckoId: 'dash' },
  { symbol: 'XEMAUSDT', baseAsset: 'XEM', quoteAsset: 'USDT', name: 'NEM', tradingViewSymbol: 'BYBIT:XEMUSDT', coinGeckoId: 'nem' },
  { symbol: 'LSKUSDT', baseAsset: 'LSK', quoteAsset: 'USDT', name: 'Lisk', tradingViewSymbol: 'BYBIT:LSKUSDT', coinGeckoId: 'lisk' },

  // Tier 7: Rank 121-130
  { symbol: 'DGBUSDT', baseAsset: 'DGB', quoteAsset: 'USDT', name: 'DigiByte', tradingViewSymbol: 'BYBIT:DGBUSDT', coinGeckoId: 'digibyte' },
  { symbol: 'FUNUSDT', baseAsset: 'FUN', quoteAsset: 'USDT', name: 'FunFair', tradingViewSymbol: 'BYBIT:FUNUSDT', coinGeckoId: 'funfair' },
  { symbol: 'KEYUSDT', baseAsset: 'KEY', quoteAsset: 'USDT', name: 'SelfKey', tradingViewSymbol: 'BYBIT:KEYUSDT', coinGeckoId: 'selfkey' },
  { symbol: 'PUNDIXUSDT', baseAsset: 'PUNDIX', quoteAsset: 'USDT', name: 'Pundi X', tradingViewSymbol: 'BYBIT:PUNDIXUSDT', coinGeckoId: 'pundi-x-new' },
  { symbol: 'WAXPUSDT', baseAsset: 'WAXP', quoteAsset: 'USDT', name: 'WAX', tradingViewSymbol: 'BYBIT:WAXPUSDT', coinGeckoId: 'wax' },
  { symbol: 'TCTUSDT', baseAsset: 'TCT', quoteAsset: 'USDT', name: 'TokenClub', tradingViewSymbol: 'BYBIT:TCTUSDT', coinGeckoId: 'tokenclub' },
  { symbol: 'EGLAUSDT', baseAsset: 'EGLA', quoteAsset: 'USDT', name: 'Egretia', tradingViewSymbol: 'BYBIT:EGLAUSDT', coinGeckoId: 'egretia' },
  { symbol: 'BTGUSDT', baseAsset: 'BTG', quoteAsset: 'USDT', name: 'Bitcoin Gold', tradingViewSymbol: 'BYBIT:BTGUSDT', coinGeckoId: 'bitcoin-gold' },
  { symbol: 'ELFUSDT', baseAsset: 'ELF', quoteAsset: 'USDT', name: 'aelf', tradingViewSymbol: 'BYBIT:ELFUSDT', coinGeckoId: 'aelf' }
];

interface CoinGeckoPrice {
  usd: number;
  usd_24h_change: number;
  usd_24h_vol: number;
  usd_market_cap: number;
}

interface CryptoTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  high24h?: number;
  low24h?: number;
}

export async function getCoinGeckoPrices(): Promise<CryptoTicker[]> {
  try {
    const API_KEY = process.env.COINGECKO_API_KEY || '';
    console.log('🔑 CoinGecko API key check:', API_KEY ? 'Present' : 'Missing');
    
    if (!API_KEY) {
      throw new Error('CoinGecko API key not configured');
    }

    // Comprehensive list of coins to match CRYPTO_PAIRS
    const comprehensiveCoins = [
      // Tier 1: Top cryptocurrencies
      'bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana', 'ripple', 'dogecoin', 'cardano',
      'tron', 'avalanche-2', 'chainlink', 'the-open-network', 'shiba-inu', 'sui', 'polkadot',
      'bitcoin-cash', 'litecoin', 'pepe', 'usd-coin', 'arbitrum', 'cosmos', 'algorand',
      'vechain', 'render-token', 'hedera-hashgraph', 'mantle', 'near', 'filecoin', 'blockstack',
      'maker', 'stellar', 'kaspa', 'immutable-x', 'optimism', 'okb', 'first-digital-usd',
      'polygon', 'ethereum-classic', 'monero', 'kucoin-shares', 'internet-computer', 'uniswap',
      'fantom', 'whitebit', 'ondo-finance', 'aave', 'bittorrent-new', 'floki', 'lido-dao',
      'cronos', 'bonk', 'jupiter-exchange-solana', 'worldcoin-wld', 'sei-network', 'compound',
      'wormhole', 'aptos', 'beam-2', 'conflux-token', 'thorchain', 'matic-network', 'pyth-network',
      'celestia', 'akash-network', 'the-sandbox', 'injective-protocol', 'gala', 'flow',
      'theta-token', 'helium', 'quant-network', 'nexo', 'kava', 'the-graph', 'blur',
      'decentraland', 'curve-dao-token', 'pancakeswap-token', 'chiliz', 'sushi', 'gmx',
      'flare-networks', 'axie-infinity', 'synthetix-network-token', 'mask-network', 'livepeer',
      'trust-wallet-token', 'enjin-coin', 'frax-share', 'stepn', 'ocean-protocol',
      'havven', 'dydx', 'loopring', 'fetch-ai', 'singularitynet', 'basic-attention-token',
      'sandbox', 'zcash', 'dash', 'nervos-network', 'eos', 'ethena', 'ankr', 'celo',
      'kadena', 'coredaoorg', 'harmony', 'zilliqa', 'waves', 'iotex', 'coti', 'band-protocol',
      'bittorrent', 'ravencoin', 'siacoin', 'decred', 'zencash', 'stormx', 'smooth-love-potion',
      'nem', 'lisk'
    ];
    
    console.log('🚀 Fetching CoinGecko prices for comprehensive coins:', comprehensiveCoins.length);

    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids: comprehensiveCoins.join(','),
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

    console.log('✅ CoinGecko API response status:', response.status);
    console.log('📊 CoinGecko data received for coins:', Object.keys(response.data));

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
      'polygon': { symbol: 'MATIC', name: 'Polygon' },
      'ethereum-classic': { symbol: 'ETC', name: 'Ethereum Classic' },
      'monero': { symbol: 'XMR', name: 'Monero' },
      'kucoin-shares': { symbol: 'KCS', name: 'KuCoin Token' },
      'internet-computer': { symbol: 'ICP', name: 'Internet Computer' },
      'uniswap': { symbol: 'UNI', name: 'Uniswap' },
      'fantom': { symbol: 'FTM', name: 'Fantom' },
      'whitebit': { symbol: 'WBT', name: 'WhiteBIT Token' },
      'ondo-finance': { symbol: 'ONDO', name: 'Ondo' },
      'aave': { symbol: 'AAVE', name: 'Aave' },
      'bittorrent-new': { symbol: 'BTT', name: 'BitTorrent' },
      'floki': { symbol: 'FLOKI', name: 'FLOKI' },
      'lido-dao': { symbol: 'LDO', name: 'Lido DAO' },
      'cronos': { symbol: 'CRO', name: 'Cronos' },
      'bonk': { symbol: 'BONK', name: 'Bonk' },
      'jupiter-exchange-solana': { symbol: 'JUP', name: 'Jupiter' },
      'worldcoin-wld': { symbol: 'WLD', name: 'Worldcoin' },
      'sei-network': { symbol: 'SEI', name: 'Sei' },
      'compound': { symbol: 'COMP', name: 'Compound' },
      'wormhole': { symbol: 'W', name: 'Wormhole' },
      'aptos': { symbol: 'APT', name: 'Aptos' },
      'beam-2': { symbol: 'BEAM', name: 'Beam' },
      'conflux-token': { symbol: 'CFX', name: 'Conflux' },
      'thorchain': { symbol: 'RUNE', name: 'THORChain' },
      'matic-network': { symbol: 'MATIC', name: 'Polygon' },
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
      'flare-networks': { symbol: 'FLR', name: 'Flare' },
      'axie-infinity': { symbol: 'AXS', name: 'Axie Infinity' },
      'synthetix-network-token': { symbol: 'SNX', name: 'Synthetix' },
      'mask-network': { symbol: 'MASK', name: 'Mask Network' },
      'livepeer': { symbol: 'LPT', name: 'Livepeer' },
      'trust-wallet-token': { symbol: 'TWT', name: 'Trust Wallet Token' },
      'enjin-coin': { symbol: 'ENJ', name: 'Enjin Coin' },
      'frax-share': { symbol: 'FXS', name: 'Frax Share' },
      'stepn': { symbol: 'GMT', name: 'STEPN' },
      'ocean-protocol': { symbol: 'OCEAN', name: 'Ocean Protocol' },
      'havven': { symbol: 'SNX', name: 'Synthetix' },
      'dydx': { symbol: 'DYDX', name: 'dYdX' },
      'loopring': { symbol: 'LRC', name: 'Loopring' },
      'fetch-ai': { symbol: 'FET', name: 'Fetch.ai' },
      'singularitynet': { symbol: 'AGIX', name: 'SingularityNET' },
      'basic-attention-token': { symbol: 'BAT', name: 'Basic Attention Token' },
      'sandbox': { symbol: 'SAND', name: 'The Sandbox' },
      'zcash': { symbol: 'ZEC', name: 'Zcash' },
      'dash': { symbol: 'DASH', name: 'Dash' },
      'nervos-network': { symbol: 'CKB', name: 'Nervos Network' },
      'eos': { symbol: 'EOS', name: 'EOS' },
      'ethena': { symbol: 'ENA', name: 'Ethena' },
      'ankr': { symbol: 'ANKR', name: 'Ankr' },
      'celo': { symbol: 'CELO', name: 'Celo' },
      'kadena': { symbol: 'KDA', name: 'Kadena' },
      'coredaoorg': { symbol: 'CORE', name: 'Core' },
      'harmony': { symbol: 'ONE', name: 'Harmony' },
      'zilliqa': { symbol: 'ZIL', name: 'Zilliqa' },
      'waves': { symbol: 'WAVES', name: 'Waves' },
      'iotex': { symbol: 'IOTX', name: 'IoTeX' },
      'coti': { symbol: 'COTI', name: 'COTI' },
      'band-protocol': { symbol: 'BAND', name: 'Band Protocol' },
      'bittorrent': { symbol: 'BTT', name: 'BitTorrent' },
      'ravencoin': { symbol: 'RVN', name: 'Ravencoin' },
      'siacoin': { symbol: 'SC', name: 'Siacoin' },
      'decred': { symbol: 'DCR', name: 'Decred' },
      'zencash': { symbol: 'ZEN', name: 'Horizen' },
      'stormx': { symbol: 'STMX', name: 'StormX' },
      'smooth-love-potion': { symbol: 'SLP', name: 'Smooth Love Potion' },
      'nem': { symbol: 'XEM', name: 'NEM' },
      'lisk': { symbol: 'LSK', name: 'Lisk' }
    };
    
    const tickers: CryptoTicker[] = [];
    let successCount = 0;
    
    for (const [coinId, coinInfo] of Object.entries(coinMapping)) {
      if (response.data[coinId]) {
        const coinData: CoinGeckoPrice = response.data[coinId];
        tickers.push({
          symbol: coinInfo.symbol,
          name: coinInfo.name,
          price: coinData.usd,
          change: coinData.usd_24h_change || 0,
          volume: coinData.usd_24h_vol || 0,
          marketCap: coinData.usd_market_cap || 0
        });
        console.log(`✅ ${coinInfo.symbol}: $${coinData.usd.toFixed(coinData.usd > 1 ? 2 : 6)} (${coinData.usd_24h_change >= 0 ? '+' : ''}${coinData.usd_24h_change?.toFixed(2)}%)`);
        successCount++;
      } else {
        console.log(`❌ Missing data for ${coinId} (${coinInfo.symbol})`);
      }
    }

    console.log(`🎉 Successfully fetched ${successCount} crypto prices`);
    return tickers;
  } catch (error) {
    console.error('CoinGecko API error:', error);
    throw error;
  }
}

export async function getCoinGeckoPrice(coinGeckoId: string): Promise<CryptoTicker | null> {
  try {
    const API_KEY = process.env.COINGECKO_API_KEY || '';
    if (!API_KEY) {
      throw new Error('CoinGecko API key not configured');
    }

    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids: coinGeckoId,
        vs_currencies: 'usd',
        include_24hr_change: 'true',
        include_24hr_vol: 'true',
        include_market_cap: 'true'
      },
      headers: {
        'x-cg-demo-api-key': API_KEY
      },
      timeout: 10000
    });

    if (response.data[coinGeckoId]) {
      const coinData: CoinGeckoPrice = response.data[coinGeckoId];
      const pair = CRYPTO_PAIRS.find(p => p.coinGeckoId === coinGeckoId);
      
      return {
        symbol: pair?.symbol || coinGeckoId.toUpperCase(),
        name: pair?.name || coinGeckoId,
        price: coinData.usd,
        change: coinData.usd_24h_change || 0,
        volume: coinData.usd_24h_vol || 0,
        marketCap: coinData.usd_market_cap || 0
      };
    }

    return null;
  } catch (error) {
    console.error(`CoinGecko price fetch error for ${coinGeckoId}:`, error);
    return null;
  }
}

// Helper function to get symbol from coinGeckoId
export function getSymbolFromCoinGeckoId(coinGeckoId: string): string {
  const pair = CRYPTO_PAIRS.find(p => p.coinGeckoId === coinGeckoId);
  return pair?.symbol || `${coinGeckoId.toUpperCase()}USDT`;
}

// Helper function to get name from coinGeckoId
export function getNameFromCoinGeckoId(coinGeckoId: string): string {
  const pair = CRYPTO_PAIRS.find(p => p.coinGeckoId === coinGeckoId);
  return pair?.name || coinGeckoId;
}