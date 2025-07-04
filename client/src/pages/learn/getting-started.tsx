import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Play, Info, Book, Award } from "lucide-react";

export default function GettingStarted() {
  const steps = [
    {
      title: "Step 1: Open an Account",
      description: "Register for a Nadex account by providing basic information and completing our identity verification process.",
      cta: "Open Account",
      ctaLink: "#",
    },
    {
      title: "Step 2: Fund Your Account",
      description: "Deposit funds using debit card, ACH transfer, or wire transfer. The minimum initial deposit is $250.",
      cta: "Learn About Funding",
      ctaLink: "/platform/funding",
    },
    {
      title: "Step 3: Choose a Market",
      description: "Select from forex, stock indices, commodities, or events markets, based on your interests and trading goals.",
      cta: "View Markets",
      ctaLink: "/markets/forex",
    },
    {
      title: "Step 4: Select a Product",
      description: "Choose from binary options, call spreads, or knock-outs based on your trading strategy and risk preferences.",
      cta: "Learn About Products",
      ctaLink: "/products/binary-options",
    },
    {
      title: "Step 5: Place Your Trade",
      description: "Enter your trade details, including size and direction (buy/sell), and confirm to place your first trade.",
      cta: "View Platform Features",
      ctaLink: "/platform/web-platform",
    },
  ];

  const tutorials = [
    {
      title: "Introduction to Nadex",
      description: "An overview of Nadex, our products, and how our exchange works.",
      duration: "5 min",
      image: "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
    },
    {
      title: "Understanding Binary Options",
      description: "Learn the basics of binary options and how to trade them on Nadex.",
      duration: "8 min",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
    },
    {
      title: "Navigating the Platform",
      description: "A tour of the Nadex trading platform and its key features.",
      duration: "7 min",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
    },
    {
      title: "Placing Your First Trade",
      description: "Step-by-step guide to placing your first trade on Nadex.",
      duration: "6 min",
      image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=180&q=80",
    },
  ];

  const resources = [
    {
      title: "Trading Guides",
      description: "Comprehensive guides covering all aspects of trading on Nadex.",
      icon: <Book className="h-8 w-8 text-[#0033a0]" />,
      link: "/learn/trading-guides",
    },
    {
      title: "Webinars",
      description: "Live and recorded educational webinars hosted by market experts.",
      icon: <Play className="h-8 w-8 text-[#0033a0]" />,
      link: "/learn/webinars",
    },
    {
      title: "Glossary",
      description: "Definitions of trading terms and concepts used on Nadex.",
      icon: <Info className="h-8 w-8 text-[#0033a0]" />,
      link: "#",
    },
    {
      title: "Demo Account",
      description: "Practice trading with virtual funds in a real market environment.",
      icon: <Award className="h-8 w-8 text-[#0033a0]" />,
      link: "#",
    },
  ];

  return (
    <PageLayout 
      title="Getting Started" 
      subtitle="Your guide to trading on Nadex - from account setup to your first trade"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Start Trading in 5 Easy Steps</h2>
          
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="md:flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{step.title}</h3>
                    <p className="text-gray-700 mb-4 md:mb-0">{step.description}</p>
                  </div>
                  <Button
                    asChild
                    className="bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold whitespace-nowrap"
                  >
                    <Link href={step.ctaLink}>{step.cta}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Video Tutorials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={tutorial.image} 
                    alt={tutorial.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white bg-opacity-80 rounded-full p-3">
                      <Play className="h-8 w-8 text-[#ff5900]" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    {tutorial.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-[#0033a0]">{tutorial.title}</h3>
                  <p className="text-gray-700 text-sm">{tutorial.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button
              asChild
              variant="outline"
              className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
            >
              <Link href="#">View All Tutorials</Link>
            </Button>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Understanding Nadex Products</h2>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Limited Risk Trading</h3>
            <p className="mb-4">
              All Nadex products are designed with limited risk characteristics, which means:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Your maximum possible loss is known before you enter a trade</li>
              <li>You can never lose more than the capital you commit to each trade</li>
              <li>There are no margin calls</li>
              <li>Your risk is limited to your initial cost or collateral</li>
            </ul>
            <p>
              This built-in risk limitation makes Nadex suitable for traders of all experience levels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Binary Options</h3>
              <p className="text-gray-700 mb-4">
                Simple yes/no contracts based on a specific market proposition. If you're right at expiration, you receive the full payout.
              </p>
              <Link 
                href="/products/binary-options" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Call Spreads</h3>
              <p className="text-gray-700 mb-4">
                Limited risk alternatives to traditional call options, with built-in floor and ceiling levels for defined risk parameters.
              </p>
              <Link 
                href="/products/call-spreads" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Knock-Outs</h3>
              <p className="text-gray-700 mb-4">
                Leveraged trading products with built-in risk management features, using predetermined floor and ceiling levels.
              </p>
              <Link 
                href="/products/knock-outs" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Educational Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, i) => (
              <div key={i} className="flex items-start p-6 bg-[#f5f5f5] rounded-lg">
                <div className="mr-4">{resource.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{resource.title}</h3>
                  <p className="text-gray-700 mb-3">{resource.description}</p>
                  <Link 
                    href={resource.link} 
                    className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                  >
                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">What is the minimum deposit to open an account?</h3>
              <p className="text-gray-700">
                The minimum initial deposit to open a Nadex account is $250. After your account is open, there is no minimum for subsequent deposits.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">How long does account approval take?</h3>
              <p className="text-gray-700">
                Most accounts are approved within 1-2 business days after all required documentation is submitted. You'll receive an email notification once your account is approved.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">What documentation is required to open an account?</h3>
              <p className="text-gray-700">
                To comply with regulatory requirements, you'll need to provide proof of identity (government-issued photo ID) and proof of residence (utility bill, bank statement, etc.). Additional documentation may be required in some cases.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Can I practice trading before risking real money?</h3>
              <p className="text-gray-700">
                Yes, Nadex offers a demo account with virtual funds that allows you to practice trading in a real market environment without risking actual money. This is a great way to familiarize yourself with our platform and products.
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="#" 
              className="text-[#0033a0] hover:text-[#ff5900] font-semibold inline-flex items-center"
            >
              View More FAQs
            </Link>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start trading?</h2>
          <p className="mb-6">Open an account today and experience limited-risk trading on a regulated US exchange.</p>
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