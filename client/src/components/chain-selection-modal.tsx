import { ArrowLeft } from 'lucide-react';
const btcLogo = '/logos/btc-logo.svg';
const ethLogo = '/logos/eth-logo.svg';
const usdtLogo = '/logos/usdt-logo.svg';
const bnbLogo = '/logos/bnb-logo.svg';

interface ChainSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  selectedCrypto: string;
  onSelectChain: (chain: string) => void;
}

export function ChainSelectionModal({ 
  isOpen, 
  onClose, 
  onBack, 
  selectedCrypto, 
  onSelectChain 
}: ChainSelectionModalProps) {
  const getCryptoInfo = (crypto: string) => {
    switch (crypto) {
      case 'BTC':
        return {
          logo: btcLogo,
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
          logo: ethLogo,
          name: 'Ethereum',
          chains: [
            { 
              name: 'ERC20', 
              network: 'Ethereum Network', 
              fee: '~0.005 ETH',
              time: '5-15 min'
            }
          ]
        };
      case 'USDT':
        return {
          logo: usdtLogo,
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
          logo: bnbLogo,
          name: 'BNB',
          chains: [
            { 
              name: 'BSC', 
              network: 'BNB Smart Chain', 
              fee: '~0.001 BNB',
              time: '1-3 min'
            },
            { 
              name: 'BEP2', 
              network: 'BNB Beacon Chain', 
              fee: '~0.000375 BNB',
              time: '1-3 min'
            }
          ]
        };
      default:
        return { logo: '', name: '', chains: [] };
    }
  };

  const cryptoInfo = getCryptoInfo(selectedCrypto);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl z-50 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-white">Select Network</h2>
          <div className="w-6 h-6" /> {/* Spacer */}
        </div>

        {/* Selected Crypto Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={cryptoInfo.logo}
              alt={selectedCrypto}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-white font-semibold text-lg">{selectedCrypto}</h3>
              <p className="text-gray-400">{cryptoInfo.name}</p>
            </div>
          </div>
        </div>

        {/* Chain List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cryptoInfo.chains.map((chain) => (
            <button
              key={chain.name}
              onClick={() => onSelectChain(chain.name)}
              className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{chain.name}</span>
                    {chain.name === 'TRC20' && (
                      <span className="bg-green-600 text-green-100 text-xs px-2 py-1 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm">{chain.network}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    Fee: {chain.fee} • {chain.time}
                  </div>
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Warning */}
        <div className="p-4 bg-yellow-900/20 border-t border-gray-700">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 text-yellow-500 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-yellow-200 text-sm font-medium">Important</p>
              <p className="text-yellow-100 text-xs">
                Only send {selectedCrypto} to this address. Sending other tokens may result in permanent loss.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}