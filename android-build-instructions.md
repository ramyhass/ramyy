# Building Android APK for LEOIPTV

## Option 1: Using Capacitor (Recommended)

Capacitor allows you to wrap your React web app into a native Android app.

### Prerequisites
- Node.js and npm (already installed)
- Android Studio
- Java Development Kit (JDK) 11 or higher

### Steps:

1. **Install Capacitor**
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

2. **Initialize Capacitor**
```bash
npx cap init "LEOIPTV" "com.leoiptv.app"
```

3. **Build your web app**
```bash
npm run build
```

4. **Add Android platform**
```bash
npx cap add android
```

5. **Copy web assets to Android**
```bash
npx cap copy android
```

6. **Open in Android Studio**
```bash
npx cap open android
```

7. **Build APK in Android Studio**
- In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)

### Alternative: Build from command line
```bash
cd android
./gradlew assembleDebug
```

## Option 2: Using Cordova

### Steps:
1. **Install Cordova**
```bash
npm install -g cordova
```

2. **Create Cordova project**
```bash
cordova create leoiptv-mobile com.leoiptv.app LEOIPTV
cd leoiptv-mobile
```

3. **Add Android platform**
```bash
cordova platform add android
```

4. **Copy your built web files to www/ directory**
```bash
# Copy contents of your dist/ folder to www/
```

5. **Build APK**
```bash
cordova build android
```

## Option 3: PWA to APK (Easiest)

Since your app is already a PWA, you can use online tools:

1. **PWA Builder** (Microsoft)
   - Go to https://www.pwabuilder.com/
   - Enter your deployed app URL
   - Generate Android package

2. **Bubblewrap** (Google)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://your-app-url/manifest.json
bubblewrap build
```

## Option 4: Using Tauri (Rust-based)

For a more native approach:

1. **Install Tauri**
```bash
npm install @tauri-apps/cli @tauri-apps/api
```

2. **Initialize Tauri**
```bash
npx tauri init
```

3. **Build for Android**
```bash
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

Would you like me to help you set up any of these options?