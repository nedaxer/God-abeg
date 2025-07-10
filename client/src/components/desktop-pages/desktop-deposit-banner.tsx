// @ts-nocheck
// TypeScript error suppression for development productivity
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QRCode from 'qrcode';
import { CryptoLogo } from '@/components/crypto-logo';
import { 
  X, 
  Wallet, 
  CreditCard, 
  Banknote, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Copy,
  QrCode
} from 'lucide-react';

interface DesktopDepositBannerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCrypto: string;
  selectedChain: string;
  onCryptoSelect: (crypto: string) => void;
  onChainSelect: (chain: string) => void;
}

export default function DesktopDepositBanner({
  isOpen,
  onClose,
  selectedCrypto,
  selectedChain,
  onCryptoSelect,
  onChainSelect
}: DesktopDepositBannerProps) {
  const [currentStep, setCurrentStep] = useState<'method' | 'crypto' | 'chain' | 'address'>('method');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Reset modal state when closed
  const handleClose = () => {
    setCurrentStep('method');
    setCopied(false);
    setQrCodeUrl('');
    onClose();
  };

  // Same wallet addresses from mobile deposit system
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
      'ERC20': '0x126975caaf44D603307a95E2d2670F6Ef46e563C'
    },
    'BNB': {
      'BSC': '0x126975caaf44D603307a95E2d2670F6Ef46e563C'
    }
  };

  const minimumAmounts = {
    'USDT': '0.000006',
    'BTC': '0.000006',
    'ETH': '0.00001',
    'BNB': '0.0001'
  };

  // Get current address for QR code generation
  const getCurrentAddress = () => {
    if (!selectedCrypto || !selectedChain) return '';

    const cryptoAddresses = addresses[selectedCrypto as keyof typeof addresses];
    if (!cryptoAddresses) return '';

    // Map chain names to match the address object keys
    const chainKey = selectedChain.includes('Bitcoin') ? 'Bitcoin' :
                    selectedChain.includes('ERC20') || selectedChain.includes('Ethereum') ? 'ERC20' :
                    selectedChain.includes('TRC20') ? 'TRC20' :
                    selectedChain.includes('BSC') ? 'BSC' : selectedChain;

    return cryptoAddresses[chainKey as keyof typeof cryptoAddresses] || '';
  };

  // Generate QR code when address changes
  useEffect(() => {
    const address = getCurrentAddress();
    if (address) {
      QRCode.toDataURL(address, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeUrl).catch(console.error);
    }
  }, [selectedCrypto, selectedChain]);

  const handleCopyAddress = async () => {
    const address = getCurrentAddress();
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  const handleMethodSelect = (method: string) => {
    if (method === 'crypto') {
      setCurrentStep('crypto');
    }
  };

  const handleCryptoSelection = (crypto: string) => {
    onCryptoSelect(crypto);
    setCurrentStep('chain');
  };

  const handleChainSelection = (chain: string) => {
    onChainSelect(chain);
    setCurrentStep('address');
  };

  const handleBack = () => {
    if (currentStep === 'crypto') {
      setCurrentStep('method');
    } else if (currentStep === 'chain') {
      setCurrentStep('crypto');
    } else if (currentStep === 'address') {
      setCurrentStep('chain');
    }
  };

  const cryptoOptions = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'BNB', name: 'BNB' }
  ];

  const chainOptions = {
    BTC: [{ name: 'Bitcoin Network', fee: '~0.0005 BTC', time: '30-60 min' }],
    ETH: [{ name: 'ERC20', fee: '~0.005 ETH', time: '5-15 min' }],
    USDT: [
      { name: 'ERC20', fee: '~15 USDT', time: '5-15 min' },
      { name: 'TRC20', fee: '~1 USDT', time: '1-3 min' },
      { name: 'BSC', fee: '~0.5 USDT', time: '1-3 min' }
    ],
    BNB: [{ name: 'BSC', fee: '~0.001 BNB', time: '1-3 min' }]
  };

  


  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Background overlay that closes modal when clicked */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={handleClose}
      />
      
      <Card className="relative w-full max-w-2xl mx-4 bg-[#0a0a2e]/95 backdrop-blur-sm border border-gray-700 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            {currentStep !== 'method' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-1 hover:bg-gray-800 text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <CardTitle className="text-xl font-semibold text-white">
              {currentStep === 'method' && 'Select Deposit Method'}
              {currentStep === 'crypto' && 'Select Cryptocurrency'}
              {currentStep === 'chain' && 'Select Network'}
              {currentStep === 'address' && 'Deposit Address'}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-1 hover:bg-gray-800 text-white hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Method Selection */}
          {currentStep === 'method' && (
            <div className="space-y-4">
              <div 
                onClick={() => handleMethodSelect('crypto')}
                className="p-4 border-2 border-gray-600 rounded-lg hover:border-orange-500 cursor-pointer transition-colors group bg-gray-800/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <Wallet className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Deposit with Crypto</h3>
                      <p className="text-sm text-gray-300">Deposit cryptocurrency to your wallet</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500" />
                </div>
              </div>

              <div className="p-4 border-2 border-gray-600 rounded-lg opacity-50 cursor-not-allowed bg-gray-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-700 rounded-lg">
                      <CreditCard className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-300">Buy with Card</h3>
                      <p className="text-sm text-gray-400">Coming soon</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300">Soon</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Crypto Selection */}
          {currentStep === 'crypto' && (
            <div className="grid grid-cols-2 gap-3">
              {cryptoOptions.map((crypto) => (
                <div
                  key={crypto.symbol}
                  onClick={() => handleCryptoSelection(crypto.symbol)}
                  className="p-4 border-2 border-gray-600 rounded-lg hover:border-orange-500 cursor-pointer transition-colors group bg-gray-800/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                      <CryptoLogo symbol={crypto.symbol} size={40} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{crypto.symbol}</h3>
                      <p className="text-sm text-gray-300">{crypto.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chain Selection */}
          {currentStep === 'chain' && selectedCrypto && (
            <div className="space-y-3">
              {chainOptions[selectedCrypto as keyof typeof chainOptions]?.map((chain, index) => (
                <div
                  key={index}
                  onClick={() => handleChainSelection(chain.name)}
                  className="p-4 border-2 border-gray-600 rounded-lg hover:border-orange-500 cursor-pointer transition-colors group bg-gray-800/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{chain.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-300">Fee: {chain.fee}</p>
                        <p className="text-sm text-gray-300">Time: {chain.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Address Display */}
          {currentStep === 'address' && selectedCrypto && selectedChain && (
            <div className="space-y-4">
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-medium text-orange-300">Important Notice</span>
                </div>
                <p className="text-sm text-orange-200">
                  Only send {selectedCrypto} to this address on {selectedChain} network. 
                  Sending other cryptocurrencies or wrong network may result in permanent loss.
                </p>
              </div>

              <div className="text-center space-y-4">
                {/* QR Code */}
                <div className="w-48 h-48 bg-white border-2 border-gray-600 rounded-lg mx-auto flex items-center justify-center p-2">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="Deposit Address QR Code" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="h-32 w-32 text-gray-400" />
                  )}
                </div>

                {/* Address Section */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">Deposit Address</p>
                  <div className="flex items-center space-x-2 p-3 bg-gray-800/50 border border-gray-600 rounded-lg">
                    <code className="flex-1 text-sm font-mono text-white break-all">
                      {getCurrentAddress()}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCopyAddress}
                      className="p-1 hover:bg-gray-700 text-gray-300"
                    >
                      {copied ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-400">Address copied to clipboard!</p>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <p className="text-gray-400">Minimum Deposit</p>
                    <p className="font-semibold text-white">
                      {minimumAmounts[selectedCrypto as keyof typeof minimumAmounts]} {selectedCrypto}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400">Network</p>
                    <p className="font-semibold text-white">{selectedChain}</p>
                  </div>
                </div>

                {/* Processing Info */}
                <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">Processing Information</span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>• Deposits are processed automatically after network confirmations</p>
                    <p>• Processing time varies by network congestion</p>
                    <p>• Contact support if deposit doesn't appear within expected time</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}