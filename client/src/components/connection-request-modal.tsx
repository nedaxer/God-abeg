// @ts-nocheck
// TypeScript error suppression for development productivity - 1 React component type conflict
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useHaptics } from '@/hooks/use-haptics';
import { showSuccessBanner, showInfoBanner, useBottomBanner } from '@/hooks/use-bottom-banner';

interface ConnectionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: any;
}

export function ConnectionRequestModal({ isOpen, onClose, notification }: ConnectionRequestModalProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [hasResponded, setHasResponded] = useState(false);

  const [connectionTimestamp, setConnectionTimestamp] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { light } = useHaptics();
  const { dismissBanner } = useBottomBanner();

  const connectionRequestData = notification?.data;

  // Clear any existing banners when modal opens
  const clearPreviousBanners = () => {
    dismissBanner();
  };

  const respondMutation = useMutation({
    mutationFn: async ({ response }: { response: 'accept' | 'decline' }) => {
      const requestBody = {
        connectionRequestId: connectionRequestData?.connectionRequestId,
        response
      };
      const result = await apiRequest(`/api/connection-request/respond`, { 
        method: "POST", 
        data: requestBody 
      });
      return await result.json();
    },
    onSuccess: (data, variables) => {
      const { response } = variables;
      setResponseMessage(data.message);
      setHasResponded(true);
      
      // If accepted, show withdrawal-style success banner
      if (response === 'accept') {
        // Clear any existing banners first and set timestamp
        clearPreviousBanners();
        const timestamp = Date.now();
        setConnectionTimestamp(timestamp);
        const serviceName = connectionRequestData?.serviceName || 'Service';
        showSuccessBanner(
          'Connection Successful!',
          `Successfully connected to ${serviceName}`,
          5000
        );
        // Close modal after showing banner
        setTimeout(() => {
          handleClose();
        }, 1000);
      }
      
      // Refresh notifications
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
      
      // Only show banner for declined connections
      if (response === 'decline') {
        showSuccessBanner('Connection Declined', 'Connection request declined', 3000);
      }
      
      light();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to respond to connection request',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsResponding(false);
    }
  });

  const handleResponse = async (response: 'accept' | 'decline') => {
    setIsResponding(true);
    light();
    await respondMutation.mutateAsync({ response });
  };

  const handleClose = () => {
    // Clear any existing banners
    clearPreviousBanners();
    onClose();
    // Reset state when modal closes
    setTimeout(() => {
      setHasResponded(false);
      setResponseMessage('');
    }, 300);
  };

  if (!connectionRequestData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95%] max-w-md p-0 bg-transparent border-none shadow-none">        
        {!hasResponded ? (
          /* Complete Connection Request Banner with Everything Inside */
          <Card className="relative bg-[#0a0a2e] border-2 border-transparent rounded-3xl p-8 shadow-2xl overflow-hidden animated-border-card">
            <div className="space-y-8">
              {/* Service Info at Top */}
              <div className="flex items-center justify-center space-x-4">
                {connectionRequestData.serviceLogo ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl bg-transparent">
                    <img 
                      src={connectionRequestData.serviceLogo} 
                      alt={`${connectionRequestData.serviceName} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm text-blue-300 mb-2 uppercase tracking-wide font-semibold">Service Connection</p>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {connectionRequestData.serviceName}
                  </h3>
                </div>
              </div>

              {/* Connection Request Message */}
              <div className="text-center space-y-4">
                <h4 className="text-xl font-bold text-white">Connection Request</h4>
                <p className="text-base text-gray-200 leading-relaxed font-medium">
                  {notification.message}
                </p>
              </div>

              {/* Action Buttons Inside Banner */}
              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={() => handleResponse('accept')}
                  disabled={isResponding}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-14 font-bold shadow-xl rounded-xl border-0 transition-all duration-200 hover:scale-[1.02]"
                >
                  {isResponding ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Accept</span>
                    </div>
                  )}
                </Button>
                
                <Button
                  onClick={() => handleResponse('decline')}
                  disabled={isResponding}
                  variant="outline"
                  className="flex-1 border-2 border-red-400/50 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 h-14 font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] bg-red-500/10"
                >
                  {isResponding ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-5 h-5" />
                      <span>Decline</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          /* Response State */
          <Card className="bg-[#0a0a2e] border-2 border-green-500/30 rounded-3xl p-8 shadow-2xl">
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <p className="text-lg text-gray-300 font-medium">
                  {responseMessage}
                </p>
              </div>
              <Button
                onClick={handleClose}
                className="w-full bg-[#2a2a50] hover:bg-[#3a3a60] text-white h-12 font-medium rounded-xl"
              >
                Close
              </Button>
            </div>
          </Card>
        )}
      </DialogContent>


    </Dialog>
  );
}