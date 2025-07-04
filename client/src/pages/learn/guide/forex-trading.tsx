import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { ArrowLeft, Download, Clock, TrendingUp, BookOpen, Share2, DollarSign } from "lucide-react";

export default function ForexTradingGuide() {
  return (
    <PageLayout 
      title="Forex Trading Guide" 
      subtitle="Learn to trade major and minor currency pairs with limited risk"
      bgColor="#0033a0"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Guide Header */}
        <div className="bg-[#f5f5f5] p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <Link href="/learn/trading-guides" className="text-[#0033a0] hover:text-[#ff5900] flex items-center mr-4">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Guides
            </Link>
            <div className="ml-auto flex items-center space-x-3">
              <button className="text-[#0033a0] hover:text-[#ff5900] flex items-center">
                <Download className="h-4 w-4 mr-1" /> PDF
              </button>
              <button className="text-[#0033a0] hover:text-[#ff5900] flex items-center">
                <Share2 className="h-4 w-4 mr-1" /> Share
              </button>
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-[#0033a0] mb-3">
            Trading Forex with Limited Risk on Web Trading Platform
          </h1>
          
          <div className="flex items-center mb-4 text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <DollarSign className="h-4 w-4 mr-1" /> Market Guides
            </div>
            <div className="flex items-center mr-4">
              <BookOpen className="h-4 w-4 mr-1" /> Intermediate
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> 15 min read
            </div>
          </div>
          
          <p className="text-gray-700">
            Strategies and techniques for trading major and minor currency pairs with binary options and call spreads.
          </p>
        </div>
        
        {/* Guide Navigation */}
        <div className="border-b border-gray-200">
          <div className="p-4">
            <Tabs defaultValue="content">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="key-points">Key Points</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="pt-4">
                <ul className="space-y-2">
                  <li>
                    <a href="#introduction" className="text-[#0033a0] hover:text-[#ff5900]">Introduction to Forex Trading</a>
                  </li>
                  <li>
                    <a href="#major-pairs" className="text-[#0033a0] hover:text-[#ff5900]">Major Currency Pairs</a>
                  </li>
                  <li>
                    <a href="#market-drivers" className="text-[#0033a0] hover:text-[#ff5900]">Forex Market Drivers</a>
                  </li>
                  <li>
                    <a href="#trading-strategies" className="text-[#0033a0] hover:text-[#ff5900]">Forex Trading Strategies</a>
                  </li>
                  <li>
                    <a href="#risk-management" className="text-[#0033a0] hover:text-[#ff5900]">Risk Management for Forex</a>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="key-points" className="pt-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <span>Forex is the largest financial market with daily volumes exceeding $6 trillion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <span>Major currency pairs offer the highest liquidity and tightest spreads</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <span>Economic indicators, central bank policies, and geopolitical events drive forex markets</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <span>Technical and fundamental analysis can be combined for effective forex trading</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <span>Web Trading Platform's binary options and call spreads provide limited risk forex exposure</span>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="resources" className="pt-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <a href="#" className="text-[#0033a0] hover:text-[#ff5900]">
                      Forex Economic Calendar
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <a href="#" className="text-[#0033a0] hover:text-[#ff5900]">
                      Currency Correlation Table
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <a href="#" className="text-[#0033a0] hover:text-[#ff5900]">
                      Major Forex News Trading Webinar
                    </a>
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Guide Content */}
        <div className="p-6">
          <section id="introduction" className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Introduction to Forex Trading</h2>
            
            <p className="mb-4">
              The foreign exchange market (forex) is the largest financial market in the world, with daily trading volumes 
              exceeding $6 trillion. Forex trading involves the simultaneous buying of one currency and selling of another, 
              with traders speculating on the changing values between currency pairs.
            </p>
            
            <p className="mb-4">
              Trading forex on Web Trading Platform offers unique advantages compared to traditional forex brokers. With 
              binary options and call spreads, you can trade major and minor currency pairs with completely limited risk. 
              This means you always know your maximum potential loss before entering a trade — a significant benefit in 
              the highly volatile forex market.
            </p>
            
            <div className="bg-[#f5f5f5] p-4 rounded-lg mb-4">
              <p className="font-bold text-[#0033a0]">Advantages of Trading Forex on Web Trading Platform</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Defined and limited risk on every trade</li>
                <li>No margin calls or leverage-related liquidations</li>
                <li>Access to major and minor currency pairs</li>
                <li>Multiple expiration timeframes from minutes to days</li>
                <li>No need to calculate pip values or position sizing</li>
              </ul>
            </div>
          </section>
          
          <section id="major-pairs" className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Major Currency Pairs</h2>
            
            <p className="mb-4">
              Web Trading Platform offers trading on all major currency pairs, which feature the highest liquidity and 
              typically the tightest spreads in the forex market.
            </p>
            
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-[#f5f5f5]">
                    <th className="border border-gray-200 p-3 text-left text-[#0033a0]">Currency Pair</th>
                    <th className="border border-gray-200 p-3 text-left text-[#0033a0]">Description</th>
                    <th className="border border-gray-200 p-3 text-left text-[#0033a0]">Characteristics</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 p-3 font-semibold">EUR/USD</td>
                    <td className="border border-gray-200 p-3">Euro/US Dollar</td>
                    <td className="border border-gray-200 p-3">
                      Most traded pair with highest liquidity; influenced by EU and US economic data
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 p-3 font-semibold">GBP/USD</td>
                    <td className="border border-gray-200 p-3">British Pound/US Dollar</td>
                    <td className="border border-gray-200 p-3">
                      More volatile than EUR/USD; sensitive to UK politics and Brexit developments
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-3 font-semibold">USD/JPY</td>
                    <td className="border border-gray-200 p-3">US Dollar/Japanese Yen</td>
                    <td className="border border-gray-200 p-3">
                      Often functions as a safe haven; sensitive to interest rate differentials
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 p-3 font-semibold">USD/CHF</td>
                    <td className="border border-gray-200 p-3">US Dollar/Swiss Franc</td>
                    <td className="border border-gray-200 p-3">
                      Another safe-haven currency; often moves inversely to EUR/USD
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-3 font-semibold">AUD/USD</td>
                    <td className="border border-gray-200 p-3">Australian Dollar/US Dollar</td>
                    <td className="border border-gray-200 p-3">
                      Commodity currency highly correlated with gold and Chinese economic data
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 p-3 font-semibold">USD/CAD</td>
                    <td className="border border-gray-200 p-3">US Dollar/Canadian Dollar</td>
                    <td className="border border-gray-200 p-3">
                      Strongly influenced by oil prices and US-Canadian trade relations
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="mb-4">
              Web Trading Platform also offers several minor currency pairs (cross-pairs) that don't include the USD, 
              providing additional trading opportunities:
            </p>
            
            <ul className="list-disc pl-5 mb-4">
              <li>EUR/GBP (Euro/British Pound)</li>
              <li>EUR/JPY (Euro/Japanese Yen)</li>
              <li>GBP/JPY (British Pound/Japanese Yen)</li>
              <li>AUD/JPY (Australian Dollar/Japanese Yen)</li>
              <li>EUR/AUD (Euro/Australian Dollar)</li>
            </ul>
          </section>
          
          <section id="market-drivers" className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Forex Market Drivers</h2>
            
            <p className="mb-4">
              Understanding what moves currency markets is essential for successful forex trading. Several key factors 
              influence currency values:
            </p>
            
            <div className="space-y-6 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Economic Indicators</h3>
                <p className="mb-2">
                  Key economic data releases that significantly impact forex markets:
                </p>
                <ul className="list-disc pl-5">
                  <li>Non-Farm Payrolls (US)</li>
                  <li>GDP Growth Rates</li>
                  <li>Inflation Data (CPI, PPI)</li>
                  <li>Retail Sales</li>
                  <li>Manufacturing and Services PMIs</li>
                  <li>Consumer Confidence</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Central Bank Policies</h3>
                <p className="mb-2">
                  Central bank decisions and communications often create significant market movements:
                </p>
                <ul className="list-disc pl-5">
                  <li>Interest Rate Decisions</li>
                  <li>Quantitative Easing/Tightening Programs</li>
                  <li>Forward Guidance Statements</li>
                  <li>Press Conferences and Minutes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Geopolitical Events</h3>
                <p className="mb-2">
                  Political developments that can drive currency volatility:
                </p>
                <ul className="list-disc pl-5">
                  <li>Elections and Regime Changes</li>
                  <li>Trade Agreements/Disputes</li>
                  <li>International Conflicts</li>
                  <li>Brexit-type Events</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-[#e6eef9] p-4 rounded-lg">
              <p className="font-bold text-[#0033a0] mb-2">Economic Calendar Trading</p>
              <p>
                Web Trading Platform products are particularly well-suited for trading around high-impact economic releases. 
                With binary options, you can position for the expected market reaction without risking more than your 
                initial investment, even during extreme volatility following major announcements.
              </p>
            </div>
          </section>
          
          <section id="trading-strategies" className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Forex Trading Strategies</h2>
            
            <p className="mb-4">
              Several trading strategies work particularly well with Web Trading Platform's binary options and 
              call spreads when applied to forex markets:
            </p>
            
            <div className="space-y-6 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Trend Following with Binary Options</h3>
                <p className="mb-3">
                  Using binary options to trade with established trends:
                </p>
                <ul className="list-disc pl-5">
                  <li>Identify the trend using moving averages (20, 50, 200-period)</li>
                  <li>Wait for pullbacks to support levels or moving averages</li>
                  <li>Enter a binary option in the direction of the trend</li>
                  <li>Select an expiration that allows enough time for the move to develop</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Range Trading with Call Spreads</h3>
                <p className="mb-3">
                  Using call spreads to capitalize on range-bound currency pairs:
                </p>
                <ul className="list-disc pl-5">
                  <li>Identify clear support and resistance levels on the chart</li>
                  <li>Buy call spreads near support levels</li>
                  <li>Set the floor near support and ceiling below resistance</li>
                  <li>Profit from the movement within the range while limiting risk</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">News Trading Strategies</h3>
                <p className="mb-3">
                  Capitalizing on forex volatility around major economic releases:
                </p>
                <ul className="list-disc pl-5">
                  <li>Identify high-impact news events from economic calendars</li>
                  <li>Analyze the expected figures versus forecasts</li>
                  <li>Position with binary options shortly before the announcement</li>
                  <li>Use shorter expirations to capitalize on immediate market reactions</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-[#e6eef9] p-4 rounded-lg mb-6">
              <p className="font-bold text-[#0033a0] mb-2">Strategy Example: Trading EUR/USD on NFP Release</p>
              <ol className="list-decimal pl-5">
                <li>Review economists' consensus forecast for NFP</li>
                <li>Analyze recent EUR/USD technical setup</li>
                <li>If NFP comes in significantly higher than expected, US Dollar typically strengthens</li>
                <li>Position with a binary option predicting EUR/USD will be lower at expiration</li>
                <li>Choose a 1-hour expiration to capture the immediate market reaction</li>
                <li>Risk is limited to the premium paid for the binary option</li>
              </ol>
            </div>
          </section>
          
          <section id="risk-management" className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Risk Management for Forex</h2>
            
            <p className="mb-4">
              While Web Trading Platform products have built-in risk management through limited maximum loss, 
              implementing additional risk control measures is essential for long-term success:
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Position Sizing</h3>
                <p>
                  Limit each trade to 1-2% of your total trading capital. Even with defined-risk products, 
                  proper position sizing prevents large drawdowns from consecutive losses.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Correlation Awareness</h3>
                <p>
                  Be mindful of correlations between currency pairs. Trading multiple correlated pairs in the 
                  same direction effectively increases your position size and risk exposure.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Time Management</h3>
                <p>
                  Match your expiration selection to your analysis timeframe. For instance, don't use 5-minute 
                  binary options when trading based on daily chart patterns.
                </p>
              </div>
            </div>
            
            <div className="bg-[#f5f5f5] p-4 rounded-lg">
              <p className="font-bold text-[#0033a0] mb-2">Risk Management Advantage</p>
              <p>
                One of the primary advantages of trading forex with Web Trading Platform is the elimination of 
                the unlimited risk typical with spot forex trading. No matter how volatile the currency pair becomes, 
                your risk is always capped at your initial investment amount.
              </p>
            </div>
          </section>
          
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex justify-between items-center">
              <Button
                asChild
                variant="outline"
                className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
              >
                <Link href="/learn/trading-guides">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Guides
                </Link>
              </Button>
              
              <div className="flex space-x-4">
                <Button
                  asChild
                  variant="outline"
                  className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                >
                  <Link href="/learn/guide/risk-management-essentials">
                    Next Guide: Risk Management
                  </Link>
                </Button>
                
                <Button
                  asChild
                  className="bg-[#0033a0] hover:bg-opacity-90 text-white"
                >
                  <Link href="/platform/web-platform">
                    Try It on the Platform
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}