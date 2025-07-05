import { Link, useLocation } from 'wouter';
import { Home, BarChart3, TrendingUp, Newspaper, Wallet } from 'lucide-react';
import { hapticNavigation } from '@/lib/haptics';
import { useLanguage } from '@/contexts/language-context';
import { usePersistentChart } from '@/hooks/use-persistent-chart';
import { useTheme } from '@/contexts/theme-context';

export function BottomNavigation() {
  const [location] = useLocation();
  const { t } = useLanguage();
  const { showChart, hideChart } = usePersistentChart();
  const { getSecondaryBackgroundClass, getBorderClass, getTextClass } = useTheme();

  const navItems = [
    { 
      nameKey: 'home', 
      icon: Home, 
      path: '/mobile' 
    },
    { 
      nameKey: 'markets', 
      icon: BarChart3, 
      path: '/mobile/markets' 
    },
    { 
      nameKey: 'trade', 
      icon: TrendingUp, 
      path: '/mobile/trade' 
    },
    { 
      nameKey: 'news', 
      icon: Newspaper, 
      path: '/mobile/news' 
    },
    { 
      nameKey: 'assets', 
      icon: Wallet, 
      path: '/mobile/assets' 
    }
  ];

  const handleNavClick = (itemName: string) => {
    // Trigger haptic feedback for navigation
    hapticNavigation();

    // Manage chart visibility based on destination
    if (itemName === 'trade') {
      // Show chart when going to trade page
      setTimeout(() => {
        showChart();
      }, 100);
    } else {
      // Hide chart when leaving trade page
      hideChart();
    }
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-[#0a0a2e] border-t ${getBorderClass()} px-1 py-1`} 
      style={{ zIndex: 50 }}
      data-navigation="bottom"
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path !== '/mobile' && location.startsWith(item.path));

          return (
            <Link key={item.nameKey} href={item.path}>
              <div 
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-orange-500' 
                    : `text-gray-400 hover:text-gray-200`
                }`}
                onClick={() => handleNavClick(item.nameKey)}
                onTouchStart={() => handleNavClick(item.nameKey)}
              >
                <Icon size={18} />
                <span className="text-xs mt-0.5 font-medium">{t(item.nameKey)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}