import { useState } from "react";
import { BarChart4, Clock, Zap, Download, ChevronDown, ChevronUp, Layers, Maximize, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { SimpleChart, ChartDataPoint as SimpleChartDataPoint } from "./simple-chart";

// Define the data shape
export type CryptoDataPoint = {
  date: string;
  price: number;
  volume: number;
  macd?: number;
  rsi?: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

// Define sample data for different cryptocurrencies
export const bitcoinData: CryptoDataPoint[] = [
  { date: "Jan 1", price: 29453, volume: 21.2, macd: 145, rsi: 48, open: 29340, high: 29620, low: 29140, close: 29453 },
  { date: "Jan 5", price: 30891, volume: 24.5, macd: 195, rsi: 52, open: 29453, high: 30950, low: 29440, close: 30891 },
  { date: "Jan 10", price: 36284, volume: 35.8, macd: 312, rsi: 65, open: 30891, high: 36500, low: 30880, close: 36284 },
  { date: "Jan 15", price: 42750, volume: 41.2, macd: 475, rsi: 72, open: 36284, high: 43100, low: 36200, close: 42750 },
  { date: "Jan 20", price: 41230, volume: 38.7, macd: 425, rsi: 68, open: 42750, high: 43200, low: 41000, close: 41230 },
  { date: "Jan 25", price: 43290, volume: 42.3, macd: 456, rsi: 71, open: 41230, high: 43500, low: 41100, close: 43290 },
  { date: "Jan 31", price: 42120, volume: 39.5, macd: 412, rsi: 62, open: 43290, high: 43400, low: 42000, close: 42120 },
  { date: "Feb 5", price: 44930, volume: 43.7, macd: 486, rsi: 69, open: 42120, high: 45200, low: 42100, close: 44930 },
  { date: "Feb 10", price: 48240, volume: 49.2, macd: 532, rsi: 75, open: 44930, high: 48500, low: 44900, close: 48240 },
  { date: "Feb 15", price: 51870, volume: 55.4, macd: 589, rsi: 82, open: 48240, high: 52000, low: 48200, close: 51870 },
  { date: "Feb 20", price: 49950, volume: 51.2, macd: 542, rsi: 76, open: 51870, high: 52100, low: 49800, close: 49950 },
  { date: "Feb 25", price: 51760, volume: 53.8, macd: 578, rsi: 78, open: 49950, high: 51900, low: 49900, close: 51760 },
  { date: "Mar 1", price: 57350, volume: 62.1, macd: 645, rsi: 86, open: 51760, high: 57500, low: 51700, close: 57350 },
  { date: "Mar 5", price: 61290, volume: 68.3, macd: 712, rsi: 89, open: 57350, high: 61400, low: 57300, close: 61290 },
  { date: "Mar 10", price: 68925, volume: 76.5, macd: 802, rsi: 91, open: 61290, high: 69000, low: 61200, close: 68925 },
  { date: "Mar 15", price: 66740, volume: 72.3, macd: 765, rsi: 84, open: 68925, high: 69100, low: 66500, close: 66740 },
  { date: "Mar 20", price: 69420, volume: 78.2, macd: 805, rsi: 88, open: 66740, high: 69500, low: 66700, close: 69420 },
  { date: "Mar 25", price: 68100, volume: 75.4, macd: 782, rsi: 82, open: 69420, high: 69600, low: 67900, close: 68100 },
  { date: "Mar 31", price: 71240, volume: 82.1, macd: 832, rsi: 87, open: 68100, high: 71300, low: 68000, close: 71240 }
];

export const ethereumData: CryptoDataPoint[] = [
  { date: "Jan 1", price: 2125, volume: 15.6, macd: 78, rsi: 52, open: 2115, high: 2140, low: 2080, close: 2125 },
  { date: "Jan 5", price: 2256, volume: 17.2, macd: 92, rsi: 58, open: 2125, high: 2270, low: 2120, close: 2256 },
  { date: "Jan 10", price: 2485, volume: 22.4, macd: 110, rsi: 64, open: 2256, high: 2500, low: 2250, close: 2485 },
  { date: "Jan 15", price: 2720, volume: 25.8, macd: 132, rsi: 71, open: 2485, high: 2750, low: 2480, close: 2720 },
  { date: "Jan 20", price: 2685, volume: 24.3, macd: 128, rsi: 68, open: 2720, high: 2740, low: 2650, close: 2685 },
  { date: "Jan 25", price: 2830, volume: 27.1, macd: 145, rsi: 73, open: 2685, high: 2850, low: 2680, close: 2830 },
  { date: "Jan 31", price: 2760, volume: 25.4, macd: 138, rsi: 69, open: 2830, high: 2840, low: 2730, close: 2760 },
  { date: "Feb 5", price: 2940, volume: 29.2, macd: 152, rsi: 75, open: 2760, high: 2960, low: 2755, close: 2940 },
  { date: "Feb 10", price: 3180, volume: 32.6, macd: 168, rsi: 79, open: 2940, high: 3200, low: 2935, close: 3180 },
  { date: "Feb 15", price: 3420, volume: 36.4, macd: 184, rsi: 83, open: 3180, high: 3450, low: 3170, close: 3420 },
  { date: "Feb 20", price: 3320, volume: 34.1, macd: 176, rsi: 78, open: 3420, high: 3430, low: 3300, close: 3320 },
  { date: "Feb 25", price: 3480, volume: 36.8, macd: 186, rsi: 81, open: 3320, high: 3500, low: 3315, close: 3480 },
  { date: "Mar 1", price: 3780, volume: 41.5, macd: 205, rsi: 86, open: 3480, high: 3800, low: 3475, close: 3780 },
  { date: "Mar 5", price: 4050, volume: 45.2, macd: 222, rsi: 89, open: 3780, high: 4075, low: 3775, close: 4050 },
  { date: "Mar 10", price: 4380, volume: 49.7, macd: 240, rsi: 91, open: 4050, high: 4400, low: 4045, close: 4380 },
  { date: "Mar 15", price: 4250, volume: 47.3, macd: 232, rsi: 87, open: 4380, high: 4390, low: 4200, close: 4250 },
  { date: "Mar 20", price: 4520, volume: 50.9, macd: 248, rsi: 89, open: 4250, high: 4550, low: 4245, close: 4520 },
  { date: "Mar 25", price: 4380, volume: 48.2, macd: 238, rsi: 85, open: 4520, high: 4530, low: 4350, close: 4380 },
  { date: "Mar 31", price: 4680, volume: 52.6, macd: 256, rsi: 88, open: 4380, high: 4700, low: 4375, close: 4680 }
];

// Sample data for Solana (SOL)
export const solanaData: CryptoDataPoint[] = [
  { date: "Jan 1", price: 86, volume: 9.8, macd: 12, rsi: 54, open: 85, high: 88, low: 84, close: 86 },
  { date: "Jan 5", price: 94, volume: 11.2, macd: 15, rsi: 59, open: 86, high: 95, low: 85.5, close: 94 },
  { date: "Jan 10", price: 112, volume: 14.5, macd: 18, rsi: 67, open: 94, high: 115, low: 93.5, close: 112 },
  { date: "Jan 15", price: 128, volume: 17.3, macd: 22, rsi: 74, open: 112, high: 130, low: 111, close: 128 },
  { date: "Jan 20", price: 122, volume: 16.1, macd: 20, rsi: 69, open: 128, high: 129, low: 120, close: 122 },
  { date: "Jan 25", price: 134, volume: 18.6, macd: 24, rsi: 75, open: 122, high: 136, low: 121, close: 134 },
  { date: "Jan 31", price: 129, volume: 17.4, macd: 21, rsi: 70, open: 134, high: 135, low: 127, close: 129 },
  { date: "Feb 5", price: 142, volume: 19.8, macd: 26, rsi: 77, open: 129, high: 144, low: 128, close: 142 },
  { date: "Feb 10", price: 158, volume: 22.7, macd: 30, rsi: 82, open: 142, high: 160, low: 141, close: 158 },
  { date: "Feb 15", price: 172, volume: 25.4, macd: 35, rsi: 86, open: 158, high: 175, low: 157, close: 172 },
  { date: "Feb 20", price: 164, volume: 23.8, macd: 32, rsi: 80, open: 172, high: 173, low: 162, close: 164 },
  { date: "Feb 25", price: 176, volume: 26.3, macd: 36, rsi: 83, open: 164, high: 178, low: 163, close: 176 },
  { date: "Mar 1", price: 192, volume: 29.5, macd: 40, rsi: 87, open: 176, high: 194, low: 175, close: 192 },
  { date: "Mar 5", price: 206, volume: 32.1, macd: 43, rsi: 89, open: 192, high: 208, low: 191, close: 206 },
  { date: "Mar 10", price: 224, volume: 35.8, macd: 48, rsi: 91, open: 206, high: 226, low: 205, close: 224 },
  { date: "Mar 15", price: 218, volume: 34.2, macd: 46, rsi: 88, open: 224, high: 225, low: 216, close: 218 },
  { date: "Mar 20", price: 232, volume: 37.1, macd: 50, rsi: 90, open: 218, high: 234, low: 217, close: 232 },
  { date: "Mar 25", price: 225, volume: 35.3, macd: 48, rsi: 86, open: 232, high: 233, low: 223, close: 225 },
  { date: "Mar 31", price: 242, volume: 38.9, macd: 52, rsi: 89, open: 225, high: 244, low: 224, close: 242 }
];

interface CryptoChartProps {
  data: CryptoDataPoint[];
  coinSymbol: string;
  coinName: string;
  className?: string;
}

export function CryptoChart({ data, coinSymbol, coinName, className = "" }: CryptoChartProps) {
  // Chart state
  const [chartType, setChartType] = useState("candlestick");
  const [showVolume, setShowVolume] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);
  const [timeframe, setTimeframe] = useState("Daily");

  // Get latest price and calculate percentage change
  const latestPrice = data[data.length - 1].price;
  const previousPrice = data[data.length - 2].price;
  const priceChange = ((latestPrice - previousPrice) / previousPrice) * 100;
  const isPriceUp = priceChange >= 0;

  return (
    <div className={`border border-gray-200 rounded-lg bg-white shadow-md overflow-hidden ${className}`}>
      {/* Chart Header */}
      <div className="bg-[#f5f5f5] p-4 border-b border-gray-200 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-1 text-lg font-bold text-[#0033a0]">
          <span>{coinSymbol}</span>
          <span className="text-[#ff5900] ml-2">${latestPrice.toLocaleString()}</span>
          <span className={`${isPriceUp ? 'text-green-600' : 'text-red-600'} ml-3 text-sm`}>
            {isPriceUp ? '+' : ''}{priceChange.toFixed(1)}%
          </span>
        </div>
        
        <div className="flex space-x-4 items-center">
          {/* Timeframe selector */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-600 text-sm mr-1">Timeframe:</span>
            <div className="relative">
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="text-sm bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#0033a0]"
              >
                <option>1m</option>
                <option>5m</option>
                <option>15m</option>
                <option>1h</option>
                <option>4h</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>
          
          {/* Chart Type */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-600 text-sm mr-1">Chart:</span>
            <div className="relative">
              <select 
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="text-sm bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#0033a0]"
              >
                <option value="candlestick">Candlestick</option>
                <option value="line">Line</option>
                <option value="bar">Bar</option>
                <option value="area">Area</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Chart Controls */}
        <div className="flex items-center space-x-3 mt-2 md:mt-0">
          <button className="text-gray-600 hover:text-[#0033a0] transition-colors p-1">
            <ZoomIn size={18} />
          </button>
          <button className="text-gray-600 hover:text-[#0033a0] transition-colors p-1">
            <ZoomOut size={18} />
          </button>
          <button className="text-gray-600 hover:text-[#0033a0] transition-colors p-1">
            <Maximize size={18} />
          </button>
          <button 
            className={`transition-colors p-1 ${showIndicators ? 'text-[#0033a0]' : 'text-gray-600'}`}
            onClick={() => setShowIndicators(!showIndicators)}
          >
            <Layers size={18} />
          </button>
          <button 
            className={`transition-colors p-1 ${showVolume ? 'text-[#0033a0]' : 'text-gray-600'}`}
            onClick={() => setShowVolume(!showVolume)}
          >
            <BarChart4 size={18} />
          </button>
          <button className="text-gray-600 hover:text-[#0033a0] transition-colors p-1">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="p-2 bg-white">
        <SimpleChart
          data={data.map(item => ({
            time: item.date,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume
          }))}
          symbol={coinSymbol}
          height={400}
          theme="light"
        />
      </div>
      
      {/* Chart Footer */}
      <div className="bg-[#f5f5f5] px-4 py-2 border-t border-gray-200 flex flex-wrap justify-between items-center text-xs text-gray-600">
        <div>Market: {coinName}/USD</div>
        <div>Last update: April 15, 2025, 1:30:45 PM EST</div>
        <div>Source: Nedaxer Exchange Data</div>
        <div className="flex items-center space-x-2">
          <span>Data delayed by 15min</span>
          <span className="block w-2 h-2 rounded-full bg-green-500"></span>
        </div>
      </div>
    </div>
  );
}