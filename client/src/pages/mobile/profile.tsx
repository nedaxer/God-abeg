import React, { useState, useRef, useEffect } from 'react';
import AdaptiveLayout from '@/components/adaptive-layout';
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
  User,
  Heart,
  Download,
  Globe,
  MapPin,
  Monitor,
  Trash2,
  Clock,
  LogOut,
  CheckCircle,
  Play,
  Check
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
  const [copiedUID, setCopiedUID] = useState(false);

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

    const copyUID = async () => {
    if (user?.uid) {
      try {
        await navigator.clipboard.writeText(user.uid);
        setCopiedUID(true);
        toast({
          title: "UID Copied",
          description: "Your UID has been copied to clipboard"
        });

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopiedUID(false);
        }, 2000);
      } catch (error) {
        console.error('Failed to copy UID:', error);
        toast({
          title: "Copy Failed",
          description: "Failed to copy UID to clipboard",
          variant: "destructive"
        });
      }
    }
  };

  // Clean up any duplicate verified badges that might exist from old code
  useEffect(() => {
    const cleanupDuplicateBadges = () => {
      // Remove any old-style verified badges
      const oldBadges = document.querySelectorAll('.verified-badge, img[src="/verified-badge.svg"]');
      oldBadges.forEach(badge => badge.remove());
    };

    cleanupDuplicateBadges();
  }, [user, kycStatus]);



  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to log out?');
    
    if (!confirmed) {
      return; // User cancelled, don't proceed with logout
    }

    try {
      console.log('🔴 Profile logout button clicked');

      // Auto-backup user data before logout
      if (user?.id) {
        await fetch('/api/user/backup', {
          method: 'GET',
          credentials: 'include'
        }).catch(err => console.log('Backup failed:', err));
      }

      // Perform logout (auth hook will handle all cleanup and redirect)
      await logoutMutation.mutateAsync();

    } catch (error) {
      console.error('🔴 Profile logout error:', error);

      // Force manual cleanup if mutation fails
      localStorage.clear();
      sessionStorage.clear();

      // Clear cookies manually with all variations
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure;samesite=strict`;
      });

      // Force redirect even on complete failure
      window.location.href = '/account/login';
    }
  };

  return (
    <AdaptiveLayout title="Nedaxer - Profile">
      <div className="h-screen bg-[#0a0a2e] text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-[#0a0a2e]">
          <Link href="/mobile">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-base font-medium text-white">My Profile</h1>
          <div className="w-5 h-5"></div> {/* Spacer to maintain center alignment */}
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-start px-4 py-4 bg-[#0a0a2e]">
          <div className="flex items-start space-x-3 mb-4 w-full">
            <div 
              className="relative w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-300" />
              )}
              <div className="absolute -bottom-0 -right-0 bg-gray-600 rounded-full p-0.5">
                <Camera className="w-2 h-2 text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />

            <div className="flex-1">
              <div className="flex items-center space-x-1 mb-1">
                <h2 className="text-base font-medium text-white user-name">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.username || 'User'}
                </h2>
                {(kycStatus as any)?.data?.kycStatus === 'verified' && (
                  <img 
                    src="/attached_assets/ce6bcd1643c04a4e8a6ba3984945a67d_1753543618125.png" 
                    alt="Verified" 
                    className="w-4 h-4 ml-2 inline-block"
                    loading="eager"
                    decoding="async"
                  />
                )}
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <p className="text-gray-400 text-xs">
                  UID: {userUID}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(userUID);
                    setCopiedUID(true);
                    setTimeout(() => setCopiedUID(false), 2000);
                    toast({
                      title: "✅ UID Copied!",
                      description: `Your UID ${userUID} has been copied to clipboard`,
                      duration: 2000,
                    });
                  }}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {copiedUID ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              <Link href="/mobile/profile-settings">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-xs">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Menu Content - Fill remaining space and stretch to bottom */}
        <div className="bg-[#0a0a2e] px-4 pt-2 flex-1 flex flex-col">

          {/* Profile Menu Items - Expanding to fill available space */}
          <div className="flex-1 flex flex-col">
            {/* Invite Friends */}
            <div className="cursor-pointer flex-1">
              <Link href="/mobile/invite-friends">
                <div className="flex items-center justify-between py-6 px-1 border-b border-gray-600 h-full">
                  <div className="flex items-center space-x-4">
                    <Users className="w-5 h-5 text-white" />
                    <span className="text-white text-base">Invite Friends</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            </div>

            {/* Notification Settings */}
            <div className="cursor-pointer flex-1">
              <Link href="/mobile/notification-settings">
                <div className="flex items-center justify-between py-6 px-1 border-b border-gray-600 h-full">
                  <div className="flex items-center space-x-4">
                    <Bell className="w-5 h-5 text-white" />
                    <span className="text-white text-base">Notification Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            </div>

            {/* About Us */}
            <div className="cursor-pointer flex-1">
              <Link href="/company/about">
                <div className="flex items-center justify-between py-6 px-1 border-b border-gray-600 h-full">
                  <div className="flex items-center space-x-4">
                    <Info className="w-5 h-5 text-white" />
                    <span className="text-white text-base">About Us</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            </div>

            {/* Contact Support */}
            <div className="cursor-pointer flex-1">
              <Link href="/mobile/messages">
                <div className="flex items-center justify-between py-6 px-1 border-b border-gray-600 h-full">
                  <div className="flex items-center space-x-4">
                    <Headphones className="w-5 h-5 text-white" />
                    <span className="text-white text-base">Contact Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            </div>

            {/* Log Out */}
            <div 
              className="cursor-pointer flex-1"
              onClick={handleLogout}
            >
              <div className="flex items-center justify-between py-6 px-1 h-full">
                <div className="flex items-center space-x-4">
                  <LogOut className="w-5 h-5 text-white" />
                  <span className="text-white text-base">Log Out</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* App Version - At bottom */}
          <div className="py-4 text-center text-gray-400 text-xs">
            App Version 2.3
          </div>
        </div>
      </div>
    </AdaptiveLayout>
  );
}