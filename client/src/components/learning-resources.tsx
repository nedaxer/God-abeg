import { learningResources } from "@/lib/constants";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export const LearningResources = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-3 text-[#0033a0]">
          Learn to Trade
        </h2>
        <p className="text-center text-gray-700 mb-6 max-w-3xl mx-auto text-sm">
          Access our comprehensive educational resources designed to help traders of all experience levels succeed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningResources.map((resource, index) => (
            <div key={index} className="bg-[#f5f5f5] rounded-lg overflow-hidden">
              {resource.title === "Crypto Webinars" ? (
                <video
                  src="https://res.cloudinary.com/dajvsbemy/video/upload/v1751728951/crypto-webinars-demo_fyeix4.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-32 object-cover"
                />
              ) : (
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-base font-semibold mb-2 text-[#0033a0]">{resource.title}</h3>
                <p className="mb-3 text-gray-800 text-sm">{resource.description}</p>
                {resource.link.href.startsWith('http') ? (
                  <a
                    href={resource.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0033a0] hover:text-[#ff5900] font-medium flex items-center text-xs"
                  >
                    {resource.link.label} <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                ) : (
                  <Link
                    href={resource.link.href}
                    className="text-[#0033a0] hover:text-[#ff5900] font-medium flex items-center text-xs"
                  >
                    {resource.link.label} <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
