import { platformFeatures } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Custom icon component to map icon names to JSX
const DynamicIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'shield-check':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'secure-payment':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <line x1="12" y1="15" x2="12" y2="18" />
        </svg>
      );
    case 'dashboard-3':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
          <circle cx="6" cy="6" r="1" />
        </svg>
      );
    default:
      return <div className="w-8 h-8" />;
  }
};

export const PlatformFeatures = () => {
  return (
    <section 
      className="py-6 md:py-8 text-white relative"
      style={{
        backgroundColor: '#000d2e',
        backgroundImage: `url('/attached_assets/afa6f2bb667fc21e47a33f30e6a8da21_1753011776454.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Deep blue overlay for transparency effect */}
      <div className="absolute inset-0 bg-[#000d2e] bg-opacity-70 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-6">
          Why Invest with Nedaxer
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platformFeatures.map((feature, index) => (
            <div key={index} className="text-center px-3">
              <div className="mb-3 flex justify-center text-[#ff5900]">
                <DynamicIcon name={feature.icon} />
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Button
            asChild
            className="bg-[#ff5900] hover:bg-opacity-90 text-white font-medium px-6 py-2 rounded-md text-sm"
          >
            <Link href="#">Open Account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
