import { useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { CryptoChart, bitcoinData, ethereumData, solanaData } from "@/components/crypto-chart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Download, Clock, Coins, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function MarketData() {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");

  const cryptoData = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", data: bitcoinData, marketCap: "1.34T", volume24h: "25.6B", allTimeHigh: "$73,750" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", data: ethereumData, marketCap: "354.2B", volume24h: "12.8B", allTimeHigh: "$4,891" },
    { id: "solana", name: "Solana", symbol: "SOL", data: solanaData, marketCap: "52.8B", volume24h: "3.2B", allTimeHigh: "$260" }
  ];

  // Calculate some statistics
  const getCryptoStats = (id) => {
    const crypto = cryptoData.find(c => c.id === id);
    if (!crypto) return {};
    
    const data = crypto.data;
    const latestPrice = data[data.length - 1].price;
    const previousPrice = data[data.length - 2].price;
    const weekAgoPrice = data[data.length - 8].price || data[0].price;
    const monthAgoPrice = data[0].price;

    const dailyChange = ((latestPrice - previousPrice) / previousPrice) * 100;
    const weeklyChange = ((latestPrice - weekAgoPrice) / weekAgoPrice) * 100;
    const monthlyChange = ((latestPrice - monthAgoPrice) / monthAgoPrice) * 100;

    return {
      dailyChange,
      weeklyChange,
      monthlyChange,
      marketCap: crypto.marketCap,
      volume24h: crypto.volume24h,
      allTimeHigh: crypto.allTimeHigh
    };
  };

  const selectedStats = getCryptoStats(selectedCrypto);
  const selectedCryptoInfo = cryptoData.find(c => c.id === selectedCrypto);

  return (
    <PageLayout
      title="Cryptocurrency Market Data"
      subtitle="Real-time charts, prices, and analysis for major cryptocurrencies"
      bgImage="https://images.unsplash.com/photo-1642104704074-907c0698cbd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <Tabs defaultValue={selectedCrypto} onValueChange={setSelectedCrypto}>
                <div className="p-4 bg-[#f5f5f5]">
                  <TabsList className="grid grid-cols-3 gap-4">
                    <TabsTrigger value="bitcoin">Bitcoin (BTC)</TabsTrigger>
                    <TabsTrigger value="ethereum">Ethereum (ETH)</TabsTrigger>
                    <TabsTrigger value="solana">Solana (SOL)</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="bitcoin">
                  <CryptoChart 
                    data={bitcoinData} 
                    coinName="Bitcoin" 
                    coinSymbol="BTC" 
                  />
                </TabsContent>

                <TabsContent value="ethereum">
                  <CryptoChart 
                    data={ethereumData} 
                    coinName="Ethereum" 
                    coinSymbol="ETH" 
                  />
                </TabsContent>

                <TabsContent value="solana">
                  <CryptoChart 
                    data={solanaData} 
                    coinName="Solana" 
                    coinSymbol="SOL" 
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Market Statistics */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">
                {selectedCryptoInfo?.name} ({selectedCryptoInfo?.symbol}) Market Statistics
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#f5f5f5] p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="mr-2 h-5 w-5 text-[#0033a0]" />
                    <h4 className="font-semibold text-gray-700">Market Cap</h4>
                  </div>
                  <p className="text-lg font-bold">${selectedStats.marketCap}</p>
                </div>
                
                <div className="bg-[#f5f5f5] p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Coins className="mr-2 h-5 w-5 text-[#0033a0]" />
                    <h4 className="font-semibold text-gray-700">24h Volume</h4>
                  </div>
                  <p className="text-lg font-bold">${selectedStats.volume24h}</p>
                </div>
                
                <div className="bg-[#f5f5f5] p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="mr-2 h-5 w-5 text-[#0033a0]" />
                    <h4 className="font-semibold text-gray-700">All-Time High</h4>
                  </div>
                  <p className="text-lg font-bold">{selectedStats.allTimeHigh}</p>
                </div>
                
                <div className="bg-[#f5f5f5] p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="mr-2 h-5 w-5 text-[#0033a0]" />
                    <h4 className="font-semibold text-gray-700">Price Change</h4>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">24h:</span>
                      <span className={`text-sm font-bold ${selectedStats.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedStats.dailyChange >= 0 ? '+' : ''}{selectedStats.dailyChange.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">7d:</span>
                      <span className={`text-sm font-bold ${selectedStats.weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedStats.weeklyChange >= 0 ? '+' : ''}{selectedStats.weeklyChange.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">30d:</span>
                      <span className={`text-sm font-bold ${selectedStats.monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedStats.monthlyChange >= 0 ? '+' : ''}{selectedStats.monthlyChange.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  asChild
                  variant="outline"
                  className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                >
                  <Link href="/markets/commodities">
                    <ArrowRight className="mr-2 h-4 w-4" /> View Trading Options
                  </Link>
                </Button>
                
                <Button
                  variant="ghost"
                  className="text-[#0033a0]"
                  onClick={() => {
                    // This would download the historical data in a real app
                    alert('Downloading historical data...');
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Historical Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Market Analysis Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Cryptocurrency Market Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Market Trends</h3>
              <p className="mb-4 text-gray-700">
                The cryptocurrency market has shown significant maturity in recent months, with decreased volatility and increased institutional adoption. 
                Bitcoin continues to lead as the dominant cryptocurrency, while Ethereum gains traction with its smart contract capabilities and ongoing 
                developments in the Ethereum ecosystem.
              </p>
              <p className="mb-4 text-gray-700">
                Emerging trends include the rise of decentralized finance (DeFi) applications, increased regulatory clarity in major markets, 
                and growing interest from traditional financial institutions in digital asset offerings.
              </p>
              <Button 
                asChild
                variant="outline"
                className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
              >
                <Link href="/learn/trading-strategies">
                  Trading Strategies <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Technical Analysis</h3>
              <p className="mb-4 text-gray-700">
                Bitcoin has recently broken through key resistance levels, suggesting a potential continuation of the bullish trend. 
                Support levels to watch include the 50-day moving average and previous consolidation points.
              </p>
              <p className="mb-4 text-gray-700">
                Ethereum shows a strong correlation with Bitcoin but with higher volatility, presenting interesting trading opportunities 
                for those looking to capitalize on market movements. The recent upgrade has provided fundamental support for price action.
              </p>
              <p className="mb-4 text-gray-700">
                Altcoins typically follow the lead of Bitcoin and Ethereum but can present unique entry and exit points based on project-specific developments.
              </p>
              <Button 
                asChild
                variant="outline"
                className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
              >
                <Link href="/learn/trading-guides">
                  Technical Guides <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Trade Cryptocurrencies?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            With Web Trading Platform, you can trade Bitcoin, Ethereum, and other cryptocurrencies with limited risk products. 
            Our advanced platform provides real-time market data, technical analysis tools, and risk management features.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold px-8 py-3"
            >
              <Link href="#">Open Account</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-transparent border border-white hover:bg-white hover:bg-opacity-20 text-white font-semibold px-8 py-3"
            >
              <Link href="/platform/web-platform">Explore Platform</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}