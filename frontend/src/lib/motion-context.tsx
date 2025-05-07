import { createContext, useContext, useState, ReactNode } from "react";
import { Variants } from "framer-motion";

type AnimationContextType = {
  pageVariants: Variants;
  transition: {
    duration: number;
    ease: string;
  };
  exitBeforeEnter: boolean;
};

const defaultContext: AnimationContextType = {
  pageVariants: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  transition: {
    duration: 0.4,
    ease: "easeInOut",
  },
  exitBeforeEnter: true,
};

const MotionContext = createContext<AnimationContextType>(defaultContext);

export const useMotion = () => useContext(MotionContext);

export const MotionProvider = ({ children }: { children: ReactNode }) => {
  const [motionConfig] = useState<AnimationContextType>(defaultContext);

  return (
    <MotionContext.Provider value={motionConfig}>
      {children}
    </MotionContext.Provider>
  );
};
