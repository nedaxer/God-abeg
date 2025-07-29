import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import MobileLayout from '@/components/mobile-layout';
import { CryptoSelection } from '@/pages/mobile/crypto-selection';
import { NetworkSelection } from '@/pages/mobile/network-selection';
import { DepositAmount } from './deposit-amount';
import { AddressDisplay } from '@/pages/mobile/address-display';
import { DepositAddressPage } from './deposit-address-page';
import { useLanguage } from '@/contexts/language-context';

type DepositView = 'crypto-selection' | 'network-selection' | 'deposit-amount' | 'address-generation' | 'deposit-address';

export default function MobileDeposit() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [currentView, setCurrentView] = useState<DepositView>('crypto-selection');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [depositAmount, setDepositAmount] = useState(0);

  // Check for existing pending deposit on mount
  useEffect(() => {
    const checkPendingDeposit = async () => {
      try {
        const response = await fetch('/api/deposits/pending');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // User has pending deposit, go to deposit address page
            const pending = data.data;
            setSelectedCrypto(pending.cryptoSymbol);
            setSelectedChain(pending.chainType);
            setDepositAmount(pending.usdAmount);
            setCurrentView('deposit-address');
          }
        }
      } catch (error) {
        console.error('Error checking pending deposit:', error);
      }
    };

    checkPendingDeposit();
  }, []);

  const handleCryptoSelect = (crypto: string) => {
    setSelectedCrypto(crypto);
    setCurrentView('network-selection');
  };

  const handleChainSelect = (chain: string) => {
    setSelectedChain(chain);
    setCurrentView('deposit-amount');
  };

  const handleAmountSubmit = (amount: number) => {
    setDepositAmount(amount);
    setCurrentView('address-generation');
    
    // Show loading for 2 seconds then proceed to deposit address page
    setTimeout(() => {
      setCurrentView('deposit-address');
    }, 3000);
  };

  const handleBackFromCrypto = () => {
    navigate('/mobile/assets');
  };

  const handleBackFromNetwork = () => {
    setCurrentView('crypto-selection');
  };

  const handleBackFromAmount = () => {
    setCurrentView('network-selection');
  };

  const handleBackFromAddress = () => {
    // Navigate to assets page, not back to amount selection
    navigate('/mobile/assets');
  };

  const handleCancelDeposit = async () => {
    try {
      await fetch('/api/deposits/pending', {
        method: 'DELETE',
      });
      // Reset to crypto selection
      setSelectedCrypto('');
      setSelectedChain('');
      setDepositAmount(0);
      setCurrentView('crypto-selection');
    } catch (error) {
      console.error('Error canceling deposit:', error);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'crypto-selection':
        return (
          <CryptoSelection
            onBack={handleBackFromCrypto}
            onSelectCrypto={handleCryptoSelect}
            onComingSoon={() => {}}
          />
        );

      case 'network-selection':
        return (
          <NetworkSelection
            onBack={handleBackFromNetwork}
            onSelectChain={handleChainSelect}
            selectedCrypto={selectedCrypto}
          />
        );

      case 'deposit-amount':
        return (
          <DepositAmount
            onBack={handleBackFromAmount}
            onProceed={handleAmountSubmit}
            selectedCrypto={selectedCrypto}
            selectedChain={selectedChain}
          />
        );

      case 'address-generation':
        return (
          <div className="min-h-screen bg-[#0a0a2e] text-white flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Generating deposit address...</h2>
              <p className="text-gray-400">Please wait while we prepare your deposit address</p>
            </div>
          </div>
        );

      case 'deposit-address':
        return (
          <DepositAddressPage
            onBack={handleBackFromAddress}
            onCancel={handleCancelDeposit}
            selectedCrypto={selectedCrypto}
            selectedChain={selectedChain}
            depositAmount={depositAmount}
          />
        );

      default:
        return null;
    }
  };

  return renderCurrentView();
}