# Quick APK Build Guide

## TL;DR - Build Your APK in 5 Minutes

### Prerequisites
- Node.js installed
- Android SDK installed
- JDK 11+ installed

### Build Steps

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Build and Sync
```bash
npm run build:android
```

Or for release (signed APK):
```bash
npm run build:apk
```

#### 3. APK Location
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/bundle/release/app-release.aab`

#### 4. Install on Device
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Common Tasks

### Update Your Firebase Config
```bash
# Copy your google-services.json to:
cp google-services.json android/app/

# OR edit .env.android with your Firebase credentials
```

### Create Keystore for Release Signing
```bash
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias release
```

### Sign Your Release APK
Set environment variables:
```bash
export KEY_ALIAS=release
export KEY_PASSWORD=your_password
export STORE_FILE=./release.keystore
export STORE_PASSWORD=your_keystore_password
```

Then build:
```bash
npm run build:apk
```

### Test on Emulator
```bash
# Open Android Studio and start an emulator
# Then run:
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Or directly from command line:
emulator -avd YourEmulatorName &
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Clean Build (If Build Fails)
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

---

## File Locations

```
project/
├── android/              # Android project root
│   ├── app/
│   │   ├── build.gradle  # App config & dependencies
│   │   └── src/
│   │       └── main/
│   │           ├── AndroidManifest.xml  # App permissions
│   │           └── res/                  # Icons, strings, styles
│   ├── build.gradle      # Root build config
│   └── gradle/           # Gradle wrapper
├── src/                  # React/Next.js source
├── capacitor.config.ts   # Capacitor config
└── next.config.js        # Next.js config
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **Android SDK not found** | Set `ANDROID_SDK_ROOT` env var to SDK path |
| **Gradle build fails** | Run `cd android && ./gradlew clean` |
| **Firebase not initializing** | Copy `google-services.json` to `android/app/` |
| **App crashes on load** | Check Firebase config and internet connection |
| **APK too large** | Enable ProGuard in release build |
| **ADB not found** | Add Android SDK `platform-tools` to PATH |

---

## Next Steps

- Detailed setup: See `ANDROID_SETUP.md`
- Deployment: See `ANDROID_DEPLOYMENT.md`
- Project structure: See `README.md`
- Firebase setup: See `FIRESTORE_SETUP.md`

---

## Need Help?

- Check logs: `adb logcat`
- Clean install: Remove `node_modules` and `android/.gradle`, reinstall
- Firebase issues: Check Firebase Console for errors
- Build errors: Run with verbose: `./gradlew assembleDebug --info`
