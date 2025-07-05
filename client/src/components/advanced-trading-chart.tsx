import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Maximize2, 
  RefreshCw, 
  Settings,
  Eye,
  EyeOff,
  Activity,
  Zap
} from "lucide-react";
import { LightweightChart } from "./lightweight-chart";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ChartDataPoint {
  timestamp: number;
  date: string;
  price: number;
  volume: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  sma_20: number;
  sma_50: number;
  ema_12: number;
  ema_26: number;
  bollinger_bands: {
    upper: number;
    middle: number;
    lower: number;
  };
}

interface AdvancedTradingChartProps {
  coinId: string;
  coinSymbol: string;
  coinName: string;
  className?: string;
}

export function AdvancedTradingChart({ 
  coinId, 
  coinSymbol, 
  coinName, 
  className = "" 
}: AdvancedTradingChartProps) {
  const [timeframe, setTimeframe] = useState("30");
  const [chartType, setChartType] = useState("candlestick");
  const [showVolume, setShowVolume] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedIndicators, setSelectedIndicators] = useState({
    sma20: true,
    sma50: true,
    ema12: false,
    ema26: false,
    bollinger: true,
    rsi: true,
    macd: true
  });

  // Fetch current price data
  const { data: currentPrice, isLoading: priceLoading } = useQuery({
    queryKey: [`/api/markets/${coinId}`],
    refetchInterval: autoRefresh ? 30000 : false
  });

  // Fetch chart data
  const { data: chartData, isLoading: chartLoading, refetch: refetchChart } = useQuery({
    queryKey: [`/api/markets/${coinId}/chart`, timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/markets/${coinId}/chart?days=${timeframe}`);
      if (!response.ok) throw new Error('Failed to fetch chart data');
      return response.json();
    },
    refetchInterval: autoRefresh ? 60000 : false
  });

  // Fetch OHLC data for candlestick charts
  const { data: ohlcData, isLoading: ohlcLoading } = useQuery({
    queryKey: [`/api/markets/${coinId}/ohlc`, timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/markets/${coinId}/ohlc?days=${timeframe}`);
      if (!response.ok) throw new Error('Failed to fetch OHLC data');
      return response.json();
    },
    refetchInterval: autoRefresh ? 60000 : false,
    enabled: chartType === "candlestick"
  });

  // Fetch technical indicators
  const { data: indicators, isLoading: indicatorsLoading } = useQuery({
    queryKey: [`/api/markets/${coinId}/indicators`],
    queryFn: async () => {
      const response = await fetch(`/api/markets/${coinId}/indicators`);
      if (!response.ok) throw new Error('Failed to fetch indicators');
      return response.json();
    },
    refetchInterval: autoRefresh ? 120000 : false,
    enabled: showIndicators
  });

  // Process chart data with technical indicators
  const processedData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];

    return chartData.map((point: ChartDataPoint, index: number) => {
      const processed: any = {
        ...point,
        timestamp: point.timestamp,
        date: new Date(point.timestamp).toLocaleDateString(),
        time: new Date(point.timestamp).toLocaleTimeString(),
        price: point.price,
        volume: point.volume
      };

      // Add moving averages if we have enough data
      if (index >= 19 && selectedIndicators.sma20) {
        const last20 = chartData.slice(index - 19, index + 1);
        processed.sma20 = last20.reduce((sum: number, p: ChartDataPoint) => sum + p.price, 0) / 20;
      }

      if (index >= 49 && selectedIndicators.sma50) {
        const last50 = chartData.slice(index - 49, index + 1);
        processed.sma50 = last50.reduce((sum: number, p: ChartDataPoint) => sum + p.price, 0) / 50;
      }

      return processed;
    });
  }, [chartData, selectedIndicators]);

  // Calculate price change
  const priceChange = useMemo(() => {
    if (!currentPrice || !chartData || chartData.length < 2) return { change: 0, percentage: 0 };
    
    const current = (currentPrice as any).price || 0;
    const previous = chartData[chartData.length - 2]?.price || current;
    const change = current - previous;
    const percentage = (change / previous) * 100;
    
    return { change, percentage };
  }, [currentPrice, chartData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`${coinSymbol} - ${data.time}`}</p>
          <p className="text-[#0033a0]">{`Price: ${formatPrice(data.price)}`}</p>
          {data.volume && <p className="text-gray-600">{`Volume: ${formatVolume(data.volume)}`}</p>}
          {data.sma20 && <p className="text-blue-500">{`SMA 20: ${formatPrice(data.sma20)}`}</p>}
          {data.sma50 && <p className="text-red-500">{`SMA 50: ${formatPrice(data.sma50)}`}</p>}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (!processedData.length) return null;

    const chartData = processedData.map(item => ({
      time: item.date,
      open: item.price * 0.999, // Approximate open price
      high: item.price * 1.002, // Approximate high price
      low: item.price * 0.998,  // Approximate low price
      close: item.price,
      volume: item.volume
    }));

    return (
      <LightweightChart
        data={chartData}
        symbol={coinSymbol}
        height={400}
        chartType={chartType === "line" ? "line" : "candlestick"}
        showVolume={showVolume}
        theme="light"
        persistentId={`advanced-chart-${coinSymbol}`}
      />
    );
  };

  if (priceLoading || chartLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-[#0033a0] mx-auto mb-2" />
              <p className="text-gray-600">Loading real-time chart data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} bg-white border-gray-200`}>
      {/* Chart Header */}
      <CardHeader className="bg-[#f8f9fa] border-b pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-[#0033a0] flex items-center gap-2">
                {coinSymbol}/USD
                <Badge variant="outline" className="text-xs">
                  Live
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900">
                  {currentPrice ? formatPrice((currentPrice as any).price) : '---'}
                </span>
                {priceChange.change !== 0 && (
                  <div className={`flex items-center gap-1 ${priceChange.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChange.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-semibold">
                      {priceChange.change >= 0 ? '+' : ''}{formatPrice(priceChange.change)}
                    </span>
                    <span className="text-sm">
                      ({priceChange.percentage >= 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Timeframe Selector */}
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1D</SelectItem>
                <SelectItem value="7">7D</SelectItem>
                <SelectItem value="30">30D</SelectItem>
                <SelectItem value="90">90D</SelectItem>
                <SelectItem value="365">1Y</SelectItem>
              </SelectContent>
            </Select>

            {/* Chart Type */}
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="candlestick">Candlestick</SelectItem>
              </SelectContent>
            </Select>

            {/* Auto Refresh */}
            <div className="flex items-center gap-2">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              <span className="text-sm text-gray-600">Auto</span>
            </div>

            {/* Manual Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchChart()}
              className="h-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* Fullscreen */}
            <Button variant="outline" size="sm" className="h-8">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger value="chart" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0033a0]">
              Chart
            </TabsTrigger>
            <TabsTrigger value="indicators" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0033a0]">
              Technical Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="mt-0">
            <div className="p-4">
              {/* Main Chart */}
              {renderChart()}
            </div>
          </TabsContent>

          <TabsContent value="indicators" className="mt-0">
            <div className="p-4 space-y-4">
              {/* Technical Indicators Controls */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMA 20</span>
                  <Switch 
                    checked={selectedIndicators.sma20} 
                    onCheckedChange={(checked) => 
                      setSelectedIndicators(prev => ({ ...prev, sma20: checked }))
                    } 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMA 50</span>
                  <Switch 
                    checked={selectedIndicators.sma50} 
                    onCheckedChange={(checked) => 
                      setSelectedIndicators(prev => ({ ...prev, sma50: checked }))
                    } 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bollinger Bands</span>
                  <Switch 
                    checked={selectedIndicators.bollinger} 
                    onCheckedChange={(checked) => 
                      setSelectedIndicators(prev => ({ ...prev, bollinger: checked }))
                    } 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Volume</span>
                  <Switch checked={showVolume} onCheckedChange={setShowVolume} />
                </div>
              </div>

              {/* Technical Indicators Values */}
              {indicators && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      RSI (14)
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Value:</span>
                        <span className={`font-semibold ${
                          indicators.rsi > 70 ? 'text-red-600' : 
                          indicators.rsi < 30 ? 'text-green-600' : 'text-gray-800'
                        }`}>
                          {indicators.rsi.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            indicators.rsi > 70 ? 'bg-red-500' : 
                            indicators.rsi < 30 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${indicators.rsi}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {indicators.rsi > 70 ? 'Overbought' : 
                         indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      MACD
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">MACD:</span>
                        <span className="font-semibold">{indicators.macd.macd.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Signal:</span>
                        <span className="font-semibold">{indicators.macd.signal.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Histogram:</span>
                        <span className={`font-semibold ${indicators.macd.histogram >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {indicators.macd.histogram.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Moving Averages</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">SMA 20:</span>
                        <span className="font-semibold">{formatPrice(indicators.sma_20)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">SMA 50:</span>
                        <span className="font-semibold">{formatPrice(indicators.sma_50)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">EMA 12:</span>
                        <span className="font-semibold">{formatPrice(indicators.ema_12)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}