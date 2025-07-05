import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSlider } from "@/components/hero-slider";
import { TradeOptions } from "@/components/trade-options";
import { MarketFeatures } from "@/components/market-features";
import { PlatformFeatures } from "@/components/platform-features";
import { LearningResources } from "@/components/learning-resources";
import { CTASection } from "@/components/cta-section";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TrendingUp, Wallet, BarChart3, Zap } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#0033a0]"></div>
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
          <section className="bg-gradient-to-r from-[#0033a0] to-[#ff5900] text-white py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">
                  Welcome back, {user.username}!
                </h1>
                <p className="text-xl mb-8 opacity-90">
                  Your trading dashboard is ready. Start trading with confidence.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild className="bg-white text-[#0033a0] hover:bg-gray-100 font-semibold px-8 py-3">
                    <Link href="/SpotTrading">Start Trading</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-[#0033a0] font-semibold px-8 py-3">
                    <Link href="/Deposit">Fund Account</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions for Logged-in Users */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-[#0033a0]">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <Link href="/SpotTrading">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#0033a0]">
                    <TrendingUp className="h-12 w-12 text-[#0033a0] mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Spot Trading</h3>
                    <p className="text-gray-600">Trade cryptocurrencies with real-time pricing</p>
                  </div>
                </Link>
                <Link href="/Futures">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#0033a0]">
                    <BarChart3 className="h-12 w-12 text-[#0033a0] mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Futures Trading</h3>
                    <p className="text-gray-600">Trade with leverage and advanced strategies</p>
                  </div>
                </Link>
                <Link href="/Staking">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#0033a0]">
                    <Zap className="h-12 w-12 text-[#0033a0] mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Staking</h3>
                    <p className="text-gray-600">Earn rewards by staking your crypto</p>
                  </div>
                </Link>
                <Link href="/Deposit">
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-[#0033a0]">
                    <Wallet className="h-12 w-12 text-[#0033a0] mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Deposit Funds</h3>
                    <p className="text-gray-600">Add funds to start trading</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Existing components for logged-in users */}
          <MarketFeatures />
          <PlatformFeatures />
        </main>
        <Footer />
      </div>
    );
  }

  // Content for non-logged-in users (original landing page)
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSlider />
        <TradeOptions />
        <MarketFeatures />
        <PlatformFeatures />
        <LearningResources />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
