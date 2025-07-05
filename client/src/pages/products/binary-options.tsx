import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight } from "lucide-react";

export default function BinaryOptions() {
  const features = [
    {
      title: "Limited Risk by Design",
      description: "Know your maximum risk and potential profit before you enter a trade. You can never lose more than your initial investment.",
      icon: "shield-check",
    },
    {
      title: "Simple Yes/No Proposition",
      description: "Binary options are based on a simple yes/no market proposition. If you're right at expiration, you receive the full payout.",
      icon: "check-circle",
    },
    {
      title: "Multiple Markets",
      description: "Trade binary options on forex, stock indices, commodities, and events markets, all from a single platform.",
      icon: "globe",
    },
    {
      title: "Flexible Expirations",
      description: "Choose from multiple expiration times ranging from 5 minutes to one week to match your trading strategy.",
      icon: "clock",
    },
  ];

  const examples = [
    {
      market: "EUR/USD",
      proposition: "Will EUR/USD be above 1.1050 at 3:00 PM ET?",
      risk: "$42.50 per contract",
      reward: "$57.50 per contract",
      expiry: "3:00 PM ET",
    },
    {
      market: "US 500 (S&P 500)",
      proposition: "Will the US 500 be below 4,825 at 4:15 PM ET?",
      risk: "$63.00 per contract",
      reward: "$37.00 per contract",
      expiry: "4:15 PM ET",
    },
    {
      market: "Gold",
      proposition: "Will Gold be above $2,345 at 1:30 PM ET?",
      risk: "$55.50 per contract",
      reward: "$44.50 per contract",
      expiry: "1:30 PM ET",
    },
  ];

  return (
    <PageLayout 
      title="Binary Options" 
      subtitle="Limited risk contracts based on a simple yes/no market proposition"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">What Are Binary Options?</h2>
          <p className="mb-4">
            Binary options are limited-risk contracts based on a simple yes/no market proposition. 
            For example, "Will EUR/USD be above 1.1050 at 3:00 PM ET?" If you buy this option and 
            EUR/USD is above 1.1050 at 3:00 PM ET, your option settles at 100 and you receive the 
            full payout. If EUR/USD is at or below 1.1050, the option settles at 0.
          </p>
          <p className="mb-6">
            On Nadex, binary options trade between 0 and 100, representing the probability of the 
            event occurring. Your maximum risk and potential profit are known before you place your trade.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, i) => (
              <div key={i} className="bg-[#f5f5f5] p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-[#0033a0]">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">How Binary Options Work</h2>
          
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Binary Option Basics</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>Binary options trade between 0 and 100</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>The price represents the probability of the event occurring</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>If you buy at 42.50, your maximum risk is $42.50 per contract</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>Your maximum potential profit is $57.50 per contract (100 - 42.50)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>If your binary settles at 100, you receive the full $100 payout</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Trading Binary Options</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>Buy if you think the statement will be true at expiration</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>Sell if you think the statement will be false at expiration</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>Close positions early to secure profits or limit losses</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>Trade on desktop or mobile devices</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>No commissions - all costs are built into the price</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Example diagram or illustration could go here */}
          <div className="bg-[#f5f5f5] p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Binary Option Examples</h3>
            
            <div className="space-y-6">
              {examples.map((example, i) => (
                <div key={i} className="border-b border-gray-300 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-bold text-lg mb-2">{example.market}</h4>
                  <p className="font-medium mb-2">{example.proposition}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-semibold text-red-600">Maximum Risk:</span> {example.risk}
                    </div>
                    <div>
                      <span className="font-semibold text-green-600">Maximum Reward:</span> {example.reward}
                    </div>
                    <div>
                      <span className="font-semibold">Expiration:</span> {example.expiry}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                href="/learn/binary-options" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center justify-center"
              >
                Learn more about trading binary options <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Available Binary Option Markets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Bitcoin</h3>
              <p className="mb-4">Trade binary options on Bitcoin with defined risk parameters.</p>
              <Button 
                asChild
                variant="outline" 
                className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
              >
                <Link href="/markets/commodities">View Bitcoin Markets</Link>
              </Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Ethereum</h3>
              <p className="mb-4">Trade binary options on Ethereum and capitalize on smart contract developments.</p>
              <Button 
                asChild
                variant="outline" 
                className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
              >
                <Link href="/markets/commodities">View Ethereum Markets</Link>
              </Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Altcoins</h3>
              <p className="mb-4">Trade binary options on Solana, Cardano, Ripple, and other alternative cryptocurrencies.</p>
              <Button 
                asChild
                variant="outline" 
                className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
              >
                <Link href="/markets/commodities">View Cryptocurrency Markets</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to trade Binary Options?</h2>
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
            <Link href="/learn/binary-options">Learn More</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}