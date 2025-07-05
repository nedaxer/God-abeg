import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight } from 'lucide-react';

interface DepositActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMakeDeposit: () => void;
}

export function DepositActivationModal({ isOpen, onClose, onMakeDeposit }: DepositActivationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a2e] border-gray-700 text-white max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold text-white">
            Activate Features
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-orange-500" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Make a Deposit</h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            You need to make a deposit to activate all trading features and unlock your full portfolio potential.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => {
                onClose();
                onMakeDeposit();
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
            >
              Make Deposit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}