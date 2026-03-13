# WitherHost - Minecraft Server Hosting Platform

A modern web application for hosting and managing Minecraft servers with Firebase integration.

## Features

- **User Authentication**: Email/password registration and login
- **Server Management**: Create, delete, and manage multiple Minecraft servers
- **Real-time Updates**: Live server status, player count, and uptime tracking
- **Dashboard**: Overview of all your servers and key metrics
- **Server Console**: View logs and manage server files
- **Profile Management**: Edit your profile and view account details
- **Regional Selection**: Choose from multiple server regions (Europe, America, Asia, Local)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Real-time**: Firebase Realtime listeners for instant updates

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/minecraft-hosting.git
cd minecraft-hosting
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

The Firebase configuration is already included in the project.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase Setup

The app uses Firebase with the following services:

- **Authentication**: User sign-up and login
- **Firestore Database**: Stores users, servers, logs, and files
- **Cloud Storage**: File uploads and downloads

### Database Schema

**Collections:**

- `users/{uid}` - User profile data
  - `username`: string
  - `email`: string
  - `servers`: array of server IDs
  - `createdAt`: timestamp

- `servers/{serverId}` - Server configuration
  - `name`: string
  - `region`: string (EUROPE, AMERICA, ASIA, LOCAL)
  - `status`: string (online, offline)
  - `players`: number
  - `maxPlayers`: number
  - `version`: string
  - `uptime`: number
  - `ownerId`: string (user ID)
  - `createdAt`: timestamp

- `servers/{serverId}/logs` - Server logs
- `servers/{serverId}/files` - Server files

## Usage

### Creating an Account

1. Navigate to `/register`
2. Enter your desired username, email, and password
3. Click "Register"
4. You'll be redirected to the dashboard

### Creating a Server

1. Go to the Servers page
2. Click "New Server"
3. Fill in the server details:
   - Server Name
   - Region
   - Max Players
   - Minecraft Version
4. Click "Create Server"

### Managing Servers

- View all servers on the Servers page
- Click on a server to manage it
- Start/Stop servers with the action buttons
- View logs and file management (coming soon)
- Delete servers permanently

## API Routes

The app uses client-side Firebase calls. No backend API endpoints required.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Hosting

1. Build the project: `npm run build`
2. Start the server: `npm run start`
3. Set environment variables in your hosting platform

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── dashboard/    # Protected dashboard
│   │   ├── servers/      # Server management pages
│   │   ├── profile/      # User profile
│   │   ├── login/        # Login page
│   │   └── register/     # Registration page
│   ├── components/       # Reusable components
│   │   └── auth/         # Authentication forms
│   ├── lib/              # Utilities and configuration
│   │   ├── firebase.ts   # Firebase setup
│   │   └── auth-context.tsx # Auth context provider
│   └── app/
│       ├── layout.tsx    # Root layout
│       ├── page.tsx      # Home page
│       └── globals.css   # Global styles
├── public/               # Static assets
└── package.json          # Dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/minecraft-hosting/issues)
- Email: support@witherhost.com

## Roadmap

- [ ] Payment integration for server plans
- [ ] Advanced server statistics and analytics
- [ ] Automated backups
- [ ] Plugin marketplace
- [ ] Server performance monitoring
- [ ] White-list management
- [ ] Ban list management
- [ ] Custom domain support
- [ ] Mobile app version

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Firebase](https://firebase.google.com/)
