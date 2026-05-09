/**
 * NutriVibe AI - Premium Design System
 * Production-grade spacing, typography, shadows, and animations
 */

// ============================================================================
// SPACING SYSTEM (8px base unit)
// ============================================================================
export const spacing = {
  // Micro spacing
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  
  // Semantic spacing
  gutter: 16,
  section: 24,
  screen: 16,
} as const;

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================
export const typography = {
  // Font families
  family: {
    sans: 'System',
    mono: 'Menlo',
  },
  
  // Font sizes (iOS-first, scales on Android/Web)
  size: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },
  
  // Line heights (1.2-1.6 range for readability)
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  // Font weights
  weight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Predefined text styles
  styles: {
    // Headings
    h1: {
      fontSize: 40,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 1.2,
      letterSpacing: -0.2,
    },
    h4: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.3,
      letterSpacing: -0.1,
    },
    
    // Body text
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    
    // Labels and captions
    label: {
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 1.4,
      letterSpacing: 0.5,
    },
    caption: {
      fontSize: 11,
      fontWeight: '400',
      lineHeight: 1.4,
      letterSpacing: 0.3,
    },
    
    // Button text
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.4,
      letterSpacing: 0.2,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 1.4,
      letterSpacing: 0.2,
    },
  },
} as const;

// ============================================================================
// SHADOW SYSTEM (Premium depth)
// ============================================================================
export const shadows = {
  // Subtle shadows for elevation
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Glow effects (neon green)
  glowSm: {
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  glowMd: {
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  
  glowLg: {
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ============================================================================
// BORDER RADIUS SYSTEM
// ============================================================================
export const radius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================
export const animations = {
  // Duration presets (milliseconds)
  duration: {
    fast: 150,
    base: 300,
    slow: 500,
    slower: 800,
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Custom cubic bezier for premium feel
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smoothIn: 'cubic-bezier(0.4, 0, 1, 1)',
    smoothOut: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Predefined animations
  transitions: {
    // Fade
    fadeIn: {
      duration: 300,
      easing: 'ease-out',
    },
    fadeOut: {
      duration: 200,
      easing: 'ease-in',
    },
    
    // Scale
    scaleIn: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    scaleOut: {
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Slide
    slideUp: {
      duration: 400,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    slideDown: {
      duration: 400,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Press feedback
    press: {
      duration: 80,
      easing: 'ease-out',
    },
    
    // Bounce
    bounce: {
      duration: 600,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;

// ============================================================================
// INTERACTION SYSTEM
// ============================================================================
export const interactions = {
  // Press scale values
  pressScale: {
    sm: 0.96,
    md: 0.95,
    lg: 0.94,
  },
  
  // Opacity values
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    active: 0.7,
    focus: 0.9,
  },
  
  // Haptic feedback intensities
  haptics: {
    light: 'Light',
    medium: 'Medium',
    heavy: 'Heavy',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
  },
} as const;

// ============================================================================
// LAYOUT SYSTEM
// ============================================================================
export const layout = {
  // Container sizes
  container: {
    xs: 320,
    sm: 375,
    md: 414,
    lg: 768,
    xl: 1024,
  },
  
  // Safe area insets (iOS)
  safeArea: {
    top: 44,
    bottom: 34,
    side: 16,
  },
  
  // Tab bar height
  tabBar: 56,
  
  // Header height
  header: 56,
  
  // Bottom sheet insets
  bottomSheet: {
    peek: 120,
    expanded: 0.9,
  },
} as const;

// ============================================================================
// Z-INDEX SYSTEM
// ============================================================================
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  notification: 700,
  debug: 9999,
} as const;

// ============================================================================
// COLOR PALETTE (Extended)
// ============================================================================
export const colors = {
  // Primary
  primary: '#CCFF00',
  primaryLight: '#E6FF66',
  primaryDark: '#99CC00',
  
  // Backgrounds
  background: '#0A0E27',
  surface: '#1A1F3A',
  surfaceLight: '#252D4A',
  
  // Text
  foreground: '#FFFFFF',
  foregroundSecondary: '#E0E0E0',
  muted: '#A0A0A0',
  mutedLight: '#C0C0C0',
  
  // Borders
  border: '#2A3050',
  borderLight: '#3A4060',
  
  // Status
  success: '#00FF00',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#00B0FF',
  
  // Semantic
  glass: 'rgba(26, 31, 58, 0.7)',
  glassLight: 'rgba(26, 31, 58, 0.5)',
  overlay: 'rgba(10, 14, 39, 0.8)',
  overlayLight: 'rgba(10, 14, 39, 0.6)',
  
  // Transparent
  transparent: 'transparent',
} as const;

// ============================================================================
// GRADIENT SYSTEM
// ============================================================================
export const gradients = {
  // Neon green glow
  glowGreen: {
    colors: ['rgba(204, 255, 0, 0.2)', 'rgba(204, 255, 0, 0)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Dark to transparent
  darkFade: {
    colors: ['rgba(10, 14, 39, 1)', 'rgba(10, 14, 39, 0)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  
  // Premium card background
  cardGradient: {
    colors: ['rgba(26, 31, 58, 0.8)', 'rgba(26, 31, 58, 0.6)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get text style by name
 */
export function getTextStyle(name: keyof typeof typography.styles) {
  return typography.styles[name];
}

/**
 * Get shadow by name
 */
export function getShadow(name: keyof typeof shadows) {
  return shadows[name];
}

/**
 * Get animation by name
 */
export function getAnimation(name: keyof typeof animations.transitions) {
  return animations.transitions[name];
}

/**
 * Calculate responsive spacing
 */
export function getResponsiveSpacing(base: number, scale: number = 1) {
  return base * scale;
}

/**
 * Create press feedback style
 */
export function getPressStyle(scale: keyof typeof interactions.pressScale = 'md') {
  return {
    transform: [{ scale: interactions.pressScale[scale] }],
  };
}

/**
 * Create opacity style
 */
export function getOpacityStyle(state: keyof typeof interactions.opacity) {
  return {
    opacity: interactions.opacity[state],
  };
}
