import { useEffect, useState } from 'react';
import { useAuth } from './use-auth';

export interface PushNotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [permission, setPermission] = useState<PushNotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if service worker and push notifications are supported
  const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;

  // Update permission state
  const updatePermissionState = () => {
    if (!isSupported) return;

    const currentPermission = Notification.permission;
    setPermission({
      granted: currentPermission === 'granted',
      denied: currentPermission === 'denied',
      default: currentPermission === 'default'
    });
  };

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    try {
      setIsLoading(true);
      const result = await Notification.requestPermission();
      
      updatePermissionState();
      
      if (result === 'granted') {
        console.log('✅ Push notification permission granted');
        await subscribeToPushNotifications();
        return true;
      } else {
        console.log('❌ Push notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to push notifications
  const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
    if (!isSupported || Notification.permission !== 'granted') {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setSubscription(existingSubscription);
        await saveSubscriptionToServer(existingSubscription);
        return existingSubscription;
      }

      // Create new subscription
      const vapidKey = await getVapidKey();
      if (!vapidKey) {
        console.error('VAPID key not available');
        return null;
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      setSubscription(newSubscription);
      await saveSubscriptionToServer(newSubscription);
      
      console.log('✅ Push notification subscription created');
      return newSubscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  };

  // Get VAPID key from server
  const getVapidKey = async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/notifications/vapid-key');
      if (!response.ok) {
        throw new Error('Failed to fetch VAPID key');
      }
      const data = await response.json();
      return data.vapidKey;
    } catch (error) {
      console.error('Error fetching VAPID key:', error);
      return null;
    }
  };

  // Save subscription to server
  const saveSubscriptionToServer = async (subscription: PushSubscription) => {
    if (!user) return;

    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription to server');
      }

      console.log('✅ Push notification subscription saved to server');
    } catch (error) {
      console.error('Error saving subscription to server:', error);
    }
  };

  // Unsubscribe from push notifications
  const unsubscribe = async (): Promise<boolean> => {
    if (!subscription) return false;

    try {
      const success = await subscription.unsubscribe();
      if (success) {
        setSubscription(null);
        await removeSubscriptionFromServer();
        console.log('✅ Push notification subscription removed');
      }
      return success;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  };

  // Remove subscription from server
  const removeSubscriptionFromServer = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove subscription from server');
      }

      console.log('✅ Push notification subscription removed from server');
    } catch (error) {
      console.error('Error removing subscription from server:', error);
    }
  };

  // Send test notification
  const sendTestNotification = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      console.log('✅ Test notification sent');
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  // Check current subscription status
  const checkSubscriptionStatus = async () => {
    if (!isSupported || !user) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const currentSubscription = await registration.pushManager.getSubscription();
      setSubscription(currentSubscription);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  // Initialize on user login
  useEffect(() => {
    if (user && isSupported) {
      updatePermissionState();
      checkSubscriptionStatus();
    }
  }, [user, isSupported]);

  // Show permission prompt after login/registration
  const showPermissionPrompt = () => {
    if (!isSupported || permission.denied || permission.granted) {
      return;
    }

    // Create permission prompt modal
    const modal = document.createElement('div');
    modal.id = 'push-notification-modal';
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
      ">
        <div style="
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        ">
          <div style="
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: url('/icons/app-icon.png') no-repeat center center;
            background-size: contain;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          "></div>
          
          <h3 style="
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 12px;
            font-family: system-ui, -apple-system, sans-serif;
          ">Stay Updated with Nedaxer</h3>
          
          <p style="
            font-size: 16px;
            color: #666;
            line-height: 1.5;
            margin-bottom: 32px;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            Get instant notifications for deposits, transfers, withdrawals, and important account updates.
          </p>
          
          <div style="
            display: flex;
            gap: 12px;
            justify-content: center;
          ">
            <button id="push-allow-btn" style="
              background: #f59e0b;
              color: white;
              border: none;
              padding: 14px 24px;
              border-radius: 12px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              flex: 1;
              transition: all 0.2s;
              font-family: system-ui, -apple-system, sans-serif;
            ">Allow Notifications</button>
            
            <button id="push-later-btn" style="
              background: #f3f4f6;
              color: #666;
              border: none;
              padding: 14px 24px;
              border-radius: 12px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              flex: 1;
              transition: all 0.2s;
              font-family: system-ui, -apple-system, sans-serif;
            ">Maybe Later</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add button event listeners
    const allowBtn = document.getElementById('push-allow-btn');
    const laterBtn = document.getElementById('push-later-btn');

    allowBtn?.addEventListener('click', async () => {
      modal.remove();
      await requestPermission();
    });

    laterBtn?.addEventListener('click', () => {
      modal.remove();
    });

    // Auto-remove modal after 30 seconds
    setTimeout(() => {
      if (document.getElementById('push-notification-modal')) {
        modal.remove();
      }
    }, 30000);
  };

  return {
    permission,
    subscription,
    isLoading,
    isSupported,
    requestPermission,
    subscribeToPushNotifications,
    unsubscribe,
    sendTestNotification,
    showPermissionPrompt,
    checkSubscriptionStatus
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}