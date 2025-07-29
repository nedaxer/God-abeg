import { ArrowLeft, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import CryptoLogo from '@/components/crypto-logo';

interface DepositAmountProps {
  onBack: () => void;
  onProceed: (amount: number) => void;
  selectedCrypto: string;
  selectedChain: string;
}

export function DepositAmount({ onBack, onProceed, selectedCrypto, selectedChain }: DepositAmountProps) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleAmountChange = (value: string) => {
    // Only allow numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  const handleProceed = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount)) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (numAmount < 500) {
      setError('Minimum deposit amount is $500');
      return;
    }
    
    if (numAmount > 1000000) {
      setError('Maximum deposit amount is $1,000,000');
      return;
    }
    
    onProceed(numAmount);
  };

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a2e] border-b border-gray-700/30">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-semibold text-white">Deposit Amount</h2>
        <div className="w-6 h-6" />
      </div>

      {/* Crypto Info */}
      <div className="p-4 border-b border-gray-700/30 bg-[#0a0a2e]">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <CryptoLogo 
              symbol={selectedCrypto}
              size={32}
              className="w-8 h-8"
            />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base">{selectedCrypto}</h3>
            <p className="text-gray-400 text-sm">{selectedChain}</p>
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="p-4 bg-[#0a0a2e] flex-1">
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-3">
            Enter Deposit Amount (USD)
          </label>
          
          <div className="relative">
            <Input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="500"
              className="bg-gray-800/50 border-gray-700/30 text-white text-lg py-6 text-center font-semibold"
              style={{ fontSize: '18px' }}
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Minimum Amount Info */}
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 mb-6">
          <div className="flex items-start space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0 mt-0.5"></div>
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Minimum Deposit</p>
              <p className="text-blue-100 text-xs">
                The minimum deposit amount is $500 USD. This ensures efficient processing and optimal transaction fees.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-3">Quick Select</p>
          <div className="grid grid-cols-3 gap-3">
            {[500, 1000, 2500].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => handleAmountChange(quickAmount.toString())}
                className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/30 rounded-lg py-3 px-4 text-white text-sm font-medium transition-colors"
              >
                ${quickAmount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Proceed Button */}
        <div className="fixed bottom-4 left-4 right-4">
          <Button
            onClick={handleProceed}
            disabled={!amount || parseFloat(amount) < 500}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-400 text-white py-4 text-lg font-semibold"
          >
            Proceed to Address
          </Button>
        </div>
      </div>
    </div>
  );
}