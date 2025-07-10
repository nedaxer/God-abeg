import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Bell, MessageSquare, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MobileHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function MobileHeader({ title = 'Nedaxer', showBackButton = false, onBackClick }: MobileHeaderProps) {
  const { user } = useAuth();
  
  // Only show on mobile devices (screens smaller than 768px)
  const [isMobile, setIsMobile] = useState(false);
  
  // Get unread notification count - MUST be called before any conditional returns
  const { data: notificationData } = useQuery({
    queryKey: ['/api/notifications/unread-count'],
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: !!user, // Only run query if user exists
  });

  // Get unread support message count - MUST be called before any conditional returns
  const { data: supportData } = useQuery({
    queryKey: ['/api/notifications/support-unread-count'],
    refetchInterval: 30000,
    enabled: !!user, // Only run query if user exists
  });
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Don't render on desktop - conditional return AFTER all hooks
  if (!isMobile) {
    return null;
  }

  const unreadCount = notificationData?.unreadCount || 0;
  const supportUnreadCount = supportData?.supportUnreadCount || 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a2e] border-b border-gray-700/50 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Back button or Logo */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button 
              onClick={onBackClick}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <img 
                src="/logo.svg" 
                alt="Nedaxer" 
                className="w-5 h-5"
                onError={(e) => {
                  // Fallback to text if logo doesn't exist
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-white font-bold text-sm">N</span>';
                }}
              />
            </div>
            <span className="text-white font-semibold text-lg">{title}</span>
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center gap-3">
          {/* Support Messages */}
          <a href="#/mobile/notifications?tab=support" className="relative p-2">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            {supportUnreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-orange-500 text-white text-xs flex items-center justify-center">
                {supportUnreadCount}
              </Badge>
            )}
          </a>

          {/* Notifications */}
          <a href="#/mobile/notifications" className="relative p-2">
            <Bell className="w-5 h-5 text-gray-400" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-orange-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </a>

          {/* Profile */}
          <a href="#/mobile/profile" className="p-2">
            {user?.profilePicture ? (
              <img 
                src={`data:image/jpeg;base64,${user.profilePicture}`}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </a>
        </div>
      </div>
    </header>
  );
}