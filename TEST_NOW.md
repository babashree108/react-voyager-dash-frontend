# 🚀 TEST YOUR CODE NOW - Mac Quick Guide

**You're on Mac with Docker Desktop and VSCode - Here's how to test right now!**

---

## ⚡ Super Fast Test (30 Seconds)

```bash
# 1. Make sure Docker Desktop is running (check menu bar for whale icon)

# 2. In VSCode terminal (press Ctrl + ` if not open):
docker-compose up -d

# 3. Open browser:
open http://localhost

# Done! 🎉
```

---

## 📊 Your Repository Structure

```
nxtclass/
├── frontend/    # All React code
└── backend/     # All Spring Boot code
```

**Clean and separated! ✅**

---

## 🎯 What Happens When You Run `docker-compose up -d`

```
Starting services...
├── Building frontend (2-3 min first time)
├── Building backend (5-7 min first time)  
└── Starting MySQL database

Total first time: ~10 minutes ☕
Subsequent starts: ~30 seconds ⚡
```

---

## ✅ Check It's Working

### Quick Check (1 command)
```bash
docker-compose ps

# Should show:
# NAME                  STATUS
# nxtclass-frontend     Up
# nxtclass-backend      Up
# nxtclass-mysql        Up
```

### Full Check (3 commands)
```bash
# Frontend health
curl http://localhost/health
# Returns: healthy

# Backend health
curl http://localhost:8080/actuator/health
# Returns: {"status":"UP"}

# API test
curl http://localhost/api/student-details/list
# Returns: [] or JSON data
```

---

## 🌐 Access Your Application

| What | URL | Description |
|------|-----|-------------|
| **Frontend** | http://localhost | React app (login page) |
| **Backend** | http://localhost:8080 | Spring Boot API |
| **API** | http://localhost/api | Proxied through frontend |
| **Health** | http://localhost/health | Frontend health |
| **Backend Health** | http://localhost:8080/actuator/health | Backend health |

---

## 🎨 VSCode Quick Tasks

**Press `Cmd + Shift + P` → Type "Tasks" → Select:**

- 🚀 **Docker: Start All** - Start everything
- 🛑 **Docker: Stop All** - Stop everything  
- 📋 **Docker: View Logs** - See what's happening
- 📊 **Docker: Check Status** - See if services are up
- 🏥 **Health Check** - Run health check

---

## 🐛 Something Wrong?

### Services won't start?
```bash
# View logs to see what's wrong
docker-compose logs -f

# Or use VSCode task:
# Cmd+Shift+P → "Tasks: Run Task" → "📋 Docker: View Logs"
```

### Port 80 already in use?
```bash
# Stop Apache if running
sudo apachectl stop

# Or change port in docker-compose.yml:
# Change "80:80" to "8080:80"
# Then access: http://localhost:8080
```

### MySQL not starting?
```bash
# Wait 30 seconds, MySQL takes time
sleep 30

# Then restart backend
docker-compose restart backend
```

---

## 🔄 Daily Workflow

### Morning
```bash
# Start Docker Desktop
# Open VSCode
# In terminal:
docker-compose up -d
```

### Making Changes

**Frontend:**
```bash
# Edit: frontend/src/App.tsx
# Then rebuild:
docker-compose build frontend
docker-compose up -d frontend
# Test: open http://localhost
```

**Backend:**
```bash
# Edit: backend/src/main/java/.../Controller.java
# Then rebuild:
docker-compose build backend
docker-compose up -d backend
# Test: curl http://localhost:8080/actuator/health
```

### Evening
```bash
# Stop services
docker-compose down
```

---

## 📝 Quick Commands

```bash
# Start
docker-compose up -d

# Status
docker-compose ps

# Logs
docker-compose logs -f

# Restart frontend
docker-compose restart frontend

# Restart backend
docker-compose restart backend

# Stop
docker-compose down

# Clean restart
docker-compose down -v
docker-compose up -d --build
```

---

## 🎯 Your Next Steps

### Right Now (Test Locally)

```bash
# 1. Check Docker Desktop is running
docker ps

# 2. Start services
docker-compose up -d

# 3. Wait 5-10 minutes (first time)

# 4. Test
open http://localhost
```

### Then (Deploy to VPS)

After local testing works:
1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Setup Hostinger VPS
3. Configure CI/CD

### Finally (Share with Reviewers)

```
Share URL: http://YOUR_VPS_IP
Auto-deploys on git push! ✅
```

---

## 📚 More Help

**For detailed Mac testing:**
- [MAC_TESTING_GUIDE.md](./MAC_TESTING_GUIDE.md) - Complete guide
- [QUICK_TEST_MAC.md](./QUICK_TEST_MAC.md) - 2-min quick test

**For deployment:**
- [START_HERE.md](./START_HERE.md) - Getting started
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment

---

## ✅ Success Checklist

After running `docker-compose up -d`:

- [ ] Docker Desktop shows 3 green containers
- [ ] `docker-compose ps` shows all "Up"
- [ ] http://localhost loads (shows login page)
- [ ] http://localhost:8080/actuator/health returns `{"status":"UP"}`
- [ ] No errors in `docker-compose logs`

**All checked? Perfect! You're ready! 🎉**

---

**NOW GO TEST IT! 🚀**

```bash
docker-compose up -d
```
