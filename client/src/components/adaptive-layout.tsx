import { ReactNode, useEffect, useState } from 'react';
import MobileLayout from './mobile-layout';
import DesktopDashboard from './desktop-dashboard';
import DesktopLayoutWrapper from './desktop-layout-wrapper';

interface AdaptiveLayoutProps {
  children?: ReactNode;
  className?: string;
  hideBottomNav?: boolean;
  hideNavigation?: boolean;
  title?: string;
  mobileComponent?: ReactNode;
  desktopComponent?: ReactNode;
}

export default function AdaptiveLayout({ 
  children, 
  className = '', 
  hideBottomNav = false, 
  hideNavigation = false,
  title = 'Nedaxer',
  mobileComponent,
  desktopComponent
}: AdaptiveLayoutProps) {
  const [layoutMode, setLayoutMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      // Proper desktop detection for trading platforms
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const aspectRatio = screenWidth / screenHeight;
      
      // Check user's preferred layout mode from localStorage
      const savedLayoutMode = localStorage.getItem('nedaxer_layout_mode');
      
      if (savedLayoutMode === 'desktop' || savedLayoutMode === 'mobile') {
        setLayoutMode(savedLayoutMode as 'mobile' | 'desktop');
        console.log('Using saved layout preference:', savedLayoutMode);
      } else {
        // Improved desktop detection logic
        const isDesktopScreen = screenWidth >= 1024 && aspectRatio >= 1.2; // Tablets and desktops
        const isLargeDesktop = screenWidth >= 1440; // Large desktop screens
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Auto-detect: desktop for non-touch devices with proper screen size
        const autoMode = (isDesktopScreen && !isTouchDevice) || isLargeDesktop ? 'desktop' : 'mobile';
        setLayoutMode(autoMode);
        console.log('Auto-detected layout mode:', autoMode, 'for screen:', screenWidth + 'x' + screenHeight, 'touch:', isTouchDevice);
      }
      
      setIsMounted(true);
    } catch (error) {
      console.error('Error in adaptive layout:', error);
      // Fallback to mobile for safety
      setLayoutMode('mobile');
      setIsMounted(true);
    }

    // Add window resize listener to adapt to screen changes
    const handleResize = () => {
      const savedLayoutMode = localStorage.getItem('nedaxer_layout_mode');
      
      // Only auto-adapt if user hasn't explicitly chosen a layout
      if (!savedLayoutMode) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const aspectRatio = screenWidth / screenHeight;
        const isDesktopScreen = screenWidth >= 1024 && aspectRatio >= 1.2;
        const isLargeDesktop = screenWidth >= 1440;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        const newMode = (isDesktopScreen && !isTouchDevice) || isLargeDesktop ? 'desktop' : 'mobile';
        
        setLayoutMode(currentMode => {
          if (currentMode !== newMode) {
            console.log('Layout mode auto-adjusted to:', newMode, 'due to resize');
            return newMode;
          }
          return currentMode;
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Add layout mode toggle function (can be used by components)
  const toggleLayoutMode = () => {
    const newMode = layoutMode === 'mobile' ? 'desktop' : 'mobile';
    setLayoutMode(newMode);
    localStorage.setItem('nedaxer_layout_mode', newMode);
    console.log('Layout mode manually changed to:', newMode);
    
    // Force page reload to ensure proper layout initialization
    window.location.reload();
  };

  // Don't render anything until we've determined the layout mode
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#0a0a2e] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Desktop mode: Use desktop dashboard layout (only when user chooses)
  if (layoutMode === 'desktop') {
    return (
      <DesktopLayoutWrapper>
        <DesktopDashboard title={title}>
          {desktopComponent || children}
        </DesktopDashboard>
      </DesktopLayoutWrapper>
    );
  }

  // Mobile mode: Use mobile layout (default and respects user choice)
  return (
    <MobileLayout 
      className={className}
      hideBottomNav={hideBottomNav}
      hideNavigation={hideNavigation}
    >
      {mobileComponent || children}
    </MobileLayout>
  );
}