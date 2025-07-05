import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, LineChart, BarChart, PieChart, ArrowRight } from "lucide-react";
import { CryptoChart, bitcoinData } from "@/components/crypto-chart";

export default function WebPlatform() {
  const platformFeatures = [
    {
      title: "Advanced Charting",
      description: "Professional-grade charting with multiple timeframes, chart types, and technical indicators.",
      icon: <LineChart className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Order Management",
      description: "Intuitive order entry with price analysis, risk assessment, and easy position management.",
      icon: <BarChart className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Custom Workspaces",
      description: "Personalize your trading environment with customizable layouts and saved configurations.",
      icon: <PieChart className="h-10 w-10 text-[#0033a0]" />,
    },
  ];

  const tradingTools = [
    {
      name: "Technical Analysis",
      features: [
        "20+ technical indicators",
        "Drawing tools and trend lines",
        "Multiple chart types",
        "Customizable timeframes",
      ],
    },
    {
      name: "Trading Tools",
      features: [
        "One-click trading",
        "Risk/reward calculator",
        "Market depth view",
        "Price alerts and notifications",
      ],
    },
    {
      name: "Risk Management",
      features: [
        "Pre-defined risk limits",
        "Position size calculator",
        "Account summary dashboard",
        "Profit/loss visualization",
      ],
    },
    {
      name: "Market Data",
      features: [
        "Real-time price quotes",
        "Economic calendar",
        "Market news feed",
        "Historical data access",
      ],
    },
  ];

  return (
    <PageLayout 
      title="Web Trading Platform" 
      subtitle="Advanced trading tools and features in a powerful browser-based platform"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Platform Overview</h2>
          
          <div className="mb-8">
            <p className="mb-4">
              The Web Trading Platform gives you everything you need to trade our unique limited-risk products. 
              Built with advanced technology, it provides professional-grade charting, intuitive order management, 
              and comprehensive market data—all accessible from your browser with no downloads required.
            </p>
            <p className="mb-4">
              Our web platform is designed for both beginners and experienced traders, with an intuitive interface 
              that makes it easy to analyze markets, place trades, and manage your positions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {platformFeatures.map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-[#f5f5f5] rounded-lg">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Platform Trading Chart */}
        <div className="mb-12">
          <CryptoChart 
            data={bitcoinData} 
            coinSymbol="BTC" 
            coinName="Bitcoin" 
          />
          <p className="text-sm text-gray-500 mt-2 text-center">Web Trading Platform with advanced charting and order management</p>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Platform Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tradingTools.map((tool, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-[#0033a0]">{tool.name}</h3>
                <ul className="space-y-3">
                  {tool.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Getting Started</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center">
              <div className="text-3xl font-bold text-[#0033a0] mb-4">1</div>
              <h3 className="text-lg font-bold mb-2">Create Account</h3>
              <p className="text-gray-700 mb-4">Sign up for a free account to access all platform features.</p>
              <Link 
                href="#" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center justify-center"
              >
                Open Account <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center">
              <div className="text-3xl font-bold text-[#0033a0] mb-4">2</div>
              <h3 className="text-lg font-bold mb-2">Fund Your Account</h3>
              <p className="text-gray-700 mb-4">Deposit funds using various payment methods to start trading.</p>
              <Link 
                href="/platform/funding" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center justify-center"
              >
                View Funding Options <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center">
              <div className="text-3xl font-bold text-[#0033a0] mb-4">3</div>
              <h3 className="text-lg font-bold mb-2">Start Trading</h3>
              <p className="text-gray-700 mb-4">Log in to the platform and begin trading with limited risk products.</p>
              <Link 
                href="/learn/getting-started" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center justify-center"
              >
                Learn How to Trade <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">System Requirements</h2>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Supported Browsers</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>Google Chrome (recommended) - Latest version</span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>Mozilla Firefox - Latest version</span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>Microsoft Edge - Latest version</span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>Safari - Latest version</span>
              </li>
            </ul>
            
            <h3 className="text-lg font-bold mt-6 mb-4">Recommended Hardware</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>High-speed internet connection (minimum 5 Mbps)</span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>Minimum screen resolution of 1280 x 768</span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>Modern processor and at least 4GB RAM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Try our Web Platform Today</h2>
          <p className="mb-6">Experience the power of our advanced trading platform with a free demo account.</p>
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
            <Link href="/learn/getting-started">View Platform Tutorial</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}