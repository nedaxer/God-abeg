import React, { useState, useRef, useEffect } from 'react';
import MobileLayout from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft,
  ChevronRight,
  Users,
  Shield,
  Settings,
  Bell,
  Info,
  Copy,
  Headphones,
  Camera,
  User
} from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import { VerificationBadge } from '@/components/verification-badge';

export default function MobileProfile() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { getBackgroundClass, getTextClass, getCardClass, getBorderClass } = useTheme();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch KYC status from API
  const { data: kycStatus } = useQuery({
    queryKey: ['/api/verification/status'],
    enabled: !!user?.id,
  }) as { data?: { data?: { kycStatus?: string } } };

  // Use the actual UID from the database
  const userUID = user?.uid || 'N/A';



  // Profile picture upload mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { profilePicture?: string }) => {
      console.log('Updating profile with data:', { hasProfilePicture: !!data.profilePicture });
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const result = await response.json();
      console.log('Profile update response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Profile update successful:', data);
      
      // Update the user data in React Query cache immediately
      queryClient.setQueryData(['/api/auth/user'], (oldData: any) => {
        if (oldData?.user) {
          return {
            ...oldData,
            user: {
              ...oldData.user,
              profilePicture: data.user?.profilePicture || data.profilePicture
            }
          };
        }
        return oldData;
      });
      
      // Trigger global profile update event for synchronization
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      
      toast({
        title: t('profile_updated') || 'Profile Updated',
        description: t('picture_updated_success') || 'Profile picture updated successfully'
      });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast({
        title: t('updateFailed') || 'Update Failed',
        description: error.message || t('picture_update_failed') || 'Failed to update profile picture',
        variant: "destructive"
      });
    }
  });

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected for upload:', { 
        name: file.name, 
        size: file.size, 
        type: file.type 
      });

      if (!file.type.startsWith('image/')) {
        toast({
          title: t('invalidFileType') || 'Invalid File Type',
          description: t('select_image_file') || 'Please select an image file',
          variant: "destructive"
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: t('fileTooLarge') || 'File Too Large',
          description: t('select_smaller_image') || 'Please select an image smaller than 5MB',
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        console.log('File converted to base64, length:', base64.length);
        updateProfileMutation.mutate({ profilePicture: base64 });
      };
      reader.onerror = () => {
        console.error('FileReader error');
        toast({
          title: t('uploadFailed') || 'Upload Failed',
          description: t('failed_to_read_image') || 'Failed to read image file',
          variant: "destructive"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [queryClient]);

  const menuItems = [
    {
      icon: Users,
      label: t('inviteFriends'),
      href: '/mobile/invite-friends',
      rightElement: <ChevronRight className="w-3 h-3 text-gray-400" />
    },
    {
      icon: Shield,
      label: t('identityVerification'),
      href: '/mobile/kyc-status',
      rightElement: (
        <div className="flex items-center space-x-1">
          <span className={`text-xs ${
            (kycStatus as any)?.data?.kycStatus === 'verified' 
              ? 'text-green-500' 
              : (kycStatus as any)?.data?.kycStatus === 'pending'
                ? 'text-yellow-500'
                : 'text-red-500'
          }`}>
            {(kycStatus as any)?.data?.kycStatus === 'verified' 
              ? t('lv1_verified')
              : (kycStatus as any)?.data?.kycStatus === 'pending'
                ? t('processing')
                : t('not_verified')
            }
          </span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
        </div>
      )
    },
    {
      icon: Settings,
      label: t('security'),
      href: '/mobile/security',
      rightElement: <ChevronRight className="w-3 h-3 text-gray-400" />
    },
    {
      icon: Bell,
      label: t('notificationCenter'),
      href: '/mobile/notifications',
      rightElement: <ChevronRight className="w-3 h-3 text-gray-400" />
    },
    {
      icon: Headphones,
      label: t('helpContact'),
      href: '/company/contact',
      rightElement: <ChevronRight className="w-3 h-3 text-gray-400" />
    },
    {
      icon: Info,
      label: t('aboutUs'),
      href: '/company/about',
      rightElement: <ChevronRight className="w-3 h-3 text-gray-400" />
    }
  ];

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-[#0a0a2e]">
          <Link href="/mobile">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="flex items-center space-x-2">
            <Link href="/mobile/chatbot">
              <Headphones className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
            </Link>
            <Link href="/mobile/settings">
              <Settings className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
            </Link>
          </div>
        </div>

      {/* Profile Header */}
      <div className="px-4 pb-4">
        <div className="flex items-start space-x-3 mb-3">
          <div 
            className="relative w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-7 h-7 text-gray-300" />
            )}
            <div className="absolute -bottom-0.5 -right-0.5 bg-orange-500 rounded-full p-0.5">
              <Camera className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleProfilePictureUpload}
            className="hidden"
          />
          <div className="flex-1 pt-0.5">
            <div className="flex items-center space-x-1 mb-1">
              <h2 className="text-white text-base font-medium">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.username || 'User'}
              </h2>
              {(kycStatus as any)?.data?.kycStatus === 'verified' && <VerificationBadge />}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs">
                UID: {userUID}
              </span>
              <Copy 
                className="w-3 h-3 text-gray-400 cursor-pointer hover:text-white"
                onClick={() => {
                  navigator.clipboard.writeText(userUID);
                  toast({
                    title: t('common.copied') || 'Copied',
                    description: t('profile.uidCopied') || 'UID copied to clipboard',
                  });
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-gray-800 rounded-lg p-2.5 flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">0</span>
            </div>
            <span className="text-white text-xs font-medium">Non-VIP</span>
          </div>
          <div className="bg-gray-800 rounded-lg p-2.5 flex items-center space-x-2">
            <Shield className={`w-4 h-4 ${(kycStatus as any)?.data?.kycStatus === 'verified' ? 'text-green-500' : 'text-gray-400'}`} />
            <span className="text-white text-xs font-medium">
              {(kycStatus as any)?.data?.kycStatus === 'verified' ? 'Verified ID' : 'Not Verified'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-1 flex-1">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card className="bg-gray-800 border-gray-700 p-2 hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4 text-orange-500" />
                  <span className="text-white text-xs font-medium">{item.label}</span>
                </div>
                {item.rightElement}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Account Actions - Fixed at bottom */}
      <div className="px-4 py-3 space-y-2 mt-auto">
        <Button 
          variant="outline" 
          className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700 text-xs py-1.5"
        >
          Switch/Create Account
        </Button>

        <Button 
          variant="destructive" 
          className="w-full bg-red-900 hover:bg-red-800 text-white text-xs py-1.5"
          onClick={async () => {
            try {
              // Auto-backup user data before logout
              if (user?.id) {
                await fetch('/api/user/backup', {
                  method: 'GET',
                  credentials: 'include'
                }).catch(err => console.log('Backup failed:', err));
              }
              
              // Clear all caches before logout
              queryClient.clear();
              
              // Perform logout
              await logoutMutation.mutateAsync();
              
              // Force redirect to login page after successful logout
              window.location.href = '/account/login';
              
            } catch (error) {
              console.error('Error during logout:', error);
              // Force logout and redirect even if there's an error
              queryClient.clear();
              window.location.href = '/account/login';
            }
          }}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? 'Logging out...' : (t('logout') || 'Logout')}
        </Button>
      </div>

        {/* App Version */}
        <div className="px-4 pb-4">
          <div className="text-center text-gray-500 text-xs">
            Version 1.0.0
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}