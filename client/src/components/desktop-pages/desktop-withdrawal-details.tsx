import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Copy, CheckCircle, Calendar, ArrowUpRight, Hash, Network } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import CryptoLogo from '@/components/crypto-logo';
import { showSuccessBanner } from '@/hooks/use-bottom-banner';

const generateLongTransactionId = (shortId: string): string => {
  const prefix = "0x4A8f9C3d2E1b5F6a7C8E9";
  const suffix = "2D4B7E8F9A1C3D5E6F8A";
  return `${prefix}${shortId.slice(-8).toUpperCase()}${suffix}`;
};

export default function DesktopWithdrawalDetails() {
  const { transactionId } = useParams();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);

  // Fetch transaction details
  const { data: transactionResponse, isLoading, error } = useQuery({
    queryKey: [`/api/withdrawals/details/${transactionId}`],
    enabled: !!transactionId,
  });

  const transaction = (transactionResponse as any)?.data;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showSuccessBanner(
        "Copied!",
        "Transaction ID copied to clipboard"
      );
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a2e] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/mobile/assets-history')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Withdrawal Details</h1>
          </div>
          
          <Card className="bg-black/20 border-gray-700/50 p-8 animate-pulse">
            <div className="space-y-6">
              <div className="h-6 bg-gray-700 rounded w-1/3"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-[#0a0a2e] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/mobile/assets-history')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Withdrawal Details</h1>
          </div>
          
          <Card className="bg-black/20 border-gray-700/50 p-8">
            <div className="text-center">
              <p className="text-gray-400">Withdrawal transaction not found</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const longTransactionId = generateLongTransactionId(transaction._id || 'N/A');

  return (
    <div className="min-h-screen bg-[#0a0a2e] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mobile/assets-history')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ArrowUpRight className="w-8 h-8 text-orange-500" />
              Withdrawal Details
            </h1>
            <p className="text-gray-400">Transaction information and withdrawal summary</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Withdrawal Summary */}
          <Card className="bg-black/20 border-gray-700/50 p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center border border-gray-700/50">
                  <CryptoLogo 
                    symbol={transaction.cryptoSymbol}
                    size={40}
                    className="rounded-full"
                  />
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-2">Withdrawn Amount</p>
                <h2 className="text-white text-3xl font-bold mb-2">
                  {(transaction.cryptoAmount || 0).toFixed(8)} {transaction.cryptoSymbol}
                </h2>
                <p className="text-gray-300 text-lg">
                  ≈ ${(transaction.usdAmount || 0).toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
              
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Completed
                </Badge>
              </div>
            </div>
          </Card>

          {/* Transaction Details */}
          <Card className="bg-black/20 border-gray-700/50 p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Hash className="w-5 h-5 text-orange-500" />
              Transaction Details
            </h3>
            
            <div className="space-y-6">
              {/* Transaction ID */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Transaction ID</p>
                <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-gray-700/50">
                  <span className="text-white font-mono text-sm break-all">
                    {longTransactionId}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(longTransactionId)}
                    className="ml-2 text-orange-400 hover:text-orange-300"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Destination Address */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Destination Address</p>
                <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-gray-700/50">
                  <span className="text-white font-mono text-sm break-all">
                    {transaction.walletAddress || 'N/A'}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(transaction.walletAddress || '')}
                    className="ml-2 text-orange-400 hover:text-orange-300"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Date & Time</p>
                <div className="flex items-center text-white">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Network */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Network</p>
                <div className="flex items-center text-white">
                  <Network className="w-4 h-4 text-gray-400 mr-2" />
                  {transaction.cryptoSymbol === 'BTC' ? 'Bitcoin Network' :
                   transaction.cryptoSymbol === 'ETH' ? 'Ethereum Network' :
                   transaction.cryptoSymbol === 'USDT' ? 'ERC-20 Network' :
                   transaction.cryptoSymbol === 'BNB' ? 'BSC Network' :
                   'Unknown Network'}
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Status</p>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-green-400 font-medium">Successful</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="bg-black/20 border-gray-700/50 p-6 mt-8">
          <div className="text-center text-gray-400">
            <p className="text-sm">
              This withdrawal has been successfully processed and sent to your external wallet.
              For any questions regarding this transaction, please contact our support team.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}