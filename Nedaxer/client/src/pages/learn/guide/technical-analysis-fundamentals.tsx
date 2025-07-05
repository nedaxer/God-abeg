import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { ArrowLeft, Download, Clock, BarChart2, BookOpen, Share2 } from "lucide-react";

export default function TechnicalAnalysisFundamentals() {
  return (
    <PageLayout 
      title="Technical Analysis Fundamentals" 
      subtitle="Master the core principles of technical analysis for effective trading"
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
            Technical Analysis Fundamentals for Web Trading Platform Traders
          </h1>
          
          <div className="flex items-center mb-4 text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <BarChart2 className="h-4 w-4 mr-1" /> Technical Analysis
            </div>
            <div className="flex items-center mr-4">
              <BookOpen className="h-4 w-4 mr-1" /> Intermediate
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> 25 min read
            </div>
          </div>
          
          <p className="text-gray-700">
            Learn how to apply technical analysis to identify trading opportunities across all Web Trading Platform products.
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
                    <a href="#introduction" className="text-[#0033a0] hover:text-[#ff5900]">Introduction to Technical Analysis</a>
                  </li>
                  <li>
                    <a href="#chart-types" className="text-[#0033a0] hover:text-[#ff5900]">Chart Types and Patterns</a>
                  </li>
                  <li>
                    <a href="#indicators" className="text-[#0033a0] hover:text-[#ff5900]">Technical Indicators</a>
                  </li>
                  <li>
                    <a href="#support-resistance" className="text-[#0033a0] hover:text-[#ff5900]">Support and Resistance</a>
                  </li>
                  <li>
                    <a href="#application" className="text-[#0033a0] hover:text-[#ff5900]">Application to Trading Products</a>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="key-points" className="pt-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <span>Technical analysis uses historical price data to forecast future price movements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <span>Chart patterns help identify potential market reversals and continuations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <span>Technical indicators provide mathematical analysis of price and volume data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <span>Support and resistance levels are key price areas where market direction often changes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <span>Technical analysis can be applied to all Web Trading Platform products with the platform's charting tools</span>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="resources" className="pt-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <a href="#" className="text-[#0033a0] hover:text-[#ff5900]">
                      Technical Analysis Cheat Sheet (PDF)
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <a href="#" className="text-[#0033a0] hover:text-[#ff5900]">
                      Indicator Settings Reference Guide
                    </a>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff5900] font-bold mr-2">•</span>
                    <a href="#" className="text-[#0033a0] hover:text-[#ff5900]">
                      Chart Pattern Recognition Webinar
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
            <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Introduction to Technical Analysis</h2>
            
            <p className="mb-4">
              Technical analysis is a methodology used by traders to evaluate securities and identify trading opportunities 
              by analyzing statistical trends gathered from trading activity, such as price movement and volume. Unlike 
              fundamental analysis, which looks at a company's business performance, technical analysis focuses exclusively 
              on price charts and related indicators.
            </p>
            
            <p className="mb-4">
              For traders on Web Trading Platform, technical analysis provides a framework for making decisions about when 
              to enter and exit trades across all available products, including binary options, call spreads, and knock-outs. 
              The limited-risk nature of these products makes them ideal for implementing technical analysis strategies.
            </p>
            
            <div className="bg-[#f5f5f5] p-4 rounded-lg mb-4">
              <p className="font-bold text-[#0033a0]">Key Principles of Technical Analysis</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Price discounts everything - all known information is reflected in the price</li>
                <li>Price moves in trends - once established, trends are more likely to continue than reverse</li>
                <li>History tends to repeat itself - market psychology often leads to recurring patterns</li>
              </ul>
            </div>
          </section>
          
          <section id="chart-types" className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Chart Types and Patterns</h2>
            
            <p className="mb-4">
              Different chart types offer varying perspectives on price action. The Web Trading Platform offers several 
              chart types for technical analysis:
            </p>
            
            <div className="space-y-6 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Line Charts</h3>
                <p className="mb-2">
                  The simplest form of chart, displaying only the closing prices connected by a line. Line charts provide 
                  a clean view of overall price movement but lack detail on intraday price fluctuations.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Bar Charts</h3>
                <p className="mb-2">
                  Each bar represents a time period and shows the opening, high, low, and closing prices (OHLC). 
                  Bar charts provide more information than line charts while remaining visually uncluttered.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Candlestick Charts</h3>
                <p className="mb-2">
                  Similar to bar charts but with a visual emphasis on the relationship between opening and closing prices. 
                  The "body" of the candle shows the range between open and close, while "wicks" show the high and low. 
                  Candlesticks are particularly useful for identifying short-term patterns.
                </p>
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-3 text-[#0033a0]">Common Chart Patterns</h3>
            
            <div className="space-y-4 mb-4">
              <div>
                <h4 className="font-bold text-gray-800">Reversal Patterns</h4>
                <p>Signals that a trend may be about to change direction:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Head and Shoulders</li>
                  <li>Double Tops and Bottoms</li>
                  <li>Rounded Bottoms (Saucers)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-800">Continuation Patterns</h4>
                <p>Indicates a pause in the trend before continuing in the same direction:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Flags and Pennants</li>
                  <li>Triangles (Ascending, Descending, Symmetrical)</li>
                  <li>Rectangles</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-[#e6eef9] p-4 rounded-lg">
              <p className="font-bold text-[#0033a0] mb-2">Pattern Trading on Web Trading Platform</p>
              <p>
                Chart patterns work especially well with binary options where you can position for specific price movement 
                within a defined timeframe. For example, identifying a bullish flag pattern could present an excellent 
                opportunity to enter a "Higher" binary option with the right expiration time.
              </p>
            </div>
          </section>
          
          <section id="indicators" className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Technical Indicators</h2>
            
            <p className="mb-4">
              Technical indicators are mathematical calculations based on price, volume, or open interest that aim to forecast 
              financial market direction. The Web Trading Platform provides a comprehensive suite of indicators that can be 
              applied to your charts.
            </p>
            
            <div className="space-y-6 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Trend Indicators</h3>
                <p className="mb-2">
                  Help identify the direction of the market:
                </p>
                <ul className="list-disc pl-5">
                  <li>Moving Averages (Simple, Exponential, Weighted)</li>
                  <li>Moving Average Convergence Divergence (MACD)</li>
                  <li>Average Directional Index (ADX)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Momentum Indicators</h3>
                <p className="mb-2">
                  Identify the strength of price movement and potential reversal points:
                </p>
                <ul className="list-disc pl-5">
                  <li>Relative Strength Index (RSI)</li>
                  <li>Stochastic Oscillator</li>
                  <li>Commodity Channel Index (CCI)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Volatility Indicators</h3>
                <p className="mb-2">
                  Measure the rate of price movement, regardless of direction:
                </p>
                <ul className="list-disc pl-5">
                  <li>Bollinger Bands</li>
                  <li>Average True Range (ATR)</li>
                  <li>Standard Deviation</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-[#e6eef9] p-4 rounded-lg">
              <p className="font-bold text-[#0033a0] mb-2">Indicator Combinations for Better Results</p>
              <p>
                Combining different types of indicators can provide confirmation and reduce false signals. For example, 
                using a trend indicator (moving average) with a momentum indicator (RSI) can help identify high-probability 
                trading opportunities when both signals align.
              </p>
            </div>
          </section>
          
          <section id="support-resistance" className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Support and Resistance</h2>
            
            <p className="mb-4">
              Support and resistance are key concepts in technical analysis that represent price levels where a market 
              repeatedly tends to reverse direction.
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Support Levels</h3>
                <p>
                  Price levels where buying interest appears strong enough to overcome selling pressure, halting downward 
                  price movement. Support forms when prices stop falling and bounce higher.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Resistance Levels</h3>
                <p>
                  Price levels where selling pressure appears strong enough to overcome buying pressure, halting upward 
                  price movement. Resistance forms when prices stop rising and fall back.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Support/Resistance Role Reversal</h3>
                <p>
                  Once a support or resistance level is broken, its role often reverses. Former support becomes new 
                  resistance, and former resistance becomes new support.
                </p>
              </div>
            </div>
            
            <div className="bg-[#e6eef9] p-4 rounded-lg">
              <p className="font-bold text-[#0033a0] mb-2">Trading Support and Resistance on Web Trading Platform</p>
              <p>
                Binary options and call spreads are ideal for trading at support and resistance levels. For example, 
                buying a binary option at support with an expectation that the price will be higher at expiration, 
                or placing a call spread with the floor near a support level to define your risk.
              </p>
            </div>
          </section>
          
          <section id="application" className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Application to Trading Products</h2>
            
            <p className="mb-4">
              Technical analysis can be applied to all Web Trading Platform products, each with unique advantages 
              for different technical approaches.
            </p>
            
            <div className="space-y-6 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Binary Options</h3>
                <p className="mb-3">
                  Binary options are ideal for technical setups with clear directional bias and timeframes:
                </p>
                <ul className="list-disc pl-5">
                  <li>Trade reversals from support/resistance levels</li>
                  <li>Execute on momentum indicator signals</li>
                  <li>Position for breakouts from chart patterns</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Call Spreads</h3>
                <p className="mb-3">
                  Call spreads work well with technical analysis for range-bound markets:
                </p>
                <ul className="list-disc pl-5">
                  <li>Set floor and ceiling based on technical support/resistance</li>
                  <li>Capitalize on trends with defined risk parameters</li>
                  <li>Use volatility indicators to determine optimal spread width</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Knock-Outs</h3>
                <p className="mb-3">
                  Knock-Outs combine leverage with technical analysis for trending markets:
                </p>
                <ul className="list-disc pl-5">
                  <li>Place knockout levels beyond key technical levels</li>
                  <li>Use trend indicators to confirm direction</li>
                  <li>Align trade direction with longer-term technical trends</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-[#e6eef9] p-4 rounded-lg mb-6">
              <p className="font-bold text-[#0033a0] mb-2">Technical Analysis Workflow</p>
              <ol className="list-decimal pl-5">
                <li>Identify market condition (trending, ranging, volatile)</li>
                <li>Apply appropriate indicators for the condition</li>
                <li>Identify key support/resistance levels</li>
                <li>Select the appropriate product (binary option, call spread, or knock-out)</li>
                <li>Choose expiration time based on timeframe of your analysis</li>
                <li>Execute trade with defined risk parameters</li>
              </ol>
            </div>
            
            <div className="bg-[#f5f5f5] p-4 rounded-lg">
              <p className="font-bold text-[#0033a0] mb-2">Best Practices</p>
              <ul className="list-disc pl-5">
                <li>Combine multiple timeframes for better perspective</li>
                <li>Look for confirmation across different indicators</li>
                <li>Use risk management with every trade</li>
                <li>Journal your trades to review and improve your technical approach</li>
              </ul>
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
                  <Link href="/learn/guide/support-resistance-trading">
                    Next Guide: Support & Resistance
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