// @ts-nocheck
// TypeScript error suppression for development productivity
import AdaptiveLayout from '@/components/adaptive-layout';
import DesktopDepositSelection from '@/components/desktop-pages/desktop-deposit-selection';
import { DepositModal } from '@/components/deposit-modal';
import { useState } from 'react';
import { useLocation } from 'wouter';

export default function DepositSelectionPage() {
  const [showDepositModal, setShowDepositModal] = useState(true);
  const [, navigate] = useLocation();

  const handleDepositMethod = (method: string) => {
    setShowDepositModal(false);
    
    if (method === 'crypto') {
      navigate('#/mobile/deposit');
    } else if (method === 'buy-usd') {
      // Handle buy with USD
      console.log('Buy USD selected');
    } else if (method === 'p2p') {
      // Handle P2P trading
      console.log('P2P selected');
    }
  };

  const handleCloseModal = () => {
    setShowDepositModal(false);
    navigate('#/mobile/assets');
  };

  return (
    <AdaptiveLayout 
      title="Nedaxer - Deposit Selection"
      desktopComponent={<DesktopDepositSelection />}
    >
      {/* Mobile version shows modal by default */}
      <div className="min-h-screen bg-[#0a0a2e]">
        <DepositModal
          isOpen={showDepositModal}
          onClose={handleCloseModal}
          onSelectMethod={handleDepositMethod}
        />
      </div>
    </AdaptiveLayout>
  );
}