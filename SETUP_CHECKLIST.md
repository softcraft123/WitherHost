# Android APK Build - Complete Setup Checklist

## Pre-Build Verification

Use this checklist to ensure everything is configured correctly before building your APK.

### System Requirements
- [ ] Node.js v18+ installed (`node --version`)
- [ ] NPM or Yarn installed (`npm --version`)
- [ ] Java JDK 11+ installed (`java -version`)
- [ ] Android SDK installed
- [ ] ANDROID_SDK_ROOT environment variable set
- [ ] Gradle wrapper available in android/ folder

### Project Setup
- [ ] Project cloned/downloaded
- [ ] `npm install` completed
- [ ] No errors in package installation
- [ ] `node_modules/` folder exists
- [ ] TypeScript types working (no type errors)

---

## Firebase Configuration

### Option A: Using google-services.json

- [ ] Firebase project created
- [ ] google-services.json downloaded from Firebase Console
- [ ] File copied to `android/app/google-services.json`
- [ ] File contains valid JSON (not corrupted)
- [ ] Project ID matches your Firebase project
- [ ] API key matches your project

### Option B: Using Environment Variables

- [ ] `.env.android` created (copy from `.env.android.example`)
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY filled in
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN filled in
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID filled in
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET filled in
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID filled in
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID filled in

### Firebase Project Settings

- [ ] Authentication enabled in Firebase Console
- [ ] Email/Password provider enabled
- [ ] Google Sign-in provider enabled (optional)
- [ ] Firestore Database created
- [ ] Storage bucket created
- [ ] Security Rules configured for your needs
- [ ] Test mode or production rules selected

---

## Android Environment

### Android SDK

- [ ] Android SDK installed (API level 23+ minimum)
- [ ] Android SDK Command-line Tools installed
- [ ] Android SDK Build-tools installed
- [ ] Android Emulator installed (for testing)

### Environment Variables

Add these to your system (persistent):

**macOS/Linux** (add to `~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`):
```bash
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
```

- [ ] ANDROID_SDK_ROOT is set
- [ ] ANDROID_HOME is set (optional but recommended)
- [ ] PATH includes platform-tools
- [ ] Verified with `which adb` (should not be empty)

**Windows** (add to System Environment Variables):
- [ ] ANDROID_SDK_ROOT set to `C:\Users\YourName\AppData\Local\Android\sdk`
- [ ] PATH includes `%ANDROID_SDK_ROOT%\platform-tools`
- [ ] PATH includes `%ANDROID_SDK_ROOT%\cmdline-tools\latest\bin`

### Gradle

- [ ] Gradle wrapper exists in `android/gradlew`
- [ ] Gradle wrapper is executable (`chmod +x android/gradlew`)
- [ ] Gradle can be run (`cd android && ./gradlew --version`)

---

## Project Configuration Files

### Next.js Configuration

- [ ] `next.config.js` has `output: 'export'`
- [ ] `distDir` set to `'out'`
- [ ] `images.unoptimized` set to `true`

### Capacitor Configuration

- [ ] `capacitor.config.ts` exists
- [ ] `appId` is `com.witherhost.minecraft`
- [ ] `webDir` is `out`
- [ ] Plugins configured (SplashScreen, StatusBar)

### Android Configuration

- [ ] `android/build.gradle` exists
- [ ] `android/settings.gradle` exists
- [ ] `android/gradle.properties` exists
- [ ] `android/app/build.gradle` exists
- [ ] `android/app/AndroidManifest.xml` exists

---

## Build Scripts

- [ ] `scripts/build-android.sh` exists and is executable
- [ ] `scripts/build-release.sh` exists and is executable
- [ ] Scripts have proper permissions (`chmod +x scripts/*.sh`)

---

## Release/Signing Setup (For Production Only)

Skip this if building debug APK for testing.

### Keystore Creation

- [ ] Keystore file created: `keytool -genkey -v -keystore release.keystore ...`
- [ ] Keystore file saved in project root
- [ ] Keystore password stored securely
- [ ] Key alias: `release`
- [ ] Key password stored securely

