import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useModalManager } from '@/hooks/use-modal-manager';

interface WithdrawalRestrictionData {
  hasRestriction: boolean;
  message: string;
  minimumRequired?: number;
  totalDeposited?: number;
  shortfall?: number;
  canWithdraw?: boolean;
}

interface WithdrawalContextType {
  withdrawalData: WithdrawalRestrictionData | null;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  refreshData: () => void;
}

const WithdrawalContext = createContext<WithdrawalContextType | undefined>(undefined);

export const useWithdrawal = () => {
  const context = useContext(WithdrawalContext);
  if (!context) {
    throw new Error('useWithdrawal must be used within a WithdrawalProvider');
  }
  return context;
};

interface WithdrawalProviderProps {
  children: ReactNode;
}

export const WithdrawalProvider: React.FC<WithdrawalProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { openModal: openModalManager, closeModal: closeModalManager, isModalOpen: isModalOpenManager } = useModalManager();

  // Fetch withdrawal eligibility data
  const { data: withdrawalEligibility, refetch } = useQuery({
    queryKey: ["/api/withdrawals/eligibility"],
    enabled: !!user,
    refetchInterval: 30000,
    staleTime: 25000,
  });

  // Fetch withdrawal restriction data 
  const { data: withdrawalRestriction } = useQuery({
    queryKey: ["/api/user/withdrawal-restriction"],
    enabled: !!user,
    refetchInterval: 30000,
    staleTime: 25000,
  });

  // Combined withdrawal data
  const withdrawalData: WithdrawalRestrictionData | null = React.useMemo(() => {
    if (!withdrawalEligibility && !withdrawalRestriction) return null;

    const eligibility = (withdrawalEligibility as any)?.data;
    const restriction = (withdrawalRestriction as any)?.data;

    return {
      hasRestriction: restriction?.hasRestriction || !eligibility?.canWithdraw || false,
      message: eligibility?.withdrawalMessage || restriction?.message || "Withdrawal Not Permitted Until Account Funding is Complete",
      minimumRequired: eligibility?.minimumRequired || 1000,
      totalDeposited: eligibility?.totalDeposited || 0,
      shortfall: eligibility?.shortfall || 1000,
      canWithdraw: eligibility?.canWithdraw || false
    };
  }, [withdrawalEligibility, withdrawalRestriction]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!user) return;

    const userId = (user as any)?._id;
    if (!userId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onopen = () => {
      console.log('🔌 Withdrawal WebSocket connected');
      ws.send(JSON.stringify({ type: 'subscribe_notifications' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle withdrawal settings updates
        if ((data.type === 'WITHDRAWAL_SETTINGS_UPDATE' || data.type === 'withdrawal_settings_update') && 
            data.userId === userId) {
          console.log('📡 Received withdrawal settings update:', data);
          // Invalidate both queries for fresh data
          queryClient.invalidateQueries({ queryKey: ["/api/withdrawals/eligibility"] });
          queryClient.invalidateQueries({ queryKey: ["/api/user/withdrawal-restriction"] });
        }

        // Handle user restriction updates from admin portal
        if (data.type === 'user_restriction_update' && data.data?.userId === userId) {
          console.log('📡 Received user restriction update:', data);
          queryClient.invalidateQueries({ queryKey: ["/api/withdrawals/eligibility"] });
          queryClient.invalidateQueries({ queryKey: ["/api/user/withdrawal-restriction"] });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Withdrawal WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('🔌 Withdrawal WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [user, queryClient]);

  const MODAL_ID = 'withdrawal-restriction';

  const openModal = () => {
    const opened = openModalManager(MODAL_ID);
    if (!opened) {
      console.warn('Withdrawal modal is already open - preventing duplicate');
    }
    return opened;
  };

  const closeModal = () => {
    closeModalManager(MODAL_ID);
  };

  const isModalOpen = isModalOpenManager(MODAL_ID);

  const refreshData = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["/api/user/withdrawal-restriction"] });
  };

  return (
    <WithdrawalContext.Provider
      value={{
        withdrawalData,
        isModalOpen,
        openModal,
        closeModal,
        refreshData
      }}
    >
      {children}
    </WithdrawalContext.Provider>
  );
};