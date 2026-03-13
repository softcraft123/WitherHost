# Android APK Deployment Guide

## Quick Start

1. Follow the setup steps in `ANDROID_SETUP.md`
2. Run: `./scripts/build-android.sh` (debug) or `./scripts/build-release.sh` (release)
3. APK is ready to install or distribute

---

## Distribution Methods

### 1. Direct APK Installation (Debug/Testing)

**For your own device:**
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

**Share APK file with others:**
- Transfer the APK file
- On Android device: Settings → Security → Enable "Install from Unknown Sources"
- Tap the APK file to install

### 2. Google Play Store (Recommended for Production)

#### Setup
1. Create Google Play Developer account ($25 one-time)
2. Create new app in Google Play Console
3. Fill app details (name, category, description, screenshots)

#### Upload Steps
1. In Google Play Console, go to "Release" → "Production"
2. Create new release
3. Upload the release AAB file from: `android/app/build/outputs/bundle/release/app-release.aab`
4. Review app details and submit for review
5. After approval, your app goes live

#### Post-Launch
- Monitor user feedback and ratings
- Respond to reviews
- Track crash reports in Firebase Console
- Update regularly with bug fixes and features

### 3. Firebase App Distribution (Testing & Beta)

Firebase App Distribution allows you to share beta versions with testers.

#### Setup
1. In Firebase Console, go to App Distribution
2. Add testers' email addresses
3. Create release

#### Upload Release
```bash
npm install -g firebase-tools
firebase login
firebase appdistribution:distribute android/app/build/outputs/apk/debug/app-debug.apk \
  --app=com.witherhost.minecraft:android \
  --release-notes="Beta build for testing" \
  --testers-file=testers.txt
```

### 4. Microsoft Store / Samsung Galaxy Store

For broader reach, consider:
- **Microsoft Store**: Windows Subsystem for Android devices
- **Samsung Galaxy Store**: Pre-installed on Samsung devices
- **Amazon Appstore**: Large audience with different monetization

## Release Checklist

Before releasing to production:

### Code
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Performance optimized
- [ ] Offline mode working
- [ ] All features tested on real device

### Firebase
- [ ] Firestore security rules configured
- [ ] Authentication working (email + Google)
- [ ] Error logging enabled
- [ ] Analytics tracking implemented

### App Store
- [ ] App icon created (512x512 minimum)
- [ ] Screenshot 1: Home/Login screen
- [ ] Screenshot 2: Main dashboard
- [ ] Screenshot 3: Server creation
- [ ] Screenshot 4: Real-time features
- [ ] Privacy policy written
- [ ] Terms of service written
- [ ] Category selected
- [ ] Content rating completed
- [ ] Price set (free or paid)

### Signing
- [ ] Release keystore created and backed up
- [ ] Signing credentials stored securely
- [ ] Version code incremented
- [ ] Version name updated (e.g., 1.0.0)

### Testing
- [ ] Tested on multiple Android versions (API 23+)
- [ ] Tested on multiple device sizes
- [ ] Network issues handled gracefully
- [ ] Permissions requested properly
- [ ] Storage permissions working

## Version Management

### Versioning Scheme
- **Format**: `MAJOR.MINOR.PATCH`
- **Example**: `1.0.0`

### Version Code (for Play Store)
- Increment by 1 for every release
- Current: 1 (in build.gradle)

### Update Process
1. Update version in `android/app/build.gradle`:
   ```gradle
   versionCode 2
   versionName '1.0.1'
   ```

2. Build release APK

3. Upload to Play Store

4. Test thoroughly before public release

## Monitoring & Analytics

### Firebase Console
- Track user authentication
- Monitor Firestore database usage
- View app crashes and errors
- Check performance metrics

### Google Play Console
- User acquisition sources
- Retention metrics
- Ratings and reviews
- Crash & ANR reports

### Custom Analytics (Optional)
Implement custom analytics:
```javascript
// In your app
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

logEvent(analytics, 'server_created', {
  server_region: 'EUROPE',
  player_count: 20
});
```

## Rollout Strategy

### Phase 1: Closed Testing (Week 1)
- Share APK with 5-10 trusted testers
- Gather feedback
- Fix critical bugs

### Phase 2: Open Beta (Week 2)
- Use Firebase App Distribution
- Distribute to 100+ beta testers
- Monitor crash reports
- Optimize performance

### Phase 3: Limited Release (Week 3)
- Release to 10% of users on Play Store
- Monitor metrics
- Check for unexpected issues

### Phase 4: Full Release (Week 4+)
- Roll out to 100% of users
- Monitor ratings and reviews
- Prepare for feature updates

## Post-Release Support

### Common Issues & Solutions

**App crashes on startup**
- Check Firebase initialization
- Verify internet connection
- Check logs in Firebase Console

**Slow performance**
- Optimize Firestore queries
- Enable pagination for lists
- Use caching where possible

**Firebase quota exceeded**
- Review Firestore read/write rules
- Implement rate limiting
- Upgrade Firebase plan if needed

**Users can't login**
- Check Firebase Auth configuration
- Verify email verification settings
- Check security rules

## Updating Your App

### Regular Updates (Every 2-4 weeks)
```bash
# 1. Develop features
# 2. Test thoroughly
# 3. Increment version
# 4. Build & sign APK
./scripts/build-release.sh

# 5. Upload to Play Store
# 6. Publish when ready
```

### Critical Hotfixes (Within 24 hours)
- Fix critical bugs
- Update version (increment patch)
- Fast-track to production
- Announce update to users

## Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Android Security Best Practices](https://developer.android.com/training/best-practices/security)
- [Capacitor Mobile Deployment](https://capacitorjs.com/docs/android)

## Contacts & Support

- Firebase Support: https://firebase.google.com/support
- Google Play Support: https://support.google.com/googleplay
- Capacitor Community: https://slack.ionicframework.com
