# 🍎 Mac Testing Guide - VSCode + Docker Desktop

**Complete guide for testing NXT Class on your Mac**

---

## ✅ What You Have

**System:**
- Mac with Docker Desktop installed ✅
- VSCode opened in the project ✅
- Repository checked out ✅

**Structure:**
```
nxtclass/
├── frontend/    # React app
├── backend/     # Spring Boot app
└── docker-compose.yml
```

---

## 🚀 Quick Start (2 Commands)

```bash
# In VSCode terminal (Ctrl + `)
docker-compose up -d
open http://localhost
```

**That's it!** ✅

---

## 📋 Step-by-Step Testing

### Step 1: Open Docker Desktop

1. Open **Docker Desktop** from Applications
2. Wait for whale icon in menu bar to be steady (not animated)
3. Verify: `docker ps` in terminal shows no errors

### Step 2: Open Project in VSCode

```bash
# Open VSCode in project directory
code .

# Or if already open, verify you're in the right place
pwd
# Should show: /Users/yourname/.../nxtclass

# Check structure
ls -la
# Should see: frontend/, backend/, docker-compose.yml
```

### Step 3: Start Services

**Option A: Using VSCode Tasks (Easiest)**

1. Press `Cmd + Shift + P`
2. Type: "Tasks: Run Task"
3. Select: "🚀 Docker: Start All"
4. Wait 5-10 minutes (first time build)

**Option B: Using Terminal**

```bash
# Open terminal in VSCode (Ctrl + ` or View → Terminal)
docker-compose up -d

# Wait for build to complete
# First time: 5-10 minutes
# Subsequent: 30 seconds
```

### Step 4: Check Services

**In VSCode terminal:**
```bash
# Check status
docker-compose ps

# Should show:
# NAME                  STATUS
# nxtclass-frontend     Up
# nxtclass-backend      Up  
# nxtclass-mysql        Up
```

**In Docker Desktop:**
1. Open Docker Desktop app
2. Click "Containers" on left
3. Should see 3 containers running (green)

### Step 5: Test in Browser

**Frontend:**
```bash
# Open in default browser
open http://localhost

# Should show NXT Class login page
```

**Backend:**
```bash
# Test API health
curl http://localhost:8080/actuator/health

# Should return: {"status":"UP"}
```

**API:**
```bash
# Test API endpoint
curl http://localhost/api/student-details/list

# Should return: [] or JSON array
```

### Step 6: Check Logs (If Issues)

**In VSCode:**

Press `Cmd + Shift + P` → "Tasks: Run Task" → "📋 Docker: View Logs"

**Or in terminal:**
```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mysql

# Press Ctrl+C to exit
```

### Step 7: Stop Services

**In VSCode:**

Press `Cmd + Shift + P` → "Tasks: Run Task" → "🛑 Docker: Stop All"

**Or in terminal:**
```bash
docker-compose down
```

---

## 🎯 VSCode Quick Tasks

Press `Cmd + Shift + P` → Type "Tasks: Run Task" → Select:

| Task | Description |
|------|-------------|
| **🚀 Docker: Start All** | Start all services |
| **🛑 Docker: Stop All** | Stop all services |
| **📋 Docker: View Logs** | View all logs |
| **📊 Docker: Check Status** | Check service status |
| **🔄 Docker: Restart Frontend** | Restart frontend only |
| **🔄 Docker: Restart Backend** | Restart backend only |
| **⚛️ Frontend: Install** | Install frontend dependencies |
| **⚛️ Frontend: Dev Server** | Start frontend dev server |
| **☕ Backend: Dev Server** | Start backend dev server |
| **🏥 Health Check** | Run health check script |

---

## 🧪 Testing Scenarios

### Test 1: Basic Functionality

```bash
# 1. Start services
docker-compose up -d

# 2. Wait 2 minutes

# 3. Test each service
curl http://localhost/health              # Frontend
curl http://localhost:8080/actuator/health   # Backend
curl http://localhost/api/student-details/list  # API

# 4. Open in browser
open http://localhost
```

### Test 2: Frontend Development

```bash
# 1. Stop Docker frontend (keep backend running)
docker-compose stop frontend

# 2. Start frontend in dev mode
cd frontend
npm install
npm run dev

# 3. Access dev server
open http://localhost:5173

# 4. Make changes - auto-reloads! ⚡
# Edit: frontend/src/App.tsx
# See changes instantly in browser
```

### Test 3: Backend Development

```bash
# 1. Stop Docker backend (keep MySQL running)
docker-compose stop backend

# 2. Start backend locally
cd backend
mvn spring-boot:run

# 3. Test API
curl http://localhost:8080/actuator/health

# 4. Make changes
# Edit: backend/src/main/java/...
# Restart: Ctrl+C then mvn spring-boot:run
```

### Test 4: Full Stack Testing

```bash
# 1. Start everything with Docker
docker-compose up -d

# 2. Test workflow:
# - Open http://localhost
# - Navigate to Students page
# - Click "Add Student"
# - Fill form
# - Submit
# - Check if API call works

# 3. Monitor in browser DevTools
# - F12 → Network tab
# - See API calls to /api/student-details/save
```

---

## 🐛 Common Issues on Mac

### Issue 1: Docker Desktop Not Running

**Error:** `Cannot connect to Docker daemon`

**Solution:**
```bash
# 1. Open Docker Desktop from Applications
# 2. Wait for whale icon to be steady in menu bar
# 3. Retry: docker ps
```

### Issue 2: Port 80 Already in Use

**Error:** `Port 80 is already allocated`

**Solution:**
```bash
# Check what's using port 80
sudo lsof -i :80

