#!/bin/bash

# WitherHost Android Build Script
# This script builds the Android APK from the Next.js web app

set -e

echo "=================================="
echo "WitherHost Android Build Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

# Check if Android SDK is installed
if [ -z "$ANDROID_SDK_ROOT" ] && [ -z "$ANDROID_HOME" ]; then
    echo -e "${RED}Error: Android SDK not found. Please set ANDROID_SDK_ROOT or ANDROID_HOME${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}Step 2: Building Next.js app...${NC}"
npm run build

echo -e "${YELLOW}Step 3: Syncing Capacitor...${NC}"
npx cap sync android

echo -e "${YELLOW}Step 4: Building Android APK...${NC}"
cd android
./gradlew assembleDebug

echo -e "${GREEN}Build complete!${NC}"
echo -e "${GREEN}APK location: android/app/build/outputs/apk/debug/app-debug.apk${NC}"

# Optional: Install on connected device
read -p "Do you want to install the APK on a connected device? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    adb install -r android/app/build/outputs/apk/debug/app-debug.apk
    echo -e "${GREEN}APK installed successfully!${NC}"
fi
