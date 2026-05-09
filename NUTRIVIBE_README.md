# NutriVibe AI - Production-Ready Mobile App

A cutting-edge AI-powered nutrition tracking mobile app built with React Native, Expo, TypeScript, and Supabase.

## 🎯 Features

### Core Features
- **AI Meal Recognition**: Snap photos of meals and get instant AI-powered analysis
- **Real-time Food Detection**: Bounding box visualization for detected food items
- **Nutrition Tracking**: Track calories, macros, fiber, and water intake
- **Voice Correction**: Speak corrections to update meal details
- **Barcode Scanning**: Scan product barcodes for instant nutrition info
- **Daily Dashboard**: Beautiful circular progress indicators and macro breakdowns
- **Meal History**: Timeline view of all logged meals
- **AI Insights**: Get personalized nutrition recommendations
- **Premium Subscription**: Unlock advanced features

### UI/UX Features
- **Dark Futuristic Theme**: Modern dark interface with neon green accents
- **Glassmorphism Design**: Frosted glass cards with transparency effects
- **Smooth Animations**: Fluid transitions and interactions
- **Responsive Layouts**: Optimized for all screen sizes
- **App Store Quality**: Production-ready UI/UX

## 🛠 Tech Stack

- **Frontend**: React Native 0.81 + Expo 54
- **Language**: TypeScript 5.9
- **Styling**: NativeWind 4 (Tailwind CSS)
- **Navigation**: Expo Router 6
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: Groq API (food recognition)
- **Speech**: OpenAI Whisper (voice correction)
- **Barcode**: Expo Camera + Vision API

## 📋 Project Structure

```
nutrivibe-ai/
├── app/
│   ├── _layout.tsx              # Root layout with providers
│   ├── splash.tsx               # Splash screen
│   ├── (auth)/                  # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── goal-selection.tsx
│   │   ├── metrics-setup.tsx
│   │   ├── permissions.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (camera)/                # Camera & AI screens
│   │   ├── _layout.tsx
│   │   ├── lens.tsx
│   │   ├── processing.tsx
│   │   ├── meal-breakdown.tsx
│   │   ├── voice-correction.tsx
│   │   └── barcode-scanner.tsx
│   └── (tabs)/                  # Main app screens
│       ├── _layout.tsx
│       ├── index.tsx            # Dashboard
│       ├── history.tsx          # Meal history
│       ├── insights.tsx         # Analytics
│       ├── profile.tsx          # User profile
│       └── premium.tsx          # Premium paywall
├── components/
│   ├── screen-container.tsx     # SafeArea wrapper
│   ├── haptic-tab.tsx           # Tab bar with haptics
│   └── ui/
│       ├── button.tsx           # Button component
│       ├── input.tsx            # Input component
│       ├── glass-card.tsx       # Glassmorphism card
│       ├── circular-progress.tsx # Circular progress
│       └── icon-symbol.tsx      # Icon mapping
├── lib/
│   ├── stores/
│   │   ├── auth-store.ts        # Auth state management
│   │   └── meal-store.ts        # Meal state management
│   ├── api/
│   │   ├── groq-client.ts       # Groq AI client
│   │   └── supabase-client.ts   # Supabase client
│   ├── utils.ts                 # Utility functions
│   └── theme-provider.tsx       # Theme context
├── hooks/
│   ├── use-auth.ts              # Auth hook
│   ├── use-colors.ts            # Theme colors hook
│   └── use-color-scheme.ts      # Dark/light mode hook
├── constants/
│   └── theme.ts                 # Theme configuration
├── assets/
│   └── images/                  # App icons and splash
├── app.config.ts                # Expo configuration
├── tailwind.config.js           # Tailwind configuration
├── theme.config.js              # Theme tokens
├── package.json                 # Dependencies
└── supabase-schema.sql          # Database schema
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Expo CLI
- Supabase account
- Groq API key
- OpenAI API key (for Whisper)

### Installation

1. **Clone the repository**
   ```bash
   cd nutrivibe-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create `.env.local`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON=your_supabase_anon_key
   GROQ_API_KEY=your_groq_api_key
   OPENAI_API_KEY=your_openai_api_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

4. **Set up Supabase**
   - Run the SQL schema from `supabase-schema.sql` in your Supabase dashboard
   - Enable Row Level Security (RLS) on all tables
   - Create storage bucket for meal images

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open in Expo Go**
   - Scan the QR code with Expo Go app
   - Or open in web browser at http://localhost:8081

## 📱 Screens Overview

