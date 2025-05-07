import { ClerkProvider as ClerkProviderBase } from "@clerk/clerk-react";
import { ReactNode } from "react";

interface ClerkProviderProps {
  children: ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  const publishableKey =
    import.meta.env.VITE_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "pk_test_aW5mb3JtZWQtcmVpbmRlZXItMjEuY2xlcmsuYWNjb3VudHMuZGV2JA";

  return (
    <ClerkProviderBase publishableKey={publishableKey}>
      {children}
    </ClerkProviderBase>
  );
}
