import type { Transition, Variants } from "framer-motion";

/**
 * ===================================================================
 * APPLE DESIGN SYSTEM: NATURAL MOTION PHYSICS & TIMING (macOS / iOS 18)
 * ===================================================================
 * Organic, non-overshooting spring physics with pristine damping.
 */

// Canonical Apple standard spring (Natural equilibrium without jarring oscillation)
export const appleSpring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
  mass: 0.8,
};

// Snappy micro-interaction spring (Buttons, toggles, icon touches)
export const appleSpringSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.7,
};

// Gentle layout morphing spring (Tabs, pills, sheet drawer reveals)
export const appleSpringGentle: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 28,
  mass: 0.9,
};

// Smooth glide transition for sliding highlight bubbles (layoutId)
export const tabLayoutTransition: Transition = {
  type: "spring",
  stiffness: 440,
  damping: 32,
  mass: 0.75,
};

// 60fps hardware-accelerated smooth ease fallback
export const smoothEase = [0.16, 1, 0.3, 1] as const;

/**
 * ===================================================================
 * STAGGERED ENTRY CASCADES (Cards, Grids, Tables, Metrics)
 * ===================================================================
 */

// Staggered cascade container with tight 0.05s cadence
export const cascadeContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

// Cascade child item: featherweight lift + soft fade-in
export const cascadeItemVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: appleSpring,
  },
};

// Hero section staggered container
export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

// Hero child element entry with Apple natural spring
export const heroChildVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: appleSpring,
  },
};

// Scroll reveal stagger container
export const scrollStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.03,
    },
  },
};

// Scroll reveal card item with organic spring
export const scrollCardItem: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: appleSpring,
  },
};

/**
 * ===================================================================
 * MICRO-FEEDBACK: TACTILE BUTTONS & CARDS
 * ===================================================================
 */

// Apple tactile tap compression (scale: 0.97) + featherweight hover lift
export const buttonMotion = {
  whileHover: { y: -2, scale: 1.01 },
  whileTap: { scale: 0.97 },
  transition: appleSpringSnappy,
};

// Subtle icon button motion (scale 0.94 on tap)
export const iconButtonMotion = {
  whileHover: { scale: 1.06 },
  whileTap: { scale: 0.94 },
  transition: appleSpringSnappy,
};

// Ecosystem portal card hover interaction
export const cardHover: Variants = {
  rest: { 
    y: 0, 
    scale: 1,
    transition: appleSpringGentle 
  },
  hover: {
    y: -3,
    scale: 1.008,
    transition: appleSpringGentle,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: appleSpring,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.03,
    },
  },
};

export const pulseGlow: Variants = {
  initial: { scale: 1, opacity: 0.9 },
  animate: {
    scale: [1, 1.03, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 2.6,
      repeat: Infinity,
      ease: [0.445, 0.05, 0.55, 0.95],
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: appleSpring,
  },
};

// VisionOS-grade modal window entrance
export const modalSpringVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: appleSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

// Slide-over drawer spring
export const drawerSpringVariants: Variants = {
  hidden: { x: "100%", opacity: 0.4 },
  visible: {
    x: "0%",
    opacity: 1,
    transition: appleSpring,
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.22, ease: "easeIn" },
  },
};
