# How to Run the Entire Application - Step by Step Guide

## 📍 Where Everything Is Located

```
Project Root: c:\Users\masth\Downloads\internal\experiment-backend
```

---

## 🚀 QUICK START (5 Minutes)

### Step 1: Open Terminal/PowerShell

```powershell
# Navigate to project
cd c:\Users\masth\Downloads\internal\experiment-backend

# Verify you're in right place
ls  # Should see: src/, tests/, kubernetes/, postman/, docker-compose.yml, etc.
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all Node.js packages needed (Express, MongoDB driver, testing tools, etc.)

**Expected Output:**
```
added X packages
audited X packages in X seconds
```

### Step 3: Start Services with Docker

```bash
docker-compose up -d
```

This starts two services in the background:
- **MongoDB** (database on port 27017)
- **Redis** or other dependencies

**Expected Output:**
```
Creating experiment-mongodb ... done
Starting services...
```

**Verify services are running:**
```bash
docker-compose ps
```

Should show 1-2 containers as "running".

### Step 4: Start Development Server

```bash
npm run dev
```

This starts the Node.js application with auto-reload (nodemon).

**Expected Output:**
```
✓ Server running on http://localhost:3000
✓ Environment: development
✓ Database: mongodb://mongodb:27017/experiment-db
```

**The application is now RUNNING!** ✅

---

## 🌐 Open & Test the Application

### Option 1: Browser (Test Health Check)

1. **Open your browser**
2. **Visit**: `http://localhost:3000/api/health/health`
3. **You should see**:
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

### Option 2: Postman (Full API Testing) ⭐ RECOMMENDED

1. **Download Postman** (if not installed): https://www.postman.com/downloads/
2. **Open Postman**
3. **Import Collection**:
   - Click: **File → Import**
   - Select: `c:\Users\masth\Downloads\internal\experiment-backend\postman\collection.json`
   - Click: **Import**

4. **Select Environment**:
   - Top right, select environment dropdown
   - Import: `postman\environment-local.json`
   - Select it

5. **Test Endpoints**:
   - Click "Health Check" → **Send** (should return 200 OK)
   - Click "Create Experiment" → **Send** (should create new experiment)
   - Click "Get All Experiments" → **Send** (should list experiments)
   - Try other endpoints!

### Option 3: Terminal/PowerShell (curl testing)

```bash
# Health check
curl http://localhost:3000/api/health/health

# Get all experiments
curl http://localhost:3000/api/v1/experiments

# Create an experiment
curl -X POST http://localhost:3000/api/v1/experiments `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Test Experiment",
    "description": "Testing the API",
    "category": "research",
    "startDate": "2024-01-01T00:00:00Z",
    "researcher": "John Doe"
  }'
```

---

## 🧪 Run Tests

### In a NEW Terminal (keep dev server running in first terminal):

```bash
npm test
```

This runs all 40+ test cases.

**Expected Output:**
```
PASS  tests/experiment.test.js
  Experiment API
    ✓ Create Experiment
    ✓ Get All Experiments
    ✓ Filter by Status
    ...
Tests: X passed, X failed
```

---

## 📊 Seed Database (Optional - Add Sample Data)

### In a NEW Terminal:

```bash
npm run seed
```

This adds 5 sample experiments to the database.

**Expected Output:**
```
Connected to MongoDB
Cleared existing experiments
✓ Created 5 experiments

Experiment Statistics:
  planned: 1
  ongoing: 1
  completed: 3
✓ Database seeding complete
```

Then test the API again - you'll see the sample data!

---

## 🐳 Docker Information

### View Running Containers

```bash
docker-compose ps
```

### View Logs

```bash
# API logs
docker-compose logs -f api

# MongoDB logs
docker-compose logs -f mongodb

# All logs
docker-compose logs -f
```

### Stop Everything

```bash
docker-compose down
```

---

## 📋 Terminal Windows Setup (Recommended)

Keep multiple terminals open for better workflow:

### Terminal 1: Development Server
```bash
npm run dev
# Keeps running, shows all API requests
```

### Terminal 2: Tests
```bash
npm test -- --watch
# Runs tests in watch mode, reruns on file changes
```

### Terminal 3: Git/Admin
```bash
# For git commands, building, etc.
git status
npm run build
```

---

## 🔍 What Each Command Does

| Command | Purpose | Terminal |
|---------|---------|----------|
| `npm install` | Install dependencies | Once at start |
| `docker-compose up -d` | Start MongoDB & services | Once at start |
| `npm run dev` | Start API server (auto-reload) | Terminal 1 (keep running) |
| `npm test` | Run all 40+ tests | Terminal 2 (or separate) |
| `npm run seed` | Add sample data to DB | Terminal 3 (run once) |
| `npm run lint` | Check code style | Terminal 3 (whenever) |
| `docker-compose logs -f api` | View API logs | Terminal 3 (when debugging) |
| `docker-compose down` | Stop all services | When done |

---

## 🎯 Full Workflow Example

### First Time Setup:

```powershell
# Terminal 1
cd c:\Users\masth\Downloads\internal\experiment-backend
npm install
docker-compose up -d
npm run dev
# Now: Server running on port 3000 ✅

