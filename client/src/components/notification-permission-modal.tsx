import React, { useEffect, useState } from 'react';
import { usePushNotifications } from '../hooks/use-push-notifications';
import { useAuth } from '../hooks/use-auth';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  showOnLogin?: boolean;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  isOpen,
  onClose,
  showOnLogin = false
}) => {
  const { user } = useAuth();
  const { requestPermission, permission, isLoading, isSupported } = usePushNotifications();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && user && isSupported) {
      // Show modal only if permission is not granted or denied
      if (permission.default) {
        setIsVisible(true);
      } else {
        onClose();
      }
    }
  }, [isOpen, user, isSupported, permission, onClose]);

  const handleAllowNotifications = async () => {
    try {
      const granted = await requestPermission();
      if (granted) {
        console.log('✅ Notifications enabled successfully');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsVisible(false);
      onClose();
    }
  };

  const handleMaybeLater = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible || !isSupported) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        {/* App Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-contain bg-no-repeat bg-center rounded-2xl shadow-lg"
             style={{ backgroundImage: 'url(/icons/app-icon.png)' }}>
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Stay Updated with Nedaxer
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-base leading-relaxed mb-8">
          Get instant notifications for deposits, transfers, withdrawals, and important account updates so you never miss important trading opportunities.
        </p>
        
        {/* Feature List */}
        <div className="text-left mb-8 space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-3">💰</span>
            <span>Deposit confirmations</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-3">📤</span>
            <span>Transfer notifications</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-3">🏦</span>
            <span>Withdrawal updates</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-3">💬</span>
            <span>Support messages</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAllowNotifications}
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Enabling...' : 'Allow Notifications'}
          </button>
          
          <button
            onClick={handleMaybeLater}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-4 px-6 rounded-xl transition-colors"
          >
            Maybe Later
          </button>
        </div>
        
        {/* Privacy Note */}
        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
          You can change this setting anytime in your browser settings or profile preferences.
        </p>
      </div>
    </div>
  );
};

export default NotificationPermissionModal;