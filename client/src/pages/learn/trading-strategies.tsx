import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, Clock, Zap, Target, Activity } from "lucide-react";

export default function TradingStrategies() {
  const strategies = [
    {
      title: "Technical Analysis",
      description: "Using chart patterns, indicators, and price action to identify potential trading opportunities.",
      icon: <TrendingUp className="h-10 w-10 text-[#0033a0]" />,
      examples: [
        "Support and resistance trading",
        "Moving average crossovers",
        "Momentum indicators (RSI, MACD)",
        "Chart pattern recognition",
      ],
    },
    {
      title: "News Trading",
      description: "Trading based on economic data releases, central bank decisions, and other market-moving events.",
      icon: <Zap className="h-10 w-10 text-[#0033a0]" />,
      examples: [
        "Non-Farm Payrolls releases",
        "FOMC interest rate decisions",
        "Earnings announcements",
        "Geopolitical developments",
      ],
    },
    {
      title: "Intraday Trading",
      description: "Short-term trading strategies focused on price movements within a single trading day.",
      icon: <Clock className="h-10 w-10 text-[#0033a0]" />,
      examples: [
        "Scalping",
        "Breakout trading",
        "Range trading",
        "Trend following",
      ],
    },
    {
      title: "Risk Management",
      description: "Strategies focused on controlling risk and maximizing reward potential across trades.",
      icon: <Target className="h-10 w-10 text-[#0033a0]" />,
      examples: [
        "Position sizing",
        "Diversification across markets",
        "Setting appropriate price targets",
        "Using multiple expiration times",
      ],
    },
  ];

  const technicalGuides = [
    {
      title: "Support and Resistance Trading",
      description: "Learn how to identify and trade key support and resistance levels using binary options and call spreads.",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      title: "Trading with Moving Averages",
      description: "Discover how to use moving averages to identify trends and generate trading signals for Nadex products.",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      title: "RSI and MACD Strategies",
      description: "Master momentum trading with RSI and MACD indicators to time entries and exits on binary options.",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      title: "Chart Pattern Trading",
      description: "Learn to identify and trade classic chart patterns using Nadex's limited-risk products.",
      level: "Advanced",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
  ];

  const newsGuides = [
    {
      title: "Trading Non-Farm Payrolls",
      description: "Strategies for trading the monthly U.S. employment report using binary options and call spreads.",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      title: "FOMC Decision Trading",
      description: "Techniques for trading Federal Reserve interest rate decisions and policy statements.",
      level: "Advanced",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
  ];

  return (
    <PageLayout 
      title="Trading Strategies" 
      subtitle="Learn effective strategies for trading Nadex products across different markets"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Strategy Approaches</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {strategies.map((strategy, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="mr-4">{strategy.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{strategy.title}</h3>
                    <p className="text-gray-700">{strategy.description}</p>
                  </div>
                </div>
                
                <h4 className="font-bold text-[#0033a0] mb-2">Example Strategies:</h4>
                <ul className="space-y-1 mb-4">
                  {strategy.examples.map((example, eIndex) => (
                    <li key={eIndex} className="flex items-start">
                      <span className="text-[#ff5900] mr-2">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Applying Strategies to Nadex Products</h2>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Matching Products to Strategies</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#0033a0] text-white">
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Best For</th>
                    <th className="p-3 text-left">Strategy Approach</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="p-3 border-t border-gray-300 font-medium">Binary Options</td>
                    <td className="p-3 border-t border-gray-300">
                      <ul className="list-disc pl-5">
                        <li>Specific price targets</li>
                        <li>Yes/no market propositions</li>
                        <li>Short-term market moves</li>
                      </ul>
                    </td>
                    <td className="p-3 border-t border-gray-300">
                      <ul className="list-disc pl-5">
                        <li>News trading</li>
                        <li>Support/resistance bounces</li>
                        <li>Overbought/oversold conditions</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border-t border-gray-300 font-medium">Call Spreads</td>
                    <td className="p-3 border-t border-gray-300">
                      <ul className="list-disc pl-5">
                        <li>Market direction predictions</li>
                        <li>Partial profit scenarios</li>
                        <li>Range-bound markets</li>
                      </ul>
                    </td>
                    <td className="p-3 border-t border-gray-300">
                      <ul className="list-disc pl-5">
                        <li>Trend following</li>
                        <li>Channel trading</li>
                        <li>Breakout scenarios</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 border-t border-gray-300 font-medium">Knock-Outs</td>
                    <td className="p-3 border-t border-gray-300">
                      <ul className="list-disc pl-5">
                        <li>Trading with leverage</li>
                        <li>Strong directional movement</li>
                        <li>Intraday trend trading</li>
                      </ul>
                    </td>
                    <td className="p-3 border-t border-gray-300">
                      <ul className="list-disc pl-5">
                        <li>Momentum strategies</li>
                        <li>Trend following with risk control</li>
                        <li>Volatility breakouts</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Technical Analysis Guides</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {technicalGuides.map((guide, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={guide.image} 
                  alt={guide.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-[#0033a0]">{guide.title}</h3>
                    <span className="bg-[#e6eef9] text-[#0033a0] text-xs px-2 py-1 rounded-full">{guide.level}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{guide.description}</p>
                  <Link 
                    href="#" 
                    className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                  >
                    Read Guide <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mb-8">
            <Button
              asChild
              className="bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold px-6 py-2"
            >
              <Link href="#">View All Technical Guides</Link>
            </Button>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">News Trading Guides</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {newsGuides.map((guide, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={guide.image} 
                  alt={guide.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-[#0033a0]">{guide.title}</h3>
                    <span className="bg-[#e6eef9] text-[#0033a0] text-xs px-2 py-1 rounded-full">{guide.level}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{guide.description}</p>
                  <Link 
                    href="#" 
                    className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                  >
                    Read Guide <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              asChild
              className="bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold px-6 py-2"
            >
              <Link href="#">View All News Trading Guides</Link>
            </Button>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Risk Management Essentials</h2>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Core Risk Management Principles</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Activity className="text-[#ff5900] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1 text-[#0033a0]">Position Sizing</h4>
                  <p className="text-gray-700">
                    Determine the appropriate amount to risk on each trade based on your account size and risk tolerance. A common guideline is risking no more than 1-2% of your trading capital on any single trade.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Activity className="text-[#ff5900] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1 text-[#0033a0]">Diversification</h4>
                  <p className="text-gray-700">
                    Spread your trading capital across different markets, products, and strategies to reduce overall portfolio risk and avoid overexposure to a single market or event.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Activity className="text-[#ff5900] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1 text-[#0033a0]">Risk-Reward Ratio</h4>
                  <p className="text-gray-700">
                    Aim for trades with a favorable risk-reward ratio, typically 1:1.5 or better. This means your potential profit should be at least 1.5 times your potential loss.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Activity className="text-[#ff5900] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1 text-[#0033a0]">Trading Journal</h4>
                  <p className="text-gray-700">
                    Keep a detailed record of all your trades, including entry/exit points, strategies used, and outcomes. Regularly review your journal to identify patterns and areas for improvement.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                href="#" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold inline-flex items-center"
              >
                Read Our Complete Risk Management Guide <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Put These Strategies Into Practice</h2>
          <p className="mb-6">Open an account and apply these trading strategies with limited risk on a regulated US exchange.</p>
          <Button
            asChild
            className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold px-8 py-3"
          >
            <Link href="#">Open Account</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}