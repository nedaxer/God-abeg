import { platformFeatures } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Custom icon component to map icon names to JSX
const DynamicIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'shield-check':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'secure-payment':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <line x1="12" y1="15" x2="12" y2="18" />
        </svg>
      );
    case 'dashboard-3':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
          <circle cx="6" cy="6" r="1" />
        </svg>
      );
    default:
      return <div className="w-12 h-12" />;
  }
};

export const PlatformFeatures = () => {
  return (
    <section className="py-12 bg-[#0033a0] text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Why Trade with Nedaxer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platformFeatures.map((feature, index) => (
            <div key={index} className="text-center px-4">
              <div className="mb-4 flex justify-center text-[#ff5900]">
                <DynamicIcon name={feature.icon} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            asChild
            className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold px-8 py-3 rounded-md"
          >
            <Link href="#">Open Account</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="ml-4 bg-transparent border border-white hover:bg-white hover:bg-opacity-20 text-white font-semibold px-8 py-3 rounded-md"
          >
            <Link href="#">Try Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
