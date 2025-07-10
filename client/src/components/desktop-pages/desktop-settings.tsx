import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { showSuccessBanner, showErrorBanner } from '@/hooks/use-bottom-banner';
import { 
  ArrowLeft, 
  Camera, 
  Copy, 
  Check, 
  Shield, 
  AlertTriangle, 
  User, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  Bell,
  Lock,
  Palette,
  Globe,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X,
  DollarSign,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface UserSettings {
  nickname?: string;
  language: string;
  currency: string;
  theme: string;
  screenLock: boolean;
}

export default function DesktopSettings() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<UserSettings>({
    nickname: user?.username || '',
    language: 'English',
    currency: 'USD',
    theme: 'Dark Mode',
    screenLock: false
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const userUID = user?.uid || 'N/A';

  // Fetch KYC status for verification badge
  const { data: kycStatus } = useQuery({
    queryKey: ['/api/verification/status'],
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/user/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return response.json();
    },
    onSuccess: () => {
      showSuccessBanner('Success', 'Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setIsEditingName(false);
    },
    onError: (error: any) => {
      showErrorBanner('Error', error.message || 'Failed to update profile');
    }
  });

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      // Convert file to base64 for consistent API usage
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/user/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ profilePicture: base64 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload photo');
      }

      return response.json();
    },
    onSuccess: () => {
      showSuccessBanner('Success', 'Profile photo updated successfully');
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setUploadingPhoto(false);
    },
    onError: (error: any) => {
      showErrorBanner('Error', error.message || 'Failed to upload photo');
      setUploadingPhoto(false);
    }
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showErrorBanner('Error', 'File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showErrorBanner('Error', 'Please select a valid image file');
        return;
      }

      setUploadingPhoto(true);
      uploadPhotoMutation.mutate(file);
    }
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      const [firstName, ...lastNameParts] = tempName.trim().split(' ');
      const lastName = lastNameParts.join(' ');
      
      updateProfileMutation.mutate({
        firstName: firstName,
        lastName: lastName || ''
      });
    }
  };

  const handleStartEdit = () => {
    const fullName = user?.firstName 
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user?.username || user?.email || '';
    
    setTempName(fullName);
    setIsEditingName(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDisplayName = () => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ''}`.trim();
    }
    return user?.username || user?.email || 'User';
  };

  const isVerified = kycStatus?.data?.kycStatus === 'verified';

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
              <p className="text-gray-400">Manage your account preferences and security</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-black/20 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-orange-500/20">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 border-orange-500/50 bg-black/50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-3 h-3" />
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Name Display/Edit */}
              <div className="w-full text-center">
                {isEditingName ? (
                  <div className="space-y-2">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="bg-black/20 border-gray-700/50 text-white text-center"
                      placeholder="Enter your full name"
                    />
                    <div className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        onClick={handleSaveName}
                        disabled={updateProfileMutation.isPending}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingName(false)}
                        className="border-gray-700/50"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <h3 className="text-xl font-bold text-white">{getDisplayName()}</h3>
                      {isVerified && (
                        <Badge className="bg-orange-500 text-white text-xs">Verified</Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleStartEdit}
                        className="p-1 h-auto text-gray-400 hover:text-white"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                )}
              </div>

              {/* User ID */}
              <div className="w-full">
                <Label className="text-gray-400 text-sm">Nedaxer UID</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={userUID}
                    readOnly
                    className="bg-black/20 border-gray-700/50 text-white text-center"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(userUID)}
                    className="border-gray-700/50"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

          {/* Settings Tabs */}
          <div className="lg:col-span-2">
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-black/20 border border-gray-700/50">
              <TabsTrigger value="account" className="data-[state=active]:bg-orange-500">
                <User className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-orange-500">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-orange-500">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-orange-500">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account">
              <Card className="bg-black/20 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Address
                      </Label>
                      <Input
                        value={user?.email || ''}
                        readOnly
                        className="bg-black/20 border-gray-700/50 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Username
                      </Label>
                      <Input
                        value={user?.username || ''}
                        readOnly
                        className="bg-black/20 border-gray-700/50 text-white"
                      />
                    </div>
                  </div>

                  <Separator className="bg-gray-700/50" />

                  <div>
                    <h4 className="text-white font-medium mb-4">Verification Status</h4>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {isVerified ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-orange-500" />
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {isVerified ? 'Account Verified' : 'Verification Pending'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {isVerified 
                              ? 'Your account has been successfully verified'
                              : 'Complete verification to unlock all features'
                            }
                          </p>
                        </div>
                      </div>
                      {!isVerified && (
                        <Button
                          onClick={() => setLocation('/mobile/kyc-status')}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Verify Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="bg-black/20 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Lock className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Two-Factor Authentication</p>
                          <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                        </div>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">Login Notifications</p>
                          <p className="text-gray-400 text-sm">Get notified of new login attempts</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-white font-medium">Session Timeout</p>
                          <p className="text-gray-400 text-sm">Automatically log out after inactivity</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <Separator className="bg-gray-700/50" />

                  <div>
                    <Button
                      onClick={() => setLocation('/mobile/security')}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card className="bg-black/20 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Language
                      </Label>
                      <select className="w-full p-2 bg-black/20 border border-gray-700/50 rounded-md text-white">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Currency
                      </Label>
                      <select className="w-full p-2 bg-black/20 border border-gray-700/50 rounded-md text-white">
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>JPY</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Palette className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-white font-medium">Dark Mode</p>
                          <p className="text-gray-400 text-sm">Use dark theme</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Show Balance</p>
                          <p className="text-gray-400 text-sm">Display balance on home screen</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="bg-black/20 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">Push Notifications</p>
                          <p className="text-gray-400 text-sm">Receive notifications on this device</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">Email Notifications</p>
                          <p className="text-gray-400 text-sm">Receive important updates via email</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-white font-medium">Price Alerts</p>
                          <p className="text-gray-400 text-sm">Get notified of significant price changes</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </div>
    </div>
  );
}