import { Link } from "wouter";
import { footerLinks } from "@/lib/constants";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Download } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Logo and social */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo size="large" />
            </div>
            <p className="text-gray-300 mb-6">
              A regulated exchange offering innovative trading products with limited risk by design.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Markets</h3>
            <ul className="space-y-2">
              {footerLinks.markets.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 w-full"
                >
                  <a href="https://play.google.com/store/apps/details?id=com.nadex.touch" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <Download className="mr-2 h-4 w-4" />
                    Download App
                  </a>
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Subscribe to Updates</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 text-gray-900 rounded-l-md focus:outline-none"
              />
              <button className="bg-[#ff5900] hover:bg-opacity-90 px-4 py-2 rounded-r-md">
                Subscribe
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Account</h3>
            <ul className="space-y-2">
              {footerLinks.account.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Disclaimers</h3>
            <p className="text-gray-400 text-sm">
              Trading involves significant risk and is not suitable for all investors. Nedaxer is a regulated 
              exchange offering limited-risk derivative products. All trading activities are subject to the 
              Nedaxer Exchange Rules.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Nedaxer. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/site-map" className="text-gray-400 hover:text-white text-sm">
                Site Map
              </Link>
              <Link href="/legal/privacy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="text-gray-400 hover:text-white text-sm">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};