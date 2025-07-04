import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, HelpCircle, TrendingUp } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function NotFound() {
  // Force cache refresh - timestamp: 2025-06-07T23:36:30Z
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Large 404 Display */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0033a0] to-[#ff5900] mb-4">
              404
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Oops! Page Not Found
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The page you're looking for seems to have vanished into the digital void. 
              Don't worry, even the best traders sometimes take a wrong turn.
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-12">
            <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-orange-100 rounded-full flex items-center justify-center">
              <div className="relative">
                <TrendingUp className="h-20 w-20 text-[#0033a0] opacity-20" />
                <Search className="h-12 w-12 text-[#ff5900] absolute top-4 left-4" />
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-blue-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-6 text-center">
                <Home className="h-8 w-8 text-[#0033a0] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Go Home</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Return to our homepage to explore trading opportunities
                </p>
                <Link href="/">
                  <Button className="w-full bg-[#0033a0] hover:bg-[#002680]">
                    Take Me Home
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:border-orange-300 transition-colors">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-[#ff5900] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Start Trading</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Jump right into our trading platform and explore markets
                </p>
                <Link href="/account/login">
                  <Button variant="outline" className="w-full border-[#ff5900] text-[#ff5900] hover:bg-[#ff5900] hover:text-white">
                    Access Platform
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6 text-center">
                <HelpCircle className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Contact our support team for assistance with navigation
                </p>
                <Link href="/company/contact">
                  <Button variant="outline" className="w-full">
                    Get Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Pages</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/markets/bitcoin">
                <Button variant="ghost" size="sm" className="text-[#0033a0] hover:bg-blue-50">
                  Bitcoin Markets
                </Button>
              </Link>
              <Link href="/markets/ethereum">
                <Button variant="ghost" size="sm" className="text-[#0033a0] hover:bg-blue-50">
                  Ethereum Markets
                </Button>
              </Link>
              <Link href="/learn/getting-started">
                <Button variant="ghost" size="sm" className="text-[#0033a0] hover:bg-blue-50">
                  Getting Started
                </Button>
              </Link>
              <Link href="/company/about">
                <Button variant="ghost" size="sm" className="text-[#0033a0] hover:bg-blue-50">
                  About Us
                </Button>
              </Link>
              <Link href="/products/pricing">
                <Button variant="ghost" size="sm" className="text-[#0033a0] hover:bg-blue-50">
                  Pricing
                </Button>
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
