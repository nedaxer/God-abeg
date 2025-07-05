import { X, CreditCard, ArrowDownUp, Wallet } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (method: string) => void;
}

export function DepositModal({ isOpen, onClose, onSelectMethod }: DepositModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  
  return createPortal(
    <div 
      className="deposit-modal-overlay fixed inset-0" 
      style={{ 
        zIndex: 999999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }} 
      data-modal="deposit"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div 
        className="deposit-modal-content fixed bottom-0 left-0 right-0 bg-[#0a0a2e] border-t border-[#1a1a40] text-white rounded-t-2xl animate-slide-up max-h-[70vh] overflow-y-auto"
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
        <div className="p-4">
          <div className="flex flex-row items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Select Payment Method</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        
          <div className="space-y-4">
            {/* Buy Crypto with Fiat */}
            <div>
              <h3 className="text-white font-medium mb-3 text-sm">Buy Crypto with Fiat</h3>
              
              <button 
                onClick={() => onSelectMethod('buy-usd')}
                className="w-full bg-[#1a1a40] hover:bg-[#2a2a50] rounded-lg p-3 mb-2 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-sm">Buy with USD</span>
                      <span className="bg-yellow-600 text-yellow-100 text-xs px-2 py-1 rounded">
                        Recommended
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">Visa, Mastercard and JCB are supported</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => onSelectMethod('p2p')}
                className="w-full bg-[#1a1a40] hover:bg-[#2a2a50] rounded-lg p-3 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <ArrowDownUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-white font-medium text-sm">P2P Trading</span>
                    <p className="text-gray-400 text-xs">Bank of Georgia, Wise, Zelle and more</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Deposit with Crypto */}
            <div>
              <h3 className="text-white font-medium mb-3 text-sm">Deposit with Crypto</h3>
              
              <button 
                onClick={() => onSelectMethod('crypto')}
                className="w-full bg-[#1a1a40] hover:bg-[#2a2a50] rounded-lg p-3 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-white font-medium text-sm">Deposit Crypto</span>
                    <p className="text-gray-400 text-xs">Already have crypto? Deposit directly</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}