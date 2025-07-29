import { ArrowLeft, Copy, Save, X, CheckCircle2, Upload as UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import QRCode from 'qrcode';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/hooks/use-auth';
import CryptoLogo from '@/components/crypto-logo';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DepositAddressPageProps {
  onBack: () => void;
  onCancel: () => void;
  selectedCrypto: string;
  selectedChain: string;
  depositAmount: number;
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

export function DepositAddressPage({ onBack, onCancel, selectedCrypto, selectedChain, depositAmount }: DepositAddressPageProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const address = addresses[selectedCrypto as keyof typeof addresses]?.[selectedChain as keyof typeof addresses[keyof typeof addresses]] || '';
  const minAmount = 0.0001

  useEffect(() => {
    if (address) {
      QRCode.toDataURL(address, {
        width: 240,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      }).then(setQrCodeUrl).catch(console.error);
    }
  }, [address]);

  useEffect(() => {
    const createPendingDeposit = async () => {
      try {
        await apiRequest('/api/deposits/pending', {
          method: 'POST',
          data: {
            cryptoSymbol: selectedCrypto,
            chainType: selectedChain,
            depositAddress: address,
            usdAmount: depositAmount
          }
        });
      } catch (error) {
        console.error('Error creating pending deposit:', error);
      }
    };

    if (selectedCrypto && selectedChain && depositAmount && address) {
      createPendingDeposit();
    }
  }, [selectedCrypto, selectedChain, depositAmount, address]);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setReceiptImage(null);
    setReceiptPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitReceipt = async () => {
    if (!receiptImage) {
      toast({
        title: "Receipt Required",
        description: "Please upload a payment receipt before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert image to base64 for direct submission
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(receiptImage);
      });

      const receiptFileBase64 = await base64Promise;

      // Submit the deposit receipt with all required details
      const response = await apiRequest('/api/deposits/submit-receipt', {
        method: 'POST',
        data: {
          cryptoSymbol: selectedCrypto,
          chainType: selectedChain,
          usdAmount: depositAmount.toString(),
          depositAddress: address,
          receiptFile: receiptFileBase64
        }
      });

      console.log('✅ Deposit receipt submitted successfully:', response);

      // Show success banner first
      setShowSuccessBanner(true);

      // Show toast notification
      toast({
        title: "Receipt Submitted Successfully!",
        description: "Your deposit is now pending approval. You'll be notified once it's processed.",
      });

      // Navigate to assets page after a longer delay to show the success banner
      setTimeout(() => {
        navigate('/mobile/assets');
      }, 4000);

    } catch (error: any) {
      console.error('Error submitting receipt:', error);
      // Show specific error message if available
      const errorMessage = error?.data?.message || error?.message || 'Failed to submit receipt. Please try again.';
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white">
      {/* Success Banner - Centered */}
      {showSuccessBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 shadow-2xl max-w-sm mx-4 border-2 border-green-400 animate-fade-in-scale">
            <div className="text-center space-y-4">
              <div className="bg-white/20 rounded-full p-3 mx-auto w-fit">
                <CheckCircle2 className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xl mb-2">Receipt Submitted Successfully!</h4>
                <p className="text-green-100 text-base font-medium">Your deposit is pending approval. You'll be notified once processed.</p>
              </div>
              <button 
                onClick={() => setShowSuccessBanner(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a2e] border-b border-gray-700/30">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold text-white">Deposit Address</h2>
        <button onClick={onCancel} className="text-red-400 hover:text-red-300 text-sm">
          Cancel
        </button>
      </div>

      {/* Crypto Info */}
      <div className="p-4 border-b border-gray-700/30 bg-[#0a0a2e]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <CryptoLogo 
                symbol={selectedCrypto}
                size={32}
                className="w-8 h-8"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{selectedCrypto}</h3>
              <p className="text-gray-300 text-base font-medium">{selectedChain}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-orange-500 font-bold text-xl">${depositAmount.toLocaleString()}</p>
            <p className="text-gray-300 text-base font-medium">Deposit Amount</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* QR Code with Coin Logo */}
        <div className="bg-white rounded-xl p-6 mb-6 flex justify-center relative">
          {qrCodeUrl ? (
            <div className="relative">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-56 h-56"
              />
              {/* Coin Logo Overlay in Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CryptoLogo 
                    symbol={selectedCrypto}
                    size={32}
                    className="w-8 h-8"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-56 h-56 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-base font-medium">Loading QR Code...</span>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 text-sm font-semibold">Deposit Address</span>
            <button
              onClick={copyAddress}
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-white text-sm break-all font-mono bg-gray-900/30 p-3 rounded-lg">{address}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button 
            onClick={copyAddress}
            className="bg-gray-800/50 hover:bg-gray-700/50 text-white text-base font-semibold py-3 border border-gray-700/30 rounded-xl transition-all"
          >
            <Copy className="w-5 h-5 mr-2" />
            Copy Address
          </Button>
          <Button 
            onClick={saveQRCode}
            className="bg-gray-800/50 hover:bg-gray-700/50 text-white text-base font-semibold py-3 border border-gray-700/30 rounded-xl transition-all"
          >
            <Save className="w-5 h-5 mr-2" />
            Save QR
          </Button>
        </div>

        {/* Important Warning */}
        <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4 mb-8">
          <div className="flex items-start space-x-2">
            <div>
              <ul className="text-red-100 text-sm space-y-2 font-medium">
                <li>• Send exactly ${depositAmount.toLocaleString()} worth of {selectedCrypto}</li>
                <li>• Only send {selectedCrypto} to this address via {selectedChain} network</li>
                <li>• Upload payment receipt after sending</li>
                <li>• Manual verification required - allow 1-24 hours</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Receipt Upload Section */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 mb-6">
          <h4 className="text-white text-base font-bold mb-4">Upload Payment Receipt</h4>

          {!receiptPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 transition-colors"
            >
              <UploadIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-300 text-base font-semibold mb-2">Tap to upload receipt</p>
              <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={receiptPreview}
                alt="Receipt preview"
                className="w-full max-h-48 object-contain rounded-lg bg-gray-900"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-1"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-4 left-4 right-4">
        <Button
          onClick={handleSubmitReceipt}
          disabled={!receiptImage || isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-400 text-white py-4 text-lg font-bold rounded-xl transition-all"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Payment Receipt'}
        </Button>
      </div>
    </div>
  );
}