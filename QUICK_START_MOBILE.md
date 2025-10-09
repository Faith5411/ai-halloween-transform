# 📱 Quick Start: Mobile Apps

## 🍎 iOS Setup (If you have a Mac)

### 1. Install iOS Dependencies
```bash
cd "ai-haloween 2"
npm install @capacitor/ios
npx cap add ios
npx cap sync ios
```

### 2. Open in Xcode
```bash
npx cap open ios
```

### 3. Configure in Xcode
- Select "App" target
- General → Identity:
  - Bundle Identifier: `com.jeremycrandall.aihalloween`
  - Display Name: `AI Halloween Transform`
  - Version: `1.0`
- Signing & Capabilities:
  - Select your Apple Developer Team

### 4. Test on Simulator
- Product → Destination → iPhone 15 Pro
- Product → Run (⌘R)

### 5. Submit to App Store
- Sign up: https://developer.apple.com/programs/ ($99/year)
- Follow LAUNCH_PLAN.md iOS section

---

## 🤖 Android Setup

### 1. Install Android Dependencies
```bash
cd "ai-haloween 2"
npm install @capacitor/android
npx cap add android
npx cap sync android
```

### 2. Open in Android Studio
```bash
npx cap open android
```

### 3. Test on Emulator
- In Android Studio: AVD Manager
- Create Virtual Device
- Run app

### 4. Build Release
```bash
cd android
./gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

### 5. Submit to Google Play
- Sign up: https://play.google.com/console/signup ($25 one-time)
- Follow LAUNCH_PLAN.md Android section

---

## ⚡ Quick Commands

### Rebuild & Sync
```bash
npm run build
npx cap sync
```

### Run on iOS
```bash
npx cap run ios
```

### Run on Android
```bash
npx cap run android
```

### Update Capacitor
```bash
npx cap update
```

---

## 📋 What You Need

### For iOS:
- [ ] Mac with Xcode installed
- [ ] Apple Developer Account ($99/year)
- [ ] App icons (1024x1024, etc.)
- [ ] Screenshots for App Store

### For Android:
- [ ] Android Studio installed
- [ ] Google Play Console Account ($25)
- [ ] App icons (512x512, etc.)
- [ ] Screenshots for Play Store

### For Both:
- [ ] Privacy Policy URL
- [ ] App description
- [ ] Support email/website

---

## 🎯 Recommended Order

1. ✅ Deploy web first (Vercel) - Done!
2. 🍎 Build iOS app → Test → Submit
3. 🤖 Build Android app → Test → Submit
4. 📱 Wait for approval (1-7 days)
5. 🎉 Launch!

See LAUNCH_PLAN.md for complete details!
