import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, DollarSign } from 'lucide-react';

interface WithdrawalRestrictionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawalData: {
    hasRestriction: boolean;
    message: string;
    minimumRequired?: number;
    totalDeposited?: number;
    shortfall?: number;
    canWithdraw?: boolean;
  } | null;
  onMakeDeposit: () => void;
}

export function WithdrawalRestrictionModal({
  open,
  onOpenChange,
  withdrawalData,
  onMakeDeposit
}: WithdrawalRestrictionModalProps) {
  const [displayMessage, setDisplayMessage] = useState<string>('');

  // Process the withdrawal message to replace placeholders with actual amounts
  useEffect(() => {
    if (!withdrawalData) {
      setDisplayMessage('Sorry, this feature has not been activated yet.');
      return;
    }

    let message = withdrawalData.message || 'Sorry, this feature has not been activated yet.';
    
    // Replace ${amount} placeholder with the actual minimum required amount
    if (withdrawalData.minimumRequired) {
      message = message.replace(/\$\{amount\}/g, `$${withdrawalData.minimumRequired.toLocaleString()}`);
      message = message.replace(/\$\{minimumRequired\}/g, `$${withdrawalData.minimumRequired.toLocaleString()}`);
    }
    
    // Replace ${shortfall} placeholder with the actual shortfall amount
    if (withdrawalData.shortfall && withdrawalData.shortfall > 0) {
      message = message.replace(/\$\{shortfall\}/g, `$${withdrawalData.shortfall.toLocaleString()}`);
    }

    setDisplayMessage(message);
  }, [withdrawalData]);

  // Don't render if no restriction data or user can withdraw
  if (!withdrawalData || !withdrawalData.hasRestriction) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1a1a40] border border-orange-500/30 text-white">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
          <DialogTitle className="text-xl font-semibold text-white">
            Withdrawal Restricted
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <p className="text-gray-300 text-base leading-relaxed">
            {displayMessage}
          </p>
          
          <p className="text-xs text-gray-500">
            This requirement helps protect your account and ensures compliance with financial regulations.
          </p>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-gray-600 text-white hover:bg-gray-700"
          >
            Understood
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onMakeDeposit();
            }}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Make Deposit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}