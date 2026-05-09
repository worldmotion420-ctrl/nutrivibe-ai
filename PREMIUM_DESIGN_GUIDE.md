# NutriVibe AI - Premium Design System & Guide

## 🎨 Design Philosophy

NutriVibe AI is built on a **premium, production-grade design system** that rivals top-tier $50M+ startup products. Every pixel, animation, and interaction has been carefully crafted for maximum impact and user delight.

### Core Principles

1. **Intentional Spacing** - Consistent 8px grid system for perfect alignment
2. **Premium Typography** - Carefully selected font sizes, weights, and line heights
3. **Depth & Elevation** - Layered shadows and glow effects for visual hierarchy
4. **Smooth Animations** - Fluid transitions that feel natural and responsive
5. **Glassmorphism** - Frosted glass cards with blur and transparency
6. **Neon Accents** - #CCFF00 primary color for futuristic feel

## 📐 Spacing System

All spacing is based on an **8px base unit** for perfect consistency:

```
xs:    4px   (micro)
sm:    8px   (small)
md:   12px   (medium)
lg:   16px   (large)
xl:   24px   (extra large)
xxl:  32px   (2x large)
xxxl: 48px   (3x large)
```

### Usage Guidelines

- **Padding**: Use `lg` (16px) for screen edges
- **Gaps**: Use `md` (12px) between components
- **Sections**: Use `xl` (24px) between major sections
- **Micro**: Use `xs` (4px) for tight spacing

## 🔤 Typography System

### Font Sizes

```
xs:    11px  (captions)
sm:    12px  (labels)
base:  14px  (body)
md:    16px  (body large)
lg:    18px  (subheading)
xl:    20px  (heading)
2xl:   24px  (heading large)
3xl:   28px  (heading XL)
4xl:   32px  (hero)
5xl:   40px  (splash)
```

### Font Weights

- **Light (300)** - Rarely used, only for subtle text
- **Normal (400)** - Body text, descriptions
- **Medium (500)** - Labels, secondary headings
- **Semibold (600)** - Primary headings, buttons
- **Bold (700)** - Hero text, emphasis

### Line Heights

- **Tight (1.2)** - Headings, single-line text
- **Normal (1.4)** - Body text
- **Relaxed (1.6)** - Long-form content

### Predefined Styles

```typescript
// Use these for consistency
typography.styles.h1    // 40px, bold, tight
typography.styles.h2    // 32px, bold, tight
typography.styles.h3    // 28px, bold, tight
typography.styles.h4    // 24px, semibold
typography.styles.body  // 16px, normal, relaxed
typography.styles.label // 12px, semibold, letter-spaced
```

## 🌈 Color System

### Primary Colors

- **Primary**: `#CCFF00` (Neon Green) - Main accent, CTAs, highlights
- **Primary Light**: `#E6FF66` - Hover states
- **Primary Dark**: `#99CC00` - Pressed states

### Backgrounds

- **Background**: `#0A0E27` (Deep Navy) - Main background
- **Surface**: `#1A1F3A` (Dark Blue) - Cards, elevated surfaces
- **Surface Light**: `#252D4A` - Secondary surfaces

### Text

- **Foreground**: `#FFFFFF` (White) - Primary text
- **Foreground Secondary**: `#E0E0E0` - Secondary text
- **Muted**: `#A0A0A0` (Gray) - Tertiary text

### Semantic

- **Success**: `#00FF00` (Green)
- **Warning**: `#FF9500` (Orange)
- **Error**: `#FF3B30` (Red)
- **Info**: `#00B0FF` (Blue)

## 🎭 Shadow System

### Elevation Shadows

```typescript
shadows.sm    // Subtle elevation (cards)
shadows.md    // Medium elevation (modals)
shadows.lg    // Large elevation (floating elements)
shadows.xl    // Extra large elevation (top-level)
```

### Glow Effects

```typescript
shadows.glowSm   // Subtle neon glow
shadows.glowMd   // Medium neon glow
shadows.glowLg   // Strong neon glow
```

## ✨ Animation System

### Durations

```typescript
animations.duration.fast    // 150ms (quick feedback)
animations.duration.base    // 300ms (standard transitions)
animations.duration.slow    // 500ms (smooth transitions)
animations.duration.slower  // 800ms (dramatic transitions)
```

### Easing Functions

