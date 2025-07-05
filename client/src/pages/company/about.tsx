import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, ArrowRight, Building, Users, GraduationCap, Shield } from "lucide-react";
// import companyPhoto from "@assets/company photo.jpg";

export default function About() {
  const companyValues = [
    {
      title: "Integrity",
      description: "We operate with transparency and honesty in all our business practices, maintaining the highest ethical standards.",
      icon: <Shield className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Innovation",
      description: "We continuously develop new products and improve our platform to provide the best trading experience.",
      icon: <Building className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Education",
      description: "We are committed to providing traders with the knowledge they need to make informed trading decisions.",
      icon: <GraduationCap className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Customer Focus",
      description: "We prioritize our members' needs and strive to provide excellent service and support.",
      icon: <Users className="h-10 w-10 text-[#0033a0]" />,
    },
  ];

  const milestones = [
    {
      year: "2004",
      title: "Company Founded",
      description: "Nedaxer was founded as CryptoEdge Exchange, pioneering the concept of limited-risk derivatives for cryptocurrency traders.",
    },
    {
      year: "2007",
      title: "Acquisition by Digital Assets Group",
      description: "CryptoEdge was acquired by Digital Assets Group, a global leader in blockchain technology and cryptocurrency trading.",
    },
    {
      year: "2009",
      title: "Relaunch as Nedaxer",
      description: "The company was relaunched as the New Era Derivatives Exchange for Cryptocurrencies (Nedaxer), with an enhanced digital asset trading platform.",
    },
    {
      year: "2011",
      title: "Introduction of Crypto Binary Options",
      description: "Nedaxer introduced cryptocurrency binary options trading on a regulated US exchange for the first time.",
    },
    {
      year: "2014",
      title: "Launch of Crypto Mobile Trading",
      description: "The Nedaxer mobile app was launched, allowing members to trade cryptocurrencies on the go with advanced blockchain analytics.",
    },
    {
      year: "2016",
      title: "Introduction of Touch Brackets for Crypto",
      description: "Nedaxer introduced Touch Brackets for cryptocurrency markets, providing traders with new limited-risk trading opportunities.",
    },
    {
      year: "2020",
      title: "Crypto Platform Expansion",
      description: "Major platform upgrades and expansion of available cryptocurrency markets and blockchain-based trading instruments.",
    },
    {
      year: "2023",
      title: "Continued Crypto Innovation",
      description: "Introduction of new cryptocurrency trading products and enhanced blockchain integration features.",
    },
  ];

  return (
    <PageLayout 
      title="About Nedaxer" 
      subtitle="A regulated US exchange offering limited-risk cryptocurrency trading products"
      bgColor="#0033a0"
      bgImage="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Our Company</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="mb-4">
                The New Era Derivatives Exchange for Cryptocurrencies (Nedaxer) is a regulated US exchange 
                offering crypto traders innovative ways to participate in the digital asset markets with limited risk.
              </p>
              <p className="mb-4">
                Based in San Francisco, Nedaxer operates under the regulatory oversight of the Commodity Futures 
                Trading Commission (CFTC), ensuring a fair, transparent, and secure cryptocurrency trading environment.
              </p>
              <p>
                We specialize in short-term, limited-risk derivative products including binary options, 
                call spreads, and knock-outs on a range of cryptocurrency markets including Bitcoin, Ethereum, 
                altcoins, and blockchain-related events.
              </p>
            </div>
            
            {/* Company Image */}
            <div className="w-full h-64 bg-gradient-to-r from-[#0033a0] to-[#ff5900] rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Building className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Nedaxer Headquarters</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Our Mission</h2>
          
          <div className="bg-[#f5f5f5] p-8 rounded-lg text-center mb-8">
            <p className="text-xl italic mb-6">
              "To provide retail traders secure access to cryptocurrency markets through innovative, limited-risk 
              derivative products on a regulated exchange with cutting-edge blockchain analytics."
            </p>
            <div className="flex justify-center space-x-4">
              <div className="h-1 w-12 bg-[#0033a0]"></div>
              <div className="h-1 w-12 bg-[#ff5900]"></div>
              <div className="h-1 w-12 bg-[#0033a0]"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companyValues.map((value, i) => (
              <div key={i} className="flex items-start p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="mr-4">{value.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Our History</h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#0033a0] transform md:translate-x-[-0.5px]"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="md:w-1/2 pb-8">
                    <div className={`md:px-8 ${i % 2 === 0 ? 'md:pl-0 md:pr-16' : 'md:pr-0 md:pl-16'}`}>
                      <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="text-lg font-bold text-[#ff5900] mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{milestone.title}</h3>
                        <p className="text-gray-700">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 mt-6 transform md:translate-x-[-50%] flex items-center justify-center">
                    <div className="bg-[#ff5900] h-4 w-4 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Leadership Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f5f5f5] p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="h-48 w-48 mx-auto rounded-full mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" 
                  alt="Dr. Michael Chen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-[#0033a0]">Dr. Michael Chen</h3>
              <p className="text-[#ff5900] font-medium mb-3">CEO & Founder</p>
              <p className="text-gray-700 text-sm">
                Former MIT professor of Blockchain Economics with 15+ years of experience in cryptocurrency trading systems. 
                Pioneer in developing risk-mitigation algorithms for digital asset trading. Ph.D. in Computer Science from Stanford University.
              </p>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="h-48 w-48 mx-auto rounded-full mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" 
                  alt="Sarah Johnson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-[#0033a0]">Sarah Johnson</h3>
              <p className="text-[#ff5900] font-medium mb-3">CTO & Head of Blockchain Research</p>
              <p className="text-gray-700 text-sm">
                Former lead developer at Ethereum Foundation and cryptocurrency exchange architect. Holds 7 patents in blockchain security systems.
                Masters in Cryptography from UC Berkeley and contributor to multiple industry-standard security protocols.
              </p>
            </div>
            
            <div className="bg-[#f5f5f5] p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="h-48 w-48 mx-auto rounded-full mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" 
                  alt="Marcus Williams" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1 text-[#0033a0]">Marcus Williams</h3>
              <p className="text-[#ff5900] font-medium mb-3">Chief Regulatory Officer</p>
              <p className="text-gray-700 text-sm">
                Former Senior Advisor at the CFTC with expertise in cryptocurrency regulation. 20+ years experience in financial compliance and regulatory frameworks for digital assets.
                JD from Harvard Law School and author of "Regulatory Frameworks for Digital Assets Trading".
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              href="/company/careers" 
              className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center justify-center"
            >
              View career opportunities at Nedaxer <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Why Choose Nedaxer</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="text-[#ff5900] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1 text-[#0033a0]">Regulated US Crypto Exchange</h3>
                <p className="text-gray-700">
                  Trade with confidence on a CFTC-regulated cryptocurrency exchange with member funds held in segregated US bank accounts.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="text-[#ff5900] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1 text-[#0033a0]">Limited Risk by Design</h3>
                <p className="text-gray-700">
                  All our crypto trading products feature built-in risk parameters, so you always know your maximum potential loss before you trade.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="text-[#ff5900] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1 text-[#0033a0]">Innovative Blockchain Products</h3>
                <p className="text-gray-700">
                  Our unique cryptocurrency product offerings provide traders with opportunities not available on other digital asset platforms.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="text-[#ff5900] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1 text-[#0033a0]">Crypto Educational Resources</h3>
                <p className="text-gray-700">
                  Comprehensive cryptocurrency learning materials, webinars, and tutorials to help traders of all experience levels navigate digital asset markets.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="text-[#ff5900] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1 text-[#0033a0]">Advanced Crypto Trading Platform</h3>
                <p className="text-gray-700">
                  Professional-grade blockchain analytics, charting and analysis tools for cryptocurrency markets, available on web and mobile platforms.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join the Nedaxer Community</h2>
          <p className="mb-6">Experience cryptocurrency trading on a regulated US exchange with limited risk products.</p>
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
            <Link href="/company/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}