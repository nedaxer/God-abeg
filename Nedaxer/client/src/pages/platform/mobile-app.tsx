import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Tablet, BarChart3, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { Link } from "wouter";

export default function MobileApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Installation failed:', err);
    }
  };

  const appFeatures = [
    {
      title: "Trade On The Go",
      description: "Place trades, monitor positions, and manage your account from anywhere.",
      icon: <Smartphone className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Full Platform Features",
      description: "Access all markets, products, and trading tools available on our web platform.",
      icon: <Tablet className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Advanced Charting",
      description: "Analyze markets with professional charting tools and indicators.",
      icon: <BarChart3 className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Real-Time Alerts",
      description: "Stay updated with notifications for price alerts and trade executions.",
      icon: <Zap className="h-10 w-10 text-[#0033a0]" />,
    },
  ];

  const deviceSupport = [
    {
      name: "iOS Devices",
      requirements: [
        "iPhone 6s or newer",
        "iOS 13.0 or higher",
        "Optimized for all screen sizes",
        "Available on App Store",
      ],
    },
    {
      name: "Android Devices",
      requirements: [
        "Android 7.0 or higher",
        "Minimum 2GB RAM recommended",
        "Tablets and phones supported",
        "Available on Google Play",
      ],
    },
  ];

  return (
    <PageLayout 
      title="Nedaxer Trading App" 
      subtitle="Trade cryptocurrencies anywhere, anytime with our powerful trading application"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Button
            onClick={handleInstall}
            className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold px-8 py-3 text-lg"
            disabled={!deferredPrompt}
          >
            <Download className="mr-2 h-5 w-5" />
            Install Nedaxer App
          </Button>
          {!deferredPrompt && (
            <p className="mt-2 text-sm text-gray-600">
              If you've already installed the app or your browser doesn't support installation,
              you can access it through your device's home screen.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {appFeatures.map((feature, i) => (
            <div key={i} className="flex items-start p-6 bg-white rounded-lg shadow-md">
              <div className="mr-4">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>


        {/* App Screenshots and Download Section */}
        <div className="mb-12">
          <div className="relative bg-gradient-to-r from-[#001a4d] to-[#0033a0] p-8 rounded-lg text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img 
                src="https://images.unsplash.com/photo-1642104704074-907c0698cbd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80" 
                alt="Cryptocurrency trading app background"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative z-10 md:flex items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-bold mb-4">Download The Nedaxer Mobile App</h2>
                <p className="mb-6">Experience cryptocurrency trading on the go with our secure and feature-rich mobile application. Available for iOS and Android devices.</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://apps.apple.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-black text-white rounded-lg px-6 py-3 flex items-center justify-center hover:bg-opacity-80 transition-all"
                  >
                    <FaApple className="text-2xl mr-3" />
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-xl font-semibold">App Store</div>
                    </div>
                  </a>
                  
                  <a 
                    href="https://play.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-black text-white rounded-lg px-6 py-3 flex items-center justify-center hover:bg-opacity-80 transition-all"
                  >
                    <FaGooglePlay className="text-2xl mr-3" />
                    <div className="text-left">
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-xl font-semibold">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
              
              <div className="md:w-1/2 flex justify-center">
                <div className="relative h-80 w-60 bg-black rounded-3xl border-4 border-gray-800 shadow-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=800&q=80" 
                    alt="Nedaxer mobile app interface"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">Nedaxer mobile app on smartphone and tablet devices</p>
        </div>
        

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">App Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Trading Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Trade all Nedaxer crypto products: Binary Options, Call Spreads, Touch Brackets, and Knock-Outs</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Access to all available cryptocurrency markets including Bitcoin, Ethereum, altcoins, and blockchain events</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>One-tap order entry with built-in risk assessment</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Real-time position management and tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Close trades early to secure profits or limit losses</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Analysis Tools</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Professional charting with multiple timeframes</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Technical indicators and drawing tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Economic calendar and market news</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Customizable watchlists for easy market monitoring</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                  <span>Price alerts and custom notifications</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Device Support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deviceSupport.map((device, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-[#0033a0]">{device.name}</h3>
                <ul className="space-y-3">
                  {device.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className="flex items-start">
                      <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">How to Get Started</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center">
              <div className="text-3xl font-bold text-[#0033a0] mb-4">1</div>
              <h3 className="text-lg font-bold mb-2">Create Account</h3>
              <p className="text-gray-700 mb-4">Sign up for a Nedaxer account online or through the mobile app.</p>
              <Link 
                href="/account/register" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center justify-center"
              >
                Open Account <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center">
              <div className="text-3xl font-bold text-[#0033a0] mb-4">2</div>
              <h3 className="text-lg font-bold mb-2">Download App</h3>
              <p className="text-gray-700 mb-4">Get the app directly from the App Store or Google Play Store.</p>
              <div className="flex flex-col items-center space-y-2">
                <a 
                  href="https://apps.apple.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                >
                  <FaApple className="mr-2" /> Download for iOS <ArrowRight className="ml-1 h-4 w-4" />
                </a>
                <a 
                  href="https://play.google.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                >
                  <FaGooglePlay className="mr-2" /> Download for Android <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center">
              <div className="text-3xl font-bold text-[#0033a0] mb-4">3</div>
              <h3 className="text-lg font-bold mb-2">Log In & Trade</h3>
              <p className="text-gray-700 mb-4">Sign in to the app and start trading cryptocurrencies on the go.</p>
              <Link 
                href="/learn/getting-started" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center justify-center"
              >
                View App Tutorial <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#001a4d] to-[#0033a0] text-white rounded-lg p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80" 
              alt="Cryptocurrency trading background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Download The Nedaxer Crypto App Today</h2>
            <p className="mb-6">Trade cryptocurrencies anywhere, anytime with our powerful blockchain-enabled mobile trading platform.</p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="https://apps.apple.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black text-white rounded-lg px-6 py-3 flex items-center justify-center hover:bg-opacity-80 transition-all"
              >
                <FaApple className="text-2xl mr-3" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-xl font-semibold">App Store</div>
                </div>
              </a>
              
              <a 
                href="https://play.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black text-white rounded-lg px-6 py-3 flex items-center justify-center hover:bg-opacity-80 transition-all"
              >
                <FaGooglePlay className="text-2xl mr-3" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-xl font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}