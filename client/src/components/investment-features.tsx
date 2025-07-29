import React from 'react';

const investmentFeatures = [
  {
    title: "Easy and User friendly dashboard",
    description: "Manage multiple investments using our powerful cutting-edge dashboard built on modern technology."
  },
  {
    title: "Security",
    description: "Your security is always our top priority, with top notch and advanced encryptions your funds are always safe from bad players."
  },
  {
    title: "Robust Plans",
    description: "With an evergrowing system to suit your various needs while actively cutting down on risks"
  },
  {
    title: "Wealth Planning",
    description: "Work with your dedicated advisor team tasked to help you build a comprehensive financial strategy to help grow and preserve your wealth."
  },
  {
    title: "24/7 Support",
    description: "We provide round the clock customer support for all our clients. You are and will always be a priority to us."
  },
  {
    title: "Cryptocurrency Deposits and withdrawals",
    description: "Easily deposit and process withdrawals in supported cryptocurrencies which are fast, safe and reliable."
  }
];

export const InvestmentFeatures = () => {
  return (
    <section className="py-8" style={{ backgroundColor: '#000d2e' }}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Safer and smarter investments.
          </h2>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto">
            We have successfully developed and built an efficient investment system that not only meets your goals but takes you further.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {investmentFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-4 shadow-lg transform hover:scale-105 transition-all duration-300 animate-bounce"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '2s',
                animationIterationCount: 'infinite',
                animationDirection: 'alternate'
              }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              {/* Orange underline to match theme */}
              <div className="w-10 h-1 bg-[#ff8c00] mb-3"></div>
              <p className="text-gray-700 text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};