#!/bin/bash

echo "🚀 Building LEOIPTV Android APK..."

# Step 1: Build the web app
echo "📦 Building web application..."
npm run build

# Step 2: Copy web assets to Android
echo "📱 Copying assets to Android..."
npx cap copy android

# Step 3: Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

# Step 4: Build APK
echo "🔨 Building Android APK..."
cd android
./gradlew assembleDebug

echo "✅ APK built successfully!"
echo "📍 APK location: android/app/build/outputs/apk/debug/app-debug.apk"

# Step 5: Copy APK to root directory for easy access
cp app/build/outputs/apk/debug/app-debug.apk ../leoiptv-debug.apk

echo "📱 APK copied to: leoiptv-debug.apk"
echo ""
echo "🎉 Build complete! You can now install the APK on your Android device."
echo ""
echo "To install:"
echo "1. Enable 'Unknown Sources' in Android Settings"
echo "2. Transfer leoiptv-debug.apk to your device"
echo "3. Tap the APK file to install"