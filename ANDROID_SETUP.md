# Android APK Build Guide

## Prerequisites

Before building the APK, ensure you have the following installed:

1. **Node.js** (v18+)
   - Download from https://nodejs.org/

2. **Android SDK**
   - Install Android Studio from https://developer.android.com/studio
   - Or download just the SDK tools

3. **Java Development Kit (JDK)**
   - Java 11 or higher required
   - Download from https://www.oracle.com/java/technologies/downloads/

4. **Gradle**
   - Included with Android Studio
   - Or download standalone from https://gradle.org/releases/

## Environment Setup

### 1. Set Android SDK Path

On **macOS/Linux**:
```bash
export ANDROID_SDK_ROOT=~/Library/Android/sdk
export ANDROID_HOME=~/Library/Android/sdk
```

On **Windows** (Command Prompt):
```cmd
set ANDROID_SDK_ROOT=C:\Users\YourUsername\AppData\Local\Android\sdk
set ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\sdk
```

Or add to your PATH permanently in your system environment variables.

### 2. Configure Firebase

Copy the google-services.json file to the Android app directory:
```bash
cp google-services.json android/app/
```

Or update the `.env.android` file with your Firebase credentials:
```bash
cp .env.android.example .env.android
# Edit .env.android with your Firebase config values
```

## Building the APK

### Debug Build (for testing)

```bash
chmod +x scripts/build-android.sh
./scripts/build-android.sh
```

The debug APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Release Build (for distribution)

#### Step 1: Create a Keystore

First, create a keystore file to sign your release APK:

```bash
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias release
```

You'll be prompted for:
- Keystore password
- Key password
- Your name, organization, etc.

Keep this file safe! You'll need it for updates.

#### Step 2: Configure Signing

Update your `.env.android` file with signing credentials:
```bash
KEY_ALIAS=release
KEY_PASSWORD=your_key_password
STORE_FILE=./release.keystore
STORE_PASSWORD=your_keystore_password
```

#### Step 3: Build Release APK

```bash
chmod +x scripts/build-release.sh
./scripts/build-release.sh
```

The release bundle will be at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Testing the APK

### Install on Connected Device

```bash
adb devices  # List connected devices
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Run on Emulator

1. Open Android Studio
2. Click "AVD Manager"
3. Create or select a virtual device
4. Launch the emulator
5. Run: `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`

## Troubleshooting

### Build Fails with Gradle Error
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Firebase Configuration Not Found
- Ensure `google-services.json` is in `android/app/`
- Or set Firebase credentials in `.env.android`

### ADB Not Found
- Add Android SDK platform-tools to PATH
- macOS/Linux: `export PATH=$PATH:~/Library/Android/sdk/platform-tools`
- Windows: Add `C:\Users\YourUsername\AppData\Local\Android\sdk\platform-tools` to PATH

### Java Version Mismatch
```bash
java -version  # Check current version
# Update JAVA_HOME to point to Java 11+
export JAVA_HOME=/path/to/java11
```

## Uploading to Google Play Store

1. Create a Google Play Developer account (one-time $25 fee)
2. Go to Google Play Console
3. Create a new app
4. Upload the release AAB file
5. Fill in store listing details
6. Submit for review

## App Signing Best Practices

1. **Keep your keystore file safe** - Store it in version control (encrypted) or a secure backup
2. **Remember your passwords** - Write them down securely
3. **Use the same keystore for updates** - Never lose your signing key
4. **Sign all releases** - Every update must be signed with the same key

## Firebase Configuration

The app uses Firestore and Firebase Auth. Ensure your Firebase project has:
- Authentication enabled (Email/Password, Google Sign-in)
- Firestore Database set up
- Storage enabled for file uploads
- Appropriate Security Rules configured

## Performance Optimization

The APK includes:
- ProGuard code obfuscation
- Resource shrinking
- Optimized images (unoptimized by Capacitor to preserve quality)
- Lazy loading for pages

## Additional Resources

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Android Studio Guide](https://developer.android.com/studio/intro)
- [Firebase for Android](https://firebase.google.com/docs/android/setup)
- [Google Play Distribution Guide](https://developer.android.com/studio/publish)
