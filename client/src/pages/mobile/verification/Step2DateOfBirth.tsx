import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import MobileLayout from '@/components/mobile-layout';

interface Step2DateOfBirthProps {
  onNext: (dateOfBirth: { day: number; month: number; year: number }) => void;
  onBack: () => void;
  onClose: () => void;
  initialValue?: { day: number; month: number; year: number };
}

export const Step2DateOfBirth: React.FC<Step2DateOfBirthProps> = ({ 
  onNext, 
  onBack, 
  onClose, 
  initialValue 
}) => {
  // Initialize with a default date or user's existing date
  const initDate = initialValue 
    ? `${initialValue.year}-${initialValue.month.toString().padStart(2, '0')}-${initialValue.day.toString().padStart(2, '0')}`
    : '1990-06-12';
  
  const [dateOfBirth, setDateOfBirth] = useState(initDate);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Convert date string to day/month/year object
    const date = new Date(dateOfBirth);
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const year = date.getFullYear();
    
    onNext({ day, month, year });
  };

  return (
    <MobileLayout hideBottomNav>
      {/* Header - With X button */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a2e]">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white p-0">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="w-6 h-6"></div> {/* Spacer for centering */}
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white p-0">
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Progress Bar - Orange color, smaller */}
      <div className="px-4 py-1">
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div className="bg-orange-500 h-1 rounded-full w-3/6"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {/* Title - Smaller font */}
        <h2 className="text-base font-medium text-white text-center mb-4">
          What is your date of birth?
        </h2>
        
        {/* Date of Birth Label */}
        <p className="text-gray-300 text-center mb-8 text-sm">
          Date of Birth
        </p>

        {/* Device-Native Date Picker */}
        <div className="mb-16">
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
            className="w-full bg-black/20 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg text-center focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            style={{
              colorScheme: 'dark',
              fontSize: '18px'
            }}
          />
        </div>

        {/* Next Button - Fixed at bottom with deep background */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a2e] p-4 border-t border-gray-700 z-50">
          <Button 
            onClick={handleNext}
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 text-sm rounded-full disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Next"}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};