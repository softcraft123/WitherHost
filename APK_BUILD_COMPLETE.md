# Complete Android APK Build System - Documentation

## Overview

Your Minecraft Server Hosting app has been successfully converted from a Next.js web app to a complete Android APK application using Capacitor. This document outlines everything you need to build, test, and deploy your APK.

## What's Been Set Up

### Project Structure
- **Capacitor Framework**: WebView-based Android wrapper
- **Next.js Build**: Static export to `out/` directory
- **Android Project**: Complete Gradle project structure
- **Firebase Integration**: Already configured for authentication and Firestore
- **Build Scripts**: Automated build and deployment scripts

### Files Created

```
Project Structure:
├── capacitor.config.ts           # Capacitor configuration
├── next.config.js                # Next.js static export config
├── package.json                  # Dependencies (with Capacitor packages)
├── android/
│   ├── build.gradle              # Root build configuration
│   ├── settings.gradle           # Gradle project settings
│   ├── gradle.properties         # Gradle properties
│   ├── app/
│   │   ├── build.gradle          # App-level build configuration
│   │   ├── proguard-rules.pro    # Code obfuscation rules
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml           # App manifest
│   │   │   ├── java/.../MainActivity.java   # Main activity
│   │   │   └── res/
│   │   │       ├── values/
│   │   │       │   ├── strings.xml          # App strings
│   │   │       │   ├── colors.xml           # Color definitions
│   │   │       │   └── styles.xml           # Android styles
│   │   │       └── xml/
│   │   │           └── file_paths.xml       # File provider paths
│   └── gradle/                   # Gradle wrapper
├── scripts/
│   ├── build-android.sh          # Debug build script
│   └── build-release.sh          # Release build script
└── Documentation/
    ├── ANDROID_SETUP.md          # Detailed setup guide
    ├── ANDROID_DEPLOYMENT.md     # Deployment & distribution guide
    ├── APK_QUICKSTART.md         # Quick reference
    └── This file
```

## Quick Start (5 minutes)

### 1. Prerequisites Check
```bash
# Check Node.js
node --version  # Should be v18+

# Check Java
java -version   # Should be Java 11+

# Check Android SDK
echo $ANDROID_SDK_ROOT
# OR on Windows:
echo %ANDROID_SDK_ROOT%
```

### 2. Install & Build
```bash
# Install dependencies
npm install

# Build Next.js and Capacitor
npm run build:android

# APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. Test on Device
```bash
# Connect Android device with USB debugging enabled
adb devices

# Install APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Launch app
adb shell am start -n com.witherhost.minecraft/.MainActivity
```

## Build Commands

```bash
# Development & Testing
npm run build:android      # Debug APK for testing
npm run cap:sync           # Sync changes to Android
npm run cap:copy           # Copy web assets to Android

# Production Release
npm run build:apk          # Release signed APK/AAB

# Manual Gradle builds
cd android
./gradlew clean            # Clean build artifacts
./gradlew assembleDebug    # Build debug APK
./gradlew bundleRelease    # Build release AAB for Play Store
```

## Firebase Configuration

The app is pre-configured to use Firebase. You need to:

### Option 1: Use google-services.json
```bash
# Place your google-services.json from Firebase Console
cp your-google-services.json android/app/google-services.json

# Build the app
npm run build:android
```

### Option 2: Use Environment Variables
```bash
# Copy and edit .env.android
cp .env.android.example .env.android

# Add your Firebase credentials
# App will use env vars if google-services.json not found
```

## Release Signing (For Play Store)

### Create Keystore
```bash
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias release

# Fill in the prompts carefully
# Remember this password!
```

### Configure Signing
```bash
export KEY_ALIAS=release
export KEY_PASSWORD=YourKeyPassword
export STORE_FILE=./release.keystore
export STORE_PASSWORD=YourKeystorePassword
```

### Build Release
```bash
npm run build:apk

# Output:
# android/app/build/outputs/bundle/release/app-release.aab
```

## Deployment Paths

### For Testing (Direct APK)
1. Build: `npm run build:android`
2. Install: `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`
3. Test on real device or emulator

### For Beta Testing (Firebase App Distribution)
1. Invite testers in Firebase Console
2. Build: `npm run build:android`
3. Use Firebase tools to distribute

### For Production (Google Play Store)
1. Create Google Play Developer account
2. Create signing keystore
3. Build: `npm run build:apk`
4. Upload AAB to Play Store Console
5. Complete store listing details
6. Submit for review
7. Publish when approved

## App Capabilities

The APK includes:
- Full Minecraft server hosting dashboard
- User authentication (Email/Password, Google Sign-in)
- Real-time server management
- Firestore database integration
- Firebase storage for files
- Responsive mobile UI
- Touch-optimized controls
- Offline-ready design

## Troubleshooting

### Build Issues

**"Android SDK not found"**
```bash
# Set SDK path
export ANDROID_SDK_ROOT=/path/to/android-sdk
export ANDROID_HOME=/path/to/android-sdk
```

**"Gradle build failed"**
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

**"Firebase initialization failed"**
- Ensure google-services.json is in android/app/
- Check Firebase project ID matches
- Verify internet connection

### Runtime Issues

**"App crashes on startup"**
1. Check logs: `adb logcat | grep -i crash`
2. Verify Firebase config
3. Check Internet permission in AndroidManifest.xml
4. Review Firebase Console for errors

**"Login not working"**
1. Check Firebase Auth enabled
2. Verify Firestore Rules allow auth
3. Test with Firebase Console
4. Check app has INTERNET permission

**"Slow performance"**
1. Optimize Firestore queries (add indexes)
2. Enable pagination for lists
3. Reduce image sizes
4. Check Network tab in dev tools

## Configuration Files Reference

### capacitor.config.ts
- App ID: `com.witherhost.minecraft`
- Web directory: `out/` (Next.js static export)
- Plugins: Splash screen, status bar, keyboard

### android/app/build.gradle
- Target SDK: 34 (Android 14)
- Min SDK: 23 (Android 6)
- App signing configuration
- Firebase and Capacitor dependencies

### AndroidManifest.xml
- Permissions: INTERNET, WRITE_EXTERNAL_STORAGE, CAMERA
- MainActivity setup
- Intent filters for deep linking
- Firebase configuration

## Performance Metrics

Typical build times:
- Clean build: 2-5 minutes
- Incremental build: 30-60 seconds
- APK size: ~50-80 MB (debug), ~30-50 MB (release)

## Updates & Maintenance

### Regular Updates
1. Make code changes
2. Update version in `android/app/build.gradle`
3. Run `npm run build:apk`
4. Upload to Play Store

### Critical Hotfixes
1. Fix bug
2. Increment patch version
3. Build and deploy immediately
4. Announce to users

## Resources & Links

- Capacitor Docs: https://capacitorjs.com/docs/android
- Android Studio: https://developer.android.com/studio
- Firebase Console: https://console.firebase.google.com
- Google Play Console: https://play.google.com/console
- Android Development: https://developer.android.com

## Getting Help

1. Check this documentation
2. Review Android logs: `adb logcat`
3. Check Firebase Console for errors
4. Search GitHub issues for similar problems
5. Contact Capacitor community

## Next Steps

1. Read `ANDROID_SETUP.md` for detailed setup
2. Read `ANDROID_DEPLOYMENT.md` for deployment
3. Create keystore for signing
4. Build debug APK and test
5. Build release APK for distribution
6. Deploy to Google Play Store

---

**Your app is ready for Android deployment!**

Start building with: `npm run build:android`
