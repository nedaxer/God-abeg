import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, ArrowRight, Newspaper, FileText, Award } from "lucide-react";

export default function News() {
  const newsItems = [
    {
      id: 1,
      title: "Nedaxer Introduces Cryptocurrency Trading Features",
      date: "April 2, 2025",
      excerpt: "Nedaxer has released a major update to its trading platform, introducing advanced crypto charting capabilities, real-time blockchain data, and enhanced trading tools for digital assets.",
      category: "Product Update",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 2,
      title: "Nedaxer Adds New Cryptocurrency Technical Indicators",
      date: "March 15, 2025",
      excerpt: "Traders now have access to specialized indicators for cryptocurrencies, including Realized Price, MVRV, Funding Rates, and other on-chain metrics to make informed trading decisions.",
      category: "Platform Enhancement",
      image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 3,
      title: "Nedaxer Reports Record Crypto Trading Volume in Q1 2025",
      date: "March 10, 2025",
      excerpt: "Nedaxer has reported record trading volumes for the first quarter of 2025, with significant growth in cryptocurrency products, particularly in Bitcoin and Ethereum markets.",
      category: "Company News",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 4,
      title: "Nedaxer Launches Crypto Trading Academy",
      date: "February 28, 2025",
      excerpt: "Nedaxer has expanded its educational offerings with a dedicated Cryptocurrency Trading Academy covering blockchain fundamentals, technical analysis for digital assets, and risk management.",
      category: "Education",
      image: "https://images.unsplash.com/photo-1639322537133-5fcead339c5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 5,
      title: "Nedaxer Enhances Crypto Security Features",
      date: "February 15, 2025",
      excerpt: "New security enhancements have been implemented for cryptocurrency trading on Nedaxer, including advanced verification systems and real-time monitoring for enhanced trader protection.",
      category: "Security Update",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 6,
      title: "Nedaxer to Host Annual Crypto Trading Summit",
      date: "January 25, 2025",
      excerpt: "Nedaxer has announced dates for its annual Cryptocurrency Trading Summit, bringing together digital asset traders, blockchain experts, and industry leaders for educational sessions.",
      category: "Event",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
  ];

  const pressReleases = [
    {
      title: "Nedaxer Announces Strategic Partnership with Blockchain Data Provider",
      date: "March 20, 2025",
      link: "#",
    },
    {
      title: "Nedaxer Receives Industry Award for Crypto Trading Innovation",
      date: "February 5, 2025",
      link: "#",
    },
    {
      title: "Nedaxer Appoints New Head of Cryptocurrency Markets",
      date: "January 12, 2025",
      link: "#",
    },
  ];



  return (
    <PageLayout 
      title="Crypto News & Updates" 
      subtitle="The latest cryptocurrency news, events, and announcements from Nedaxer"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Latest Crypto News</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Featured News Item */}
            <div className="col-span-1 md:col-span-2">
              <div className="bg-[#f5f5f5] rounded-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={newsItems[0].image} 
                      alt={newsItems[0].title} 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-1/2">
                    <div className="flex items-center mb-2">
                      <span className="bg-[#0033a0] text-white text-xs px-2 py-1 rounded-full">{newsItems[0].category}</span>
                      <div className="flex items-center ml-3 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{newsItems[0].date}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-[#0033a0]">{newsItems[0].title}</h3>
                    <p className="text-gray-700 mb-4">{newsItems[0].excerpt}</p>
                    <Link 
                      href="#" 
                      className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                    >
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Other News Items */}
            {newsItems.slice(1).map((news) => (
              <div key={news.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="bg-[#0033a0] text-white text-xs px-2 py-1 rounded-full">{news.category}</span>
                    <div className="flex items-center ml-3 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{news.date}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#0033a0]">{news.title}</h3>
                  <p className="text-gray-700 mb-4">{news.excerpt}</p>
                  <Link 
                    href="#" 
                    className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                  >
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              asChild
              className="bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold px-6 py-2"
            >
              <Link href="#">View All Crypto News</Link>
            </Button>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Crypto Press Releases</h2>
          
          <div className="space-y-4 mb-8">
            {pressReleases.map((release, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <FileText className="text-[#0033a0] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
                  <div>
                    <div className="flex items-center mb-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{release.date}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-[#0033a0]">{release.title}</h3>
                    <Link 
                      href={release.link} 
                      className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center text-sm"
                    >
                      Download Press Release <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="#" 
              className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center justify-center"
            >
              View All Crypto Press Releases <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Cryptocurrency Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Newspaper className="text-[#0033a0] h-8 w-8 mr-3" />
                <h3 className="text-xl font-bold text-[#0033a0]">Crypto Market Reports</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Download weekly and monthly cryptocurrency market reports, trend analysis, and blockchain data insights.
              </p>
              <Link 
                href="#" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                Download Market Reports <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Award className="text-[#0033a0] h-8 w-8 mr-3" />
                <h3 className="text-xl font-bold text-[#0033a0]">Crypto Trading Guides</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Comprehensive guides to trading cryptocurrencies with limited risk products, technical analysis, and strategy development.
              </p>
              <Link 
                href="#" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                View Trading Guides <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <FileText className="text-[#0033a0] h-8 w-8 mr-3" />
                <h3 className="text-xl font-bold text-[#0033a0]">Blockchain Research</h3>
              </div>
              <p className="text-gray-700 mb-4">
                In-depth research and analysis on blockchain technology, cryptocurrency markets, and emerging digital asset trends.
              </p>
              <Link 
                href="#" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                Browse Research Papers <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        


        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated with Crypto Market Insights</h2>
          <p className="mb-6">Subscribe to our newsletter to receive the latest cryptocurrency news, market analysis, and trading opportunities.</p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow px-4 py-3 rounded-md focus:outline-none"
              />
              <Button
                className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold px-6 py-3"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}