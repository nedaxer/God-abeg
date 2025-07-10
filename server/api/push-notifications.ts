import { Request, Response } from 'express';
import webpush from 'web-push';

// Generate VAPID keys if not provided
function generateVapidKeys() {
  try {
    return webpush.generateVAPIDKeys();
  } catch (error) {
    console.error('Error generating VAPID keys:', error);
    return null;
  }
}

// Configure web-push with proper VAPID keys
let vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || ''
};

// Generate keys if not provided or invalid
if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
  console.log('Generating new VAPID keys...');
  const generatedKeys = generateVapidKeys();
  if (generatedKeys) {
    vapidKeys = generatedKeys;
    console.log('✅ VAPID keys generated successfully');
    console.log('Public Key:', vapidKeys.publicKey);
    console.log('Private Key:', vapidKeys.privateKey.substring(0, 20) + '...');
  }
}

// Only set VAPID details if we have valid keys
if (vapidKeys.publicKey && vapidKeys.privateKey) {
  try {
    webpush.setVapidDetails(
      'mailto:support@nedaxer.com',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
    console.log('✅ Web push configured successfully');
  } catch (error) {
    console.error('Error configuring web push:', error);
  }
}

// In-memory storage for push subscriptions (in production, use MongoDB)
const pushSubscriptions = new Map<string, PushSubscription>();

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  type?: string;
  amount?: string;
  currency?: string;
  sender?: string;
  recipient?: string;
  tag?: string;
  url?: string;
}

// Get VAPID public key
export const getVapidKey = (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      vapidKey: vapidKeys.publicKey
    });
  } catch (error) {
    console.error('Error getting VAPID key:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get VAPID key'
    });
  }
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (req: Request, res: Response) => {
  try {
    const { subscription, userId } = req.body;

    if (!subscription || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Subscription and userId are required'
      });
    }

    // Store subscription (in production, save to MongoDB)
    pushSubscriptions.set(userId, subscription);

    console.log(`✅ Push notification subscription saved for user: ${userId}`);

    res.json({
      success: true,
      message: 'Push notification subscription saved successfully'
    });
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to push notifications'
    });
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    // Remove subscription (in production, remove from MongoDB)
    pushSubscriptions.delete(userId);

    console.log(`✅ Push notification subscription removed for user: ${userId}`);

    res.json({
      success: true,
      message: 'Push notification subscription removed successfully'
    });
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from push notifications'
    });
  }
};

// Send push notification to a specific user
export const sendPushNotification = async (userId: string, payload: NotificationPayload) => {
  try {
    const subscription = pushSubscriptions.get(userId);
    
    if (!subscription) {
      console.log(`No push subscription found for user: ${userId}`);
      return false;
    }

    const notificationPayload = {
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: payload.badge || '/icons/icon-96x96.png',
      type: payload.type || 'general',
      amount: payload.amount,
      currency: payload.currency,
      sender: payload.sender,
      recipient: payload.recipient,
      tag: payload.tag || `nedaxer-${payload.type}-${Date.now()}`,
      url: payload.url || '/'
    };

    await webpush.sendNotification(
      subscription,
      JSON.stringify(notificationPayload)
    );

    console.log(`✅ Push notification sent to user: ${userId}`);
    return true;
  } catch (error) {
    console.error(`Error sending push notification to user ${userId}:`, error);
    
    // If subscription is invalid, remove it
    if (error.statusCode === 410) {
      pushSubscriptions.delete(userId);
      console.log(`Removed invalid push subscription for user: ${userId}`);
    }
    
    return false;
  }
};

// Send push notification to multiple users
export const sendPushNotificationToUsers = async (userIds: string[], payload: NotificationPayload) => {
  const results = await Promise.allSettled(
    userIds.map(userId => sendPushNotification(userId, payload))
  );

  const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
  const failed = results.length - successful;

  console.log(`Push notifications sent: ${successful} successful, ${failed} failed`);
  return { successful, failed };
};

// Send test notification
export const sendTestNotification = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const testPayload: NotificationPayload = {
      title: 'Test Notification',
      body: 'This is a test notification from Nedaxer!',
      type: 'test',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png'
    };

    const success = await sendPushNotification(userId, testPayload);

    if (success) {
      res.json({
        success: true,
        message: 'Test notification sent successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to send test notification'
      });
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification'
    });
  }
};

// Send deposit notification
export const sendDepositNotification = async (userId: string, amount: number, currency: string) => {
  const payload: NotificationPayload = {
    title: 'Deposit Received',
    body: `+${amount} ${currency} has been added to your account`,
    type: 'deposit',
    amount: amount.toString(),
    currency: currency,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png'
  };

  return await sendPushNotification(userId, payload);
};

// Send transfer notification
export const sendTransferNotification = async (
  userId: string, 
  amount: number, 
  currency: string, 
  type: 'sent' | 'received',
  otherParty: string
) => {
  const payload: NotificationPayload = {
    title: type === 'sent' ? 'Transfer Sent' : 'Transfer Received',
    body: type === 'sent' 
      ? `${amount} ${currency} sent to ${otherParty}`
      : `+${amount} ${currency} received from ${otherParty}`,
    type: type === 'sent' ? 'transfer_sent' : 'transfer_received',
    amount: amount.toString(),
    currency: currency,
    sender: type === 'received' ? otherParty : undefined,
    recipient: type === 'sent' ? otherParty : undefined,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png'
  };

  return await sendPushNotification(userId, payload);
};

// Send withdrawal notification
export const sendWithdrawalNotification = async (userId: string, amount: number, currency: string) => {
  const payload: NotificationPayload = {
    title: 'Withdrawal Processed',
    body: `${amount} ${currency} withdrawal completed`,
    type: 'withdrawal',
    amount: amount.toString(),
    currency: currency,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png'
  };

  return await sendPushNotification(userId, payload);
};

// Send support message notification
export const sendSupportMessageNotification = async (userId: string, message: string) => {
  const payload: NotificationPayload = {
    title: 'Support Reply',
    body: message || 'You have a new message from support',
    type: 'support_message',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png'
  };

  return await sendPushNotification(userId, payload);
};

// Send KYC update notification
export const sendKycUpdateNotification = async (userId: string, status: string) => {
  const payload: NotificationPayload = {
    title: 'KYC Status Update',
    body: `Your KYC status has been updated to: ${status}`,
    type: 'kyc_update',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png'
  };

  return await sendPushNotification(userId, payload);
};

// Send connection request notification
export const sendConnectionRequestNotification = async (userId: string, message: string) => {
  const payload: NotificationPayload = {
    title: 'Connection Request',
    body: message || 'You have a new connection request',
    type: 'connection_request',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png'
  };

  return await sendPushNotification(userId, payload);
};

// Get subscription status for a user
export const getSubscriptionStatus = (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const hasSubscription = pushSubscriptions.has(userId);

    res.json({
      success: true,
      hasSubscription,
      subscriptionCount: pushSubscriptions.size
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription status'
    });
  }
};

// Get all subscriptions (admin only)
export const getAllSubscriptions = (req: Request, res: Response) => {
  try {
    const subscriptions = Array.from(pushSubscriptions.keys());

    res.json({
      success: true,
      subscriptions,
      count: subscriptions.length
    });
  } catch (error) {
    console.error('Error getting all subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscriptions'
    });
  }
};