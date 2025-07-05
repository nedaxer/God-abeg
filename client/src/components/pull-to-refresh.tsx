import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './pull-to-refresh-styles.css';
import { hapticMedium } from '@/lib/haptics';


// Add haptic feedback utility with moderate vibration
const triggerHapticFeedback = () => {
  hapticMedium(); // Use medium haptic feedback for noticeable but gentle vibration
};

// Import the assets
import refreshLogo from '@/assets/Refresh  app logo_1750782062607.png';
import letterN from '@/assets/20250618_001640_1750782086856.png';
import letterE1 from '@/assets/20250618_001710_1750782086866.png';
import letterD from '@/assets/20250618_001748_1750782086877.png';
import letterA from '@/assets/20250618_001828_1750782086889.png';
import letterX from '@/assets/20250618_001859_1750782086919.png';
import letterE2 from '@/assets/20250618_001938_1750782086928.png';
import letterR from '@/assets/20250618_002006_1750782086936.png';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

const LOGO_START_THRESHOLD = 60;
const LOGO_COMPLETE_THRESHOLD = 160;
const PULL_THRESHOLD = 180;
const MAX_PULL_DISTANCE = 220;
const letters = [letterN, letterE1, letterD, letterA, letterX, letterE2, letterR];

export function PullToRefresh({ children, onRefresh, disabled = false }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false);
  const [showNedaxerHeader, setShowNedaxerHeader] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();



  const handleTouchStart = (e: TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    const touch = e.touches[0];
    setStartY(touch.clientY);
    setIsPulling(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (disabled || isRefreshing || !isPulling) return;

    const touch = e.touches[0];
    const currentY = touch.clientY;
    const deltaY = currentY - startY;

    // Only allow pull when at top of page
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 0) return;

    if (deltaY > 0) {
      e.preventDefault();
      
      // Apply smooth resistance curve for natural feel
      let resistance;
      if (deltaY <= LOGO_START_THRESHOLD) {
        resistance = deltaY; // Direct 1:1 movement at start for smooth feel
      } else if (deltaY <= LOGO_COMPLETE_THRESHOLD) {
        resistance = LOGO_START_THRESHOLD + (deltaY - LOGO_START_THRESHOLD) * 0.85;
      } else {
        resistance = LOGO_COMPLETE_THRESHOLD + (deltaY - LOGO_COMPLETE_THRESHOLD) * 0.5;
      }
      resistance = Math.min(resistance, MAX_PULL_DISTANCE);
      
      // Trigger haptic feedback when refresh header reaches its end point
      if (resistance >= MAX_PULL_DISTANCE && !hasTriggeredHaptic) {
        triggerHapticFeedback();
        setHasTriggeredHaptic(true);
      }
      
      // Direct update for smooth response
      setPullDistance(resistance);
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing || !isPulling) return;

    setIsPulling(false);
    setHasTriggeredHaptic(false);

    // Only trigger refresh if pulled all the way to the threshold
    if (pullDistance >= PULL_THRESHOLD) {
      // Immediately reset pull distance to make logo return
      setPullDistance(0);
      setIsRefreshing(true);
      setIsReturning(true);
      
      // Show Nedaxer header immediately
      setShowNedaxerHeader(true);
      
      try {
        await onRefresh();
        // Keep refreshing animation for 2 seconds as requested
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        // Hide Nedaxer header after refresh completes
        setTimeout(() => {
          setShowNedaxerHeader(false);
          setIsReturning(false);
        }, 500);
      }
    } else {
      // Smoothly reset pull distance if not refreshing
      const resetAnimation = () => {
        setPullDistance(prev => {
          const newDistance = prev * 0.9; // Slightly slower decay for smoother animation
          if (newDistance > 2) {
            requestAnimationFrame(resetAnimation);
            return newDistance;
          }
          setIsReturning(false);
          return 0;
        });
      };
      resetAnimation();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPulling, startY, pullDistance, isRefreshing, disabled, hasTriggeredHaptic]);

  const showLogo = pullDistance >= LOGO_START_THRESHOLD;
  const logoComplete = pullDistance >= LOGO_COMPLETE_THRESHOLD;
  const showReleaseMessage = pullDistance >= PULL_THRESHOLD;

  const getLogoOpacity = () => {
    if (!showLogo) return 0;
    if (logoComplete) return 1;
    const progress = Math.min(Math.max((pullDistance - LOGO_START_THRESHOLD) / (LOGO_COMPLETE_THRESHOLD - LOGO_START_THRESHOLD), 0), 1);
    return progress;
  };

  const getLogoScale = () => {
    if (!showLogo) return 0.3;
    if (logoComplete) return 1;
    const progress = Math.min(Math.max((pullDistance - LOGO_START_THRESHOLD) / (LOGO_COMPLETE_THRESHOLD - LOGO_START_THRESHOLD), 0), 1);
    // Smooth easing for scale animation
    const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
    return 0.3 + (easedProgress * 0.7);
  };

  const getScrollProgress = () => {
    return Math.min(pullDistance / MAX_PULL_DISTANCE, 1);
  };

  const logoOpacity = getLogoOpacity();
  const logoScale = getLogoScale();
  const scrollProgress = getScrollProgress();

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Pull indicator with orange gradient blending to Midnight Blue */}
      {pullDistance > 0 && (
        <div 
          className="relative overflow-hidden"
          style={{
            height: pullDistance,
            background: 'linear-gradient(180deg, hsl(39, 90%, 45%) 0%, hsl(39, 85%, 42%) 15%, hsl(39, 75%, 38%) 30%, hsl(39, 65%, 35%) 45%, #0a0a2e 60%, #0b0b30 75%, #0c0c32 90%, #0a0a2e 100%)',
            transition: 'none'
          } as React.CSSProperties}
        >
          {/* Smooth gradient transition that blends perfectly with mobile page */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(10, 10, 46, 0) 0%, rgba(10, 10, 46, 0.2) 20%, rgba(10, 10, 46, 0.4) 40%, rgba(10, 10, 46, 0.6) 60%, rgba(10, 10, 46, 0.8) 80%, #0a0a2e 100%)'
            }}
          />
          
          {/* Logo mounted on background without animations */}
          {pullDistance > LOGO_START_THRESHOLD && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div 
                className="flex items-center justify-center w-full relative"
                style={{
                  height: '100%'
                }}
              >
                <img
                  src={refreshLogo}
                  alt="Refresh Logo"
                  className="object-contain drop-shadow-2xl"
                  style={{
                    height: 'calc(100% - 10px)',
                    width: 'auto',
                    maxWidth: 'calc(100% - 10px)',
                    filter: 'brightness(1.2) contrast(1.15) drop-shadow(0 12px 36px rgba(0,0,0,0.4))'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Single Nedaxer header with release message */}
      <AnimatePresence>
        {showNedaxerHeader && (
          <>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 50, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.6, 
                ease: "easeInOut",
                height: { duration: 0.5 },
                opacity: { duration: 0.3 }
              }}
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #0a0a2e 0%, #0b0b30 50%, #0a0a2e 100%)'
              }}
            >
              <motion.div
                initial={{ y: -20, scale: 0.9 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: -20, scale: 0.9 }}
                transition={{ 
                  delay: 0.1, 
                  duration: 0.5, 
                  type: "spring",
                  stiffness: 250,
                  damping: 25
                }}
                className="flex items-center justify-center h-full px-3"
              >
                <div className="flex items-center space-x-1">
                  {letters.map((letter, index) => (
                    <motion.img
                      key={`header-${index}`}
                      src={letter}
                      alt={`Letter ${index + 1}`}
                      className="h-4 w-auto flex-shrink-0 drop-shadow-lg"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ 
                        opacity: 1, 
                        y: [0, -6, 0]
                      }}
                      transition={{
                        opacity: {
                          delay: 0.3 + (index * 0.08),
                          duration: 0.4
                        },
                        y: {
                          delay: 0.5 + (index * 0.08),
                          duration: 0.7,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut"
                        }
                      }}
                    />
                  ))}
                </div>
              </motion.div>
              
              {/* Compact gradient blend with mobile page */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(55, 65, 81, 0.5) 0%, rgba(51, 65, 85, 0.3) 50%, transparent 100%)'
                }}
              />
            </motion.div>

            {/* Release to refresh message positioned under header */}
            {hasTriggeredHaptic && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative text-center py-2"
                style={{
                  background: 'linear-gradient(180deg, hsl(220, 13%, 18%) 0%, hsl(220, 13%, 15%) 100%)'
                }}
              >
                <p className="text-white text-sm font-semibold drop-shadow-xl">
                  Release to refresh
                </p>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}