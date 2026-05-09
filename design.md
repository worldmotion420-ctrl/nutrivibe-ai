# NutriVibe AI - Mobile App Interface Design

## Design Philosophy

**NutriVibe AI** is a futuristic AI-powered nutrition tracking app with a dark theme, neon lime green accents, and glassmorphism UI elements. The app prioritizes one-handed usage and portrait orientation (9:16).

### Visual Theme
- **Color Scheme**: Dark background (#0A0E27), Neon Lime Green (#CCFF00), White text
- **Glassmorphism**: Semi-transparent cards with blur effects
- **Glow Effects**: Neon green circular progress indicators with glow
- **Typography**: Bold, modern sans-serif for headers; clean sans-serif for body text
- **Spacing**: Generous padding with consistent 8px grid system

---

## Screen List (15 Screens)

### Onboarding Flow
1. **Splash Screen** - App logo, branding, loading state
2. **Welcome Screen** - Tagline, feature preview, "Get Started" CTA
3. **Goal Selection** - Choose nutrition goal (Lose Weight, Build Muscle, Maintain, Improve Energy, High Protein, Custom)
4. **Metrics Setup** - Age, Height, Weight, Activity Level input
5. **Permissions Screen** - Camera, Health, Notifications permission requests

### Main App Flow
6. **AI Camera Lens** - Real-time camera feed with circular frame, capture button
7. **AI Processing Screen** - Loading state with animated progress, ingredient detection
8. **Meal Breakdown** - Detected meal with bounding boxes, nutrition breakdown, confidence score
9. **Voice Correction** - Waveform visualization, voice input for meal corrections
10. **Today Dashboard** - Circular calorie progress, macro breakdown, meal list, quick add button
11. **History Timeline** - Meal history with timestamps, daily totals, filters (All/Meals/Snacks)
12. **Insights Screen** - Calorie trend chart, protein consistency gauge, meal quality score
13. **Barcode/OCR Scanner** - Product barcode scanning with green corner markers

### Settings & Premium
14. **Profile Screen** - User info, connected apps, preferences, subscription status
15. **Premium Paywall** - Feature comparison, pricing tiers, upgrade CTA

---

## Screen Details & Functionality

### 1. Splash Screen
- **Content**: Centered NutriVibe AI logo (neon green leaf icon)
- **Tagline**: "Nutrition tracking that thinks for you."
- **Loading**: Animated progress bar or spinner
- **Duration**: 2-3 seconds, then auto-navigate to Welcome or Dashboard (if logged in)

### 2. Welcome Screen
- **Header**: "Track meals in seconds."
- **Subheader**: "Snap food. AI handles the rest."
- **Feature Preview**: Small image carousel showing camera, dashboard, insights
- **Skip Button**: Top-right corner
- **CTA**: "Get Started" button (neon green, full width)
- **Pagination Dots**: Bottom indicator

### 3. Goal Selection
- **Title**: "What's your goal?"
- **Subtitle**: "Choose one to personalize your experience."
- **Goal Cards** (6 options, 2 per row):
  - Lose Weight (icon: downward arrow)
  - Build Muscle (icon: flexed arm)
  - Maintain (icon: balance scale)
  - Improve Energy (icon: lightning bolt)
  - High Protein (icon: protein icon)
  - Custom (icon: gear)
- **CTA**: "Continue" button
- **Pagination**: Bottom dots

### 4. Metrics Setup
- **Title**: "Tell us about you"
- **Subtitle**: "This helps AI personalize your targets."
- **Input Fields** (with dropdown/picker):
  - Age (28 default)
  - Height (175 cm default)
  - Weight (70 kg default)
  - Activity Level (Moderate default)
- **CTA**: "Continue" button
- **Pagination**: Bottom dots

### 5. Permissions Screen
- **Title**: "Enable AI Tracking"
- **Subtitle**: "Allow the following to get better results."
- **Permission Items** (with toggle/checkmark):
  - Camera Access (Allow the app to capture)
  - Health Access (Sync with Apple Health)
  - Notifications (Reminders & insights)
- **CTA**: "All Set" button
- **Pagination**: Bottom dots

### 6. AI Camera Lens
- **Layout**: Full-screen camera feed
- **Circular Frame**: Neon green circular overlay (center focus area)
- **Status**: "Analyzing Ingredients..." text below circle
- **Bottom Controls**:
  - Gallery icon (left)
  - Capture button (center, large white circle)
  - Settings icon (right)
- **Bounding Boxes**: Green boxes appear around detected items (Chicken 92%, Rice 88%, Broccoli 97%)

### 7. AI Processing Screen
- **Layout**: Centered circular loading indicator
- **Status Text**: "Analyzing Ingredients..."
- **Sub-steps** (animated list):
  - Detecting food items
  - Estimating portions
  - Calculating macros
- **Progress**: Circular progress bar with percentage

### 8. Meal Breakdown
- **Meal Image**: Top half with detected items highlighted
- **Circular Nutrition Display** (center):
  - Total calories (650)
  - Macros breakdown (Protein 48g 31%, Carbs 62g 38%, Fat 18g 25%)
- **Confidence Score**: "High (93%)"
- **Detected Items**: List of ingredients with portion estimates
- **Action Buttons**:
  - "Add Sauce" / "More Rice" / "Less Oil" / "Wrong Food?" (quick edits)
  - "Edit" button (bottom-left)
  - "Confirm Meal" button (bottom-right, neon green)

### 9. Voice Correction
- **Title**: "Listening..."
- **Waveform**: Animated green waveform visualization
- **Transcript**: "This is almond milk and sugar free syrup."
- **AI Update**: "Calories adjusted, ingredients updated" (with checkmark)
- **CTA**: "Apply Changes" button

### 10. Today Dashboard
- **Greeting**: "Good Evening, Michael" (with wave emoji)
- **Notification Bell**: Top-right
- **Circular Progress**: Large neon green circle showing calorie intake (1,450 / 2,200 kcal)
- **Macro Breakdown**: Protein 100g, Water 1.6L, Steps 8,432, Fiber 18g
- **AI Insight**: "You're low on protein today. Try adding more to dinner."
- **Today's Meals**: Scrollable list (Breakfast, Lunch, Snack, Dinner)
- **Quick Add Button**: Floating action button (bottom-right, neon green)
- **Tab Bar**: Lens, Today, History, Insights, Profile

### 11. History Timeline
- **Filter Tabs**: All, Meals, Snacks
- **Timeline**: Vertical list of meals by date
  - Breakfast (8:30 AM, 450 kcal)
  - Lunch (1:15 PM, 650 kcal)
  - Snack (4:00 PM, 150 kcal)
  - Dinner (7:45 PM, 520 kcal)
- **Yesterday Section**: Previous day's meals
- **Swipe Actions**: Edit, delete (if available)

### 12. Insights Screen
- **Time Filter**: "This Week" dropdown (top-right)
- **Calorie Trend**: Line chart (Mon-Sun, 2,200 kcal average)
- **Protein Consistency**: Gauge showing "Good" (4/7 days met target)
- **Meal Quality Score**: 7.6/10 with trend line
- **Recommendation**: "Great job! Keep it balanced."

### 13. Barcode/OCR Scanner
- **Title**: "Scan Product"
- **Camera Feed**: Full-screen with green corner markers
- **Product Display** (after scan):
  - Product image
  - Name: "Oats & Honey Granola"
  - Calories: 120 kcal per serving
  - Macros: Protein 3g, Carbs 20g, Fat 2g
- **CTA**: "Add 1 Serving" button (neon green)

### 14. Profile Screen
- **User Info**: Avatar, name, email
- **Menu Items**:
  - Goals (with arrow)
  - Connected Apps (Apple Health, Google Fit)
  - AI Preferences
  - Subscription (Free/Pro status)
  - Settings
  - Help & Support
- **Bottom**: FAQs, Contact Us

### 15. Premium Paywall
- **Title**: "Your AI nutrition system."
- **Subtitle**: "Unlock the complete experience."
- **Feature Comparison**:
  - Free: 3 meals/day, Basic insights
  - Pro: Unlimited meals, Advanced AI, Export reports, Priority support
- **Pricing**: "$9.99/month" or "$79.99/year"
- **CTA**: "Start Free Trial" button (neon green)
- **Fine Print**: "7-day free trial, cancel anytime"

---

## Key User Flows

### Flow 1: Onboarding
1. Splash → Welcome → Goal Selection → Metrics Setup → Permissions → Dashboard

### Flow 2: Scan & Log Meal
1. Dashboard (tap Lens) → Camera Lens → Capture → AI Processing → Meal Breakdown → Confirm → Dashboard

### Flow 3: Voice Correction
1. Meal Breakdown → Voice Correction → Apply Changes → Dashboard

### Flow 4: View History
1. Dashboard (tap History) → History Timeline → Tap meal → Meal Detail → Edit/Delete

### Flow 5: Check Insights
1. Dashboard (tap Insights) → Insights Screen → View trends, recommendations

### Flow 6: Scan Barcode
1. Dashboard (tap Lens) → Barcode Scanner → Scan → Product Detail → Add Serving → Dashboard

---

## Component Hierarchy

- **ScreenContainer**: SafeArea wrapper for all screens
- **GlassmorphCard**: Semi-transparent card with blur
- **CircularProgress**: Neon green circular progress indicator
- **MealCard**: Meal display with image and macros
- **NutritionBreakdown**: Macro breakdown visualization
- **WaveformVisualizer**: Animated waveform for voice
- **TabBar**: Bottom navigation (Lens, Today, History, Insights, Profile)
- **Button**: Primary (neon green), Secondary, Tertiary
- **Input**: Text, Dropdown, Picker

---

## Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Background | #0A0E27 | Screen background |
| Surface | #1A1F3A | Card background |
| Primary (Neon Green) | #CCFF00 | Buttons, progress, accents |
| Text Primary | #FFFFFF | Main text |
| Text Secondary | #A0A0A0 | Secondary text |
| Border | #2A3050 | Dividers, borders |
| Success | #00FF00 | Checkmarks, success states |
| Warning | #FF9500 | Warnings |
| Error | #FF3B30 | Errors |

---

## Responsive Design

- **Portrait Only**: 9:16 aspect ratio
- **Safe Area**: Handles notch, home indicator
- **Touch Targets**: Minimum 44x44pt
- **Text Sizes**: 
  - H1: 32pt
  - H2: 24pt
  - Body: 16pt
  - Small: 12pt

---

## Animation Guidelines

- **Transitions**: 200-300ms ease-in-out
- **Loading States**: Subtle spinner or progress bar
- **Press Feedback**: Scale 0.97 + haptic feedback
- **Waveform**: Continuous animation during voice input
- **Circular Progress**: Smooth arc animation

---

## Accessibility

- **Contrast Ratio**: All text meets WCAG AA standards
- **Touch Targets**: All interactive elements ≥44x44pt
- **Labels**: All inputs have clear labels
- **Haptics**: Feedback for key interactions
- **Dark Mode**: Native support (already dark theme)

