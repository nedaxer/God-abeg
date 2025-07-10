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
      // Check user's preferred layout mode from localStorage
      const savedLayoutMode = localStorage.getItem('nedaxer_layout_mode');
      
      if (savedLayoutMode === 'desktop' || savedLayoutMode === 'mobile') {
        setLayoutMode(savedLayoutMode as 'mobile' | 'desktop');
        console.log('Using saved layout preference:', savedLayoutMode);
      } else {
        // Only auto-detect on first visit - default to mobile to preserve user's browser mode
        const isLargeScreen = window.innerWidth >= 1200; // Only very large screens default to desktop
        const autoMode = isLargeScreen ? 'desktop' : 'mobile';
        setLayoutMode(autoMode);
        console.log('Auto-detected layout mode:', autoMode, 'for screen width:', window.innerWidth);
      }
      
      setIsMounted(true);
    } catch (error) {
      console.error('Error in adaptive layout:', error);
      // Always fallback to mobile to preserve user choice
      setLayoutMode('mobile');
      setIsMounted(true);
    }
  }, []);

  // Add layout mode toggle function (can be used by components)
  const toggleLayoutMode = () => {
    const newMode = layoutMode === 'mobile' ? 'desktop' : 'mobile';
    setLayoutMode(newMode);
    localStorage.setItem('nedaxer_layout_mode', newMode);
    console.log('Layout mode changed to:', newMode);
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