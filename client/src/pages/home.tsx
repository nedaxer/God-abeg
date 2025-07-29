import { useState, useEffect } from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSlider } from "@/components/hero-slider";
import { TradeOptions } from "@/components/trade-options";
import { MarketFeatures } from "@/components/market-features";
import { TrustedWorldwideCards } from "@/components/trusted-worldwide-cards";
import { InvestmentSkills } from "@/components/trading-skills";
import { CTASection } from "@/components/cta-section";
import { CryptoCoinList } from "@/components/crypto-coin-list";
import LandingPageChatBot from "@/components/landing-page-chatbot";
import TestimonialsSlideshow from "@/components/testimonials-slideshow";
import ProcessTicker from "@/components/process-ticker";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TrendingUp, Wallet, BarChart3, Zap } from "lucide-react";
import { ArrowRight, Calendar, Coins } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#000d2e]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Content for logged-in users
  if (user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {/* Welcome Banner for Logged-in Users */}
          <section className="bg-gradient-to-r from-[#000d2e] to-[#ff8c00] text-white py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-2xl font-semibold mb-3">
                  Welcome back, {user.username}!
                </h1>
                <p className="text-base mb-6 opacity-90">
                  Your investment dashboard is ready. Start investing with confidence.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild className="bg-white text-[#000d2e] hover:bg-gray-100 font-medium px-6 py-2 text-sm">
                    <Link href="/SpotTrading">Start Investing</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-[#000d2e] font-medium px-6 py-2 text-sm">
                    <Link href="/Deposit">Fund Account</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions for Logged-in Users */}
          <section className="py-10 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-xl font-semibold text-center mb-8 text-[#000d2e]">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                <Link href="/SpotTrading">
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#000d2e]">
                    <TrendingUp className="h-8 w-8 text-[#000d2e] mb-3" />
                    <h3 className="text-lg font-medium mb-1">Spot Investing</h3>
                    <p className="text-gray-600 text-sm">Invest in cryptocurrencies with real-time pricing</p>
                  </div>
                </Link>
                <Link href="/Futures">
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#000d2e]">
                    <BarChart3 className="h-8 w-8 text-[#000d2e] mb-3" />
                    <h3 className="text-lg font-medium mb-1">Futures Investing</h3>
                    <p className="text-gray-600 text-sm">Invest with leverage and advanced strategies</p>
                  </div>
                </Link>
                <Link href="/Staking">
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#000d2e]">
                    <Zap className="h-8 w-8 text-[#000d2e] mb-3" />
                    <h3 className="text-lg font-medium mb-1">Staking</h3>
                    <p className="text-gray-600 text-sm">Earn rewards by staking your crypto</p>
                  </div>
                </Link>
                <Link href="/Deposit">
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#000d2e]">
                    <Wallet className="h-8 w-8 text-[#000d2e] mb-3" />
                    <h3 className="text-lg font-medium mb-1">Deposit Funds</h3>
                    <p className="text-gray-600 text-sm">Add funds to start investing</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Existing components for logged-in users */}
          <MarketFeatures />
          <TrustedWorldwideCards />
        </main>
        <Footer />
      </div>
    );
  }

  // Content for non-logged-in users (original landing page)
  // Check if we're on desktop for landing page
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      // More comprehensive desktop detection
      const isDesktopScreen = window.innerWidth >= 1024;
      const isDesktopDevice = !('ontouchstart' in window) && !navigator.maxTouchPoints;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Consider it desktop if screen is large AND (no touch OR not mobile user agent)
      setIsDesktop(isDesktopScreen && (isDesktopDevice || !isMobileUA));
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Desktop landing page layout
  if (isDesktop) {
    return (
      <div className="w-screen min-h-screen relative z-50" style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#000d2e'
      }}>
        <Header />
        <main className="w-full relative z-40 pt-[65px]">
          <HeroSlider />
          <TradeOptions />
          
          {/* Desktop Layout: Video and Investment Skills Side by Side */}
          <section 
            className="relative py-8"
          >
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
                {/* Video Section */}
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-lg">
                    <video
                      className="w-full h-auto rounded-lg shadow-2xl"
                      muted
                      playsInline
                      autoPlay
                    >
                      <source src="/attached_assets/copytrader-mob_1752803532796.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                {/* Investment Skills Section */}
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="py-8 relative overflow-hidden rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, #ff8c00 0%, #ffa500 30%, #ff8c00 70%, #ff7f00 100%)'
                      }}
                    >
                      <div className="px-6 relative z-10">
                        <div className="max-w-lg">
                          {/* Main Title */}
                          <div className="mb-8 text-left">
                            <h2 className="text-2xl lg:text-3xl font-bold text-[#000d2e] mb-4 leading-tight">
                              Our Investment &<br />
                              Management<br />
                              Skillsets
                            </h2>
                            <p className="text-sm lg:text-base text-[#000d2e]">
                              Our performance over the past 7 years all summarized, 
                              giving this outstanding and superb result. Indeed we are 
                              one of the best!
                            </p>
                          </div>

                          {/* Skills Progress Bars - Compact version */}
                          <div className="space-y-6">
                            <div className="group">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-semibold text-[#000d2e] tracking-wide">
                                  FOCUS
                                </h3>
                                <span className="text-xl font-bold text-[#000d2e]">
                                  100%
                                </span>
                              </div>
                              <div className="relative">
                                <div className="w-full h-3 bg-black bg-opacity-30 rounded-full overflow-hidden">
                                  <div
                                    className="h-full transition-all duration-300 ease-out rounded-full relative"
                                    style={{
                                      width: '100%',
                                      background: '#000d2e'
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <div className="group">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-semibold text-[#000d2e] tracking-wide">
                                  DISCIPLINE & PATIENCE
                                </h3>
                                <span className="text-xl font-bold text-[#000d2e]">
                                  97%
                                </span>
                              </div>
                              <div className="relative">
                                <div className="w-full h-3 bg-black bg-opacity-30 rounded-full overflow-hidden">
                                  <div
                                    className="h-full transition-all duration-300 ease-out rounded-full relative"
                                    style={{
                                      width: '97%',
                                      background: '#000d2e'
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <div className="group">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-semibold text-[#000d2e] tracking-wide">
                                  MENTAL TOUGHNESS
                                </h3>
                                <span className="text-xl font-bold text-[#000d2e]">
                                  90%
                                </span>
                              </div>
                              <div className="relative">
                                <div className="w-full h-3 bg-black bg-opacity-30 rounded-full overflow-hidden">
                                  <div
                                    className="h-full transition-all duration-300 ease-out rounded-full relative"
                                    style={{
                                      width: '90%',
                                      background: '#000d2e'
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <div className="group">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-semibold text-[#000d2e] tracking-wide">
                                  RECORD KEEPING
                                </h3>
                                <span className="text-xl font-bold text-[#000d2e]">
                                  87%
                                </span>
                              </div>
                              <div className="relative">
                                <div className="w-full h-3 bg-black bg-opacity-30 rounded-full overflow-hidden">
                                  <div
                                    className="h-full transition-all duration-300 ease-out rounded-full relative"
                                    style={{
                                      width: '87%',
                                      background: '#000d2e'
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <InvestmentSkills />
          <TestimonialsSlideshow />
          <TrustedWorldwideCards />
          <CTASection />
        </main>
        <Footer />
        <LandingPageChatBot isDesktop={true} />
      </div>
    );
  }

  // Mobile landing page layout
  return (
    <div className="min-h-screen flex flex-col relative z-50" style={{ backgroundColor: '#000d2e' }}>
      <Header />
      <main className="flex-grow relative z-40">
        <HeroSlider />
        <TradeOptions />
        
        {/* Video Section with Blue Background */}
        <section 
          className="relative py-6"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-4xl mx-auto">
                <video
                  className="w-full h-auto rounded-lg shadow-2xl"
                  muted
                  playsInline
                  autoPlay
                >
                  <source src="/attached_assets/copytrader-mob_1752803532796.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>
        
        <InvestmentSkills />
        <TestimonialsSlideshow />
        <TrustedWorldwideCards />
        <CTASection />
      </main>
      <Footer />
      <LandingPageChatBot isDesktop={false} />
    </div>
  );
}