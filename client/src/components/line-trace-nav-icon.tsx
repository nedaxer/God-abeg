
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface LineTraceNavIconProps {
  Icon: LucideIcon;
  isActive: boolean;
  size?: number;
  className?: string;
}

export function LineTraceNavIcon({ Icon, isActive, size = 18, className = "" }: LineTraceNavIconProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFinalIcon, setShowFinalIcon] = useState(!isActive);

  useEffect(() => {
    if (isActive && !isAnimating) {
      setIsAnimating(true);
      setShowFinalIcon(false);
      
      // Show final icon after trace animation completes
      const timer = setTimeout(() => {
        setShowFinalIcon(true);
        setIsAnimating(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isActive, isAnimating]);

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
            {/* Glowing trace line */}
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              className="absolute inset-0"
              style={{ filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.8))' }}
            >
              <motion.path
                d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                fill="none"
                stroke="rgb(249, 115, 22)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.6, ease: "easeInOut" },
                  opacity: { duration: 0.2 }
                }}
              />
              <motion.path
                d="M9 22V12h6v10"
                fill="none"
                stroke="rgb(249, 115, 22)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.6, ease: "easeInOut", delay: 0.2 },
                  opacity: { duration: 0.2, delay: 0.2 }
                }}
              />
              
              {/* Glowing trace dot */}
              <motion.circle
                r="2"
                fill="rgb(249, 115, 22)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [3, 12, 21, 21, 15, 9, 9],
                  y: [9, 2, 9, 20, 20, 12, 22]
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1]
                }}
                style={{ filter: 'drop-shadow(0 0 6px rgba(249, 115, 22, 1))' }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Icon */}
      <AnimatePresence>
        {showFinalIcon && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: isActive ? 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.6))' : 'none'
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            <Icon 
              size={size} 
              className={isActive ? 'text-orange-500' : 'text-gray-400'}
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
    </div>
  );
}
