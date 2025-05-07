import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MotionCard, MotionButton } from "@/components/motion/MotionElements";

const NotFound = () => {
  return (
    <div className="container mx-auto py-20 flex items-center justify-center">
      <MotionCard className="w-full max-w-md border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 text-center">
          <p className="text-muted-foreground">
            The page you are looking for does not exist.
          </p>
          <MotionButton className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/" className="w-full h-full block">
              Go back to Home
            </Link>
          </MotionButton>
        </CardContent>
      </MotionCard>
    </div>
  );
};

export default NotFound;
