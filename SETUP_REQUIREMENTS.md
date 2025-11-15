# ⚠️ SETUP REQUIREMENTS - INSTALL FIRST

## Issue: Node.js Not Installed

Node.js is required to run this application. It's currently missing from your system.

---

## ✅ Solution 1: Download & Install Node.js (Easiest)

### Step 1: Download Node.js
- **Visit**: https://nodejs.org/
- **Click**: "LTS" (Long Term Support) - Version 18 or higher
- **Download**: Windows Installer (.msi)

### Step 2: Run the Installer
- Double-click the `.msi` file
- Click "Next" through all screens
- Accept defaults
- Click "Install"
- Click "Finish"

### Step 3: Restart PowerShell
- **Close** your current PowerShell window completely
- **Open** a NEW PowerShell window

### Step 4: Verify Installation
```powershell
node --version
npm --version
```

Should show:
```
v18.17.1
9.8.1
```

---

## ✅ Solution 2: Use Chocolatey (If you have it installed)

```powershell
# Run PowerShell as Administrator, then:
choco install nodejs
```

After installation, restart PowerShell and verify.

---

## ✅ Solution 3: Use Windows Package Manager

```powershell
# Run PowerShell as Administrator, then:
winget install OpenJS.NodeJS
```

After installation, restart PowerShell and verify.

---

## 🐳 Additional Issue: Docker Image Not Found

After you install Node.js, you'll also need Docker. Here's the solution:

### Option A: Pull MongoDB Image First (Recommended)

```powershell
# Pull the MongoDB image before using docker-compose
docker pull mongo:6.0-alpine
```

This downloads the image so docker-compose can use it.

### Option B: Use Local MongoDB (Without Docker)

If you don't have Docker, install MongoDB locally:

1. **Download MongoDB Community**: https://www.mongodb.com/try/download/community
2. **Install** with defaults
3. **Edit** `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/experiment-db
   ```
4. **Skip** `docker-compose up -d` step

---

## 🔄 COMPLETE SETUP STEPS (After Installing Node.js)

```powershell
# 1. Navigate to project
cd c:\Users\masth\Downloads\internal\experiment-backend

# 2. Install Node dependencies
npm install

# 3. Option A: If you have Docker
docker pull mongo:6.0-alpine
docker-compose up -d

# 3. Option B: If MongoDB is installed locally
# Skip the docker-compose step

# 4. Start the server
npm run dev
```

---

## 🎯 Recommended Order

1. ✅ **Install Node.js first** (from nodejs.org)
2. ✅ **Restart PowerShell**
3. ✅ **Verify**: `node --version`
4. ✅ Then come back and run the app

---

## ❓ Still Having Issues?

### Check Node is in PATH
```powershell
where node
where npm
```

Should show paths like:
```
C:\Program Files\nodejs\node.exe
C:\Program Files\nodejs\npm.cmd
```

### Restart PowerShell (Complete Restart Required)
- Close ALL PowerShell windows
- Open a NEW PowerShell window
- Try again

### Verify npm Cache
```powershell
npm cache clean --force
npm install
```

---

## ✅ Once Node.js is Installed

Return to: **QUICK_RUN_GUIDE.md** and follow the steps again:

```powershell
npm install
docker-compose up -d
npm run dev
```

**The application will then start successfully!**

---

**First Priority**: Install Node.js from https://nodejs.org/ 

Then restart PowerShell and come back! 🚀
