import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useMotion } from "@/lib/motion-context";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  const location = useLocation();
  const { pageVariants, transition } = useMotion();

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
