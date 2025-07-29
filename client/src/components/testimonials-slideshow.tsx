import { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  location: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Little did I know that joining Nedaxer would completely transform my mindset! I quickly realized this isn't just about side income — it's about building real wealth. Best decision I've made!",
    name: "Aadhya Sharma",
    location: "India",
    image: "/testimonials/Aadhya Sharma.jpg"
  },
  {
    id: 2,
    quote: "I started confidently and watched my portfolio grow beyond expectations. Nedaxer helped me believe in the power of compounding and smart strategies. I'm proud to be part of this revolution.",
    name: "Arjun Mehta", 
    location: "India",
    image: "/testimonials/Arjun Mehta.jpg"
  },
  {
    id: 3,
    quote: "Nedaxer is the best thing that happened to my finances this year! Within weeks, I was seeing consistent returns. I've since increased my capital and it just keeps getting better.",
    name: "Yuki Nakamura",
    location: "Japan", 
    image: "/testimonials/Yuki Nakamura.jpg"
  },
  {
    id: 4,
    quote: "I used to think I needed a finance degree to invest smartly — then I found Nedaxer. Their guidance and platform made everything easy and rewarding.",
    name: "Isla Morrison",
    location: "Australia",
    image: "/testimonials/Isla Morrison.jpg"
  },
  {
    id: 5,
    quote: "With Nedaxer, I'm finally making my money work for me. In just two months, my earnings covered my rent! I can't wait to see what the next months bring.",
    name: "Carlos Méndez",
    location: "Mexico",
    image: "/testimonials/Carlos Méndez.jpg"
  },
  {
    id: 6,
    quote: "I've been trading for years, but Nedaxer brought a new level of professionalism. Their systems are smart, reliable, and the support team is top-notch. I'm all in!",
    name: "Luca Romano",
    location: "Italy",
    image: "/testimonials/Luca Romano.jpg"
  },
  {
    id: 7,
    quote: "I was hesitant to try crypto investments, but Nedaxer made it easy to understand and start. The community support is amazing — my returns are more than I ever expected!",
    name: "Sophie Lefevre",
    location: "France",
    image: "/testimonials/Sophie Lefevre.png"
  },
  {
    id: 8,
    quote: "From my very first payout, I knew I made the right decision with Nedaxer. I started with $850 and the growth has been steady ever since. It's not just an investment — it's a strategy for financial freedom.",
    name: "Karen Wise Sternberg",
    location: "Canada",
    image: "/testimonials/Karen Wise Sternberg.jpg"
  },
  {
    id: 9,
    quote: "I've already recommended Nedaxer to my friends because it actually works. Starting with $1,000, I'm now confidently growing my capital every single month!",
    name: "Sophia Rossi",
    location: "Italy",
    image: "/testimonials/Sophia Rossi.jpg"
  },
  {
    id: 10,
    quote: "I didn't think I could manage multiple investments, but Nedaxer simplified everything. My profits have exceeded my expectations and I'm feeling more confident about my financial future!",
    name: "Maya Patel",
    location: "United Kingdom",
    image: "/testimonials/Miguel Torres.jpg"
  }
];

