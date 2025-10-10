#!/bin/bash

# AI Halloween Transform - Android Build Script
# This script builds the app and prepares it for Play Store submission

set -e  # Exit on error

echo "🎃 AI Halloween Transform - Android Build Script"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Clean previous builds
print_info "Step 1: Cleaning previous builds..."
rm -rf dist
rm -rf android/app/build
print_success "Clean complete"
echo ""

# Step 2: Build web assets
print_info "Step 2: Building web assets..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Web build complete"
else
    print_error "Web build failed"
    exit 1
fi
echo ""

# Step 3: Sync to Android
print_info "Step 3: Syncing to Android..."
npx cap sync android
if [ $? -eq 0 ]; then
    print_success "Sync to Android complete"
else
    print_error "Sync failed"
    exit 1
fi
echo ""

# Step 4: Ask user what to build
echo "What would you like to build?"
echo "1) AAB (Android App Bundle) - For Play Store"
echo "2) APK (Android Package) - For testing/direct install"
echo "3) Both"
echo "4) Skip build (just sync)"
read -p "Enter choice [1-4]: " choice

cd android

case $choice in
    1)
        print_info "Step 4: Building AAB..."
        ./gradlew bundleRelease
        if [ $? -eq 0 ]; then
            print_success "AAB build complete!"
            echo ""
            print_info "Output location:"
            echo "  app/build/outputs/bundle/release/app-release.aab"
        else
            print_error "AAB build failed"
            exit 1
        fi
        ;;
    2)
        print_info "Step 4: Building APK..."
        ./gradlew assembleRelease
        if [ $? -eq 0 ]; then
            print_success "APK build complete!"
            echo ""
            print_info "Output location:"
            echo "  app/build/outputs/apk/release/app-release.apk"
        else
            print_error "APK build failed"
            exit 1
        fi
        ;;
    3)
        print_info "Step 4: Building both AAB and APK..."
        ./gradlew bundleRelease assembleRelease
        if [ $? -eq 0 ]; then
            print_success "Both builds complete!"
            echo ""
            print_info "Output locations:"
            echo "  AAB: app/build/outputs/bundle/release/app-release.aab"
            echo "  APK: app/build/outputs/apk/release/app-release.apk"
        else
            print_error "Build failed"
            exit 1
        fi
        ;;
    4)
        print_info "Skipping build step"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

cd ..

echo ""
print_success "Build process complete! 🎉"
echo ""
print_info "Next steps:"
echo "  1. Test the APK: adb install android/app/build/outputs/apk/release/app-release.apk"
echo "  2. Or upload AAB to Play Console: https://play.google.com/console"
echo "  3. See ANDROID_LAUNCH.md for complete Play Store submission guide"
echo ""
