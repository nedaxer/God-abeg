import { useState } from "react";
import { Link } from "wouter";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

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
    
    // Would normally send reset email through backend
    toast({
      title: "Reset email sent",
      description: "Check your inbox for instructions to reset your password.",
    });
    
    setIsSubmitted(true);
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
              >
                Reset Password
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-bold text-gray-800">Reset Email Sent</h3>
            <p className="text-gray-600">
              We've sent password reset instructions to:
            </p>
            <p className="font-medium text-[#0033a0]">{email}</p>
            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-2">
                Please check your inbox (and spam folder) for the reset link.
              </p>
              <div className="mt-6 p-4 rounded-md bg-blue-50 flex">
                <AlertCircle className="h-5 w-5 text-[#0033a0] mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  The password reset link will expire in 30 minutes for security reasons.
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