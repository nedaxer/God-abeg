import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import chatbotVideo from '@assets/a82f09b8ae5243a19719cd8bc304672b_1751938416652.webm';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface LandingPageChatBotProps {
  isDesktop?: boolean;
}

export default function LandingPageChatBot({ isDesktop = false }: LandingPageChatBotProps) {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message when chat opens
  useEffect(() => {
    if (showChat && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: `Hello! I'm Nedaxer Bot, your crypto trading assistant. How can I help you today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [showChat, messages.length]);

  // Animation effect for desktop bot
  useEffect(() => {
    if (isDesktop) {
      const animationInterval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 3000);
      }, 8000);

      return () => clearInterval(animationInterval);
    }
  }, [isDesktop]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle keyboard behavior when chat is open (mobile)
  useEffect(() => {
    if (showChat && !isDesktop) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.classList.add('chat-active');
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.classList.remove('chat-active');
      };
    }
  }, [showChat, isDesktop]);

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
          userName: 'User'
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

  // Desktop version with animated bot
  if (isDesktop) {
    return (
      <>
        {/* Desktop Animated Chat Bot Icon */}
        <div className="fixed bottom-6 right-6 z-50">
          <div
            onClick={() => setShowChat(true)}
            className={`w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 ${
              isAnimating ? 'animate-bounce scale-110' : 'hover:scale-105'
            } ${showChat ? 'ring-2 ring-orange-400' : ''}`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative">
                {/* Bot Eyes */}
                <div className="flex gap-1 mb-1">
                  <div className={`w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300 ${
                    isAnimating ? 'animate-pulse bg-orange-600' : ''
                  }`} />
                  <div className={`w-1.5 h-1.5 bg-orange-500 rounded-full transition-all duration-300 ${
                    isAnimating ? 'animate-pulse bg-orange-600' : ''
                  }`} />
                </div>
                {/* Bot Smile */}
                <div className={`w-3 h-1.5 border-b-2 border-orange-500 rounded-full transition-all duration-300 ${
                  isAnimating ? 'border-orange-600' : ''
                }`} />
                
                {/* Activity Indicator */}
                {isAnimating && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Chat Interface */}
        {showChat && (
          <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">Nedaxer Bot</span>
              </div>
              <button
                onClick={closeChat}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 h-64">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isUser ? 'text-orange-100' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-none px-3 py-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Mobile version with video chatbot
  return (
    <>
      {/* Mobile Video Chat Bot Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <video
            src={chatbotVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-16 h-16 rounded-full object-cover cursor-pointer transition-transform duration-300 hover:scale-110 shadow-lg"
            onClick={() => setShowChat(true)}
          />

        </div>
      </div>

      {/* Mobile Chat Interface */}
      {showChat && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-end">
          <div className="bg-white w-full h-4/5 rounded-t-2xl flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <video
                  src={chatbotVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <span className="font-semibold">Nedaxer Bot</span>
                  <div className="text-xs text-orange-100">Assistant</div>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                      message.isUser
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isUser ? 'text-orange-100' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-none px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 p-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}