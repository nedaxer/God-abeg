import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Check, Calendar, Clock, Bell, Zap } from "lucide-react";

export default function CryptoEvents() {
  const upcomingEvents = [
    {
      date: "June 2025",
      name: "Ethereum Cancun-Deneb Upgrade",
      description: "Major Ethereum network upgrade implementing new EIPs and protocol improvements",
      impact: "High",
      category: "Protocol Upgrade"
    },
    {
      date: "July 2025",
      name: "Bitcoin Halving",
      description: "Reduction of Bitcoin block rewards from 3.125 to 1.5625 BTC",
      impact: "Very High",
      category: "Supply Event"
    },
    {
      date: "August 2025",
      name: "SEC Bitcoin ETF Decision",
      description: "Regulatory decision on spot Bitcoin ETF applications",
      impact: "High",
      category: "Regulatory"
    },
    {
      date: "September 2025",
      name: "Cardano Hydra Upgrade",
      description: "Cardano layer 2 scaling solution implementation",
      impact: "Medium",
      category: "Protocol Upgrade"
    }
  ];

  const tradingStrategies = [
    {
      name: "Pre-Event Positioning",
      description: "Take positions before major cryptocurrency events based on anticipated market reaction",
      steps: [
        "Research upcoming events and their potential impact",
        "Position 3-7 days before the event",
        "Set limited risk parameters appropriate to event magnitude",
        "Consider multiple scenarios and potential price reactions"
      ]
    },
    {
      name: "Event Volatility Trading",
      description: "Capitalize on increased volatility during cryptocurrency events using short-term binary options",
      steps: [
        "Focus on high-impact events likely to cause significant price movement",
        "Use binary options with short expirations during the event",
        "Multiple small positions may be preferable to single large positions",
        "Be prepared for rapid price changes and reversals"
      ]
    },
    {
      name: "Post-Event Trend Following",
      description: "Follow the established trend after the initial volatility of an event has settled",
      steps: [
        "Wait for initial volatility to subside (typically 12-24 hours)",
        "Identify the post-event trend direction",
        "Use call spreads or touch brackets for medium-term positioning",
        "Set profit targets based on the magnitude of the event"
      ]
    }
  ];

  const eventCategories = [
    {
      name: "Protocol Upgrades",
      description: "Major network updates, hard forks, and technical improvements",
      examples: ["Ethereum Shanghai Fork", "Bitcoin Taproot Activation", "Solana Network Upgrades"],
      icon: <Zap className="h-10 w-10 text-[#ff5900]" />
    },
    {
      name: "Regulatory Developments",
      description: "Government decisions, regulations, and legal developments affecting cryptocurrencies",
      examples: ["SEC Rulings", "CFTC Guidelines", "International Regulatory Frameworks"],
      icon: <Bell className="h-10 w-10 text-[#ff5900]" />
    },
    {
      name: "Tokenomic Events",
      description: "Events affecting cryptocurrency supply, demand, and distribution",
      examples: ["Bitcoin Halving", "Token Burns", "Unlock Events", "Major ICOs/STOs"],
      icon: <Calendar className="h-10 w-10 text-[#ff5900]" />
    },
    {
      name: "Market Structure Events",
      description: "Changes to how cryptocurrencies are traded and accessed",
      examples: ["Major Exchange Listings", "ETF Approvals", "New Derivatives Products"],
      icon: <Clock className="h-10 w-10 text-[#ff5900]" />
    }
  ];

  return (
    <PageLayout 
      title="Cryptocurrency Events" 
      subtitle="Trade major crypto market events with limited risk on the Nedaxer platform"
      bgImage="https://images.unsplash.com/photo-1639322377433-54290e27a42a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Crypto Event Trading on Nedaxer</h2>
          <p className="mb-4">
            Cryptocurrency markets are heavily influenced by scheduled events, protocol upgrades, 
            regulatory decisions, and other significant developments. On Nedaxer, you can trade 
            these crypto events with limited-risk products designed to help you capitalize on 
            price movements before, during, and after major market events.
          </p>
          <p className="mb-6">
            Our event-based trading products allow you to position yourself for anticipated 
            market reactions while maintaining strict risk parameters, giving you the confidence 
            to trade during periods of heightened volatility and uncertainty.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Event Trading Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade market-moving cryptocurrency events with defined risk</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Position for anticipated market reactions to scheduled events</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Multiple trading products to suit your event trading strategy</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Capitalize on heightened market volatility during events</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Stay informed with our crypto event calendar and analysis</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Event Trading Opportunities</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Protocol upgrades and network improvements</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Regulatory decisions and announcements</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Supply events like Bitcoin halvings and token burns</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Major exchange listings and token distributions</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Project milestones and development announcements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Upcoming Crypto Events</h2>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0033a0] text-white">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Event</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Potential Impact</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map((event, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-3 px-4 border-b border-gray-200 font-medium">{event.date}</td>
                    <td className="py-3 px-4 border-b border-gray-200">
                      <div className="font-medium text-[#0033a0]">{event.name}</div>
                      <div className="text-sm text-gray-600">{event.description}</div>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200">{event.category}</td>
                    <td className="py-3 px-4 border-b border-gray-200">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        event.impact === "Very High" ? "bg-red-100 text-red-800" :
                        event.impact === "High" ? "bg-orange-100 text-orange-800" :
                        event.impact === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {event.impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
            >
              <Link href="#">View Full Event Calendar</Link>
            </Button>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Event Trading Strategies</h2>
          
          <div className="space-y-6">
            {tradingStrategies.map((strategy, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{strategy.name}</h3>
                <p className="text-gray-700 mb-4">{strategy.description}</p>
                <h4 className="font-semibold text-gray-800 mb-2">Implementation Steps:</h4>
                <ul className="space-y-1 mb-4">
                  {strategy.steps.map((step, j) => (
                    <li key={j} className="flex items-start">
                      <Check className="text-[#ff5900] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="#" 
                  className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                >
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Types of Crypto Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventCategories.map((category, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col">
                <div className="mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{category.name}</h3>
                <p className="text-gray-700 mb-4">{category.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Examples:</h4>
                  <ul className="space-y-1">
                    {category.examples.map((example, j) => (
                      <li key={j} className="flex items-start">
                        <ArrowRight className="text-[#ff5900] mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-gray-700">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <div className="bg-gradient-to-r from-[#0033a0] via-[#002680] to-[#001a60] text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Trade Cryptocurrency Events Today</h2>
            <p className="mb-6">Open an account and start trading crypto market events with limited risk.</p>
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
              <Link href="#">View Event Calendar</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}