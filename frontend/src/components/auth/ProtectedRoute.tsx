import { useAuth } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { FullPageLoading } from "@/components/ui/loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    // Show loading spinner while checking auth state
    return <FullPageLoading message="Checking authentication..." />;
  }

  if (!isSignedIn) {
    // Redirect to sign-in page if not signed in
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
