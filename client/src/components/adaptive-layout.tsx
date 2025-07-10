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
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      // Check if we're on desktop
      const checkDesktop = () => {
        setIsDesktop(window.innerWidth >= 768);
      };
      
      checkDesktop();
      setIsMounted(true);
      
      window.addEventListener('resize', checkDesktop);
      
      return () => window.removeEventListener('resize', checkDesktop);
    } catch (error) {
      console.error('Error in adaptive layout:', error);
      // Fallback to mobile on error
      setIsDesktop(false);
      setIsMounted(true);
    }
  }, []);

  // Don't render anything until we've determined the device type
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#0a0a2e] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Desktop: Use proper desktop dashboard layout with full width wrapper
  if (isDesktop) {
    return (
      <DesktopLayoutWrapper>
        <DesktopDashboard title={title}>
          {desktopComponent || children}
        </DesktopDashboard>
      </DesktopLayoutWrapper>
    );
  }

  // Mobile: Use normal mobile layout
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