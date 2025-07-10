import { ArrowLeft } from 'lucide-react';
import MobileLayout from '@/components/mobile-layout';
import { useLanguage } from '@/contexts/language-context';
import CryptoLogo from '@/components/crypto-logo';

interface NetworkSelectionProps {
  onBack: () => void;
  selectedCrypto: string;
  onSelectChain: (chain: string) => void;
}

export function NetworkSelection({ onBack, selectedCrypto, onSelectChain }: NetworkSelectionProps) {
  const { t } = useLanguage();
  const getCryptoInfo = (crypto: string) => {
    switch (crypto) {
      case 'BTC':
        return {
          symbol: 'BTC',
          name: 'Bitcoin',
          chains: [
            { 
              name: 'Bitcoin', 
              network: 'Bitcoin Network', 
              fee: '~0.0005 BTC',
              time: '30-60 min'
            }
          ]
        };
      case 'ETH':
        return {
          symbol: 'ETH',
          name: 'Ethereum',
          chains: [
            { 
              name: 'ETH', 
              network: 'Ethereum Network', 
              fee: '~0.005 ETH',
              time: '5-15 min'
            },
            { 
              name: 'ETH (BEP-20)', 
              network: 'BNB Smart Chain', 
              fee: '~0.001 ETH',
              time: '1-3 min'
            }
          ]
        };
      case 'USDT':
        return {
          symbol: 'USDT',
          name: 'Tether',
          chains: [
            { 
              name: 'ERC20', 
              network: 'Ethereum Network', 
              fee: '~15 USDT',
              time: '5-15 min'
            },
            { 
              name: 'TRC20', 
              network: 'TRON Network', 
              fee: '~1 USDT',
              time: '1-3 min'
            },
            { 
              name: 'BSC', 
              network: 'BNB Smart Chain', 
              fee: '~0.5 USDT',
              time: '1-3 min'
            }
          ]
        };
      case 'BNB':
        return {
          symbol: 'BNB',
          name: 'BNB',
          chains: [
            { 
              name: 'BEP-20', 
              network: 'BNB Smart Chain', 
              fee: '~0.001 BNB',
              time: '1-3 min'
            }
          ]
        };
      default:
        return { symbol: '', name: '', chains: [] };
    }
  };

  const cryptoInfo = getCryptoInfo(selectedCrypto);

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a2e] border-b border-gray-700/30">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-semibold text-white">{t('select_network')}</h2>
        <div className="w-6 h-6" />
      </div>

      {/* Selected Crypto Info */}
      <div className="p-4 border-b border-gray-700/30 bg-[#0a0a2e]">
        <div className="flex items-center space-x-3">
          <CryptoLogo
            symbol={selectedCrypto}
            size={40}
            className="w-10 h-10"
          />
          <div>
            <h3 className="text-white font-semibold text-base">{selectedCrypto}</h3>
            <p className="text-gray-400 text-sm">{cryptoInfo.name}</p>
          </div>
        </div>
      </div>

      {/* Chain List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#0a0a2e]">
        {cryptoInfo.chains.map((chain) => (
          <button
            key={chain.name}
            onClick={() => onSelectChain(chain.name)}
            className="w-full bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-4 transition-colors border border-gray-700/30"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-sm">{chain.name}</span>
                  {chain.name === 'TRC20' && (
                    <span className="bg-green-600 text-green-100 text-xs px-2 py-1 rounded">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="text-gray-400 text-xs">{chain.network}</div>
                <div className="text-gray-500 text-xs mt-1">
                  Fee: {chain.fee} • {chain.time}
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Warning */}
      <div className="p-4 bg-yellow-900/20 border-t border-gray-700/30">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 text-yellow-500 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-yellow-200 text-xs font-medium">Important</p>
            <p className="text-yellow-100 text-xs">
              Only send {selectedCrypto} to this address. Sending other tokens may result in permanent loss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}