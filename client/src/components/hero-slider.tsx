import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import nedaxerVideo from '@assets/Start your journey today with Nedaxer_20250718_223724_0000_1752875672090.mp4';

export const HeroSlider = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        if (video.currentTime >= 23.0) {
          video.pause();
        }
      };
      
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  return (
    <section className="relative h-[400px] md:h-[450px] overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={nedaxerVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay for content readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Content */}
      <div className="relative z-30 h-full flex items-center px-4 md:px-8">
        <div className="bg-[#0033a0] bg-opacity-80 p-4 md:p-6 text-white rounded-md max-w-[450px] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
          <h1 className="text-xl md:text-2xl font-semibold mb-3">Start Your Journey Today</h1>
          <p className="text-sm md:text-base mb-4">Begin your investment journey with Nedaxer. Access global markets with professional tools and expert support.</p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[#ff5900] hover:bg-opacity-90 text-white font-medium px-5 py-2 text-sm"
            >
              <Link href="/register">Open Account</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-transparent border border-white hover:bg-white hover:bg-opacity-20 text-white font-medium text-sm"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
