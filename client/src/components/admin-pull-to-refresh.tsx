import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, RefreshCw } from 'lucide-react';

// Add haptic feedback utility
const triggerHapticFeedback = () => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(50); // Light vibration for 50ms
  }
};

interface AdminPullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

const ICON_START_THRESHOLD = 60;
const ICON_COMPLETE_THRESHOLD = 140;
const PULL_THRESHOLD = 160;
const MAX_PULL_DISTANCE = 200;

export function AdminPullToRefresh({ children, onRefresh, disabled = false }: AdminPullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false);
  const [showAdminHeader, setShowAdminHeader] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      if (deltaY <= ICON_START_THRESHOLD) {
        resistance = deltaY;
      } else if (deltaY <= ICON_COMPLETE_THRESHOLD) {
        resistance = ICON_START_THRESHOLD + (deltaY - ICON_START_THRESHOLD) * 0.8;
      } else {
        resistance = ICON_COMPLETE_THRESHOLD + (deltaY - ICON_COMPLETE_THRESHOLD) * 0.4;
      }
      resistance = Math.min(resistance, MAX_PULL_DISTANCE);
      
      // Show admin header when icon appears
      if (resistance >= ICON_START_THRESHOLD && !showAdminHeader) {
        setShowAdminHeader(true);
      }
      
      // Trigger haptic feedback when fully pulled
      if (resistance >= PULL_THRESHOLD && !hasTriggeredHaptic) {
        triggerHapticFeedback();
        setHasTriggeredHaptic(true);
      }
      
      setPullDistance(resistance);
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing || !isPulling) return;

    const wasPulledEnough = pullDistance >= PULL_THRESHOLD;
    
    setIsPulling(false);
    setHasTriggeredHaptic(false);
    setShowAdminHeader(false);

    // Trigger refresh if pulled enough
    if (wasPulledEnough) {
      setIsRefreshing(true);
      setPullDistance(0);
      
      try {
        await onRefresh();
        console.log('✅ Admin refresh completed successfully');
      } catch (error) {
        console.error('❌ Admin refresh error:', error);
      } finally {
        // Reset all states completely for next pull
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
          setIsPulling(false);
          setHasTriggeredHaptic(false);
          setShowAdminHeader(false);
          console.log('🔄 Admin pull-to-refresh reset for next use');
        }, 1500); // Show refresh animation for 1.5 seconds
      }
    } else {
      // Smooth return to original position
      setPullDistance(0);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchCancel = () => {
      // Reset states if touch is cancelled
      setIsPulling(false);
      setHasTriggeredHaptic(false);
      setShowAdminHeader(false);
      setPullDistance(0);
      console.log('🔄 Touch cancelled, resetting admin pull-to-refresh');
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [isPulling, pullDistance, startY, hasTriggeredHaptic, showAdminHeader]);

  // Auto-reset if stuck in pulling state
  useEffect(() => {
    if (isPulling) {
      const resetTimer = setTimeout(() => {
        if (isPulling && !isRefreshing) {
          console.log('🔄 Auto-resetting stuck pull state');
          setIsPulling(false);
          setHasTriggeredHaptic(false);
          setShowAdminHeader(false);
          setPullDistance(0);
        }
      }, 5000); // Reset after 5 seconds if stuck

      return () => clearTimeout(resetTimer);
    }
  }, [isPulling, isRefreshing]);

  // Calculate icon scale based on pull distance
  const iconScale = Math.min(pullDistance / ICON_COMPLETE_THRESHOLD, 1);
  const iconOpacity = Math.min(pullDistance / ICON_START_THRESHOLD, 1);
  const iconRotation = (pullDistance / PULL_THRESHOLD) * 360;
  
  // Calculate background opacity
  const bgOpacity = Math.min(pullDistance / ICON_COMPLETE_THRESHOLD, 0.95);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        transform: `translateY(${pullDistance}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* Pull indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-0 z-50 flex flex-col items-center justify-center"
            style={{
              height: `${Math.max(pullDistance, isRefreshing ? 120 : 0)}px`,
              background: `linear-gradient(180deg, 
                rgba(10, 10, 46, ${bgOpacity}) 0%, 
                rgba(11, 11, 48, ${bgOpacity * 0.8}) 40%,
                rgba(12, 12, 50, ${bgOpacity * 0.6}) 70%,
                rgba(13, 13, 52, ${bgOpacity * 0.4}) 100%)`
            }}
          >
            {/* Admin Shield Icon */}
            <motion.div
              className="relative"
              style={{
                transform: `scale(${iconScale})`,
                opacity: iconOpacity
              }}
            >
              {isRefreshing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-8 h-8 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  style={{ transform: `rotate(${iconRotation}deg)` }}
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Admin Portal Text */}
            <AnimatePresence>
              {(showAdminHeader || isRefreshing) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center mt-3"
                >
                  <div className="text-white font-bold text-lg tracking-wide">
                    ADMIN PORTAL
                  </div>
                  <div className="text-blue-200 text-sm mt-1">
                    {isRefreshing ? 'Refreshing data...' : 
                     pullDistance >= PULL_THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}