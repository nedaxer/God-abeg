import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  shouldAnimate?: boolean;
}

// Define routes that should NOT have the glass slide transition
const EXCLUDED_ROUTES = [
  '/mobile',
  '/mobile/',
  '/mobile/home',
  '/mobile/assets',
  '/mobile/trade',
  '/mobile/markets'
];

// Check if current route should be excluded from animations
const shouldExcludeRoute = (path: string): boolean => {
  return EXCLUDED_ROUTES.some(route => path === route);
};

export function PageTransition({ children, shouldAnimate = true }: PageTransitionProps) {
  const [location] = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile for performance optimization
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Don't animate excluded routes or if animation is disabled
  const shouldSkipAnimation = !shouldAnimate || shouldExcludeRoute(location);

  if (shouldSkipAnimation) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ 
          opacity: 0, 
          x: '100%',
          backdropFilter: 'blur(0px)'
        }}
        animate={{ 
          opacity: 1, 
          x: 0,
          backdropFilter: isMobile ? 'blur(5px)' : 'blur(10px)'
        }}
        exit={{ 
          opacity: 0, 
          x: '-100%',
          backdropFilter: 'blur(0px)'
        }}
        transition={{
          type: 'tween',
          ease: [0.22, 1, 0.36, 1], // Custom easing for smooth feel
          duration: isMobile ? 0.3 : 0.5, // Faster on mobile
          opacity: { duration: isMobile ? 0.2 : 0.3 },
          x: { duration: isMobile ? 0.3 : 0.5 },
          backdropFilter: { duration: isMobile ? 0.2 : 0.4 }
        }}
        className="page-transition-container"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          willChange: 'transform, opacity, backdrop-filter',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Higher-order component for wrapping route components
export function withPageTransition<T extends object>(
  Component: React.ComponentType<T>,
  shouldAnimate: boolean = true
) {
  return function WrappedComponent(props: T) {
    return (
      <PageTransition shouldAnimate={shouldAnimate}>
        <Component {...props} />
      </PageTransition>
    );
  };
}

// Hook for programmatic transition control
export function usePageTransition() {
  const [location, setLocation] = useLocation();
  
  const navigateWithTransition = (to: string, skipAnimation = false) => {
    if (skipAnimation || shouldExcludeRoute(to)) {
      setLocation(to);
    } else {
      // Add a small delay to ensure smooth transition
      setTimeout(() => setLocation(to), 50);
    }
  };

  return {
    location,
    navigateWithTransition,
    shouldExcludeRoute: (path: string) => shouldExcludeRoute(path)
  };
}