import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { Route } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MotionFade, MotionSlide } from "@/components/motion/MotionElements";

export default function SignIn() {
  const navigate = useNavigate();

  return (
    <MotionFade className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <MotionSlide direction="down" className="mb-8 flex items-center gap-2">
        <Route className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Optimized Delivery</h1>
      </MotionSlide>
      <MotionSlide
        direction="up"
        className="w-full max-w-md rounded-lg border bg-background p-6 shadow-sm"
      >
        <ClerkSignIn
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
          redirectUrl="/dashboard"
        />
      </MotionSlide>
    </MotionFade>
  );
}
