#!/bin/bash

# WitherHost Android Release Build Script
# This script creates a signed release APK

set -e

echo "=================================="
echo "WitherHost Android Release Build"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check environment variables for signing
if [ -z "$KEYSTORE_FILE" ] || [ -z "$KEYSTORE_PASSWORD" ] || [ -z "$KEY_ALIAS" ] || [ -z "$KEY_PASSWORD" ]; then
    echo -e "${RED}Error: Missing signing credentials${NC}"
    echo "Please set the following environment variables:"
    echo "  - KEYSTORE_FILE: Path to your keystore file"
    echo "  - KEYSTORE_PASSWORD: Password for your keystore"
    echo "  - KEY_ALIAS: Alias of your key in the keystore"
    echo "  - KEY_PASSWORD: Password for your key"
    exit 1
fi

echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}Step 2: Building Next.js app for production...${NC}"
npm run build

echo -e "${YELLOW}Step 3: Syncing Capacitor...${NC}"
npx cap sync android

echo -e "${YELLOW}Step 4: Building signed release APK...${NC}"
cd android
./gradlew bundleRelease

echo -e "${GREEN}Release build complete!${NC}"
echo -e "${GREEN}Bundle location: android/app/build/outputs/bundle/release/app-release.aab${NC}"
echo -e "${YELLOW}You can upload this to Google Play Console${NC}"