### Onboarding Flow
1. **Splash** - App logo and branding
2. **Welcome** - Feature introduction
3. **Goal Selection** - Choose nutrition goal
4. **Metrics Setup** - Enter personal metrics
5. **Permissions** - Request camera, health, notifications

### Authentication
- **Sign In** - Email/password login
- **Sign Up** - Create new account

### Main App
- **Dashboard** - Daily nutrition overview with circular progress
- **Camera Lens** - AI-powered meal photo capture
- **AI Processing** - Real-time food detection
- **Meal Breakdown** - Detailed nutrition analysis
- **Voice Correction** - Speak corrections to meals
- **Barcode Scanner** - Scan product barcodes
- **History** - Timeline of logged meals
- **Insights** - Personalized recommendations
- **Profile** - User settings and preferences
- **Premium** - Subscription plans

## 🎨 Design System

### Colors
- **Primary**: `#CCFF00` (Neon Green)
- **Background**: `#000000` (Dark)
- **Surface**: `#1a1a1a` (Dark Gray)
- **Foreground**: `#FFFFFF` (White)
- **Muted**: `#888888` (Gray)

### Components
- **Button**: Primary, secondary, ghost variants
- **Card**: Glassmorphic design with transparency
- **Input**: Text input with validation
- **Progress**: Circular progress indicator
- **Icon**: SF Symbols on iOS, Material Icons on Android

## 🔌 API Integration

### Supabase
- User authentication (email/password)
- PostgreSQL database for meals and nutrition data
- Real-time subscriptions for live updates
- File storage for meal images

### Groq AI
- Food recognition from images
- Nutrition analysis and estimation
- AI-powered insights and recommendations

### OpenAI Whisper
- Speech-to-text for voice corrections
- Audio transcription for meal updates

### Barcode Scanning
- Open Food Facts API integration
- Product lookup by barcode
- Nutrition data extraction

## 📊 Database Schema

### Tables
- `user_profiles` - User account and metrics
- `meals` - Logged meals with nutrition data
- `meal_ingredients` - Individual ingredients per meal
- `daily_nutrition_summary` - Daily aggregated data
- `ai_insights` - Personalized recommendations
- `product_scans` - Barcode scan history
- `subscriptions` - Premium subscription data
- `connected_apps` - Apple Health / Google Fit integration

## 🔐 Security

- Row Level Security (RLS) on all tables
- Secure authentication with Supabase
- API keys stored in environment variables
- HTTPS for all API calls
- Input validation on all forms

## 🧪 Testing

### Run Tests
```bash
pnpm test
```

### Test Coverage
- State management (Zustand stores)
- API integration (Supabase, Groq)
- Component rendering
- User flows

## 📦 Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

### Web
```bash
pnpm build
```

## 🚀 Deployment

1. **Create checkpoint**
   ```bash
   webdev_save_checkpoint
   ```

2. **Click Publish** in the Management UI

3. **Generate APK/IPA** through the build system

4. **Submit to App Stores**
   - Apple App Store
   - Google Play Store

## 📚 Documentation

- `API_INTEGRATION_GUIDE.md` - Detailed API integration instructions
- `supabase-schema.sql` - Database schema
- `app.config.ts` - Expo configuration
- `tailwind.config.js` - Styling configuration

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a checkpoint
5. Submit for review

## 📝 License

Proprietary - NutriVibe AI

## 🆘 Support

For issues or questions:
1. Check the API Integration Guide
2. Review the Supabase documentation
3. Check the Expo documentation
4. Open an issue in the repository

## 🎯 Next Steps

### Phase 1: Complete (Foundation & Setup)
- ✅ Project initialization
- ✅ Theme configuration
- ✅ State management setup
- ✅ UI components

### Phase 2: Complete (Onboarding)
- ✅ All onboarding screens
- ✅ Authentication screens
- ✅ Navigation flow

### Phase 3: In Progress (AI Features)
- ✅ Camera screens
- ✅ Processing screens
- ⏳ Groq AI integration
- ⏳ Image upload to Supabase

### Phase 4: Pending (Backend Integration)
- ⏳ Meal database operations
- ⏳ Daily summary aggregation
- ⏳ Whisper voice correction
- ⏳ Barcode lookup

### Phase 5: Pending (Advanced Features)
- ⏳ Apple Health / Google Fit sync
- ⏳ Push notifications
- ⏳ Premium subscription
- ⏳ Offline caching

## 🎓 Learning Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Guide](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Built with ❤️ using React Native + Expo + TypeScript**
