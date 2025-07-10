import { useState, useEffect, useRef } from 'react';
import { X, Send, Globe, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import chatbotVideo from '@assets/a82f09b8ae5243a19719cd8bc304672b_1751938416652.webm';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface VideoChatBotProps {
  user: any;
}

export default function VideoChatBot({ user }: VideoChatBotProps) {
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
      {/* Video Chat Bot Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <video
            src={chatbotVideo}
            autoPlay
            loop
            muted
            className="w-16 h-16 rounded-full object-cover cursor-pointer transition-transform duration-300 hover:scale-110 shadow-lg"
            onClick={() => setShowChat(true)}
          />
        </div>
      </div>

      {/* Chat Interface Popup - Positioned on Right Side */}
      {showChat && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end bg-black/30 backdrop-blur-sm"
             onClick={() => setShowChat(false)}>
          <div className="bg-[#0a0a2e] border border-blue-800 rounded-l-lg w-[400px] h-full max-h-[600px] mr-0 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
               onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-blue-800">
              <h1 className="text-lg font-semibold text-white">24/7 Dedicated Support</h1>
              <div className="flex items-center space-x-3">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Globe className="w-5 h-5" />
                </button>
                <button 
                  onClick={closeChat}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-orange-500 text-white'
                        : 'bg-blue-900 text-gray-200'
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
                  <div className="bg-blue-900 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-blue-800">
              <div className="flex space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Drop your question(s) here"
                  className="flex-1 bg-blue-950 border-blue-700 text-white placeholder-gray-400"
                  disabled={isLoading}
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
          </div>
        </div>
      )}
    </>
  );
}