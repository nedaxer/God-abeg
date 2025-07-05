import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import MobileLayout from '@/components/mobile-layout';
import professionalImage from '@assets/Picsart_25-06-28_15-49-20-738 (1)_1751125238732.png';

interface VerificationStartProps {
  onNext: () => void;
  onClose: () => void;
}

export const VerificationStart: React.FC<VerificationStartProps> = ({ onNext, onClose }) => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Get user's full name or fallback to username
  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.username || 'User';

  const handleNext = async () => {
    setIsLoading(true);
    // Add loading delay for professional UX
    await new Promise(resolve => setTimeout(resolve, 800));
    onNext();
  };

  return (
    <MobileLayout hideBottomNav>
      {/* Header - Back arrow navigates to home */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a2e]">
        <Button variant="ghost" size="sm" onClick={() => setLocation('/mobile')} className="text-white p-0">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="w-6 h-6"></div> {/* Spacer for centering */}
        <div className="w-6 h-6"></div> {/* Remove X button as requested */}
      </div>

      {/* No progress bar on first screen */}

      {/* Content */}
      <div className="flex-1 flex flex-col px-6">
        {/* Main content area - centered */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Professional Illustration - Bigger */}
          <div className="mb-6">
            <img 
              src={professionalImage} 
              alt="Professional verification" 
              className="w-80 h-64 object-contain"
            />
          </div>

          {/* Title - Updated message */}
          <h2 className="text-base font-medium text-white text-center mb-3">
            You're on the path to investing!
          </h2>

          {/* Subtitle */}
          <p className="text-gray-300 text-center mb-6 px-4 text-xs leading-relaxed">
            We just need to collect some details to fully activate your account.
          </p>

          </div>

        {/* Disclaimer */}
        <div className="pb-24">
          <p className="text-xs text-gray-400 text-center px-4 leading-relaxed">
            We rely on you for accurate information. Keep us informed of any material changes. 
            We may not be able to provide our services when you choose not to provide the required information.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Button like home navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 p-4 border-t border-gray-700 z-50">
        <Button 
          onClick={handleNext}
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 text-sm rounded-full disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Let's Do It"}
        </Button>
      </div>
    </MobileLayout>
  );
};