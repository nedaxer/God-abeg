import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInstallApp = isStandalone || isInWebAppiOS;
    setIsInstalled(isInstallApp);

    // Check if user has permanently dismissed the install prompt
    const hasBeenInstalled = localStorage.getItem('pwa-installed') === 'true';
    
    if (!isInstallApp && !hasBeenInstalled) {
      // Show prompt on every browser refresh until installed
      setShowPrompt(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!hasBeenInstalled && !isInstallApp) {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      // Mark as permanently installed
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
        localStorage.setItem('pwa-installed', 'true');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Only hide for this session, will show again on refresh
    sessionStorage.setItem('pwa-install-dismissed-session', 'true');
  };

  // Don't show if already installed or dismissed this session only
  if (isInstalled || !showPrompt || !mounted || sessionStorage.getItem('pwa-install-dismissed-session')) {
    return null;
  }

  return createPortal(
    <Card 
      className="fixed bottom-4 left-4 right-4 bg-gray-900 border-gray-700 text-white"
      style={{ zIndex: 999999999 }}
      data-component="pwa-install"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Install Nedaxer App</h3>
            <p className="text-sm text-gray-400">Get the full app experience</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleInstallClick}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Install
          </Button>
          <Button 
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>,
    document.body
  );
}