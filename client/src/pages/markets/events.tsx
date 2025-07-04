import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight, Calendar } from "lucide-react";

export default function Events() {
  const cryptoEvents = [
    {
      name: "Bitcoin Halving",
      description: "Predict price movement around BTC reward halving",
      nextDate: "April 20, 2028",
      features: [
        "Major 4-year Bitcoin cycle event",
        "Historical market impact on all cryptocurrencies",
        "Binary options available before and after event",
        "Trade market expectations vs reality",
      ],
    },
    {
      name: "Ethereum Protocol Upgrades",
      description: "Predict ETH price moves around major upgrades",
      nextDate: "May 15, 2025",
      features: [
        "Scheduled network improvements",
        "Major impact on Ethereum ecosystem",
        "Binary options available before implementation",
        "Opportunity for short-term volatility trading",
      ],
    },
    {
      name: "Crypto Regulation Announcements",
      description: "Trade around major regulatory decisions",
      nextDate: "Varies by jurisdiction",
      features: [
        "SEC, CFTC, and global regulatory updates",
        "Significant crypto market impacts",
        "Trading options for multiple timeframes",
        "Binary options with tailored expiration",
      ],
    },
    {
      name: "Token Distribution Events",
      description: "Trade around major token unlocks and airdrops",
      nextDate: "Multiple events scheduled",
      features: [
        "Token unlock schedules for major protocols",
        "Vesting period completions for early investors",
        "Airdrop distributions to qualifying addresses",
        "Multiple contract durations available",
      ],
    },
  ];

  return (
    <PageLayout 
      title="Cryptocurrency Events" 
      subtitle="Trade major crypto events and announcements with limited risk"
      bgImage="https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-[#0033a0]">Trade Crypto Events on Nedaxer</h2>
          <p className="mb-4">
            Crypto event markets let you trade on the outcomes of important protocol upgrades, regulatory decisions, and network milestones. 
            On Nedaxer, you can position yourself before high-impact crypto events with binary options, 
            providing a unique way to trade digital asset developments with strictly limited risk.
          </p>
          <p className="mb-6">
            Cryptocurrency event trading offers specific opportunities to capitalize on scheduled protocol changes, 
            token distribution events, and regulatory developments that often cause significant price movements across the crypto ecosystem.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Benefits of Trading Crypto Events</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade crypto milestones directly</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Limited risk with predefined maximum loss</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Binary options based on event outcomes</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>No need for crypto wallets or exchanges</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">How Crypto Event Markets Work</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Contracts based on price thresholds following events</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade before, during and after crypto milestones</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Settlement based on official price feeds</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade market expectations vs actual impact</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Available Crypto Event Markets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cryptoEvents.map((event, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{event.name}</h3>
                <p className="text-gray-500 mb-2">{event.description}</p>
                <div className="flex items-center mb-4 text-sm text-[#0033a0]">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Next event: {event.nextDate}</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {event.features.map((feature, featIndex) => (
                    <li key={featIndex} className="flex items-start">
                      <Check className="text-[#ff5900] mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="#" 
                  className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center text-sm"
                >
                  View {event.name} details <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to trade Crypto Events?</h2>
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
            <Link href="/markets/events">View Crypto Event Calendar</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}