import { useState, useCallback, useRef } from 'react';

interface ModalState {
  [key: string]: boolean;
}

/**
 * Hook to manage modal states and prevent duplicate modals
 * Ensures only one modal of each type can be open at a time
 */
export const useModalManager = () => {
  const [modals, setModals] = useState<ModalState>({});
  const lockRef = useRef<Set<string>>(new Set());

  const openModal = useCallback((modalId: string) => {
    // Prevent duplicate openings
    if (lockRef.current.has(modalId)) {
      console.warn(`Modal ${modalId} is already opening/open`);
      return false;
    }

    lockRef.current.add(modalId);
    
    setModals(prev => ({
      ...prev,
      [modalId]: true
    }));

    return true;
  }, []);

  const closeModal = useCallback((modalId: string) => {
    lockRef.current.delete(modalId);
    
    setModals(prev => ({
      ...prev,
      [modalId]: false
    }));
  }, []);

  const isModalOpen = useCallback((modalId: string) => {
    return modals[modalId] || false;
  }, [modals]);

  const closeAllModals = useCallback(() => {
    lockRef.current.clear();
    setModals({});
  }, []);

  return {
    openModal,
    closeModal,
    isModalOpen,
    closeAllModals
  };
};