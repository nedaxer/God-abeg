import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Users, FileCheck, Shield, Globe } from 'lucide-react';

const trustedWorldwideData = [
  {
    icon: Users,
    title: 'Social',
    description: 'More than 35 million users globally',
  },
  {
    icon: FileCheck,
    title: 'Reliable',
    description: 'A leader in the fintech space since 2007',
  },
  {
    icon: Shield,
    title: 'Secured',
    description: 'Utilising best security practices for client money and assets safety',
  },
  {
    icon: Globe,
    title: 'Global',
    description: 'Providing services around the world',
  },
];

export const TrustedWorldwideCards = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: true,
  });

  // Auto-scroll functionality
  useEffect(() => {
    if (!emblaApi) return;

    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(autoScroll);
  }, [emblaApi]);

  return (
    <section 
      className="py-8 md:py-12 relative" 
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
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Trusted worldwide
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            Discover why millions of investors from over 100 countries joined Nedaxer
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {trustedWorldwideData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="p-8 shadow-md hover:shadow-lg transition-shadow h-48 flex flex-col justify-between"
                style={{ backgroundColor: '#ff8c00' }}
              >
                <div>
                  <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white text-center mb-4">
                    {item.title}
                  </h3>
                </div>
                <p className="text-white text-opacity-90 text-center text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile Carousel Layout with continuous swiping */}
        <div className="md:hidden">
          <div className="overflow-visible" ref={emblaRef} style={{ marginLeft: '-5vw', marginRight: '-5vw' }}>
            <div className="flex">
              {trustedWorldwideData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="flex-[0_0_85vw] min-w-0 pl-[5vw]"
                  >
                    <div 
                      className="p-6 shadow-md mx-2 h-48 flex flex-col justify-between"
                      style={{ backgroundColor: '#ff8c00' }}
                    >
                      <div>
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white text-center mb-3">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-white text-opacity-90 text-center text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};