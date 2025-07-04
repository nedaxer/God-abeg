import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Check, Layers, Clock, ChartBar, Shield } from "lucide-react";
import { CryptoChart, solanaData } from "@/components/crypto-chart";

export default function AltcoinMarkets() {
  const altcoins = [
    {
      name: "Solana (SOL)",
      description: "High-performance blockchain focused on fast transactions and low fees",
      features: [
        "High throughput and low transaction costs",
        "Growing DeFi and NFT ecosystem",
        "Proof of History consensus mechanism",
        "Institutional adoption increasing"
      ]
    },
    {
      name: "Cardano (ADA)",
      description: "Peer-reviewed blockchain platform with a focus on sustainability and scalability",
      features: [
        "Academic research-driven development",
        "Proof of Stake consensus mechanism",
        "Smart contract functionality",
        "Focus on governance and sustainability"
      ]
    },
    {
      name: "Ripple (XRP)",
      description: "Digital payment protocol and cryptocurrency designed for financial institutions",
      features: [
        "Fast cross-border payments",
        "Partnerships with financial institutions",
        "Low transaction fees",
        "High transaction throughput"
      ]
    },
    {
      name: "Polkadot (DOT)",
      description: "Multi-chain network enabling blockchains to work together",
      features: [
        "Interoperability between blockchains",
        "Shared security model",
        "Scalable architecture with parachains",
        "On-chain governance system"
      ]
    }
  ];

  const tradingBenefits = [
    {
      title: "Diversified Crypto Exposure",
      description: "Access to a wide range of altcoin markets beyond Bitcoin and Ethereum",
      icon: <Layers className="h-10 w-10 text-[#ff5900]" />
    },
    {
      title: "Limited Risk Trading",
      description: "Trade altcoins with predefined risk parameters on every position",
      icon: <Shield className="h-10 w-10 text-[#ff5900]" />
    },
    {
      title: "High Growth Potential",
      description: "Opportunity to trade emerging cryptocurrencies with high growth potential",
      icon: <ChartBar className="h-10 w-10 text-[#ff5900]" />
    },
    {
      title: "24/7 Market Access",
      description: "Trade altcoins anytime without exchange downtimes or withdrawal limits",
      icon: <Clock className="h-10 w-10 text-[#ff5900]" />
    }
  ];

  return (
    <PageLayout 
      title="Altcoin Markets" 
      subtitle="Trade alternative cryptocurrencies with limited risk on the Nedaxer platform"
      bgImage="https://images.unsplash.com/photo-1642032456331-cb944ebc2af3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Altcoin Trading on Nedaxer</h2>
          <p className="mb-4">
            Altcoins (alternative cryptocurrencies) represent the diverse ecosystem of blockchain projects 
            beyond Bitcoin. On Nedaxer, you can trade price movements of leading altcoins with our unique 
            limited-risk products without having to own or store the underlying cryptocurrencies.
          </p>
          <p className="mb-6">
            Our altcoin trading products are designed to provide exposure to a variety of cryptocurrency 
            markets while maintaining strict risk parameters, helping you navigate the volatility with confidence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Altcoin Trading Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Access to multiple altcoin markets from a single platform</span>
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
                  <span>No cryptocurrency wallets or exchange accounts needed</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Avoid security risks associated with holding altcoins</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Altcoin Market Opportunities</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Capitalize on altcoin volatility and price movements</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade during new listings, protocol updates, and market events</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Diversify your cryptocurrency trading exposure</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Take advantage of altcoin market cycles</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Profit potential in both rising and falling markets</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Available Altcoin Markets</h2>
          
          <div className="space-y-6">
            {altcoins.map((coin, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{coin.name}</h3>
                <p className="text-gray-700 mb-4">{coin.description}</p>
                <h4 className="font-semibold text-gray-800 mb-2">Key Characteristics:</h4>
                <ul className="space-y-1 mb-4">
                  {coin.features.map((feature, j) => (
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
                  View Trading Products <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Featured Altcoin Chart: Solana (SOL)</h2>
          
          <div className="mb-8">
            <div className="rounded-lg overflow-hidden">
              <CryptoChart data={solanaData} coinSymbol="SOL" coinName="Solana" />
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
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Altcoin Trading Products</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-[#f5f5f5] p-6 rounded-lg border-l-4 border-[#0033a0]">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Binary Options</h3>
              <p className="text-gray-700 mb-3">
                Predict if an altcoin's price will be above or below a specific level at expiration. 
                Limited risk to your initial premium with predefined profit potential.
              </p>
              <Link 
                href="#" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg border-l-4 border-[#0033a0]">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Call Spreads</h3>
              <p className="text-gray-700 mb-3">
                Trade altcoin price movements within a range with built-in floor and ceiling levels. 
                Perfect for medium-term directional trading with capped risk and reward.
              </p>
              <Link 
                href="#" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg border-l-4 border-[#0033a0]">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Touch Brackets</h3>
              <p className="text-gray-700 mb-3">
                Trade altcoins with automatic profit targets and stop-loss levels built in. 
                Hold positions longer with limited risk in both trending and range-bound markets.
              </p>
              <Link 
                href="#" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Why Trade Altcoins on Nedaxer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tradingBenefits.map((benefit, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col">
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{benefit.title}</h3>
                <p className="text-gray-700 mb-4">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <div className="bg-gradient-to-r from-[#0033a0] to-[#001a60] text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Start Trading Altcoins Today</h2>
            <p className="mb-6">Open an account and access our altcoin trading products with limited risk.</p>
            <Button
              asChild
              className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold px-8 py-3"
            >
              <Link href="#">Open Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}