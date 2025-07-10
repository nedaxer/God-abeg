import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Shield, TrendingUp } from 'lucide-react';

interface ProfessionalAdminPullRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const ProfessionalAdminPullRefresh: React.FC<ProfessionalAdminPullRefreshProps> = ({
  onRefresh,
  children
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const PULL_THRESHOLD = 120;
  const MAX_PULL_DISTANCE = 180;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;

    if (deltaY > 0 && containerRef.current?.scrollTop === 0) {
      e.preventDefault();
      const newPullDistance = Math.min(deltaY * 0.6, MAX_PULL_DISTANCE);
      setPullDistance(newPullDistance);
    }
  };

  const handleTouchEnd = async () => {
    if (!isDragging) return;

    setIsDragging(false);

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.clientY;
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isRefreshing) return;

    currentY.current = e.clientY;
    const deltaY = currentY.current - startY.current;

    if (deltaY > 0 && containerRef.current?.scrollTop === 0) {
      e.preventDefault();
      const newPullDistance = Math.min(deltaY * 0.6, MAX_PULL_DISTANCE);
      setPullDistance(newPullDistance);
    }
  };

  const handleMouseUp = async () => {
    if (!isDragging) return;

    setIsDragging(false);

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, pullDistance]);

  const refreshProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const canRefresh = pullDistance >= PULL_THRESHOLD;

  return (
    <div 
      ref={containerRef}
      className="relative h-screen overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* Professional Refresh Indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: isRefreshing ? 1.1 : 1
            }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
            }}
          >
            <div className="flex flex-col items-center justify-center py-6 px-4">
              {/* Main Refresh Icon */}
              <motion.div
                animate={{
                  rotate: isRefreshing ? 360 : refreshProgress * 180,
                  scale: isRefreshing ? [1, 1.2, 1] : 1 + (refreshProgress * 0.3)
                }}
                transition={{
                  rotate: {
                    duration: isRefreshing ? 1 : 0,
                    repeat: isRefreshing ? Infinity : 0,
                    ease: "linear"
                  },
                  scale: {
                    duration: isRefreshing ? 0.6 : 0,
                    repeat: isRefreshing ? Infinity : 0,
                    ease: "easeInOut"
                  }
                }}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center mb-3
                  ${canRefresh || isRefreshing 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-green-500/25' 
                    : 'bg-gradient-to-r from-slate-600 to-slate-700'
                  }
                `}
              >
                <RefreshCw 
                  className={`w-7 h-7 text-white ${isRefreshing ? 'animate-spin' : ''}`} 
                />
              </motion.div>

              {/* Progress Ring */}
              <div className="relative w-20 h-20 mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgba(148, 163, 184, 0.2)"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={canRefresh ? "#10b981" : "#3b82f6"}
                    strokeWidth="3"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - refreshProgress)}`}
                    transition={{ duration: 0.1 }}
                  />
                </svg>
                
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: isRefreshing ? [1, 1.3, 1] : 1 }}
                    transition={{ duration: 0.6, repeat: isRefreshing ? Infinity : 0 }}
                  >
                    <Shield className="w-6 h-6 text-blue-400" />
                  </motion.div>
                </div>
              </div>

              {/* Professional Status Text */}
              <motion.div
                animate={{ opacity: isRefreshing ? [0.7, 1, 0.7] : 1 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
                className="text-center"
              >
                <div className="text-white font-semibold text-lg tracking-wide mb-1">
                  {isRefreshing ? 'REFRESHING DATA' : canRefresh ? 'RELEASE TO REFRESH' : 'ADMIN PORTAL'}
                </div>
                <div className="text-slate-300 text-sm flex items-center justify-center gap-2">
                  {isRefreshing ? (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                      <span>Updating dashboard...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      <span>Pull down to refresh</span>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Progress Percentage */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: pullDistance > 20 ? 1 : 0 }}
                className="mt-2 text-slate-400 text-xs font-mono"
              >
                {Math.round(refreshProgress * 100)}%
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Dynamic Transform */}
      <motion.div
        animate={{
          y: pullDistance,
          scale: isRefreshing ? 0.98 : 1
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: isRefreshing ? 0.3 : 0.1
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ProfessionalAdminPullRefresh;