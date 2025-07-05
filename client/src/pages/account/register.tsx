import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { showSuccessBanner, showErrorBanner } from "@/hooks/use-bottom-banner";
import { EyeIcon, EyeOffIcon, InfoIcon, MailIcon, LockIcon, UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Declare global grecaptcha type
declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function Register() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    receiveUpdates: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string>("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const [isLoading, setIsLoading] = useState(false);

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
    (window as any).onRegisterRecaptchaCallback = (token: string) => {
      setRecaptchaToken(token);
    };

    (window as any).onRegisterRecaptchaExpired = () => {
      setRecaptchaToken("");
    };

    loadRecaptchaScript();

    // Cleanup
    return () => {
      delete (window as any).onRegisterRecaptchaCallback;
      delete (window as any).onRegisterRecaptchaExpired;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      showErrorBanner(
        "Missing information",
        "Please fill in all required fields."
      );
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      showErrorBanner(
        "Passwords don't match",
        "Please make sure your passwords match."
      );
      return;
    }
    
    if (!formData.acceptTerms) {
      showErrorBanner(
        "Terms not accepted",
        "You must accept the terms and conditions to create an account."
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
    
    // Set loading state
    setIsLoading(true);
    
    try {
      console.log('Attempting registration...');
      
      const registrationData = {
        // Use email as username for simplicity
        username: formData.email,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        recaptchaToken: recaptchaToken,
      };
      
      console.log('Registration payload:', { ...registrationData, password: '***' });
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      console.log('Registration response status:', response.status);
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle error
        let errorMessage = "An unexpected error occurred. Please try again.";
        let errorDetail = "";
        
        if (response.status === 409) {
          if (data.message === "Email already exists") {
            errorMessage = "This email address is already registered";
            errorDetail = "You already have an account with this email. Please use the login page to access your account or use a different email address.";
          } else if (data.message === "Username already exists") {
            errorMessage = "This username is already taken";
            errorDetail = "Please choose a different username for your account.";
          } else {
            errorMessage = data.message || "Account already exists";
            errorDetail = "It looks like you already have an account. Please try logging in instead.";
          }
        } else if (response.status === 400) {
          errorMessage = "Registration information is incomplete";
          errorDetail = "Please make sure all required fields are filled correctly. Check that your password meets all requirements.";
        }
        
        showErrorBanner(
          "Registration failed",
          errorMessage
        );
        
        // Show additional detail if available
        if (errorDetail) {
          setTimeout(() => {
            showErrorBanner(
              "What to do next",
              errorDetail
            );
          }, 1000);
        }
        
        setIsLoading(false);
        return;
      }
      
      // Success - account created and ready to use
      showSuccessBanner(
        "Welcome to Nedaxer!",
        "Your account has been created successfully."
      );
      
      // Show banner with login info
      setTimeout(() => {
        showSuccessBanner(
          "Your Login Information",
          `Username: ${data.user.email}\nPlease use your email address to log in.`,
          7000 // Show for longer
        );
      }, 1000);
      
      console.log("Registration successful, user is now logged in");
      
      // Store email as username in localStorage for convenience
      localStorage.setItem('lastUsername', data.user.email);
      
      // Invalidate auth query to refresh user state immediately
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Force refetch auth data to ensure user state is current
      await queryClient.refetchQueries({ queryKey: ['/api/auth/user'] });
      
      // Small delay to ensure auth state is synced
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Immediate redirect to mobile home page
      console.log('Taking user to mobile home page');
      
      // Use wouter's setLocation for proper routing
      setLocation('/mobile');
      
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        errorMessage = error.message;
      }
      
      showErrorBanner(
        "Registration failed",
        errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      title="Create Account"
      subtitle="Join Nedaxer cryptocurrency trading platform"
      bgColor="linear-gradient(135deg, #f0f4f9 0%, #e6f0fb 100%)"
    >
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <UserIcon className="h-8 w-8 text-[#0033a0]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Your Account</h2>
          <p className="text-gray-500">Join thousands of traders on the Nedaxer platform</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name<span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0033a0] text-gray-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name<span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0033a0] text-gray-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address<span className="text-red-500">*</span></Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0033a0] text-gray-900 placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password<span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0033a0] text-gray-900 placeholder:text-gray-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password<span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0033a0] text-gray-900 placeholder:text-gray-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-md flex items-start shadow-sm">
                <InfoIcon className="h-5 w-5 text-[#0033a0] mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-[#0033a0] mb-2">Password Requirements:</p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>At least 8 characters long</li>
                    <li>Include at least one uppercase letter</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="acceptTerms" 
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                    }
                    className="mt-1 text-[#0033a0] border-gray-300"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm leading-tight text-gray-700"
                  >
                    I have read and agree to the{" "}
                    <Link href="/legal/terms" className="text-[#0033a0] hover:text-[#ff5900] font-medium">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/legal/privacy" className="text-[#0033a0] hover:text-[#ff5900] font-medium">
                      Privacy Policy
                    </Link>
                    <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="receiveUpdates" 
                    name="receiveUpdates"
                    checked={formData.receiveUpdates}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, receiveUpdates: checked as boolean }))
                    }
                    className="mt-1 text-[#0033a0] border-gray-300"
                  />
                  <label
                    htmlFor="receiveUpdates"
                    className="text-sm leading-tight text-gray-700"
                  >
                    I would like to receive updates on cryptocurrency market news, trading opportunities, and platform enhancements (optional)
                  </label>
                </div>
              </div>

              {/* reCAPTCHA Widget */}
              <div className="flex justify-center">
                <div 
                  className="g-recaptcha" 
                  data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeX_XMrAAAAAOE1YUBRSnQb70l9FJra_s2Ohb8u"}
                  data-callback="onRegisterRecaptchaCallback"
                  data-expired-callback="onRegisterRecaptchaExpired"
                ></div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#0033a0] hover:bg-[#002680] text-white py-2.5 font-medium rounded-md transition-all duration-200 shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="h-full flex flex-col bg-gradient-to-br from-[#0033a0] to-[#001a60] text-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Why Join Nedaxer?</h3>
              
              <ul className="space-y-4 mb-auto">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Trade cryptocurrencies with limited risk</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Advanced trading tools for all skill levels</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Free educational resources and webinars</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Secure platform with multi-layer protection</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>24/7 customer support</span>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-blue-400">
                <div className="bg-white/10 p-4 rounded-md backdrop-blur-sm">
                  <p className="text-sm italic mb-2">
                    "Nedaxer provides exceptional trading tools and resources that have helped me improve my trading strategy."
                  </p>
                  <p className="text-xs font-medium">— Michael R., Member since 2022</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center mb-6">
          <p className="text-gray-500 mb-4">Or sign up with</p>
          <a 
            href="/auth/google"
            className="inline-flex items-center justify-center py-2.5 px-6 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </a>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/account/login" className="text-[#0033a0] hover:text-[#ff5900] font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}