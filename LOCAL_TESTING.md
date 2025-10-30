# 🧪 Local Testing Guide

Complete guide to test your NXT Class application locally before deploying to Hostinger VPS.

---

## 📋 Prerequisites

Make sure you have installed:

- ✅ **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- ✅ **Docker Compose** (usually included with Docker Desktop)
- ✅ **Git** (to clone the repository)

### Check if Docker is installed:

```bash
docker --version
# Should show: Docker version 24.0.0 or higher

docker-compose --version
# Should show: Docker Compose version 2.0.0 or higher
```

### Install Docker if needed:

**Windows/Mac:**
- Download Docker Desktop: https://www.docker.com/products/docker-desktop/

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

---

## 🚀 Method 1: Quick Start (Automated Script)

This is the **easiest** way to test locally:

```bash
# 1. Navigate to your project
cd /path/to/nxtclass

# 2. Make sure .env file exists
ls -la .env
# If not, it should already be there. If missing:
# cp .env.example .env

# 3. Run the deploy script
./deploy.sh

# 4. Choose option 1: Fresh deployment
# Enter: 1

# 5. Wait 5-10 minutes for first-time build
# You'll see Docker downloading and building images

# 6. Once complete, check status
./health-check.sh
```

**Expected output:**
```
✅ MySQL Database... Healthy
✅ Backend API... Healthy
✅ Frontend... Healthy

Frontend:    http://localhost
Backend:     http://localhost:8080
MySQL:       localhost:3306
```

**Access your application:**
- Open browser: http://localhost
- Backend API: http://localhost:8080/api
- API Health: http://localhost:8080/actuator/health

---

## 🛠️ Method 2: Manual Docker Commands

If you prefer manual control:

### Step 1: Check .env file

```bash
cat .env
```

Should show:
```env
VITE_API_URL=http://localhost/api
CORS_ALLOWED_ORIGINS=http://localhost,http://127.0.0.1
# ... other settings
```

### Step 2: Build Docker images

```bash
# Build all images (takes 5-10 minutes first time)
docker-compose build

# Or build individually
docker-compose build frontend
docker-compose build backend
```

### Step 3: Start all services

```bash
# Start in detached mode
docker-compose up -d

# Or start with logs visible
docker-compose up
# Press Ctrl+C to stop
```

### Step 4: Check status

```bash
# View running containers
docker-compose ps

# Should show:
# nxtclass-frontend    Up    0.0.0.0:80->80/tcp
# nxtclass-backend     Up    0.0.0.0:8080->8080/tcp
# nxtclass-mysql       Up    0.0.0.0:3306->3306/tcp

# Note: These are the container names from docker-compose.yml
```

### Step 5: View logs

```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Step 6: Access application

Open browser and navigate to:
- **http://localhost** - Main application
- **http://localhost:8080** - Backend directly
- **http://localhost:8080/actuator/health** - Backend health check

---

## 🧪 Testing Checklist

### 1. Frontend Tests

- [ ] Open http://localhost
- [ ] Page loads without errors
- [ ] Can navigate to login page
- [ ] UI is responsive (try resizing browser)
- [ ] No console errors (F12 → Console tab)
- [ ] Can see login form

### 2. Backend Tests

```bash
# Test backend health
curl http://localhost:8080/actuator/health

# Expected response:
# {"status":"UP"}

# Test API endpoint
curl http://localhost:8080/api/student-details/list

# Test via frontend proxy
curl http://localhost/api/student-details/list
```

### 3. Database Tests

```bash
# Connect to MySQL
docker-compose exec mysql mysql -u nxtclass_user -p
# Password: nxtclass_pass_2024

# Once connected:
USE nxtclass_db;
SHOW TABLES;
SELECT * FROM users LIMIT 5;
EXIT;
```

### 4. Integration Tests

- [ ] Login page loads
- [ ] Dashboard navigation works
- [ ] Can access Students page
- [ ] Can access Teachers page
- [ ] API calls work (check Network tab in browser)
- [ ] No CORS errors

---

## 🔍 Troubleshooting Local Issues

### Issue 1: Port Already in Use

**Error:**
```
Error: Port 80 is already allocated
```

**Solution:**
```bash
# Check what's using port 80
sudo lsof -i :80
# or on Windows:
netstat -ano | findstr :80

# Stop the conflicting service or change ports in docker-compose.yml
# Edit docker-compose.yml in your project root:
ports:
  - "8081:80"  # Change 80 to 8081

