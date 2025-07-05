import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check } from "lucide-react";

export default function Pricing() {
  const pricingFeatures = [
    {
      title: "No Commissions",
      description: "All costs are built into the price of the contract. What you see is what you pay.",
    },
    {
      title: "Low Minimum Trade Size",
      description: "Trade with as little as $1 per contract on binary options, providing flexibility for all account sizes.",
    },
    {
      title: "No Hidden Fees",
      description: "No overnight financing charges or additional platform fees. Just transparent pricing.",
    },
    {
      title: "Free Real-Time Data",
      description: "Access real-time price quotes and charts for all markets without additional data fees.",
    },
  ];

  const pricingPlans = [
    {
      name: "Standard Account",
      description: "Perfect for beginning to intermediate traders",
      price: "$250",
      features: [
        "Minimum opening deposit: $250",
        "Trade all available markets",
        "Full platform access",
        "Mobile trading app",
        "Free demo account",
        "Standard customer support",
      ],
      cta: "Open Standard Account",
    },
    {
      name: "Pro Account",
      description: "Enhanced features for active traders",
      price: "$5,000",
      features: [
        "Minimum opening deposit: $5,000",
        "All Standard features",
        "Priority customer support",
        "Advanced charting package",
        "Enhanced risk management tools",
        "Prioritized execution",
      ],
      cta: "Open Pro Account",
      highlight: true,
    },
  ];

  return (
    <PageLayout 
      title="Pricing" 
      subtitle="Transparent pricing with no hidden fees or commissions"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Transparent Fee Structure</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {pricingFeatures.map((feature, i) => (
              <div key={i} className="bg-[#f5f5f5] p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Account Types</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingPlans.map((plan, i) => (
              <div 
                key={i} 
                className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                  plan.highlight ? 'border-[#0033a0] ring-2 ring-[#0033a0] ring-opacity-30' : 'border-gray-200'
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#0033a0]">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-[#0033a0]">{plan.price}</div>
                  <p className="text-sm text-gray-500">minimum initial deposit</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  asChild
                  className={`w-full ${
                    plan.highlight 
                      ? 'bg-[#ff5900] hover:bg-opacity-90 text-white' 
                      : 'bg-[#0033a0] hover:bg-opacity-90 text-white'
                  }`}
                >
                  <Link href="#">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Trading Product Costs</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="border p-3 text-left">Product Type</th>
                  <th className="border p-3 text-center">Minimum Contract Size</th>
                  <th className="border p-3 text-center">Spreads/Costs</th>
                  <th className="border p-3 text-center">Overnight Fees</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">Binary Options</td>
                  <td className="border p-3 text-center">$1 per contract</td>
                  <td className="border p-3 text-center">Built into price</td>
                  <td className="border p-3 text-center">None</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Call Spreads</td>
                  <td className="border p-3 text-center">$5 per contract</td>
                  <td className="border p-3 text-center">Built into price</td>
                  <td className="border p-3 text-center">None</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Touch Brackets</td>
                  <td className="border p-3 text-center">$10 per contract</td>
                  <td className="border p-3 text-center">Built into price</td>
                  <td className="border p-3 text-center">None</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Knock-Outs</td>
                  <td className="border p-3 text-center">$10 per contract</td>
                  <td className="border p-3 text-center">Built into price</td>
                  <td className="border p-3 text-center">None</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Deposit and Withdrawal Fees</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="border p-3 text-left">Method</th>
                  <th className="border p-3 text-center">Deposit Fee</th>
                  <th className="border p-3 text-center">Withdrawal Fee</th>
                  <th className="border p-3 text-center">Processing Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">ACH Transfer</td>
                  <td className="border p-3 text-center">Free</td>
                  <td className="border p-3 text-center">Free</td>
                  <td className="border p-3 text-center">1-3 business days</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Debit Card</td>
                  <td className="border p-3 text-center">Free</td>
                  <td className="border p-3 text-center">N/A</td>
                  <td className="border p-3 text-center">Instant</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Wire Transfer</td>
                  <td className="border p-3 text-center">Free (bank may charge)</td>
                  <td className="border p-3 text-center">$25</td>
                  <td className="border p-3 text-center">1-2 business days</td>
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Check</td>
                  <td className="border p-3 text-center">Free</td>
                  <td className="border p-3 text-center">$25</td>
                  <td className="border p-3 text-center">5-7 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to open an account?</h2>
          <p className="mb-6">Get started today with our transparent pricing and limited risk products.</p>
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
            <Link href="/platform/funding">Learn About Funding</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}