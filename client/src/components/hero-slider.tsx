import { useState, useEffect } from "react";
import { heroSlides } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Auto advance slides every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[500px] md:h-[500px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image}
              className="w-full h-full object-cover"
              alt={slide.alt}
            />
            <div className="absolute inset-0 bg-[#003366] bg-opacity-50"></div>
          </div>
          <div className="relative z-10 h-full flex items-center px-4 md:px-8">
            <div className="bg-[#0033a0] bg-opacity-70 p-6 md:p-8 text-white rounded-md max-w-[500px]">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h1>
              <p className="text-lg mb-6">{slide.description}</p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold px-6 py-3"
                >
                  <Link href={slide.primaryButton.href}>{slide.primaryButton.label}</Link>
                </Button>
                {slide.secondaryButton && (
                  <Button
                    asChild
                    variant="outline"
                    className="bg-transparent border border-white hover:bg-white hover:bg-opacity-20 text-white font-semibold"
                  >
                    <Link href={slide.secondaryButton.href}>{slide.secondaryButton.label}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full focus:outline-none ${
              index === currentSlide
                ? "bg-white"
                : "bg-white bg-opacity-70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};
