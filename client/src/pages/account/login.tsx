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

// Declare global grecaptcha type
declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function Login() {
  // Check if we have a stored username from a recent registration
  const lastUsername = localStorage.getItem('lastUsername') || "";
  
  const [username, setUsername] = useState(lastUsername);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string>("");
  const [, setLocation] = useLocation();

  const { user, loginMutation } = useAuth();
  const queryClient = useQueryClient();
  
  // Load reCAPTCHA script and setup callbacks
  useEffect(() => {
    const loadRecaptchaScript = () => {
      if (window.grecaptcha) return;
      
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    // Setup global reCAPTCHA callbacks
    (window as any).onRecaptchaCallback = (token: string) => {
      setRecaptchaToken(token);
    };

    (window as any).onRecaptchaExpired = () => {
      setRecaptchaToken("");
    };

    loadRecaptchaScript();

    // Cleanup
    return () => {
      delete (window as any).onRecaptchaCallback;
      delete (window as any).onRecaptchaExpired;
    };
  }, []);

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

    // Check reCAPTCHA
    if (!recaptchaToken) {
      showErrorBanner(
        "reCAPTCHA Required",
        "Please complete the reCAPTCHA verification to continue."
      );
      return;
    }
    
    // Clear any existing error states
    const errorElements = document.querySelectorAll('[data-error]');
    errorElements.forEach(el => el.remove());
    
    // Use mutation.mutate to handle the login request
    loginMutation.mutate(
      { username, password, recaptchaToken },
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
          
          // Navigate to mobile app after successful login
          setTimeout(() => {
            console.log('Login successful, redirecting to mobile app');
            setLocation('/mobile');
          }, 500);
        },
        onError: (error: Error) => {
          // Handle all login errors gracefully - no red browser errors
          console.warn('Login attempt failed:', error.message);
          
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



  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4 bg-gray-50">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <LockIcon className="h-8 w-8 text-[#0033a0]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
            <p className="text-gray-500">Sign in with your email address to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">Email Address</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0033a0] text-gray-900 placeholder:text-gray-500"
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Link href="/account/forgot-password" className="text-sm text-[#0033a0] hover:text-[#ff5900] font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0033a0] text-gray-900 placeholder:text-gray-500"
                  required
                  disabled={loginMutation.isPending}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loginMutation.isPending}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="text-[#0033a0] border-gray-300"
                  disabled={loginMutation.isPending}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </div>

            {/* reCAPTCHA Widget */}
            <div className="flex justify-center">
              <div 
                className="g-recaptcha" 
                data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeX_XMrAAAAAOE1YUBRSnQb70l9FJra_s2Ohb8u"}
                data-callback="onRecaptchaCallback"
                data-expired-callback="onRecaptchaExpired"
              ></div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#0033a0] hover:bg-[#002680] text-white py-2.5 font-medium rounded-md transition-all duration-200 shadow-sm"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mb-6">
            <a 
              href="/auth/google"
              className="flex items-center justify-center w-full py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </a>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/account/register" className="text-[#0033a0] hover:text-[#ff5900] font-semibold">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}