import { Variants } from "framer-motion";

// Staggered list item animations (for lists, cards, grid items)
export const staggeredListVariants = {
  container: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  },
  item: {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 25,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  },
};

// For cards that slide in and scale up
export const cardVariants: Variants = {
  initial: {
    scale: 0.95,
    opacity: 0,
    y: 20,
  },
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.2,
    },
  },
};

// For fade-in sections
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// For slide-in elements
export const slideInVariants = (direction = "left"): Variants => {
  const xValues = {
    left: { initial: -100, animate: 0, exit: -100 },
    right: { initial: 100, animate: 0, exit: 100 },
  };

  const yValues = {
    up: { initial: 100, animate: 0, exit: 100 },
    down: { initial: -100, animate: 0, exit: -100 },
  };

  if (direction === "left" || direction === "right") {
    const { initial, animate, exit } = xValues[direction];
    return {
      initial: { x: initial, opacity: 0 },
      animate: {
        x: animate,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      },
      exit: {
        x: exit,
        opacity: 0,
        transition: {
          duration: 0.2,
        },
      },
    };
  } else {
    const { initial, animate, exit } = yValues[direction as "up" | "down"];
    return {
      initial: { y: initial, opacity: 0 },
      animate: {
        y: animate,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      },
      exit: {
        y: exit,
        opacity: 0,
        transition: {
          duration: 0.2,
        },
      },
    };
  }
};
