# WitherHost - Quick Start Guide

Welcome to WitherHost! This guide will get you up and running in 5 minutes.

## What's Included

Your complete Minecraft server hosting platform with:

- User authentication (registration, login, profile management)
- Server creation and management
- Real-time server status updates
- Dashboard with analytics
- Firestore integration for data storage
- Responsive dark-themed UI
- Mobile-friendly design

## Quick Setup

### 1. Install Dependencies (1 minute)

```bash
npm install
```

### 2. Set Up Environment Variables (1 minute)

```bash
cp .env.local.example .env.local
```

Your Firebase credentials are already included. No additional setup needed for local development.

### 3. Start Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Time Using the App?

### Create an Account

1. Visit http://localhost:3000
2. Click "Register"
3. Enter a username, email, and password
4. Click "Register"
5. You'll be redirected to the dashboard

### Create a Server

1. Click "Servers" in the navigation
2. Click "New Server"
3. Fill in:
   - Server Name: e.g., "My Awesome Server"
   - Region: Choose EUROPE, AMERICA, ASIA, or LOCAL
   - Max Players: 20 (default)
   - Minecraft Version: Latest (default)
4. Click "Create Server"
5. Your server will appear in the list

### Manage Your Server

1. Click on a server to view details
2. Click "Start" to bring it online
3. View logs and file management tabs
4. Click "Delete" to remove the server

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── dashboard/         # Dashboard (protected)
│   ├── servers/           # Server management
│   └── profile/           # User profile
├── components/
│   ├── auth/              # Auth forms
│   ├── navbar.tsx         # Navigation bar
│   ├── announcements.tsx   # System announcements
│   └── providers.tsx       # App providers
└── lib/
    ├── firebase.ts        # Firebase config
    ├── auth-context.tsx   # Auth state management
    └── use-server-status.ts # Real-time server hook
```

## Key Features Explained

### Authentication
- Email/password registration
- Secure login with Firebase Auth
- Protected dashboard routes
- User profile management

### Server Management
- Create unlimited servers
- Choose from 4 regions
- Configure max players and version
- Real-time status updates
- Start/stop servers
- Delete servers

### Real-Time Updates
- Server status syncs across devices
- Player count updates instantly
- Live uptime tracking
- System announcements push to all users

### Dashboard
- Overview of all your servers
- Quick stats (total servers, active, players)
- Recent activity
- Easy access to all features

## Common Commands

```bash
# Development
npm run dev        # Start dev server
npm run build      # Build for production
npm start          # Run production build

# Deployment
npm run lint       # Check code quality
npm run type-check # TypeScript checking (if added)
```

## Customization

### Change Colors

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#8b5cf6',        // Purple
      'primary-dark': '#7c3aed',
      secondary: '#06b6d4',       // Cyan
      accent: '#10b981',          // Green
      // ... other colors
    },
  },
}
```

### Add Your Logo

1. Replace the brand name in components with your logo
2. Update favicon in `public/` folder
3. Change page title in `src/app/layout.tsx`

### Customize Server Configuration

Edit `src/app/servers/create/page.tsx` to add more server options.

## Firebase Setup

Your Firebase project credentials are already configured. To use your own Firebase project:

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Update credentials in `src/lib/firebase.ts`

## Firestore Collections

The app automatically creates these collections:

- **users/** - User profiles
- **servers/** - Server configurations
- **announcements/** - System announcements

See `FIRESTORE_SETUP.md` for detailed schema.

## Next Steps

### For Development

1. Add payment integration (Stripe)
2. Implement server console/terminal
3. Add file upload/download
4. Create billing page
5. Add email notifications

### For Production

1. Follow `DEPLOYMENT.md` to deploy to Vercel
2. Set up custom domain
3. Configure Firestore backup
4. Monitor Firebase usage
5. Set up error tracking (Sentry)

## Troubleshooting

### "Cannot find module '@/lib/firebase'"

Make sure you're running from the project root directory and dependencies are installed:

```bash
npm install
```

### "Firebase is not initialized"

Check that `.env.local` exists with the correct Firebase credentials.

### "Firestore permission denied"

Make sure you're logged in and the Firestore rules are properly set up in your Firebase console.

### "Localhost not accessible"

If `npm run dev` says something is running on port 3000:

```bash
# Kill the process or use a different port
npm run dev -- -p 3001
```

## Getting Help

### Documentation Files

- `README.md` - Full project documentation
- `FIRESTORE_SETUP.md` - Database schema and setup
- `DEPLOYMENT.md` - Production deployment guide
- `QUICKSTART.md` - This file

### Resources

- Next.js: https://nextjs.org/docs
- Firebase: https://firebase.google.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React: https://react.dev

### Common Issues

**Issue:** App is slow
**Solution:** Check Firestore query performance in Firebase Console

**Issue:** Login not working
**Solution:** Verify Firebase Authentication is enabled with Email/Password

**Issue:** Servers not showing
**Solution:** Make sure user document exists in Firestore with empty servers array

## Performance Tips

1. **Limit Firestore listeners** - Only listen to data you need
2. **Index frequently queried fields** - Firestore will suggest indexes
3. **Use pagination** - Load servers in batches
4. **Cache user data** - Reduce auth state fetches
5. **Optimize images** - Use Next.js Image component

## Security Checklist

- [ ] Enable Firestore security rules (see `FIRESTORE_SETUP.md`)
- [ ] Configure authorized domains in Firebase
- [ ] Use environment variables for sensitive config
- [ ] Enable HTTPS in production
- [ ] Regular security audits
- [ ] Monitor Firebase logs for suspicious activity

## What's Next?

1. **Deploy to Vercel** - Follow `DEPLOYMENT.md`
2. **Add more features** - See "For Development" section
3. **Invite users** - Share your deployment URL
4. **Gather feedback** - Improve based on user needs
5. **Monitor metrics** - Track usage and performance

## Have Fun!

You now have a fully functional Minecraft server hosting platform. Go build something amazing!

If you have questions, check the documentation files or Firebase docs.

Happy hosting!
