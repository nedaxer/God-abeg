import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ChevronDown, HelpCircle, Copy, User, Loader2, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { showSuccessBanner, showErrorBanner } from '@/hooks/use-bottom-banner';
import { TransferDepositRequiredModal } from '@/components/transfer-deposit-required-modal';
import { DepositModal } from '@/components/deposit-modal';


interface RecipientInfo {
  _id: string;
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export default function Transfer() {
  const { user } = useAuth();
  // const { toast } = useToast(); // Replaced with bottom banner system
  
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [recipientIdentifier, setRecipientIdentifier] = useState('');
  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [note, setNote] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'uid' | null>(null);
  const [inputType, setInputType] = useState<'email' | 'uid'>('uid');
  const [showDepositRequiredModal, setShowDepositRequiredModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);


  // Fetch user balance
  const { data: walletData } = useQuery({
    queryKey: ['/api/wallet/summary'],
    enabled: !!user,
  });

  // Check if user requires deposit
  const { data: depositRequirementData } = useQuery({
    queryKey: ['/api/user/deposit-requirement'],
    enabled: !!user,
  });

  // Check user's withdrawal access status
  const { data: withdrawalAccessData } = useQuery({
    queryKey: ['/api/withdrawals/eligibility'],
    enabled: !!user,
  });

  // Check user's transfer access status
  const { data: transferAccessData } = useQuery({
    queryKey: ['/api/user/transfer-access'],
    enabled: !!user,
  });

  // Log transfer access status for debugging
  useEffect(() => {
    const hasTransferAccess = (transferAccessData as any)?.hasTransferAccess;
    
    console.log('Transfer access status:', {
      transferAccessData,
      hasTransferAccess,
      type: typeof hasTransferAccess
    });
  }, [transferAccessData]);

  // WebSocket integration for real-time deposit requirement updates
  useEffect(() => {
    if (!user) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[Transfer] WebSocket connected');
      ws.send(JSON.stringify({ type: 'subscribe_notifications' }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('[Transfer] WebSocket message:', message);

        if (message.type === 'user_restriction_update' && message.data?.userId === (user as any)?._id) {
          console.log('[Transfer] Updating deposit requirement from WebSocket:', message.data);
          
          // Invalidate and refetch deposit requirement data
          queryClient.invalidateQueries({ queryKey: ['/api/user/deposit-requirement'] });
          
          // Close deposit required modal if restriction was removed
          if (!message.data.requiresDeposit && showDepositRequiredModal) {
            setShowDepositRequiredModal(false);
            showSuccessBanner(
              "Restriction Removed",
              "You can now send transfers without making a deposit!"
            );
          }
        }

        // Handle withdrawal access updates
        if (message.type === 'WITHDRAWAL_ACCESS_UPDATE' && message.userId === (user as any)?._id) {
          console.log('[Transfer] Updating withdrawal access from WebSocket:', message);
          
          // Invalidate and refetch withdrawal access data
          queryClient.invalidateQueries({ queryKey: ['/api/withdrawals/eligibility'] });
          
          // Close deposit required modal if withdrawal access was granted
          if (message.withdrawalAccess && showDepositRequiredModal) {
            setShowDepositRequiredModal(false);
            showSuccessBanner(
              "Withdrawal Access Granted",
              "You can now send transfers and make withdrawals!"
            );
          }
        }

        // Handle transfer access updates
        if (message.type === 'TRANSFER_ACCESS_UPDATE' && message.userId === (user as any)?._id) {
          console.log('[Transfer] Updating transfer access from WebSocket:', message);
          
          // Invalidate and refetch transfer access data
          queryClient.invalidateQueries({ queryKey: ['/api/user/transfer-access'] });
          
          // Show notification based on access change
          if (message.transferAccess) {
            // Access was granted
            showSuccessBanner(
              "Transfer Access Enabled",
              "You can now send transfers to other users!"
            );
          } else {
            // Access was disabled
            showErrorBanner(
              "Transfer Access Disabled",
              "Transfer functionality has been disabled by administrator"
            );
          }
        }
      } catch (error) {
        console.error('[Transfer] WebSocket message parsing error:', error);
      }
    };

    ws.onclose = () => {
      console.log('[Transfer] WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('[Transfer] WebSocket error:', error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user, showDepositRequiredModal]);

  const getUserUSDBalance = () => {
    if (!walletData || !(walletData as any).data) return 0;
    
    // USD balance is directly in the data object
    return (walletData as any).data.usdBalance || 0;
  };

  // Auto-search for recipient when identifier changes
  useEffect(() => {
    const searchRecipient = async () => {
      const identifier = recipientIdentifier.trim();
      
      if (!identifier) {
        setRecipientInfo(null);
        return;
      }

      // Check if trying to send to self
      if (identifier === (user as any)?.email || identifier === (user as any)?.uid) {
        setRecipientInfo(null);
        return;
      }

      setIsSearching(true);
      setRecipientInfo(null);

      try {
        const response = await fetch('/api/users/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ identifier }),
        });

        const data = await response.json();

        if (data.success && data.data) {
          setRecipientInfo(data.data);
        } else {
          setRecipientInfo(null);
        }
      } catch (error) {
        console.error('Search error:', error);
        setRecipientInfo(null);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchRecipient, 500); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [recipientIdentifier, user]);

  const handleMethodSelection = (method: 'email' | 'uid') => {
    setSelectedMethod(method);
    setInputType(method);
    setShowDropdown(false);
    setRecipientIdentifier('');
    setRecipientInfo(null);
  };

  // Transfer mutation
  const transferMutation = useMutation({
    mutationFn: async (transferData: { recipientId: string; amount: number }) => {
      const response = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferData),
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Transfer failed');
      }
      return data;
    },
    onSuccess: () => {
      showSuccessBanner(
        'Transfer Successful',
        `Successfully transferred $${parseFloat(withdrawAmount).toFixed(2)} USD`
      );
      
      // Invalidate queries to refresh balances
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/balances'] });
      
      // Reset form
      setWithdrawAmount('');
      setRecipientIdentifier('');
      setRecipientInfo(null);
      setNote('');
      setSelectedMethod(null);
    },
    onError: (error: any) => {
      showErrorBanner(
        'Transfer Failed',
        error.message || 'Failed to transfer funds'
      );
    },
  });

  const handleSend = () => {
    // Check transfer access first - if transferAccess is false, user is restricted
    const hasTransferAccess = (transferAccessData as any)?.hasTransferAccess;
    
    console.log('Transfer access check:', {
      transferAccessData,
      hasTransferAccess,
      dataType: typeof hasTransferAccess
    });
    
    // Show restriction banner if user doesn't have transfer access
    if (hasTransferAccess === false) {
      console.log('User transfer access is disabled, showing banner');
      showErrorBanner(
        "Transfer Access Restricted",
        "This feature has not been activated yet. Contact support for assistance."
      );
      return;
    }

    // Check if user requires deposit AND doesn't have withdrawal access
    const requiresDeposit = (depositRequirementData as any)?.requiresDeposit === true;
    const hasWithdrawalAccess = (withdrawalAccessData as any)?.data?.canWithdraw === true;
    
    // Show deposit modal only if user requires deposit and doesn't have withdrawal access
    if (requiresDeposit && !hasWithdrawalAccess) {
      setShowDepositRequiredModal(true);
      return;
    }

    if (!recipientInfo) {
      showErrorBanner(
        'Error',
        'Please search for a recipient first'
      );
      return;
    }

    const transferAmount = parseFloat(withdrawAmount);
    
    if (isNaN(transferAmount) || transferAmount <= 0) {
      showErrorBanner(
        'Invalid Amount',
        'Please enter a valid amount'
      );
      return;
    }

    if (transferAmount > getUserUSDBalance()) {
      showErrorBanner(
        'Insufficient Balance',
        'You do not have enough funds'
      );
      return;
    }

    transferMutation.mutate({
      recipientId: recipientInfo._id,
      amount: transferAmount,
    });
  };

  const setMaxAmount = () => {
    setWithdrawAmount(getUserUSDBalance().toString());
  };

  const handleMakeDeposit = () => {
    setShowDepositModal(true);
  };

  const handleDepositMethod = (method: string) => {
    setShowDepositModal(false);
    // Handle deposit method selection
    console.log('Selected deposit method:', method);
  };

  return (
    <div className="h-screen bg-[#0a0a2e] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a2e] border-b border-gray-700">
        <Link href="/mobile/assets">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-base font-medium text-white">Send USD</h1>
        <div className="flex items-center space-x-3">
          <HelpCircle className="w-5 h-5 text-gray-400" />
          <Copy className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Transfer Access Restriction - handled by showErrorBanner when needed */}

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Send Method Selection */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label className="text-white text-xs font-medium">Send Mode</Label>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full bg-[#1a1a40] border border-gray-600 rounded-lg p-3 flex items-center justify-between hover:bg-[#2a2a50]"
          >
            <span className="text-white">
              {selectedMethod ? (selectedMethod === 'email' ? 'Email' : 'Nedaxer UID') : 'Select Email/UID'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Recipient Input - Only show after method selected */}
        {selectedMethod && (
          <div className="space-y-2">
            <Label className="text-white text-xs font-medium">
              {selectedMethod === 'email' ? 'Email' : 'Nedaxer UID'}
            </Label>
            <Input
              type="text"
              placeholder={inputType === 'email' ? 'Enter email address' : 'Enter Nedaxer UID'}
              value={recipientIdentifier}
              onChange={(e) => setRecipientIdentifier(e.target.value)}
              className="h-12 bg-[#1a1a40] border border-gray-600 text-white placeholder-gray-500"
            />
            {isSearching && (
              <div className="flex items-center space-x-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Searching...</span>
              </div>
            )}
            
            {/* Recipient Info - Show directly under input */}
            {recipientInfo && (
              <Card className="bg-[#1a1a40] border-gray-600 p-3 mt-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center overflow-hidden">
                    {recipientInfo.profilePicture ? (
                      <img 
                        src={recipientInfo.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white text-xs">
                      {recipientInfo.firstName} {recipientInfo.lastName}
                    </div>
                    <div className="text-xs text-gray-400">@{recipientInfo.username}</div>
                    <div className="text-xs text-gray-500">UID: {recipientInfo.uid}</div>
                  </div>
                </div>
              </Card>
            )}
            
            <div className="text-xs text-gray-400">
              Please enter the correct {selectedMethod === 'email' ? 'Email' : 'Nedaxer UID'}
            </div>
          </div>
        )}

        {/* Transfer Amount */}
        <div className="space-y-2">
          <Label className="text-white text-xs font-medium">Withdraw Amount</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="h-12 bg-[#1a1a40] border border-gray-600 text-white placeholder-gray-500 pr-20 text-base"
              step="0.01"
              min="0"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Button
                onClick={setMaxAmount}
                className="bg-transparent hover:bg-gray-600 text-white text-xs px-2 py-1 h-6 border border-gray-500"
              >
                Max
              </Button>
              <span className="text-white text-xs">USD</span>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Available: ${getUserUSDBalance().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label className="text-white text-xs font-medium">Note (Optional)</Label>
          <Textarea
            placeholder="Add a note for the recipient"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-[#1a1a40] border border-gray-600 text-white placeholder-gray-500 resize-none h-16"
            maxLength={50}
          />
        </div>


      </div>

      {/* Send Button */}
      <div className="px-4 pb-4">
        <Button
          onClick={handleSend}
          disabled={
            !recipientInfo || 
            !withdrawAmount || 
            parseFloat(withdrawAmount) <= 0 || 
            parseFloat(withdrawAmount) > getUserUSDBalance() ||
            transferMutation.isPending
          }
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {transferMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </div>
          ) : (
            'Send'
          )}
        </Button>
      </div>

      {/* Dropdown Modal - Send Mode Selection */}
      {showDropdown && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-[#0a0a2e] rounded-t-2xl p-4 space-y-3 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg font-semibold">Send Mode</h3>
              <button
                onClick={() => setShowDropdown(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleMethodSelection('email')}
                className="w-full p-3 text-left text-white hover:bg-[#1a1a40] rounded-lg flex items-center justify-between"
              >
                <span className="font-medium">Email</span>
                {selectedMethod === 'email' && (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={() => handleMethodSelection('uid')}
                className="w-full p-3 text-left text-white hover:bg-[#1a1a40] rounded-lg flex items-center justify-between"
              >
                <span className="font-medium">Nedaxer UID</span>
                {selectedMethod === 'uid' && (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Deposit Required Modal */}
      <TransferDepositRequiredModal
        isOpen={showDepositRequiredModal}
        onClose={() => setShowDepositRequiredModal(false)}
        onMakeDeposit={handleMakeDeposit}
      />

      {/* Deposit Method Selection Modal */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSelectMethod={handleDepositMethod}
      />
    </div>
  );
}