#!/bin/bash

# Prebuild script for NutriVibe AI
# This script handles the prebuild process with automatic dependency installation

set -e

echo "🔨 Starting NutriVibe AI prebuild..."

# Install dependencies if needed
echo "📦 Installing dependencies..."
pnpm install

# Run prebuild with --no-install flag to prevent interactive prompts
echo "🏗️  Running Expo prebuild..."
npx expo prebuild --clean --no-install

echo "✅ Prebuild completed successfully!"
