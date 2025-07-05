import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BottomSlideBannerData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // Duration in milliseconds, default 3000
}

interface BottomSlideBannerProps {
  notification: BottomSlideBannerData | null;
  onDismiss: () => void;
}

export function BottomSlideBanner({ notification, onDismiss }: BottomSlideBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (notification) {
      // Show the banner with animation
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 50); // Small delay for smooth animation
      
      // Auto-dismiss after specified duration (default 3 seconds)
      const duration = notification.duration || 3000;
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setIsAnimating(false);
    }
  }, [notification]);

  const handleDismiss = () => {
    setIsAnimating(false);
    // Wait for exit animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  };

  if (!notification || !isVisible) {
    return null;
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBannerStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-900/90 border-green-500/50 text-green-100';
      case 'error':
        return 'bg-red-900/90 border-red-500/50 text-red-100';
      case 'warning':
        return 'bg-orange-900/90 border-orange-500/50 text-orange-100';
      case 'info':
        return 'bg-blue-900/90 border-blue-500/50 text-blue-100';
      default:
        return 'bg-blue-900/90 border-blue-500/50 text-blue-100';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none">
      <div 
        className={cn(
          "mx-4 mb-4 p-4 rounded-lg border-2 backdrop-blur-sm shadow-2xl pointer-events-auto",
          "transform transition-all duration-300 ease-out",
          getBannerStyles(),
          isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold mb-1">
              {notification.title}
            </h4>
            <p className="text-xs opacity-90 leading-relaxed">
              {notification.message}
            </p>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 opacity-70 hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
}