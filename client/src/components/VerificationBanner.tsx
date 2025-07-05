import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface VerificationBannerProps {
  userName: string;
  onVerifyClick: () => void;
  questionsCompleted?: boolean;
  kycStatus?: 'none' | 'pending' | 'verified' | 'rejected';
}

export const VerificationBanner: React.FC<VerificationBannerProps> = ({ 
  userName, 
  onVerifyClick,
  questionsCompleted = false,
  kycStatus = 'none'
}) => {
  // Debug banner logic
  React.useEffect(() => {
    console.log('🎯 VerificationBanner: Render Logic Debug:', {
      userName,
      questionsCompleted,
      kycStatus,
      shouldShow: kycStatus !== 'pending' && kycStatus !== 'verified',
      willRender: kycStatus !== 'pending' && kycStatus !== 'verified'
    });
  }, [userName, questionsCompleted, kycStatus]);

  // Hide banner when KYC is submitted (pending) or verified
  if (kycStatus === 'pending' || kycStatus === 'verified') {
    console.log('🎯 VerificationBanner: Hidden due to status:', kycStatus);
    return null;
  }

  console.log('🎯 VerificationBanner: Rendering banner for user:', userName);
  return (
    <div className="mx-4 mb-3 p-3 bg-orange-500 rounded-lg shadow-lg">
      {/* Progress indicators - smaller */}
      <div className="flex items-center justify-center mb-3 space-x-3">
        {/* Step 1 - All steps show with app background color and orange tick */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a0a2e]">
          <Check className="w-4 h-4 text-orange-500" />
        </div>
        
        <div className="w-6 h-1 bg-gray-300 rounded"></div>
        
        {/* Step 2 - App background with orange tick */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a0a2e]">
          <Check className="w-4 h-4 text-orange-500" />
        </div>
        
        <div className="w-6 h-1 bg-gray-300 rounded"></div>
        
        {/* Step 3 - App background with orange tick */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a0a2e]">
          <Check className="w-4 h-4 text-orange-500" />
        </div>
      </div>

      <div className="mb-3">
        <h3 className="text-white font-semibold text-base mb-1">
          {userName}, is it really you?
        </h3>
        <p className="text-orange-100 text-xs">
          Verifying your identity helps us prevent someone else from creating an account in your name.
        </p>
      </div>
      
      <Button 
        onClick={onVerifyClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 text-sm rounded-full"
      >
        Verify Your Account
      </Button>
    </div>
  );
};