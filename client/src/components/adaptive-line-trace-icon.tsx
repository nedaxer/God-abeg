
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AdaptiveLineTraceIconProps {
  Icon: LucideIcon;
  isActive: boolean;
  size?: number;
  className?: string;
  iconType?: 'home' | 'search' | 'chart' | 'trending' | 'news' | 'wallet';
}

const iconPaths = {
  home: [
    { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", delay: 0 },
    { d: "M9 22V12h6v10", delay: 0.3 }
  ],
  search: [
    { d: "M11 11m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0", delay: 0 },
    { d: "M21 21l-4.35-4.35", delay: 0.4 }
  ],
  chart: [
    { d: "M3 3v18h18", delay: 0 },
    { d: "M18.7 8l-5.1 5.2-2.8-2.7L7 14.3", delay: 0.2 }
  ],
  trending: [
    { d: "M3 17l6-6 4 4 8-8", delay: 0 },
    { d: "M14 7h6v6", delay: 0.3 }
  ],
  news: [
    { d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z", delay: 0 },
    { d: "M4 22a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2", delay: 0.3 },
    { d: "M9 9h6", delay: 0.5 },
    { d: "M9 13h6", delay: 0.7 }
  ],
  wallet: [
    { d: "M19 7V6a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h13a1 1 0 0 1 1 1z", delay: 0 },
    { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", delay: 0.3 },
    { d: "M18 9h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2", delay: 0.5 }
  ]
};

export function AdaptiveLineTraceIcon({ 
  Icon, 
  isActive, 
  size = 18, 
  className = "",
  iconType = 'home'
}: AdaptiveLineTraceIconProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFinalIcon, setShowFinalIcon] = useState(!isActive);
  const [showCompleteIcon, setShowCompleteIcon] = useState(false);

  useEffect(() => {
    if (isActive && !isAnimating) {
      setIsAnimating(true);
      setShowFinalIcon(false);
      setShowCompleteIcon(false);
      
      const paths = iconPaths[iconType] || iconPaths.home;
      const totalDuration = Math.max(...paths.map(p => p.delay)) + 1000;
      
      // Show traced paths first
      const traceTimer = setTimeout(() => {
        setShowFinalIcon(true);
      }, totalDuration - 300);
      
      // Then show complete glowing icon
      const completeTimer = setTimeout(() => {
        setShowCompleteIcon(true);
        setIsAnimating(false);
      }, totalDuration);

      return () => {
        clearTimeout(traceTimer);
        clearTimeout(completeTimer);
      };
    } else if (!isActive) {
      // Reset all states when tab becomes inactive
      setShowCompleteIcon(false);
      setShowFinalIcon(false);
      setIsAnimating(false);
    }
  }, [isActive, iconType]);

  const paths = iconPaths[iconType] || iconPaths.home;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <AnimatePresence>
        {isActive && isAnimating && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              className="absolute inset-0"
              style={{ filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.8))' }}
            >
              {paths.map((pathData, index) => (
                <motion.path
                  key={index}
                  id={`path-${index}`}
                  d={pathData.d}
                  fill="none"
                  stroke="rgb(249, 115, 22)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { 
                      duration: 0.6, 
                      ease: "easeInOut", 
                      delay: pathData.delay 
                    },
                    opacity: { 
                      duration: 0.2, 
                      delay: pathData.delay 
                    }
                  }}
                />
              ))}
              
              {/* Animated tracing dot */}
              <motion.circle
                r={size > 16 ? "2" : "1.5"}
                fill="rgb(249, 115, 22)"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: paths.length * 0.3 + 0.6,
                  ease: "easeInOut",
                  repeat: 0
                }}
                style={{ 
                  filter: 'drop-shadow(0 0 6px rgba(249, 115, 22, 1))',
                  transformOrigin: 'center'
                }}
              >
                <animateMotion
                  dur={`${paths.length * 0.3 + 0.6}s`}
                  repeatCount="1"
                  rotate="auto"
                  path={paths[0]?.d || "M0,0"}
                />
              </motion.circle>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete Glowing Icon */}
      <AnimatePresence>
        {showCompleteIcon && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: [0.5, 1.2, 1],
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut",
              scale: {
                duration: 0.6,
                times: [0, 0.6, 1],
                ease: ["easeOut", "easeOut"]
              }
            }}
          >
            <motion.div
              animate={{
                filter: [
                  'drop-shadow(0 0 4px rgba(249, 115, 22, 0.4)) drop-shadow(0 0 8px rgba(249, 115, 22, 0.3))',
                  'drop-shadow(0 0 8px rgba(249, 115, 22, 0.8)) drop-shadow(0 0 16px rgba(249, 115, 22, 0.6))',
                  'drop-shadow(0 0 6px rgba(249, 115, 22, 0.6)) drop-shadow(0 0 12px rgba(249, 115, 22, 0.4))'
                ]
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Icon 
                size={size} 
                className="text-orange-500"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Traced Icon (intermediate state) */}
      <AnimatePresence>
        {showFinalIcon && !showCompleteIcon && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            <Icon 
              size={size} 
              className="text-orange-500"
              style={{ filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.6))' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default state when not active */}
      {!isActive && !isAnimating && (
        <Icon 
          size={size} 
          className="text-gray-400 transition-colors duration-200"
        />
      )}
      
      {/* Active state without animation (fallback) */}
      {isActive && !isAnimating && !showCompleteIcon && !showFinalIcon && (
        <Icon 
          size={size} 
          className="text-orange-500 transition-colors duration-200"
        />
      )}
    </div>
  );
}
