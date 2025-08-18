import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export default function LayoutModeToggle() {
  const { t } = useLanguage();
  const [currentMode, setCurrentMode] = useState<'mobile' | 'desktop'>('mobile');
  const [screenInfo, setScreenInfo] = useState({ width: 0, height: 0, touch: false });

  useEffect(() => {
    // Get current layout mode from localStorage
    const savedMode = localStorage.getItem('nedaxer_layout_mode');
    if (savedMode === 'desktop' || savedMode === 'mobile') {
      setCurrentMode(savedMode);
    }

    // Get screen information
    setScreenInfo({
      width: window.innerWidth,
      height: window.innerHeight,
      touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    });
  }, []);

  const handleToggleMode = () => {
    const newMode = currentMode === 'mobile' ? 'desktop' : 'mobile';
    setCurrentMode(newMode);
    localStorage.setItem('nedaxer_layout_mode', newMode);
    
    // Force page reload to apply the new layout mode
    window.location.reload();
  };

  const resetToAuto = () => {
    localStorage.removeItem('nedaxer_layout_mode');
    window.location.reload();
  };

  return (
    <Card className="mx-4 mb-4 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {currentMode === 'desktop' ? (
              <Monitor className="w-5 h-5 text-blue-400" />
            ) : (
              <Smartphone className="w-5 h-5 text-orange-400" />
            )}
            <div>
              <h3 className="font-semibold text-white">
                {t('layout_mode') || 'Layout Mode'}
              </h3>
              <p className="text-sm text-slate-400">
                {currentMode === 'desktop' 
                  ? t('desktop_mode_active') || 'Desktop mode active'
                  : t('mobile_mode_active') || 'Mobile mode active'
                }
              </p>
            </div>
          </div>
          <Button
            onClick={handleToggleMode}
            variant="outline"
            size="sm"
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            {currentMode === 'mobile' 
              ? t('switch_to_desktop') || 'Switch to Desktop'
              : t('switch_to_mobile') || 'Switch to Mobile'
            }
          </Button>
        </div>
        
        <div className="text-xs text-slate-500 space-y-1">
          <p>Screen: {screenInfo.width} × {screenInfo.height}px</p>
          <p>Device: {screenInfo.touch ? 'Touch' : 'Non-touch'}</p>
          <Button 
            onClick={resetToAuto}
            variant="ghost" 
            size="sm"
            className="h-6 text-xs text-blue-400 hover:text-blue-300 p-0"
          >
            Reset to Auto-detect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}