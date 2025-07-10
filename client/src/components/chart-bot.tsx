import { useState, useEffect } from 'react';
import { TrendingUp, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ChartBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Bot animation cycle
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 5000);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <>
      {/* Chart Bot Icon */}
      <div className="fixed bottom-24 right-4 z-50 md:bottom-20">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 ${
            isAnimating ? 'animate-bounce scale-110' : 'hover:scale-105'
          }`}
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
            {isAnimating && (
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4">
                <div className="w-full h-full bg-orange-400 rounded-full relative animate-pulse">
                  {/* Hand fingers */}
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-orange-500 rounded-full animate-bounce" />
                  <div className="absolute -top-0.5 left-1/3 w-0.5 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="absolute -top-0.5 right-1/3 w-0.5 h-1 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Banner */}
      {isOpen && (
        <div className="fixed bottom-24 right-16 w-72 md:bottom-20 md:right-20 md:w-80 z-40 animate-in slide-in-from-right duration-300">
          <Card className="bg-black/95 backdrop-blur-xl border-orange-500/40 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-orange-500 text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Live Chart
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Mini Chart Display with Animation */}
              <div className="h-28 md:h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-pulse" />
                <TrendingUp className="w-8 h-8 text-orange-500 animate-pulse" />
              </div>
              
              {/* Chart Stats */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">BTC/USD</span>
                  <span className="text-green-400 animate-pulse">+2.45%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Price</span>
                  <span className="text-white font-mono">$107,591</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">24h Vol</span>
                  <span className="text-white font-mono">$25.7B</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="text-white font-mono">$2.14T</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}