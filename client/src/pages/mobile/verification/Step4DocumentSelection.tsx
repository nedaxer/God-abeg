import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X, FileText, CreditCard, Home } from 'lucide-react';
import MobileLayout from '@/components/mobile-layout';

interface Step4DocumentSelectionProps {
  onNext: (documentType: string) => void;
  onBack: () => void;
  onClose: () => void;
  initialValue?: string;
}

const documentTypes = [
  {
    value: 'passport',
    label: 'Passport',
    description: 'Only the face-side is required.',
    icon: FileText
  },
  {
    value: 'driving_license',
    label: 'Driving License',
    description: 'Two files required. One for each side',
    icon: CreditCard
  },
  {
    value: 'residence_permit',
    label: 'Residence Permit',
    description: 'Two files required. One for each side',
    icon: Home
  }
];

export const Step4DocumentSelection: React.FC<Step4DocumentSelectionProps> = ({ 
  onNext, 
  onBack, 
  onClose, 
  initialValue 
}) => {
  const [selectedType, setSelectedType] = useState(initialValue || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleNext = async () => {
    if (selectedType) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      onNext(selectedType);
    }
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
          <div className="bg-orange-500 h-1 rounded-full w-5/6"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6">
        {/* Main content area */}
        <div className="flex-1 py-8">
          {/* Title - Smaller font */}
          <h2 className="text-base font-medium text-white text-center mb-2">
            Verify Your Identity
          </h2>
          
          <p className="text-gray-400 text-center mb-8 text-xs">
            Choose your document type
          </p>

          {/* Document Types - No automatic navigation */}
          <div className="space-y-4">
            {documentTypes.map((docType) => {
              const IconComponent = docType.icon;
              return (
                <button
                  key={docType.value}
                  onClick={() => handleSelect(docType.value)}
                  disabled={isLoading}
                  className={`w-full p-4 border rounded-lg text-left transition-all ${
                    selectedType === docType.value
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-600 hover:border-orange-400'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <IconComponent className="w-6 h-6 text-gray-400" />
                    <div className="flex-1">
                      <h3 className="text-white text-sm">{docType.label}</h3>
                      <p className="text-gray-400 text-xs">{docType.description}</p>
                    </div>
                    {selectedType === docType.value && (
                      <div className="w-5 h-5 text-orange-500">✓</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacer for fixed button */}
        <div className="pb-32"></div>
      </div>

      {/* Fixed Bottom Button and Notice like home navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 p-4 border-t border-gray-700 z-50 space-y-4">
        <Button 
          onClick={handleNext}
          disabled={!selectedType || isLoading}
          className={`w-full py-4 text-sm font-medium rounded-full ${
            selectedType && !isLoading
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? "Loading..." : "Next"}
        </Button>

        {/* Security Notice */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <p className="text-gray-300 text-sm text-center">
            Your information will be encrypted, stored securely and only used to verify your identity
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};