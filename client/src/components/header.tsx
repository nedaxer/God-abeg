import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/constants";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import nedaxerLogo from "@assets/5706392d361e4059b5395fd50a5a6d22_1752884728244.png";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Small Orange Header Section */}
      <div className="bg-[#ff8c00] h-16">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                src={nedaxerLogo} 
                alt="Nedaxer Logo" 
                className="h-12 object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-[#000d2e] hover:text-orange-500 transition-colors">
                  <span>Products</span>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                </button>
                <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 ease-in-out transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-4 space-y-2">
                    <Link href="/products/binary-options" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Binary Options</Link>
                    <Link href="/products/call-spreads" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Call Spreads</Link>
                    <Link href="/products/knock-outs" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Knock-Outs</Link>
                    <Link href="/products/touch-brackets" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Touch Brackets</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-[#000d2e] hover:text-orange-500 transition-colors">
                  <span>Markets</span>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                </button>
                <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 ease-in-out transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-4 space-y-2">
                    <Link href="/markets/bitcoin" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Bitcoin</Link>
                    <Link href="/markets/ethereum" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Ethereum</Link>
                    <Link href="/markets/altcoins" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Altcoins</Link>
                    <Link href="/markets/commodities" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Commodities</Link>
                    <Link href="/markets/live-markets" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Live Markets</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-[#000d2e] hover:text-orange-500 transition-colors">
                  <span>Platform</span>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                </button>
                <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 ease-in-out transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-4 space-y-2">
                    <Link href="/platform/web-platform" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Web Platform</Link>
                    <Link href="/platform/mobile-app" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Mobile App</Link>
                    <Link href="/platform/trading" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Trading</Link>
                    <Link href="/platform/security" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Security</Link>
                    <Link href="/platform/funding" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Funding</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-[#000d2e] hover:text-orange-500 transition-colors">
                  <span>Learn</span>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                </button>
                <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 ease-in-out transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-4 space-y-2">
                    <Link href="/learn/getting-started" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Getting Started</Link>
                    <Link href="/learn/trading-guides" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Trading Guides</Link>
                    <Link href="/learn/binary-options" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Binary Options</Link>
                    <Link href="/learn/webinars" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Webinars</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-[#000d2e] hover:text-orange-500 transition-colors">
                  <span>Company</span>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                </button>
                <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 ease-in-out transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-4 space-y-2">
                    <Link href="/company/about" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">About Us</Link>
                    <Link href="/company/careers" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Careers</Link>
                    <Link href="/company/news" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">News</Link>
                    <Link href="/company/contact" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Contact</Link>
                    <Link href="/company/regulations" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Regulations</Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center mr-2">
                <a href="/#/account/login" className="text-white hover:text-gray-200 mr-4 font-medium">
                  Login
                </a>
              </div>
              <Button
                asChild
                className="bg-[#000d2e] hover:bg-[#001122] text-white font-semibold"
              >
                <a href="/#/account/register">Open Account</a>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-[#ff8c00] hover:text-orange-600 bg-[#1e40af] rounded p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Thin Blue Line */}
      <div className="bg-[#1e40af] h-1"></div>

      {/* Mobile navigation */}
      <div className={`lg:hidden bg-[#ff8c00] px-4 shadow-lg relative z-[9999] overflow-hidden transition-all duration-1500 ease-in-out rounded-b-3xl ${
        mobileMenuOpen 
          ? 'max-h-screen pb-4 opacity-100 transform translate-y-0 scale-100 visible' 
          : 'max-h-0 pb-0 opacity-0 transform -translate-y-12 scale-90 invisible'
      }`}
      style={{
        transitionProperty: 'max-height, opacity, transform, visibility, padding',
        transitionDelay: mobileMenuOpen ? '0ms' : '800ms'
      }}>
        <div className={`transition-all duration-1200 ease-in-out ${
          mobileMenuOpen 
            ? 'transform translate-y-0 opacity-100 scale-100 delay-300' 
            : 'transform -translate-y-12 opacity-0 scale-85 delay-500'
        }`}>
          <div className="border-t border-orange-400 pt-4">
            {navItems.map((item, index) => (
              <div 
                key={item.title} 
                className={`mb-4 transition-all duration-1000 ease-out ${
                  mobileMenuOpen 
                    ? 'transform translate-x-0 opacity-100 scale-100' 
                    : 'transform -translate-x-8 opacity-0 scale-95'
                }`}
                style={{ 
                  transitionDelay: mobileMenuOpen 
                    ? `${400 + (index * 120)}ms` 
                    : `${600 + (navItems.length - index - 1) * 150}ms`,
                  transitionProperty: 'transform, opacity, scale'
                }}
              >
                <button
                  className="flex items-center justify-between w-full text-left text-[#000d2e] hover:text-gray-700 font-medium transition-all duration-400 hover:transform hover:scale-105 hover:bg-orange-100 hover:shadow-md rounded-lg px-2 py-1"
                  onClick={() => toggleDropdown(item.title)}
                >
                  <span className="transition-all duration-400">{item.title}</span>
                  <ChevronDown className={`h-4 w-4 transition-all duration-600 ease-in-out ${activeDropdown === item.title ? 'rotate-180 text-blue-600 scale-110' : 'text-gray-600 scale-100'}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-800 ease-in-out ${
                  activeDropdown === item.title 
                    ? 'max-h-96 opacity-100 mt-2 transform translate-y-0 scale-100' 
                    : 'max-h-0 opacity-0 mt-0 transform -translate-y-4 scale-95'
                }`}
                style={{
                  transitionDelay: activeDropdown === item.title ? '100ms' : '0ms'
                }}>
                  <div className="ml-4 space-y-2">
                    {item.items.map((subItem, subIndex) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className={`block text-sm text-[#000d2e] hover:text-gray-700 transition-all duration-600 ease-out hover:transform hover:translate-x-2 hover:bg-orange-50 hover:shadow-sm rounded px-2 py-1 ${
                          activeDropdown === item.title 
                            ? 'transform translate-x-0 opacity-100 scale-100' 
                            : 'transform -translate-x-6 opacity-0 scale-95'
                        }`}
                        style={{ 
                          transitionDelay: activeDropdown === item.title 
                            ? `${150 + (subIndex * 100)}ms` 
                            : `${400 + (item.items.length - subIndex - 1) * 100}ms`,
                          transitionProperty: 'transform, opacity, scale, background-color, box-shadow'
                        }}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col space-y-3 mt-6">
              <a 
                href="/#/account/login"
                className={`text-[#000d2e] hover:text-gray-700 font-medium text-center py-2 transition-all duration-800 ease-out hover:transform hover:scale-105 rounded-lg hover:bg-orange-50 hover:shadow-sm ${
                  mobileMenuOpen 
                    ? 'transform translate-y-0 opacity-100 scale-100' 
                    : 'transform translate-y-8 opacity-0 scale-95'
                }`}
                style={{ 
                  transitionDelay: mobileMenuOpen ? '800ms' : '300ms',
                  transitionProperty: 'transform, opacity, scale, background-color, box-shadow'
                }}
              >
                Login to your account
              </a>
              <Button
                asChild
                className={`bg-[#000d2e] hover:bg-[#001122] text-white font-semibold w-full transition-all duration-900 hover:transform hover:scale-105 hover:shadow-xl ${
                  mobileMenuOpen 
                    ? 'transform translate-y-0 opacity-100 scale-100' 
                    : 'transform translate-y-8 opacity-0 scale-90'
                }`}
                style={{ 
                  transitionDelay: mobileMenuOpen ? '900ms' : '200ms',
                  transitionProperty: 'transform, opacity, scale, background-color, box-shadow'
                }}
              >
                <a href="/#/account/register">Open Account</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};