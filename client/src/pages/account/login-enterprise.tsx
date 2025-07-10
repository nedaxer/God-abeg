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

// reCAPTCHA functionality removed

export default function LoginEnterprise() {
  // Check if we have a stored username from a recent registration
  const lastUsername = localStorage.getItem('lastUsername') || "";
  
  const [username, setUsername] = useState(lastUsername);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // reCAPTCHA token state removed
  const [, setLocation] = useLocation();

  const { user, loginMutation } = useAuth();
  const queryClient = useQueryClient();
  
  // reCAPTCHA initialization removed

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  // reCAPTCHA execution function removed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      showErrorBanner("Please enter both your email and password.");
      return;
    }

    // Store username for potential future logins
    localStorage.setItem('lastUsername', username);

    // Perform login without reCAPTCHA verification
    loginMutation.mutate(
      { 
        username: username.trim(), 
        password: password.trim()
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            showSuccessBanner(data.message || "Login successful!");
            queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
            setLocation("/dashboard");
          } else {
            showErrorBanner(data.message || "Login failed. Please try again.");
          }
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
          showErrorBanner(errorMessage);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your Nedaxer account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your email address"
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password">
                  <span className="text-sm text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </span>
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/account/register">
                  <span className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign up
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}