import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight } from "lucide-react";

export default function KnockOuts() {
  return (
    <PageLayout 
      title="Knock-Outs" 
      subtitle="Trade with leverage while maintaining limited risk with built-in floor and ceiling levels"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">What Are Knock-Outs?</h2>
          <p className="mb-4">
            Knock-Outs are leveraged trading products with built-in risk management features. 
            They allow you to trade market movements with predetermined floor and ceiling levels that, 
            once breached, automatically close your position.
          </p>
          <p className="mb-6">
            With Knock-Outs, you can access leverage while maintaining strict control over your maximum potential loss.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Benefits of Knock-Outs</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade with leverage on popular markets</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Built-in risk management with knockout levels</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade 23 hours a day, 5 days a week</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>No overnight financing charges</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">How Knock-Outs Work</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Select a market and Knock-Out contract</span>
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
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Available Knock-Out Markets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Bitcoin</h3>
              <p className="mb-4">Trade Knock-Outs on Bitcoin with controlled risk and leverage.</p>
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
              <p className="mb-4">Trade Knock-Outs on Ethereum with smart contract exposure.</p>
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
              <p className="mb-4">Trade Knock-Outs on Solana, Cardano, and other altcoins with defined risk parameters.</p>
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
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Comparing Our Products</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="border p-3 text-left">Feature</th>
                  <th className="border p-3 text-center">Binary Options</th>
                  <th className="border p-3 text-center">Call Spreads</th>
                  <th className="border p-3 text-center">Knock-Outs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">Risk Management</td>
                  <td className="border p-3 text-center">Limited to initial cost</td>
                  <td className="border p-3 text-center">Limited to floor/ceiling range</td>
                  <td className="border p-3 text-center">Limited with knockout levels</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Leverage</td>
                  <td className="border p-3 text-center">No</td>
                  <td className="border p-3 text-center">Limited</td>
                  <td className="border p-3 text-center">Yes</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Outcome Type</td>
                  <td className="border p-3 text-center">All or nothing</td>
                  <td className="border p-3 text-center">Partial (price-dependent)</td>
                  <td className="border p-3 text-center">Partial with knockout</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Best For</td>
                  <td className="border p-3 text-center">Specific price targets</td>
                  <td className="border p-3 text-center">Range-bound markets</td>
                  <td className="border p-3 text-center">Trend following with risk control</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="/products/pricing" 
              className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center justify-center"
            >
              View detailed product pricing <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to trade Knock-Outs?</h2>
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
            <Link href="/learn/knock-outs">Learn More</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}