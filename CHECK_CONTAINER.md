# What's Inside the Local Testing Container

## 🔍 Container Contents

The single container includes:

### Base System
- **Ubuntu 22.04** base image
- Runs all services with **Supervisor** (process manager)

### Installed Software
1. **MySQL 8.0** - Database server
2. **Java 17 (OpenJDK)** - For Spring Boot
3. **Maven** - To build backend
4. **Node.js + npm** - To build frontend
5. **Nginx** - Web server
6. **Supervisor** - Process manager to run all services

### Build Process
1. Copies backend code → Builds with Maven → Creates JAR file
2. Copies frontend code → Builds with npm → Creates production build
3. Deploys frontend build to Nginx `/var/www/html`
4. Configures everything to work together

### Running Services Inside Container
- **MySQL** (internal only) - No external port
- **Spring Boot Backend** (internal port 8080) - No external port
- **Nginx** (port 80) - **ONLY port exposed** → http://localhost

---

## 📂 Directory Structure Inside Container

```
/app/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── target/
│       └── *.jar         ← Backend JAR file
│
└── frontend/
    ├── src/
    ├── dist/             ← Built frontend files
    └── node_modules/

/var/www/html/            ← Nginx serves from here (frontend build)

/etc/nginx/               ← Nginx configuration
/etc/supervisor/          ← Supervisor configuration
```

---

## 🔍 How to Check/Verify

### 1. Check Container is Running
```bash
docker ps

# Should show:
# CONTAINER ID   IMAGE                PORTS
# xxxxx          nxtclass-local       0.0.0.0:80->80/tcp
```

### 2. Enter the Container
```bash
docker exec -it nxtclass-local bash
```

### 3. Inside Container - Check Services
```bash
# Check MySQL
mysql -u nxtclass_user -pnxtclass_pass_2024 -e "SHOW DATABASES;"

# Check Backend JAR
ls -lh /app/backend/target/*.jar

# Check Frontend Build
ls -lh /var/www/html/

# Check Running Processes
supervisorctl status

# Should show:
# mysql     RUNNING
# backend   RUNNING
# nginx     RUNNING
```

### 4. Check Service Ports (from inside container)
```bash
# Inside container
netstat -tlnp

# Should show:
# 0.0.0.0:80      (nginx)
# 127.0.0.1:8080  (backend - internal only)
# 127.0.0.1:3306  (mysql - internal only)
```

### 5. Test Services (from inside container)
```bash
# Test frontend
curl http://localhost/

# Test backend API
curl http://localhost/api/student-details/list

# Test MySQL
mysql -u nxtclass_user -pnxtclass_pass_2024 -e "USE nxtclass_db; SHOW TABLES;"
```

### 6. View Logs
```bash
# From outside container
docker-compose -f docker-compose.local.yml logs -f

# Or specific service logs inside container
docker exec -it nxtclass-local tail -f /var/log/backend-stdout.log
docker exec -it nxtclass-local tail -f /var/log/mysql-stdout.log
docker exec -it nxtclass-local tail -f /var/log/nginx-stdout.log
```

---

## 🧪 Verification Steps

### Step 1: Build and Start
```bash
./test-local.sh
```

### Step 2: Check Container
```bash
# Check it's running
docker ps | grep nxtclass-local

# Should show one container with port 80 exposed
```

### Step 3: Check from Browser
```bash
# Open browser
open http://localhost

# Should show your React app login page
```

### Step 4: Check API
```bash
# Test API endpoint
curl http://localhost/api/student-details/list

# Should return JSON (empty array or data)
```

### Step 5: Inspect Container (Optional)
```bash
# Enter container
docker exec -it nxtclass-local bash

# Once inside, check:
supervisorctl status        # All services should be RUNNING
mysql -V                    # MySQL version
java -version              # Java version
nginx -v                   # Nginx version
ls /var/www/html/          # Frontend files
ls /app/backend/target/    # Backend JAR
```

---

## 📊 Port Mapping

| Service | Inside Container | Outside Container | Access From Host |
|---------|------------------|-------------------|------------------|
| Nginx | 80 | 80 | ✅ http://localhost |
| Backend | 8080 | - | ❌ Not accessible (internal only) |
| MySQL | 3306 | - | ❌ Not accessible (internal only) |

**Only port 80 is exposed → Everything accessible through http://localhost**

---

## 🔧 How It Works

```
Your Browser
    ↓
http://localhost (port 80)
    ↓
┌─────────────────────────────────────────────────┐
│            Docker Container                     │
│                                                 │
│  Nginx (port 80)                               │
│    ↓                                            │
│    ├─ Static files (/) → /var/www/html/       │
│    └─ API calls (/api) → Backend (port 8080)  │
│                            ↓                    │
│                       Spring Boot               │
│                            ↓                    │
│                       MySQL (port 3306)         │
│                                                 │
└─────────────────────────────────────────────────┘
```

**All communication happens inside the container. You only see port 80.**

---

## 🎯 Quick Checklist

After running `./test-local.sh`:

- [ ] Container is running: `docker ps | grep nxtclass-local`
- [ ] Port 80 is exposed: `docker ps` shows `0.0.0.0:80->80/tcp`
- [ ] Frontend loads: `curl http://localhost` returns HTML
- [ ] API works: `curl http://localhost/api/student-details/list` returns JSON
- [ ] Browser shows app: `open http://localhost` displays login page

**All checked? ✅ Container is working!**

---

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose -f docker-compose.local.yml logs -f

# Common issues:
# - Port 80 in use → Stop Apache/other web servers
# - Build failed → Check error messages
```

### Services not running inside container
```bash
# Enter container
docker exec -it nxtclass-local bash

# Check supervisor
supervisorctl status

# Restart services
supervisorctl restart all
```

### Can't access database
```bash
# Enter container
docker exec -it nxtclass-local bash

# Test MySQL
mysql -u nxtclass_user -pnxtclass_pass_2024

# If fails, check if MySQL is running
supervisorctl status mysql
```

---

## 📝 Summary

**What you get:**
- ✅ One Ubuntu container
- ✅ MySQL, Java, Node.js all installed
- ✅ Backend compiled to JAR
- ✅ Frontend built and deployed to Nginx
- ✅ All services managed by Supervisor
- ✅ Only port 80 exposed to host
- ✅ Access everything at http://localhost

**How to verify:**
```bash
# Start
./test-local.sh

# Check
docker ps
curl http://localhost
open http://localhost

# Done!
```