export default function TestimonialsSlideshow() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: true,
  });

  // Auto-advance every 10 seconds
  useEffect(() => {
    if (!emblaApi) return;

    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 10000);

    return () => clearInterval(autoScroll);
  }, [emblaApi]);

  return (
    <section 
      className="relative py-8 sm:py-12 md:py-16 overflow-hidden"
      style={{
        backgroundImage: `url('/attached_assets/Screenshot_20250718-030008_Phoenix_1752804174994.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8c00] to-[#0033a0]">Clients</span> Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover how Nedaxer has transformed the investment journey for thousands of clients worldwide
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#ff8c00] to-[#0033a0] mx-auto"></div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <div key={testimonial.id} className="transform transition-all duration-300 hover:scale-105">
                {/* Desktop testimonial card */}
                <div className="bg-white rounded-2xl shadow-xl relative overflow-hidden min-h-[500px] hover:shadow-2xl transition-all duration-300">
                  
                  {/* Background decorative elements */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gray-100 rounded-full opacity-40 -translate-x-8 -translate-y-8"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#1e3a8a] rounded-full opacity-10 translate-x-6 translate-y-6"></div>
                  
                  <div className="flex flex-col h-full">
                    
                    {/* Profile Image Section */}
                    <div className="flex items-center justify-center p-6 relative">
                      <div className="relative w-full max-w-xs">
                        {/* Background decorative circle behind image */}
                        <div className="absolute inset-0 bg-gray-100 rounded-full opacity-50 scale-110"></div>
                        
                        {/* Main profile image */}
                        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-3 border-white z-10">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='%236b7280'%3EProfile%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col justify-center p-6 pt-0 relative z-20 flex-grow">
                      
                      {/* Large Quote Marks */}
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-[#1e3a8a] leading-none block">"</span>
                      </div>

                      {/* Testimonial Text */}
                      <div className="mb-4 flex-grow">
                        <p className="text-gray-800 text-sm leading-relaxed font-normal">
                          {testimonial.quote}
                        </p>
                      </div>

                      {/* Client Information */}
                      <div className="mt-auto">
                        <h3 className="text-lg font-bold text-[#1e3a8a] mb-1">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-black font-medium">
                          {testimonial.location}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Bottom accent elements */}
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#ff4757] rounded-tr-full opacity-90"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 bg-[#1e3a8a] rounded-tl-full opacity-90"></div>
                      
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Swipeable Testimonial Cards */}
        <div className="lg:hidden">
          <div className="relative w-full">
            <div className="overflow-visible" ref={emblaRef} style={{ marginLeft: '-5vw', marginRight: '-5vw' }}>
              <div className="flex">
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="flex-[0_0_85vw] min-w-0 pl-[5vw]">
                    {/* Mobile testimonial card */}
                    <div className="bg-white rounded-2xl shadow-xl relative overflow-hidden min-h-[350px] md:min-h-[400px] mx-2">
                      
                      {/* Background decorative elements - reduced size */}
                      <div className="absolute top-0 left-0 w-48 h-48 bg-gray-100 rounded-full opacity-40 -translate-x-12 -translate-y-12"></div>
                      <div className="absolute bottom-0 right-0 w-36 h-36 bg-[#1e3a8a] rounded-full opacity-10 translate-x-8 translate-y-8"></div>
                      
                      <div className="flex flex-col lg:flex-row h-full">
                        
                        {/* Left side - Profile Image Section */}
                        <div className="lg:w-1/2 flex items-center justify-center p-4 lg:p-6 relative">
                          <div className="relative w-full max-w-xs">
                            {/* Background decorative circle behind image */}
                            <div className="absolute inset-0 bg-gray-100 rounded-full opacity-50 scale-110"></div>
                            
                            {/* Main profile image - reduced size */}
                            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden shadow-xl border-3 border-white z-10">
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='%236b7280'%3EProfile%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right side - Content Area */}
                        <div className="lg:w-1/2 flex flex-col justify-center p-4 lg:p-6 lg:pl-4 relative z-20">
                          
                          {/* Large Quote Marks - reduced size */}
                          <div className="mb-4">
                            <span className="text-4xl lg:text-5xl font-bold text-[#1e3a8a] leading-none block">"</span>
                          </div>

                          {/* Testimonial Text - reduced size */}
                          <div className="mb-4">
                            <p className="text-gray-800 text-sm lg:text-base leading-relaxed font-normal mb-4">
                              {testimonial.quote}
                            </p>
                          </div>

                          {/* Client Information - reduced size */}
                          <div className="mt-auto">
                            <h3 className="text-lg lg:text-xl font-bold text-[#1e3a8a] mb-1">
                              {testimonial.name}
                            </h3>
                            <p className="text-sm lg:text-base text-black font-medium">
                              {testimonial.location}
                            </p>
                          </div>

                        </div>

                      </div>

                      {/* Bottom accent elements - reduced size */}
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#ff4757] rounded-tr-full opacity-90"></div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#1e3a8a] rounded-tl-full opacity-90"></div>
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}