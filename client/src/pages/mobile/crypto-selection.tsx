import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ComingSoonModal } from '@/components/coming-soon-modal';
import { useLanguage } from '@/contexts/language-context';
import CryptoLogo from '@/components/crypto-logo';

interface CryptoSelectionProps {
  onBack: () => void;
  onSelectCrypto: (crypto: string) => void;
  onComingSoon: (feature: string) => void;
}

export function CryptoSelection({ onBack, onSelectCrypto, onComingSoon }: CryptoSelectionProps) {
  const { t } = useLanguage();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');

  const cryptos = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      networks: ['Bitcoin']
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      networks: ['ETH', 'ETH (BEP-20)']
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      networks: ['ERC20', 'TRC20', 'BSC']
    },
    {
      symbol: 'BNB',
      name: 'BNB',
      networks: ['BEP-20']
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a2e] border-b border-gray-700/30">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-base font-semibold text-white">{t('select_crypto')}</h2>
        <div className="w-6 h-6" />
      </div>

      {/* Crypto List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#0a0a2e]">
        {cryptos.map((crypto) => (
          <button
            key={crypto.symbol}
            onClick={() => onSelectCrypto(crypto.symbol)}
            className="w-full bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-4 transition-colors border border-gray-700/30"
          >
            <div className="flex items-center space-x-3">
              <CryptoLogo
                symbol={crypto.symbol}
                size={40}
                className="w-10 h-10"
              />
              <div className="flex-1 text-left">
                <div className="text-white font-semibold text-base">{crypto.symbol}</div>
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
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        feature={comingSoonFeature}
      />
    </div>
  );
}