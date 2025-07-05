import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface AnimatedErrorBannerProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'error' | 'warning' | 'info';
}

export function AnimatedErrorBanner({ 
  message, 
  isVisible, 
  onClose, 
  type = 'error' 
}: AnimatedErrorBannerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!mounted) return null;

  const getColors = () => {
    switch (type) {
      case 'warning':
        return 'from-yellow-600 to-orange-600';
      case 'info':
        return 'from-blue-600 to-indigo-600';
      default:
        return 'from-purple-600 to-blue-600';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Rope */}
      <div 
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b ${getColors()} transition-all duration-700 ease-out ${
          isVisible ? 'h-16 opacity-100' : 'h-0 opacity-0'
        }`}
        style={{
          boxShadow: isVisible ? '0 0 10px rgba(147, 51, 234, 0.5)' : 'none'
        }}
      />
      
      {/* Error Card */}
      <div 
        className={`mx-4 mt-12 transition-all duration-700 ease-out transform ${
          isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : '-translate-y-full opacity-0 scale-95'
        }`}
        style={{
          animationDelay: isVisible ? '200ms' : '0ms'
        }}
      >
        <div 
          className={`relative bg-gradient-to-r ${getColors()} rounded-lg shadow-2xl border border-white/20 pointer-events-auto overflow-hidden`}
          style={{
            backdropFilter: 'blur(10px)',
            boxShadow: isVisible 
              ? '0 20px 40px rgba(147, 51, 234, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)' 
              : 'none'
          }}
        >
          {/* Animated background gradient */}
          <div 
            className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              animation: isVisible ? 'pulse 2s ease-in-out infinite alternate' : 'none'
            }}
          />
          
          {/* Content */}
          <div className="relative flex items-center p-4 text-white">
            <div className="flex-shrink-0 mr-3">
              <div 
                className={`w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-500 ${
                  isVisible ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
                }`}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p 
                className={`text-sm font-medium transition-all duration-500 ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}
                style={{ animationDelay: isVisible ? '300ms' : '0ms' }}
              >
                {message}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className={`flex-shrink-0 ml-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 ${
                isVisible ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
              }`}
              style={{ animationDelay: isVisible ? '400ms' : '0ms' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Bottom glow */}
          <div 
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { 
            background: linear-gradient(90deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1));
          }
          100% { 
            background: linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
          }
        }
      `}</style>
    </div>
  );
}