# Then access via http://localhost:8081
```

### Issue 2: Backend Can't Connect to Database

**Symptoms:**
- Backend logs show connection errors
- Health check fails

**Solution:**
```bash
# Check MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Wait 30 seconds, then check backend
docker-compose restart backend
```

### Issue 3: Frontend Shows API Errors

**Symptoms:**
- Frontend loads but API calls fail
- Network tab shows 404 or CORS errors

**Solution:**
```bash
# 1. Check backend is running
docker-compose ps backend

# 2. Verify VITE_API_URL in .env
cat .env | grep VITE_API_URL
# Should be: VITE_API_URL=http://localhost/api

# 3. Rebuild frontend with correct env
docker-compose build frontend --no-cache
docker-compose up -d frontend

# 4. Clear browser cache and refresh
```

### Issue 4: Services Won't Start

**Solution:**
```bash
# Stop everything
docker-compose down

# Remove volumes (⚠️ deletes data!)
docker-compose down -v

# Clean Docker system
docker system prune -a

# Start fresh
docker-compose up -d --build
```

### Issue 5: Database Data Persists

**Symptoms:**
- Old data remains after restart

**Note:** This is normal! Data persists in Docker volumes.

**To reset database:**
```bash
# Stop services
docker-compose down

# Remove volumes (⚠️ deletes all data!)
docker-compose down -v

# Start fresh
docker-compose up -d
```

---

## 📊 Verifying Everything Works

Run this complete test:

```bash
# 1. Check all services are up
docker-compose ps

# 2. Health check
./health-check.sh

# 3. Test backend API
curl http://localhost:8080/actuator/health

# 4. Test frontend
curl http://localhost/health

# 5. Test API through proxy
curl http://localhost/api/student-details/list

# 6. Check logs for errors
docker-compose logs | grep -i error
```

**All green? You're ready! ✅**

---

## 🔄 Making Changes and Testing

### Testing Code Changes

```bash
# 1. Make your code changes in your IDE

# 2. Rebuild affected service
docker-compose build frontend  # If frontend changed
docker-compose build backend   # If backend changed

# 3. Restart the service
docker-compose up -d frontend
docker-compose up -d backend

# 4. Test your changes
# Open http://localhost
```

### Hot Reload (Development Mode)

For faster development, you can run frontend in dev mode:

```bash
# Stop Docker frontend
docker-compose stop frontend

# Run frontend locally with hot reload
npm install
npm run dev
# Access at http://localhost:5173

# Backend still runs in Docker at http://localhost:8080
```

---

## 🧹 Cleanup Commands

### Stop Services (Keep Data)
```bash
docker-compose down
```

### Stop and Remove Data
```bash
docker-compose down -v
```

### Full Cleanup
```bash
# Stop all
docker-compose down -v

# Remove all Docker resources
docker system prune -a -f

# Remove all volumes
docker volume prune -f
```

---

## 📈 Performance Testing

### Check Resource Usage

```bash
# View container resources
docker stats

# Should show (approximate values):
# CONTAINER          CPU %    MEM USAGE
# nxtclass-frontend  0.5%     50MB
# nxtclass-backend   2%       500MB
# nxtclass-mysql     1%       300MB

# Note: These are the container names defined in docker-compose.yml
```

### Load Testing

```bash
# Install Apache Bench (if needed)
sudo apt install apache2-utils  # Linux
brew install apache-bench       # Mac

# Test frontend
ab -n 100 -c 10 http://localhost/

# Test backend API
ab -n 100 -c 10 http://localhost/api/student-details/list
```

---

## ✅ Ready for VPS Deployment

Once local testing passes:

- ✅ All services start successfully
- ✅ Frontend accessible at http://localhost
- ✅ Backend API responds correctly
- ✅ Database connection works
- ✅ No errors in logs
- ✅ All features work as expected

**You're ready to deploy to Hostinger VPS!**

See [CICD_SETUP.md](./CICD_SETUP.md) for deployment instructions.

---

## 🎯 Quick Reference

```bash
# Start everything
./deploy.sh → option 1

# Check status
./health-check.sh
docker-compose ps

# View logs
docker-compose logs -f

# Restart all
docker-compose restart

# Stop all
docker-compose down

# Clean start
docker-compose down -v && docker-compose up -d --build

# Access URLs
http://localhost           # Frontend
http://localhost:8080      # Backend
http://localhost:8080/api  # API
```

---

**Need help? Check the troubleshooting section above or run `./health-check.sh` to diagnose issues.**
