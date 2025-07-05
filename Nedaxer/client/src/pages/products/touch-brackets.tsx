import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight } from "lucide-react";

export default function TouchBrackets() {
  return (
    <PageLayout 
      title="Touch Brackets" 
      subtitle="Trade with leverage while maintaining limited risk with innovative floor and ceiling knockout levels"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">What Are Touch Brackets?</h2>
          <p className="mb-4">
            Touch Brackets are innovative trading products that combine leverage with built-in risk management. 
            They allow you to trade market movements with predefined floor and ceiling levels that, once touched, automatically close your position.
          </p>
          <p className="mb-6">
            With Touch Brackets, you can trade with the potential for higher returns while maintaining strict control over your risk.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Benefits of Touch Brackets</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Built-in risk management with knockout levels</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade with leverage for enhanced returns</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>No need for manual stop-loss orders</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Know your exact risk and potential reward upfront</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">How Touch Brackets Work</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Select a market and Touch Bracket contract</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Buy if you think the market will rise, sell if you think it will fall</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Position closes automatically if market touches floor or ceiling</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Close early to secure profits or limit losses</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Available Touch Bracket Markets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Bitcoin</h3>
              <p className="mb-4">Trade Touch Brackets on Bitcoin with defined risk levels for volatile markets.</p>
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
              <p className="mb-4">Trade Touch Brackets on Ethereum with built-in price brackets to limit risk.</p>
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
              <p className="mb-4">Trade Touch Brackets on leading altcoins with automatic knockout levels.</p>
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
          <h2 className="text-2xl font-bold mb-4">Ready to trade Touch Brackets?</h2>
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
            <Link href="/learn/getting-started">Learn More</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}