### Signing Configuration

In `.env.android`:
- [ ] KEY_ALIAS set to `release`
- [ ] KEY_PASSWORD set (same as key password from keytool)
- [ ] STORE_FILE set to `./release.keystore`
- [ ] STORE_PASSWORD set (same as keystore password)

Or in environment:
```bash
export KEY_ALIAS=release
export KEY_PASSWORD=YourKeyPassword
export STORE_FILE=./release.keystore
export STORE_PASSWORD=YourKeystorePassword
```

- [ ] Environment variables exported

---

## Testing Environment

### Physical Device (Recommended)

- [ ] Android device with API 23+ available
- [ ] USB cable to connect to computer
- [ ] USB debugging enabled on device
  - Settings → Developer Options → USB Debugging (toggle ON)
- [ ] Developer Options enabled
  - Settings → About Phone → Tap "Build Number" 7 times
- [ ] Device recognized by adb: `adb devices` shows device

### Android Emulator (Alternative)

- [ ] Android Emulator installed
- [ ] Virtual device created in Android Studio
- [ ] Emulator can be launched

---

## Initial Build Test

### Pre-Build Checks

- [ ] All above items checked
- [ ] No uncommitted changes in git (optional but recommended)
- [ ] Internet connection available
- [ ] Sufficient disk space (at least 5GB free)

### Debug Build Command

```bash
npm run build:android
```

- [ ] Build starts without errors
- [ ] Next.js build completes
- [ ] Capacitor sync completes
- [ ] Gradle build completes
- [ ] APK created at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Verify APK File

- [ ] APK file exists
- [ ] APK size is reasonable (30-100 MB)
- [ ] APK is less than 1 day old

---

## Installation & Testing

### Install on Device

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

- [ ] Installation successful (no errors)
- [ ] "Success" message shown by adb

### App Launch Test

- [ ] App icon appears on home screen
- [ ] App launches without crashing
- [ ] Firebase initialization succeeds
- [ ] Login page loads

### Feature Testing

- [ ] Can register new account
- [ ] Can login with existing account
- [ ] Can view dashboard
- [ ] Can create a server
- [ ] Can view server details
- [ ] Real-time updates work (server status, logs)

---

## Troubleshooting Verification

If any step failed:

### Build Failures

- [ ] Run `cd android && ./gradlew clean`
- [ ] Delete `node_modules` and run `npm install`
- [ ] Check Android SDK installation: `$ANDROID_SDK_ROOT/cmdline-tools`
- [ ] Verify Java version: `java -version` (should be 11+)
- [ ] Check gradle.properties for correct SDK versions

### Firebase Issues

- [ ] Verify google-services.json in correct location
- [ ] Check Firebase project ID matches
- [ ] Verify .env.android has all required keys
- [ ] Test Firebase connection in Firebase Console

### ADB/Device Issues

- [ ] Device appears in `adb devices` output
- [ ] USB debugging is enabled
- [ ] Try different USB cable
- [ ] Restart adb: `adb kill-server && adb start-server`

---

## Ready to Build!

Once all items are checked:

### For Debug/Testing
```bash
npm run build:android
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### For Production Release
```bash
npm run build:apk
# Upload android/app/build/outputs/bundle/release/app-release.aab to Play Store
```

---

## Documentation Reference

After setup is complete, refer to:

- **Quick Reference**: `APK_QUICKSTART.md`
- **Detailed Setup**: `ANDROID_SETUP.md`
- **Deployment Guide**: `ANDROID_DEPLOYMENT.md`
- **Complete Documentation**: `APK_BUILD_COMPLETE.md`

---

## Support Resources

If you encounter issues:

1. Check the relevant documentation file above
2. Review Android logs: `adb logcat -s "MyAppTag"`
3. Check Firebase Console for errors
4. Search [GitHub Issues](https://github.com/search)
5. Check [Capacitor Documentation](https://capacitorjs.com/docs/android)

---

**Congratulations!** You're ready to build your Android APK!

**Next command to run:**
```bash
npm run build:android
```
