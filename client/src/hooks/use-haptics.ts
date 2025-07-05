import { useCallback } from 'react';
import { hapticLight, hapticMedium, hapticHeavy, hapticNavigation } from '@/lib/haptics';

/**
 * Custom hook for haptic feedback throughout the mobile app
 */
export function useHaptics() {
  const triggerLight = useCallback(() => {
    hapticLight();
  }, []);

  const triggerMedium = useCallback(() => {
    hapticMedium();
  }, []);

  const triggerHeavy = useCallback(() => {
    hapticHeavy();
  }, []);

  const triggerNavigation = useCallback(() => {
    hapticNavigation();
  }, []);

  const triggerButtonPress = useCallback(() => {
    hapticMedium();
  }, []);

  const triggerTabSwitch = useCallback(() => {
    hapticLight();
  }, []);

  const triggerToggle = useCallback(() => {
    hapticLight();
  }, []);

  const triggerSelection = useCallback(() => {
    hapticLight();
  }, []);

  return {
    light: triggerLight,
    medium: triggerMedium,
    heavy: triggerHeavy,
    navigation: triggerNavigation,
    buttonPress: triggerButtonPress,
    tabSwitch: triggerTabSwitch,
    toggle: triggerToggle,
    selection: triggerSelection,
  };
}