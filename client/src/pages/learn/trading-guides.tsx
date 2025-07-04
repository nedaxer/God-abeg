import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Clock, BarChart2, Tag, Search, ChevronDown } from "lucide-react";

export default function TradingGuides() {
  const featuredGuides = [
    {
      id: 1,
      title: "The Complete Guide to Binary Options Trading",
      description: "A comprehensive introduction to binary options trading on Web Trading Platform, covering basic concepts, strategies, and risk management.",
      category: "Product Guides",
      level: "Beginner",
      readTime: "20 min",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
      link: "/learn/guide/binary-options-guide",
    },
    {
      id: 2,
      title: "Technical Analysis Fundamentals for Web Trading Platform Traders",
      description: "Learn how to apply technical analysis to identify trading opportunities across all Web Trading Platform products.",
      category: "Technical Analysis",
      level: "Intermediate",
      readTime: "25 min",
      image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
      link: "/learn/guide/technical-analysis-fundamentals",
    },
    {
      id: 3,
      title: "Trading Forex with Limited Risk on Web Trading Platform",
      description: "Strategies and techniques for trading major and minor currency pairs with binary options and call spreads.",
      category: "Market Guides",
      level: "Intermediate",
      readTime: "15 min",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
      link: "/learn/guide/forex-trading",
    },
  ];

  const beginnerGuides = [
    {
      id: 101,
      title: "Introduction to Web Trading Platform",
      description: "An overview of Web Trading Platform, its products, and how our exchange works.",
      category: "Getting Started",
      readTime: "10 min",
    },
    {
      id: 102,
      title: "Understanding Binary Options",
      description: "Learn the basics of binary options, including pricing, expiration, and settlement.",
      category: "Product Guides",
      readTime: "15 min",
    },
    {
      id: 103,
      title: "Getting Started with Call Spreads",
      description: "An introduction to Nadex Call Spreads and how they differ from binary options.",
      category: "Product Guides",
      readTime: "12 min",
    },
    {
      id: 104,
      title: "Nedaxer Platform Tutorial",
      description: "A step-by-step guide to navigating and using the Nedaxer trading platform.",
      category: "Platform",
      readTime: "20 min",
    },
  ];

  const intermediateGuides = [
    {
      id: 201,
      title: "Support and Resistance Trading",
      description: "How to identify and trade key support and resistance levels using Nadex products.",
      category: "Technical Analysis",
      readTime: "18 min",
    },
    {
      id: 202,
      title: "Trading with Moving Averages",
      description: "Using moving averages to identify trends and generate trading signals for binary options and call spreads.",
      category: "Technical Analysis",
      readTime: "20 min",
    },
    {
      id: 203,
      title: "News Trading Strategies",
      description: "Techniques for trading economic data releases and other market-moving events on Nadex.",
      category: "Trading Strategies",
      readTime: "15 min",
    },
    {
      id: 204,
      title: "Risk Management Essentials",
      description: "Core risk management principles for successful trading on Nadex.",
      category: "Trading Fundamentals",
      readTime: "22 min",
    },
  ];

  const categories = [
    "Getting Started",
    "Product Guides",
    "Market Guides",
    "Technical Analysis",
    "Trading Strategies",
    "Platform",
    "Risk Management",
  ];

  return (
    <PageLayout 
      title="Trading Guides" 
      subtitle="Comprehensive guides to help you master trading on Nadex"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="bg-[#f5f5f5] p-6 rounded-lg mb-8">
            <div className="md:flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4 md:mb-0 text-[#0033a0]">Find Trading Guides</h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search guides..."
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0033a0]"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <div className="font-semibold mb-2">Filter by Category:</div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, i) => (
                  <button 
                    key={i}
                    className="bg-white hover:bg-[#0033a0] hover:text-white text-[#0033a0] text-sm px-3 py-1 rounded-full border border-[#0033a0] transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="font-semibold mb-2">Filter by Level:</div>
              <div className="flex flex-wrap gap-2">
                <button className="bg-white hover:bg-[#0033a0] hover:text-white text-[#0033a0] text-sm px-3 py-1 rounded-full border border-[#0033a0] transition-colors">
                  Beginner
                </button>
                <button className="bg-white hover:bg-[#0033a0] hover:text-white text-[#0033a0] text-sm px-3 py-1 rounded-full border border-[#0033a0] transition-colors">
                  Intermediate
                </button>
                <button className="bg-white hover:bg-[#0033a0] hover:text-white text-[#0033a0] text-sm px-3 py-1 rounded-full border border-[#0033a0] transition-colors">
                  Advanced
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Featured Guides</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredGuides.map((guide) => (
              <div key={guide.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={guide.image} 
                  alt={guide.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-[#e6eef9] text-[#0033a0] text-xs px-2 py-1 rounded-full">
                      {guide.category}
                    </span>
                    <span className="bg-[#e6eef9] text-[#0033a0] text-xs px-2 py-1 rounded-full">
                      {guide.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#0033a0]">{guide.title}</h3>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{guide.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{guide.readTime}</span>
                    </div>
                    <Link 
                      href={guide.link} 
                      className="text-[#0033a0] hover:text-[#ff5900] text-sm font-semibold flex items-center"
                    >
                      Read Guide <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0033a0]">Beginner Guides</h2>
            <Button
              asChild
              variant="outline"
              className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white text-sm"
            >
              <Link href="#">View All Beginner Guides</Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            {beginnerGuides.map((guide) => (
              <div key={guide.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="md:flex justify-between items-center">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="bg-[#e6eef9] text-[#0033a0] text-xs px-2 py-1 rounded-full flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {guide.category}
                      </span>
                      <span className="flex items-center ml-3 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {guide.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-[#0033a0]">{guide.title}</h3>
                    <p className="text-gray-700 mb-0 md:pr-8">{guide.description}</p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 md:flex-shrink-0">
                    <Button
                      asChild
                      className="bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold whitespace-nowrap"
                    >
                      <Link href="#">Read Guide</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0033a0]">Intermediate Guides</h2>
            <Button
              asChild
              variant="outline"
              className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white text-sm"
            >
              <Link href="#">View All Intermediate Guides</Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            {intermediateGuides.map((guide) => (
              <div key={guide.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="md:flex justify-between items-center">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="bg-[#e6eef9] text-[#0033a0] text-xs px-2 py-1 rounded-full flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {guide.category}
                      </span>
                      <span className="flex items-center ml-3 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {guide.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-[#0033a0]">{guide.title}</h3>
                    <p className="text-gray-700 mb-0 md:pr-8">{guide.description}</p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 md:flex-shrink-0">
                    <Button
                      asChild
                      className="bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold whitespace-nowrap"
                    >
                      <Link href="#">Read Guide</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Guide Collections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-4">
                <BookOpen className="text-[#0033a0] mt-1 mr-3 h-8 w-8 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Binary Options Mastery</h3>
                  <p className="text-gray-700 mb-3">
                    A comprehensive collection of guides covering all aspects of binary options trading on Nadex.
                  </p>
                  <div className="text-sm text-gray-500 mb-4">5 guides • Beginner to Intermediate</div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                  >
                    <Link href="#">View Collection</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-4">
                <BarChart2 className="text-[#0033a0] mt-1 mr-3 h-8 w-8 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#0033a0]">Technical Analysis Fundamentals</h3>
                  <p className="text-gray-700 mb-3">
                    Learn the essential technical analysis tools and techniques for effective trading on Nadex.
                  </p>
                  <div className="text-sm text-gray-500 mb-4">7 guides • All Levels</div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                  >
                    <Link href="#">View Collection</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button className="w-full p-5 text-left flex justify-between items-center font-bold text-[#0033a0]">
                How do I access the trading guides?
                <ChevronDown className="h-5 w-5" />
              </button>
              <div className="p-5 border-t border-gray-200 bg-gray-50">
                <p className="text-gray-700">
                  All trading guides are freely available on our website. Simply browse the guides section, 
                  filter by category or level if needed, and click on any guide to read it. No login is required 
                  to access basic and intermediate guides. However, some advanced guides and collections may 
                  be available exclusively to Nadex account holders.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button className="w-full p-5 text-left flex justify-between items-center font-bold text-[#0033a0]">
                Can I download the guides for offline reading?
                <ChevronDown className="h-5 w-5" />
              </button>
              <div className="p-5 border-t border-gray-200 bg-gray-50">
                <p className="text-gray-700">
                  Yes, most guides offer a downloadable PDF version for offline reading. Look for the download 
                  button at the top or bottom of each guide. Nadex account holders have access to download all guides, 
                  while non-members may have limited download access.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button className="w-full p-5 text-left flex justify-between items-center font-bold text-[#0033a0]">
                How often are new guides added?
                <ChevronDown className="h-5 w-5" />
              </button>
              <div className="p-5 border-t border-gray-200 bg-gray-50">
                <p className="text-gray-700">
                  We regularly update our content library with new guides and resources. Typically, we add 
                  new content on a monthly basis, focusing on market developments, trading strategies, and 
                  educational topics requested by our community. Subscribe to our newsletter to stay informed 
                  about new content releases.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Put Your Knowledge into Practice</h2>
          <p className="mb-6">Open an account today and apply what you've learned with limited-risk trading on Nadex.</p>
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