import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight, Bitcoin, TrendingUp, AlertTriangle } from "lucide-react";

export default function CallSpreads() {
  return (
    <PageLayout 
      title="Crypto Call Spreads" 
      subtitle="Limited risk alternatives to traditional cryptocurrency options with built-in floor and ceiling levels"
      bgColor="#0033a0"
      bgImage="https://images.unsplash.com/photo-1639815188549-c291ad9a86fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80"
    >
      <div className="max-w-4xl mx-auto">
        {/* Main explanation with image */}
        <div className="mb-10">
          <div className="md:flex items-center gap-8 mb-6">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">What Are Crypto Call Spreads?</h2>
              <p className="mb-4">
                Call spreads on Nedaxer are limited-risk alternatives to traditional cryptocurrency options, with built-in floor and ceiling levels. 
                They provide a way to participate in crypto market movements with predefined risk and potential profit.
              </p>
              <p>
                Unlike traditional crypto options, Nedaxer call spreads are fully collateralized, which means you always know your maximum potential loss and profit before placing your trade.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
                alt="Cryptocurrency call spread trading visualization" 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Benefits of Crypto Call Spreads</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Limited risk with predefined maximum loss - perfect for volatile crypto markets</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Defined profit potential with built-in ceiling for target-based trading</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Lower cost compared to binary options in some cryptocurrency scenarios</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Partial outcomes based on where crypto price settles in the range</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">How Crypto Call Spreads Work</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Choose a cryptocurrency market and expiration time</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Select a call spread with floor and ceiling price levels</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Buy if you think the crypto will rise, sell if you think it will fall</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Ability to close early to secure profits or limit losses during market swings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Example trade visualization */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Sample Crypto Call Spread Trade</h2>
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <div className="md:flex gap-8">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Bitcoin (BTC/USD) Example</h3>
                <p className="mb-3">In this example, you believe Bitcoin will rise from its current price of $65,500 but want protection against price drops.</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <TrendingUp className="text-[#0033a0] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span><strong>Call Spread Range:</strong> $65,000 (floor) to $68,000 (ceiling)</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="text-[#0033a0] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span><strong>Your Position:</strong> Buy at $1,500 per contract</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="text-[#0033a0] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span><strong>Maximum Risk:</strong> $1,500 (your purchase price)</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="text-[#0033a0] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span><strong>Maximum Reward:</strong> $1,500 (if BTC price is at or above $68,000 at expiration)</span>
                  </li>
                </ul>
                <p><strong>Outcome:</strong> If BTC reaches $67,000 at expiration, you earn $1,000 profit, even though it didn't reach the ceiling price.</p>
              </div>
              <div className="md:w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1591994843349-f415893b3a6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" 
                  alt="Bitcoin trading" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Available Crypto Call Spread Markets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80" 
                  alt="Bitcoin trading" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Bitcoin</h3>
                <p className="mb-4">Trade call spreads on Bitcoin with defined floor and ceiling levels for the world's largest cryptocurrency.</p>
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                >
                  <Link href="/markets/bitcoin">View Bitcoin Markets</Link>
                </Button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80" 
                  alt="Ethereum trading" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Ethereum</h3>
                <p className="mb-4">Trade call spreads on Ethereum with price-dependent outcomes for smart contract exposure.</p>
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                >
                  <Link href="/markets/ethereum">View Ethereum Markets</Link>
                </Button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80" 
                  alt="Altcoin trading" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Altcoins</h3>
                <p className="mb-4">Trade call spreads on Solana, Cardano, Ripple, and other leading cryptocurrencies.</p>
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                >
                  <Link href="/markets/altcoins">View Altcoin Markets</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to trade Crypto Call Spreads?</h2>
          <p className="mb-6">Open an account today and start trading cryptocurrency with limited risk.</p>
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
            <Link href="/learn/call-spreads">Learn More</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}