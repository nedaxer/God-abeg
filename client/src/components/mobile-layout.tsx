import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { BottomNavigation } from './bottom-navigation';
import { PWAInstallPrompt } from './pwa-install-prompt';
import { useTheme } from '@/contexts/theme-context';
import AnimatedChatBot from './animated-chat-bot';
import MobileHeader from './mobile-header';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  hideBottomNav?: boolean;
  hideNavigation?: boolean;
}

export default function MobileLayout({ children, className = '', hideBottomNav = false, hideNavigation = false }: MobileLayoutProps) {
  const [location] = useLocation();
  const { getBackgroundClass, getTextClass } = useTheme();
  
  // Enhanced viewport configuration for mobile and desktop compatibility
  useEffect(() => {
    // Set responsive viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    
    // Mobile viewport with zoom disabled as requested
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    
    console.log('📱 Mobile Layout Active - Zoom disabled, user choice preserved');
    
    // Enhanced responsive layout styling with zoom prevention
    const style = document.getElementById('responsive-mobile-view') || document.createElement('style');
    style.id = 'responsive-mobile-view';
    style.textContent = `
      @media screen {
        body {
          overflow-x: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          touch-action: manipulation !important;
          -webkit-user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        
        /* Prevent zoom on all elements */
        * {
          touch-action: manipulation !important;
          -webkit-user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        
        /* Allow text selection only for input fields */
        input, textarea {
          -webkit-user-select: text !important;
          user-select: text !important;
        }
        
        /* Mobile layout styling - works on all screen sizes */
        [data-layout="mobile"] {
          width: 100% !important;
          min-height: 100vh !important;
          box-sizing: border-box !important;
          position: relative !important;
          touch-action: manipulation !important;
        }
        
        /* Enhanced desktop behavior - mobile app works on desktop */
        @media (min-width: 768px) {
          [data-layout="mobile"] {
            max-width: none !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
          
          /* Ensure mobile components scale properly on desktop */
          .mobile-container {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
        
        /* Large desktop screens - maintain mobile app layout */
        @media (min-width: 1200px) {
          [data-layout="mobile"] {
            width: 100% !important;
            max-width: none !important;
          }
        }
      }
    `;
    
    if (!document.head.contains(style)) {
      document.head.appendChild(style);
    }
    
    // Enhanced body styling for cross-platform compatibility
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    document.body.style.fontSize = '16px';
    document.body.style.lineHeight = '1.5';
    document.body.style.WebkitTextSizeAdjust = '100%';
    document.body.style.MozTextSizeAdjust = '100%';
    
    return () => {
      // Cleanup on unmount
      const mobileStyle = document.getElementById('responsive-mobile-view');
      if (mobileStyle && document.head.contains(mobileStyle)) {
        mobileStyle.remove();
      }
    };
  }, []);
  
  // Hide bottom navigation for profile and settings pages or when explicitly requested
  const shouldHideBottomNav = hideBottomNav || hideNavigation ||
    location.includes('/profile') || 
    location.includes('/settings') ||
    location.includes('/kyc') || 
    location.includes('/security') || 
    location.includes('/notifications') || 
    location.includes('/notification-settings') ||
    location.includes('/invite-friends') ||
    location.includes('/transfer') ||
    location.includes('/deposit-details') ||
    location.includes('/withdrawal-details') ||
    location.includes('/transfer-details') ||
    location.includes('/withdrawal');

  return (
    <div className={`min-h-screen ${getBackgroundClass()} ${getTextClass()}`}>
      {/* Mobile Header removed per user request */}
      
      <div className={`${shouldHideBottomNav ? 'pb-4 pt-4' : 'pb-16 pt-4'} ${className}`} data-layout="mobile">
        {children}
      </div>
      {!shouldHideBottomNav && <BottomNavigation />}
      {/* Chat bot removed from mobile - only for desktop */}
      <PWAInstallPrompt />
    </div>
  );
}