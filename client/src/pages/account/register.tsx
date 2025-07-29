import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccessBanner, showErrorBanner } from "@/hooks/use-bottom-banner";
import { EyeIcon, EyeOffIcon, InfoIcon, MailIcon, LockIcon, UserIcon, PhoneIcon, Gift } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NotificationPermissionModal } from "@/components/notification-permission-modal";
import { VirtualRecaptcha } from "@/components/virtual-recaptcha";
import CountryPhoneInput from "@/components/country-phone-input";

// reCAPTCHA functionality removed

export default function Register() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1",
    phoneNumber: "",
    dateOfBirth: "",
    monthOfBirth: "",
    yearOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    acceptTerms: false,
    receiveUpdates: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token);
    setRecaptchaVerified(true);
  };

  const handleRecaptchaExpire = () => {
    setRecaptchaToken(null);
    setRecaptchaVerified(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.dateOfBirth || !formData.monthOfBirth || !formData.yearOfBirth || !formData.password) {
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

    // Check if reCAPTCHA is verified
    if (!recaptchaVerified) {
      showErrorBanner(
        "Verification Required",
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
        phone: formData.countryCode + formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        monthOfBirth: formData.monthOfBirth,
        yearOfBirth: formData.yearOfBirth,
        gender: formData.gender,
        referralCode: formData.referralCode || undefined // Include referral code if provided
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
      
      // Check if email verification is required
      if (data.requiresVerification) {
        // Success - pending registration created, verification required
        showSuccessBanner(
          "Registration initiated!",
          `Please check your email for a verification code. You have 10 minutes to verify.`
        );
        
        // Store email for verification process (new system)
        localStorage.setItem('pendingRegistrationEmail', formData.email);
        localStorage.setItem('lastUsername', formData.email);
        
        console.log("Pending registration created, email verification required");
        console.log("User has 10 minutes to verify:", data.expiresIn);
        
        // Immediate redirect to verification page without delay
        setTimeout(() => {
          setLocation('/account/verify');
        }, 100);
      } else {
        // Success - account created and ready to use (fallback for immediate verification)
        showSuccessBanner(
          "Account created successfully!",
          "Welcome to Nedaxer! Your account has been created and you are now logged in."
        );
        
        console.log("Registration successful, user is now logged in");
        
        // Store email as username in localStorage for convenience
        localStorage.setItem('lastUsername', data.user.email);
        
        // Invalidate auth query to refresh user state immediately
        await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
        
        // Force refetch auth data to ensure user state is current
        await queryClient.refetchQueries({ queryKey: ['/api/auth/user'] });
        
        // Small delay to ensure auth state is synced
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Show notification permission modal after successful registration
        setTimeout(() => {
          setShowNotificationModal(true);
        }, 2000);
        
        // Immediate redirect to mobile home page
        console.log('Taking user to mobile home page');
        
        // Use wouter's setLocation for proper routing
        setTimeout(() => {
          setLocation('/mobile');
        }, 6000);
      }
      
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

  const handleGoogleSignUp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setGoogleLoading(true);
    
    // Navigate to Google OAuth after showing loading animation
    setTimeout(() => {
      window.location.href = "/auth/google";
    }, 800);
  };

  return (
    <PageLayout
      title="Create Account"
      subtitle="Join Nedaxer investment platform"
      bgColor="linear-gradient(135deg, #eff6ff 0%, #fefce8 50%, #fff7ed 100%)"
    >
      <div className="max-w-4xl mx-auto bg-white p-8 lg:p-12 rounded-3xl shadow-2xl border-0 relative overflow-hidden">
        {/* Bright accent background decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500"></div>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-100 mb-4 shadow-xl">
            <UserIcon className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Join the Adventure!</h1>
          <p className="text-base text-gray-600 font-medium">Start your investment journey with thousands of fellow investors</p>
        </div>

        <div className="w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Personal Information</h3>
                <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-800 font-semibold text-sm">First Name<span className="text-red-500 ml-1">*</span></Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4 text-yellow-600" />
                      </div>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        className="w-full pl-9 py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-900 placeholder:text-gray-500 rounded-xl text-sm font-medium transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-800 font-semibold text-sm">Last Name<span className="text-red-500 ml-1">*</span></Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4 text-yellow-600" />
                      </div>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        className="w-full pl-9 py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-900 placeholder:text-gray-500 rounded-xl text-sm font-medium transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-800 font-semibold text-sm">Email Address<span className="text-red-500 ml-1">*</span></Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon className="h-4 w-4 text-yellow-600" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="w-full pl-9 py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-900 placeholder:text-gray-500 rounded-xl text-sm font-medium transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Country Phone Input */}
                <CountryPhoneInput
                  value={formData.phoneNumber}
                  onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}
                  countryCode={formData.countryCode}
                  onCountryCodeChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
                  required
                  placeholder="Enter phone number"
                  disabled={isLoading}
                />

                {/* Referral Code Input */}
                <div className="space-y-2">
                  <Label htmlFor="referralCode" className="text-gray-800 font-semibold text-sm">Referral Code <span className="text-gray-500 text-xs">(Optional)</span></Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Gift className="h-4 w-4 text-yellow-600" />
                    </div>
                    <Input
                      id="referralCode"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      placeholder="Enter referral code (if you have one)"
                      className="w-full pl-9 py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-900 placeholder:text-gray-500 rounded-xl text-sm font-medium transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-600">Have a friend who referred you? Enter their code to earn bonus rewards!</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-800 font-semibold text-sm">Date of Birth<span className="text-red-500 ml-1">*</span></Label>
                  <div className="grid grid-cols-3 gap-2">
                    <select 
                      value={formData.dateOfBirth} 
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 rounded-xl text-sm font-medium transition-all duration-200"
                      required
                    >
                      <option value="">Day</option>
                      {Array.from({length: 31}, (_, i) => (
                        <option key={i+1} value={i+1}>{i+1}</option>
                      ))}
                    </select>
                    <select 
                      value={formData.monthOfBirth} 
                      onChange={(e) => setFormData(prev => ({ ...prev, monthOfBirth: e.target.value }))}
                      className="py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 rounded-xl text-sm font-medium transition-all duration-200"
                      required
                    >
                      <option value="">Month</option>
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                    <select 
                      value={formData.yearOfBirth} 
                      onChange={(e) => setFormData(prev => ({ ...prev, yearOfBirth: e.target.value }))}
                      className="py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 rounded-xl text-sm font-medium transition-all duration-200"
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({length: 100}, (_, i) => {
                        const year = new Date().getFullYear() - 18 - i;
                        return <option key={year} value={year}>{year}</option>
                      })}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-800 font-semibold text-sm">Gender<span className="text-red-500 ml-1">*</span></Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 text-yellow-600" />
                    </div>
                    <select 
                      id="gender"
                      name="gender"
                      value={formData.gender} 
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full pl-9 py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-900 rounded-xl text-sm font-medium transition-all duration-200"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                </div>
              </div>

              {/* Right Column - Account Security */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Account Security</h3>
                <div className="space-y-4">
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-800 font-semibold text-sm">Password<span className="text-red-500 ml-1">*</span></Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockIcon className="h-4 w-4 text-yellow-600" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a secure password"
                        className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-900 placeholder:text-gray-500 rounded-xl text-sm font-medium transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-600 hover:text-orange-500 transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-800 font-semibold text-sm">Confirm Password<span className="text-red-500 ml-1">*</span></Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockIcon className="h-4 w-4 text-yellow-600" />
                      </div>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-900 placeholder:text-gray-500 rounded-xl text-sm font-medium transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-600 hover:text-orange-500 transition-colors duration-200"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl flex items-start shadow-lg border border-yellow-200">
                    <InfoIcon className="h-5 w-5 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                    <div className="text-xs text-gray-800">
                      <p className="font-bold text-gray-900 mb-2 text-sm">Create a Strong Password:</p>
                      <ul className="list-none space-y-1">
                        <li className="flex items-center"><span className="text-yellow-500 mr-2 text-sm">✓</span>At least 8 characters long</li>
                        <li className="flex items-center"><span className="text-yellow-500 mr-2 text-sm">✓</span>Include uppercase & lowercase letters</li>
                        <li className="flex items-center"><span className="text-yellow-500 mr-2 text-sm">✓</span>Include at least one number</li>
                        <li className="flex items-center"><span className="text-yellow-500 mr-2 text-sm">✓</span>Include a special character (!@#$%)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start bg-yellow-50 p-3 rounded-xl border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="acceptTerms" 
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))}
                          className="text-yellow-600 border-yellow-400 w-4 h-4"
                          required
                        />
                        <div className="text-sm">
                          <label
                            htmlFor="acceptTerms"
                            className="font-semibold text-gray-800 leading-relaxed cursor-pointer"
                          >
                            I agree to the {" "}
                            <Link href="/legal/terms" className="text-yellow-600 hover:text-orange-500 underline font-bold transition-colors duration-200">
                              Terms & Conditions
                            </Link>
                            {" "} and understand the investment risks involved. *
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start bg-blue-50 p-3 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="receiveUpdates" 
                          checked={formData.receiveUpdates}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, receiveUpdates: checked as boolean }))}
                          className="text-blue-600 border-blue-400 w-4 h-4"
                        />
                        <div className="text-sm">
                          <label
                            htmlFor="receiveUpdates"
                            className="font-semibold text-gray-800 leading-relaxed cursor-pointer"
                          >
                            I'd like to receive investment opportunities and market updates (Optional)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Full Width */}
            <div className="space-y-4">
                {/* Virtual reCAPTCHA Widget with enhanced styling */}
                <div className="flex justify-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <VirtualRecaptcha 
                    onVerify={handleRecaptchaVerify}
                    onExpire={handleRecaptchaExpire}
                    theme="light"
                    size="compact"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white py-3 font-bold text-lg rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Creating Your Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-yellow-200"></div>
              </div>
              <div className="relative flex justify-center text-base">
                <span className="px-3 bg-white text-gray-600 font-semibold">Or continue with</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <a 
                href="/auth/google"
                onClick={handleGoogleSignUp}
                className="inline-flex items-center justify-center py-3 px-6 border-2 border-gray-200 rounded-xl shadow-lg bg-white hover:bg-gray-50 hover:border-yellow-300 text-base font-semibold text-gray-700 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1"
              >
                {googleLoading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <p className="text-gray-700 text-base">
                Already have an account?{" "}
                <Link href="/account/login" className="text-yellow-600 hover:text-orange-500 font-bold transition-colors duration-200 underline decoration-2 underline-offset-2">
                  Welcome Back!
                </Link>
              </p>
            </div>
          </div>
        </div>
      
      {/* Notification Permission Modal */}
      <NotificationPermissionModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        showOnLogin={false}
      />
    </PageLayout>
  );
}