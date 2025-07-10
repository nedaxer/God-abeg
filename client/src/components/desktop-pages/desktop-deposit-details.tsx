import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Copy, CheckCircle, Calendar, DollarSign, Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import CryptoLogo from '@/components/crypto-logo';
import { showSuccessBanner } from '@/hooks/use-bottom-banner';

const generateLongTransactionId = (shortId: string): string => {
  const prefix = "0x126975caaf44D603307a95E2d26";
  const suffix = "70F6Ef46e563C";
  return `${prefix}${shortId.slice(-8).toUpperCase()}${suffix}`;
};

// Function to get correct deposit address based on crypto symbol and chain
const getDepositAddress = (cryptoSymbol: string, chainType: string): string => {
  const addresses = {
    'USDT': {
      'ERC20': '0x126975caaf44D603307a95E2d2670F6Ef46e563C',
      'TRC20': 'THA5iGZk9mBq5742scd9NsvqAPiJcgt4QL',
      'BSC': '0x126975caaf44D603307a95E2d2670F6Ef46e563C'
    },
    'BTC': {
      'Bitcoin': 'bc1qq35fj5pxkwflsrlt4xk8jta5wx22qy4knnt2q2'
    },
    'ETH': {
      'ETH': '0x126975caaf44D603307a95E2d2670F6Ef46e563C',
      'ETH (BEP-20)': '0x126975caaf44D603307a95E2d2670F6Ef46e563C'
    },
    'BNB': {
      'BEP-20': '0x126975caaf44D603307a95E2d2670F6Ef46e563C'
    }
  };
  
  return addresses[cryptoSymbol as keyof typeof addresses]?.[chainType as keyof typeof addresses[keyof typeof addresses]] || '';
};

export default function DesktopDepositDetails() {
  const { transactionId } = useParams();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);

  // Fetch transaction details
  const { data: transactionResponse, isLoading, error } = useQuery({
    queryKey: [`/api/deposits/details/${transactionId}`],
    enabled: !!transactionId,
  });

  const transaction = (transactionResponse as any)?.data;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showSuccessBanner(
        "Copied!",
        "Address copied to clipboard"
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
            <h1 className="text-3xl font-bold text-white">Deposit Details</h1>
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
            <h1 className="text-3xl font-bold text-white">Deposit Details</h1>
          </div>
          
          <Card className="bg-black/20 border-gray-700/50 p-8">
            <div className="text-center">
              <p className="text-gray-400">Deposit transaction not found</p>
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
              <DollarSign className="w-8 h-8 text-green-500" />
              Deposit Details
            </h1>
            <p className="text-gray-400">Transaction information and deposit summary</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Deposit Summary */}
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
                <p className="text-gray-400 text-sm mb-2">Received Amount</p>
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
              {/* Deposit Address */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Deposit Address</p>
                <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-gray-700/50">
                  <span className="text-white font-mono text-sm break-all">
                    {getDepositAddress(transaction.cryptoSymbol, transaction.chainType)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(getDepositAddress(transaction.cryptoSymbol, transaction.chainType))}
                    className="ml-2 text-orange-400 hover:text-orange-300"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

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
                <div className="text-white">
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
              This deposit has been successfully processed and added to your account balance.
              For any questions regarding this transaction, please contact our support team.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}