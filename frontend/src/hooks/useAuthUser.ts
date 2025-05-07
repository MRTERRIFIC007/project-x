import { useUser, useAuth, useClerk } from "@clerk/clerk-react";
import { useCallback } from "react";

export const useAuthUser = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const isLoaded = isUserLoaded && isAuthLoaded;

  // Redirect to dashboard after sign-in/sign-up
  const redirectToDashboard = "/dashboard";

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    await signOut();
    // Redirect will be handled by ClerkProvider
  }, [signOut]);

  return {
    user,
    isLoaded,
    isSignedIn,
    signOut: handleSignOut,
    redirectToDashboard,
  };
};

export default useAuthUser;
