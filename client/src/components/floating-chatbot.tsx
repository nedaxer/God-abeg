import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { MessageSquare, X, Minimize2 } from 'lucide-react';

export default function FloatingChatbot() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999999]">
      {isMinimized ? (
        // Minimized state - just the icon
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-2xl border-2 border-orange-400/50 backdrop-blur-sm"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      ) : (
        // Expanded state - floating chat widget
        <div className="bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden max-w-xs">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Nedaxer Assistant</p>
                <p className="text-white/80 text-xs">Online now</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(true)}
                className="w-6 h-6 p-0 text-white hover:bg-white/20"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="w-6 h-6 p-0 text-white hover:bg-white/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-white text-sm">
                👋 Hi! I'm your Nedaxer assistant. How can I help you today?
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-400 text-xs">Quick actions:</p>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-800/50 text-xs"
                  onClick={() => window.location.href = '#/mobile/verification'}
                >
                  Help with verification
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-800/50 text-xs"
                  onClick={() => window.location.href = '#/mobile/assets'}
                >
                  Account balance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-800/50 text-xs"
                  onClick={() => window.location.href = '#/mobile/trade'}
                >
                  Trading help
                </Button>
              </div>
            </div>

            <Link href="/mobile/chatbot">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm">
                Open Full Chat
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}