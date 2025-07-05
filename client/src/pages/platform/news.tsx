import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingUp, TrendingDown, Activity, Globe, Clock, ExternalLink, AlertTriangle, Zap } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'regulation' | 'market' | 'technology' | 'adoption' | 'security';
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
  source: string;
  url: string;
  currencies: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'halving' | 'upgrade' | 'listing' | 'conference' | 'regulation';
  importance: 'critical' | 'high' | 'medium' | 'low';
  currencies: string[];
}

interface OnChainMetric {
  metric: string;
  currency: string;
  value: string;
  change24h: number;
  unit: string;
  description: string;
}

export default function NewsAndEvents() {
  const [selectedTab, setSelectedTab] = useState('news');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock news data (in real app, would fetch from CoinDesk, CoinTelegraph APIs)
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Bitcoin ETF Sees Record $1.2B Inflows as Institutional Adoption Accelerates',
      summary: 'BlackRock and Fidelity Bitcoin ETFs recorded their highest single-day inflows since launch, signaling strong institutional demand amid price volatility.',
      category: 'adoption',
      impact: 'high',
      timestamp: '2024-01-15T14:30:00Z',
      source: 'CoinDesk',
      url: '#',
      currencies: ['BTC']
    },
    {
      id: '2',
      title: 'Ethereum Dencun Upgrade Successfully Deployed on Mainnet',
      summary: 'The highly anticipated Ethereum upgrade introduces proto-danksharding, reducing Layer 2 transaction costs by up to 90%.',
      category: 'technology',
      impact: 'high',
      timestamp: '2024-01-15T12:15:00Z',
      source: 'Ethereum Foundation',
      url: '#',
      currencies: ['ETH']
    },
    {
      id: '3',
      title: 'EU Finalizes MiCA Regulation Framework for Crypto Assets',
      summary: 'European Union completes comprehensive regulatory framework for cryptocurrency operations, providing clarity for exchanges and DeFi protocols.',
      category: 'regulation',
      impact: 'medium',
      timestamp: '2024-01-15T10:45:00Z',
      source: 'Reuters',
      url: '#',
      currencies: ['BTC', 'ETH', 'USDT']
    },
    {
      id: '4',
      title: 'Solana Network Processes 50M Transactions in 24 Hours, New Record',
      summary: 'Solana blockchain achieves new daily transaction record as DeFi activity surges, demonstrating network scalability improvements.',
      category: 'technology',
      impact: 'medium',
      timestamp: '2024-01-15T09:20:00Z',
      source: 'Solana Labs',
      url: '#',
      currencies: ['SOL']
    },
    {
      id: '5',
      title: 'Major Security Vulnerability Discovered in Cross-Chain Bridge Protocol',
      summary: 'Researchers identify critical vulnerability affecting multiple bridge protocols, with $100M+ funds temporarily frozen as precautionary measure.',
      category: 'security',
      impact: 'high',
      timestamp: '2024-01-15T08:00:00Z',
      source: 'Security Research',
      url: '#',
      currencies: ['ETH', 'BNB', 'MATIC']
    }
  ];

  // Mock calendar events
  const calendarEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Bitcoin Halving Event',
      description: 'Bitcoin block reward reduction from 6.25 to 3.125 BTC, historically significant for price movements.',
      date: '2024-04-20',
      type: 'halving',
      importance: 'critical',
      currencies: ['BTC']
    },
    {
      id: '2',
      title: 'Ethereum Pectra Upgrade',
      description: 'Next major Ethereum upgrade introducing account abstraction and validator improvements.',
      date: '2024-03-15',
      type: 'upgrade',
      importance: 'high',
      currencies: ['ETH']
    },
    {
      id: '3',
      title: 'Bitcoin 2024 Conference',
      description: 'Annual Bitcoin conference in Miami featuring industry leaders and major announcements.',
      date: '2024-02-28',
      type: 'conference',
      importance: 'medium',
      currencies: ['BTC']
    },
    {
      id: '4',
      title: 'Coinbase Institutional Trading Launch',
      description: 'Coinbase launches advanced institutional trading platform with enhanced custody solutions.',
      date: '2024-02-15',
      type: 'listing',
      importance: 'high',
      currencies: ['BTC', 'ETH', 'SOL']
    },
    {
      id: '5',
      title: 'EU MiCA Implementation Deadline',
      description: 'Final deadline for crypto exchanges to comply with EU Market in Crypto Assets regulation.',
      date: '2024-12-30',
      type: 'regulation',
      importance: 'high',
      currencies: ['BTC', 'ETH', 'USDT', 'USDC']
    }
  ];

  // Mock on-chain metrics
  const onChainMetrics: OnChainMetric[] = [
    {
      metric: 'Hash Rate',
      currency: 'BTC',
      value: '485.2',
      change24h: 2.1,
      unit: 'EH/s',
      description: 'Total computational power securing the Bitcoin network'
    },
    {
      metric: 'Active Addresses',
      currency: 'BTC',
      value: '945,234',
      change24h: -1.8,
      unit: 'addresses',
      description: 'Number of unique addresses active in last 24 hours'
    },
    {
      metric: 'Gas Price',
      currency: 'ETH',
      value: '28.5',
      change24h: -15.2,
      unit: 'gwei',
      description: 'Average gas price for Ethereum transactions'
    },
    {
      metric: 'TVL',
      currency: 'ETH',
      value: '$68.2B',
      change24h: 3.4,
      unit: 'USD',
      description: 'Total Value Locked in Ethereum DeFi protocols'
    },
    {
      metric: 'Transaction Count',
      currency: 'SOL',
      value: '42.1M',
      change24h: 8.7,
      unit: 'txns/24h',
      description: 'Daily transaction volume on Solana network'
    },
    {
      metric: 'Staking Ratio',
      currency: 'ETH',
      value: '28.3%',
      change24h: 0.1,
      unit: 'of supply',
      description: 'Percentage of ETH supply currently staked'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'regulation': return <AlertTriangle className="h-4 w-4" />;
      case 'technology': return <Zap className="h-4 w-4" />;
      case 'adoption': return <TrendingUp className="h-4 w-4" />;
      case 'security': return <AlertTriangle className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Globe className="h-8 w-8 text-[#0033a0]" />
              <span>News & Events</span>
            </h1>
            <p className="text-gray-600">Stay updated with crypto market news, events, and on-chain data</p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="news" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Market News</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Events Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="onchain" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>On-Chain Data</span>
            </TabsTrigger>
          </TabsList>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            {/* Category Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All News
                  </Button>
                  {['regulation', 'technology', 'adoption', 'market', 'security'].map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {getCategoryIcon(category)}
                      <span className="ml-2">{category}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* News Feed */}
            <div className="space-y-4">
              {filteredNews.map((news) => (
                <Card key={news.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(news.category)}
                        <Badge variant="outline" className="capitalize">
                          {news.category}
                        </Badge>
                        <Badge className={getImpactColor(news.impact)}>
                          {news.impact} impact
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(news.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
                    <p className="text-gray-600 mb-4">{news.summary}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Source: {news.source}</span>
                        <div className="flex space-x-1">
                          {news.currencies.map(currency => (
                            <Badge key={currency} variant="secondary" className="text-xs">
                              {currency}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {calendarEvents.map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{event.title}</h4>
                          <Badge className={getImportanceColor(event.importance)}>
                            {event.importance}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex space-x-1">
                            {event.currencies.map(currency => (
                              <Badge key={currency} variant="outline" className="text-xs">
                                {currency}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Event Types Legend */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'halving', description: 'Blockchain reward halvings', color: 'bg-red-100 text-red-800' },
                      { type: 'upgrade', description: 'Protocol upgrades and forks', color: 'bg-blue-100 text-blue-800' },
                      { type: 'listing', description: 'Exchange listings and delistings', color: 'bg-green-100 text-green-800' },
                      { type: 'conference', description: 'Industry conferences and announcements', color: 'bg-purple-100 text-purple-800' },
                      { type: 'regulation', description: 'Regulatory decisions and deadlines', color: 'bg-orange-100 text-orange-800' }
                    ].map((category) => (
                      <div key={category.type} className="flex items-center space-x-3">
                        <Badge className={category.color + ' capitalize'}>
                          {category.type}
                        </Badge>
                        <span className="text-sm text-gray-600">{category.description}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* On-Chain Data Tab */}
          <TabsContent value="onchain" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onChainMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">{metric.metric}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {metric.currency}
                        </Badge>
                      </div>
                      <div className={`flex items-center text-sm ${
                        metric.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change24h >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {metric.change24h >= 0 ? '+' : ''}{metric.change24h.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      <span className="text-sm text-gray-500 ml-2">{metric.unit}</span>
                    </div>
                    
                    <p className="text-xs text-gray-600">{metric.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Network Status */}
            <Card>
              <CardHeader>
                <CardTitle>Network Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-gray-600">Bitcoin Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2.1s</div>
                    <div className="text-sm text-gray-600">Ethereum Block Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">400ms</div>
                    <div className="text-sm text-gray-600">Solana Block Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}