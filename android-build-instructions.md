# Building Android APK for LEOIPTV

## Option 1: Using Capacitor (Recommended)

Capacitor allows you to wrap your React web app into a native Android app.

### Prerequisites
- Node.js and npm (already installed)
- Android Studio
- Java Development Kit (JDK) 11 or higher

### Steps:

1. **Install Capacitor**
```cmd
npm install @capacitor/core @capacitor/cli @capacitor/android
```

2. **Initialize Capacitor**
```cmd
npx cap init "LEOIPTV" "com.leoiptv.app"
```

3. **Build your web app**
```cmd
npm run build
```

4. **Add Android platform**
```cmd
npx cap add android
```

5. **Copy web assets to Android**
```cmd
npx cap copy android
```

6. **Open in Android Studio**
```cmd
npx cap open android
```

7. **Build APK in Android Studio**
- In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)

### Alternative: Build from command line (Windows)
```cmd
cd android
gradlew.bat assembleDebug
```

## Option 2: Using Cordova

### Steps:
1. **Install Cordova**
```cmd
npm install -g cordova
```

2. **Create Cordova project**
```cmd
cordova create leoiptv-mobile com.leoiptv.app LEOIPTV
cd leoiptv-mobile
```

3. **Add Android platform**
```cmd
cordova platform add android
```

4. **Copy your built web files to www/ directory**
```cmd
rem Copy contents of your dist/ folder to www/
xcopy /E /I dist www
```

5. **Build APK**
```cmd
cordova build android
```

## Option 3: PWA to APK (Easiest)

Since your app is already a PWA, you can use online tools:

1. **PWA Builder** (Microsoft)
   - Go to https://www.pwabuilder.com/
   - Enter your deployed app URL
   - Generate Android package

2. **Bubblewrap** (Google)
```cmd
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://your-app-url/manifest.json
bubblewrap build
```

## Option 4: Using Tauri (Rust-based)

For a more native approach:

1. **Install Tauri**
```cmd
npm install @tauri-apps/cli @tauri-apps/api
```

2. **Initialize Tauri**
```cmd
npx tauri init
```

3. **Build for Android**
```cmd
npx tauri android init
npx tauri android build
```

## Recommended Approach

For your IPTV app, I recommend **Option 1 (Capacitor)** because:
- It maintains your existing React codebase
- Provides native Android features
- Good performance for media apps
- Easy to maintain and update

## Additional Considerations for IPTV Apps

1. **Permissions needed in AndroidManifest.xml:**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
```

2. **Network Security Config** for HTTP streams:
```xml
<application android:networkSecurityConfig="@xml/network_security_config">
```

3. **Hardware acceleration** for video playback:
```xml
<application android:hardwareAccelerated="true">
```

## Windows-Specific Setup Instructions

### Setting up Android Development Environment on Windows:

1. **Install Java Development Kit (JDK)**
   - Download JDK 11 or higher from Oracle or OpenJDK
   - Add JAVA_HOME environment variable pointing to JDK installation
   - Add %JAVA_HOME%\bin to your PATH

2. **Install Android Studio**
   - Download from https://developer.android.com/studio
   - During installation, make sure to install:
     - Android SDK
     - Android SDK Platform-Tools
     - Android Virtual Device (AVD)

3. **Set Environment Variables**
   - Add ANDROID_HOME pointing to your Android SDK location (usually C:\Users\%USERNAME%\AppData\Local\Android\Sdk)
   - Add to PATH:
     - %ANDROID_HOME%\platform-tools
     - %ANDROID_HOME%\tools
     - %ANDROID_HOME%\tools\bin

4. **Verify Installation**
```cmd
java -version
adb version
```

### Troubleshooting Common Windows Issues:

1. **Gradle Wrapper Issues**
   - Use `gradlew.bat` instead of `./gradlew` on Windows
   - If permission denied, run: `chmod +x gradlew` in Git Bash

2. **Path Issues**
   - Use forward slashes or double backslashes in paths
   - Avoid spaces in project paths

3. **PowerShell Execution Policy**
   - If scripts are blocked, run PowerShell as Administrator and execute:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

Would you like me to help you set up any of these options?