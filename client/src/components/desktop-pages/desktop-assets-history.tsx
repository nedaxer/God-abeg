import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, ChevronRight, Calendar, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import CryptoLogo from '@/components/crypto-logo';

// Remove custom logo function - use existing CryptoLogo component instead

export default function DesktopAssetsHistory() {
  const [activeTab, setActiveTab] = useState('All Transactions');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [highlightTransactionId, setHighlightTransactionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const transactionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Determine back navigation path based on referrer
  const getBackPath = () => {
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
    refetchInterval: 30000,
    retry: 3,
    retryDelay: 1000,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
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
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
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
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Handle transaction highlighting from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('transactionId');

    if (transactionId) {
      setHighlightTransactionId(transactionId);

      setTimeout(() => {
        const element = transactionRefs.current[transactionId];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);

      setTimeout(() => {
        setHighlightTransactionId(null);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }, 6000);
    }
  }, []);

  // Allowed cryptocurrencies - only show BTC, USDT, ETH, BNB
  const allowedCryptos = ['BTC', 'USDT', 'ETH', 'BNB'];

  // Get deposits data - filter for main 4 cryptocurrencies only
  const deposits = Array.isArray((depositsResponse as any)?.data) 
    ? (depositsResponse as any).data.filter((deposit: any) => {
        // Filter out test deposits with very small USD amounts and zero/invalid crypto amounts
        // AND only show the 4 main cryptocurrencies
        return deposit.usdAmount && deposit.usdAmount >= 1 && 
               deposit.cryptoAmount && deposit.cryptoAmount > 0 &&
               allowedCryptos.includes(deposit.cryptoSymbol?.toUpperCase());
      })
    : [];

  // Get transfers data (transfers are in USD, no crypto filtering needed)
  const transfers = Array.isArray((transfersResponse as any)?.data) ? (transfersResponse as any).data : [];

  // Get withdrawals data - filter for main 4 cryptocurrencies only
  const withdrawals = Array.isArray((withdrawalsResponse as any)?.data) 
    ? (withdrawalsResponse as any).data.filter((withdrawal: any) => {
        // Only show withdrawals of the 4 main cryptocurrencies
        return allowedCryptos.includes(withdrawal.cryptoSymbol?.toUpperCase());
      })
    : [];

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
        // Include both deposits and transfers in deposit mode
        return [...deposits, ...transfers].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
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

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction: any) => {
    if (searchTerm === '') return true;

    const searchLower = searchTerm.toLowerCase();
    const isTransfer = transaction.type === 'sent' || transaction.type === 'received';
    const isWithdrawal = transaction.cryptoSymbol && transaction.withdrawalAddress;

    if (isTransfer) {
      const otherUser = transaction.type === 'sent' ? transaction.toUser : transaction.fromUser;
      return otherUser?.name?.toLowerCase().includes(searchLower);
    } else if (isWithdrawal) {
      return transaction.cryptoSymbol?.toLowerCase().includes(searchLower);
    } else {
      return transaction.cryptoSymbol?.toLowerCase().includes(searchLower);
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return '📥';
      case 'transfer_sent':
        return '📤';
      case 'transfer_received':
        return '📥';
      default:
        return '💼';
    }
  };

  const getTransactionTitle = (transaction: any) => {
    // Handle transfers with full user details
    if (transaction.type === 'sent' && transaction.toUser) {
      return `Transfer to ${transaction.toUser.name}`;
    }
    if (transaction.type === 'received' && transaction.fromUser) {
      return `Transfer from ${transaction.fromUser.name}`;
    }

    // Handle withdrawals
    if (transaction.withdrawalAddress) {
      return `${transaction.cryptoSymbol} Withdrawal`;
    }

    // Handle deposits
    if (transaction.cryptoSymbol && transaction.usdAmount) {
      return `${transaction.cryptoSymbol} Deposit`;
    }

    // Fallback cases
    switch (transaction.type) {
      case 'deposit':
        return 'Crypto Deposit';
      case 'transfer_sent':
        return `Transfer to ${transaction.recipient}`;
      case 'transfer_received':
        return `Transfer from ${transaction.sender}`;
      case 'sent':
        return 'Transfer Sent';
      case 'received':
        return 'Transfer Received';
      default:
        return 'Transaction';
    }
  };

  const getStatusBadge = (transaction: any) => {
    const status = transaction.status || 'completed';
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'confirmed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'pending':
      case 'processing':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'failed':
      case 'error':
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>;
      default:
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a2e] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(getBackPath())}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-orange-500" />
                Transaction History
              </h1>
              <p className="text-gray-400">View all your deposits, transfers, and trading activity</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-black/20 border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-black/20 rounded-lg p-1">
          {['All Transactions', 'Deposit', 'Transfer', 'Withdraw'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-black/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <Card className="bg-black/20 border-gray-700/50 p-12 text-center">
              <div className="text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No transaction history</h3>
                <p className="text-sm">Your transactions will appear here when you make deposits or transfers.</p>
              </div>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card
                key={transaction._id || transaction.id}
                ref={(el) => {
                  if (transaction._id || transaction.id) {
                    transactionRefs.current[transaction._id || transaction.id] = el;
                  }
                }}
                className={`bg-black/20 border-gray-700/50 p-6 transition-all duration-300 hover:bg-black/30 ${
                  highlightTransactionId === (transaction._id || transaction.id)
                    ? 'animate-pulse bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/20'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div>
                      <h3 className="text-white font-medium">{getTransactionTitle(transaction)}</h3>
                      <p className="text-gray-400 text-sm">
                        {formatDate(transaction.createdAt || transaction.timestamp)}
                      </p>
                      {transaction.cryptoSymbol && (
                        <p className="text-white text-xs">
                          {transaction.cryptoAmount} {transaction.cryptoSymbol}
                        </p>
                      )}
                      {transaction.note && (
                        <p className="text-gray-500 text-xs mt-1">{transaction.note}</p>
                      )}

                      {/* Transfer Details */}
                      {transaction.type === 'sent' && transaction.toUser && (
                        <p className="text-white text-xs">To: {transaction.toUser.name}</p>
                      )}
                      {transaction.type === 'received' && transaction.fromUser && (
                        <p className="text-white text-xs">From: {transaction.fromUser.name}</p>
                      )}

                      {/* Withdrawal Details */}
                      {transaction.withdrawalAddress && (
                        <p className="text-white text-xs">
                          To: {transaction.withdrawalAddress.slice(0, 8)}...{transaction.withdrawalAddress.slice(-8)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex items-center space-x-4">
                    <div>
                      <p className={`text-lg font-bold ${
                        (transaction.type === 'sent' || transaction.type === 'received') ? 'text-white' : 
                        transaction.isOutgoing ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {transaction.displayAmount}
                      </p>
                      {getStatusBadge(transaction)}
                    </div>

                    <button
                      onClick={() => {
                        const transactionId = transaction._id || transaction.id;
                        if (transaction.type === 'sent' || transaction.type === 'received') {
                          navigate(`/mobile/transfer-details/${transactionId}`);
                        } else if (transaction.withdrawalAddress) {
                          navigate(`/mobile/withdrawal-details/${transactionId}`);
                        } else {
                          navigate(`/mobile/deposit-details/${transactionId}`);
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-gray-700/30 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-400" />                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}