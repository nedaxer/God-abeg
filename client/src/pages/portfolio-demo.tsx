import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PortfolioDemo() {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Convert USD amounts to selected currency
  const convertToSelectedCurrency = (usdAmount: number): string => {
    return usdAmount.toFixed(2);
  };

  // Get currency symbol - returns empty string to show only numbers
  const getCurrencySymbol = (currency: string): string => {
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <h1 className="text-xl font-bold text-white">Portfolio Demo</h1>
      </div>

      {/* Total Assets */}
      <div className="px-4 pb-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-gray-400 text-sm">Total Assets</span>
          <button onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? (
              <Eye className="w-4 h-4 text-gray-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">
              {showBalance ? convertToSelectedCurrency(0.51) : '****'}
            </span>
            <span className="text-gray-400">{selectedCurrency}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <span>≈ {showBalance ? '0.00000484' : '****'} BTC</span>
          </div>
        </div>
      </div>

      {/* Portfolio Circle Chart */}
      <div className="px-4">
        <h3 className="text-white font-medium mb-6 text-sm">Portfolio Distribution</h3>
        
        {/* Circular Portfolio Chart */}
        <div className="relative flex flex-col items-center mb-8">
          {/* Donut Chart Container */}
          <div className="relative w-80 h-80 mb-6">
            {/* SVG Donut Chart */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="8"
                />
                
                {/* Bitcoin segment (49.5%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray="124.5 126.7"
                  strokeDashoffset="0"
                  className="transition-all duration-1000"
                />
                
                {/* Ethereum segment (24.5%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="8"
                  strokeDasharray="61.6 189.6"
                  strokeDashoffset="-124.5"
                  className="transition-all duration-1000"
                />
                
                {/* Litecoin segment (4.7%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="11.8 239.4"
                  strokeDashoffset="-186.1"
                  className="transition-all duration-1000"
                />
                
                {/* IOTA segment (4.3%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="8"
                  strokeDasharray="10.8 240.4"
                  strokeDashoffset="-197.9"
                  className="transition-all duration-1000"
                />
                
                {/* Monero segment (3.1%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeDasharray="7.8 243.4"
                  strokeDashoffset="-208.7"
                  className="transition-all duration-1000"
                />
                
                {/* Binance segment (2.1%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="8"
                  strokeDasharray="5.3 245.9"
                  strokeDashoffset="-216.5"
                  className="transition-all duration-1000"
                />
                
                {/* Cardano segment (1.9%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="8"
                  strokeDasharray="4.8 246.4"
                  strokeDashoffset="-221.8"
                  className="transition-all duration-1000"
                />
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xl font-bold text-white">
                  {showBalance ? getCurrencySymbol(selectedCurrency) + convertToSelectedCurrency(0.51) : '****'}
                </div>
                <div className="text-xs text-gray-400">Total Value</div>
              </div>
            </div>
            
            {/* Crypto Labels Around Donut - Positioned like pie chart */}
            {/* Connecting lines from chart to labels */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 320 320">
              {/* Bitcoin line - Right side (0° - 49.5% of circle) */}
              <line x1="210" y1="160" x2="270" y2="160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2,2" />
              
              {/* Ethereum line - Bottom right (180° from start) */}
              <line x1="160" y1="210" x2="160" y2="270" stroke="#374151" strokeWidth="2" strokeDasharray="2,2" />
              
              {/* Litecoin line - Left side (270° from start) */}
              <line x1="110" y1="160" x2="50" y2="160" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" />
              
              {/* IOTA line - Left upper (315° from start) */}
              <line x1="125" y1="125" x2="80" y2="80" stroke="#a855f7" strokeWidth="2" strokeDasharray="2,2" />
              
              {/* Monero line - Top left (340° from start) */}
              <line x1="145" y1="110" x2="120" y2="60" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" />
              
              {/* Binance line - Top (350° from start) */}
              <line x1="155" y1="105" x2="160" y2="50" stroke="#eab308" strokeWidth="2" strokeDasharray="2,2" />
              
              {/* Cardano line - Top right (10° from start) */}
              <line x1="175" y1="110" x2="200" y2="60" stroke="#6b7280" strokeWidth="2" strokeDasharray="2,2" />
              
              {/* Smaller coin lines */}
              <line x1="185" y1="115" x2="220" y2="85" stroke="#6b7280" strokeWidth="1" strokeDasharray="1,1" />
              <line x1="110" y1="135" x2="75" y2="100" stroke="#6b7280" strokeWidth="1" strokeDasharray="1,1" />
              <line x1="185" y1="205" x2="220" y2="235" stroke="#6b7280" strokeWidth="1" strokeDasharray="1,1" />
              <line x1="135" y1="205" x2="100" y2="235" stroke="#6b7280" strokeWidth="1" strokeDasharray="1,1" />
              <line x1="170" y1="105" x2="180" y2="65" stroke="#6b7280" strokeWidth="1" strokeDasharray="1,1" />
            </svg>
            
            {/* Bitcoin - Right side (largest segment 49.5%) */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-right">
              <div className="text-orange-400 text-sm font-bold leading-tight">Bitcoin</div>
              <div className="text-white text-xs">49.5%</div>
            </div>
            
            {/* Ethereum - Bottom (24.5% segment) */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-gray-300 text-sm font-bold leading-tight">Ethereum</div>
              <div className="text-white text-xs">24.5%</div>
            </div>
            
            {/* Litecoin - Left side (4.7% segment) */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <div className="text-green-400 text-sm font-bold leading-tight">Litecoin</div>
              <div className="text-white text-xs">4.7%</div>
            </div>
            
            {/* IOTA - Top left diagonal (4.3% segment) */}
            <div className="absolute left-6 top-6">
              <div className="text-purple-400 text-sm font-bold leading-tight">IOTA</div>
              <div className="text-white text-xs">4.3%</div>
            </div>
            
            {/* Monero - Top left (3.1% segment) */}
            <div className="absolute left-12 top-2">
              <div className="text-red-400 text-sm font-bold leading-tight">Monero</div>
              <div className="text-white text-xs">3.1%</div>
            </div>
            
            {/* Binance - Top center (2.1% segment) */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-yellow-400 text-sm font-bold leading-tight">Binance</div>
              <div className="text-white text-xs">2.1%</div>
            </div>
            
            {/* Cardano - Top right (1.9% segment) */}
            <div className="absolute right-12 top-2 text-right">
              <div className="text-gray-400 text-sm font-bold leading-tight">Cardano</div>
              <div className="text-white text-xs">1.9%</div>
            </div>
            
            {/* Smaller coins around the perimeter */}
            <div className="absolute right-6 top-6 text-right">
              <div className="text-gray-300 text-xs font-medium">Wabi: 1.9%</div>
            </div>
            
            <div className="absolute left-6 top-8">
              <div className="text-gray-300 text-xs font-medium">KuCoin: 1.7%</div>
            </div>
            
            <div className="absolute right-6 bottom-6 text-right">
              <div className="text-gray-300 text-xs font-medium">OmiseGO: 1.4%</div>
            </div>
            
            <div className="absolute left-8 bottom-6">
              <div className="text-gray-300 text-xs font-medium">EOS: 0.9%</div>
            </div>
            
            <div className="absolute top-1 right-1/4 text-center">
              <div className="text-gray-300 text-xs font-medium">PotCoin: 0.8%</div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">24h Change</div>
            <div className="text-green-500 text-lg font-bold">+2.4%</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">Total Profit</div>
            <div className="text-orange-500 text-lg font-bold">
              {showBalance ? '+' + getCurrencySymbol(selectedCurrency) + convertToSelectedCurrency(0.12) : '+***'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}