import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight } from "lucide-react";

export default function Commodities() {
  const cryptocurrencies = [
    {
      name: "Bitcoin (BTC)",
      description: "The original cryptocurrency and largest by market cap",
      features: [
        "First decentralized cryptocurrency",
        "Limited supply of 21 million coins",
        "Trades 24/7 globally",
        "High liquidity and institutional adoption",
      ],
    },
    {
      name: "Ethereum (ETH)",
      description: "Blockchain platform for decentralized applications",
      features: [
        "Smart contract functionality",
        "Supports thousands of decentralized apps",
        "Transition to proof-of-stake consensus",
        "Foundation for DeFi and NFT markets",
      ],
    },
    {
      name: "Solana (SOL)",
      description: "High-performance blockchain with fast transactions",
      features: [
        "High throughput (65,000+ TPS)",
        "Low transaction costs",
        "Growing DeFi and NFT ecosystem",
        "Used for decentralized applications and exchanges",
      ],
    },
    {
      name: "Cardano (ADA)",
      description: "Proof-of-stake blockchain with research-driven approach",
      features: [
        "Academic peer-reviewed development",
        "Environmentally sustainable design",
        "Scalable smart contract platform",
        "Focus on security and interoperability",
      ],
    },
  ];

  return (
    <PageLayout 
      title="Cryptocurrency Markets" 
      subtitle="Trade Bitcoin, Ethereum, and other digital assets with limited risk products"
      bgImage="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Trade Cryptocurrencies on Web Trading Platform</h2>
          <p className="mb-4">
            Cryptocurrency trading gives you access to the world's most exciting digital asset markets. 
            On Web Trading Platform, you can trade major cryptocurrencies with binary options, call spreads, and knock-outs - all with limited risk.
          </p>
          <p className="mb-6">
            Crypto markets offer unique trading opportunities with their 24/7 availability, high volatility, 
            and emerging use cases across finance, technology, and beyond - all with defined risk parameters on Web Trading Platform.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Benefits of Trading Crypto on Web Trading Platform</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Access Bitcoin, Ethereum, and other major cryptocurrencies</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>No need for crypto wallets or exchanges</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Limited risk with defined maximum loss</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade crypto volatility with precision</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Trading Opportunities</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade around regulatory news and announcements</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Position for protocol upgrades and network events</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Capitalize on institutional adoption trends</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Diversify your trading portfolio with digital assets</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Available Cryptocurrencies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cryptocurrencies.map((crypto, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{crypto.name}</h3>
                <p className="text-gray-500 mb-4">{crypto.description}</p>
                <ul className="space-y-2 mb-4">
                  {crypto.features.map((feature, featIndex) => (
                    <li key={featIndex} className="flex items-start">
                      <Check className="text-[#ff5900] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/markets/market-data" 
                  className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center text-sm"
                >
                  View {crypto.name} charts <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to trade Cryptocurrencies?</h2>
          <p className="mb-6">Open an account today and start trading with limited risk.</p>
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
            <Link href="/markets/market-data">View Market Data</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}