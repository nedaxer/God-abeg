import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

export function AppInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the prompt before
    const hasHandledPrompt = localStorage.getItem("app-install-prompt") === "dismissed";
    
    if (hasHandledPrompt) {
      return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the default browser install prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show our custom install prompt
      setIsVisible(true);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {});
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the browser install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: {outcome: string}) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      // Reset the deferredPrompt variable
      setDeferredPrompt(null);
      setIsVisible(false);
      localStorage.setItem("app-install-prompt", "dismissed");
    });
  };

  const dismissPrompt = () => {
    setIsVisible(false);
    localStorage.setItem("app-install-prompt", "dismissed");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[10010] bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
      <button 
        onClick={dismissPrompt} 
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={16} />
      </button>
      <div className="flex flex-col items-center">
        <Download className="text-[#0033a0] mb-2 h-8 w-8" />
        <h3 className="text-lg font-bold mb-2 text-center">Install Nedaxer App</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Install our app for a better trading experience with offline capabilities and faster loading.
        </p>
        <Button 
          onClick={handleInstallClick}
          className="w-full bg-[#0033a0] hover:bg-opacity-90 text-white"
        >
          Install Now
        </Button>
      </div>
    </div>
  );
}