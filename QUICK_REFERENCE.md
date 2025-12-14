# 🚀 Quick Reference - NXT Class Local Testing

**One-page guide to get you started fast!**

---

## ⚡ Super Quick Start

```bash
./test-local.sh          # Run this
# Select: 1              # Build and start
# Wait: ~12 minutes      # First build
# Open: http://localhost # In browser
# Login: admin@nxtclass.com / Admin@123
```

---

## 📋 Files You Got

```
Dockerfile.local              - Container definition
docker-compose.local.yml      - Docker Compose config
nginx-local.conf              - Web server config
supervisord-local.conf        - Process manager
start-local.sh                - Startup script
test-local.sh                 - Interactive testing ⭐ USE THIS
LOCAL_TESTING_README.md       - Full documentation
API_MAPPING_VERIFICATION.md   - API details
```

---

## 🎯 Test Script Options

```bash
./test-local.sh

1) Build and start     ← First time / Clean rebuild
2) Start existing      ← Quick restart
3) Stop container      ← Stop services
4) View logs           ← See what's happening
5) Enter shell         ← Debug inside
6) Check status        ← Is it working?
7) Test API            ← Auto-test endpoints ⭐
8) Clean up            ← Remove everything
```

---

## 🐳 Manual Commands

```bash
# Build
docker-compose -f docker-compose.local.yml build

# Start
docker-compose -f docker-compose.local.yml up -d

# Logs
docker-compose -f docker-compose.local.yml logs -f

# Stop
docker-compose -f docker-compose.local.yml down

# Status
docker ps | grep nxtclass-local

# Enter container
docker exec -it nxtclass-local bash

# Service status (inside container)
supervisorctl status
```

---

## ✅ Verify It's Working

```bash
# 1. Container running
docker ps

# 2. Services healthy
docker exec nxtclass-local supervisorctl status

# 3. Health checks
curl http://localhost/health
curl http://localhost/actuator/health

# 4. Frontend
open http://localhost

# 5. Login
Email: admin@nxtclass.com
Password: Admin@123
```

---

## 🔍 Troubleshooting Quick Fixes

**Container won't start:**
```bash
docker-compose -f docker-compose.local.yml logs
```

**Service not running:**
```bash
docker exec nxtclass-local supervisorctl restart backend
```

**View logs:**
```bash
docker exec nxtclass-local tail -f /var/log/backend-stdout.log
```

**MySQL issues:**
```bash
docker exec -it nxtclass-local mysql -u nxtclass_user -pnxtclass_pass_2024
```

**Clean rebuild:**
```bash
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml build --no-cache
docker-compose -f docker-compose.local.yml up -d
```

---

## 🧪 Test API Manually

```bash
# Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nxtclass.com","password":"Admin@123"}'

# Get token from response, then:
TOKEN="paste-token-here"

# Test courses
curl http://localhost/api/course/list \
  -H "Authorization: Bearer $TOKEN"

# Test students
curl http://localhost/api/student-details/list \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 What's Running

```
Port 80  → Nginx (frontend + API proxy) [EXPOSED]
Port 8080 → Spring Boot API (internal)
Port 3306 → MySQL database (internal)
```

**Access everything at:** http://localhost

---

## ⏱️ Timings

| Action | Time |
|--------|------|
| First build | ~12 min |
| Rebuild (cache) | ~5 min |
| Startup | ~60 sec |

---

## 💾 Default Credentials

**Database:**
- User: `nxtclass_user`
- Pass: `nxtclass_pass_2024`

**App Users:**
- Admin: `admin@nxtclass.com` / `Admin@123`
- Teacher: `teacher@nxtclass.com` / `Admin@123`
- Student: `student@nxtclass.com` / `Admin@123`

---

## 📚 Full Documentation

- `LOCAL_TESTING_README.md` - Complete guide
- `API_MAPPING_VERIFICATION.md` - API details
- `DOCKER_SETUP.md` - Docker deep dive

---

## ⚠️ Remember

✅ This is for **LOCAL TESTING ONLY**  
❌ NOT for production use  
🔒 Default passwords - change for production  
📦 Use `docker-compose.yml` for production

---

## 🆘 Need Help?

1. Check logs: `docker-compose -f docker-compose.local.yml logs`
2. Read: `LOCAL_TESTING_README.md`
3. Check: `API_MAPPING_VERIFICATION.md`

---

**That's it! Now run:** `./test-local.sh` 🚀
