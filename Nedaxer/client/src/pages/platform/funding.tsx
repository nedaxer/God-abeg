import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, ArrowRight, CreditCard, Landmark, Calendar, Clock } from "lucide-react";

export default function Funding() {
  const fundingMethods = [
    {
      title: "Debit Card",
      description: "Fund your account instantly using a debit card for immediate trading access.",
      icon: <CreditCard className="h-10 w-10 text-[#0033a0]" />,
      benefits: [
        "Instant funding",
        "No deposit fees",
        "Visa, MasterCard, and Discover accepted",
        "Secure processing",
      ],
    },
    {
      title: "ACH Transfer",
      description: "Link your bank account for easy electronic transfers into your trading account.",
      icon: <Landmark className="h-10 w-10 text-[#0033a0]" />,
      benefits: [
        "No deposit fees",
        "Funds typically available in 1-3 business days",
        "Convenient recurring deposits",
        "Maximum deposit: $50,000 per transaction",
      ],
    },
    {
      title: "Wire Transfer",
      description: "Use wire transfers for larger deposits or when immediate availability is required.",
      icon: <Calendar className="h-10 w-10 text-[#0033a0]" />,
      benefits: [
        "No deposit fees from Nadex (bank may charge)",
        "Funds typically available same day if received before 2 PM ET",
        "No maximum deposit limit",
        "Ideal for large deposits",
      ],
    },
    {
      title: "Check",
      description: "Mail a check to our processing center for deposit into your trading account.",
      icon: <Clock className="h-10 w-10 text-[#0033a0]" />,
      benefits: [
        "No deposit fees",
        "Funds typically available in 5-7 business days after receipt",
        "Personal and cashier's checks accepted",
        "Mail to our secure processing center",
      ],
    },
  ];

  const withdrawalOptions = [
    {
      method: "ACH Transfer",
      fee: "Free",
      processingTime: "1-3 business days",
      minimumAmount: "$10",
      maximumAmount: "$50,000 per transaction",
    },
    {
      method: "Wire Transfer",
      fee: "$25",
      processingTime: "Same day if requested before 12 PM ET",
      minimumAmount: "$100",
      maximumAmount: "No limit",
    },
    {
      method: "Check",
      fee: "$25",
      processingTime: "5-7 business days for delivery",
      minimumAmount: "$50",
      maximumAmount: "No limit",
    },
  ];

  return (
    <PageLayout 
      title="Account Funding" 
      subtitle="Secure and convenient methods to fund your trading account"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Funding Options</h2>
          
          <p className="mb-6">
            Nadex offers several secure and convenient methods to fund your trading account. 
            Choose the option that best fits your needs, with most methods providing same-day or next-day availability.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {fundingMethods.map((method, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="mr-4">{method.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{method.title}</h3>
                    <p className="text-gray-700">{method.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {method.benefits.map((benefit, bIndex) => (
                    <li key={bIndex} className="flex items-start">
                      <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Withdrawal Options</h2>
          
          <p className="mb-6">
            Withdraw funds from your Nadex account quickly and securely using the following methods. 
            Withdrawals are processed during regular business hours, Monday through Friday.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f5f5f5]">
                  <th className="border p-3 text-left">Method</th>
                  <th className="border p-3 text-center">Fee</th>
                  <th className="border p-3 text-center">Processing Time</th>
                  <th className="border p-3 text-center">Minimum</th>
                  <th className="border p-3 text-center">Maximum</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalOptions.map((option, i) => (
                  <tr key={i}>
                    <td className="border p-3 font-medium">{option.method}</td>
                    <td className="border p-3 text-center">{option.fee}</td>
                    <td className="border p-3 text-center">{option.processingTime}</td>
                    <td className="border p-3 text-center">{option.minimumAmount}</td>
                    <td className="border p-3 text-center">{option.maximumAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Funding FAQs</h2>
          
          <div className="space-y-6">
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">How long does it take for deposits to be available?</h3>
              <p>
                Debit card deposits are typically available immediately. ACH transfers usually take 1-3 business days. 
                Wire transfers received before 2 PM ET are generally available same day. Check deposits take 5-7 business days after receipt.
              </p>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Are there any deposit fees?</h3>
              <p>
                Nadex does not charge any fees for deposits. However, your bank may charge fees for wire transfers or other services.
              </p>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">What is the minimum deposit?</h3>
              <p>
                The minimum initial deposit to open a Nadex account is $250. After your account is open, there is no minimum for subsequent deposits.
              </p>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">How do I request a withdrawal?</h3>
              <p>
                Log in to your Nadex account, go to the Account section, and select "Withdraw Funds." 
                Follow the prompts to select your withdrawal method and amount.
              </p>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Can I withdraw to a different bank account than the one I used to deposit?</h3>
              <p>
                For security and regulatory purposes, withdrawals must generally be returned to the original funding source. 
                If you need to withdraw to a different account, please contact our customer support for assistance.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Account Types</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Standard Account</h3>
              <p className="mb-4">Perfect for beginning to intermediate traders.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Minimum opening deposit: $250</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade all available markets</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Full platform access</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Standard customer support</span>
                </li>
              </ul>
              <Button 
                asChild
                className="w-full bg-[#0033a0] hover:bg-opacity-90 text-white"
              >
                <Link href="#">Open Standard Account</Link>
              </Button>
            </div>
            
            <div className="border border-[#0033a0] ring-2 ring-[#0033a0] ring-opacity-30 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Pro Account</h3>
              <p className="mb-4">Enhanced features for active traders.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Minimum opening deposit: $5,000</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>All Standard features</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Advanced charting package</span>
                </li>
              </ul>
              <Button 
                asChild
                className="w-full bg-[#ff5900] hover:bg-opacity-90 text-white"
              >
                <Link href="#">Open Pro Account</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start trading?</h2>
          <p className="mb-6">Open an account today with as little as $250.</p>
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
            <Link href="/products/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}