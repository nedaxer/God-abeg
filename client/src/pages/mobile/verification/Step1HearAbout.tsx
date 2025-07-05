import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import MobileLayout from '@/components/mobile-layout';

interface Step1HearAboutProps {
  onNext: (value: string) => void;
  onBack: () => void;
  onClose: () => void;
  initialValue?: string;
}

const options = [
  { value: 'social_media', label: 'Social Media' },
  { value: 'advertisements', label: 'Advertisements' },
  { value: 'from_friend', label: 'From a Friend' },
  { value: 'search_engine', label: 'Search Engine' },
  { value: 'news_article', label: 'News Article' },
  { value: 'other', label: 'Other' }
];

export const Step1HearAbout: React.FC<Step1HearAboutProps> = ({ 
  onNext, 
  onBack, 
  onClose, 
  initialValue 
}) => {
  const [selectedOption, setSelectedOption] = useState(initialValue || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (selectedOption) {
      setIsLoading(true);
      // Add loading delay for professional UX
      await new Promise(resolve => setTimeout(resolve, 600));
      onNext(selectedOption);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    onNext('');
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
          <div className="bg-orange-500 h-1 rounded-full w-2/6"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6">
        {/* Main content area */}
        <div className="flex-1 py-8">
          {/* Title - Smaller font */}
          <h2 className="text-base font-medium text-white text-center mb-2">
            How did you hear about Nedaxer?
          </h2>
          
          <p className="text-gray-400 text-center mb-8 text-xs">
            Help us understand how you discovered our platform
          </p>

          {/* Options - Orange accent - No automatic navigation */}
          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedOption(option.value)}
                disabled={isLoading}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedOption === option.value
                    ? 'border-orange-500 bg-orange-500/10 text-white'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{option.label}</span>
                  {selectedOption === option.value && (
                    <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Spacer for fixed buttons */}
        <div className="pb-32"></div>
      </div>

      {/* Fixed Bottom Buttons like home navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 p-4 border-t border-gray-700 z-50 space-y-3">
        <Button 
          onClick={handleNext}
          disabled={!selectedOption || isLoading}
          className={`w-full py-4 text-sm font-medium rounded-full ${
            selectedOption && !isLoading
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? "Loading..." : "Next"}
        </Button>
        
        <Button 
          onClick={handleSkip}
          variant="ghost"
          disabled={isLoading}
          className="w-full py-4 text-sm text-gray-400 hover:text-white disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Skip"}
        </Button>
      </div>
    </MobileLayout>
  );
};