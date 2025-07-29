import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircleIcon, LockIcon, Loader2Icon, RefreshCwIcon, InfoIcon } from "lucide-react";

export default function VerifyAccount() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingCountdown, setLoadingCountdown] = useState(10);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  // Redirect if user is already verified
  useEffect(() => {
    if (!authLoading && user && user.isVerified) {
      toast({
        title: "Account already verified",
        description: "Your account is already verified. Redirecting to home...",
      });
      setLocation('/mobile');
    }
  }, [user, authLoading, setLocation, toast]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Reset countdown when new code is sent
  const resetCountdown = () => {
    setCountdown(600); // 10 minutes
    setIsExpired(false);
  };

  // Format countdown as MM:SS
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Load stored email and dev code from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('pendingRegistrationEmail');
    const storedDevCode = localStorage.getItem('devVerificationCode');
    
    if (storedEmail) {
      setEmail(storedEmail);
    }
    
    if (storedDevCode) {
      setDevCode(storedDevCode);
    }
  }, []);

  // 10-second loading screen countdown effect
  useEffect(() => {
    if (!showLoadingScreen) return;

    if (loadingCountdown <= 0) {
      setLocation('/mobile');
      return;
    }

    const timer = setInterval(() => {
      setLoadingCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showLoadingScreen, loadingCountdown, setLocation]);

  // Handle form submission
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Verification error",
        description: "Unable to find your email information. Please register again.",
        variant: "destructive",
      });
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code from your email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle expired registration
        if (data.expired) {
          localStorage.removeItem('pendingRegistrationEmail');
          toast({
            title: "Registration expired",
            description: data.message || "Your registration has expired. Please register again.",
            variant: "destructive",
          });
          setTimeout(() => setLocation('/account/create'), 2000);
          return;
        }

        toast({
          title: "Verification failed",
          description: data.message || "Failed to verify your account. Please check the code and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Show success message and trigger loading screen
      setVerificationSuccess(true);
      toast({
        title: "Account verified",
        description: "Your account has been successfully created and verified!",
      });

      // Clear the stored pending registration email
      localStorage.removeItem('pendingRegistrationEmail');
      localStorage.removeItem('devVerificationCode');

      // Refresh user authentication status
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });

      // Start 10-second loading screen if instructed by server
      if (data.showLoadingScreen) {
        setIsLoading(false);
        setShowLoadingScreen(true);
        setLoadingCountdown(10);
      } else {
        // Fallback: redirect after short delay
        setTimeout(() => {
          setLocation('/mobile');
        }, 3000);
      }

    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (!showLoadingScreen) {
        setIsLoading(false);
      }
    }
  };

  // Request a new verification code
  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: "Resend error",
        description: "Unable to find your email information. Please register again.",
        variant: "destructive",
      });
      return;
    }

    setResendLoading(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle expired registration
        if (data.expired) {
          localStorage.removeItem('pendingRegistrationEmail');
          toast({
            title: "Registration expired",
            description: data.message || "Your registration has expired. Please register again.",
            variant: "destructive",
          });
          setTimeout(() => setLocation('/account/create'), 2000);
          return;
        }

        toast({
          title: "Resend failed",
          description: data.message || "Failed to resend verification code. Please try again.",
          variant: "destructive",
        });
        setResendLoading(false);
        return;
      }

      // Check if server returned a verification code (development mode)
      if (data.verificationCode) {
        setDevCode(data.verificationCode);
        toast({
          title: "Development Mode",
          description: "New verification code is now displayed on screen.",
        });
      } else {
        toast({
          title: "Code resent",
          description: "A new verification code has been sent to your email.",
        });
      }
      
      // Reset countdown timer
      resetCountdown();

    } catch (error) {
      console.error('Resend error:', error);
      toast({
        title: "Resend failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Check for verification code in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashValue = window.location.hash;
    
    // Handle hash-based routing parameters
    let hashParams = new URLSearchParams();
    if (hashValue) {
      const hashPath = hashValue.replace(/^#\/?/, '');
      const pathAndQuery = hashPath.split('?');
      if (pathAndQuery.length > 1) {
        hashParams = new URLSearchParams(pathAndQuery[1]);
      }
    }
    
    // Get verification code from either source
    const codeFromUrl = urlParams.get('code') || hashParams.get('code');
    
    // Handle verification code if present in URL
    if (codeFromUrl) {
      setVerificationCode(codeFromUrl);
    }
  }, []);

  // Show 10-second loading screen after successful verification
  if (showLoadingScreen) {
    return (
      <PageLayout
        title="Account Created Successfully"
        subtitle="Setting up your account..."
        bgColor="linear-gradient(135deg, #f0f4f9 0%, #e6f0fb 100%)"
      >
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-50">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome to Nedaxer!</h2>
            <p className="text-gray-500">Your account has been successfully created and verified.</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-md mb-6 text-center">
            <Loader2Icon className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-blue-800 font-medium mb-1">Setting up your account...</p>
            <p className="text-blue-600 text-sm">
              Redirecting in {loadingCountdown} seconds
            </p>
          </div>

          <Button 
            onClick={() => setLocation('/mobile')}
            className="w-full bg-[#0033a0] hover:bg-[#002680] text-white py-2.5 font-medium rounded-md transition-all duration-200 shadow-sm"
          >
            Continue to Dashboard
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  // Show success state if verification was successful (fallback)
  if (verificationSuccess && !showLoadingScreen) {
    return (
      <PageLayout
        title="Account Verified"
        subtitle="Your account has been successfully verified"
        bgColor="linear-gradient(135deg, #f0f4f9 0%, #e6f0fb 100%)"
      >
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-50">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Account Verified!</h2>
            <p className="text-gray-500">You have successfully verified your account.</p>
          </div>

          <div className="bg-green-50 border border-green-100 p-4 rounded-md mb-6">
            <p className="text-green-800 text-center">
              You're being redirected to the home page...
            </p>
          </div>

          <Button 
            onClick={() => setLocation('/mobile')}
            className="w-full bg-[#0033a0] hover:bg-[#002680] text-white py-2.5 font-medium rounded-md transition-all duration-200 shadow-sm"
          >
            Go to Home
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Main verification form
  return (
    <PageLayout
      title="Verify Your Account"
      subtitle="Enter the verification code sent to your email"
      bgColor="linear-gradient(135deg, #f0f4f9 0%, #e6f0fb 100%)"
    >
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-50">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <LockIcon className="h-8 w-8 text-[#0033a0]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Verify Your Account</h2>
          <p className="text-gray-500">Please enter the 6-digit code sent to your email</p>
          
          {/* Countdown Timer */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            {isExpired ? (
              <p className="text-red-600 font-medium">Code expired. Please request a new one.</p>
            ) : (
              <p className="text-gray-700">
                Code expires in: <span className="font-mono font-bold text-[#0033a0]">{formatCountdown(countdown)}</span>
              </p>
            )}
          </div>
        </div>
        
        {/* Development mode verification code display */}
        {devCode && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <InfoIcon className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-semibold">Development Mode</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="text-amber-700">
                <p className="mb-2">Since email services are not configured, your verification code is shown here:</p>
                <div className="bg-white border-2 border-dashed border-amber-300 rounded-md p-3 font-mono text-center text-xl font-bold tracking-widest text-amber-600">
                  {devCode}
                </div>
                <button
                  type="button"
                  onClick={() => setVerificationCode(devCode || "")}
                  className="mt-2 w-full py-1 px-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md transition-colors duration-200"
                >
                  Auto-fill code
                </button>
                <p className="mt-3 text-xs text-amber-600">
                  In production, this code would be sent to your email address.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="verificationCode" className="text-gray-700 font-medium">Verification Code</Label>
            <Input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => {
                // Only allow digits and limit to 6 characters
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
              }}
              className="w-full text-center tracking-widest text-lg font-bold bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0033a0]"
              placeholder="123456"
              maxLength={6}
              required
              disabled={isLoading || verificationSuccess}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#0033a0] hover:bg-[#002680] text-white py-2.5 font-medium rounded-md transition-all duration-200 shadow-sm"
            disabled={isLoading || verificationSuccess || verificationCode.length !== 6 || isExpired}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </Button>
        </form>

        {/* Spam folder notice */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800">Check your spam or junk folder</p>
              <p className="text-xs text-amber-700 mt-1">
                Sometimes verification emails end up in spam. Please check your spam/junk folder if you don't see the email in your inbox.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600 mb-4">Didn't receive the code?</p>
          <Button 
            variant="outline" 
            onClick={handleResendCode}
            disabled={resendLoading || isLoading || verificationSuccess}
            className="w-full border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            {resendLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                {isExpired ? "Send New Code" : "Resend Code"}
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Need help?{" "}
            <a href="mailto:support@nedaxer.com" className="text-[#0033a0] hover:text-[#ff5900] font-semibold">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}