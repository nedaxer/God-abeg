import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EligibilityModal({ isOpen, onClose }: EligibilityModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a2e] border-blue-700 text-white max-w-sm mx-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <DialogTitle className="text-xl font-bold text-white">
            Not Eligible
          </DialogTitle>
          
          <DialogDescription className="text-gray-300 text-base mt-2">
            You're not eligible for this feature!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <Button 
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 font-semibold"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}