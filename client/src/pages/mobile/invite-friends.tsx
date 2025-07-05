import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Copy, Share, Users, Gift, TrendingUp, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/language-context';

interface ReferralStats {
  totalEarnings: number;
  totalReferrals: number;
  monthlyEarnings: number;
  referralCode: string;
  recentEarnings: Array<{
    id: number;
    amount: number;
    percentage: number;
    transactionType: string;
    referredUserEmail: string;
    createdAt: string;
  }>;
}

export default function InviteFriends() {
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Fetch referral stats
  const { data: referralStats } = useQuery<ReferralStats>({
    queryKey: ['/api/referrals/stats']
  });

  const referralLink = `https://nedaxer.app/register?ref=${referralStats?.referralCode || 'LOADING'}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Nedaxer - Crypto Trading Platform',
          text: 'Start trading crypto with zero fees! Use my referral link to get bonus rewards.',
          url: referralLink
        });
      } catch (err) {
        // Fallback to copy if sharing fails
        copyToClipboard(referralLink);
      }
    } else {
      copyToClipboard(referralLink);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-800">
        <Link href="/mobile">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-lg font-semibold">{t('invite_friends')}</h1>
        <div className="w-6 h-6" />
      </div>

      {/* Hero Section */}
      <div className="p-4 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('referral_program')}</h2>
        <p className="text-gray-400 text-sm mb-6">
          {t('invite_friends')} and earn up to 25% commission on their trading activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-6">
        <Card className="bg-blue-950 border-blue-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-gray-400 text-xs">Total Earnings</span>
          </div>
          <div className="text-xl font-bold text-green-500">
            ${referralStats?.totalEarnings?.toFixed(2) || '0.00'}
          </div>
        </Card>

        <Card className="bg-blue-950 border-blue-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-gray-400 text-xs">Total Referrals</span>
          </div>
          <div className="text-xl font-bold text-blue-500">
            {referralStats?.totalReferrals || 0}
          </div>
        </Card>
      </div>

      {/* Monthly Earnings */}
      <div className="px-4 mb-6">
        <Card className="bg-blue-950 border-blue-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-gray-400 text-sm">This Month</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-orange-500">
                ${referralStats?.monthlyEarnings?.toFixed(2) || '0.00'}
              </div>
              <div className="text-xs text-gray-400">Monthly Earnings</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Referral Link */}
      <div className="px-4 mb-6">
        <h3 className="text-white font-medium mb-3 text-sm">Your Referral Link</h3>
        <Card className="bg-blue-950 border-blue-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 mr-3">
              <div className="text-gray-400 text-xs mb-1">Referral Code</div>
              <div className="text-white font-mono text-sm">
                {referralStats?.referralCode || 'Loading...'}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-900 rounded-lg p-3 mb-3">
            <div className="text-gray-300 text-xs break-all">
              {referralLink}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>
            </button>
            
            <button
              onClick={shareReferralLink}
              className="flex-1 bg-blue-800 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Commission Rates */}
      <div className="px-4 mb-6">
        <h3 className="text-white font-medium mb-3 text-sm">Commission Rates</h3>
        <div className="space-y-2">
          <Card className="bg-blue-950 border-blue-700 p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Spot Trading</span>
              <span className="text-orange-500 font-medium">20%</span>
            </div>
          </Card>
          <Card className="bg-blue-950 border-blue-700 p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Futures Trading</span>
              <span className="text-orange-500 font-medium">25%</span>
            </div>
          </Card>
          <Card className="bg-blue-950 border-blue-700 p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Staking Rewards</span>
              <span className="text-orange-500 font-medium">15%</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Earnings */}
      <div className="px-4 pb-6">
        <h3 className="text-white font-medium mb-3 text-sm">Recent Earnings</h3>
        <div className="space-y-3">
          {referralStats?.recentEarnings?.map((earning) => (
            <Card key={earning.id} className="bg-blue-950 border-blue-700 p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white text-sm font-medium">
                      +${earning.amount.toFixed(2)}
                    </span>
                    <span className="bg-orange-600 text-orange-100 text-xs px-2 py-1 rounded">
                      {earning.percentage}%
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    {earning.transactionType.charAt(0).toUpperCase() + earning.transactionType.slice(1)} 
                    {' • '}
                    {earning.referredUserEmail.split('@')[0]}***
                  </div>
                </div>
                <div className="text-gray-500 text-xs">
                  {formatDate(earning.createdAt)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}