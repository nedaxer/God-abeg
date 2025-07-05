import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './optimized-image';

import nLetter from '@/assets/20250618_001640_1750207793691.png';
import eLetter1 from '@/assets/20250618_001710_1750207793694.png';
import dLetter from '@/assets/20250618_001748_1750207793698.png';
import aLetter from '@/assets/20250618_001828_1750207793703.png';
import xLetter from '@/assets/20250618_001859_1750207793716.png';
import eLetter2 from '@/assets/20250618_001938_1750207793727.png';
import rLetter from '@/assets/20250618_002006_1750207793730.png';
import backgroundImage from '@/assets/file_00000000e0d461f9b4be5c8627966318_1750209747614.png';
import nedaxerLogo from '@/assets/20250618_042459_1750217238332.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showLogo, setShowLogo] = useState(true);
  const [showClones, setShowClones] = useState(false);
  const [hideOriginals, setHideOriginals] = useState(false);
  const [showNedaxerLogo, setShowNedaxerLogo] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });


  // Images will be preloaded automatically by OptimizedImage component

  useEffect(() => {
    // Check if splash screen should be skipped (for admin portal)
    const skipSplash = sessionStorage.getItem('skipSplashScreen');
    if (skipSplash === 'true') {
      onComplete();
      return;
    }

    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    
    // Preload background image and all letter images for instant display
    const imagesToPreload = [
      backgroundImage,
      nLetter,
      eLetter1,
      dLetter,
      aLetter,
      xLetter,
      eLetter2,
      rLetter,
      nedaxerLogo
    ];
    
    const preloadLinks = imagesToPreload.map(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
      return link;
    });
    
    // Also create Image objects for immediate caching
    const imageObjects = imagesToPreload.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    
    return () => {
      window.removeEventListener('resize', updateWindowSize);
      preloadLinks.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, []);

  // Letters for 4-second launch animation
  const letters = [
    { src: nLetter, alt: 'N', from: { x: -windowSize.width, y: 0 }, delay: 0 },
    { src: eLetter1, alt: 'E', from: { x: windowSize.width, y: 0 }, delay: 0.1 },
    { src: dLetter, alt: 'D', from: { x: -windowSize.width, y: 0 }, delay: 0.2 },
    { src: aLetter, alt: 'A', from: { x: windowSize.width, y: 0 }, delay: 0.3 },
    { src: xLetter, alt: 'X', from: { x: -windowSize.width, y: 0 }, delay: 0.4 },
    { src: eLetter2, alt: 'E', from: { x: windowSize.width, y: 0 }, delay: 0.5 },
    { src: rLetter, alt: 'R', from: { x: -windowSize.width, y: 0 }, delay: 0.6 },
  ];

  useEffect(() => {
    // Show clones and hide originals after letters are arranged
    const clonesTimer = setTimeout(() => {
      setHideOriginals(true);
      setShowClones(true);
    }, 800); // 0.8 seconds for letters to arrange

    // Show NEDAXER logo after clones disappear
    const nedaxerLogoTimer = setTimeout(() => {
      setShowClones(false);
      setShowNedaxerLogo(true);
    }, 1300); // 1.3 seconds total

    // Complete animation after exactly 3 seconds
    const timer = setTimeout(() => {
      setShowLogo(false);
      setTimeout(onComplete, 300); // Quick fade out
    }, 3000); // Exactly 3 seconds

    return () => {
      clearTimeout(clonesTimer);
      clearTimeout(nedaxerLogoTimer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showLogo && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          style={{
            backgroundImage: 'url(/optimized/images/splash-background.webp), url(/optimized/images/splash-background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >

          {/* Movie-style letter animation container */}
          <div className="relative flex items-center justify-center space-x-1 md:space-x-2 z-10">
            {letters.map((letter, index) => (
              <motion.div
                key={index}
                initial={{
                  x: letter.from.x,
                  y: letter.from.y,
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  opacity: hideOriginals ? 0 : 1,
                  scale: hideOriginals ? 0.8 : 1,
                }}
                transition={{
                  delay: letter.delay,
                  duration: hideOriginals ? 0.3 : 0.8,
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                  ease: "easeOut",
                }}
                className="relative"
              >
                <motion.img
                  src={letter.src}
                  alt={letter.alt}
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain"
                />
                
                {/* Clone letter positioned exactly over original */}
                <AnimatePresence>
                  {showClones && (
                    <motion.div
                      key={`clone-${index}`}
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        delay: 0,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      className="absolute inset-0"
                    >
                      <motion.img
                        src={letter.src}
                        alt={`${letter.alt}-clone`}
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}


          </div>

          {/* NEDAXER Logo Display */}
          <AnimatePresence>
            {showNedaxerLogo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center z-20"
              >
                <motion.img
                  src={nedaxerLogo}
                  alt="NEDAXER"
                  className="w-40 h-16 object-contain"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thanks message at bottom */}
          <motion.div
            className="absolute bottom-8 left-0 right-0 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p className="text-white text-sm font-medium tracking-wide">
              Welcome to the future of trading & investing
            </p>
            <p className="text-white/80 text-xs font-light tracking-wide mt-1">
              Thank you for choosing Nedaxer
            </p>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}