# If Apache is running:
sudo apachectl stop

# Or change port in docker-compose.yml:
# Edit line: "80:80" to "8080:80"
# Then access: http://localhost:8080
```

### Issue 3: MySQL Connection Failed

**Check logs:**
```bash
docker-compose logs mysql

# Wait 30 seconds for MySQL to start
# Then restart backend:
docker-compose restart backend
```

### Issue 4: Frontend Shows 404 for API

**Solution:**
```bash
# Check nginx proxy config
docker-compose logs frontend | grep -i error

# Verify backend is running
docker-compose ps backend

# Restart frontend
docker-compose restart frontend
```

### Issue 5: Build Fails with "No Space Left"

**Solution:**
```bash
# Clean Docker
docker system prune -a -f
docker volume prune -f

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Issue 6: M1/M2 Mac (Apple Silicon) Issues

**If you see platform warnings:**

Update docker-compose.yml to add platform:
```yaml
backend:
  platform: linux/amd64  # For M1/M2 Macs
  build:
    context: ./backend
```

---

## 📊 Verification Commands

### Quick Health Check

```bash
# Run health check script
./health-check.sh

# Or manually:
docker-compose ps
curl http://localhost/health
curl http://localhost:8080/actuator/health
```

### View Logs

```bash
# All services
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f backend
```

### Check Resources

Open **Docker Desktop**:
1. Click container name
2. View "Stats" tab
3. See CPU, Memory usage

---

## 🎯 Development Workflow on Mac

### Morning Routine

```bash
# 1. Open Docker Desktop
# 2. Open VSCode
# 3. Open terminal (Ctrl+`)
# 4. Start services
docker-compose up -d

# 5. Start coding!
```

### Making Changes

**Frontend changes:**
```bash
# 1. Edit: frontend/src/...
# 2. Rebuild: docker-compose build frontend
# 3. Restart: docker-compose up -d frontend
# 4. Test: http://localhost
```

**Backend changes:**
```bash
# 1. Edit: backend/src/...
# 2. Rebuild: docker-compose build backend
# 3. Restart: docker-compose up -d backend
# 4. Test: http://localhost:8080
```

### End of Day

```bash
# Stop services (keeps data)
docker-compose down

# Or keep running (optional)
# Services will restart with Docker Desktop
```

---

## 🔧 VSCode Configuration

### Recommended Extensions

Open VSCode → Extensions (Cmd+Shift+X) → Install:

1. **Docker** (Microsoft) - Container management
2. **ESLint** - JavaScript/TypeScript linting
3. **Prettier** - Code formatting
4. **Tailwind CSS IntelliSense** - CSS suggestions
5. **Java Extension Pack** - Java development
6. **Spring Boot Dashboard** - Spring Boot tools
7. **Thunder Client** - API testing

### Useful VSCode Shortcuts

- `Cmd+Shift+P` - Command Palette (Run Tasks)
- `Ctrl+`` - Toggle Terminal
- `Cmd+B` - Toggle Sidebar
- `Cmd+Shift+E` - Explorer
- `Cmd+Shift+F` - Search in files

---

## 📈 Performance Tips for Mac

### Docker Desktop Settings

1. Open Docker Desktop
2. Settings (gear icon)
3. Resources:
   - **CPUs**: 4+ (recommended)
   - **Memory**: 4GB+ (recommended)
   - **Disk**: 20GB+ (recommended)

### Speed Up Builds

```bash
# Use BuildKit (faster builds)
export DOCKER_BUILDKIT=1

# Build with BuildKit
docker-compose build

# Or add to ~/.zshrc:
echo 'export DOCKER_BUILDKIT=1' >> ~/.zshrc
```

---

## ✅ Testing Checklist

After running `docker-compose up -d`:

- [ ] Docker Desktop shows 3 green containers
- [ ] `docker-compose ps` shows all "Up"
- [ ] Frontend loads: http://localhost
- [ ] Backend health: http://localhost:8080/actuator/health
- [ ] API responds: http://localhost/api/student-details/list
- [ ] No errors in logs: `docker-compose logs`
- [ ] Browser console clean (F12 → Console)

**All checked? You're ready! ✅**

---

## 🎉 Quick Reference

```bash
# Start
docker-compose up -d

# Status
docker-compose ps

# Logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart

# Health check
./health-check.sh

# Clean restart
docker-compose down -v && docker-compose up -d
```

---

## 📞 Need Help?

**Docker Desktop Help:**
- Check whale icon in menu bar is steady
- Open Docker Desktop → Troubleshoot → Clean/Purge data

**VSCode Tasks:**
- `Cmd+Shift+P` → "Tasks: Run Task"
- Select any task from the list

**Logs:**
```bash
docker-compose logs -f
```

---

## 🎯 You're Ready!

**To test right now:**

1. Open Docker Desktop ✅
2. Open terminal in VSCode: `Ctrl + ``
3. Run: `docker-compose up -d`
4. Wait 5-10 minutes (first time)
5. Open: http://localhost

**That's it! Start testing! 🚀**

---

**For detailed testing scenarios, see:** [TESTING_ON_MAC.md](./TESTING_ON_MAC.md)
