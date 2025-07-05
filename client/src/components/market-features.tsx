import { marketFeatures } from "@/lib/constants";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

// Custom icon component to map icon names to JSX
const DynamicIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'currency-bitcoin':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m3.94.694-.347 1.969M7.517 7.5l-.346-1.97M11.765 4.216l-.346-1.97M16 15h2M16 11h2M12 4v16"/>
        </svg>
      );
    case 'currency-ethereum':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M6 12l6-9 6 9M6 12l6 9 6-9M6 12l6-2 6 2"/>
        </svg>
      );
    case 'coins':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <circle cx="8" cy="8" r="6"/>
          <path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
          <path d="M7 6h1v4"/>
          <path d="m16.71 13.88.7.71-2.82 2.82"/>
        </svg>
      );
    case 'calendar-event':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <rect x="8" y="14" width="8" height="6" />
        </svg>
      );
    default:
      return <div className="w-6 h-6" />;
  }
};

export const MarketFeatures = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-[#0033a0]">
          Popular Markets
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketFeatures.map((feature, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl text-[#0033a0] mr-3">
                  <DynamicIcon name={feature.icon} />
                </span>
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </div>
              <p className="mb-4 text-gray-800">{feature.description}</p>
              <Link
                href={feature.link.href}
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center text-sm"
              >
                {feature.link.label} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
