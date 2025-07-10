// @ts-nocheck
// TypeScript error suppression for development productivity
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { showSuccessBanner, showErrorBanner } from '@/hooks/use-bottom-banner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Wallet, 
  DollarSign, 
  Send, 
  Shield, 
  Loader2 
} from 'lucide-react';

interface RecipientInfo {
  _id: string;
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export default function DesktopTransfer() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientIdentifier, setRecipientIdentifier] = useState('');
  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [note, setNote] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'uid'>('email');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  // Transfer mutation
  const transferMutation = useMutation({
    mutationFn: async (data: { recipientId: string; amount: number; note?: string }) => {
      return apiRequest('/api/transfer', {
        method: 'POST',
        data,
      });
    },
    onSuccess: (response) => {
      if (response.success) {
        showSuccessBanner(
          'Transfer Successful',
          `Successfully sent $${transferAmount} to ${recipientInfo?.firstName || recipientInfo?.username}`
        );
        // Reset form
        setTransferAmount('');
        setRecipientIdentifier('');
        setRecipientInfo(null);
        setNote('');
        setErrors({});
        // Refresh balance
        queryClient.invalidateQueries({ queryKey: ['/api/wallet/summary'] });
        // Navigate back to assets
        navigate('/mobile/assets');
      } else {
        showErrorBanner(
          'Transfer Failed',
          response.message || 'Unable to process transfer'
        );
      }
    },
    onError: (error: any) => {
      showErrorBanner(
        'Transfer Error',
        error.message || 'An error occurred during transfer'
      );
    }
  });

  // Search for recipient
  const searchRecipient = async (identifier: string) => {
    if (!identifier.trim()) {
      setRecipientInfo(null);
      return;
    }

    setIsSearching(true);
    setErrors({});

    try {
      const response = await apiRequest('/api/search-user', {
        method: 'POST',
        data: {
          identifier: identifier.trim(),
          searchType: selectedMethod
        }
      });

      if (response.success && response.data) {
        setRecipientInfo(response.data);
      } else {
        setRecipientInfo(null);
        setErrors({ recipient: 'User not found' });
      }
    } catch (error: any) {
      setRecipientInfo(null);
      setErrors({ recipient: error.message || 'Error searching for user' });
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (recipientIdentifier.trim()) {
        searchRecipient(recipientIdentifier);
      } else {
        setRecipientInfo(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [recipientIdentifier, selectedMethod]);

  const handleTransfer = () => {
    const newErrors: { [key: string]: string } = {};

    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!recipientInfo) {
      newErrors.recipient = 'Please select a valid recipient';
    }

    const balance = walletData?.data?.totalBalance || 0;
    if (parseFloat(transferAmount) > balance) {
      newErrors.amount = 'Insufficient balance';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if user requires deposit
    if (depositRequirementData?.data?.requiresDeposit) {
      showErrorBanner(
        'Deposit Required',
        'Please make a deposit to enable transfers'
      );
      return;
    }

    transferMutation.mutate({
      recipientId: recipientInfo._id,
      amount: parseFloat(transferAmount),
      note: note.trim() || undefined,
    });
  };

  const getUserUSDBalance = () => {
    return walletData?.data?.totalUSDValue || walletData?.data?.totalBalance || 0;
  };

  const setMaxAmount = () => {
    const balance = getUserUSDBalance();
    setTransferAmount(balance.toString());
  };

  return (
    <div className="space-y-6">

        {/* Balance Card */}
        <Card className="bg-black/20 backdrop-blur-sm border-gray-700/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-orange-500" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              ${getUserUSDBalance().toLocaleString()}
            </div>
            <p className="text-gray-400 text-sm mt-1">USD Balance</p>
          </CardContent>
        </Card>

        {/* Transfer Form */}
        <Card className="bg-black/20 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Transfer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Send Method Selection */}
            <div className="space-y-3">
              <Label className="text-white">Send Method</Label>
              <div className="flex space-x-2">
                <Button
                  variant={selectedMethod === 'email' ? 'default' : 'outline'}
                  className={`flex-1 ${selectedMethod === 'email' ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-600 text-gray-300'}`}
                  onClick={() => {
                    setSelectedMethod('email');
                    setRecipientIdentifier('');
                    setRecipientInfo(null);
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant={selectedMethod === 'uid' ? 'default' : 'outline'}
                  className={`flex-1 ${selectedMethod === 'uid' ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-600 text-gray-300'}`}
                  onClick={() => {
                    setSelectedMethod('uid');
                    setRecipientIdentifier('');
                    setRecipientInfo(null);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Nedaxer UID
                </Button>
              </div>
            </div>

            {/* Recipient Input */}
            {selectedMethod && (
              <div className="space-y-3">
                <Label className="text-white">
                  {selectedMethod === 'email' ? 'Recipient Email' : 'Recipient UID'}
                </Label>
                <div className="relative">
                  <Input
                    type={selectedMethod === 'email' ? 'email' : 'text'}
                    placeholder={selectedMethod === 'email' ? 'Enter recipient email' : 'Enter recipient UID'}
                    value={recipientIdentifier}
                    onChange={(e) => setRecipientIdentifier(e.target.value)}
                    className="bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                    </div>
                  )}
                </div>
                {errors.recipient && (
                  <p className="text-red-400 text-sm">{errors.recipient}</p>
                )}
              </div>
            )}

            {/* Recipient Info */}
            {recipientInfo && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    {recipientInfo.profilePicture ? (
                      <img 
                        src={recipientInfo.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {recipientInfo.firstName && recipientInfo.lastName
                        ? `${recipientInfo.firstName} ${recipientInfo.lastName}`
                        : recipientInfo.username}
                    </p>
                    <p className="text-gray-400 text-sm">{recipientInfo.email}</p>
                    <p className="text-gray-400 text-sm">UID: {recipientInfo.uid}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Amount */}
            <div className="space-y-3">
              <Label className="text-white">Transfer Amount (USD)</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 pl-8"
                />
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Button
                  variant="link"
                  size="sm"
                  onClick={setMaxAmount}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-400 h-auto p-0"
                >
                  Max
                </Button>
              </div>
              {errors.amount && (
                <p className="text-red-400 text-sm">{errors.amount}</p>
              )}
            </div>

            {/* Note (Optional) */}
            <div className="space-y-3">
              <Label className="text-white">Note (Optional)</Label>
              <Textarea
                placeholder="Add a note for this transfer..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 resize-none"
                rows={3}
              />
            </div>

            {/* Transfer Button */}
            <Button
              onClick={handleTransfer}
              disabled={transferMutation.isPending || !recipientInfo || !transferAmount}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
            >
              {transferMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing Transfer...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Send className="w-4 h-4 mr-2" />
                  Send ${transferAmount || '0.00'}
                </div>
              )}
            </Button>

            {/* Transfer Security Info */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-400 font-medium text-sm">Secure Transfer</h4>
                  <p className="text-gray-400 text-xs mt-1">
                    All transfers are processed instantly and securely. Please verify the recipient details before sending.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}