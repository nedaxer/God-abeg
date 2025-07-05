import { useEffect, useRef, memo } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface LightweightChartProps {
  data: ChartDataPoint[];
  symbol: string;
  height?: number;
  chartType?: 'candlestick' | 'line';
  showVolume?: boolean;
  theme?: 'light' | 'dark';
  persistentId?: string;
}

export const LightweightChart = memo(({
  data,
  symbol,
  height = 400,
  chartType = 'candlestick',
  showVolume = true,
  theme = 'dark',
  persistentId
}: LightweightChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    try {
      // Chart configuration
      const chartOptions = {
        layout: {
          background: { type: ColorType.Solid, color: theme === 'dark' ? '#1a1a1a' : '#ffffff' },
          textColor: theme === 'dark' ? '#d1d4dc' : '#191919',
        },
        grid: {
          vertLines: { color: theme === 'dark' ? '#2a2a2a' : '#e1e1e1' },
          horzLines: { color: theme === 'dark' ? '#2a2a2a' : '#e1e1e1' },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: theme === 'dark' ? '#485c7b' : '#cccccc',
        },
        timeScale: {
          borderColor: theme === 'dark' ? '#485c7b' : '#cccccc',
          timeVisible: true,
          secondsVisible: false,
        },
        width: chartContainerRef.current.clientWidth,
        height,
      };

      // Create chart
      const chart = createChart(chartContainerRef.current, chartOptions);
      chartRef.current = chart;

      // Prepare data
      const chartData = data.map(item => ({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      const lineData = data.map(item => ({
        time: item.time,
        value: item.close,
      }));

      // Add price series
      let series: any;
      try {
        if (chartType === 'candlestick') {
          series = (chart as any).addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
          });
          series.setData(chartData);
        } else {
          series = (chart as any).addLineSeries({
            color: '#0033a0',
            lineWidth: 2,
          });
          series.setData(lineData);
        }
      } catch (error) {
        console.error('Error adding chart series:', error);
      }
      seriesRef.current = series;

      // Add volume series if enabled and data available
      if (showVolume && data.some(item => item.volume)) {
        const volumeData = data.map(item => ({
          time: item.time,
          value: item.volume || 0,
          color: item.close >= item.open ? '#26a69a' : '#ef5350',
        }));

        const volumeSeries = (chart as any).addHistogramSeries({
          color: '#26a69a',
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: '',
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        });
        volumeSeries.setData(volumeData);
        volumeSeriesRef.current = volumeSeries;
      }

      // Fit content
      chart.timeScale().fitContent();

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
        chartRef.current = null;
        seriesRef.current = null;
        volumeSeriesRef.current = null;
      };
    } catch (error) {
      console.error('Chart initialization error:', error);
      
      // Display error message in the chart container
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: ${height}px;
            background: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
            color: ${theme === 'dark' ? '#d1d4dc' : '#191919'};
            border: 1px solid ${theme === 'dark' ? '#2a2a2a' : '#e1e1e1'};
            border-radius: 8px;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="text-align: center;">
              <div style="font-size: 16px; margin-bottom: 8px;">Chart Loading Error</div>
              <div style="font-size: 14px; opacity: 0.7;">Unable to load ${symbol} chart</div>
            </div>
          </div>
        `;
      }
    }
  }, [data, height, chartType, showVolume, theme, symbol]);

  return (
    <div className="w-full">
      <div className="mb-2 px-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {symbol} Price Chart
        </h3>
      </div>
      <div
        ref={chartContainerRef}
        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg"
        style={{ height: `${height}px` }}
      />
    </div>
  );
});

LightweightChart.displayName = 'LightweightChart';