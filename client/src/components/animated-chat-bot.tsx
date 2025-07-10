import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Bot } from 'lucide-react';

export default function AnimatedChatBot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', message: 'Hi! I\'m your crypto trading assistant. Ask me anything about trading, market analysis, or crypto insights!' }
  ]);

  // Check if desktop - only show on desktop
  const [isDesktop, setIsDesktop] = useState(false);
  
  // ALL useEffect hooks must come before the conditional return
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);
  
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 3000);
    }, 8000);

    return () => clearInterval(animationInterval);
  }, []);
  
  // Don't render on mobile (AFTER all hooks)
  if (!isDesktop) {
    return null;
  }

  const sendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;
    
    const newMessage = { role: 'user', message: chatMessage };
    setChatHistory(prev => [...prev, newMessage]);
    setIsLoading(true);
    
    try {
      // Send message to OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: chatMessage }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const botResponse = { 
          role: 'bot', 
          message: data.response 
        };
        setChatHistory(prev => [...prev, botResponse]);
      } else {
        const botResponse = { 
          role: 'bot', 
          message: 'Sorry, I\'m having trouble connecting right now. Please try again later.' 
        };
        setChatHistory(prev => [...prev, botResponse]);
      }
    } catch (error) {
      const botResponse = { 
        role: 'bot', 
        message: 'Sorry, I\'m having trouble connecting right now. Please try again later.' 
      };
      setChatHistory(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
    
    setChatMessage('');
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Animated Chat Bot Icon */}
      <div className="fixed bottom-24 right-4 z-50 md:bottom-20">
        <div
          onClick={toggleChat}
          className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 ${
            isAnimating ? 'animate-bounce scale-110' : 'hover:scale-105'
          } ${isChatOpen ? 'ring-2 ring-orange-400' : ''}`}
        >
          {/* Bot Face */}
          <div className="relative">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center relative">
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
              <div className={`absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-1.5 border-b-2 border-orange-500 rounded-full transition-all duration-500 ${
                isAnimating ? 'border-orange-600 w-4' : ''
              }`} />
            </div>
            
            {/* Waving Hand Animation */}
            <div className={`absolute -top-2 -right-1 text-xs transition-all duration-300 ${
              isAnimating ? 'animate-wiggle' : ''
            }`}>
              👋
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-16 w-72 md:bottom-20 md:right-20 md:w-80 z-40 animate-in slide-in-from-right duration-300">
          <Card className="bg-black/95 backdrop-blur-xl border-orange-500/40 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-orange-500 text-sm font-medium flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Nedaxer Chat Bot
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Chat Messages */}
              <div className="h-48 overflow-y-auto space-y-2 mb-3 scrollbar-thin scrollbar-thumb-orange-500/50">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-lg text-xs ${
                      msg.role === 'user' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-800 text-gray-200'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-gray-200 max-w-[80%] px-3 py-2 rounded-lg text-xs">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about crypto trading..."
                  className="flex-1 bg-gray-800 border-gray-700 text-white text-xs"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  disabled={isLoading || !chatMessage.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}