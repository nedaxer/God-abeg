import { ArrowLeft, Copy, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import MobileLayout from '@/components/mobile-layout';
import { useLanguage } from '@/contexts/language-context';

const btcLogo = '/logos/btc-logo.svg';
const ethLogo = '/logos/eth-logo.svg';
const usdtLogo = '/logos/usdt-logo.svg';
const bnbLogo = '/logos/bnb-logo.svg';

interface AddressDisplayProps {
  onBack: () => void;
  selectedCrypto: string;
  selectedChain: string;
}

const addresses = {
  'USDT': {
    'ERC20': '0x126975caaf44D603307a95E2d2670F6Ef46e563C',
    'TRC20': 'THA5iGZk9mBq5742scd9NsvqAPiJcgt4QL',
    'BSC': '0x126975caaf44D603307a95E2d2670F6Ef46e563C'
  },
  'BTC': {
    'Bitcoin': 'bc1qq35fj5pxkwflsrlt4xk8jta5wx22qy4knnt2q2'
  },
  'ETH': {
    'ETH': '0x126975caaf44D603307a95E2d2670F6Ef46e563C',
    'ETH (BEP-20)': '0x126975caaf44D603307a95E2d2670F6Ef46e563C'
  },
  'BNB': {
    'BEP-20': '0x126975caaf44D603307a95E2d2670F6Ef46e563C'
  }
};

const minimumAmounts = {
  'USDT': '0.000006',
  'BTC': '0.000006',
  'ETH': '0.00001',
  'BNB': '0.0001'
};

export function AddressDisplay({ onBack, selectedCrypto, selectedChain }: AddressDisplayProps) {
  const { t } = useLanguage();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const address = addresses[selectedCrypto as keyof typeof addresses]?.[selectedChain as keyof typeof addresses[keyof typeof addresses]] || '';
  const minAmount = minimumAmounts[selectedCrypto as keyof typeof minimumAmounts] || '0.000001';

  useEffect(() => {
    if (address) {
      QRCode.toDataURL(address, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeUrl).catch(console.error);
    }
  }, [address]);

  const getCryptoIcon = (crypto: string) => {
    switch (crypto) {
      case 'USDT':
        return usdtLogo;
      case 'BTC':
        return btcLogo;
      case 'ETH':
        return ethLogo;
      case 'BNB':
        return bnbLogo;
      default:
        return btcLogo;
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const saveQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${selectedCrypto}_${selectedChain}_address.png`;
      link.click();
    }
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-950 border-b border-blue-700">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-semibold text-white">{t('deposit_address')}</h2>
        <div className="w-6 h-6" />
      </div>

      {/* Crypto Info */}
      <div className="p-4 border-b border-blue-700 bg-blue-950">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={getCryptoIcon(selectedCrypto)}
            alt={selectedCrypto}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="text-white font-semibold text-base">{selectedCrypto}</h3>
            <p className="text-gray-400 text-sm">{selectedChain}</p>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="p-4 bg-blue-950">
        <div className="bg-white rounded-xl p-4 mb-4 flex justify-center">
          {qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="w-48 h-48"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">Loading QR Code...</span>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="bg-blue-900 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">Deposit Address</span>
            <button
              onClick={copyAddress}
              className="flex items-center space-x-1 text-orange-500 hover:text-orange-400"
            >
              <Copy className="w-3 h-3" />
              <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-white text-xs break-all font-mono">{address}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button 
            onClick={copyAddress}
            className="bg-blue-800 hover:bg-gray-600 text-white text-sm py-2"
          >
            <Copy className="w-4 h-4 mr-2" />
            {t('copy_address')}
          </Button>
          <Button 
            onClick={saveQRCode}
            className="bg-blue-800 hover:bg-gray-600 text-white text-sm py-2"
          >
            <Save className="w-4 h-4 mr-2" />
            {t('save_image')}
          </Button>
        </div>

        {/* Important Info */}
        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-200 text-xs font-medium mb-1">Important Notice</p>
              <ul className="text-yellow-100 text-xs space-y-1">
                <li>• Only send {selectedCrypto} to this address</li>
                <li>• Minimum deposit: {minAmount} {selectedCrypto}</li>
                <li>• Sending other tokens may result in permanent loss</li>
                <li>• Network: {selectedChain}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Network Details */}
        <div className="bg-blue-900 rounded-lg p-3">
          <h4 className="text-white text-sm font-medium mb-2">Network Information</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Network</span>
              <span className="text-white text-xs">{selectedChain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Minimum Deposit</span>
              <span className="text-white text-xs">{minAmount} {selectedCrypto}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Expected Confirmations</span>
              <span className="text-white text-xs">
                {selectedChain === 'Bitcoin' ? '3' : selectedChain === 'TRC20' ? '1' : '12'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}