import { useState, useEffect } from 'react';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';

interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
}

export default function CryptoConverter() {
  const [fromAmount, setFromAmount] = useState('1');
  const [toAmount, setToAmount] = useState('0');
  const [fromCurrency, setFromCurrency] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('ethereum');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const { data: cryptoData, isLoading } = useQuery<CryptoCurrency[]>({
    queryKey: ['/api/crypto/prices'],
    refetchInterval: 1000, // Update every second
    retry: 3
  });

  const fromCrypto = cryptoData?.find(crypto => crypto.id === fromCurrency);
  const toCrypto = cryptoData?.find(crypto => crypto.id === toCurrency);

  useEffect(() => {
    if (fromCrypto && toCrypto && fromAmount) {
      const fromValue = parseFloat(fromAmount);
      if (!isNaN(fromValue)) {
        const convertedAmount = (fromValue * fromCrypto.current_price) / toCrypto.current_price;
        setToAmount(convertedAmount.toFixed(8));
      }
    }
  }, [fromAmount, fromCrypto, toCrypto]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
  };

  const CurrencySelector = ({ 
    selectedCurrency, 
    onSelect, 
    showDropdown, 
    setShowDropdown 
  }: {
    selectedCurrency: string;
    onSelect: (currency: string) => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
  }) => {
    const selected = cryptoData?.find(crypto => crypto.id === selectedCurrency);
    
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
        >
          {selected?.image && (
            <img src={selected.image} alt={selected.name} className="w-5 h-5 rounded-full" />
          )}
          <span className="text-white font-medium">{selected?.symbol?.toUpperCase()}</span>
        </button>
        
        {showDropdown && cryptoData && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg max-h-60 overflow-y-auto z-50">
            {cryptoData.slice(0, 20).map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => {
                  onSelect(crypto.id);
                  setShowDropdown(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-700 transition-colors"
              >
                <img src={crypto.image} alt={crypto.name} className="w-5 h-5 rounded-full" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">{crypto.symbol?.toUpperCase()}</div>
                  <div className="text-gray-400 text-sm">{crypto.name}</div>
                </div>
                <div className="text-white text-sm">
                  ${crypto.current_price?.toFixed(crypto.current_price < 1 ? 6 : 2)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">Crypto Converter</h2>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <RefreshCw className="w-4 h-4" />
          <span>Live rates</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* From Currency */}
        <div className="space-y-2">
          <label className="text-gray-400 text-sm">From</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.00"
                className="bg-gray-800 border-gray-600 text-white text-lg h-12"
              />
            </div>
            <CurrencySelector
              selectedCurrency={fromCurrency}
              onSelect={setFromCurrency}
              showDropdown={showFromDropdown}
              setShowDropdown={setShowFromDropdown}
            />
          </div>
          {fromCrypto && (
            <div className="text-gray-400 text-sm">
              1 {fromCrypto.symbol?.toUpperCase()} = ${fromCrypto.current_price?.toFixed(fromCrypto.current_price < 1 ? 6 : 2)}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapCurrencies}
            className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full transition-colors"
          >
            <ArrowUpDown className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <label className="text-gray-400 text-sm">To</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.00"
                className="bg-gray-800 border-gray-600 text-white text-lg h-12"
              />
            </div>
            <CurrencySelector
              selectedCurrency={toCurrency}
              onSelect={setToCurrency}
              showDropdown={showToDropdown}
              setShowDropdown={setShowToDropdown}
            />
          </div>
          {toCrypto && (
            <div className="text-gray-400 text-sm">
              1 {toCrypto.symbol?.toUpperCase()} = ${toCrypto.current_price?.toFixed(toCrypto.current_price < 1 ? 6 : 2)}
            </div>
          )}
        </div>

        {/* Exchange Rate */}
        {fromCrypto && toCrypto && (
          <div className="bg-gray-800 rounded-lg p-4 mt-4">
            <div className="text-center">
              <div className="text-white text-lg font-semibold">
                1 {fromCrypto.symbol?.toUpperCase()} = {(fromCrypto.current_price / toCrypto.current_price).toFixed(8)} {toCrypto.symbol?.toUpperCase()}
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Real-time exchange rate
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}