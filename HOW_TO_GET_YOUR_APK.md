# How to Get Your WitherHost APK

Your app is ready! Follow these simple steps to get your APK file.

---

## Step 1: Create a GitHub Account (free)
Go to https://github.com and sign up for a free account.

---

## Step 2: Create a New Repository
1. Click the **+** button (top right) → **New repository**
2. Name it: `witherhost`
3. Select **Private** (keeps your code safe)
4. Click **Create repository**

---

## Step 3: Upload Your Code to GitHub

Open a terminal (Command Prompt on Windows, Terminal on Mac/Linux):

```bash
cd path/to/minecraft-hosting

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/witherhost.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 4: Wait for APK to Build (automatic!)

1. Go to your GitHub repository
2. Click the **Actions** tab at the top
3. You will see **Build WitherHost APK** running
4. Wait about 10-15 minutes for it to finish

---

## Step 5: Download Your APK

1. Click on the completed build (green checkmark ✓)
2. Scroll to the bottom of the page
3. Under **Artifacts**, click **WitherHost-APK**
4. A ZIP file downloads — open it
5. Inside is your **app-debug.apk** file!

---

## Step 6: Install on Your Android Phone

1. Copy the APK file to your Android phone
2. On your phone: **Settings → Security → Unknown Sources → Enable**
3. Open the APK file on your phone
4. Tap **Install**
5. Your WitherHost app is installed! 🎉

---

## Every Future Update

Whenever you make changes to your app, just push to GitHub:
```bash
git add .
git commit -m "Update"
git push
```
GitHub will automatically build a new APK for you!

---

## App Details
- **App Name**: WitherHost
- **App ID**: com.armmc.app
- **Firebase Project**: witherhost-4145c
- **Type**: Minecraft Server Hosting App
- **Framework**: Next.js + Capacitor (Android wrapper)
