# Animation System Documentation

This directory contains the animation components and utilities that provide consistent page transitions and element animations throughout the application.

## Components

### PageTransition

Wraps page content to provide smooth transitions when navigating between pages.

```jsx
import PageTransition from "@/components/PageTransition";

<PageTransition>{/* Your page content here */}</PageTransition>;
```

### Motion Elements

Reusable motion components for various UI elements:

- `MotionCard`: Animated card component with hover effects
- `MotionFade`: Simple fade-in animation
- `MotionSlide`: Slide animation from various directions
- `MotionList`: Container for staggered list animations
- `MotionItem`: Individual items in a staggered list
- `MotionButton`: Animated button with hover/tap effects
- `MotionImage`: Image with loading animation

Example usage:

```jsx
import {
  MotionCard,
  MotionFade,
  MotionSlide,
  MotionList,
  MotionItem,
  MotionButton,
  MotionImage
} from "@/components/motion/MotionElements";

// Fade in component
<MotionFade>Content</MotionFade>

// Card with hover animation
<MotionCard>Card content</MotionCard>

// Slide in from left (default), right, up or down
<MotionSlide direction="up">Slides up</MotionSlide>

// Staggered list animation
<MotionList>
  <MotionItem>Item 1</MotionItem>
  <MotionItem>Item 2</MotionItem>
  <MotionItem>Item 3</MotionItem>
</MotionList>

// Add delay for sequential animations
<MotionFade delay={0.2}>Appears after a delay</MotionFade>
```

## Context and Variants

The animation system is built on:

### MotionProvider

Provides animation configuration through context. Wrap your application with this provider in `App.tsx`.

### Animation Variants

Predefined animation variants in `motion-variants.ts`:

- `staggeredListVariants`: For lists with staggered item animations
- `cardVariants`: For cards with scale and opacity transitions
- `fadeInVariants`: Simple fade-in/out
- `slideInVariants`: Directional slide animations

## Implementation Best Practices

1. Wrap page content in `<PageTransition>` when the component renders a full page
2. Use specific motion components for UI elements
3. For lists or grids, use `MotionList` with `MotionItem`
4. Add increasing delays for sequential animations
5. Keep animations subtle and purposeful
6. Ensure animations complete quickly (< 500ms) for good UX
