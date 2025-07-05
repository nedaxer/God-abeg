import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight, AlertTriangle, LineChart, BarChart2, TrendingUp, Scale } from "lucide-react";

export default function CallSpreadsLearn() {
  const features = [
    {
      title: "Known Risk/Reward",
      description: "Trade with clearly defined maximum potential risk and profit on every cryptocurrency trade.",
      icon: <Scale className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Multiple Expirations",
      description: "Choose from intraday, daily, and weekly expirations to match your cryptocurrency trading strategy.",
      icon: <TrendingUp className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Volatility Management",
      description: "Perfect for volatile crypto market conditions where protecting capital is essential.",
      icon: <BarChart2 className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Partial Outcomes",
      description: "Unlike binary options, call spreads pay out based on where the cryptocurrency price lands within the range.",
      icon: <LineChart className="h-10 w-10 text-[#0033a0]" />,
    },
  ];

  const examples = [
    {
      market: "Bitcoin (BTC/USD)",
      proposition: "Buy a call spread with floor at $65,000 and ceiling at $70,000",
      cost: "$2,500 per contract",
      risk: "$2,500 (your purchase price)",
      maxProfit: "$2,500 per contract",
      expiry: "Friday at 3:00 PM ET",
      currentPrice: "$68,700",
      analysis: "If BTC is below $65,000 at expiration, you lose your full premium. If it's above $70,000, you make a full profit. If it falls between the range, you receive a partial payout based on where it lands."
    },
    {
      market: "Ethereum (ETH/USD)",
      proposition: "Sell a call spread with floor at $3,700 and ceiling at $4,000",
      cost: "$1,200 per contract",
      risk: "$1,800 per contract",
      maxProfit: "$1,200 (your sale price)",
      expiry: "Today at 4:00 PM ET",
      currentPrice: "$3,850",
      analysis: "By selling, you profit if ETH stays below $4,000. You make full profit if ETH is below $3,700, lose your full risk if ETH reaches $4,000, or have a partial outcome if ETH is between the levels."
    },
  ];

  const keyDifferences = [
    {
      title: "Call Spreads vs. Binary Options",
      differences: [
        "Call spreads offer partial payouts based on where the crypto price lands in the range, while binary options are all-or-nothing",
        "Call spreads can be more cost-effective for trending cryptocurrency markets",
        "Call spreads work well when you expect cryptocurrency price movements within a range"
      ]
    },
    {
      title: "Call Spreads vs. Traditional Options",
      differences: [
        "Call spreads have pre-defined maximum risk, while traditional crypto options can have undefined risk",
        "Call spreads are fully collateralized - no margin calls or unexpected losses",
        "Call spreads are simpler to understand with straightforward pricing versus complex options Greeks"
      ]
    },
    {
      title: "Call Spreads vs. Knock-Outs",
      differences: [
        "Call spreads focus on price at expiration, while knock-outs can be triggered at any time during the contract",
        "Call spreads are better for range-bound strategies, knock-outs for trending crypto markets",
        "Call spreads have no automatic closeout prior to expiration, unlike knock-outs"
      ]
    },
  ];

  const strategyTypes = [
    {
      title: "Range Trading",
      description: "Ideal when you expect cryptocurrency to trade within specific price boundaries.",
      steps: [
        "Identify support and resistance levels in Bitcoin, Ethereum or other cryptocurrencies",
        "Buy call spreads with floor near support and ceiling near resistance",
        "Sell call spreads when you expect the crypto to remain range-bound"
      ]
    },
    {
      title: "Directional Trading",
      description: "For when you have a directional bias but want to limit risk in volatile crypto markets.",
      steps: [
        "Buy call spreads when bullish on crypto with a realistic price target",
        "Sell call spreads when bearish with protection against extreme moves",
        "Use multiple expirations to match your expected timeframe for the crypto move"
      ]
    },
    {
      title: "Event-Based Trading",
      description: "Trading around cryptocurrency news events, protocol upgrades, or market announcements.",
      steps: [
        "Buy call spreads before positive expected events (ETF approvals, network upgrades)",
        "Sell call spreads ahead of potentially negative crypto market events",
        "Use shorter expirations to focus on the immediate impact of the event"
      ]
    },
  ];

  return (
    <PageLayout 
      title="Call Spreads Trading Guide" 
      subtitle="Master limited-risk cryptocurrency trading with built-in floor and ceiling levels"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">What Are Call Spreads?</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <p className="mb-4">
              Call spreads on cryptocurrency markets are limited-risk alternatives to traditional options with built-in floor and ceiling levels. They provide an intelligent way to trade crypto price movements with predefined risk and potential profit.
            </p>
            <p className="mb-4">
              Unlike traditional crypto options, Nedaxer call spreads are fully collateralized, so you always know your maximum potential loss before placing your trade - a crucial advantage in volatile cryptocurrency markets.
            </p>
            <p>
              Call spreads derive their value from where the cryptocurrency price settles at expiration relative to the floor and ceiling levels, providing a range of potential outcomes rather than the binary all-or-nothing result of binary options.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-[#f5f5f5] p-6 rounded-lg flex items-start">
                <div className="mr-4 text-[#0033a0]">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">How Crypto Call Spreads Work</h2>
          
          <div className="md:flex gap-8 mb-8">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">The Basics</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Choose a cryptocurrency market (Bitcoin, Ethereum, etc.)</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Select floor and ceiling price levels that define your range</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Choose an expiration date and time</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Buy the call spread if you expect the crypto price to rise</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Sell the call spread if you expect the crypto price to fall</span>
                </li>
              </ul>
            </div>
            
            <div className="md:w-1/2">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Potential Outcomes</h3>
              <div className="bg-[#f5f5f5] p-4 rounded-lg mb-4">
                <h4 className="font-bold mb-2">When You Buy a Call Spread:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-green-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Maximum Profit:</strong> When crypto price is at or above the ceiling</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-red-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Maximum Loss:</strong> When crypto price is at or below the floor</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Partial Outcome:</strong> When crypto price is between floor and ceiling</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#f5f5f5] p-4 rounded-lg">
                <h4 className="font-bold mb-2">When You Sell a Call Spread:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-green-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Maximum Profit:</strong> When crypto price is at or below the floor</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-red-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Maximum Loss:</strong> When crypto price is at or above the ceiling</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Partial Outcome:</strong> When crypto price is between floor and ceiling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f8f9fa] border border-gray-200 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Call Spread Examples</h3>
            
            <div className="space-y-8">
              {examples.map((example, i) => (
                <div key={i} className="border-b border-gray-300 pb-6 last:border-0 last:pb-0">
                  <h4 className="font-bold text-lg mb-2">{example.market}</h4>
                  <p className="font-medium mb-1 text-[#0033a0]">{example.proposition}</p>
                  <p className="text-sm mb-3">Current price: {example.currentPrice}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="font-semibold text-red-600">Maximum Risk:</span> {example.risk}
                    </div>
                    <div>
                      <span className="font-semibold text-green-600">Maximum Profit:</span> {example.maxProfit}
                    </div>
                    <div>
                      <span className="font-semibold">Cost:</span> {example.cost}
                    </div>
                    <div>
                      <span className="font-semibold">Expiration:</span> {example.expiry}
                    </div>
                  </div>
                  <p className="text-sm">{example.analysis}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Comparing Crypto Trading Products</h2>
          
          <div className="space-y-6">
            {keyDifferences.map((section, i) => (
              <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-[#0033a0] p-4">
                  <h3 className="text-lg font-bold text-white">{section.title}</h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-2">
                    {section.differences.map((diff, j) => (
                      <li key={j} className="flex items-start">
                        <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Call Spread Trading Strategies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {strategyTypes.map((strategy, i) => (
              <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-[#f5f5f5] p-4">
                  <h3 className="text-lg font-bold text-[#0033a0]">{strategy.title}</h3>
                </div>
                <div className="p-5">
                  <p className="mb-4 text-gray-700">{strategy.description}</p>
                  <h4 className="font-bold text-[#0033a0] mb-2">How to Implement:</h4>
                  <ul className="space-y-2">
                    {strategy.steps.map((step, j) => (
                      <li key={j} className="flex items-start">
                        <Check className="text-[#ff5900] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="text-yellow-600 mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-2 text-yellow-800">Risk Management Tips</h3>
                <ul className="space-y-2 text-yellow-800">
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Size your positions based on your risk tolerance and account size</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Be cautious with expiration selection - longer expiries have more time for crypto market volatility</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Consider closing positions early if the crypto market moves significantly against you</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Be aware of major market events and news that could impact cryptocurrency prices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-[#f5f5f5] p-8 rounded-lg text-center max-w-md">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Ready to Trade Call Spreads?</h3>
            <p className="mb-6">Open an account and start trading cryptocurrency call spreads with defined risk parameters.</p>
            <Button
              asChild
              className="w-full bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold"
            >
              <Link href="#">Open Trading Account</Link>
            </Button>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Explore Other Trading Products</h2>
          <p className="mb-6">Discover different ways to trade cryptocurrency markets with limited risk on Nedaxer.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold"
            >
              <Link href="/learn/binary-options">Learn About Binary Options</Link>
            </Button>
            <Button
              asChild
              className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold"
            >
              <Link href="/learn/knock-outs">Learn About Knock-Outs</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}