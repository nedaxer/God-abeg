// Adapted from wouter documentation for hash-based routing
// https://github.com/molefrog/wouter#customizing-the-location-hook

import { useState, useEffect, useCallback, useRef } from "react";
import type { BaseLocationHook } from "wouter";

// Hash-based location hook for wouter
export const useHashLocation: BaseLocationHook = () => {
  const isInitialized = useRef(false);
  
  // Initialize with the current hash location (sans the # part)
  const [loc, setLoc] = useState(() => {
    const path = window.location.hash.replace("#", "") || "/";
    return path;
  });

  // Update the path on hash change
  useEffect(() => {
    // This fn will be called whenever hash changes
    const handleHashchange = () => {
      const path = window.location.hash.replace("#", "") || "/";
      setLoc(prevLoc => {
        // Only update if the location actually changed
        if (prevLoc !== path) {
          return path;
        }
        return prevLoc;
      });
    };

    window.addEventListener("hashchange", handleHashchange);
    
    // Only initialize once to prevent unnecessary updates
    if (!isInitialized.current) {
      handleHashchange();
      isInitialized.current = true;
    }
    
    return () => window.removeEventListener("hashchange", handleHashchange);
  }, []);

  // The navigate function is used by wouter to manipulate history
  const navigate = useCallback((to: string) => {
    // Prevent navigation to the same location
    const currentPath = window.location.hash.replace("#", "") || "/";
    if (currentPath !== to) {
      window.location.hash = to;
    }
  }, []);

  return [loc, navigate];
};