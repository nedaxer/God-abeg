import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
const btcLogo = '/logos/btc-logo.svg';
const ethLogo = '/logos/eth-logo.svg';
const usdtLogo = '/logos/usdt-logo.svg';
const bnbLogo = '/logos/bnb-logo.svg';

interface CryptoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCrypto: (crypto: string) => void;
}

export function CryptoSelectionModal({ isOpen, onClose, onSelectCrypto }: CryptoSelectionModalProps) {
  const [activeTab, setActiveTab] = useState('crypto');
  const [searchQuery, setSearchQuery] = useState('');

  const cryptos = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      logo: btcLogo,
      networks: ['Bitcoin']
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      logo: ethLogo,
      networks: ['ERC20']
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      logo: usdtLogo,
      networks: ['ERC20', 'TRC20', 'BSC']
    },
    {
      symbol: 'BNB',
      name: 'BNB',
      logo: bnbLogo,
      networks: ['BSC', 'BEP2']
    }
  ];

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleComingSoon = () => {
    // Show coming soon for fiat tab
    alert('Coming Soon: Fiat deposits will be available soon!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a2e] rounded-t-2xl z-50 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1a1a40]">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-white">Select Cryptocurrency</h2>
          <div className="w-6 h-6" /> {/* Spacer */}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1a1a40]">
          <button
            onClick={() => setActiveTab('crypto')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'crypto'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Crypto
          </button>
          <button
            onClick={handleComingSoon}
            className="flex-1 py-3 px-4 text-center font-medium text-gray-400 hover:text-white transition-colors"
          >
            Fiat
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cryptocurrency"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Crypto List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[50vh]">
          {filteredCryptos.map((crypto) => (
            <button
              key={crypto.symbol}
              onClick={() => onSelectCrypto(crypto.symbol)}
              className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={crypto.logo}
                  alt={crypto.symbol}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">{crypto.symbol}</div>
                  <div className="text-gray-400 text-sm">{crypto.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Networks: {crypto.networks.join(', ')}
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
          
          {filteredCryptos.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No cryptocurrencies found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}