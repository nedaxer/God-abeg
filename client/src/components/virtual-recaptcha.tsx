import { useState, useEffect } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import googleRecaptchaLogo from '@assets/9f8c1d48287f48f3bc7b13c8208fd249_1752097750415.png';

interface VirtualRecaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
}

export function VirtualRecaptcha({ 
  onVerify, 
  onExpire, 
  theme = 'light', 
  size = 'normal' 
}: VirtualRecaptchaProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  // Auto-expire after 2 minutes like real reCAPTCHA
  useEffect(() => {
    if (isChecked && !isExpired) {
      const timer = setTimeout(() => {
        setIsExpired(true);
        setIsChecked(false);
        setShowCheckmark(false);
        onExpire?.();
      }, 120000); // 2 minutes

      return () => clearTimeout(timer);
    }
  }, [isChecked, isExpired, onExpire]);

  const handleClick = async () => {
    if (isChecked || isLoading) return;

    setIsLoading(true);
    
    // Simulate reCAPTCHA verification delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    setIsLoading(false);
    setIsChecked(true);
    setShowCheckmark(true);
    setIsExpired(false);
    
    // Generate a mock token
    const mockToken = `virtual-recaptcha-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    onVerify(mockToken);
  };

  const handleRefresh = () => {
    setIsChecked(false);
    setIsExpired(false);
    setShowCheckmark(false);
    setIsLoading(false);
  };

  return (
    <div className="inline-block">
      {/* Main reCAPTCHA container - exact Google dimensions and styling */}
      <div className="w-[304px] h-[78px] bg-[#f9f9f9] border border-[#c1c1c1] rounded-[3px] shadow-[0_2px_2px_0_rgba(0,0,0,0.14),0_3px_1px_-2px_rgba(0,0,0,0.12),0_1px_5px_0_rgba(0,0,0,0.2)] relative font-['Roboto',Arial,sans-serif]">
        {/* Main content area */}
        <div className="flex items-center h-[58px] px-3 py-2">
          {/* Checkbox - exact Google styling */}
          <div className="flex-shrink-0 mr-3">
            <div 
              className={`
                w-[25px] h-[25px] border-2 rounded-[2px] cursor-pointer transition-all duration-200 relative
                ${isChecked 
                  ? 'bg-[#1c4587] border-[#1c4587] shadow-inner' 
                  : isExpired 
                    ? 'bg-[#ffebee] border-[#e57373]' 
                    : 'bg-[#fafafa] border-[#c1c1c1] hover:border-[#4285f4] shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]'
                }
                ${isLoading ? 'bg-[#e3f2fd] border-[#1976d2]' : ''}
              `}
              onClick={handleClick}
            >
              {isLoading && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-3 h-3 border-[2px] border-[#1976d2] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {showCheckmark && !isLoading && (
                <Check className="w-[15px] h-[15px] text-white absolute top-[3px] left-[3px]" strokeWidth={3} />
              )}
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-normal text-[#212121] leading-[17px] font-['Roboto',Arial,sans-serif]">
              {isExpired ? 'Verification expired. Check the checkbox again.' : 
               isChecked ? 'Verification complete' : 
               'I\'m not a robot'}
            </div>
          </div>

          {/* reCAPTCHA logo and refresh */}
          <div className="flex flex-col items-end justify-center ml-2 h-full">
            <div className="flex items-center space-x-1 mb-1">
              {(isExpired || isChecked) && (
                <button
                  onClick={handleRefresh}
                  className="w-4 h-4 text-[#757575] hover:text-[#333] transition-colors"
                  title="Refresh"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Google reCAPTCHA logo */}
            <div className="flex items-center space-x-1">
              <div className="text-[10px] text-[#757575] font-normal leading-[10px]">
                reCAPTCHA
              </div>
              <div className="w-[25px] h-[25px] flex items-center justify-center">
                {/* Google reCAPTCHA logo */}
                <img 
                  src={googleRecaptchaLogo} 
                  alt="Google reCAPTCHA" 
                  className="w-[25px] h-[25px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Google reCAPTCHA branding footer */}
        <div className="absolute bottom-0 left-0 right-0 h-[20px] bg-[#f9f9f9] border-t border-[#e0e0e0] flex items-center justify-between px-2 text-[10px] text-[#757575] font-['Roboto',Arial,sans-serif]">
          <div className="flex items-center space-x-2">
            <button className="hover:text-[#1976d2] transition-colors cursor-pointer">Privacy</button>
            <span>-</span>
            <button className="hover:text-[#1976d2] transition-colors cursor-pointer">Terms</button>
          </div>
          <div className="flex items-center space-x-1">
            <span>reCAPTCHA</span>
            <div className="w-3 h-3 flex items-center justify-center">
              {/* Small Google reCAPTCHA logo */}
              <img 
                src={googleRecaptchaLogo} 
                alt="Google reCAPTCHA" 
                className="w-3 h-3 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}