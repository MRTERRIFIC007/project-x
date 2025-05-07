import { createContext, ReactNode, useContext } from "react";
import useAuthUser from "@/hooks/useAuthUser";

// Define the shape of the auth context
interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean | null;
  user: any; // Using any for simplicity
  signOut: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isLoaded: false,
  isSignedIn: null,
  user: null,
  signOut: async () => {},
});

// Provider component that wraps parts of the app that need auth
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthUser();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
