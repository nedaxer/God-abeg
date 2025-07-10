import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { BottomNavigation } from './bottom-navigation';
import { useTheme } from '@/contexts/theme-context';

interface DesktopMobileViewerProps {
  children: ReactNode;
  className?: string;
  hideBottomNav?: boolean;
  title?: string;
}

export default function DesktopMobileViewer({ 
  children, 
  className = '', 
  hideBottomNav = false, 
  title = 'Nedaxer Mobile' 
}: DesktopMobileViewerProps) {
  const [location] = useLocation();
  const { getBackgroundClass, getTextClass } = useTheme();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if we're on desktop
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Desktop header navigation
  const DesktopHeader = () => (
    <div className="desktop-header">
      <div className="desktop-nav">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-orange-500">Nedaxer</div>
          <div className="text-sm text-gray-400">Mobile Trading Platform</div>
        </div>
        <div className="desktop-nav-links">
          <a href="#/mobile/home" className={`desktop-nav-link ${location === '/mobile/home' ? 'active' : ''}`}>
            Home
          </a>
          <a href="#/mobile/assets" className={`desktop-nav-link ${location === '/mobile/assets' ? 'active' : ''}`}>
            Assets
          </a>
          <a href="#/mobile/trade" className={`desktop-nav-link ${location === '/mobile/trade' ? 'active' : ''}`}>
            Trade
          </a>
          <a href="#/mobile/markets" className={`desktop-nav-link ${location === '/mobile/markets' ? 'active' : ''}`}>
            Markets
          </a>
          <a href="#/mobile/earn" className={`desktop-nav-link ${location === '/mobile/earn' ? 'active' : ''}`}>
            Earn
          </a>
          <a href="#/mobile/profile" className={`desktop-nav-link ${location === '/mobile/profile' ? 'active' : ''}`}>
            Profile
          </a>
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <DesktopHeader />
        
        <div className="desktop-content">
          <div className="text-center mb-8">
            <h1 className="desktop-title text-white">
              {title}
            </h1>
            <p className="desktop-subtitle text-gray-300">
              Experience the full mobile trading platform in your desktop browser
            </p>
          </div>
          
          <div className="desktop-mobile-viewer">
            <div className="desktop-mobile-content">
              <div className={`${getBackgroundClass()} ${getTextClass()} ${className} h-full relative`}>
                {children}
                {!hideBottomNav && <BottomNavigation />}
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 text-gray-400">
            <p>Desktop users can access the full mobile experience above</p>
            <p className="text-sm mt-2">All features are fully functional on desktop browsers</p>
          </div>
        </div>
      </div>
    );
  }

  // Mobile view (normal mobile layout)
  return (
    <div className={`${getBackgroundClass()} ${getTextClass()} ${className} min-h-screen relative`}>
      {children}
      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
}