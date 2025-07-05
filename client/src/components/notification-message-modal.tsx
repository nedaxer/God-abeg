import React from 'react';
import { X, MessageCircle, User } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface NotificationMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    title: string;
    message: string;
    createdAt: string;
    data?: {
      from?: string;
      messageId?: string;
    };
  };
}

export function NotificationMessageModal({ isOpen, onClose, notification }: NotificationMessageModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const bottomNav = document.querySelector('[data-navigation="bottom"]') as HTMLElement;
    const mobileLayout = document.querySelector('[data-layout="mobile"]') as HTMLElement;
    
    if (isOpen) {
      // Blur bottom navigation
      if (bottomNav) {
        bottomNav.style.filter = 'blur(4px)';
        bottomNav.style.transition = 'filter 0.3s ease-out';
      }
      
      // Blur main content
      if (mobileLayout) {
        mobileLayout.style.filter = 'blur(2px)';
        mobileLayout.style.transition = 'filter 0.3s ease-out';
      }
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Remove blur effects
      if (bottomNav) {
        bottomNav.style.filter = 'none';
      }
      if (mobileLayout) {
        mobileLayout.style.filter = 'none';
      }
      
      // Restore scrolling
      document.body.style.overflow = 'auto';
    }

    // Cleanup function
    return () => {
      if (bottomNav) {
        bottomNav.style.filter = 'none';
      }
      if (mobileLayout) {
        mobileLayout.style.filter = 'none';
      }
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;
  
  return createPortal(
    <div 
      className="notification-message-modal-overlay fixed inset-0" 
      style={{ 
        zIndex: 999999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }} 
      data-modal="notification-message"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div 
        className="notification-message-modal-content fixed inset-4 bg-[#0a0a2e] border border-[#1a1a40] text-white rounded-2xl flex flex-col"
        style={{
          zIndex: 999999999,
          position: 'fixed',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          maxHeight: 'calc(100vh - 40px)',
          transform: 'scale(1)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1a1a40]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{notification.title}</h2>
              <p className="text-xs text-gray-400">
                {notification.data?.from === 'support' ? 'Support Team' : 'System Message'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Message Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-[#1a1a40] rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-white text-base leading-relaxed whitespace-pre-line">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  {new Date(notification.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1a1a40]">
          <button
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Close Message
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}