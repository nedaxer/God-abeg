import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight, AlertTriangle, Shield, Zap, Clock, TrendingUp } from "lucide-react";

export default function KnockOutsLearn() {
  const features = [
    {
      title: "Built-in Risk Management",
      description: "Auto-close positions when predefined price levels are reached to protect your cryptocurrency capital.",
      icon: <Shield className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Leveraged Trading",
      description: "Amplify your exposure to cryptocurrency market movements without the unlimited risk of traditional leverage.",
      icon: <Zap className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "24/7 Trading",
      description: "Trade popular cryptocurrencies around the clock, matching the always-on nature of digital asset markets.",
      icon: <Clock className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Trend Trading Focus",
      description: "Ideal for trending crypto markets when you want to capitalize on momentum with defined risk parameters.",
      icon: <TrendingUp className="h-10 w-10 text-[#0033a0]" />,
    },
  ];

  const examples = [
    {
      market: "Bitcoin (BTC/USD)",
      proposition: "Buy a knock-out with floor at $64,000",
      leverage: "5x leverage",
      risk: "$1,000 (total position value: $5,000)",
      maxProfit: "Unlimited until expiration (but capped by floor level)",
      expiry: "1 week",
      currentPrice: "$68,900",
      analysis: "This position profits as BTC rises and closes automatically if Bitcoin price touches or falls below $64,000, limiting your maximum loss to $1,000."
    },
    {
      market: "Ethereum (ETH/USD)",
      proposition: "Sell a knock-out with ceiling at $4,200",
      leverage: "3x leverage",
      risk: "$1,500 (total position value: $4,500)",
      maxProfit: "Value of contract at entry minus floor value",
      expiry: "3 days",
      currentPrice: "$3,900",
      analysis: "This position profits as ETH falls and closes automatically if Ethereum price reaches or rises above $4,200, limiting your maximum loss to $1,500."
    },
  ];

  const comparisonPoints = [
    {
      title: "Knock-Outs vs. Leveraged Crypto Trading",
      advantages: [
        "Predefined maximum loss with built-in stop levels",
        "No margin calls or liquidations beyond your initial investment",
        "No overnight financing charges on crypto positions",
        "Uniform pricing across cryptocurrencies with transparent costs"
      ]
    },
    {
      title: "Knock-Outs vs. Stop Loss Orders",
      advantages: [
        "Stop level is guaranteed - no slippage during volatile crypto markets",
        "Works even during exchange outages or extreme market conditions",
        "Cannot be adjusted once set, enforcing trading discipline",
        "Contract values adjust automatically as crypto price approaches knockout level"
      ]
    },
  ];

  const tradingStrategies = [
    {
      title: "Crypto Trend Following",
      description: "Capture strong directional moves in cryptocurrency markets while defining your maximum risk.",
      steps: [
        "Identify cryptocurrencies in clear uptrends or downtrends",
        "Buy knock-outs with floors below support in uptrends",
        "Sell knock-outs with ceilings above resistance in downtrends",
        "Set knockout levels wide enough to avoid premature exits from normal volatility"
      ]
    },
    {
      title: "Breakout Trading",
      description: "Capitalize on cryptocurrency breakouts from key technical levels with controlled risk.",
      steps: [
        "Identify cryptocurrencies consolidating at support/resistance levels",
        "Buy knock-outs with floors below the consolidation zone when expecting upside breakouts",
        "Sell knock-outs with ceilings above the consolidation zone when expecting downside breakouts",
        "Use shorter expirations to focus on the immediate breakout move"
      ]
    },
    {
      title: "News/Event Trading",
      description: "Trade around significant crypto market events with predefined risk parameters.",
      steps: [
        "Position before major cryptocurrency announcements, protocol upgrades or regulatory news",
        "Use knockout levels to define your maximum acceptable loss",
        "Leverage allows for meaningful profit potential even with limited capital",
        "Select expiration to match expected duration of the market reaction"
      ]
    },
  ];

  const faqItems = [
    {
      question: "How do knockout levels protect my cryptocurrency investment?",
      answer: "Knockout levels act as built-in stop losses that automatically close your position if the market reaches that level. This guarantees your maximum possible loss is known in advance - essential for volatile crypto markets that can move dramatically in seconds."
    },
    {
      question: "Can I adjust my knockout level after opening a position?",
      answer: "No, knockout levels are fixed at the time you open the position. This enforces trading discipline but also means you need to select your risk parameters carefully when trading volatile cryptocurrencies."
    },
    {
      question: "What happens when a knockout level is reached?",
      answer: "Your position is automatically closed at the knockout level, regardless of market conditions or liquidity. This guaranteed execution is a key advantage in volatile cryptocurrency markets where traditional stop losses might experience slippage."
    },
    {
      question: "Are knockout levels affected by market gaps or extreme volatility?",
      answer: "No, knockout levels are contractually guaranteed. Even if the cryptocurrency price jumps past your knockout level (gaps), your maximum loss remains limited to the difference between your entry price and the knockout level."
    }
  ];

  return (
    <PageLayout 
      title="Knock-Outs Trading Guide" 
      subtitle="Trade cryptocurrency with leverage while maintaining limited risk through built-in floor and ceiling levels"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">What Are Knock-Outs?</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <p className="mb-4">
              Knock-Outs are innovative leveraged trading products designed for cryptocurrency markets with built-in risk management features. They allow you to amplify your exposure to market movements while maintaining strict control over your maximum potential loss.
            </p>
            <p className="mb-4">
              The key feature of Knock-Outs is their predetermined floor (for buy positions) or ceiling (for sell positions) levels that, when breached, automatically close your position. This prevents the unlimited losses that can occur with traditional leveraged cryptocurrency trading.
            </p>
            <p>
              Knock-Outs are particularly valuable in the highly volatile cryptocurrency markets, where price swings can be dramatic and traditional stop losses may experience slippage or fail to execute during extreme conditions.
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
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">How Crypto Knock-Outs Work</h2>
          
          <div className="md:flex gap-8 mb-8">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Core Mechanics</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Select a cryptocurrency market (Bitcoin, Ethereum, etc.)</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Choose a Knock-Out contract with appropriate floor or ceiling level</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Select an expiration date (if the knockout level isn't reached)</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Choose the amount of leverage you want to apply</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Position closes automatically if market touches floor or ceiling</span>
                </li>
              </ul>
            </div>
            
            <div className="md:w-1/2">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Buy vs. Sell</h3>
              <div className="bg-[#f5f5f5] p-4 rounded-lg mb-4">
                <h4 className="font-bold mb-2">When You Buy (Long):</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-green-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Floor level:</strong> Your position closes if cryptocurrency price falls to this level</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Profit potential:</strong> You profit as cryptocurrency price rises above your entry price</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Maximum loss:</strong> Limited to difference between entry price and floor level</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#f5f5f5] p-4 rounded-lg">
                <h4 className="font-bold mb-2">When You Sell (Short):</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="text-red-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Ceiling level:</strong> Your position closes if cryptocurrency price rises to this level</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-red-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Profit potential:</strong> You profit as cryptocurrency price falls below your entry price</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-red-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span><strong>Maximum loss:</strong> Limited to difference between ceiling level and entry price</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f8f9fa] border border-gray-200 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Knock-Out Examples</h3>
            
            <div className="space-y-8">
              {examples.map((example, i) => (
                <div key={i} className="border-b border-gray-300 pb-6 last:border-0 last:pb-0">
                  <h4 className="font-bold text-lg mb-2">{example.market}</h4>
                  <p className="font-medium mb-1 text-[#0033a0]">{example.proposition}</p>
                  <p className="text-sm mb-3">Current price: {example.currentPrice} | {example.leverage}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="font-semibold text-red-600">Maximum Risk:</span> {example.risk}
                    </div>
                    <div>
                      <span className="font-semibold text-green-600">Maximum Profit:</span> {example.maxProfit}
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
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Advantages of Knock-Outs for Crypto Trading</h2>
          
          <div className="space-y-6">
            {comparisonPoints.map((point, i) => (
              <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-[#0033a0] p-4">
                  <h3 className="text-lg font-bold text-white">{point.title}</h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-2">
                    {point.advantages.map((advantage, j) => (
                      <li key={j} className="flex items-start">
                        <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                        <span>{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Crypto Knock-Out Trading Strategies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {tradingStrategies.map((strategy, i) => (
              <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-[#f5f5f5] p-4">
                  <h3 className="text-lg font-bold text-[#0033a0]">{strategy.title}</h3>
                </div>
                <div className="p-5">
                  <p className="mb-4 text-gray-700">{strategy.description}</p>
                  <h4 className="font-bold text-[#0033a0] mb-2">Implementation:</h4>
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
                <h3 className="text-lg font-bold mb-2 text-yellow-800">Risk Management with Knock-Outs</h3>
                <ul className="space-y-2 text-yellow-800">
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Select knockout levels carefully based on cryptocurrency technical support/resistance</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Consider wider knockout levels for volatile cryptocurrencies like Bitcoin to avoid premature exits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Use appropriate leverage - higher leverage increases potential returns but reaches knockout levels faster</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Be aware of major crypto market events that could trigger significant price swings</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-[#f5f5f5] p-8 rounded-lg text-center max-w-md">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Ready to Trade Knock-Outs?</h3>
            <p className="mb-6">Open an account and start leveraged cryptocurrency trading with built-in risk management.</p>
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
          <p className="mb-6">Discover the full range of cryptocurrency trading products with built-in risk management on Nedaxer.</p>
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
              <Link href="/learn/call-spreads">Learn About Call Spreads</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}