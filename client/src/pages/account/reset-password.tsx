import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<'code' | 'password' | 'success'>('code');
  const [formData, setFormData] = useState({
    email: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  console.log('ResetPassword component rendered successfully');

  // Get email from URL params or localStorage
  useEffect(() => {
    console.log('Reset password page loaded. Current URL:', window.location.href);
    console.log('Hash:', window.location.hash);
    console.log('Search params:', window.location.search);
    
    // Try to get email from multiple sources due to hash routing
    let emailParam = null;
    
    // First try regular URL search params
    const urlParams = new URLSearchParams(window.location.search);
    emailParam = urlParams.get('email');
    
    // If not found, try parsing from hash
    if (!emailParam && window.location.hash) {
      const hashParts = window.location.hash.split('?');
      if (hashParts.length > 1) {
        const hashParams = new URLSearchParams(hashParts[1]);
        emailParam = hashParams.get('email');
      }
    }
    
    // If still not found, try localStorage
    if (!emailParam) {
      emailParam = localStorage.getItem('resetPasswordEmail');
    }
    
    console.log('Email found:', emailParam);
    
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: decodeURIComponent(emailParam) }));
    }
  }, []);

  const verifyCodeMutation = useMutation({
    mutationFn: async (data: { email: string; resetCode: string }) => {
      return apiRequest('/api/auth/verify-reset-code', {
        method: 'POST',
        data
      });
    },
    onSuccess: () => {
      setStep('password');
      toast({
        title: "Code verified",
        description: "Please enter your new password.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid Code",
        description: error.message || "The reset code is invalid or has expired.",
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { email: string; resetCode: string; newPassword: string }) => {
      return apiRequest('/api/auth/reset-password', {
        method: 'POST',
        data
      });
    },
    onSuccess: () => {
      setStep('success');
      toast({
        title: "Password reset successful",
        description: "Your password has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.resetCode) {
      toast({
        title: "Missing information",
        description: "Please enter both email and reset code.",
        variant: "destructive",
      });
      return;
    }

    if (formData.resetCode.length !== 6) {
      toast({
        title: "Invalid code format",
        description: "Reset code must be 6 digits.",
        variant: "destructive",
      });
      return;
    }

    verifyCodeMutation.mutate({
      email: formData.email,
      resetCode: formData.resetCode
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    resetPasswordMutation.mutate({
      email: formData.email,
      resetCode: formData.resetCode,
      newPassword: formData.newPassword
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderCodeStep = () => (
    <>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
          <Lock className="h-8 w-8 text-[#0033a0]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Reset Code</h2>
        <p className="text-gray-600">Check your email and enter the 6-digit code below</p>
      </div>

      {/* Email info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-blue-800 text-sm font-medium">Check your email inbox</p>
            <p className="text-blue-600 text-xs">We sent a 6-digit code to reset your password</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleCodeSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your.email@example.com"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resetCode" className="text-base font-semibold">Reset Code</Label>
          <Input
            id="resetCode"
            type="text"
            value={formData.resetCode}
            onChange={(e) => handleInputChange('resetCode', e.target.value.slice(0, 6))}
            placeholder="000000"
            className="w-full text-center text-3xl font-mono tracking-[0.5em] bg-gray-50 border-2 border-gray-300 focus:border-[#0033a0] focus:ring-2 focus:ring-[#0033a0]/20 py-4"
            maxLength={6}
            required
            autoComplete="one-time-code"
          />
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm font-medium">📧 Enter the 6-digit code from your email</p>
            <p className="text-yellow-600 text-xs mt-1">Code expires in 15 minutes for security</p>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#0033a0] hover:bg-[#002680] py-3 text-lg font-semibold"
          disabled={verifyCodeMutation.isPending}
        >
          {verifyCodeMutation.isPending ? "Verifying Code..." : "Verify Code & Continue"}
        </Button>
      </form>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Set New Password</h2>
        <p className="text-gray-600">Choose a strong password for your account</p>
      </div>
      
      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="Enter new password"
              className="w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Repeat new password"
              className="w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#0033a0] hover:bg-[#002680]"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? "Updating Password..." : "Update Password"}
        </Button>
      </form>
    </>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
      <h3 className="text-xl font-bold text-gray-800">Password Updated Successfully</h3>
      <p className="text-gray-600">
        Your password has been updated. You can now log in with your new password.
      </p>
      <div className="pt-4">
        <Button 
          onClick={() => setLocation('/account/login')}
          className="w-full bg-[#0033a0] hover:bg-[#002680]"
        >
          Go to Login
        </Button>
      </div>
    </div>
  );

  return (
    <PageLayout
      title="Reset Password"
      subtitle="Secure password reset"
      bgColor="#f8f9fa"
    >
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        {step === 'code' && renderCodeStep()}
        {step === 'password' && renderPasswordStep()}
        {step === 'success' && renderSuccessStep()}

        {step !== 'success' && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/account/login" className="text-[#0033a0] hover:text-[#ff5900] font-semibold">
                Back to Login
              </Link>
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}