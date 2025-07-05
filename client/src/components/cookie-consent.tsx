import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem("cookie-consent") === "accepted";
    
    // Show the banner if they haven't accepted yet
    if (!hasAcceptedCookies) {
      // Slight delay before showing the banner for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[10003] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={declineCookies} />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Cookie Consent</h3>
            <button 
              onClick={declineCookies} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use cookies to enhance your experience on our platform. By continuing to use our website, 
              you agree to our use of cookies as described in our Privacy Policy.
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={declineCookies}
              className="flex-1 text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
            >
              Decline
            </Button>
            <Button 
              size="sm"
              onClick={acceptCookies}
              className="flex-1 bg-[#0033a0] hover:bg-opacity-90 text-white"
            >
              Accept Cookies
            </Button>
          </div>
          
          {/* Legal Link */}
          <div className="text-center pt-2">
            <Link href="/legal/privacy" className="text-xs text-gray-500 hover:text-[#0033a0] underline">
              View Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}