import { Route } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  message?: string;
}

export function Loading({ className, message = "Loading..." }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full",
        className
      )}
    >
      <div className="animate-spin mb-4">
        <Route className="h-10 w-10 text-primary" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function FullPageLoading({ className, message }: LoadingProps) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <Loading className={className} message={message} />
    </div>
  );
}
