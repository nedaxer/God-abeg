import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Clock, User, Tag, Play, ArrowRight, Download } from "lucide-react";

export default function Webinars() {
  const upcomingWebinars = [
    {
      id: 1,
      title: "Introduction to Crypto Binary Options Trading",
      description: "A comprehensive overview of binary options and how to trade them effectively on Nedaxer's cryptocurrency platform.",
      presenter: "John Smith, Senior Crypto Analyst",
      date: "April 20, 2025",
      time: "2:00 PM ET",
      tags: ["Beginner", "Crypto Trading", "Binary Options"],
      image: "https://images.unsplash.com/photo-1625631242780-3950f6bd4127?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 2,
      title: "Crypto Technical Analysis for Nedaxer Traders",
      description: "Learn how to apply technical analysis to identify high-probability cryptocurrency trading opportunities on Nedaxer.",
      presenter: "Sarah Johnson, Crypto Education Specialist",
      date: "April 27, 2025",
      time: "2:00 PM ET",
      tags: ["Intermediate", "Technical Analysis", "Cryptocurrency"],
      image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 3,
      title: "Trading Crypto Market Events",
      description: "Strategies for trading major crypto announcements and blockchain events using Nedaxer binary options and call spreads.",
      presenter: "Michael Williams, Blockchain Strategist",
      date: "May 4, 2025",
      time: "2:00 PM ET",
      tags: ["Intermediate", "Crypto News Trading", "Blockchain"],
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
  ];

  const recordedWebinars = [
    {
      id: 101,
      title: "Cryptocurrency Trading Fundamentals",
      description: "Learn the essential knowledge and strategies for successful cryptocurrency trading on Nedaxer platform.",
      presenter: "Alex Chen, Crypto Market Specialist",
      date: "March 22, 2025",
      duration: "60 min",
      tags: ["Beginner", "Cryptocurrency"],
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 102,
      title: "Bitcoin Trading Strategies",
      description: "Advanced strategies for trading Bitcoin using Nedaxer's limited-risk products and technical analysis.",
      presenter: "Maya Johnson, Bitcoin Analyst",
      date: "March 18, 2025",
      duration: "55 min",
      tags: ["Intermediate", "Bitcoin", "Cryptocurrency"],
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 103,
      title: "Mastering Knock-Outs: Advanced Strategies",
      description: "Advanced trading techniques using Nedaxer Knock-Outs for directional trading with built-in risk management.",
      presenter: "Robert Davis, Senior Trading Educator",
      date: "March 15, 2025",
      duration: "45 min",
      tags: ["Advanced", "Knock-Outs"],
      image: "https://images.unsplash.com/photo-1535320394760-08bdd975da9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 102,
      title: "Call Spreads: Trading Market Direction",
      description: "How to use Nedaxer Call Spreads to trade market direction with limited risk and defined profit potential.",
      presenter: "Jennifer Lee, Product Specialist",
      date: "March 8, 2025",
      duration: "50 min",
      tags: ["Intermediate", "Call Spreads"],
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 103,
      title: "Risk Management for Retail Traders",
      description: "Essential risk management principles and practices for successful trading on Nedaxer.",
      presenter: "David Thompson, Chief Market Analyst",
      date: "March 1, 2025",
      duration: "55 min",
      tags: ["All Levels", "Risk Management"],
      image: "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
    {
      id: 104,
      title: "Trading Forex on Nedaxer",
      description: "Strategies and techniques for trading major and minor currency pairs using Nedaxer products.",
      presenter: "Emily Chen, Forex Specialist",
      date: "February 22, 2025",
      duration: "60 min",
      tags: ["Intermediate", "Forex"],
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    },
  ];

  const webinarSeries = [
    {
      title: "Binary Options Mastery",
      description: "A comprehensive 4-part series covering all aspects of binary options trading on Nedaxer.",
      episodes: 4,
      level: "Beginner to Intermediate",
    },
    {
      title: "Technical Analysis Fundamentals",
      description: "Learn the essential technical analysis tools and techniques for effective trading on Nedaxer.",
      episodes: 6,
      level: "All Levels",
    },
    {
      title: "Advanced Trading Strategies",
      description: "Explore sophisticated trading approaches across all Nedaxer products and markets.",
      episodes: 5,
      level: "Intermediate to Advanced",
    },
  ];

  return (
    <PageLayout 
      title="Crypto Webinars" 
      subtitle="Live and recorded educational sessions hosted by Nedaxer market experts"
      bgColor="#0033a0"
      bgImage="https://images.unsplash.com/photo-1642104704074-907c0698cbd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Upcoming Live Webinars</h2>
          
          <div className="space-y-6 mb-8">
            {upcomingWebinars.map((webinar) => (
              <div key={webinar.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={webinar.image} 
                      alt={webinar.title} 
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {webinar.tags.map((tag, i) => (
                        <span key={i} className="bg-[#e6eef9] text-[#0033a0] text-xs px-2 py-1 rounded-full flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{webinar.title}</h3>
                    <p className="text-gray-700 mb-4">{webinar.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-2" />
                        <span>{webinar.presenter}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{webinar.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{webinar.time}</span>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="bg-[#0033a0] hover:bg-opacity-90 text-white font-semibold"
                    >
                      <Link href="#">Register Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="#" 
              className="text-[#0033a0] hover:text-[#ff5900] font-semibold inline-flex items-center"
            >
              View Full Webinar Schedule <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Recorded Webinars</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {recordedWebinars.map((webinar) => (
              <div key={webinar.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={webinar.image} 
                    alt={webinar.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white bg-opacity-80 rounded-full p-3">
                      <Play className="h-8 w-8 text-[#ff5900]" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    {webinar.duration}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {webinar.tags.map((tag, i) => (
                      <span key={i} className="bg-[#e6eef9] text-[#0033a0] text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#0033a0]">{webinar.title}</h3>
                  <p className="text-gray-700 text-sm mb-3">{webinar.description}</p>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      <span>{webinar.presenter}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{webinar.date}</span>
                    </div>
                  </div>
                  <Link 
                    href="#" 
                    className="text-[#0033a0] hover:text-[#ff5900] text-sm font-semibold flex items-center"
                  >
                    Watch Webinar <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
            >
              <Link href="#">View All Recorded Webinars</Link>
            </Button>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Webinar Series</h2>
          
          <div className="space-y-6">
            {webinarSeries.map((series, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{series.title}</h3>
                <p className="text-gray-700 mb-3">{series.description}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Play className="h-4 w-4 mr-1" />
                    <span>{series.episodes} Episodes</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span>{series.level}</span>
                  </div>
                </div>
                <Link 
                  href="#" 
                  className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                >
                  View Series <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Webinar Resources</h2>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Downloadable Materials</h3>
            <p className="mb-4">
              Many of our webinars include downloadable resources such as presentation slides, 
              trading checklists, strategy guides, and more. These materials are available 
              to registered users who attend or watch our webinars.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start p-4 bg-white rounded-lg border border-gray-200">
                <Download className="text-[#0033a0] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1 text-[#0033a0]">Binary Options Trading Checklist</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    A comprehensive checklist to help you evaluate potential binary options trades.
                  </p>
                  <Link 
                    href="#" 
                    className="text-[#0033a0] hover:text-[#ff5900] text-sm font-semibold flex items-center"
                  >
                    Download PDF <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-white rounded-lg border border-gray-200">
                <Download className="text-[#0033a0] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold mb-1 text-[#0033a0]">Technical Analysis Indicator Guide</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Quick reference guide for commonly used technical indicators and how to interpret them.
                  </p>
                  <Link 
                    href="#" 
                    className="text-[#0033a0] hover:text-[#ff5900] text-sm font-semibold flex items-center"
                  >
                    Download PDF <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              Additional resources are available to registered users. Please log in to access all downloadable materials.
            </p>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Webinar FAQs</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">How do I register for a webinar?</h3>
              <p className="text-gray-700">
                Simply click the "Register Now" button next to the webinar you're interested in. You'll need to provide your name and email address. After registering, you'll receive a confirmation email with the webinar link and calendar invitation.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Are the webinars free?</h3>
              <p className="text-gray-700">
                Yes, all Nedaxer webinars are free to attend for both members and non-members. However, some advanced webinar series may be exclusive to Nedaxer account holders.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">What if I miss a live webinar?</h3>
              <p className="text-gray-700">
                Most of our webinars are recorded and made available in our webinar archive within 24-48 hours after the live event. You can watch these recordings at your convenience.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-2 text-[#0033a0]">Can I ask questions during the webinar?</h3>
              <p className="text-gray-700">
                Yes, our live webinars include a Q&A session where you can submit questions for the presenter. We encourage participation and try to answer as many questions as time allows.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8">
          <div className="md:flex items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h2 className="text-2xl font-bold mb-2">Subscribe to Webinar Updates</h2>
              <p>Stay informed about upcoming webinars and educational events.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="px-4 py-3 rounded-md focus:outline-none text-gray-800"
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