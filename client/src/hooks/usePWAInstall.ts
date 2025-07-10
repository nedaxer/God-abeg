import { useState, useEffect } from 'react';

// PWA install functionality removed to fix installation issues

export function usePWAInstall() {
  return {
    installPWA: async () => false,
    isInstallable: false,
    isInstalled: false,
    canInstall: false
  };
}