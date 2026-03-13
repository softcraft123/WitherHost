# Firestore Database Setup Guide

This document describes how to set up your Firestore database for the WitherHost application.

## Collections and Schema

### 1. Users Collection (`users/{uid}`)

Stores user profile information.

```json
{
  "username": "string",
  "email": "string",
  "servers": ["server_id_1", "server_id_2"],
  "createdAt": "timestamp",
  "avatar": "string (optional URL)"
}
```

### 2. Servers Collection (`servers/{serverId}`)

Stores Minecraft server configuration and status.

```json
{
  "name": "string",
  "region": "string (EUROPE|AMERICA|ASIA|LOCAL)",
  "status": "string (online|offline)",
  "players": "number",
  "maxPlayers": "number",
  "version": "string",
  "uptime": "number (percentage)",
  "ownerId": "string (user UID)",
  "createdAt": "timestamp",
  "logs": ["log_id_1", "log_id_2"],
  "files": ["file_id_1"],
  "deleted": "boolean (optional)",
  "deletedAt": "timestamp (optional)"
}
```

### 3. Logs Subcollection (`servers/{serverId}/logs/{logId}`)

Stores server console logs.

```json
{
  "message": "string",
  "level": "string (info|warn|error)",
  "timestamp": "timestamp"
}
```

### 4. Files Subcollection (`servers/{serverId}/files/{fileId}`)

Stores references to server files in Cloud Storage.

```json
{
  "name": "string",
  "path": "string",
  "size": "number",
  "uploadedAt": "timestamp",
  "url": "string (Cloud Storage URL)"
}
```

### 5. Announcements Collection (`announcements/{announcementId}`)

Stores system-wide announcements.

```json
{
  "title": "string",
  "message": "string",
  "type": "string (info|warning|success)",
  "createdAt": "timestamp",
  "expiresAt": "timestamp (optional)"
}
```

## Firestore Rules

Add these security rules to your Firestore to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Anyone can read servers (but only owners can modify)
    match /servers/{serverId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;

      // Logs can be read by server owner only
      match /logs/{logId} {
        allow read: if request.auth.uid == get(/databases/$(database)/documents/servers/$(serverId)).data.ownerId;
        allow write: if false; // Only backend can write logs
      }

      // Files can be read by server owner only
      match /files/{fileId} {
        allow read: if request.auth.uid == get(/databases/$(database)/documents/servers/$(serverId)).data.ownerId;
        allow write: if false; // Only backend can write files
      }
    }

    // Announcements are read-only for users
    match /announcements/{announcementId} {
      allow read: if request.auth != null;
      allow write: if false; // Only backend can write announcements
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Initial Data Setup

### Create a Sample User

1. Go to Firebase Console > Authentication
2. Create a test user with email and password
3. The app will automatically create a user document in Firestore

### Create Test Servers

You can use the app's UI to create test servers, or manually add them to Firestore:

```javascript
// Add this via Firebase Console or script
db.collection('servers').add({
  name: 'Test Server 1',
  region: 'EUROPE',
  status: 'online',
  players: 5,
  maxPlayers: 20,
  version: 'latest',
  uptime: 99.5,
  ownerId: 'user_uid_here',
  createdAt: new Date()
});
```

## Indexes

For better query performance, create these composite indexes:

1. **Collection: servers**
   - Fields: `ownerId` (Ascending), `createdAt` (Descending)

2. **Collection: announcements**
   - Fields: `createdAt` (Descending)

Firestore will suggest these automatically when you run queries.

## Cloud Storage Setup

For file uploads and downloads:

1. Create a bucket at Firebase Console > Storage
2. Use the default bucket path
3. Upload server files and store their URLs in the `files` subcollection

## Sample Data Script

You can use this Firebase Admin SDK script to populate sample data:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedData() {
  const userId = 'test_user_id';
  
  // Create user
  await db.collection('users').doc(userId).set({
    username: 'TestPlayer',
    email: 'test@example.com',
    servers: [],
    createdAt: admin.firestore.Timestamp.now()
  });

  // Create servers
  const servers = [
    {
      name: 'Creative World',
      region: 'EUROPE',
      status: 'online',
      players: 3,
      maxPlayers: 20,
      version: '1.20'
    },
    {
      name: 'Survival Server',
      region: 'AMERICA',
      status: 'offline',
      players: 0,
      maxPlayers: 50,
      version: 'latest'
    }
  ];

  let serverIds = [];
  for (const server of servers) {
    const doc = await db.collection('servers').add({
      ...server,
      ownerId: userId,
      uptime: 98.5,
      createdAt: admin.firestore.Timestamp.now()
    });
    serverIds.push(doc.id);
  }

  // Update user's servers array
  await db.collection('users').doc(userId).update({
    servers: serverIds
  });

  console.log('Sample data created successfully!');
}

seedData().catch(console.error);
```

## Monitoring

Use Firebase Console to:
- Monitor real-time data changes
- Check Firestore read/write operations
- Review security rule violations
- Set up alerts for high usage

## Backup

Enable daily backups:
1. Go to Firebase Console > Firestore > Backups
2. Create scheduled backups
3. Set retention period (7-365 days)
