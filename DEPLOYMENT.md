# Deployment Guide - WitherHost

This guide covers deploying your WitherHost Minecraft hosting platform to production.

## Prerequisites

- GitHub account and repository
- Vercel account
- Firebase project with Firestore setup
- Domain name (optional)

## Step 1: Prepare Your Code

1. Ensure all code is committed to GitHub:
```bash
git add .
git commit -m "Initial WitherHost setup"
git push origin main
```

2. Create `.env.local` in your local environment (never commit this):
```bash
cp .env.local.example .env.local
# Update with your Firebase credentials
```

## Step 2: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Select your repository and click "Import"
5. Configure project settings:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add Environment Variables:
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID
7. Click "Deploy"

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy project
vercel

# For production
vercel --prod
```

## Step 3: Configure Firebase

### Enable Authentication Methods

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable "Email/Password"
3. Add authorized domains:
   - your-domain.vercel.app
   - your-custom-domain.com (if applicable)

### Set Up Firestore Security Rules

1. Go to Firebase Console > Firestore > Rules
2. Replace the default rules with the ones from `FIRESTORE_SETUP.md`
3. Publish the rules

### Configure Cloud Storage (Optional)

1. Go to Firebase Console > Storage
2. Set up security rules for file uploads
3. Test with sample files

## Step 4: Test Deployment

1. Visit your Vercel deployment URL
2. Test user registration:
   - Create a new account
   - Verify email is created in Firebase Authentication
   - Check user document in Firestore
3. Test server creation:
   - Create a test server
   - Verify it appears in Firestore
4. Test real-time updates:
   - Open the app in two browsers
   - Change server status in one
   - Verify it updates in the other

## Step 5: Connect Custom Domain (Optional)

1. In Vercel Project Settings > Domains
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Update Firebase authorized domains

## Step 6: Monitor Performance

### Vercel Analytics

1. In Vercel Dashboard > Project > Analytics
2. Monitor Web Vitals:
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

### Firebase Console

1. Monitor Firestore read/write operations
2. Check Authentication metrics
3. Review error logs

## Step 7: Set Up CI/CD

Vercel automatically deploys on every push to main. To customize:

1. Go to Project Settings > Git
2. Configure production branch
3. Set up preview deployments

## Rollback Procedure

If you need to rollback to a previous version:

1. In Vercel Dashboard > Deployments
2. Find the deployment you want to rollback to
3. Click the three dots > "Promote to Production"

## Security Considerations

- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up strong Firestore rules
- [ ] Enable Firebase Authentication email verification
- [ ] Add reCAPTCHA to registration (optional)
- [ ] Set up Firebase App Check (optional)
- [ ] Regular security audits
- [ ] Monitor unusual activities

## Performance Optimization

### Image Optimization

The app currently uses text icons. For future images:
```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
/>
```

### Code Splitting

Next.js automatically handles code splitting. Monitor bundle size:
```bash
npm run build
# Check .next/static/chunks/
```

### Caching Strategy

1. Static pages cache for 1 year
2. Dynamic pages cache for 60 seconds
3. API routes cache based on data freshness

## Environment Variables

### Production Variables

All these variables are marked as `NEXT_PUBLIC_`, meaning they're safe to expose in the browser (no secrets):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Troubleshooting Deployment

### Issue: "Firebase not initialized"

**Solution:** Ensure all `NEXT_PUBLIC_FIREBASE_*` environment variables are set in Vercel dashboard.

### Issue: "Firestore permission denied"

**Solution:** Check Firebase security rules and ensure they're published.

### Issue: "Slow page loads"

**Solution:**
1. Check Vercel Analytics for bottlenecks
2. Review Firestore query efficiency
3. Enable Vercel Edge Cache

### Issue: "Users can't register"

**Solution:**
1. Check Firebase Authentication settings
2. Verify authorized domains include your Vercel URL
3. Check browser console for errors

## Monitoring and Alerts

### Set Up Email Alerts

1. Vercel Dashboard > Monitoring
2. Enable deployment notifications
3. Set up performance alerts

### Firebase Alerts

1. Firebase Console > Alerts
2. Create alert policies for:
   - High error rates
   - Quota exceedance
   - Unusual read patterns

## Maintenance

### Weekly

- Check deployment status
- Review error logs
- Monitor Firebase quota usage

### Monthly

- Review security rules
- Update dependencies: `npm update`
- Check performance metrics

### Quarterly

- Security audit
- Performance optimization
- Plan feature releases

## Advanced Deployment Options

### Multi-Region Deployment

Consider using Vercel's global edge network, which automatically handles this.

### Blue-Green Deployment

Use Vercel deployments:
1. Deploy to staging first
2. Test thoroughly
3. Promote to production

### Canary Releases

Use Vercel analytics to roll out features to a percentage of users.

## Cost Optimization

- **Vercel**: Free tier supports ~1M serverless function invocations/month
- **Firebase**: Free tier includes 1GB storage and 50K reads/day
- **Monitoring**: Use free tiers before upgrading

## Support

- Vercel Support: https://vercel.com/support
- Firebase Support: https://firebase.google.com/support
- GitHub Issues: Create issues in your repository
