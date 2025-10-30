# 🍎 Testing on Mac - Complete Guide

**Step-by-step guide to test NXT Class on your Mac with Docker Desktop**

---

## ✅ Prerequisites Check

### 1. Verify Docker Desktop is Running

```bash
# Check Docker is running
docker --version
# Should show: Docker version 24.x.x or higher

docker-compose --version
# Should show: Docker Compose version 2.x.x or higher

# Check Docker Desktop is running
docker ps
# Should show list of containers (or empty if nothing running)
```

**If Docker not found:**
- Open Docker Desktop app from Applications
- Wait for it to start (whale icon in menu bar should be steady)

### 2. Verify VSCode Setup

```bash
# Check you're in the project directory
pwd
# Should show: /Users/yourname/.../nxtclass

# List structure
ls -la
# Should see: frontend/, backend/, docker-compose.yml
```

---

## 🚀 Testing Methods

### Method 1: Docker (Fastest - Recommended) ⭐

This tests the complete production setup.

#### Step 1: Start Services

```bash
# In VSCode terminal (from project root)
docker-compose up -d

# This will:
# - Build frontend image (~2-3 minutes first time)
# - Build backend image (~5-7 minutes first time)
# - Start MySQL database
# - Start all services
```

**Expected output:**
```
[+] Building frontend...
[+] Building backend...
[+] Running 4/4
 ✔ Network nxtclass-network    Created
 ✔ Container nxtclass-mysql     Started
 ✔ Container nxtclass-backend   Started
 ✔ Container nxtclass-frontend  Started
```

#### Step 2: Check Services Are Running

```bash
# Check all containers are up
docker-compose ps

# Should show:
# NAME                  STATUS          PORTS
# nxtclass-frontend     Up              0.0.0.0:80->80/tcp
# nxtclass-backend      Up              0.0.0.0:8080->8080/tcp
# nxtclass-mysql        Up              0.0.0.0:3306->3306/tcp
```

#### Step 3: View Logs

```bash
# View all logs
docker-compose logs -f

# Or view specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mysql

# Press Ctrl+C to exit logs
```

#### Step 4: Test in Browser

Open Safari or Chrome:

1. **Frontend**: http://localhost
   - Should show the NXT Class login page
   - Check for any console errors (F12 → Console)

2. **Backend API**: http://localhost:8080/actuator/health
   - Should show: `{"status":"UP"}`

3. **API through Frontend**: http://localhost/api/student-details/list
   - Should show: `[]` or JSON array

#### Step 5: Stop Services

```bash
# Stop all services
docker-compose down

# Or restart
docker-compose restart

# Or stop specific service
docker-compose stop frontend
```

---

### Method 2: Local Development (For Coding)

Run services locally for faster development with hot reload.

#### Step 1: Setup Backend (Terminal 1)

```bash
# Check Java version
java -version
# Need Java 17 or higher

# If Java not installed:
# brew install openjdk@17

# Start backend
cd backend
mvn clean install
mvn spring-boot:run

# Backend runs on: http://localhost:8080
# Wait for: "Started BackendApplication in X seconds"
```

#### Step 2: Setup Frontend (Terminal 2)

```bash
# In new VSCode terminal
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev

# Frontend runs on: http://localhost:5173
# Open automatically or visit: http://localhost:5173
```

#### Step 3: Configure Frontend to Use Local Backend

```bash
# In frontend folder, create .env file
cd frontend
cat > .env << EOF
VITE_API_URL=http://localhost:8080/api
EOF
```

#### Step 4: Test Development Setup

1. **Frontend**: http://localhost:5173
   - Hot reload enabled (changes reflect immediately)

2. **Backend**: http://localhost:8080/actuator/health
   - Should show healthy status

3. **Make a test change**:
   ```bash
   # Edit frontend file
   code frontend/src/App.tsx
   # Save - page auto-reloads!
   ```

---

### Method 3: Helper Script (Easiest)

Use the included deployment script:

```bash
# Run helper script
./deploy.sh

# Choose option:
# 1) Fresh deployment (build and start)
# 2) Rebuild and restart
# 3) Start existing containers
# 4) Stop containers
# 5) View logs

# Follow prompts
```

---

## 🔍 Verification Checklist

### After Starting Services

Run these commands to verify:

```bash
# 1. Check containers
docker-compose ps
# All should show "Up"

# 2. Check frontend health
curl http://localhost/health
# Should return: healthy

# 3. Check backend health
curl http://localhost:8080/actuator/health
# Should return: {"status":"UP"}

# 4. Check API
curl http://localhost/api/student-details/list
# Should return: [] or JSON array

# 5. Check Docker Desktop
# Open Docker Desktop app
# Go to Containers tab
# Should see: nxtclass-frontend, nxtclass-backend, nxtclass-mysql
```

---

## 🧪 Testing Scenarios

### Scenario 1: Test Frontend Only

```bash
# Start only frontend and backend (no MySQL needed for UI testing)
docker-compose up -d frontend backend

# Access: http://localhost
# Test UI, navigation, components
```

### Scenario 2: Test Backend API

```bash
# Start backend and database
docker-compose up -d backend mysql

# Wait 30 seconds for backend to start

# Test API endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:8080/api/student-details/list
curl http://localhost:8080/api/teacher-details/list
```

### Scenario 3: Test Full Stack