```typescript
// Smooth, premium feel
animations.easing.smooth     // cubic-bezier(0.4, 0, 0.2, 1)
animations.easing.smoothIn   // cubic-bezier(0.4, 0, 1, 1)
animations.easing.smoothOut  // cubic-bezier(0, 0, 0.2, 1)

// Bouncy, playful
animations.easing.bounce     // cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Predefined Transitions

```typescript
animations.transitions.fadeIn    // Fade in (300ms)
animations.transitions.scaleIn   // Scale in (300ms)
animations.transitions.slideUp   // Slide up (400ms)
animations.transitions.press     // Press feedback (80ms)
```

## 🎯 Interaction Design

### Press Feedback

All interactive elements should provide immediate visual feedback:

```typescript
// Scale on press
transform: [{ scale: 0.95 }]  // 5% reduction

// Opacity on press
opacity: 0.7  // 30% reduction
```

### Haptic Feedback

Use haptics sparingly for maximum impact:

```typescript
Haptics.impactAsync(ImpactFeedbackStyle.Light)      // Button taps
Haptics.impactAsync(ImpactFeedbackStyle.Medium)     // Toggle switches
Haptics.notificationAsync(NotificationFeedbackType.Success)  // Success
Haptics.notificationAsync(NotificationFeedbackType.Error)    // Error
```

## 🧩 Component Library

### Premium Button

```tsx
<PremiumButton
  variant="primary"      // primary, secondary, ghost, outline
  size="md"              // sm, md, lg
  fullWidth
  glow                   // Add neon glow effect
  onPress={handlePress}
>
  Get Started
</PremiumButton>
```

### Glass Card

```tsx
<GlassCardPremium
  padding={spacing.lg}
  glow                   // Add neon glow
  shadow="md"            // sm, md, lg
>
  {children}
</GlassCardPremium>
```

### Circular Progress

```tsx
<CircularProgress
  current={1450}
  target={2200}
  radius={80}
  strokeWidth={8}
  unit="kcal"
  color={colors.primary}
  showLabel
/>
```

## 📱 Screen Layouts

### Safe Area Handling

Always use `ScreenContainer` for proper safe area handling:

```tsx
<ScreenContainer className="p-4">
  {/* Content */}
</ScreenContainer>
```

### Responsive Spacing

Use responsive spacing for different screen sizes:

```typescript
// Mobile (375px)
paddingHorizontal: spacing.gutter  // 16px

// Tablet (768px+)
paddingHorizontal: spacing.gutter * 2  // 32px
```

## 🎬 Animation Examples

### Fade In

```tsx
Animated.timing(opacityAnim, {
  toValue: 1,
  duration: 300,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: true,
}).start();
```

### Scale In

```tsx
Animated.timing(scaleAnim, {
  toValue: 1,
  duration: 300,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: true,
}).start();
```

### Pulse

```tsx
Animated.loop(
  Animated.sequence([
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }),
    Animated.timing(opacityAnim, {
      toValue: 0.5,
      duration: 1500,
      useNativeDriver: true,
    }),
  ]),
  { iterations: -1 }
).start();
```

## 🎨 Design Tokens

All design tokens are centralized in `/lib/design-system.ts`:

```typescript
import {
  spacing,
  typography,
  colors,
  shadows,
  radius,
  animations,
} from '@/lib/design-system';
```

## 📋 Checklist for New Screens

- [ ] Use `ScreenContainer` for safe area
- [ ] Apply consistent spacing (8px grid)
- [ ] Use typography styles from design system
- [ ] Add appropriate shadows/glow effects
- [ ] Implement smooth animations
- [ ] Add press feedback to interactive elements
- [ ] Use glass cards for elevation
- [ ] Test on iOS and Android
- [ ] Verify dark mode appearance
- [ ] Check accessibility (color contrast, text size)

## 🚀 Best Practices

### DO ✅

- Use design system tokens for consistency
- Keep animations under 400ms for responsiveness
- Provide immediate press feedback
- Use glass cards for visual depth
- Apply neon glow to important elements
- Test animations on real devices
- Use semantic colors (success, error, warning)

### DON'T ❌

- Don't hardcode colors or spacing
- Don't use animations longer than 800ms
- Don't skip press feedback
- Don't mix different shadow styles
- Don't use too many different font sizes
- Don't animate on mount without purpose
- Don't use opacity below 0.5 for text

## 📚 Resources

- Design System: `/lib/design-system.ts`
- Component Library: `/components/ui/`
- Screen Examples: `/app/`
- Premium Screens: `*-premium.tsx` files

---

**Built with ❤️ for top-tier user experience**
