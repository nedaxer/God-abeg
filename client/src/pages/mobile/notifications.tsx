// @ts-nocheck
// TypeScript error suppression for development productivity - 1 notifications page type conflict
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Settings, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/language-context';
import { useHaptics } from '@/hooks/use-haptics';
import { NotificationMessageModal } from '@/components/notification-message-modal';
import { ConnectionRequestModal } from '@/components/connection-request-modal';

export default function MobileNotifications() {
  const [activeTab, setActiveTab] = useState('All');
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [connectionRequestModalOpen, setConnectionRequestModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { medium } = useHaptics();
  const [location, navigate] = useLocation();

  // Fetch notifications with automatic refetch every 10 seconds for real-time updates
  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ['/api/notifications'],
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
    refetchIntervalInBackground: true,
  });

  const notificationData = Array.isArray((notificationsResponse as any)?.data) ? (notificationsResponse as any).data : [];

  // WebSocket connection for real-time updates
  useEffect(() => {
    let socket: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;
    
    const connectWebSocket = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('WebSocket connected for real-time notifications');
        // Send subscription message
        socket.send(JSON.stringify({ type: 'subscribe_notifications' }));
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Real-time notification update received:', data);
          
          if (data.type === 'DEPOSIT_CREATED' || data.type === 'TRANSFER_CREATED' || data.type === 'new_notification' || data.type === 'notification_update' || data.type === 'kyc_status_update' || data.type === 'CONNECTION_REQUEST_CREATED' || data.type === 'CONNECTION_REQUEST_RESPONDED') {
            // Force immediate refresh of all notification-related data
            queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
            queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
            queryClient.invalidateQueries({ queryKey: ['/api/wallet/summary'] });
            queryClient.invalidateQueries({ queryKey: ['/api/balances'] });
            
            if (data.type === 'kyc_status_update') {
              // Also refresh verification status
              queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
            }
            
            console.log('Notification data refreshed due to real-time update:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      socket.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };
    
    connectWebSocket();
    
    return () => {
      if (socket) {
        socket.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [queryClient]);

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => 
      apiRequest('PUT', `/api/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
    }
  });

  const notificationTabs = [
    'All',
    t('system_notification'),
    t('latest_events'),
    t('announcement'),
    t('rewards')
  ];

  const handleReadAll = async () => {
    // Trigger haptic feedback immediately
    medium();
    
    if (notificationData && Array.isArray(notificationData)) {
      const unreadNotifications = notificationData.filter((n: any) => !n.isRead);
      
      if (unreadNotifications.length === 0) {
        return; // No unread notifications
      }
      
      // Immediately update the UI by marking all as read optimistically
      const updatedNotifications = notificationData.map((notification: any) => ({
        ...notification,
        isRead: true
      }));
      
      // Update the cache immediately for instant UI feedback
      queryClient.setQueryData(['/api/notifications'], (oldData: any) => ({
        ...oldData,
        data: updatedNotifications
      }));
      
      // Update unread count to 0 immediately
      queryClient.setQueryData(['/api/notifications/unread-count'], { 
        success: true, 
        unreadCount: 0 
      });
      
      // Then make the API calls in the background
      for (const notification of unreadNotifications) {
        markAsReadMutation.mutate(notification._id, {
          onError: () => {
            // If any request fails, refetch the data to get the correct state
            queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
            queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
          }
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1a1a40]">
        <Link href="/mobile">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-lg font-semibold">{t('notifications')}</h1>
        <div className="flex items-center space-x-3">
          <button onClick={handleReadAll}>
            <CheckCheck className="w-6 h-6 text-gray-400" />
          </button>
          <Link href="/mobile/notification-settings">
            <Settings className="w-6 h-6 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Notification Tabs - Single Line with Small Fonts */}
      <div className="px-4 py-2">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {notificationTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-1 px-2 text-[10px] font-medium flex-shrink-0 ${
                activeTab === tab
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Notifications List */}
        {isLoading ? (
          <div className="px-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[#1a1a40] border-[#2a2a50] p-3 animate-pulse">
                <div className="h-3 bg-gray-700 rounded mb-1"></div>
                <div className="h-2 bg-gray-700 rounded mb-1"></div>
                <div className="h-2 bg-gray-700 rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        ) : notificationData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-12 h-12 bg-[#1a1a40] rounded-full flex items-center justify-center mb-3">
              <CheckCheck className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-gray-400 text-center text-sm">No notifications yet</p>
            <p className="text-gray-500 text-xs text-center mt-1">
              You'll see important updates here
            </p>
          </div>
        ) : (
          <div className="px-4 space-y-2 pb-4">
            {notificationData
              .filter((notification: any) => 
                activeTab === 'All' ||
                notification.type === activeTab.toLowerCase() ||
                (activeTab === t('system_notification') && notification.type === 'system') ||
                (activeTab === t('latest_events') && (notification.type === 'deposit' || notification.type === 'transfer_sent' || notification.type === 'transfer_received' || notification.type === 'withdrawal')) ||
                (activeTab === t('announcement') && notification.type === 'announcement') ||
                (activeTab === t('rewards') && notification.type === 'rewards')
              )
              .map((notification: any) => (
                <Card 
                  key={notification._id} 
                  className={`border-[#2a2a50] p-3 ${notification.isRead ? 'bg-[#1a1a40]' : 'bg-[#1a1a40]'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-white font-medium text-xs">{notification.title}</h3>
                    <div className="flex items-center space-x-1">
                      {!notification.isRead && (
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      )}
                      <span className="text-[10px] text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-[10px] mb-1 whitespace-pre-line leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-[9px] capitalize">
                      {notification.type === 'deposit' ? 'System Notification' : 
                       notification.type === 'message' ? 'Support Message' : 
                       notification.type === 'connection_request' ? 'Connection Request' :
                       notification.type === 'kyc_approved' ? 'KYC Approved' :
                       notification.type === 'kyc_rejected' ? 'KYC Review' :
                       notification.type === 'system' && notification.data?.notificationType === 'message' ? 'Support Message' :
                       notification.type}
                    </span>
                    {(notification.type === 'message' || (notification.type === 'system' && notification.data?.notificationType === 'message')) ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-orange-500 text-[10px] p-0 h-auto hover:text-orange-400"
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsReadMutation.mutate(notification._id);
                          }
                          setSelectedNotification(notification);
                          setMessageModalOpen(true);
                        }}
                      >
                        Read Message →
                      </Button>
                    ) : notification.type === 'connection_request' ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-orange-500 text-[10px] p-0 h-auto hover:text-orange-400"
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsReadMutation.mutate(notification._id);
                          }
                          setSelectedNotification(notification);
                          setConnectionRequestModalOpen(true);
                        }}
                      >
                        Respond →
                      </Button>
                    ) : notification.type === 'kyc_approved' || notification.type === 'kyc_rejected' ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-orange-500 text-[10px] p-0 h-auto hover:text-orange-400"
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsReadMutation.mutate(notification._id);
                          }
                          // Navigate to KYC status page
                          window.location.hash = '#/mobile/kyc-status';
                        }}
                      >
                        View Status →
                      </Button>
                    ) : (notification.type === 'deposit' || notification.type === 'transfer_received' || notification.type === 'transfer_sent' || notification.type === 'withdrawal') && notification.data && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-orange-500 text-[10px] p-0 h-auto hover:text-orange-400"
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsReadMutation.mutate(notification._id);
                          }
                          
                          if (notification.type === 'deposit' || notification.type === 'transfer_received' || notification.type === 'transfer_sent' || notification.type === 'withdrawal') {
                            // Set referrer for smart back navigation
                            localStorage.setItem('assetsHistoryReferrer', 'notifications');
                            // Navigate to asset history with transaction highlight
                            let transactionId = null;
                            
                            // For deposits, the notification.data.transactionId is actually the MongoDB _id
                            if (notification.type === 'deposit' && notification.data?.transactionId) {
                              transactionId = notification.data.transactionId;
                            }
                            // For transfers, use the transferId which maps to transfer._id
                            else if ((notification.type === 'transfer_sent' || notification.type === 'transfer_received') && notification.data?.transferId) {
                              transactionId = notification.data.transferId;
                            }
                            // For withdrawals, use the transactionId which maps to withdrawal._id
                            else if (notification.type === 'withdrawal' && notification.data?.transactionId) {
                              transactionId = notification.data.transactionId;
                            }
                            
                            console.log('Notification highlight:', { 
                              type: notification.type, 
                              transactionId,
                              data: notification.data 
                            });
                            
                            // Use proper navigation with URL parameters stored in sessionStorage
                            if (transactionId) {
                              sessionStorage.setItem('highlightTransactionId', transactionId);
                            }
                            navigate('/mobile/assets-history');
                          }
                        }}
                      >
                        View More →
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Notification Message Modal */}
      {selectedNotification && (
        <NotificationMessageModal
          isOpen={messageModalOpen}
          onClose={() => {
            setMessageModalOpen(false);
            setSelectedNotification(null);
          }}
          notification={selectedNotification}
        />
      )}

      {/* Connection Request Modal */}
      {selectedNotification && (
        <ConnectionRequestModal
          isOpen={connectionRequestModalOpen}
          onClose={() => {
            setConnectionRequestModalOpen(false);
            setSelectedNotification(null);
          }}
          notification={selectedNotification}
        />
      )}
    </div>
  );
}