import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, ExternalLink, Info } from "lucide-react";

export default function CFTC() {
  return (
    <PageLayout 
      title="CFTC Rule 4.41" 
      subtitle="Hypothetical Performance Disclaimer"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="bg-[#f5f5f5] p-6 rounded-lg mb-8">
            <div className="flex items-start">
              <Info className="text-[#0033a0] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <p className="mb-4">
                  In accordance with CFTC Rule 4.41, the following disclaimer applies to all hypothetical performance 
                  results that may be displayed or discussed on the Nedaxer website, mobile applications, trading platforms, 
                  educational materials, webinars, and any other content provided by Nedaxer.
                </p>
                <p className="mb-0">
                  This disclosure is provided to ensure transparency regarding the limitations of hypothetical 
                  trading results and to help you make informed trading decisions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Hypothetical Performance Disclaimer</h2>
            
            <div className="bg-gray-100 p-6 border-l-4 border-yellow-500 rounded-r-lg mb-8">
              <p className="font-bold text-gray-700 mb-4">
                HYPOTHETICAL PERFORMANCE RESULTS HAVE MANY INHERENT LIMITATIONS, SOME OF WHICH ARE DESCRIBED BELOW. 
                NO REPRESENTATION IS BEING MADE THAT ANY ACCOUNT WILL OR IS LIKELY TO ACHIEVE PROFITS OR LOSSES SIMILAR TO THOSE SHOWN. 
                IN FACT, THERE ARE FREQUENTLY SHARP DIFFERENCES BETWEEN HYPOTHETICAL PERFORMANCE RESULTS AND THE ACTUAL RESULTS 
                SUBSEQUENTLY ACHIEVED BY ANY PARTICULAR TRADING PROGRAM.
              </p>
              <p className="font-bold text-gray-700 mb-4">
                ONE OF THE LIMITATIONS OF HYPOTHETICAL PERFORMANCE RESULTS IS THAT THEY ARE GENERALLY PREPARED WITH THE BENEFIT 
                OF HINDSIGHT. IN ADDITION, HYPOTHETICAL TRADING DOES NOT INVOLVE FINANCIAL RISK, AND NO HYPOTHETICAL 
                TRADING RECORD CAN COMPLETELY ACCOUNT FOR THE IMPACT OF FINANCIAL RISK IN ACTUAL TRADING.
              </p>
              <p className="font-bold text-gray-700 mb-0">
                FOR EXAMPLE, THE ABILITY TO WITHSTAND LOSSES OR TO ADHERE TO A PARTICULAR TRADING PROGRAM IN SPITE OF TRADING 
                LOSSES ARE MATERIAL POINTS WHICH CAN ALSO ADVERSELY AFFECT ACTUAL TRADING RESULTS. THERE ARE NUMEROUS OTHER 
                FACTORS RELATED TO THE MARKETS IN GENERAL OR TO THE IMPLEMENTATION OF ANY SPECIFIC TRADING PROGRAM WHICH 
                CANNOT BE FULLY ACCOUNTED FOR IN THE PREPARATION OF HYPOTHETICAL PERFORMANCE RESULTS AND ALL OF WHICH CAN 
                ADVERSELY AFFECT ACTUAL TRADING RESULTS.
              </p>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Understanding the Limitations of Hypothetical Results</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Benefit of Hindsight</h3>
                <p className="text-gray-700">
                  Hypothetical trading results are often prepared with the benefit of hindsight. This means that the 
                  strategy or approach may have been developed or refined after the fact, with knowledge of how the 
                  markets actually performed during the time period being analyzed. In actual trading, traders do not 
                  have this advantage and must make decisions based on current market conditions and projections of 
                  future market behavior.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Absence of Financial Risk</h3>
                <p className="text-gray-700">
                  Hypothetical trading does not involve actual financial risk. When trading with real money, emotional 
                  factors such as fear of loss or excitement over potential profits can significantly impact trading 
                  decisions. These psychological factors are absent in hypothetical trading scenarios, which can lead 
                  to significant differences between hypothetical results and actual trading performance.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Market Factors</h3>
                <p className="text-gray-700">
                  Hypothetical results may not fully account for various market factors that can affect actual trading, 
                  such as liquidity, slippage, and the ability to execute trades at desired prices. In real trading, 
                  these factors can significantly impact results, especially during volatile market conditions or 
                  when trading less liquid markets.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-3 text-[#0033a0]">System or Strategy Implementation</h3>
                <p className="text-gray-700">
                  Hypothetical results may assume perfect implementation of a trading system or strategy. In reality, 
                  there may be delays in executing trades, errors in following the strategy, or technical issues with 
                  the trading platform that can affect actual trading results. Additionally, the strategy itself may 
                  perform differently in real-time market conditions than it did in backtested scenarios.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Nedaxer's Approach to Presenting Performance Information</h2>
            
            <p className="mb-6">
              At Nedaxer, we strive to provide educational content and trading information that is accurate, balanced, 
              and compliant with regulatory requirements. Our approach includes:
            </p>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg space-y-4">
              <div className="flex items-start">
                <div className="bg-[#0033a0] text-white rounded-full h-6 w-6 flex items-center justify-center font-bold flex-shrink-0 mr-3">1</div>
                <div>
                  <h3 className="font-bold mb-1 text-[#0033a0]">Clear Disclaimers</h3>
                  <p className="text-gray-700">
                    We include appropriate disclaimers when presenting hypothetical performance information to ensure 
                    that users understand the limitations of such information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#0033a0] text-white rounded-full h-6 w-6 flex items-center justify-center font-bold flex-shrink-0 mr-3">2</div>
                <div>
                  <h3 className="font-bold mb-1 text-[#0033a0]">Balanced Presentation</h3>
                  <p className="text-gray-700">
                    We aim to present a balanced view of the potential risks and rewards of trading, avoiding 
                    exaggerated claims or guarantees of trading success.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#0033a0] text-white rounded-full h-6 w-6 flex items-center justify-center font-bold flex-shrink-0 mr-3">3</div>
                <div>
                  <h3 className="font-bold mb-1 text-[#0033a0]">Educational Focus</h3>
                  <p className="text-gray-700">
                    Our content focuses on educating users about trading concepts, markets, and strategy principles 
                    rather than promoting specific trading approaches based solely on hypothetical results.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#0033a0] text-white rounded-full h-6 w-6 flex items-center justify-center font-bold flex-shrink-0 mr-3">4</div>
                <div>
                  <h3 className="font-bold mb-1 text-[#0033a0]">Transparency</h3>
                  <p className="text-gray-700">
                    We strive to be transparent about the nature of any performance information presented, 
                    clearly indicating when information is based on hypothetical or backtested results.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">CFTC Regulation Reference</h2>
            
            <p className="mb-4">
              CFTC Rule 4.41 pertains to advertising by commodity pool operators, commodity trading advisors, and the 
              principals thereof. This rule establishes standards for how performance information can be presented 
              in promotional materials, including the requirement for specific disclaimers when presenting hypothetical 
              trading results.
            </p>
            
            <div className="flex items-center justify-center">
              <Button
                asChild
                variant="outline"
                className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
              >
                <Link href="https://www.cftc.gov/" target="_blank" className="flex items-center">
                  Visit CFTC Website <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Trade with Realistic Expectations</h2>
          <p className="mb-6">
            Understanding the limitations of hypothetical results helps you approach trading with realistic expectations. 
            Learn more about developing a sound trading approach through our educational resources.
          </p>
          <Button
            asChild
            className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold"
          >
            <Link href="/learn/trading-strategies">View Trading Education</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="ml-4 bg-transparent border border-white hover:bg-white hover:bg-opacity-20 text-white font-semibold"
          >
            <Link href="/legal/risk">Read Risk Disclosure</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}