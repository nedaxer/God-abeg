import { memo } from 'react';

export interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface SimpleChartProps {
  data: ChartDataPoint[];
  symbol: string;
  height?: number;
  theme?: 'light' | 'dark';
}

export const SimpleChart = memo(({
  data,
  symbol,
  height = 400,
  theme = 'dark'
}: SimpleChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-2 px-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {symbol} Price Chart
          </h3>
        </div>
        <div
          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-lg mb-2">📈</div>
            <div>Loading chart data...</div>
          </div>
        </div>
      </div>
    );
  }

  const latestPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || latestPrice;
  const priceChange = latestPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  // Simple SVG line chart
  const maxPrice = Math.max(...data.map(d => d.high));
  const minPrice = Math.min(...data.map(d => d.low));
  const priceRange = maxPrice - minPrice;
  const width = 800;
  const chartHeight = height - 80;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = chartHeight - ((point.close - minPrice) / priceRange) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full">
      <div className="mb-2 px-2 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {symbol} Price Chart
        </h3>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-800 dark:text-white">
            ${latestPrice.toFixed(2)}
          </div>
          <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      <div
        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="bg-gray-50 dark:bg-gray-800"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: isPositive ? '#22c55e' : '#ef4444', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: isPositive ? '#22c55e' : '#ef4444', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio, i) => (
            <line
              key={i}
              x1="0"
              y1={chartHeight * ratio}
              x2={width}
              y2={chartHeight * ratio}
              stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* Price line */}
          <polyline
            fill="none"
            stroke={isPositive ? '#22c55e' : '#ef4444'}
            strokeWidth="2"
            points={points}
          />
          
          {/* Area under the line */}
          <polygon
            fill="url(#chartGradient)"
            points={`0,${chartHeight} ${points} ${width},${chartHeight}`}
          />
          
          {/* Price labels */}
          <text
            x="10"
            y="20"
            fill={theme === 'dark' ? '#d1d5db' : '#374151'}
            fontSize="12"
            fontFamily="system-ui"
          >
            ${maxPrice.toFixed(2)}
          </text>
          <text
            x="10"
            y={chartHeight - 5}
            fill={theme === 'dark' ? '#d1d5db' : '#374151'}
            fontSize="12"
            fontFamily="system-ui"
          >
            ${minPrice.toFixed(2)}
          </text>
        </svg>
      </div>
    </div>
  );
});

SimpleChart.displayName = 'SimpleChart';