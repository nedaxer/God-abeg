import React, { useState, useRef, useEffect } from 'react';
import AdaptiveLayout from '@/components/adaptive-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Camera,
  User,
  Lock,
  ChevronDown,
  Mail,
  KeyRound,
  X,
  CheckCircle2
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CountryPhoneInput from '@/components/country-phone-input';

export default function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    gender: '',
    countryCode: '+1'
  });

  const [passwordResetStep, setPasswordResetStep] = useState<'init' | 'code' | 'new-password'>('init');
  const [resetData, setResetData] = useState({
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  
  // Edit state management
  const [editMode, setEditMode] = useState<{
    phoneNumber: boolean;
    birthDate: boolean;
    gender: boolean;
  }>({
    phoneNumber: false,
    birthDate: false,
    gender: false
  });

  const [tempValues, setTempValues] = useState({
    phoneNumber: '',
    birthDate: '',
    gender: ''
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      console.log('🔄 Initializing profile form with user data:', {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: (user as any).phoneNumber,
        dateOfBirth: (user as any).dateOfBirth,
        monthOfBirth: (user as any).monthOfBirth,
        yearOfBirth: (user as any).yearOfBirth,
        gender: (user as any).gender,
        countryCode: (user as any).countryCode
      });

      // Format date properly for date input
      let formattedDate = '';
      
      // First check if we have separate day, month, year fields (MongoDB format)
      if ((user as any).dateOfBirth && (user as any).monthOfBirth && (user as any).yearOfBirth) {
        const day = String((user as any).dateOfBirth).padStart(2, '0');
        const month = String((user as any).monthOfBirth).padStart(2, '0');
        const year = String((user as any).yearOfBirth);
        formattedDate = `${year}-${month}-${day}`;
        console.log('📅 Formatted date from separate fields:', formattedDate);
      }
      // Fallback to single dateOfBirth field if available
      else if ((user as any).dateOfBirth) {
        const dateStr = (user as any).dateOfBirth;
        if (dateStr.includes('-') && dateStr.length === 10) {
          formattedDate = dateStr; // Already in YYYY-MM-DD format
        } else if (dateStr.includes('/')) {
          // Handle MM/DD/YYYY or DD/MM/YYYY format from signup
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const [month, day, year] = parts;
            formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        } else {
          // Try to parse as year only and create a default date
          const year = parseInt(dateStr);
          if (!isNaN(year) && year > 1900 && year < 2010) {
            formattedDate = `${year}-06-15`; // Default to mid-year
          }
        }
      }

      // Use phoneNumber field first, fallback to phone for compatibility
      const userPhone = (user as any).phoneNumber || (user as any).phone || '';
      const userGender = (user as any).gender || '';
      
      // Extract country code and phone number properly
      let userCountryCode = (user as any).countryCode || '+1';
      let cleanPhoneNumber = userPhone;
      
      // If phone number starts with +, extract the country code from it
      if (userPhone && userPhone.startsWith('+')) {
        const phoneMatch = userPhone.match(/^(\+\d{1,4})\s*(.*)$/);
        if (phoneMatch) {
          userCountryCode = phoneMatch[1]; // e.g., "+49"
          cleanPhoneNumber = phoneMatch[2].trim(); // e.g., "31 161191"
        }
      }

      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        phoneNumber: cleanPhoneNumber,
        birthDate: formattedDate,
        gender: userGender,
        countryCode: userCountryCode
      });

      // Initialize temp values to avoid empty states
      setTempValues({
        phoneNumber: cleanPhoneNumber,
        birthDate: formattedDate,
        gender: userGender
      });
    }
  }, [user]);

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
        title: 'Profile Updated',
        description: 'Profile picture updated successfully'
      });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile picture',
        variant: "destructive"
      });
    }
  });

  // Update profile data mutation (for text fields like phone, birth date, gender)
  const updateProfileDataMutation = useMutation({
    mutationFn: async (data: { phoneNumber?: string, birthDate?: string, gender?: string, countryCode?: string }) => {
      console.log('💾 Saving profile data:', data);
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          phoneNumber: data.phoneNumber,
          dateOfBirth: data.birthDate,
          gender: data.gender,
          countryCode: data.countryCode
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Failed to update profile data');
      }

      const result = await response.json();
      console.log('✅ Profile data update response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('✅ Profile data update successful:', data);

      // Update the user data in React Query cache with proper field mapping
      queryClient.setQueryData(['/api/auth/user'], (oldData: any) => {
        if (oldData?.user) {
          return {
            ...oldData,
            user: {
              ...oldData.user,
              phoneNumber: data.user?.phoneNumber,
              dateOfBirth: data.user?.dateOfBirth,
              gender: data.user?.gender,
              countryCode: data.user?.countryCode,
              ...data.user
            }
          };
        }
        return oldData;
      });

      // Update local form data to reflect saved changes
      if (data.user) {
        const updatedPhone = data.user.phoneNumber || data.user.phone || '';
        
        // Extract clean phone number (without country code) for form display
        let cleanPhoneForForm = updatedPhone;
        let countryCodeForForm = data.user.countryCode || formData.countryCode;
        
        if (updatedPhone && updatedPhone.startsWith('+')) {
          const phoneMatch = updatedPhone.match(/^(\+\d{1,4})\s*(.*)$/);
          if (phoneMatch) {
            countryCodeForForm = phoneMatch[1];
            cleanPhoneForForm = phoneMatch[2].trim();
          }
        }
        
        setFormData(prev => ({
          ...prev,
          phoneNumber: cleanPhoneForForm,
          birthDate: data.user.dateOfBirth || prev.birthDate,
          gender: data.user.gender || prev.gender,
          countryCode: countryCodeForForm
        }));
        
        // Update temp values as well to keep edit states in sync
        setTempValues(prev => ({
          ...prev,
          phoneNumber: cleanPhoneForForm,
          birthDate: data.user.dateOfBirth || prev.birthDate,
          gender: data.user.gender || prev.gender
        }));
      }

      // Invalidate and refetch user data to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });

      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved successfully'
      });
    },
    onError: (error: any) => {
      console.error('❌ Profile data update error:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to save profile changes',
        variant: "destructive"
      });
    }
  });

  // Password reset request mutation
  const sendResetCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user?.email })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Failed to send reset code');
      }

      return response.json();
    },
    onSuccess: () => {
      setPasswordResetStep('code');
      toast({
        title: 'Reset Code Sent',
        description: 'Check your email for the 6-digit reset code'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Send Code',
        description: error.message || 'Unable to send reset code. Please try again.',
        variant: "destructive"
      });
    }
  });

  // Verify reset code mutation
  const verifyResetCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: user?.email, 
          resetCode: resetData.resetCode 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Invalid reset code');
      }

      return response.json();
    },
    onSuccess: () => {
      setPasswordResetStep('new-password');
      toast({
        title: 'Code Verified',
        description: 'Now enter your new password'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Invalid Code',
        description: error.message || 'The reset code is invalid or expired',
        variant: "destructive"
      });
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          resetCode: resetData.resetCode,
          newPassword: resetData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Failed to reset password');
      }

      return response.json();
    },
    onSuccess: () => {
      setPasswordResetStep('init');
      setResetData({ resetCode: '', newPassword: '', confirmPassword: '' });
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully changed'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Password Reset Failed',
        description: error.message || 'Failed to reset password',
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
          title: 'Invalid File Type',
          description: 'Please select an image file',
          variant: "destructive"
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File Too Large',
          description: 'Please select an image smaller than 5MB',
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
          title: 'Upload Failed',
          description: 'Failed to read image file',
          variant: "destructive"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Edit functionality handlers
  const startEdit = (field: 'phoneNumber' | 'birthDate' | 'gender') => {
    setTempValues(prev => ({
      ...prev,
      [field]: formData[field] || ''
    }));
    setEditMode(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const cancelEdit = (field: 'phoneNumber' | 'birthDate' | 'gender') => {
    setEditMode(prev => ({
      ...prev,
      [field]: false
    }));
    setTempValues(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const saveEdit = (field: 'phoneNumber' | 'birthDate' | 'gender') => {
    // Update form data locally first
    handleInputChange(field, tempValues[field]);
    
    // Prepare data for database update
    const updateData: { phoneNumber?: string, birthDate?: string, gender?: string, countryCode?: string } = {};
    
    if (field === 'phoneNumber') {
      // Save full phone number with country code to maintain consistency
      const fullPhoneNumber = `${formData.countryCode} ${tempValues[field]}`.trim();
      updateData.phoneNumber = fullPhoneNumber;
      updateData.countryCode = formData.countryCode;
    } else if (field === 'birthDate') {
      updateData.birthDate = tempValues[field];
    } else if (field === 'gender') {
      updateData.gender = tempValues[field];
    }
    
    console.log(`💾 Saving ${field}:`, updateData);
    
    // Call the database update mutation
    updateProfileDataMutation.mutate(updateData);
    
    // Update UI state
    setEditMode(prev => ({
      ...prev,
      [field]: false
    }));
    setTempValues(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  // Complete profile save mutation (for the main save button)
  const saveAllProfileDataMutation = useMutation({
    mutationFn: async (profileData: typeof formData) => {
      console.log('💾 Saving complete profile data:', profileData);

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          username: profileData.username,
          email: profileData.email,
          phoneNumber: `${profileData.countryCode} ${profileData.phoneNumber}`.trim(),
          dateOfBirth: profileData.birthDate,
          gender: profileData.gender,
          countryCode: profileData.countryCode
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return response.json();
    },
    onSuccess: (result) => {
      console.log('✅ Complete profile save successful:', result);

      // Show success banner
      setShowSuccessBanner(true);
      setTimeout(() => setShowSuccessBanner(false), 4000);

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully'
      });

      // Update the user data in React Query cache with backend response data
      queryClient.setQueryData(['/api/auth/user'], (oldData: any) => {
        if (oldData?.user && result?.user) {
          return {
            ...oldData,
            user: {
              ...oldData.user,
              firstName: result.user.firstName || formData.firstName,
              lastName: result.user.lastName || formData.lastName,
              username: result.user.username || formData.username,
              email: result.user.email || formData.email,
              phoneNumber: result.user.phoneNumber || formData.phoneNumber,
              dateOfBirth: result.user.dateOfBirth || formData.birthDate,
              gender: result.user.gender || formData.gender,
              countryCode: result.user.countryCode || formData.countryCode,
              profilePicture: result.user.profilePicture
            }
          };
        }
        return oldData;
      });

      // Trigger global profile update event for synchronization
      window.dispatchEvent(new CustomEvent('profileUpdated', { 
        detail: { user: result.user } 
      }));

      // Invalidate cache to refresh user data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: any) => {
      console.error('❌ Complete profile save error:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile information',
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    saveAllProfileDataMutation.mutate(formData);
  };

  const handlePasswordReset = () => {
    if (passwordResetStep === 'init') {
      sendResetCodeMutation.mutate();
    } else if (passwordResetStep === 'code') {
      if (!resetData.resetCode || resetData.resetCode.length !== 6) {
        toast({
          title: 'Invalid Code',
          description: 'Please enter a valid 6-digit reset code',
          variant: "destructive"
        });
        return;
      }
      verifyResetCodeMutation.mutate();
    } else if (passwordResetStep === 'new-password') {
      if (!resetData.newPassword || resetData.newPassword.length < 6) {
        toast({
          title: 'Password Too Short',
          description: 'Password must be at least 6 characters long',
          variant: "destructive"
        });
        return;
      }
      if (resetData.newPassword !== resetData.confirmPassword) {
        toast({
          title: 'Passwords Don\'t Match',
          description: 'Please ensure both passwords match',
          variant: "destructive"
        });
        return;
      }
      resetPasswordMutation.mutate();
    }
  };

  const handleResetDataChange = (field: string, value: string) => {
    setResetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AdaptiveLayout title="Edit Profile">
      <div className="min-h-screen" style={{ backgroundColor: '#0a0a2e' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ backgroundColor: '#0a0a2e' }}>
          <Link href="/mobile/profile">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-white text-lg font-semibold"></h1>
          <div className="w-6"></div>
        </div>

        {/* Success Banner - Centered */}
        {showSuccessBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 shadow-2xl max-w-sm mx-4 border-2 border-green-400 animate-fade-in-scale">
              <div className="text-center space-y-4">
                <div className="bg-white/20 rounded-full p-3 mx-auto w-fit">
                  <CheckCircle2 className="w-12 h-12 text-white animate-pulse" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-2">Profile Updated Successfully!</h4>
                  <p className="text-green-100 text-base font-medium">Your profile changes have been saved.</p>
                </div>
                <button 
                  onClick={() => setShowSuccessBanner(false)}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-4 py-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            {/* Profile Picture Section - Between blue and white sections */}
            <div className="flex flex-col items-center mb-8" style={{ marginTop: '-80px' }}>
              <div 
                className="relative w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors shadow-lg border-4 border-white mb-4"
                onClick={() => fileInputRef.current?.click()}
              >
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />

              
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-600 text-sm">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-blue-50 text-black placeholder-gray-500"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-600 text-sm">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-blue-50 text-black placeholder-gray-500"
                />
              </div>

              {/* UID (Non-editable) */}
              <div className="space-y-2">
                <Label htmlFor="uid" className="text-gray-600 text-sm">UID</Label>
                <Input
                  id="uid"
                  value={user?.uid || 'N/A'}
                  readOnly
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-black cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-600 text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-black cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-600 text-sm">Phone Number</Label>
                {editMode.phoneNumber ? (
                  <div className="space-y-2">
                    <CountryPhoneInput
                      value={tempValues.phoneNumber}
                      onChange={(value: string) => setTempValues(prev => ({ ...prev, phoneNumber: value }))}
                      countryCode={formData.countryCode}
                      onCountryCodeChange={(code: string) => setFormData(prev => ({ ...prev, countryCode: code }))}
                      placeholder="Enter phone number"
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit('phoneNumber')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEdit('phoneNumber')}
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="flex flex-1">
                      <Input
                        value={formData.phoneNumber ? 
                          `${formData.countryCode || '+1'} ${formData.phoneNumber}` : 
                          'Not set'}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-black cursor-not-allowed"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => startEdit('phoneNumber')}
                      className="ml-2 p-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-gray-600 text-sm">Date of Birth</Label>
                {editMode.birthDate ? (
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={tempValues.birthDate}
                      onChange={(e) => setTempValues(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-blue-50 text-black"
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit('birthDate')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEdit('birthDate')}
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Input
                      value={formData.birthDate ? new Date(formData.birthDate).toLocaleDateString() : 'Not set'}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-black cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => startEdit('birthDate')}
                      className="ml-2 p-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-600 text-sm">Gender</Label>
                {editMode.gender ? (
                  <div className="space-y-2">
                    <Select value={tempValues.gender} onValueChange={(value) => setTempValues(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-blue-50 text-black">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit('gender')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEdit('gender')}
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Input
                      value={formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1).replace('-', ' ') : 'Not set'}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-black cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => startEdit('gender')}
                      className="ml-2 p-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Password Reset Section */}
              {passwordResetStep === 'init' && (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-medium flex items-center justify-center space-x-2"
                  onClick={handlePasswordReset}
                  disabled={sendResetCodeMutation.isPending}
                >
                  {sendResetCodeMutation.isPending ? (
                    <>
                      <span>Sending Code...</span>
                      <Mail className="w-5 h-5 animate-pulse" />
                    </>
                  ) : (
                    <>
                      <span>Change Password</span>
                      <Lock className="w-5 h-5" />
                    </>
                  )}
                </Button>
              )}

              {passwordResetStep === 'code' && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 font-medium">Enter Reset Code</span>
                  </div>

                  <p className="text-sm text-blue-600 mb-4">
                    We've sent a 6-digit code to {user?.email}. Check your email and enter the code below.
                  </p>

                  <Input
                    placeholder="Enter 6-digit code"
                    value={resetData.resetCode}
                    onChange={(e) => handleResetDataChange('resetCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-lg font-mono tracking-wider focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-black placeholder-gray-500"
                    maxLength={6}
                  />

                  <div className="flex space-x-2">
                    <Button 
                      onClick={handlePasswordReset}
                      disabled={verifyResetCodeMutation.isPending || resetData.resetCode.length !== 6}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {verifyResetCodeMutation.isPending ? 'Verifying...' : 'Verify Code'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setPasswordResetStep('init')}
                      className="px-4"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {passwordResetStep === 'new-password' && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <KeyRound className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">Set New Password</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-green-700">New Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        value={resetData.newPassword}
                        onChange={(e) => handleResetDataChange('newPassword', e.target.value)}
                        className="mt-1 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-black placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <Label className="text-green-700">Confirm Password</Label>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        value={resetData.confirmPassword}
                        onChange={(e) => handleResetDataChange('confirmPassword', e.target.value)}
                        className="mt-1 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-black placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={handlePasswordReset}
                      disabled={resetPasswordMutation.isPending || !resetData.newPassword || resetData.newPassword !== resetData.confirmPassword}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {resetPasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setPasswordResetStep('init')}
                      className="px-4"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="mt-8 pt-6">
              <Button 
                onClick={handleSave}
                disabled={saveAllProfileDataMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveAllProfileDataMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdaptiveLayout>
  );
}