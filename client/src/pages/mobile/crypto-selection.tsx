import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import MobileLayout from '@/components/mobile-layout';
import { ComingSoonModal } from '@/components/coming-soon-modal';
import { useLanguage } from '@/contexts/language-context';

const btcLogo = '/logos/btc-logo.svg';
const ethLogo = '/logos/eth-logo.svg';
const usdtLogo = '/logos/usdt-logo.svg';
const bnbLogo = '/logos/bnb-logo.svg';

interface CryptoSelectionProps {
  onBack: () => void;
  onSelectCrypto: (crypto: string) => void;
  onComingSoon: (feature: string) => void;
}

export function CryptoSelection({ onBack, onSelectCrypto, onComingSoon }: CryptoSelectionProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('crypto');
  const [searchQuery, setSearchQuery] = useState('');
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');

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
      networks: ['ETH', 'ETH (BEP-20)']
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
      networks: ['BEP-20']
    }
  ];

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobileLayout>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-950 border-b border-blue-700">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-semibold text-white">{t('select_crypto')}</h2>
        <div className="w-6 h-6" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-blue-700 bg-blue-950">
        <button
          onClick={() => setActiveTab('crypto')}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors text-sm ${
            activeTab === 'crypto'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Crypto
        </button>
        <button
          onClick={() => {
            setComingSoonFeature('Fiat Trading');
            setComingSoonOpen(true);
          }}
          className="flex-1 py-3 px-4 text-center font-medium text-gray-400 hover:text-white transition-colors text-sm"
        >
          Fiat
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-blue-700 bg-blue-950">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('search') + ' cryptocurrency'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-blue-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Crypto List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-blue-950">
        {filteredCryptos.map((crypto) => (
          <button
            key={crypto.symbol}
            onClick={() => onSelectCrypto(crypto.symbol)}
            className="w-full bg-blue-900 hover:bg-blue-800 rounded-lg p-3 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <img
                src={crypto.logo}
                alt={crypto.symbol}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 text-left">
                <div className="text-white font-medium text-sm">{crypto.symbol}</div>
                <div className="text-gray-400 text-xs">{crypto.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Networks: {crypto.networks.join(', ')}
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
        
        {filteredCryptos.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No cryptocurrencies found
          </div>
        )}
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        feature={comingSoonFeature}
      />
    </MobileLayout>
  );
}