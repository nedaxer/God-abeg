import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Copy, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

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
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const { toast } = useToast();

  // Fetch referral stats with real-time updates
  const { data: referralStats, isLoading, error } = useQuery<ReferralStats>({
    queryKey: ['/api/referrals/stats'],
    refetchInterval: 5000, // Update every 5 seconds
    staleTime: 2000, // Consider data stale after 2 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  // Debug logging
  console.log('Referral Stats Debug:', { 
    hasData: !!referralStats, 
    referralCode: referralStats?.referralCode,
    isLoading, 
    error: error?.message || error,
    fullData: referralStats
  });

  // Create test data in development if needed
  const createTestData = async () => {
    try {
      const response = await fetch('/api/referrals/create-test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      console.log('Test data creation result:', result);
      // Refresh the data
      window.location.reload();
    } catch (error) {
      console.error('Error creating test data:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading referral information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p>Failed to load referral data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const copyReferralCode = async () => {
    if (!referralStats?.referralCode) {
      toast({
        title: "Error",
        description: "Referral code not available yet. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await navigator.clipboard.writeText(referralStats.referralCode);
      setCopyCodeSuccess(true);
      toast({
        title: "Referral Code Copied!",
        description: "Share this code with your friends",
      });
      setTimeout(() => setCopyCodeSuccess(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy referral code",
        variant: "destructive"
      });
    }
  };

  const shareReferralCode = async () => {
    if (!referralStats?.referralCode) return;
    
    const shareText = `Join me on Nedaxer!\n\nUse my referral code: ${referralStats.referralCode}\n\nSign up and start investing today!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Nedaxer - Investment Platform',
          text: shareText
        });
      } catch (err) {
        copyReferralCode();
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Share Message Copied!",
          description: "Paste this message to share with friends",
        });
      } catch (err) {
        copyReferralCode();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0d0d3a] border-b border-orange-500/20">
        <Link href="/mobile">
          <ArrowLeft className="w-6 h-6 text-white hover:text-orange-400 transition-colors" />
        </Link>
        <h1 className="text-xl font-bold text-white">
          Invite Friends
        </h1>
        <div className="w-6 h-6" />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
        {/* Main Card */}
        <div className="w-full max-w-md bg-[#1a1a4a]/50 border border-orange-500/20 rounded-2xl p-8 backdrop-blur-sm">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">
              Your Referral Code
            </h2>
            <p className="text-gray-300 text-sm">
              Share this code with friends to invite them to Nedaxer
            </p>
          </div>

          {/* Code Display */}
          <div className="text-center mb-8">
            <div className="bg-[#0a0a2e] border border-orange-500/30 rounded-xl p-6 mb-6">
              <div className="text-orange-400 text-xs font-medium mb-2 uppercase tracking-wide">
                Your Code
              </div>
              <div className="text-2xl font-bold text-white font-mono tracking-wider break-all">
                {isLoading ? 'Loading...' : error ? 'Error loading code' : referralStats?.referralCode || 'No code yet'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={copyReferralCode}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl text-base font-bold flex items-center justify-center space-x-3 transition-all"
            >
              <Copy className="w-5 h-5" />
              <span>{copyCodeSuccess ? 'Copied!' : 'Copy Code'}</span>
            </button>
            
            <button
              onClick={shareReferralCode}
              className="w-full bg-[#1a1a4a] hover:bg-[#2a2a5a] border border-orange-500/30 text-white py-4 px-6 rounded-xl text-base font-bold flex items-center justify-center space-x-3 transition-all"
            >
              <Share className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Simple Instructions */}
        <div className="mt-8 text-center max-w-md">
          <p className="text-gray-400 text-sm leading-relaxed">
            When friends sign up using your referral code, both of you will benefit from special rewards.
          </p>
          
          {/* Development Debug Button */}
          {process.env.NODE_ENV === 'development' && (!referralStats?.referralCode || referralStats?.referralCode === 'No code yet') && (
            <button
              onClick={createTestData}
              className="mt-4 px-4 py-2 bg-red-600 text-white text-xs rounded"
            >
              [DEV] Create Test Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}