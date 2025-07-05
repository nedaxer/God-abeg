import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Clock } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export function ComingSoonModal({ isOpen, onClose, feature }: ComingSoonModalProps) {
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0a0a2e] border border-[#1a1a40] text-white rounded-2xl z-50 max-w-sm mx-auto p-6">
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-lg font-semibold text-white">Coming Soon</h2>
        </div>
        
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          
          <h3 className="text-white font-medium text-lg mb-2">{feature}</h3>
          <p className="text-gray-400 text-sm mb-6">
            This feature is currently under development and will be available soon.
          </p>
          
          <button 
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}