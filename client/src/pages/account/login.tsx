import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { showSuccessBanner, showErrorBanner } from "@/hooks/use-bottom-banner";
import { useAuth } from "@/hooks/use-auth";
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon, Loader2Icon } from "lucide-react";
import { NotificationPermissionModal } from "@/components/notification-permission-modal";
import { VirtualRecaptcha } from "@/components/virtual-recaptcha";

// reCAPTCHA functionality removed

export default function Login() {
  // Check if we have a stored username from a recent registration
  const lastUsername = localStorage.getItem('lastUsername') || "";
  
  const [username, setUsername] = useState(lastUsername);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [, setLocation] = useLocation();

  const { user, loginMutation } = useAuth();
  const queryClient = useQueryClient();
  
  // reCAPTCHA script loading removed - no longer needed

  // If user is already logged in, redirect appropriately
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting...');
      
      // Check for redirect parameter
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect');
      
      if (redirectTo === 'contact') {
        setLocation('/contact?from=login');
      } else {
        setLocation('/dashboard');
      }
      return;
    }
    
    // If we used the stored username, show a hint banner
    if (lastUsername) {
      showSuccessBanner(
        "Username pre-filled",
        "We've pre-filled your username from your recent registration."
      );
    }
  }, [user, lastUsername, setLocation]);

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token);
    setRecaptchaVerified(true);
  };

  const handleRecaptchaExpire = () => {
    setRecaptchaToken(null);
    setRecaptchaVerified(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if username and password are provided
    if (!username || !password) {
      showErrorBanner(
        "Missing Information",
        "Please enter both your email address and password to continue."
      );
      return;
    }

    // Check if reCAPTCHA is verified
    if (!recaptchaVerified) {
      showErrorBanner(
        "Verification Required",
        "Please complete the reCAPTCHA verification to continue."
      );
      return;
    }

    // Clear any existing error states
    const errorElements = document.querySelectorAll('[data-error]');
    errorElements.forEach(el => el.remove());
    
    // Use mutation.mutate to handle the login request
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: async () => {
          // Save user preference if remember me is checked
          if (rememberMe) {
            localStorage.setItem('rememberLogin', 'true');
          }
          
          // Refresh user authentication state
          await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
          
          // Show enhanced success message
          showSuccessBanner(
            "Welcome Back! 🎉",
            `Hello ${username}! You're now connected to your Nedaxer trading account. All your features are ready to use.`
          );
          
          // Show notification permission modal after successful login
          setTimeout(() => {
            setShowNotificationModal(true);
          }, 1000);
          
          // Navigate to mobile app after notification modal
          setTimeout(() => {
            console.log('Login successful, redirecting to mobile app');
            setLocation('/mobile');
          }, showNotificationModal ? 5000 : 2000);
        },
        onError: (error: any) => {
          // Handle all login errors gracefully - no red browser errors
          console.warn('Login attempt failed:', error.message);
          
          // Check if this is an unverified account error
          if (error.data?.requiresVerification) {
            console.log('Account requires verification, redirecting...');
            
            // Store the user ID for verification
            if (error.data.userId) {
              localStorage.setItem('unverifiedUserId', error.data.userId);
            }
            
            showErrorBanner(
              "Account Verification Required",
              "Please verify your email address before logging in. Redirecting to verification page..."
            );
            
            // Redirect to verification page
            setTimeout(() => {
              setLocation('/account/verify');
            }, 2000);
            return;
          }
          
          // Show appropriate user-friendly error message
          let errorTitle = "Login Failed";
          let errorDescription = error.message;
          
          // Customize error messages based on common scenarios
          if (error.message.includes('email or password')) {
            errorTitle = "Incorrect Credentials";
            errorDescription = "The email or password you entered is incorrect. Please double-check your information and try again.";
          } else if (error.message.includes('email address')) {
            errorTitle = "Account Not Found";
            errorDescription = "We couldn't find an account with that email address. Please check your email or create a new account.";
          } else if (error.message.includes('technical difficulties')) {
            errorTitle = "Server Error";
            errorDescription = "We're experiencing technical difficulties. Please try again in a few moments.";
          }
          
          showErrorBanner(
            errorTitle,
            errorDescription
          );
        }
      }
    );
  };

  const handleGoogleSignIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setGoogleLoading(true);
    
    // Navigate to Google OAuth after showing loading animation
    setTimeout(() => {
      window.location.href = "/auth/google";
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000d2e' }}>
      <Header />
      <main 
        className="flex-grow pt-20 pb-12 px-3"
        style={{ backgroundColor: '#000d2e' }}
      >
        <div className="max-w-md lg:max-w-lg mx-auto bg-white p-6 lg:p-8 rounded-3xl shadow-xl border-0 relative overflow-hidden">
          {/* Bright accent background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400"></div>
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 mb-4 shadow-lg">
              <LockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back!</h1>
            <p className="text-gray-600 text-base">Ready to continue your financial journey?</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-800 font-semibold text-sm">Email Address</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <Input
                  id="username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-9 py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-900 placeholder:text-gray-500 rounded-xl text-sm font-medium transition-all duration-200"
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-800 font-semibold text-sm">Password</Label>
                <Link href="/account/forgot-password" className="text-xs text-yellow-600 hover:text-orange-500 font-semibold transition-colors duration-200">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-900 placeholder:text-gray-500 rounded-xl text-sm font-medium transition-all duration-200"
                  required
                  disabled={loginMutation.isPending}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-600 hover:text-orange-500 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loginMutation.isPending}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center bg-yellow-50 p-3 rounded-xl border border-yellow-200">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="text-yellow-600 border-yellow-400 w-4 h-4"
                  disabled={loginMutation.isPending}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-semibold text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Keep me signed in
                </label>
              </div>
            </div>

            {/* Virtual reCAPTCHA Widget with enhanced styling */}
            <div className="flex justify-center p-3 bg-blue-50 rounded-xl border border-blue-200">
              <VirtualRecaptcha 
                onVerify={handleRecaptchaVerify}
                onExpire={handleRecaptchaExpire}
                theme="light"
                size="compact"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white py-3 font-bold text-base rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                  Signing you in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-yellow-200"></div>
            </div>
            <div className="relative flex justify-center text-base">
              <span className="px-3 bg-white text-gray-600 font-semibold">Or continue with</span>
            </div>
          </div>

          <div className="mb-5">
            <a 
              href="/auth/google"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl shadow-md bg-white hover:bg-gray-50 hover:border-yellow-300 text-sm font-semibold text-gray-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
            >
              {googleLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                  Connecting to Google...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </a>
          </div>

          <div className="text-center bg-gradient-to-r from-blue-50 to-yellow-50 p-3 rounded-xl">
            <p className="text-gray-700 text-sm">
              Don't have an account?{" "}
              <Link href="/account/register" className="text-yellow-600 hover:text-orange-500 font-bold transition-colors duration-200 underline decoration-2 underline-offset-2">
                Join the Community!
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Notification Permission Modal */}
      <NotificationPermissionModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        showOnLogin={true}
      />
    </div>
  );
}