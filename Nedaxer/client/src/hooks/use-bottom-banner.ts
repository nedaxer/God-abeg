import { create } from 'zustand';
import type { BottomSlideBannerData } from '@/components/bottom-slide-banner';

interface BottomBannerStore {
  currentBanner: BottomSlideBannerData | null;
  showBanner: (banner: Omit<BottomSlideBannerData, 'id'>) => void;
  dismissBanner: () => void;
}

let bannerCounter = 0;

const useBottomBannerStore = create<BottomBannerStore>((set) => ({
  currentBanner: null,
  
  showBanner: (banner) => {
    const id = `banner-${++bannerCounter}`;
    set({
      currentBanner: {
        ...banner,
        id,
      }
    });
  },
  
  dismissBanner: () => {
    set({ currentBanner: null });
  },
}));

export const useBottomBanner = () => {
  const { currentBanner, showBanner, dismissBanner } = useBottomBannerStore();
  
  return {
    currentBanner,
    showBanner,
    dismissBanner,
  };
};

// Convenience functions for different banner types
export const showSuccessBanner = (title: string, message: string, duration?: number) => {
  useBottomBannerStore.getState().showBanner({
    type: 'success',
    title,
    message,
    duration,
  });
};

export const showErrorBanner = (title: string, message: string, duration?: number) => {
  useBottomBannerStore.getState().showBanner({
    type: 'error',
    title,
    message,
    duration,
  });
};

export const showWarningBanner = (title: string, message: string, duration?: number) => {
  useBottomBannerStore.getState().showBanner({
    type: 'warning',
    title,
    message,
    duration,
  });
};

export const showInfoBanner = (title: string, message: string, duration?: number) => {
  useBottomBannerStore.getState().showBanner({
    type: 'info',
    title,
    message,
    duration,
  });
};