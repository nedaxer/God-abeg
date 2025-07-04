import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

// Removed crypto logos as per user request

export default function AssetsHistory() {
  const [activeTab, setActiveTab] = useState('All Transactions');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [location] = useLocation();
  const [highlightTransactionId, setHighlightTransactionId] = useState<string | null>(null);
  const transactionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Determine back navigation path based on referrer
  const getBackPath = () => {
    // Check if we came from notifications (check URL parameters or localStorage)
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from') || localStorage.getItem('assetsHistoryReferrer') || 'assets';
    
    if (from === 'notifications') {
      return '/mobile/notifications';
    }
    return '/mobile/assets';
  };

  // Fetch deposit transactions for authenticated user only
  const { data: depositsResponse, isLoading: isLoadingDeposits } = useQuery({
    queryKey: ['/api/deposits/history'],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds for new deposits
    retry: 3,
    retryDelay: 1000,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache to avoid stale data (replaces cacheTime in newer versions)
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  // Fetch transfer transactions for authenticated user only
  const { data: transfersResponse, isLoading: isLoadingTransfers } = useQuery({
    queryKey: ['/api/transfers/history'],
    enabled: !!user,
    refetchInterval: 30000,
    retry: 3,
    retryDelay: 1000,
    staleTime: 0,
    gcTime: 0,
  });

  // Fetch withdrawal transactions for authenticated user only
  const { data: withdrawalsResponse, isLoading: isLoadingWithdrawals } = useQuery({
    queryKey: ['/api/withdrawals/history'],
    enabled: !!user,
    refetchInterval: 30000,
    retry: 3,
    retryDelay: 1000,
    staleTime: 0,
    gcTime: 0,
  });

  const deposits = Array.isArray((depositsResponse as any)?.data) 
    ? (depositsResponse as any).data.filter((deposit: any) => {
        // Filter out test deposits with very small USD amounts and zero/invalid crypto amounts
        return deposit.usdAmount && deposit.usdAmount >= 1 && 
               deposit.cryptoAmount && deposit.cryptoAmount > 0;
      })
    : [];
  const transfers = Array.isArray((transfersResponse as any)?.data) ? (transfersResponse as any).data : [];
  const withdrawals = Array.isArray((withdrawalsResponse as any)?.data) ? (withdrawalsResponse as any).data : [];
  
  // Debug transaction data for troubleshooting
  console.log('Assets History Debug:', {
    user: user ? { id: (user as any)._id, email: (user as any).email } : null,
    depositsCount: deposits.length,
    transfersCount: transfers.length,
    withdrawalsCount: withdrawals.length,
    firstDeposit: deposits[0] ? {
      id: deposits[0]._id,
      amount: deposits[0].cryptoAmount,
      symbol: deposits[0].cryptoSymbol,
      usdAmount: deposits[0].usdAmount
    } : null,
    firstTransfer: transfers[0] ? {
      id: transfers[0]._id || transfers[0].transactionId,
      amount: transfers[0].amount,
      type: transfers[0].type
    } : null
  });
  
  // Combine and sort all transactions
  const allTransactions = [...deposits, ...transfers, ...withdrawals].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Filter transactions based on active tab
  const getFilteredTransactions = () => {
    switch(activeTab) {
      case 'All Transactions':
        return allTransactions;
      case 'Deposit':
        return deposits;
      case 'Transfer':
        return transfers;
      case 'Withdraw':
        return withdrawals;
      default:
        return allTransactions;
    }
  };
  
  const transactions = getFilteredTransactions();
  const isLoading = isLoadingDeposits || isLoadingTransfers || isLoadingWithdrawals;
  
  // Force refresh when user changes
  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ['/api/deposits/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transfers/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/withdrawals/history'] });
    }
  }, [user, queryClient]);

  // Handle transaction highlighting from sessionStorage
  useEffect(() => {
    const highlightId = sessionStorage.getItem('highlightTransactionId');
    
    if (highlightId) {
      console.log('🎯 Highlighting transaction:', highlightId);
      setHighlightTransactionId(highlightId);
      
      // Clear the sessionStorage immediately to prevent re-highlighting on future visits
      sessionStorage.removeItem('highlightTransactionId');
      
      // Wait for transactions to load and then scroll to highlighted transaction
      const scrollTimer = setTimeout(() => {
        const element = transactionRefs.current[highlightId];
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          console.log('📍 Scrolled to highlighted transaction');
        }
      }, 500);
      
      // Clear highlight after animation completes (6 seconds)
      const highlightTimer = setTimeout(() => {
        setHighlightTransactionId(null);
        console.log('✨ Transaction highlight animation completed');
      }, 6000);
      
      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(highlightTimer);
      };
    }
  }, [location, depositsResponse, transfersResponse, withdrawalsResponse]);

  // WebSocket connection for real-time transaction updates
  useEffect(() => {
    let socket: WebSocket;
    
    const connectWebSocket = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('WebSocket connected for real-time transaction updates');
        socket.send(JSON.stringify({ type: 'subscribe_notifications' }));
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Real-time transaction update received:', data);
          
          if (data.type === 'DEPOSIT_CREATED' || data.type === 'TRANSFER_CREATED' || data.type === 'WITHDRAWAL_CREATED') {
            // Refresh transaction history when new deposits, transfers, or withdrawals are created
            queryClient.invalidateQueries({ queryKey: ['/api/deposits/history'] });
            queryClient.invalidateQueries({ queryKey: ['/api/transfers/history'] });
            queryClient.invalidateQueries({ queryKey: ['/api/withdrawals/history'] });
            console.log('Transaction history refreshed due to new transaction');
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };
      
      socket.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(connectWebSocket, 3000);
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };
    
    if (user) {
      connectWebSocket();
    }
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [user, queryClient]);

  // Handle transaction highlighting from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightId = urlParams.get('highlight');
    
    if (highlightId && !isLoading && transactions.length > 0) {
      setHighlightTransactionId(highlightId);
      
      // Wait for DOM to render, then scroll to and highlight the transaction
      setTimeout(() => {
        const transactionElement = transactionRefs.current[highlightId];
        if (transactionElement) {
          // Scroll to the transaction with smooth behavior
          transactionElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          
          // Remove highlight after animation completes
          setTimeout(() => {
            setHighlightTransactionId(null);
            // Clean up URL parameter
            const newUrl = window.location.hash.split('?')[0];
            window.history.replaceState(null, '', newUrl);
          }, 3000);
        }
      }, 500);
    }
  }, [isLoading, transactions.length]);

  const historyTabs = ['All Transactions', 'Deposit', 'Withdraw', 'Transfer'];

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a2e]">
        <Link href={getBackPath()}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-base font-medium">Asset History</h1>
        <div className="w-6 h-6" />
      </div>

      {/* Transaction Tabs */}
      <div className="px-4 py-4 bg-[#0a0a2e]">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {historyTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-2 px-2 text-xs ${
                activeTab === tab
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-4 space-y-3">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[#1a1a40] border-[#2a2a50] p-3 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-20"></div>
                      <div className="h-3 bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-16"></div>
                    <div className="h-3 bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-center text-sm">No transaction history</p>
            <p className="text-gray-500 text-xs text-center mt-1">
              Your transactions will appear here
            </p>
          </div>
        ) : (
          // Transaction items
          transactions.map((transaction: any) => {
            // Check if it's a transfer, deposit, or withdrawal
            const isTransfer = transaction.type === 'sent' || transaction.type === 'received';
            const isWithdrawal = transaction.cryptoSymbol && transaction.withdrawalAddress;
            
            if (isTransfer) {
              const isSent = transaction.type === 'sent';
              const otherUser = isSent ? transaction.toUser : transaction.fromUser;
              const transactionId = transaction.transactionId || transaction._id;
              const isHighlighted = highlightTransactionId === transactionId;
              
              return (
                <div
                  key={transaction._id}
                  ref={(el) => transactionRefs.current[transactionId] = el}
                  className={`${isHighlighted ? 'transaction-highlight' : ''}`}
                >
                  <Link href={`/mobile/transfer-details/${transaction.transactionId}`}>
                    <Card className="bg-[#1a1a40] border-[#2a2a50] p-3 hover:bg-[#2a2a50] transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-white font-medium text-xs">
                            {isSent ? 'Sent to' : 'Received from'} {otherUser.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right flex items-center space-x-2">
                          <div>
                            <p className="font-medium text-xs text-white">
                              {isSent ? '-' : '+'}${(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {transaction.status}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              );
            } else if (isWithdrawal) {
              const transactionId = transaction._id;
              const isHighlighted = highlightTransactionId === transactionId;
              
              return (
                <div
                  key={transaction._id}
                  ref={(el) => transactionRefs.current[transactionId] = el}
                  className={`${isHighlighted ? 'transaction-highlight' : ''}`}
                >
                  <Link href={`/mobile/withdrawal-details/${transaction._id}`}>
                    <Card className="bg-[#1a1a40] border-[#2a2a50] p-3 hover:bg-[#2a2a50] transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-white font-medium text-xs">
                            {transaction.cryptoSymbol} Withdrawal
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right flex items-center space-x-2">
                          <div>
                            <p className="text-white font-medium text-xs">
                              -{(transaction.cryptoAmount || 0).toFixed(6)}
                            </p>
                            <p className="text-gray-400 text-xs">
                              ${(transaction.usdAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              );
            } else {
              const transactionId = transaction._id;
              const isHighlighted = highlightTransactionId === transactionId;
              
              return (
                <div
                  key={transaction._id}
                  ref={(el) => transactionRefs.current[transactionId] = el}
                  className={`${isHighlighted ? 'transaction-highlight' : ''}`}
                >
                  <Link href={`/mobile/deposit-details/${transaction._id}`}>
                    <Card className="bg-[#1a1a40] border-[#2a2a50] p-3 hover:bg-[#2a2a50] transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-white font-medium text-xs">
                            {transaction.cryptoSymbol} Deposit
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right flex items-center space-x-2">
                          <div>
                            <p className="text-white font-medium text-xs">
                              +{(transaction.cryptoAmount || 0).toFixed(6)}
                            </p>
                            <p className="text-gray-400 text-xs">
                              ${(transaction.usdAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              );
            }
          })
        )}
      </div>
    </div>
  );
}