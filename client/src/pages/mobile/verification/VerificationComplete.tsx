import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import MobileLayout from '@/components/mobile-layout';

interface VerificationCompleteProps {
  onContinue: () => void;
}

export const VerificationComplete: React.FC<VerificationCompleteProps> = ({ onContinue }) => {
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    setLocation('/mobile'); // Navigate to home page
  };

  return (
    <MobileLayout hideBottomNav>
      {/* Header - No title label */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a2e]">
        <div className="w-6 h-6" />
        <div className="w-6 h-6" />
        <div className="w-6 h-6" />
      </div>

      {/* Progress Bar - Complete - Orange color, smaller */}
      <div className="px-4 py-1">
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div className="bg-orange-500 h-1 rounded-full w-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Success Icon - Orange color */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title - Smaller font */}
        <h2 className="text-xl font-semibold text-white text-center mb-4">
          Thank you!
        </h2>

        {/* Message */}
        <p className="text-gray-300 text-center mb-12 px-4 text-sm leading-relaxed">
          Your profile has been submitted and is under verification.
        </p>

        {/* Additional Info */}
        <div className="bg-gray-800/50 p-4 rounded-lg mb-24">
          <p className="text-gray-400 text-sm text-center">
            We'll notify you once your verification is complete. 
            This process typically takes 24-48 hours.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button like home navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 p-4 border-t border-gray-700 z-50">
        <Button 
          onClick={handleContinue}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 text-base rounded-full"
        >
          Continue to home page
        </Button>
      </div>
    </MobileLayout>
  );
};