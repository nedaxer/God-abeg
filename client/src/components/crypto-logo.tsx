import { useState } from 'react';

interface CryptoLogoProps {
  symbol: string;
  size?: number;
  className?: string;
}

// CoinGecko logo mapping for major cryptocurrencies
const COINGECKO_LOGO_BASE = 'https://assets.coingecko.com/coins/images';

const LOGO_MAPPING: Record<string, string> = {
  'BTC': `${COINGECKO_LOGO_BASE}/1/large/bitcoin.png`,
  'ETH': `${COINGECKO_LOGO_BASE}/279/large/ethereum.png`,
  'USDT': `${COINGECKO_LOGO_BASE}/325/large/Tether.png`,
  'BNB': `${COINGECKO_LOGO_BASE}/825/large/bnb-icon2_2x.png`,
  'SOL': `${COINGECKO_LOGO_BASE}/4128/large/solana.png`,
  'XRP': `${COINGECKO_LOGO_BASE}/44/large/xrp-symbol-white-128.png`,
  'DOGE': `${COINGECKO_LOGO_BASE}/5/large/dogecoin.png`,
  'ADA': `${COINGECKO_LOGO_BASE}/975/large/cardano.png`,
  'TRX': `${COINGECKO_LOGO_BASE}/1094/large/tronix.png`,
  'AVAX': `${COINGECKO_LOGO_BASE}/12559/large/Avalanche_Circle_RedWhite_Trans.png`,
  'LINK': `${COINGECKO_LOGO_BASE}/877/large/chainlink-new-logo.png`,
  'TON': `${COINGECKO_LOGO_BASE}/17980/large/ton_symbol.png`,
  'SHIB': `${COINGECKO_LOGO_BASE}/11939/large/shiba.png`,
  'SUI': `${COINGECKO_LOGO_BASE}/26375/large/sui_asset.jpeg`,
  'DOT': `${COINGECKO_LOGO_BASE}/12171/large/polkadot.png`,
  'BCH': `${COINGECKO_LOGO_BASE}/780/large/bitcoin-cash-circle.png`,
  'LTC': `${COINGECKO_LOGO_BASE}/2/large/litecoin.png`,
  'PEPE': `${COINGECKO_LOGO_BASE}/29850/large/pepe-token.jpeg`,
  'USDC': `${COINGECKO_LOGO_BASE}/6319/large/USD_Coin_icon.png`,
  'ARB': `${COINGECKO_LOGO_BASE}/16547/large/photo_2023-03-29_21.47.00.jpeg`,
  'ATOM': `${COINGECKO_LOGO_BASE}/1481/large/cosmos_hub.png`,
  'ALGO': `${COINGECKO_LOGO_BASE}/4030/large/algorand.png`,
  'VET': `${COINGECKO_LOGO_BASE}/1167/large/VeChain-Logo-768x725.png`,
  'RNDR': `${COINGECKO_LOGO_BASE}/11636/large/rndr.png`,
  'HBAR': `${COINGECKO_LOGO_BASE}/3688/large/hbar.png`,
  'MNT': `${COINGECKO_LOGO_BASE}/30980/large/token-logo.png`,
  'NEAR': `${COINGECKO_LOGO_BASE}/10365/large/near.jpg`,
  'FIL': `${COINGECKO_LOGO_BASE}/12817/large/filecoin.png`,
  'STX': `${COINGECKO_LOGO_BASE}/2069/large/Stacks_logo_full.png`,
  'MKR': `${COINGECKO_LOGO_BASE}/1364/large/Mark_Maker.png`,
  'XLM': `${COINGECKO_LOGO_BASE}/100/large/Stellar_symbol_black_RGB.png`,
  'KAS': `${COINGECKO_LOGO_BASE}/25751/large/kaspa-icon-exchanges.png`,
  'IMX': `${COINGECKO_LOGO_BASE}/17233/large/immutableX-symbol-BLK-RGB.png`,
  'OP': `${COINGECKO_LOGO_BASE}/25244/large/Optimism.png`,
  'OKB': `${COINGECKO_LOGO_BASE}/4455/large/OKB.png`,
  'FDUSD': `${COINGECKO_LOGO_BASE}/31079/large/firstdigitalusd.jpeg`,
  'ETC': `${COINGECKO_LOGO_BASE}/453/large/ethereum-classic-logo.png`,
  'XMR': `${COINGECKO_LOGO_BASE}/69/large/monero_logo.png`,
  'KCS': `${COINGECKO_LOGO_BASE}/1047/large/sa9z79.png`,
  'ICP': `${COINGECKO_LOGO_BASE}/14495/large/Internet_Computer_logo.png`,
  'UNI': `${COINGECKO_LOGO_BASE}/12504/large/uni.jpg`,
  'FTM': `${COINGECKO_LOGO_BASE}/4001/large/Fantom_round.png`,
  'WBT': `${COINGECKO_LOGO_BASE}/7598/large/wrapped_bitcoin_wbtc.png`,
  'ONDO': `${COINGECKO_LOGO_BASE}/26580/large/ONDO.png`,
  'AAVE': `${COINGECKO_LOGO_BASE}/12645/large/AAVE.png`,
  'FLOKI': `${COINGECKO_LOGO_BASE}/16746/large/floki.jpeg`,
  'LDO': `${COINGECKO_LOGO_BASE}/13573/large/Lido_DAO.png`,
  'CRO': `${COINGECKO_LOGO_BASE}/7310/large/cypto.png`,
  'BONK': `${COINGECKO_LOGO_BASE}/28600/large/bonk.jpg`,
  'JUP': `${COINGECKO_LOGO_BASE}/25237/large/jup.png`,
  'WLD': `${COINGECKO_LOGO_BASE}/31069/large/worldcoin.jpeg`,
  'SEI': `${COINGECKO_LOGO_BASE}/28205/large/Sei_Logo_-_Transparent.png`,
  'W': `${COINGECKO_LOGO_BASE}/32154/large/wormhole.jpg`,
  'APT': `${COINGECKO_LOGO_BASE}/26455/large/aptos_round.png`,
  'BEAM': `${COINGECKO_LOGO_BASE}/32417/large/chain-icon-beam.png`,
  'CFX': `${COINGECKO_LOGO_BASE}/7334/large/conflux-network.png`,
  'RUNE': `${COINGECKO_LOGO_BASE}/6704/large/thorchain.png`,
  'PYTH': `${COINGECKO_LOGO_BASE}/31069/large/pyth-network.png`,
  'TIA': `${COINGECKO_LOGO_BASE}/31967/large/tia.jpg`,
  'AKT': `${COINGECKO_LOGO_BASE}/14788/large/akash-logo.png`,
  'SAND': `${COINGECKO_LOGO_BASE}/12493/large/The_Sandbox.png`,
  'INJ': `${COINGECKO_LOGO_BASE}/12882/large/Secondary_Symbol.png`,
  'GALA': `${COINGECKO_LOGO_BASE}/12493/large/GALA-COINGECKO.png`,
  'FLOW': `${COINGECKO_LOGO_BASE}/13446/large/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.png`,
  'THETA': `${COINGECKO_LOGO_BASE}/2416/large/theta-token-logo.png`,
  'HNT': `${COINGECKO_LOGO_BASE}/9730/large/helium.png`,
  'QNT': `${COINGECKO_LOGO_BASE}/3370/large/ton_symbol.png`,
  'NEXO': `${COINGECKO_LOGO_BASE}/3685/large/nexo.png`,
  'KAVA': `${COINGECKO_LOGO_BASE}/9761/large/kava.png`,
  'GRT': `${COINGECKO_LOGO_BASE}/13397/large/Graph_Token.png`,
  'BLUR': `${COINGECKO_LOGO_BASE}/28453/large/blur.png`,
  'MANA': `${COINGECKO_LOGO_BASE}/878/large/decentraland-mana.png`,
  'CRV': `${COINGECKO_LOGO_BASE}/12124/large/Curve.png`,
  'CAKE': `${COINGECKO_LOGO_BASE}/12632/large/IMG_0440.png`,
  'CHZ': `${COINGECKO_LOGO_BASE}/8834/large/Chiliz.png`,
  'SUSHI': `${COINGECKO_LOGO_BASE}/12271/large/512x512_Logo_no_chop.png`,
  'GMX': `${COINGECKO_LOGO_BASE}/18323/large/gmx.png`,
  'GMT': `${COINGECKO_LOGO_BASE}/25015/large/stepn.png`,
  'SNX': `${COINGECKO_LOGO_BASE}/3406/large/SNX.png`,
  'DYDX': `${COINGECKO_LOGO_BASE}/17500/large/hjnIm9bV.jpg`,
  'FET': `${COINGECKO_LOGO_BASE}/5681/large/Fetch.jpg`,
  'BAT': `${COINGECKO_LOGO_BASE}/677/large/basic-attention-token.png`,
  'ZEC': `${COINGECKO_LOGO_BASE}/486/large/circle-zcash-color.png`,
  'CKB': `${COINGECKO_LOGO_BASE}/13978/large/ckb.png`,
  'EOS': `${COINGECKO_LOGO_BASE}/738/large/eos-eos-logo.png`,
  'ENA': `${COINGECKO_LOGO_BASE}/33052/large/ena.png`,
  'ANKR': `${COINGECKO_LOGO_BASE}/6833/large/photo_2021-04-12_10-14-11.jpg`,
  'CELO': `${COINGECKO_LOGO_BASE}/11090/large/icon-celo-CELO-color-500.png`,
  'KDA': `${COINGECKO_LOGO_BASE}/3713/large/kadena.png`,
  'CORE': `${COINGECKO_LOGO_BASE}/25111/large/core-dao.png`
};

 function CryptoLogo({ symbol, size = 32, className = '' }: CryptoLogoProps) {
  const [imageError, setImageError] = useState(false);
  const logoUrl = LOGO_MAPPING[symbol.toUpperCase()];

  // Fallback to text avatar if no logo or image fails to load
  if (!logoUrl || imageError) {
    return (
      <div 
        className={`flex items-center justify-center rounded-full bg-gray-600 text-white font-bold text-xs ${className}`}
        style={{ width: size, height: size }}
      >
        {symbol.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${symbol} logo`}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}

export default CryptoLogo;
export { CryptoLogo };