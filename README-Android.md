# LEOIPTV Android Build Guide for Windows

This guide will help you build the LEOIPTV Android app on Windows using Android Studio.

## Prerequisites

### 1. Install Required Software

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Java Development Kit (JDK 11 or higher)**
   - Download from: https://adoptium.net/
   - Set JAVA_HOME environment variable
   - Verify installation: `java -version`

3. **Android Studio**
   - Download from: https://developer.android.com/studio
   - During installation, make sure to install:
     - Android SDK
     - Android SDK Platform-Tools
     - Android Virtual Device (AVD)

### 2. Environment Variables Setup

Add these environment variables to your Windows system:

1. **JAVA_HOME**
   - Path: `C:\Program Files\Eclipse Adoptium\jdk-11.x.x.x-hotspot` (or your JDK path)

2. **ANDROID_HOME**
   - Path: `C:\Users\%USERNAME%\AppData\Local\Android\Sdk`

3. **Update PATH**
   - Add: `%JAVA_HOME%\bin`
   - Add: `%ANDROID_HOME%\platform-tools`
   - Add: `%ANDROID_HOME%\tools`
   - Add: `%ANDROID_HOME%\tools\bin`

## Quick Setup

Run the automated setup script:

```cmd
setup-android-windows.bat
```

This will:
- Check all prerequisites
- Install Capacitor
- Initialize the Android project
- Set up the development environment

## Manual Build Process

### 1. Install Dependencies

```cmd
npm install
```

### 2. Install Capacitor

```cmd
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 3. Initialize Capacitor (if not done)

```cmd
npx cap init "LEOIPTV" "com.leoiptv.app"
```

### 4. Add Android Platform

```cmd
npx cap add android
```

### 5. Build the Web App

```cmd
npm run build
```

### 6. Copy Assets to Android

```cmd
npx cap copy android
npx cap sync android
```

### 7. Open in Android Studio

```cmd
npx cap open android
```

### 8. Build APK

#### Option A: Using Android Studio
1. In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
2. APK will be generated in: `android/app/build/outputs/apk/debug/`

#### Option B: Using Command Line
```cmd
cd android
gradlew.bat assembleDebug
```

## Automated Build Script

Use the provided batch script for one-click building:

```cmd
build-android.bat
```

This script will:
1. Build the web application
2. Copy assets to Android
3. Sync Capacitor
4. Build the APK
5. Copy APK to root directory

## NPM Scripts

The following npm scripts are available:

```cmd
npm run build-android    # Build web app and sync with Android
npm run android-studio   # Open project in Android Studio
npm run build-debug      # Build debug APK
npm run build-apk        # Build release APK
npm run clean            # Clean Android build
npm run cap-sync         # Sync Capacitor
npm run cap-copy         # Copy web assets
```

## Troubleshooting

### Common Issues on Windows

1. **Gradle Wrapper Permission Issues**
   - Use `gradlew.bat` instead of `./gradlew`
   - If still having issues, run in Git Bash: `chmod +x gradlew`

2. **Path Issues**
   - Avoid spaces in project paths
   - Use forward slashes or double backslashes in paths

3. **PowerShell Execution Policy**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. **Android SDK Not Found**
   - Verify ANDROID_HOME is set correctly
   - Check that SDK tools are in PATH
   - Restart command prompt after setting environment variables

5. **Java Issues**
   - Ensure JAVA_HOME points to JDK (not JRE)
   - Use JDK 11 or higher
   - Restart command prompt after setting JAVA_HOME

### Verification Commands

```cmd
# Check Node.js
node --version

# Check Java
java -version

# Check Android SDK
adb version

# Check Gradle
cd android
gradlew.bat --version
```

## APK Installation

1. **Enable Unknown Sources**
   - Go to Settings → Security → Unknown Sources (Enable)
   - Or Settings → Apps → Special Access → Install Unknown Apps

2. **Transfer APK**
   - Copy `leoiptv-debug.apk` to your Android device
   - Use USB, email, or cloud storage

3. **Install**
   - Tap the APK file on your device
   - Follow installation prompts

## Release Build

For production release:

1. **Generate Signing Key**
   ```cmd
   keytool -genkey -v -keystore leoiptv-release-key.keystore -alias leoiptv -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Signing in Android Studio**
   - Build → Generate Signed Bundle / APK
   - Follow the wizard to create signed APK

3. **Build Release APK**
   ```cmd
   npm run build-apk
   ```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Ensure environment variables are set properly
4. Restart your command prompt/IDE after making changes