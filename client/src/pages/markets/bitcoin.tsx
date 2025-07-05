import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Check, TrendingUp, Clock, DollarSign, Shield } from "lucide-react";
import { CryptoChart, bitcoinData } from "@/components/crypto-chart";

export default function BitcoinMarkets() {
  const features = [
    {
      title: "Limited Risk Trading",
      description: "Know your maximum risk and potential profit before placing each trade",
      icon: <Shield className="h-10 w-10 text-[#ff5900]" />
    },
    {
      title: "24/7 Market Access",
      description: "Trade Bitcoin when traditional markets are closed",
      icon: <Clock className="h-10 w-10 text-[#ff5900]" />
    },
    {
      title: "High Volatility Opportunities",
      description: "Capitalize on Bitcoin's price movements in both directions",
      icon: <TrendingUp className="h-10 w-10 text-[#ff5900]" />
    },
    {
      title: "No Cryptocurrency Wallet Required",
      description: "Trade Bitcoin price movements without owning the underlying asset",
      icon: <DollarSign className="h-10 w-10 text-[#ff5900]" />
    }
  ];

  const tradingProducts = [
    {
      name: "Bitcoin Binary Options",
      description: "Predict if BTC will be above or below a specific price at expiration",
      features: [
        "Limited risk to initial premium",
        "Multiple timeframes from 5 minutes to daily",
        "Predefined profit potential",
        "Simple yes/no proposition"
      ]
    },
    {
      name: "Bitcoin Call Spreads",
      description: "Trade Bitcoin price movements within a range with built-in floor and ceiling levels",
      features: [
        "Capped risk and reward",
        "Medium-term directional trading",
        "Profit from bullish or bearish moves",
        "Multiple strike prices available"
      ]
    },
    {
      name: "Bitcoin Touch Brackets",
      description: "Trade with automatic profit targets and stop-loss levels built in",
      features: [
        "Set profit target and stop-loss automatically",
        "Hold positions longer with limited risk",
        "Perfect for trend and range-bound markets",
        "Multiple bracket widths available"
      ]
    }
  ];

  const marketEvents = [
    "Bitcoin halving events",
    "Major exchange listings",
    "Regulatory announcements",
    "Network upgrades and forks",
    "Institutional adoption news"
  ];

  return (
    <PageLayout 
      title="Bitcoin Markets" 
      subtitle="Trade Bitcoin with limited risk on the Nedaxer platform"
      bgImage="https://images.unsplash.com/photo-1591994843349-f415893b3a6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Bitcoin Trading on Nedaxer</h2>
          <p className="mb-4">
            Bitcoin (BTC) is the world's first and largest cryptocurrency by market capitalization. 
            On Nedaxer, you can trade Bitcoin price movements with our unique limited-risk products 
            without having to own or store the underlying cryptocurrency.
          </p>
          <p className="mb-6">
            Our Bitcoin trading products are designed to provide exposure to BTC price action 
            while maintaining strict risk parameters, helping you navigate the volatility of 
            cryptocurrency markets with confidence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Bitcoin Trading Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade Bitcoin price movements without owning the cryptocurrency</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Limited risk - never lose more than your initial investment</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade 24/7 in a regulated environment</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Multiple product types to fit your trading style</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>No cryptocurrency wallet or exchange account needed</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Bitcoin Market Opportunities</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Capitalize on Bitcoin's price volatility</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade around key market events</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Position for long-term trends or short-term moves</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Profit potential in both rising and falling markets</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Diversify your trading activity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Bitcoin Trading Products</h2>
          
          <div className="space-y-6">
            {tradingProducts.map((product, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{product.name}</h3>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
                <ul className="space-y-1 mb-4">
                  {product.features.map((feature, j) => (
                    <li key={j} className="flex items-start">
                      <Check className="text-[#ff5900] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="#" 
                  className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                >
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Key Bitcoin Market Events</h2>
          
          <div className="mb-6">
            <p className="mb-4">
              Bitcoin markets are often influenced by specific events that can create significant 
              trading opportunities. Staying informed about these events can help you better time 
              your entries and exits when trading Bitcoin on Nedaxer.
            </p>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-3 text-[#0033a0]">Events to Watch</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {marketEvents.map((event, i) => (
                  <li key={i} className="flex items-center">
                    <ArrowRight className="text-[#ff5900] mr-2 h-4 w-4 flex-shrink-0" />
                    <span>{event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden">
            <CryptoChart data={bitcoinData} coinSymbol="BTC" coinName="Bitcoin" />
            <div className="bg-white p-4 border border-gray-200 rounded-b-lg">
              <p className="text-sm text-gray-500 mb-4">
                Historical price data shown for informational purposes only. Past performance is not indicative of future results.
              </p>
              <div className="flex justify-end">
                <Button
                  asChild
                  variant="outline"
                  className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                >
                  <Link href="/markets/market-data">View Detailed Charts</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Why Trade Bitcoin on Nedaxer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{feature.title}</h3>
                <p className="text-gray-700 mb-4">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Start Trading Bitcoin Today</h2>
            <p className="mb-6">Open an account and access our Bitcoin trading products with limited risk.</p>
            <Button
              asChild
              className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold px-8 py-3"
            >
              <Link href="#">Open Account</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="ml-4 bg-transparent border border-white hover:bg-white hover:bg-opacity-20 text-white font-semibold px-8 py-3"
            >
              <Link href="#">Try Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}