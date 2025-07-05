import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Bug, RefreshCw, Eye, EyeOff, TestTube } from 'lucide-react';
import { showSuccessBanner, showErrorBanner, showWarningBanner, showInfoBanner } from '@/hooks/use-bottom-banner';

interface BannerDebugPanelProps {
  onClose: () => void;
}

export function BannerDebugPanel({ onClose }: BannerDebugPanelProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState(false);

  // Fetch current auth status
  const { data: authData, refetch: refetchAuth } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: 1
  });

  // Fetch current KYC status
  const { data: kycData, refetch: refetchKyc, error: kycError } = useQuery({
    queryKey: ['/api/verification/status'],
    enabled: !!user,
    retry: 1
  });

  const handleRefreshAll = () => {
    console.log('🔄 Manual refresh of all banner-related queries');
    queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
    refetchAuth();
    refetchKyc();
  };

  const testBannerLogic = () => {
    const bannerConditions = {
      hasUser: !!user,
      isNotLoading: !kycData,
      hasKycStatus: !!kycData,
      isNoneOrRejected: (kycData as any)?.data?.kycStatus === 'none' || (kycData as any)?.data?.kycStatus === 'rejected',
      shouldShow: user && kycData && ((kycData as any)?.data?.kycStatus === 'none' || (kycData as any)?.data?.kycStatus === 'rejected')
    };

    console.log('🎯 Banner Logic Test:', bannerConditions);
    return bannerConditions;
  };

  const bannerLogic = testBannerLogic();

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-700 p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <Bug className="w-5 h-5" />
            <span>Banner Debug Panel</span>
          </h3>
          <Button onClick={onClose} variant="ghost" size="sm">
            ×
          </Button>
        </div>

        <div className="space-y-4">
          {/* Authentication Status */}
          <div className="bg-gray-800 p-3 rounded">
            <h4 className="text-orange-500 font-medium mb-2">Authentication</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div>User: {user ? '✅ Authenticated' : '❌ Not authenticated'}</div>
              <div>User ID: {user?.id || 'None'}</div>
              <div>Username: {user?.username || 'None'}</div>
            </div>
          </div>

          {/* KYC Status */}
          <div className="bg-gray-800 p-3 rounded">
            <h4 className="text-orange-500 font-medium mb-2">KYC Status</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div>Status: {(kycData as any)?.data?.kycStatus || 'Unknown'}</div>
              <div>Has Data: {(kycData as any)?.data ? '✅' : '❌'}</div>
              <div>Error: {kycError?.message || 'None'}</div>
            </div>
          </div>

          {/* Banner Logic */}
          <div className="bg-gray-800 p-3 rounded">
            <h4 className="text-orange-500 font-medium mb-2">Banner Logic</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div>Has User: {bannerLogic.hasUser ? '✅' : '❌'}</div>
              <div>Has KYC Data: {bannerLogic.hasKycStatus ? '✅' : '❌'}</div>
              <div>Status none/rejected: {bannerLogic.isNoneOrRejected ? '✅' : '❌'}</div>
              <div className="font-bold">Should Show Banner: {bannerLogic.shouldShow ? '✅ YES' : '❌ NO'}</div>
            </div>
          </div>

          {/* Debug Details */}
          <div className="bg-gray-800 p-3 rounded">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-400"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>Raw Data</span>
            </button>
            
            {showDetails && (
              <div className="mt-2 text-xs text-gray-400 bg-gray-900 p-2 rounded overflow-auto">
                <div className="mb-2">
                  <strong>Auth Data:</strong>
                  <pre>{JSON.stringify(authData, null, 2)}</pre>
                </div>
                <div>
                  <strong>KYC Data:</strong>
                  <pre>{JSON.stringify(kycData, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Banner Testing */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center">
              <TestTube className="w-4 h-4 mr-2 text-orange-400" />
              Banner Testing
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => showSuccessBanner('Test Success', 'Success banner is working!')}
                className="bg-green-600 hover:bg-green-700 text-xs"
              >
                Success
              </Button>
              <Button 
                onClick={() => showErrorBanner('Test Error', 'Error banner is working!')}
                className="bg-red-600 hover:bg-red-700 text-xs"
              >
                Error
              </Button>
              <Button 
                onClick={() => showWarningBanner('Test Warning', 'Warning banner is working!')}
                className="bg-orange-600 hover:bg-orange-700 text-xs"
              >
                Warning
              </Button>
              <Button 
                onClick={() => showInfoBanner('Test Info', 'Info banner is working!')}
                className="bg-blue-600 hover:bg-blue-700 text-xs"
              >
                Info
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button onClick={handleRefreshAll} className="flex-1 bg-orange-500 hover:bg-orange-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh All
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}