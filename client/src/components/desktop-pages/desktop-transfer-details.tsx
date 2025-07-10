import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Copy, CheckCircle, Calendar, ArrowUpRight, ArrowDownLeft, Hash, User, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { showSuccessBanner } from '@/hooks/use-bottom-banner';
import { useAuth } from '@/hooks/use-auth';

const generateLongTransactionId = (shortId: string): string => {
  return `ed1917f2cc90491c9a06fe6a58e9d9b6095a4143442140e48f1cc839a76f21ec`;
};

export default function DesktopTransferDetails() {
  const { transactionId } = useParams();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  // Fetch transfer details
  const { data: transferResponse, isLoading, error } = useQuery({
    queryKey: [`/api/transfers/details/${transactionId}`],
    enabled: !!transactionId,
  });

  const transfer = (transferResponse as any)?.data;

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
            <h1 className="text-3xl font-bold text-white">Transfer Details</h1>
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

  if (error || !transfer) {
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
            <h1 className="text-3xl font-bold text-white">Transfer Details</h1>
          </div>
          
          <Card className="bg-black/20 border-gray-700/50 p-8">
            <div className="text-center">
              <p className="text-gray-400">Transfer transaction not found</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Use the type field from the API response which correctly determines sent/received
  const isReceived = transfer.type === 'received';
  const longTransactionId = generateLongTransactionId(transfer._id || 'N/A');

  const otherUser = isReceived 
    ? { name: transfer.senderName, id: transfer.fromUserId, email: transfer.senderEmail }
    : { name: transfer.recipientName, id: transfer.toUserId, email: transfer.recipientEmail };

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
              {isReceived ? (
                <ArrowDownLeft className="w-8 h-8 text-green-500" />
              ) : (
                <ArrowUpRight className="w-8 h-8 text-orange-500" />
              )}
              Transfer Details
            </h1>
            <p className="text-gray-400">
              {isReceived ? 'Money received from another user' : 'Money sent to another user'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transfer Summary */}
          <Card className="bg-black/20 border-gray-700/50 p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center items-center space-x-4">
                {/* Current User */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center border-2 border-orange-500/30">
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Your Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">You</span>
                </div>

                {/* Transfer Direction */}
                <div className="flex items-center">
                  {isReceived ? (
                    <ArrowDownLeft className="w-6 h-6 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-orange-400" />
                  )}
                </div>

                {/* Other User */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center border border-gray-700/50">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-400 mt-1 truncate max-w-16">
                    {otherUser.name.split(' ')[0]}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-2">Amount</p>
                <h2 className="text-white text-3xl font-bold mb-2">
                  {isReceived ? '+' : '-'} ${transfer.amount?.toLocaleString('en-US', { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  })}
                </h2>
                <p className="text-gray-300 text-lg">USD</p>
              </div>
              
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <Badge className={`${isReceived ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                  {isReceived ? 'Received' : 'Sent'}
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

              {/* Other User Details */}
              <div>
                <p className="text-gray-400 text-sm mb-2">
                  {isReceived ? 'From' : 'To'}
                </p>
                <div className="bg-black/30 rounded-lg p-3 border border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-white font-medium">{otherUser.name}</div>
                      <div className="text-gray-400 text-sm">{otherUser.email}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Date & Time</p>
                <div className="flex items-center text-white">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  {new Date(transfer.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Status</p>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-green-400 font-medium">Completed</span>
                </div>
              </div>

              {/* Description */}
              {transfer.description && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Note</p>
                  <div className="bg-black/30 rounded-lg p-3 border border-gray-700/50">
                    <p className="text-white text-sm">{transfer.description}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="bg-black/20 border-gray-700/50 p-6 mt-8">
          <div className="text-center text-gray-400">
            <p className="text-sm">
              This transfer has been successfully processed between Nedaxer users.
              For any questions regarding this transaction, please contact our support team.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}