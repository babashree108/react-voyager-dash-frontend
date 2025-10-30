# 🚀 Quick Test on Mac - 2 Minutes

**The fastest way to test your NXT Class application on Mac**

---

## ⚡ Super Quick Start

```bash
# 1. Open Docker Desktop (from Applications)
# Wait for whale icon to be steady in menu bar

# 2. Open terminal in VSCode (Ctrl+`)

# 3. Run this one command:
docker-compose up -d

# 4. Wait 5-10 minutes for first build (grab coffee ☕)

# 5. Open browser:
open http://localhost

# Done! ✅
```

---

## 🎯 What's Running

After `docker-compose up -d`:

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost | React App |
| **Backend** | http://localhost:8080 | Spring Boot API |
| **Database** | localhost:3306 | MySQL |

---

## ✅ Quick Health Check

```bash
# Check if everything is up
docker-compose ps

# Should see 3 services "Up":
# nxtclass-frontend    Up
# nxtclass-backend     Up  
# nxtclass-mysql       Up
```

---

## 🔍 Quick Tests

### Test 1: Frontend
```bash
open http://localhost
# Should show login page
```

### Test 2: Backend
```bash
curl http://localhost:8080/actuator/health
# Should return: {"status":"UP"}
```

### Test 3: API
```bash
curl http://localhost/api/student-details/list
# Should return: [] or JSON array
```

---

## 🛑 Stop Services

```bash
# Stop everything
docker-compose down

# Quick restart
docker-compose restart
```

---

## 🐛 Issues?

### Port 80 in use?
```bash
sudo lsof -i :80
# If Apache is running:
sudo apachectl stop
```

### Docker not found?
```bash
# Check Docker Desktop is running
docker ps
# Should show list of containers
```

### Service not starting?
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 📝 VSCode Quick Tasks

Press `Cmd+Shift+P` → Type "Tasks: Run Task" → Select:

- **Docker: Start All Services** - Start everything
- **Docker: Stop All Services** - Stop everything
- **Docker: View Logs** - See what's happening
- **Docker: Check Status** - See if services are up

---

## 🎉 Success!

You'll know it's working when:
- ✅ Browser shows login page at http://localhost
- ✅ `docker-compose ps` shows all "Up"
- ✅ No errors in logs

**That's it! Now go code! 🚀**

For detailed testing: See [TESTING_ON_MAC.md](./TESTING_ON_MAC.md)
