import React, { useMemo } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

type AuthRedirectProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

/**
 * Component that redirects authenticated users to the dashboard
 * and allows non-authenticated users to see the wrapped content
 */
export const AuthRedirect: React.FC<AuthRedirectProps> = ({ 
  children, 
  redirectTo = "/mobile" 
}) => {
  const { user, isLoading } = useAuth();

  // Memoize the loading state to prevent unnecessary re-renders
  const loadingComponent = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0033a0] mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  ), []);

  // If still loading auth status, show loading indicator
  if (isLoading) {
    return loadingComponent;
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    console.log('User is authenticated, redirecting to:', redirectTo);
    return <Redirect to={redirectTo} />;
  }

  // Otherwise, show the wrapped content (login/register/etc)
  return <>{children}</>;
};