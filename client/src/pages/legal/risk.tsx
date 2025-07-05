import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, FileText, Calendar, AlertTriangle } from "lucide-react";

export default function Risk() {
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: `This Risk Disclosure Statement outlines the potential risks associated with trading derivative products on Nadex. Trading involves significant risk and is not suitable for all investors. You should carefully consider whether trading is appropriate for you in light of your experience, objectives, financial resources, risk tolerance, and other relevant circumstances.

Before opening an account and trading on Nadex, you should understand the risks involved and be prepared to accept them. This disclosure cannot and does not detail all risks associated with trading on Nadex. It is your responsibility to ensure that you fully understand the nature of the transactions you are entering into and the extent of your exposure to risk.`
    },
    {
      id: "derivatives",
      title: "Derivative Trading Risks",
      content: `Trading derivative products such as binary options, call spreads, and knock-outs involves substantial risk. While Nadex products are designed with built-in risk limitations (you cannot lose more than your initial cost or collateral), you should be aware of the following risks:

Market Risk: The prices of the underlying markets on which Nadex offers contracts can be highly volatile. Market prices are subject to rapid fluctuations due to various factors including changes in supply and demand relationships, governmental policies, national and international political and economic events, and other factors beyond Nadex's control.

Liquidity Risk: Under certain market conditions, it may be difficult or impossible to liquidate a position. Such conditions include but are not limited to: regulatory restrictions, market disruptions, and extraordinary market volatility.

System Risk: Trading through an electronic trading platform carries risks associated with system failures, communication failures, delays, or other technical issues that could prevent access to the trading platform or execution of trades.

Counterparty Risk: As a CFTC-regulated exchange, Nadex acts as the counterparty to all contracts traded on the exchange. While Nadex maintains segregated customer funds accounts as required by regulation, there is still a risk that Nadex may not be able to meet its obligations in extreme market conditions.

Regulatory and Legal Risk: Changes in laws, regulations, tax policies, or accounting practices could adversely affect trading on Nadex. Additionally, regulatory actions such as suspensions of trading could impact your ability to trade or liquidate positions.`
    },
    {
      id: "product-specific",
      title: "Product-Specific Risks",
      content: `Binary Options: Binary options settle at either 0 or 100, based on whether the underlying market meets specified criteria at expiration. This means that even if the market moves in your predicted direction, but not enough to cross the specified price level at expiration, you will lose your full investment.

Call Spreads: While call spreads allow for partial outcomes based on where the market settles within the range, if the market moves against your position and settles at or beyond the floor (for buy positions) or ceiling (for sell positions), you will lose your full investment.

Knock-Outs: Knock-outs have built-in liquidation levels. If the market reaches the ceiling or floor level at any time during the contract's lifetime, your position will be automatically closed at that level, potentially resulting in the maximum loss.

Each product has its own risk characteristics and may be more or less suitable depending on your trading objectives, experience, and risk tolerance.`
    },
    {
      id: "financial",
      title: "Financial Risks",
      content: `Trading Costs: While Nadex does not charge separate commission fees, there are costs built into the bid/ask spreads of contracts. These costs can impact your profitability over time, especially for frequent traders.

Leverage Risk: Some Nadex products, particularly knock-outs, involve leverage. While leverage can amplify profits, it can also amplify losses up to the full amount of your investment.

Overnight Positions: Holding positions overnight or over weekends exposes you to additional risks, including gaps in market prices between market close and market open, which could result in significant losses.

Funding Risks: You should only commit funds that you can afford to lose without affecting your lifestyle. The high degree of leverage that is often obtainable in derivative trading can work against you as well as for you due to fluctuations in the underlying markets.`
    },
    {
      id: "knowledge",
      title: "Knowledge and Experience Risks",
      content: `Trading Without Adequate Knowledge: Trading without sufficient knowledge of the markets, products, and trading strategies can significantly increase the risk of losses. It is important to thoroughly understand how Nadex products work before trading.

Complex Products: Some Nadex products are more complex than others and may require a higher level of understanding to trade effectively. You should ensure you fully understand the specifications and mechanics of any product you trade.

Trading Strategy Risks: No trading strategy can guarantee profits. Even strategies that have worked successfully in the past may not work in the future due to changing market conditions.`
    },
    {
      id: "emotional",
      title: "Psychological and Emotional Risks",
      content: `Emotional Trading: Trading can evoke strong emotions such as fear, greed, and excitement, which can lead to impulsive decisions and increased risk. It is important to maintain discipline and adhere to a well-thought-out trading plan.

Loss Aversion: The psychological impact of losses can lead to behaviors such as holding losing positions too long in the hope of recovery or taking excessive risks to recover losses. These behaviors can compound losses.

Overconfidence: Success in trading can lead to overconfidence and excessive risk-taking, which can ultimately result in significant losses.`
    },
    {
      id: "hypothetical",
      title: "Hypothetical Performance Disclaimer",
      content: `HYPOTHETICAL PERFORMANCE RESULTS HAVE MANY INHERENT LIMITATIONS, SOME OF WHICH ARE DESCRIBED BELOW. NO REPRESENTATION IS BEING MADE THAT ANY ACCOUNT WILL OR IS LIKELY TO ACHIEVE PROFITS OR LOSSES SIMILAR TO THOSE SHOWN. IN FACT, THERE ARE FREQUENTLY SHARP DIFFERENCES BETWEEN HYPOTHETICAL PERFORMANCE RESULTS AND THE ACTUAL RESULTS SUBSEQUENTLY ACHIEVED BY ANY PARTICULAR TRADING PROGRAM.

ONE OF THE LIMITATIONS OF HYPOTHETICAL PERFORMANCE RESULTS IS THAT THEY ARE GENERALLY PREPARED WITH THE BENEFIT OF HINDSIGHT. IN ADDITION, HYPOTHETICAL TRADING DOES NOT INVOLVE FINANCIAL RISK, AND NO HYPOTHETICAL TRADING RECORD CAN COMPLETELY ACCOUNT FOR THE IMPACT OF FINANCIAL RISK IN ACTUAL TRADING.

THERE ARE NUMEROUS OTHER FACTORS RELATED TO THE MARKETS IN GENERAL OR TO THE IMPLEMENTATION OF ANY SPECIFIC TRADING PROGRAM WHICH CANNOT BE FULLY ACCOUNTED FOR IN THE PREPARATION OF HYPOTHETICAL PERFORMANCE RESULTS AND ALL OF WHICH CAN ADVERSELY AFFECT ACTUAL TRADING RESULTS.`
    },
    {
      id: "risk-management",
      title: "Risk Management Strategies",
      content: `While trading involves inherent risks that cannot be eliminated, there are strategies you can employ to help manage these risks:

Diversification: Avoid concentrating your investments in a single market or product type. Diversification across different markets and product types can help spread risk.

Position Sizing: Limit the size of your positions relative to your overall account balance. A common guideline is to risk no more than 1-2% of your account on any single trade.

Use of Orders: Nadex allows you to place limit orders to enter positions at specific prices and to exit positions early. Using these order types can help manage risk by defining your entry and exit points in advance.

Education: Continuously educate yourself about the markets, products, and trading strategies. A better understanding can lead to more informed trading decisions.

Demo Trading: Before trading with real money, consider practicing on a demo account to familiarize yourself with the platform and test strategies without financial risk.

Emotional Discipline: Develop and follow a trading plan, and avoid making impulsive trading decisions based on emotions rather than analysis.`
    },
    {
      id: "conclusion",
      title: "Conclusion",
      content: `Trading derivative products on Nadex involves significant risks, including the potential loss of your entire investment. While Nadex products are designed with built-in risk limitations, you should only trade with capital you can afford to lose.

Before trading, you should fully understand the nature of the transactions you are entering into and the extent of your exposure to risk. If you are unsure about any aspect of trading, we recommend seeking independent financial advice.

By opening an account and trading on Nadex, you acknowledge that you have read and understood this Risk Disclosure Statement and accept the risks described herein.`
    },
  ];

  return (
    <PageLayout 
      title="Risk Disclosure" 
      subtitle="Important information about the risks of trading on Nadex"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Last updated: March 5, 2025</span>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-400 p-6 rounded-lg mb-8">
            <div className="flex items-start">
              <AlertTriangle className="text-yellow-600 mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-2 text-yellow-800">Trading Involves Significant Risk</h3>
                <p className="mb-0 text-yellow-700">
                  Derivative products trading is not suitable for all investors and involves the risk of loss. 
                  You should only trade with capital you can afford to lose. Past performance is not indicative of future results.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-bold mb-4 text-[#0033a0]">Contents</h3>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a 
                        href={`#${section.id}`} 
                        className="text-[#0033a0] hover:text-[#ff5900] flex items-center"
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        <span>{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 space-y-4">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                  >
                    <Link href="#" className="flex items-center justify-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Download PDF
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                  >
                    <Link href="/legal/terms">
                      Terms & Conditions
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                  >
                    <Link href="/legal/privacy">
                      Privacy Policy
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="space-y-8">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-8">
                    <h2 className="text-xl font-bold mb-4 text-[#0033a0]">{section.title}</h2>
                    <div className="prose prose-blue max-w-none">
                      {section.content.split('\n\n').map((paragraph, i) => {
                        if (paragraph.includes(':\n')) {
                          // Handle bullet points with titles
                          const [title, ...items] = paragraph.split('\n');
                          return (
                            <div key={i} className="mb-4">
                              <p className="font-bold">{title}</p>
                              <ul className="list-disc pl-5">
                                {items.map((item, j) => (
                                  <li key={j}>{item.trim()}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        }
                        
                        if (paragraph.toUpperCase() === paragraph && paragraph.length > 100) {
                          // Handle all caps paragraphs (disclaimers)
                          return (
                            <div key={i} className="bg-gray-100 p-4 border-l-4 border-yellow-500 mb-4">
                              <p className="text-gray-700 font-bold">{paragraph}</p>
                            </div>
                          );
                        }
                        
                        return <p key={i} className="mb-4">{paragraph}</p>;
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f5f5f5] rounded-lg p-8 mb-8">
          <div className="md:flex justify-between items-center">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h2 className="text-xl font-bold mb-2 text-[#0033a0]">Learn More About Trading Safely</h2>
              <p className="mb-0">
                Explore our educational resources to learn more about trading strategies and risk management techniques.
              </p>
            </div>
            <Button
              asChild
              className="bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold whitespace-nowrap"
            >
              <Link href="/learn/getting-started">View Educational Resources</Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions about risk disclosure?</h2>
          <p className="mb-6">Contact our support team for clarification or assistance.</p>
          <Button
            asChild
            className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold"
          >
            <Link href="/company/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}