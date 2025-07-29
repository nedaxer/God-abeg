import { Link } from "wouter";
import { footerLinks } from "@/lib/constants";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import trustpilotImage from '@assets/d8291bab507e407e872da1e1f6dea69a_1752942028324.png';

export const Footer = () => {
  return (
    <footer 
      className="text-white pt-12 pb-6 relative"
      style={{
        backgroundImage: `url('/attached_assets/Screenshot_20250718-030008_Phoenix_1752804174994.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {/* Logo and social */}
          <div className="lg:col-span-2">
            <div className="mb-2">
              <img
                src={trustpilotImage}
                alt="Trustpilot 5 Star Rating"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="mb-4">
              <Logo size="small" />
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              A regulated exchange offering innovative investment products with limited risk by design.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Footer links */}
          <div>
            <h3 className="text-base font-semibold mb-3">Markets</h3>
            <ul className="space-y-1">
              {footerLinks.markets.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Products</h3>
            <ul className="space-y-1">
              {footerLinks.products.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Platform</h3>
            <ul className="space-y-1">
              {footerLinks.platform.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Company</h3>
            <ul className="space-y-1">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h3 className="text-base font-semibold mb-3">Subscribe to Updates</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-3 py-2 text-gray-900 rounded-l-md focus:outline-none text-sm"
              />
              <button className="bg-[#ff5900] hover:bg-opacity-90 px-3 py-2 rounded-r-md text-sm">
                Subscribe
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Legal</h3>
            <ul className="space-y-1">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-3">Account</h3>
            <ul className="space-y-1">
              {footerLinks.account.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-base font-semibold mb-3">Disclaimers</h3>
            <p className="text-gray-400 text-xs">
              Investing involves significant risk and is not suitable for all investors. Nedaxer is a regulated 
              exchange offering limited-risk derivative products. All investment activities are subject to the 
              Nedaxer Exchange Rules.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between">
            <p className="text-gray-400 text-xs mb-2 md:mb-0">
              &copy; {new Date().getFullYear()} Nedaxer. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/site-map" className="text-gray-400 hover:text-white text-xs">
                Site Map
              </Link>
              <Link href="/legal/privacy" className="text-gray-400 hover:text-white text-xs">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="text-gray-400 hover:text-white text-xs">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};