```bash
# Start everything
docker-compose up -d

# Test workflow:
# 1. Open http://localhost
# 2. Navigate to Students page
# 3. Try to add a student
# 4. Check if API is called
# 5. Verify in browser Network tab (F12)
```

### Scenario 4: Test Database Connection

```bash
# Connect to MySQL
docker-compose exec mysql mysql -u nxtclass_user -p
# Password: nxtclass_pass_2024 (from .env)

# Once connected:
USE nxtclass_db;
SHOW TABLES;
SELECT * FROM users LIMIT 5;
EXIT;
```

---

## 🐛 Troubleshooting on Mac

### Issue 1: Port Already in Use

**Error**: `Port 80 is already allocated`

**Solution**:
```bash
# Check what's using port 80
sudo lsof -i :80

# If it's Apache or nginx, stop it:
sudo apachectl stop
# or
brew services stop nginx

# Or change port in docker-compose.yml:
# ports: ["8080:80"]
# Then access: http://localhost:8080
```

### Issue 2: Docker Desktop Not Running

**Error**: `Cannot connect to Docker daemon`

**Solution**:
1. Open Docker Desktop from Applications
2. Wait for whale icon to be steady in menu bar
3. Retry `docker ps`

### Issue 3: Build Taking Too Long

**Solution**:
```bash
# Check Docker Desktop settings
# Docker Desktop → Settings → Resources
# Increase CPUs: 4+
# Increase Memory: 4GB+
# Increase Disk: 20GB+
```

### Issue 4: Backend Won't Start

**Check backend logs**:
```bash
docker-compose logs backend

# Common issues:
# - MySQL not ready: Wait 30 seconds and restart
docker-compose restart backend

# - Database connection failed: Check .env passwords
cat .env | grep MYSQL_PASSWORD
```

### Issue 5: Frontend Shows 404 for API

**Solution**:
```bash
# Check nginx proxy is working
docker-compose logs frontend | grep api

# Verify backend is accessible
curl http://localhost:8080/actuator/health

# Restart frontend
docker-compose restart frontend
```

### Issue 6: Node Modules Issues

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 VSCode Tips for Testing

### 1. Integrated Terminal

```bash
# Split terminal in VSCode
# View → Terminal
# Click "+" to split

# Terminal 1: Docker logs
docker-compose logs -f

# Terminal 2: Run commands
docker-compose ps
```

### 2. Recommended VSCode Extensions

- **Docker** (Microsoft) - Manage containers visually
- **ESLint** - Frontend code linting
- **Java Extension Pack** - Backend development
- **Thunder Client** - Test APIs directly in VSCode

### 3. Quick Commands in VSCode

Add to `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Docker",
      "type": "shell",
      "command": "docker-compose up -d"
    },
    {
      "label": "Stop Docker",
      "type": "shell",
      "command": "docker-compose down"
    },
    {
      "label": "View Logs",
      "type": "shell",
      "command": "docker-compose logs -f"
    }
  ]
}
```

Then: `Cmd+Shift+P` → "Tasks: Run Task"

---

## 🎯 Complete Test Workflow

### For First-Time Setup

```bash
# 1. Clone repository
git clone <your-repo-url>
cd nxtclass

# 2. Verify structure
ls -la
# Should see: frontend/, backend/, docker-compose.yml

# 3. Start Docker Desktop
open -a Docker

# 4. Wait for Docker to start (check menu bar)
docker ps

# 5. Build and start services
docker-compose up -d

# 6. Wait 5-10 minutes for first build

# 7. Check services
docker-compose ps

# 8. Test in browser
open http://localhost

# 9. Check logs if issues
docker-compose logs -f

# 10. Stop when done
docker-compose down
```

### For Daily Development

```bash
# 1. Start services
docker-compose up -d

# 2. Check status
docker-compose ps

# 3. Make code changes in VSCode

# 4. Restart affected service
docker-compose restart frontend  # if frontend changed
docker-compose restart backend   # if backend changed

# 5. View logs
docker-compose logs -f frontend

# 6. Stop when done
docker-compose down
```

---

## 📝 Testing Checklist

After starting services, verify:

- [ ] Docker Desktop is running
- [ ] All 3 containers are "Up" in `docker-compose ps`
- [ ] Frontend loads at http://localhost
- [ ] Backend health check passes at http://localhost:8080/actuator/health
- [ ] API accessible at http://localhost/api
- [ ] No errors in `docker-compose logs`
- [ ] Can navigate to different pages
- [ ] Browser console has no errors (F12)

---

## 🎉 Success Indicators

You'll know it's working when:

✅ **Docker Desktop shows**:
- 3 green containers running
- No error messages

✅ **Terminal shows**:
- `docker-compose ps` shows all "Up"
- No error messages in logs

✅ **Browser shows**:
- Login page loads at http://localhost
- No console errors (F12 → Console)
- Network requests work (F12 → Network)

✅ **API shows**:
- http://localhost:8080/actuator/health returns `{"status":"UP"}`
- http://localhost/api/student-details/list returns JSON

---

## 🚀 Quick Commands Reference

```bash
# Start
docker-compose up -d

# Status
docker-compose ps

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Rebuild
docker-compose build
docker-compose up -d

# Clean slate
docker-compose down -v
docker-compose up -d --build
```

---

**You're ready to test on Mac! 🎉**

**Next**: See [LOCAL_TESTING.md](./LOCAL_TESTING.md) for detailed testing scenarios.
