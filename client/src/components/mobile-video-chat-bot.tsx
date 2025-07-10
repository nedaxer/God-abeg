import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import chatbotVideo from '@assets/a82f09b8ae5243a19719cd8bc304672b_1751938416652.webm';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface MobileVideoChatBotProps {
  user: any;
  supportNotificationCount?: { supportUnreadCount: number };
}

export default function MobileVideoChatBot({ user, supportNotificationCount }: MobileVideoChatBotProps) {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message when chat opens
  useEffect(() => {
    if (showChat && messages.length === 0) {
      const userName = user?.firstName || user?.username || 'there';
      const welcomeMessage: Message = {
        id: '1',
        text: `Hello ${userName}! I'm Nedaxer Bot, how can I assist you today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [showChat, user, messages.length]);

  // Handle keyboard behavior when chat is open
  useEffect(() => {
    if (showChat) {
      // Prevent body scroll when chat is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Add class to handle keyboard events
      document.body.classList.add('chat-active');
      
      return () => {
        // Restore body scroll when chat closes
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.classList.remove('chat-active');
      };
    }
  }, [showChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          language: 'en',
          conversationHistory: messages.slice(-5),
          userName: user?.firstName || user?.username || 'User'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get bot response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I apologize, but I\'m having trouble responding right now. Please try again later.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeChat = () => {
    setShowChat(false);
    setMessages([]);
  };

  return (
    <>
      {/* Small Video Chat Bot Icon for Mobile */}
      <div className="relative">
        <video
          src={chatbotVideo}
          autoPlay
          loop
          muted
          className="w-8 h-8 rounded-full object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
          onClick={() => setShowChat(true)}
        />
        

      </div>

      {/* Mobile Chat Interface - Old Messages Page Style */}
      {showChat && createPortal(
        <div 
          className="fixed inset-0 bg-[#0a0a2e] text-white" 
          style={{ zIndex: 999999 }}
        >
          {/* Header - Same style as messages page */}
          <div className="flex items-center p-3 border-b border-white/10">
            <button 
              onClick={closeChat}
              className="mr-2 text-white hover:bg-white/10 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-semibold">24/7 Support Bot</h1>
              <p className="text-xs text-gray-400">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Messages Area - Full height with keyboard consideration */}
          <div 
            className="overflow-y-auto chat-messages" 
            style={{ 
              height: 'calc(100vh - 140px)', 
              minHeight: 'calc(100vh - 140px)',
              maxHeight: 'calc(100vh - 140px)'
            }}
          >
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/5 text-white border border-white/10'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 text-white p-3 rounded-lg border border-white/10">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area - Stays above keyboard */}
          <div 
            className="fixed bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#0a0a2e]"
            style={{ 
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)',
              zIndex: 999999 
            }}
          >
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Drop your question(s) here"
                className="flex-1 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-orange-500"
                disabled={isLoading}
                style={{ fontSize: '16px' }} // Prevents iOS zoom
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputText.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}