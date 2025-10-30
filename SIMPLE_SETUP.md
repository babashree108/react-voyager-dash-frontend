# ✅ SIMPLE CLEAN SETUP

**No n8n. No extra files. Just 3 services.**

---

## 🎯 What You Have

### One Docker Compose File

**docker-compose.yml** contains:
1. **MySQL** (port 3306) - Database
2. **Backend** (port 8080) - Spring Boot API
3. **Frontend** (port 80) - React UI

**That's all. Nothing else.**

---

## 📊 Services

| Service | Container | Port | Purpose |
|---------|-----------|------|---------|
| MySQL | nxtclass-mysql | 3306 | Database |
| Backend | nxtclass-backend | 8080 | API Server |
| Frontend | nxtclass-frontend | 80 | Web UI |

---

## 🔗 Connections

```
Frontend (port 80)
    ↓
Backend (port 8080)
    ↓
MySQL (port 3306)
```

**Database:** `nxtclass_db`  
**User:** `nxtclass_user`  
**Password:** `nxtclass_pass_2024`

---

## 🚀 Start Everything

```bash
docker-compose up -d
```

**This starts:**
- MySQL database
- Spring Boot backend
- React frontend

**Logs:**
```bash
docker-compose logs -f
```

**Status:**
```bash
docker-compose ps
```

---

## ✅ Access Points

| What | URL |
|------|-----|
| **Frontend** | http://localhost |
| **Backend API** | http://localhost:8080 |
| **Backend Health** | http://localhost:8080/actuator/health |
| **MySQL** | localhost:3306 |

---

## 🧹 Clean and Simple

**No:**
- ❌ n8n
- ❌ Extra docker-compose files
- ❌ Complex configuration
- ❌ Unnecessary services

**Just:**
- ✅ Database
- ✅ Backend
- ✅ Frontend

---

## 🛑 Stop Everything

```bash
docker-compose down
```

**Clean restart:**
```bash
docker-compose down -v
docker-compose up -d
```

---

**Simple. Clean. Works.**
