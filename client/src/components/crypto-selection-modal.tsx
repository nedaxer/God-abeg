import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import CryptoLogo from '@/components/crypto-logo';

interface CryptoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCrypto: (crypto: string) => void;
}

export function CryptoSelectionModal({ isOpen, onClose, onSelectCrypto }: CryptoSelectionModalProps) {
  const cryptos = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      networks: ['Bitcoin']
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      networks: ['ERC20']
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      networks: ['ERC20', 'TRC20', 'BSC']
    },
    {
      symbol: 'BNB',
      name: 'BNB',
      networks: ['BSC', 'BEP2']
    }
  ];

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

        {/* Crypto List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[60vh]">
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
        </div>
      </div>
    </div>
  );
}