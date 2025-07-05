import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { X, Wallet, Shield, ArrowRight, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface TransferDepositRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMakeDeposit: () => void;
}

export function TransferDepositRequiredModal({ 
  isOpen, 
  onClose, 
  onMakeDeposit 
}: TransferDepositRequiredModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user's withdrawal restriction message
  const { data: withdrawalRestrictionData } = useQuery({
    queryKey: ['/api/user/withdrawal-restriction'],
    enabled: isOpen,
  });

  useEffect(() => {
    const bottomNav = document.querySelector('[data-navigation="bottom"]') as HTMLElement;
    const mobileLayout = document.querySelector('[data-layout="mobile"]') as HTMLElement;
    
    if (isOpen) {
      // Blur bottom navigation
      if (bottomNav) {
        bottomNav.style.filter = 'blur(4px)';
        bottomNav.style.transition = 'filter 0.3s ease-out';
      }
      
      // Blur main content
      if (mobileLayout) {
        mobileLayout.style.filter = 'blur(2px)';
        mobileLayout.style.transition = 'filter 0.3s ease-out';
      }
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Remove blur effects
      if (bottomNav) {
        bottomNav.style.filter = 'none';
      }
      if (mobileLayout) {
        mobileLayout.style.filter = 'none';
      }
      
      // Restore scrolling
      document.body.style.overflow = 'auto';
    }

    // Cleanup function
    return () => {
      if (bottomNav) {
        bottomNav.style.filter = 'none';
      }
      if (mobileLayout) {
        mobileLayout.style.filter = 'none';
      }
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleDepositClick = () => {
    onClose();
    onMakeDeposit();
  };

  return createPortal(
    <div 
      className="transfer-deposit-modal-overlay fixed inset-0" 
      style={{ 
        zIndex: 999999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }} 
      data-modal="transfer-deposit-required"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div 
        className="transfer-deposit-modal-content fixed bottom-0 left-0 right-0 bg-[#0a0a2e] border-t border-[#1a1a40] text-white rounded-t-2xl animate-slide-up max-h-[70vh] overflow-y-auto"
        style={{
          zIndex: 999999999,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          transform: 'translateY(0)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Deposit Required</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Icon and Main Message */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-10 h-10 text-orange-500" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">
              Feature Not Available
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Sorry, this feature has not been activated yet.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 p-3 bg-[#1a1a40] rounded-lg">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Send & Receive Funds</p>
                <p className="text-gray-400 text-xs">Transfer money to other Nedaxer users</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-[#1a1a40] rounded-lg">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Advanced Trading</p>
                <p className="text-gray-400 text-xs">Access all trading features and tools</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-[#1a1a40] rounded-lg">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Enhanced Security</p>
                <p className="text-gray-400 text-xs">Full account verification and protection</p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-green-400 font-medium">Secure & Regulated</p>
                <p className="text-xs text-gray-300 mt-1">
                  Your funds are protected with bank-level security and regulatory compliance
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleDepositClick}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 font-semibold text-base"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Make Your First Deposit
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800/50 py-4 text-base"
            >
              Continue Exploring
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">
              Multiple cryptocurrencies and payment methods accepted
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}