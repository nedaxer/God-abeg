import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { 
  Home, 
  Wallet, 
  TrendingUp, 
  BarChart3, 
  Gift, 
  User, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Newspaper
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DesktopContent from './desktop-content';
import AnimatedChatBot from './animated-chat-bot';
import VideoChatBot from './video-chat-bot';
import nedaxerLogo from '@/assets/20250618_042459_1750217238332.png';

// Real-time notification button component
function NotificationButton() {
  const [, setLocation] = useLocation();
  const { data: unreadCount, refetch } = useQuery({
    queryKey: ['/api/notifications/unread-count'],
    refetchInterval: 3000, // Check every 3 seconds for real-time updates
    staleTime: 1000,
  });

  useEffect(() => {
    // WebSocket connection for real-time notification updates
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.host;
    const ws = new WebSocket(`${wsProtocol}//${wsHost}`);

    ws.onopen = () => {
      console.log('Desktop notification WebSocket connected');
      ws.send(JSON.stringify({ type: 'subscribe_notifications' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification_update' || data.type === 'new_notification') {
          refetch(); // Refresh notification count
        }
      } catch (error) {
        console.error('Desktop notification WebSocket error:', error);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [refetch]);

  const notificationCount = (unreadCount as any)?.unreadCount || 0;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className={`relative text-gray-400 hover:text-white hover:bg-orange-500/10 rounded-lg p-3 transition-all duration-200 ${
          notificationCount > 0 ? 'animate-pulse' : ''
        }`}
        onClick={() => setLocation('/mobile/notifications')}
      >
        <Bell className={`w-6 h-6 transition-all duration-200 ${
          notificationCount > 0 ? 'animate-bounce text-orange-400 animate-shake' : 'text-gray-400'
        }`} />
        {notificationCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-6 h-6 p-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs animate-pulse shadow-lg border-2 border-[#0a0a2e]">
            {notificationCount > 9 ? '9+' : notificationCount}
          </Badge>
        )}
      </Button>
      {notificationCount > 0 && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
      )}
    </div>
  );
}

interface DesktopDashboardProps {
  children: ReactNode;
  title?: string;
}

export default function DesktopDashboard({ children, title = 'Nedaxer' }: DesktopDashboardProps) {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);

  // Set page title
  useEffect(() => {
    document.title = title;
  }, [title]);

  // Desktop navigation items (removed notifications from sidebar)
  const navigationItems = [
    { id: 'home', label: 'Dashboard', icon: Home, path: '/mobile' },
    { id: 'assets', label: 'Assets', icon: Wallet, path: '/mobile/assets' },
    { id: 'trade', label: 'Trading', icon: TrendingUp, path: '/mobile/trade' },
    { id: 'markets', label: 'Markets', icon: BarChart3, path: '/mobile/markets' },
    { id: 'earn', label: 'Earn', icon: Gift, path: '/mobile/earn' },
    { id: 'news', label: 'News', icon: Newspaper, path: '/mobile/news' },
  ];

  const handleLogout = async () => {
    try {
      console.log('🔴 Desktop logout button clicked');
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('🔴 Desktop logout error:', error);
      // Force manual cleanup if mutation fails
      localStorage.clear();
      sessionStorage.clear();

      // Clear cookies manually
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      // Force redirect even on complete failure
      window.location.href = '/account/login';
    }
  };

  const currentPage = navigationItems.find(item => item.path === location);

  const getCurrentPageType = (): 'home' | 'assets' | 'trade' | 'markets' | 'earn' | 'profile' | 'notifications' => {
    if (location.includes('/mobile/assets')) return 'assets';
    if (location.includes('/mobile/trade')) return 'trade';
    if (location.includes('/mobile/markets')) return 'markets';
    if (location.includes('/mobile/earn')) return 'earn';
    if (location.includes('/mobile/profile')) return 'profile';
    if (location.includes('/mobile/notifications')) return 'notifications';
    if (location === '/mobile' || location === '/mobile/') return 'home';
    return 'home';
  };

  // Force desktop layout styling
  useEffect(() => {
    // Set desktop viewport meta tag for full width
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');

    // Add desktop-specific body styling
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100vw';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;

    const connectWebSocket = () => {
      try {
        // Skip WebSocket connection in development to avoid spam
        if (import.meta.env.DEV) {
          console.log('🔌 WebSocket disabled in development mode');
          return;
        }

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}`;

        console.log('🔌 Connecting to WebSocket:', wsUrl);

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('🔌 WebSocket connected');
          setWsConnected(true);
          reconnectAttempts = 0; // Reset attempts on successful connection
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'price_update') {
              console.log('📈 Real-time price update:', data);
              setBtcPrice(data.price);
            }
          } catch (error) {
            console.error('❌ WebSocket message error:', error);
          }
        };

        ws.onclose = (event) => {
          setWsConnected(false);

          // Only attempt reconnection if it wasn't a manual close and we haven't exceeded max attempts
          if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            setTimeout(() => {
              console.log(`🔄 Attempting WebSocket reconnection... (${reconnectAttempts}/${maxReconnectAttempts})`);
              connectWebSocket();
            }, 5000 * reconnectAttempts); // Exponential backoff
          }
        };

        ws.onerror = () => {
          setWsConnected(false);
        };

        setWebSocket(ws);
      } catch (error) {
        console.error('❌ WebSocket connection failed:', error);
        setWsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.close(1000, 'Component unmounting');
      }
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-[#0a0a2e] flex fixed inset-0">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-16'} bg-black/30 backdrop-blur-xl border-r border-gray-700/30 transition-all duration-300 flex flex-col shadow-2xl`}>
        {/* Header */}
        <div className="p-5 border-b border-gray-700/30">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <img 
                    src={nedaxerLogo} 
                    alt="Nedaxer" 
                    className="h-12 w-auto object-contain"
                  />
                </div>

              </div>
            )}
            {!sidebarOpen && (
              <div className="flex items-center justify-center w-full">
                {/* No logo when collapsed - just toggle button */}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white hover:bg-orange-500/10 rounded-lg p-2"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-gray-700/50">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded-xl p-2 transition-all duration-200 group"
              onClick={() => setLocation('/mobile/profile')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center border-2 border-orange-500/30 group-hover:border-orange-400/50 transition-colors duration-200">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm truncate group-hover:text-orange-300 transition-colors duration-200">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.username || 'User'}
                </div>
                <div className="text-gray-400 text-xs truncate group-hover:text-gray-300 transition-colors duration-200">
                  {user?.email}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <a
                key={item.id}
                href={`#${item.path}`}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30 shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 hover:border hover:border-gray-600/50'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
              >
                <Icon className={`${isActive ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0 ${isActive ? 'text-orange-400' : 'group-hover:text-orange-400'} transition-all duration-200`} />
                {sidebarOpen && (
                  <span className={`font-medium ${isActive ? 'text-orange-400' : 'group-hover:text-white'} transition-colors duration-200`}>
                    {item.label}
                  </span>
                )}
                {isActive && sidebarOpen && (
                  <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-5 border-t border-gray-700/30 space-y-3">
          <Button
            variant="ghost"
            className={`w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 rounded-xl px-4 py-3 transition-all duration-200 group ${!sidebarOpen ? 'justify-center' : ''}`}
            onClick={() => setLocation('/mobile/settings')}
          >
            <Settings className="w-5 h-5 group-hover:text-white transition-colors duration-200" />
            {sidebarOpen && <span className="ml-4 font-medium group-hover:text-white transition-colors duration-200">Settings</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl px-4 py-3 transition-all duration-200 group ${!sidebarOpen ? 'justify-center' : ''}`}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors duration-200" />
            {sidebarOpen && <span className="ml-4 font-medium group-hover:text-red-400 transition-colors duration-200">Sign Out</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-black/10 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {currentPage?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-400 text-sm">
                Welcome back, {user?.firstName || user?.username || 'User'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <NotificationButton />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <DesktopContent page={getCurrentPageType()}>
              {children}
            </DesktopContent>
          </div>
        </main>
      </div>

      {/* Video Chat Bot - Only on Desktop */}
      <VideoChatBot user={user} />
    </div>
  );
}