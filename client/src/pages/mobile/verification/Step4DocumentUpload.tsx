import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X, Upload } from 'lucide-react';
import MobileLayout from '@/components/mobile-layout';

interface DocumentFiles {
  front?: File;
  back?: File;
  single?: File;
}

interface Step4DocumentUploadProps {
  documentType: string;
  onNext: (files: DocumentFiles) => void;
  onBack: () => void;
  onClose: () => void;
  initialFiles?: DocumentFiles;
}

export const Step4DocumentUpload: React.FC<Step4DocumentUploadProps> = ({ 
  documentType, 
  onNext, 
  onBack, 
  onClose, 
  initialFiles 
}) => {
  const [files, setFiles] = useState<DocumentFiles>(initialFiles || {});
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const singleInputRef = useRef<HTMLInputElement>(null);

  const isPassport = documentType === 'passport';
  const requiresTwoSides = documentType === 'driving_license' || documentType === 'residence_permit';

  const getTitle = () => {
    switch (documentType) {
      case 'passport':
        return 'Upload your Passport';
      case 'driving_license':
        return 'Upload your Driving License';
      case 'residence_permit':
        return 'Upload your Residence Permit';
      default:
        return 'Upload your Document';
    }
  };

  const handleFileSelect = (type: 'front' | 'back' | 'single', file: File) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (isPassport && files.single) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      onNext({ single: files.single });
    } else if (requiresTwoSides && files.front && files.back) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      onNext({ front: files.front, back: files.back });
    }
  };

  const canProceed = isPassport ? !!files.single : (!!files.front && !!files.back);

  const DocumentUploadBox = ({ 
    type, 
    label, 
    file, 
    inputRef 
  }: { 
    type: 'front' | 'back' | 'single'; 
    label: string; 
    file?: File; 
    inputRef: React.RefObject<HTMLInputElement> 
  }) => (
    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            handleFileSelect(type, selectedFile);
          }
        }}
        className="hidden"
      />
      
      <div className="flex flex-col items-center space-y-3">
        <Upload className="w-12 h-12 text-gray-500" />
        <div>
          <p className="text-white font-medium">{label}</p>
          {file ? (
            <p className="text-orange-500 text-sm mt-1">✓ {file.name}</p>
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              className="text-orange-500 text-sm hover:text-orange-400"
            >
              Upload document
            </button>
          )}
        </div>
      </div>
    </div>
  );

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
            {getTitle()}
          </h2>
          
          {requiresTwoSides && (
            <p className="text-gray-400 text-center mb-8 text-xs">
              Two files required. One for each side
            </p>
          )}

          {/* Upload Areas */}
          <div className="space-y-6">
            {isPassport ? (
              <DocumentUploadBox
                type="single"
                label="Upload document"
                file={files.single}
                inputRef={singleInputRef}
              />
            ) : (
              <>
                <DocumentUploadBox
                  type="front"
                  label="Front side"
                  file={files.front}
                  inputRef={frontInputRef}
                />
                <DocumentUploadBox
                  type="back"
                  label="Back side"
                  file={files.back}
                  inputRef={backInputRef}
                />
              </>
            )}
          </div>
        </div>

        {/* Spacer for fixed button */}
        <div className="pb-32"></div>
      </div>

      {/* Fixed Bottom Button like home navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 p-4 border-t border-gray-700 z-50 space-y-4">
        <p className="text-gray-400 text-center text-xs">
          Please tap "next" to save your documents
        </p>

        <Button 
          onClick={handleNext}
          disabled={!canProceed || isLoading}
          className={`w-full py-4 text-sm font-medium rounded-full ${
            canProceed && !isLoading
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? "Loading..." : "Next"}
        </Button>
      </div>
    </MobileLayout>
  );
};