# Terminal 2
npm run seed
# Now: Database populated with sample data ✅

# Terminal 3
npm test
# Now: All tests run ✅

# Open Postman
# Import collection and test endpoints ✅
```

### Daily Development:

```powershell
# Terminal 1 - Start server (if not already running)
npm run dev

# Terminal 2 - Run tests
npm test -- --watch

# Terminal 3 - Other tasks
# Just develop! Changes auto-reload

# When done:
docker-compose down
```

---

## 🌐 What to Open in Browser

### Health Check (Minimal Test)
```
http://localhost:3000/api/health/health
```

### API Info
```
http://localhost:3000/api/health/info
```

### To Test More Endpoints
**Use Postman** (don't manually type URLs for POST/PUT/DELETE)

---

## 📱 Postman Collection Requests

Once imported, you'll have these ready-to-use requests:

**Health & Info:**
- ✅ Health Check
- ✅ API Info

**CRUD Operations:**
- ✅ Create Experiment
- ✅ Get All Experiments
- ✅ Get Experiment by ID
- ✅ Update Experiment
- ✅ Delete Experiment

**Advanced Queries:**
- ✅ Filter by Status
- ✅ Filter by Category
- ✅ Get Statistics

**Error Testing:**
- ✅ Create with Missing Fields
- ✅ Get Non-existent Experiment
- ✅ Invalid Date Range

Just click **Send** on each one!

---

## ⚡ Troubleshooting

### Issue: "Port 3000 already in use"
```bash
# Find what's using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Kill it
Stop-Process -Id XXXXX -Force

# Or use different port
PORT=3001 npm run dev
```

### Issue: "Cannot connect to MongoDB"
```bash
# Check if containers are running
docker-compose ps

# If not, start them
docker-compose up -d

# Check logs
docker-compose logs mongodb
```

### Issue: Tests failing
```bash
# Make sure DB is running
docker-compose ps

# Clear and reseed
npm run seed

# Run tests again
npm test
```

### Issue: Dependencies missing
```bash
# Reinstall
rm -r node_modules
npm install
```

---

## 🎓 Next Steps After Getting Running

### 1. Explore the Code
- Read: `src/index.js` (main entry point)
- Read: `src/controllers/experimentController.js` (CRUD logic)
- Read: `src/models/Experiment.js` (database schema)

### 2. Make Changes
- Edit a file in `src/`
- Save it
- Server auto-reloads
- Try in Postman

### 3. Commit Changes
```bash
git add .
git commit -m "feat: description of changes"
```

### 4. Review Documentation
- `README.md` - Quick overview
- `API_REFERENCE.md` - API details
- `DEPLOYMENT.md` - Deployment info

---

## 📚 Documentation Quick Links

- **INDEX.md** - Navigation guide
- **README.md** - Project overview  
- **API_REFERENCE.md** - All API endpoints
- **postman/README.md** - Postman usage

---

## ✅ Success Checklist

- [ ] Terminal 1: `npm run dev` is running (shows "Server running on http://localhost:3000")
- [ ] Terminal 2 (optional): `npm test` shows all tests passing
- [ ] Browser: `http://localhost:3000/api/health/health` shows JSON response
- [ ] Postman: Collection imported and at least one request works
- [ ] Database: `npm run seed` successfully populates data

---

## 🎉 You're Ready!

Once you see the server running and Postman working, you have a **fully functional backend application** with:
- ✅ Running Express.js API
- ✅ Connected MongoDB database
- ✅ Working CRUD operations
- ✅ Comprehensive tests
- ✅ API testing in Postman

**Start building! 🚀**

---

## 💡 Pro Tips

1. **Keep terminals organized**: Use Terminal 1 for dev, Terminal 2 for tests/admin
2. **Use Postman variables**: Save frequently used IDs and URLs
3. **Watch logs**: `docker-compose logs -f api` helps debug issues
4. **Git commit often**: `git commit -m "feat/fix: description"` after each change
5. **Check tests before committing**: `npm test` ensures no breaking changes

---

**Need help?** Check the relevant documentation file or look at examples in the `postman/` folder!
