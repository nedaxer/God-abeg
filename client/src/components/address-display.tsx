import { ArrowLeft, Copy, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
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
    'BSC(BEP-20)': '0x126975caaf44D603307a95E2d2670F6Ef46e563C'
  },
  'BTC': {
    'BTC': 'bc1qq35fj5pxkwflsrlt4xk8jta5wx22qy4knnt2q2'
  },
  'ETH': {
    'ETH': '0x126975caaf44D603307a95E2d2670F6Ef46e563C',
    'ETH(BEP-20)': '0x126975caaf44D603307a95E2d2670F6Ef46e563C'
  },
  'BEP-20': {
    'BEP-20': '0x126975caaf44D603307a95E2d2670F6Ef46e563C'
  }
};

const minimumAmounts = {
  'USDT': '0.000006',
  'BTC': '0.000006',
  'ETH': '0.00001',
  'BEP-20': '0.0001'
};

export function AddressDisplay({ onBack, selectedCrypto, selectedChain }: AddressDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const address = addresses[selectedCrypto as keyof typeof addresses]?.[selectedChain as keyof typeof addresses[keyof typeof addresses]] || '';
  const minAmount = minimumAmounts[selectedCrypto as keyof typeof minimumAmounts] || '0.000001';

  useEffect(() => {
    if (address) {
      QRCode.toDataURL(address, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeUrl);
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
      link.download = `${selectedCrypto}-${selectedChain}-address.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a2e]">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center">
              <img 
                src={getCryptoIcon(selectedCrypto)} 
                alt={selectedCrypto}
                className="w-4 h-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const span = document.createElement('span');
                  span.className = 'text-xs font-bold text-white';
                  span.textContent = selectedCrypto.charAt(0);
                  e.currentTarget.parentElement!.replaceChildren(span);
                }}
              />
            </div>
            <h1 className="text-lg font-semibold">{selectedCrypto}-Deposit</h1>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 grid grid-cols-2 gap-px">
            <div className="bg-gray-400 rounded-sm"></div>
            <div className="bg-gray-400 rounded-sm"></div>
            <div className="bg-gray-400 rounded-sm"></div>
            <div className="bg-gray-400 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Network Selection */}
      <div className="px-4 py-2">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Network:</span>
          <span className="text-white font-medium">{selectedChain}</span>
          <button className="text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* QR Code */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg p-4 mx-auto w-fit">
          {qrCodeUrl ? (
            <div className="relative">
              <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <img 
                    src={getCryptoIcon(selectedCrypto)} 
                    alt={selectedCrypto}
                    className="w-5 h-5"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const span = document.createElement('span');
                      span.className = 'text-xs font-bold text-white';
                      span.textContent = selectedCrypto.charAt(0);
                      e.currentTarget.parentElement!.appendChild(span);
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-64 h-64 bg-gray-200 animate-pulse rounded"></div>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div className="px-4 space-y-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Wallet Address</span>
            <button className="text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-mono text-sm break-all">{address}</span>
            <button 
              onClick={copyAddress}
              className="ml-3 p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Minimum Deposit Amount</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-white">{minAmount} {selectedCrypto}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Route Deposits To</span>
            <div className="flex items-center space-x-1">
              <span className="text-white">Funding Account</span>
              <button className="text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Deposit Arrival</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-white">1 confirmations</span>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Withdrawal Unlocked</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-white">2 confirmations</span>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="px-4 py-6">
        <div className="text-xs text-gray-400 space-y-2">
          <p>
            <span className="text-orange-500 underline cursor-pointer">View all deposit and withdrawal statuses?</span>
          </p>
          <p>
            In upholding the integrity and safety of our platform's trading environment, Nedaxer is 
            dedicated to combating financial crime and ensuring adherence to anti-money 
            laundering measures.
          </p>
          <p>
            Please make sure that only {selectedCrypto} deposit is made via this address. Otherwise, your 
            deposited funds will not be added to your available balance — nor will it be refunded.
          </p>
          <p>
            Please make sure that your Nedaxer deposit address is correct. Otherwise, your deposited 
            funds will not be added to your available balance — nor will it be refunded.
          </p>
          {selectedChain.includes('BEP') && (
            <p>BEP2 and BEP20 (BSC) deposits not supported.</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-8">
        <div className="flex space-x-3">
          <Button 
            onClick={saveQRCode}
            variant="outline" 
            className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Picture
          </Button>
          <Button 
            onClick={copyAddress}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? 'Copied!' : 'Copy Address'}
          </Button>
        </div>
      </div>
    </div>
  );
}