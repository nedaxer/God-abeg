import { tradeOptions } from "@/lib/constants";
import { Link } from "wouter";
import { Check, ArrowRight } from "lucide-react";

export const TradeOptions = () => {
  return (
    <section className="py-12 bg-[#f5f5f5]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-[#0033a0]">
          Trade on Web Trading Platform
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tradeOptions.map((option, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-[#0033a0] relative">
                {option.title === "Call Spreads" ? (
                  <video
                    src="/videos/call-spread-demo.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-[#0033a0] bg-opacity-50 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{option.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="mb-4 text-gray-800">{option.description}</p>
                <ul className="mb-6 space-y-2">
                  {option.features.map((feature, featIndex) => (
                    <li key={featIndex} className="flex items-start">
                      <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-800">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={option.learnMoreLink}
                  className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
