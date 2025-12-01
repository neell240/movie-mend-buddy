# 🎬 Boovi Animation System

Complete CSS animation system for the MovieMend mascot "Boovi"

## 📦 What's Included

### Components
- **BooviAnimated** - Main animated Boovi component with multiple animation states
- **BooviLoadingScreen** - Full-screen loading with Boovi
- **BooviWelcome** - Welcome screen with auto-hide
- **BooviThinking** - AI thinking indicator (full & compact)
- **BooviPointer** - Directional pointer with message tooltip

### Animations
1. **idle** - Gentle floating (default)
2. **wave** - Waving hello animation
3. **jump** - Bounce with squash/stretch
4. **think** - AI processing mode with glow
5. **loading** - Breathing loading animation
6. **point** - Pointing in direction
7. **celebrate** - Happy celebration (auto-returns to idle)

### Hook
- **useBooviAnimation** - State management for animations with helpers

## 🚀 Quick Start

```tsx
import { BooviAnimated } from "@/components/BooviAnimated";

// Simple usage
<BooviAnimated animation="wave" size="lg" showSparkles />

// With hook
import { useBooviAnimation } from "@/hooks/useBooviAnimation";

function MyComponent() {
  const { animation, celebrate, think } = useBooviAnimation();
  
  return (
    <div>
      <BooviAnimated animation={animation} size="xl" />
      <button onClick={celebrate}>Celebrate!</button>
    </div>
  );
}
```

## 📱 Use Cases

### Loading States
```tsx
<BooviLoadingScreen message="Finding perfect movies..." />
```

### AI Chat Thinking
```tsx
<BooviThinking message="Analyzing your preferences..." />
<BooviThinking message="Processing..." compact /> // Inline version
```

### Welcome/Onboarding
```tsx
<BooviWelcome 
  message="Welcome to MovieMend! 🎬"
  onComplete={() => console.log('Animation done')}
/>
```

### Directional Hints
```tsx
<BooviPointer 
  message="Check out this feature!" 
  direction="right" 
/>
```

## 🎨 Sizes
- **sm** - 64px (4rem)
- **md** - 96px (6rem)
- **lg** - 128px (8rem)
- **xl** - 192px (12rem)

## 🎯 Props

### BooviAnimated
```tsx
interface BooviAnimatedProps {
  animation?: "wave" | "idle" | "jump" | "think" | "loading" | "point" | "celebrate" | "none";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSparkles?: boolean;
}
```

### useBooviAnimation Hook
```tsx
const {
  animation,        // Current animation state
  setAnimation,     // Set any animation
  celebrate,        // Trigger celebrate (auto-returns to idle)
  jump,            // Trigger jump (auto-returns to idle)
  wave,            // Trigger wave (auto-returns to idle)
  think,           // Start thinking animation
  stopThinking,    // Return to idle from thinking
} = useBooviAnimation("idle"); // optional default
```

## 🧪 Testing

Visit `/boovi-demo` to test all animations and components interactively.

## 🎨 Customization

### CSS Variables
All animations are in `src/styles/boovi-animations.css`. You can:
- Adjust timing functions
- Modify animation durations
- Change sparkle positions
- Add new animations

### Example: Custom Animation
```css
@keyframes boovi-custom {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2) rotate(10deg); }
}

.animate-boovi-custom {
  animation: boovi-custom 1s ease-in-out infinite;
}
```

Then add to component:
```tsx
"animate-boovi-custom": animation === "custom"
```

## 📊 Performance

- Pure CSS animations (GPU accelerated)
- No JavaScript animation loops
- Lightweight (~2KB CSS)
- No external dependencies

## 🎬 Animation Timing

| Animation | Duration | Loop |
|-----------|----------|------|
| idle | 3s | Yes |
| wave | 2s | Yes |
| jump | 1s | No |
| think | 2.5s | Yes |
| loading | 1.5s | Yes |
| point | 1.5s | Yes |
| celebrate | 1.8s (0.6s × 3) | No |

## 🚀 Production Notes

### Current Implementation
- ✅ CSS animations with GPU acceleration
- ✅ React components ready to use
- ✅ Responsive and performant
- ✅ Works with PWA/TWA

### For Professional Animations
For complex character animations with limb movements, consider:

1. **Lottie Files**
   - Use [LottieFiles](https://lottiefiles.com) or After Effects + Bodymovin
   - Add with `lottie-react` package
   - Best for complex animations

2. **Rive Animations**
   - Use [Rive](https://rive.app) for interactive animations
   - Smaller file sizes than Lottie
   - State machine support

3. **Frame-by-Frame**
   - Export PNG sequences from animation software
   - Use sprite sheets for efficiency
   - Good for very specific animations

### Integration Example (Lottie)
```tsx
import Lottie from 'lottie-react';
import waveAnimation from '@/assets/animations/wave.json';

<Lottie animationData={waveAnimation} loop />
```

## 📱 PWA/TWA Integration

### Service Worker Preload
Add to your service worker cache:
```js
'/assets/boovi-transparent.png',
'/styles/boovi-animations.css'
```

### Loading Screen
```tsx
// In App.tsx or loading component
<BooviLoadingScreen message="Loading MovieMend..." />
```

### Splash Screen
The generated splash screen already includes Boovi with the cinematic background.

## 🎯 Recommended Usage in MovieMend

1. **Home Screen** - `idle` animation
2. **Search Loading** - `loading` animation
3. **AI Chat Thinking** - `think` animation with glow
4. **Success/Add to Watchlist** - `celebrate` animation
5. **Onboarding Steps** - `wave`, `point` animations
6. **Welcome Back** - `wave` with auto-dismiss

## 🐛 Troubleshooting

**Animation not showing?**
- Check that `boovi-animations.css` is imported in `index.css`
- Verify image path to `boovi-transparent.png`
- Check console for import errors

**Performance issues?**
- Reduce `showSparkles` usage
- Use smaller sizes when possible
- Limit simultaneous animations

**Want smoother animations?**
- Add `will-change: transform` to frequently animated elements
- Use `transform` instead of position properties
- Enable hardware acceleration

## 📚 Resources

- Demo page: `/boovi-demo`
- CSS file: `src/styles/boovi-animations.css`
- Components: `src/components/Boovi*.tsx`
- Hook: `src/hooks/useBooviAnimation.ts`
