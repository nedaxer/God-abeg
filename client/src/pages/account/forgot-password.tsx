import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        data: { email }
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Reset code sent",
        description: "Check your inbox for the 6-digit reset code.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    forgotPasswordMutation.mutate(email);
  };

  return (
    <PageLayout
      title="Forgot Password"
      subtitle="Reset your account password"
      bgColor="#f8f9fa"
    >
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        {!isSubmitted ? (
          <>
            <div className="mb-6 text-gray-600">
              <p>Enter your email address below and we'll send you instructions to reset your password.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#0033a0] hover:bg-[#002680]"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-bold text-gray-800">Reset Code Sent</h3>
            <p className="text-gray-600">
              We've sent a 6-digit reset code to:
            </p>
            <p className="font-medium text-[#0033a0]">{email}</p>
            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Please check your inbox (and spam folder) for the reset code.
              </p>
              <Button 
                onClick={() => {
                  console.log('Navigating to reset password page with email:', email);
                  // Store email in localStorage as backup
                  localStorage.setItem('resetPasswordEmail', email);
                  // Navigate to reset password page
                  setLocation('/account/reset-password');
                }}
                className="w-full bg-[#0033a0] hover:bg-[#002680] mb-4"
              >
                Enter Reset Code
              </Button>
              <div className="p-4 rounded-md bg-blue-50 flex">
                <AlertCircle className="h-5 w-5 text-[#0033a0] mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  The reset code will expire in 15 minutes for security reasons.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/account/login" className="text-[#0033a0] hover:text-[#ff5900] font-semibold">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}