import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight, AlertTriangle, FileText, BarChart2, TrendingUp } from "lucide-react";

export default function BinaryOptionsLearn() {
  const features = [
    {
      title: "Limited Risk by Design",
      description: "Know your maximum risk and reward before you trade. You can never lose more than your initial investment.",
      icon: <Check className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Short-term Expirations",
      description: "Trade with expiries from 5 minutes to 1 day, perfect for cryptocurrency markets that move 24/7.",
      icon: <TrendingUp className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Crypto Markets",
      description: "Access Bitcoin, Ethereum, and other cryptocurrency markets with simple yes/no propositions.",
      icon: <BarChart2 className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Simple Trading Logic",
      description: "Easy to understand - either your proposition is correct (you win) or incorrect (you lose).",
      icon: <FileText className="h-10 w-10 text-[#0033a0]" />,
    },
  ];

  const strategyTypes = [
    {
      title: "Price Action Trading",
      description: "Use Bitcoin and Ethereum's price action patterns to predict short-term moves within the expiry time.",
      examples: [
        "Trade breakouts from key support/resistance levels",
        "Enter after confirming cryptocurrency trend direction",
        "Use candlestick patterns to time binary option entries"
      ]
    },
    {
      title: "News/Event Trading",
      description: "Trade binary options around key cryptocurrency announcements, protocol upgrades, or market events.",
      examples: [
        "Bitcoin halvings and major network upgrades",
        "Ethereum protocol changes and ETF announcements",
        "Regulatory news affecting crypto markets"
      ]
    },
    {
      title: "Technical Indicator Trading",
      description: "Use technical indicators to generate crypto binary option trading signals.",
      examples: [
        "MACD crossovers for momentum trading",
        "RSI overbought/oversold conditions",
        "Moving average crossovers for trend confirmation"
      ]
    },
  ];

  const examples = [
    {
      market: "Bitcoin (BTC/USD)",
      proposition: "Will Bitcoin be above $70,000 at 3:00 PM ET?",
      risk: "$45 per contract",
      reward: "$55 per contract",
      expiry: "3:00 PM ET",
      currentPrice: "$68,925",
      analysis: "Bitcoin has been in a strong uptrend and is testing key resistance. You believe it will break through by 3:00 PM."
    },
    {
      market: "Ethereum (ETH/USD)",
      proposition: "Will Ethereum be below $3,850 at 2:30 PM ET?",
      risk: "$62 per contract",
      reward: "$38 per contract",
      expiry: "2:30 PM ET",
      currentPrice: "$3,905",
      analysis: "Ethereum has been showing signs of weakness and you believe it will fall below support at $3,850 within the next hour."
    },
  ];

  const faqs = [
    {
      question: "How do cryptocurrency binary options differ from spot crypto trading?",
      answer: "With binary options, you never own the underlying cryptocurrency - you're simply predicting price movement. Your risk is limited to your initial cost, whereas spot trading can be more volatile with potentially unlimited losses if prices move against you."
    },
    {
      question: "What times can I trade crypto binary options?",
      answer: "Nedaxer's cryptocurrency binary options can be traded 24/7, matching the always-on nature of crypto markets, unlike traditional markets that close on nights and weekends."
    },
    {
      question: "Can I close a crypto binary option before expiration?",
      answer: "Yes, you can close positions early to secure profits or limit losses, providing flexibility as cryptocurrency market conditions change rapidly."
    },
    {
      question: "What is the minimum amount to trade?",
      answer: "The minimum position size for cryptocurrency binary options on Nedaxer is $1, allowing you to start with minimal risk while learning."
    },
  ];

  return (
    <PageLayout 
      title="Binary Options Trading Guide" 
      subtitle="Learn how to trade cryptocurrency markets with limited-risk binary options"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">What Are Binary Options?</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <p className="mb-4">
              Binary options are limited-risk contracts based on a simple yes/no market proposition. They're called "binary" because there are only two possible outcomes at expiration: you either receive the full payout (if your prediction is correct) or nothing (if your prediction is incorrect).
            </p>
            <p className="mb-4">
              For example, a binary option might ask: "Will Bitcoin be above $70,000 at 3:00 PM ET?" If you buy this option and Bitcoin is indeed above $70,000 at the specified time, you receive the full payout. If not, the option expires worthless.
            </p>
            <p>
              Binary options are particularly well-suited for cryptocurrency markets because they allow you to speculate on price movement without actually owning the volatile digital assets, while maintaining strictly defined risk parameters.
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
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">How Crypto Binary Options Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Trading Mechanics</h3>
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
                  <span>If you buy at 45, your maximum risk is $45 per contract</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Your maximum profit would be $55 per contract (100 - 45)</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>If the binary settles at 100, you receive the full $100 payout</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Buy or Sell?</h3>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-700 mb-2">Buy a Binary Option When:</h4>
                  <ul className="space-y-1 text-green-800">
                    <li className="flex items-start">
                      <Check className="text-green-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                      <span>You think Bitcoin, Ethereum or other crypto will rise above the strike price</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-green-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                      <span>You believe the statement will be TRUE at expiration</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-bold text-red-700 mb-2">Sell a Binary Option When:</h4>
                  <ul className="space-y-1 text-red-800">
                    <li className="flex items-start">
                      <Check className="text-red-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                      <span>You think Bitcoin, Ethereum or other crypto will fall below the strike price</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="text-red-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                      <span>You believe the statement will be FALSE at expiration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Binary Option Example Trades</h3>
            
            <div className="space-y-6">
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
                      <span className="font-semibold text-green-600">Maximum Reward:</span> {example.reward}
                    </div>
                    <div>
                      <span className="font-semibold">Expiration:</span> {example.expiry}
                    </div>
                  </div>
                  <p className="text-sm italic">{example.analysis}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Binary Option Trading Strategies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {strategyTypes.map((strategy, i) => (
              <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-[#0033a0] p-4">
                  <h3 className="text-lg font-bold text-white">{strategy.title}</h3>
                </div>
                <div className="p-5">
                  <p className="mb-4 text-gray-700">{strategy.description}</p>
                  <h4 className="font-bold text-[#0033a0] mb-2">Examples:</h4>
                  <ul className="space-y-1">
                    {strategy.examples.map((example, j) => (
                      <li key={j} className="flex items-start">
                        <Check className="text-[#ff5900] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-8">
            <div className="flex items-start">
              <AlertTriangle className="text-yellow-600 mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-2 text-yellow-800">Risk Management Tips</h3>
                <ul className="space-y-2 text-yellow-800">
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Never risk more than 5% of your account on a single crypto binary option trade</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Set a maximum daily loss limit for your crypto trading</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Focus on quality setups rather than trading quantity</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-yellow-600 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span>Be cautious during highly volatile cryptocurrency market conditions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="md:w-1/2 bg-[#f5f5f5] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Ready to Try Binary Options?</h3>
            <p className="mb-6">Open an account and start trading cryptocurrency binary options with as little as $250.</p>
            <Button
              asChild
              className="w-full bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold"
            >
              <Link href="#">Open Trading Account</Link>
            </Button>
          </div>
          
          <div className="md:w-1/2 bg-[#f5f5f5] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Practice First</h3>
            <p className="mb-6">Try cryptocurrency binary options trading with virtual funds on our demo platform.</p>
            <Button
              asChild
              variant="outline"
              className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
            >
              <Link href="#">Open Demo Account</Link>
            </Button>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Explore Other Trading Products</h2>
          <p className="mb-6">Nedaxer offers multiple ways to trade cryptocurrency markets with limited risk.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold"
            >
              <Link href="/learn/call-spreads">Learn About Call Spreads</Link>
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