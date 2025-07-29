import { useState, useEffect, useRef } from 'react';

interface SkillData {
  name: string;
  percentage: number;
}

const skillsData: SkillData[] = [
  { name: 'FOCUS', percentage: 100 },
  { name: 'DISCIPLINE & PATIENCE', percentage: 97 },
  { name: 'MENTAL TOUGHNESS', percentage: 90 },
  { name: 'RECORD KEEPING', percentage: 87 }
];

export const InvestmentSkills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            startAnimation();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  const startAnimation = () => {
    skillsData.forEach((skill, index) => {
      let currentPercentage = 0;
      const increment = skill.percentage / 60; // 60 frames for smooth animation
      const delay = index * 200; // Stagger animations

      setTimeout(() => {
        const animateBar = () => {
          currentPercentage += increment;
          if (currentPercentage >= skill.percentage) {
            currentPercentage = skill.percentage;
          }

          setAnimatedPercentages(prev => {
            const newPercentages = [...prev];
            newPercentages[index] = Math.round(currentPercentage);
            return newPercentages;
          });

          if (currentPercentage < skill.percentage) {
            requestAnimationFrame(animateBar);
          }
        };

        animateBar();
      }, delay);
    });
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ff8c00 0%, #ffa500 30%, #ff8c00 70%, #ff7f00 100%)'
      }}
    >
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#000d2e] mb-6 leading-tight">
              Our Investment &<br />
              Management<br />
              Skillsets
            </h2>
            <p className="text-base md:text-lg text-[#000d2e] max-w-2xl">
              Our performance over the past 7 years all summarized, 
              giving this outstanding and superb result. Indeed we are 
              one of the best!
            </p>
          </div>

          {/* Skills Progress Bars */}
          <div className="space-y-8 md:space-y-12">
            {skillsData.map((skill, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg md:text-xl font-semibold text-[#000d2e] tracking-wide">
                    {skill.name}
                  </h3>
                  <span className="text-2xl md:text-3xl font-bold text-[#000d2e]">
                    {animatedPercentages[index]}%
                  </span>
                </div>
                
                {/* Progress Bar Container */}
                <div className="relative">
                  <div className="w-full h-3 md:h-4 bg-black bg-opacity-30 rounded-full overflow-hidden">
                    {/* Animated Progress Bar */}
                    <div
                      className="h-full transition-all duration-75 ease-out rounded-full relative"
                      style={{
                        width: `${animatedPercentages[index]}%`,
                        transformOrigin: 'left center',
                        background: '#000d2e'
                      }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300 via-transparent to-transparent opacity-20 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Progress indicator dot */}
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full shadow-lg transition-all duration-75 ease-out"
                    style={{
                      left: `calc(${animatedPercentages[index]}% - 8px)`,
                      opacity: animatedPercentages[index] > 0 ? 1 : 0,
                      backgroundColor: '#000d2e'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};