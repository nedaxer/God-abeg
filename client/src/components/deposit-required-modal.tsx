import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Shield, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useLocation } from "wouter";

interface DepositRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradingType: 'spot' | 'futures';
  action: 'buy' | 'sell' | 'long' | 'short';
}

export default function DepositRequiredModal({ 
  isOpen, 
  onClose, 
  tradingType, 
  action 
}: DepositRequiredModalProps) {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  const handleDepositClick = () => {
    onClose();
    navigate('/mobile/assets');
  };

  const getActionText = () => {
    switch (action) {
      case 'buy': return t('buy');
      case 'sell': return t('sell');
      case 'long': return 'Long';
      case 'short': return 'Short';
      default: return t('trade');
    }
  };

  const getTradingTypeText = () => {
    return tradingType === 'spot' ? t('spot_trading') : t('futures_trading');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a2e] border-blue-700 text-white max-w-sm mx-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <DialogTitle className="text-xl font-bold text-white">
            Deposit Required
          </DialogTitle>
          
          <DialogDescription className="text-gray-300 text-base mt-2">
            To start {getTradingTypeText().toLowerCase()}, you need to make your first deposit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Features List */}
          <div className="bg-blue-950/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Access to all trading pairs</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Real-time market data</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Advanced order types</span>
            </div>
            {tradingType === 'futures' && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Leverage up to 100x</span>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Professional trading tools</span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-xs text-green-400 font-medium">Secure & Regulated</p>
                <p className="text-xs text-gray-300 mt-1">
                  Your funds are protected with bank-level security
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              onClick={handleDepositClick}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 font-semibold"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Make Your First Deposit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border-blue-600 text-blue-300 hover:bg-blue-950/50 py-3"
            >
              Continue Exploring
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">
              Multiple cryptocurrencies accepted
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}