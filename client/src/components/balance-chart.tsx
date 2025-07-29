import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

interface BalanceChartProps {
  usdBalance: number;
  btcPrice: number;
  showBalance: boolean;
}

interface BalanceHistory {
  timestamp: number;
  balance: number;
}

export function BalanceChart({ usdBalance, btcPrice, showBalance }: BalanceChartProps) {
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([]);
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Load balance history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('nedaxer_balance_history');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setBalanceHistory(history);
      } catch (e) {
        console.error('Error loading balance history:', e);
      }
    }
  }, []);

  // Update balance history when user balance changes
  useEffect(() => {
    if (usdBalance >= 0) {
      const now = Date.now();
      const newEntry: BalanceHistory = {
        timestamp: now,
        balance: usdBalance
      };

      setBalanceHistory(prev => {
        // Check if balance actually changed to avoid duplicate entries
        const lastEntry = prev[prev.length - 1];
        if (lastEntry && Math.abs(lastEntry.balance - usdBalance) < 0.01) {
          return prev;
        }

        // Keep last 50 entries for better horizontal scrolling experience
        const updated = [...prev, newEntry].slice(-50);
        localStorage.setItem('nedaxer_balance_history', JSON.stringify(updated));
        return updated;
      });
    }
  }, [usdBalance]);

  // Generate stable chart data with fixed historical points
  const generateChartData = () => {
    // Use existing history if available, otherwise generate stable fixed data
    if (balanceHistory.length > 0) {
      return balanceHistory;
    }

    // Generate stable historical data that won't change on re-renders
    const stableData: BalanceHistory[] = [];
    const currentTime = Date.now();
    const baseBalance = usdBalance || 100000; // Use current balance or default $100k

    // Create 40 stable data points with fixed seed for consistency
    const dataPoints = [
      0.98, 1.02, 0.96, 1.05, 0.99, 1.03, 0.97, 1.06, 1.01, 0.95,
      1.04, 0.98, 1.07, 1.00, 0.94, 1.08, 0.99, 1.02, 0.96, 1.05,
      0.97, 1.03, 1.01, 0.98, 1.04, 0.99, 1.06, 1.02, 0.95, 1.07,
      1.00, 0.98, 1.03, 0.99, 1.05, 1.01, 0.97, 1.04, 1.02, 1.00
    ];

    // Generate 40 historical points over the last 40 hours
    for (let i = 0; i < 40; i++) {
      const timestamp = currentTime - ((39 - i) * 60 * 60 * 1000); // 1 hour intervals
      const multiplier = dataPoints[i];
      const balance = baseBalance * multiplier;

      stableData.push({
        timestamp,
        balance: Math.max(0, balance)
      });
    }

    return stableData;
  };

  const chartData = generateChartData();

  // Format data for Chart.js with linear scale
  const data = {
    datasets: [
      {
        label: 'Balance',
        data: chartData.map((entry, index) => ({
          x: index,
          y: entry.balance
        })),
        borderColor: '#ff8c00',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(255, 140, 0, 0.3)');
          gradient.addColorStop(1, 'rgba(255, 140, 0, 0.05)');
          return gradient;
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#ff8c00',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
    transitions: {
      active: {
        animation: {
          duration: 400
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
      axis: 'x',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ff8c00',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            return `Time: ${context[0].label}`;
          },
          label: (context: any) => {
            return `Balance: $${context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          threshold: 5,
          speed: 20,
          sensitivity: 1,
        },
        zoom: {
          enabled: false,
        },
        limits: {
          x: {
            min: 0,
            max: chartData.length - 1,
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: Math.max(0, chartData.length - 12), // Show last 12 points initially
        max: chartData.length - 1,
        display: true,
        grid: {
          color: 'rgba(55, 65, 81, 0.4)',
          lineWidth: 0.5,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 8,
          },
          maxTicksLimit: 6,
          maxRotation: 0,
          minRotation: 0,
          callback: function(value: any) {
            const index = Math.floor(value);
            if (index >= 0 && index < chartData.length) {
              const time = new Date(chartData[index].timestamp);
              return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }
            return '';
          },
        },
        border: {
          color: 'rgba(55, 65, 81, 0.6)',
        },
      },
      y: {
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(55, 65, 81, 0.4)',
          lineWidth: 0.5,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 8,
          },
          callback: function(value: any) {
            return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
          },
        },
        border: {
          color: 'rgba(55, 65, 81, 0.6)',
        },
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
        borderCapStyle: 'round',
        tension: 0.4,
      },
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-blue-900/90 border-slate-700/50 p-3 mb-4 shadow-xl">
      <div className="relative">
        {/* Chart container */}
        <div className="h-[200px] rounded-xl bg-gradient-to-br from-slate-800/50 to-blue-800/30 border border-slate-600/30 p-3 touch-pan-x">
          {/* Scroll hint */}

          {showBalance ? (
            <Line
              ref={chartRef}
              data={data}
              options={chartOptions}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 text-lg mb-2">📊</div>
                <p className="text-gray-400 text-sm">Chart Hidden</p>
                <p className="text-gray-500 text-xs">Enable balance visibility to view chart</p>
              </div>
            </div>
          )}
        </div>

        {/* Chart info bar (TradingView style) - only show when balance is visible */}
        {showBalance && (
          <div className="mt-2 flex justify-between items-center text-xs text-slate-400">
            <span className="text-green-400">H: ${Math.max(...chartData.map(d => d.balance)).toFixed(2)}</span>
            <span className="text-red-400">L: ${Math.min(...chartData.map(d => d.balance)).toFixed(2)}</span>
            <span>Points: {chartData.length}</span>
          </div>
        )}
      </div>
    </Card>
  );
}