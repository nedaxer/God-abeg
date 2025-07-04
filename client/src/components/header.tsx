import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/constants";
import { ChevronDown, Menu, X, Download } from "lucide-react";
import { Logo } from "./logo";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.title} className="relative group">
                <button
                  className="flex items-center space-x-1 text-gray-700 hover:text-[#191970] font-medium"
                  onClick={() => toggleDropdown(item.title)}
                >
                  <span>{item.title}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown menu */}
                {activeDropdown === item.title && (
                  <div className="absolute z-10 left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center mr-2">
              <a href="/#/account/login" className="text-[#191970] hover:text-[#ff5900] mr-4 font-medium">
                Login
              </a>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
            >
              <a href="https://play.google.com/store/apps/details?id=com.nadex.touch" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Download App
              </a>
            </Button>
            <Button
              asChild
              className="bg-[#ff5900] hover:bg-opacity-90 text-white"
            >
              <a href="/#/account/register">Open Account</a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-700 hover:text-[#0033a0]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4">
          <div className="border-t border-gray-200 pt-4">
            {navItems.map((item) => (
              <div key={item.title} className="mb-4">
                <button
                  className="flex items-center justify-between w-full text-left text-gray-700 hover:text-[#0033a0] font-medium"
                  onClick={() => toggleDropdown(item.title)}
                >
                  <span>{item.title}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {activeDropdown === item.title && (
                  <div className="mt-2 ml-4 space-y-2">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block text-sm text-gray-700 hover:text-[#0033a0]"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex flex-col space-y-3 mt-6">
              <a 
                href="/#/account/login"
                className="text-[#0033a0] hover:text-[#ff5900] font-medium text-center py-2"
              >
                Login to your account
              </a>
              <Button
                asChild
                variant="outline"
                className="border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white w-full"
              >
                <a href="https://play.google.com/store/apps/details?id=com.nadex.touch" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download App
                </a>
              </Button>
              <Button
                asChild
                className="bg-[#ff5900] hover:bg-opacity-90 text-white w-full"
              >
                <a href="/#/account/register">Open Account</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};