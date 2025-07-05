import { PageLayout } from "@/components/page-layout";
import { Link } from "wouter";
import { navItems } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export default function SiteMap() {
  const additionalPages = [
    {
      title: "Legal",
      items: [
        { label: "Terms & Conditions", href: "/legal/terms" },
        { label: "Privacy Policy", href: "/legal/privacy" },
        { label: "Risk Disclosure", href: "/legal/risk" },
        { label: "CFTC Rule 4.41", href: "/legal/cftc" },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Open Account", href: "#" },
        { label: "Login", href: "#" },
        { label: "Download App", href: "#" },
      ],
    },
  ];

  return (
    <PageLayout 
      title="Site Map" 
      subtitle="A complete guide to all pages on the Nedaxer website"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <p className="mb-8">
            Use this site map to navigate to any page on the Nedaxer website. For specific questions or assistance, 
            please visit our <Link href="/company/contact" className="text-[#0033a0] hover:text-[#ff5900] font-semibold">Contact</Link> page.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {[...navItems, ...additionalPages].map((section, i) => (
              <div key={i} className="col-span-1">
                <h2 className="text-xl font-bold mb-4 text-[#0033a0] border-b border-gray-200 pb-2">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j}>
                      <Link 
                        href={item.href} 
                        className="text-gray-700 hover:text-[#ff5900] flex items-center"
                      >
                        <ArrowRight className="h-3 w-3 mr-2 text-[#0033a0]" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div className="col-span-1">
              <h2 className="text-xl font-bold mb-4 text-[#0033a0] border-b border-gray-200 pb-2">
                Home Page
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/" 
                    className="text-gray-700 hover:text-[#ff5900] flex items-center"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 text-[#0033a0]" />
                    <span>Home</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Quick Links</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="#" className="bg-[#f5f5f5] hover:bg-[#e6eef9] p-4 rounded-lg text-center transition-colors">
              <span className="font-semibold text-[#0033a0]">Open Account</span>
            </Link>
            
            <Link href="/products/binary-options" className="bg-[#f5f5f5] hover:bg-[#e6eef9] p-4 rounded-lg text-center transition-colors">
              <span className="font-semibold text-[#0033a0]">Binary Options</span>
            </Link>
            
            <Link href="/markets/forex" className="bg-[#f5f5f5] hover:bg-[#e6eef9] p-4 rounded-lg text-center transition-colors">
              <span className="font-semibold text-[#0033a0]">Forex Markets</span>
            </Link>
            
            <Link href="/learn/getting-started" className="bg-[#f5f5f5] hover:bg-[#e6eef9] p-4 rounded-lg text-center transition-colors">
              <span className="font-semibold text-[#0033a0]">Getting Started</span>
            </Link>
            
            <Link href="/platform/web-platform" className="bg-[#f5f5f5] hover:bg-[#e6eef9] p-4 rounded-lg text-center transition-colors">
              <span className="font-semibold text-[#0033a0]">Web Platform</span>
            </Link>
            
            <Link href="/platform/mobile-app" className="bg-[#f5f5f5] hover:bg-[#e6eef9] p-4 rounded-lg text-center transition-colors">
              <span className="font-semibold text-[#0033a0]">Mobile App</span>
            </Link>
            
            <Link href="/company/about" className="bg-[#f5f5f5] hover:bg-[#e6eef9] p-4 rounded-lg text-center transition-colors">
              <span className="font-semibold text-[#0033a0]">About Nedaxer</span>
            </Link>
            
            <Link href="/company/contact" className="bg-[#f5f5f5] hover:bg-[#e6eef9] p-4 rounded-lg text-center transition-colors">
              <span className="font-semibold text-[#0033a0]">Contact Us</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-[#f5f5f5] p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-[#0033a0]">Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/learn/webinars" className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center">
              <ArrowRight className="h-4 w-4 mr-1" />
              <span>Webinars</span>
            </Link>
            
            <Link href="/learn/trading-guides" className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center">
              <ArrowRight className="h-4 w-4 mr-1" />
              <span>Trading Guides</span>
            </Link>
            
            <Link href="/learn/trading-strategies" className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center">
              <ArrowRight className="h-4 w-4 mr-1" />
              <span>Trading Strategies</span>
            </Link>
            
            <Link href="/platform/funding" className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center">
              <ArrowRight className="h-4 w-4 mr-1" />
              <span>Account Funding</span>
            </Link>
            
            <Link href="/platform/security" className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center">
              <ArrowRight className="h-4 w-4 mr-1" />
              <span>Security</span>
            </Link>
            
            <Link href="/company/news" className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center">
              <ArrowRight className="h-4 w-4 mr-1" />
              <span>News & Updates</span>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}