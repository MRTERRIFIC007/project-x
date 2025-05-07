import React from "react";
import { motion } from "framer-motion";
import {
  cardVariants,
  fadeInVariants,
  staggeredListVariants,
  slideInVariants,
} from "@/lib/motion-variants";

// MotionCard component for card elements with hover animation
export const MotionCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    variants={cardVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    whileHover="hover"
    className={className}
    transition={{
      ...cardVariants.animate.transition,
      delay,
    }}
  >
    {children}
  </motion.div>
);

// MotionFade component for simple fade-in elements
export const MotionFade = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    variants={fadeInVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className={className}
    transition={{
      ...fadeInVariants.animate.transition,
      delay,
    }}
  >
    {children}
  </motion.div>
);

// MotionSlide component for elements that slide in
export const MotionSlide = ({
  children,
  className = "",
  direction = "left",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}) => {
  const variants = slideInVariants(direction);

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      transition={{
        ...variants.animate.transition,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

// MotionList for staggered list animations
export const MotionList = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={staggeredListVariants.container}
    initial="initial"
    animate="animate"
    exit="exit"
    className={className}
  >
    {children}
  </motion.div>
);

// MotionItem for individual items in a staggered list
export const MotionItem = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div variants={staggeredListVariants.item} className={className}>
    {children}
  </motion.div>
);

// MotionButton for animated button effects
export const MotionButton = ({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) => (
  <motion.button
    className={className}
    onClick={onClick}
    type={type}
    disabled={disabled}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.button>
);

// MotionImage for images with loading animations
export const MotionImage = ({
  src,
  alt,
  className = "",
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}) => (
  <motion.img
    src={src}
    alt={alt}
    className={className}
    width={width}
    height={height}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  />
);
