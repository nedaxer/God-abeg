import { ReactNode, useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  bgColor?: string;
  bgImage?: string;
}

// Loading spinner component
const LoadingSpinner = () => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-50">
    <div className="relative">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#0033a0]"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#0033a0] font-semibold">
        Loading...
      </div>
    </div>
  </div>
);

export const PageLayout = ({
  children,
  title,
  subtitle,
  bgColor = "#0033a0",
  bgImage,
}: PageLayoutProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure the page is fully loaded before rendering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <LoadingSpinner />}
      
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        <Header />
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative py-16 md:py-24" style={{ backgroundColor: bgColor }}>
            <div className="container mx-auto px-4 relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>
              {subtitle && <p className="text-xl text-white opacity-90 max-w-3xl">{subtitle}</p>}
            </div>
            {bgImage && (
              <div className="absolute inset-0 opacity-30">
                <img src={bgImage} alt={title} className="w-full h-full object-cover" />
              </div>
            )}
          </section>
          
          {/* Page Content */}
          <div className="py-12">
            <div className="container mx-auto px-4">
              {children}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};