# 🧪 Local Testing Guide - All-in-One Docker Container

**Complete guide for running NXT Class in a single Docker container for local testing**

---

## 📦 What's in the Container?

### Single Ubuntu 22.04 Container Contains:
```
┌─────────────────────────────────────────┐
│         UBUNTU 22.04                    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  MySQL 8.0 (port 3306)          │   │
│  │  Database: nxtClass108          │   │
│  │  User: nxtclass_user            │   │
│  └─────────────────────────────────┘   │
│              ↑                          │
│  ┌───────────┴──────────────────────┐  │
│  │  Spring Boot (port 8080)         │  │
│  │  Backend API                     │  │
│  └──────────────────────────────────┘  │
│              ↑                          │
│  ┌───────────┴──────────────────────┐  │
│  │  Nginx (port 80) ← EXPOSED       │  │
│  │  • Serves React frontend         │  │
│  │  • Proxies /api → Backend        │  │
│  └──────────────────────────────────┘  │
│                                         │
│  Managed by: Supervisor                 │
└─────────────────────────────────────────┘
          ↓
   You access via: http://localhost
```

### Software Stack:
- **OS:** Ubuntu 22.04
- **Database:** MySQL 8.0
- **Backend:** Java 17 + Spring Boot 3.2
- **Frontend:** Node.js 20 + React 18 + Vite
- **Web Server:** Nginx
- **Process Manager:** Supervisor

---

## 🚀 Quick Start (3 Steps)

### Prerequisites
- Docker installed and running
- 4GB RAM minimum
- 10GB disk space

### Step 1: Build and Start (1 minute)

```bash
# Using the helper script (recommended)
./test-local.sh
# Then select option 1

# OR using docker-compose directly
docker-compose -f docker-compose.local.yml build
docker-compose -f docker-compose.local.yml up -d
```

### Step 2: Wait for Services (60 seconds)

The container needs time to:
1. Initialize MySQL database
2. Create database schema
3. Start Spring Boot application
4. Start Nginx web server

**Monitor startup:**
```bash
# Watch logs
docker-compose -f docker-compose.local.yml logs -f

# Check service status
docker exec nxtclass-local supervisorctl status
```

**Expected output:**
```
backend    RUNNING   pid 123, uptime 0:01:00
mysql      RUNNING   pid 45, uptime 0:01:30
nginx      RUNNING   pid 67, uptime 0:01:00
```

### Step 3: Access Application

**Open in Browser:**
- Frontend: http://localhost
- API Health: http://localhost/actuator/health
- Container Health: http://localhost/health

**Default Login:**
```
Email: admin@nxtclass.com
Password: Admin@123
```

---

## 🎯 Using the Test Script

### Interactive Menu

```bash
./test-local.sh
```

**Options:**
```
1) Build and start container     ← First time setup
2) Start existing container      ← Quick restart
3) Stop container                ← Stop without removing
4) View logs                     ← See what's happening
5) Enter container shell         ← Debug inside
6) Check service status          ← Verify services running
7) Test API endpoints            ← Auto-test all APIs
8) Clean up                      ← Remove everything
```

---

## 📋 Detailed Commands

### Build Commands

```bash
# Build without cache (clean build)
docker-compose -f docker-compose.local.yml build --no-cache

# Build with cache (faster)
docker-compose -f docker-compose.local.yml build

# Build and start in one command
docker-compose -f docker-compose.local.yml up -d --build
```

### Start/Stop Commands

```bash
# Start container
docker-compose -f docker-compose.local.yml up -d

# Stop container (preserves data)
docker-compose -f docker-compose.local.yml down

# Stop and remove volumes (deletes data)
docker-compose -f docker-compose.local.yml down -v

# Restart container
docker-compose -f docker-compose.local.yml restart
```

### Monitoring Commands

```bash
# View all logs
docker-compose -f docker-compose.local.yml logs -f

# View last 100 lines
docker-compose -f docker-compose.local.yml logs --tail=100

# Check container status
docker-compose -f docker-compose.local.yml ps

# Check resource usage
docker stats nxtclass-local
```

### Debug Commands

```bash
# Enter container shell
docker exec -it nxtclass-local bash

# Check service status (inside container)
docker exec nxtclass-local supervisorctl status

# Restart specific service (inside container)
docker exec nxtclass-local supervisorctl restart backend

# View backend logs (inside container)
docker exec nxtclass-local tail -f /var/log/backend-stdout.log

# View MySQL logs (inside container)
docker exec nxtclass-local tail -f /var/log/mysql-stdout.log

# Access MySQL database
docker exec -it nxtclass-local mysql -u nxtclass_user -pnxtclass_pass_2024 nxtClass108
```

---

## 🧪 Testing

### Manual Browser Testing

1. **Login Test:**
   - Go to: http://localhost
   - Login with: admin@nxtclass.com / Admin@123
   - Verify: Dashboard loads

2. **Navigation Test:**
   - Click through all menu items
   - Verify: No 404 errors

3. **API Test:**
   - Open browser console (F12)
   - Watch Network tab
   - Verify: API calls return 200

### Automated API Testing

```bash
# Run automated tests
./test-local.sh
# Select option 7

# OR manual API tests:

# 1. Health Check
curl http://localhost/health

# 2. Backend Health
curl http://localhost/actuator/health

# 3. Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nxtclass.com","password":"Admin@123"}'

# 4. Get token and test endpoints
TOKEN="<paste-token-here>"

# Test courses
curl http://localhost/api/course/list \
  -H "Authorization: Bearer $TOKEN"

# Test students
curl http://localhost/api/student-details/list \
  -H "Authorization: Bearer $TOKEN"

# Test teachers
curl http://localhost/api/teacher-details/list \
  -H "Authorization: Bearer $TOKEN"
```

### Load Testing

```bash
# Install Apache Bench (if not installed)
sudo apt-get install apache2-utils

# Test frontend
ab -n 1000 -c 10 http://localhost/

# Test API (with token)
ab -n 100 -c 5 -H "Authorization: Bearer TOKEN" \
  http://localhost/api/course/list
```

---

## 🔍 Troubleshooting

### Container Won't Start

**Check Docker:**
```bash
# Verify Docker is running
docker info

# Check available disk space
df -h

# Check available memory
free -h
```

**Check Logs:**
```bash
# View startup logs
docker-compose -f docker-compose.local.yml logs

# Check specific errors
docker-compose -f docker-compose.local.yml logs | grep -i error
```

### Service Not Running

**Check Status:**
```bash
docker exec nxtclass-local supervisorctl status
```

**Restart Service:**
```bash
# Restart backend
docker exec nxtclass-local supervisorctl restart backend

# Restart all services
docker exec nxtclass-local supervisorctl restart all
```

**View Service Logs:**
```bash
# Backend logs
docker exec nxtclass-local tail -f /var/log/backend-stdout.log
docker exec nxtclass-local tail -f /var/log/backend-stderr.log

# MySQL logs
docker exec nxtclass-local tail -f /var/log/mysql-stdout.log

# Nginx logs
docker exec nxtclass-local tail -f /var/log/nginx-stdout.log
```

### MySQL Connection Failed

**Check MySQL Status:**
```bash
docker exec nxtclass-local supervisorctl status mysql
```

**Test MySQL Connection:**
```bash
docker exec nxtclass-local mysql -u nxtclass_user -pnxtclass_pass_2024 -e "SHOW DATABASES;"
```

**Reinitialize Database:**
```bash
# Enter container
docker exec -it nxtclass-local bash

# Inside container:
mysql -u root <<-EOSQL
    DROP DATABASE IF EXISTS nxtClass108;
    CREATE DATABASE nxtClass108;
    GRANT ALL PRIVILEGES ON nxtClass108.* TO 'nxtclass_user'@'%';
    FLUSH PRIVILEGES;
EOSQL

# Restart backend
supervisorctl restart backend
```

### Backend Won't Start

**Check Java Process:**
```bash
docker exec nxtclass-local ps aux | grep java
```

**Check Backend Logs:**
```bash
docker exec nxtclass-local tail -100 /var/log/backend-stderr.log
```

**Common Issues:**

1. **Port already in use:**
   ```bash
   # Check what's using port 8080 inside container
   docker exec nxtclass-local netstat -tlnp | grep 8080
   ```

2. **Out of memory:**
   ```bash
   # Check memory usage
   docker stats nxtclass-local
   ```

3. **Database not ready:**
   ```bash
   # Wait for MySQL to fully start
   docker exec nxtclass-local mysqladmin ping
   ```

### Frontend Not Loading

**Check Nginx:**
```bash
# Check nginx status
docker exec nxtclass-local supervisorctl status nginx

# Test nginx configuration
docker exec nxtclass-local nginx -t

# Restart nginx
docker exec nxtclass-local supervisorctl restart nginx
```

**Check Files:**
```bash
# Verify frontend build files exist
docker exec nxtclass-local ls -la /var/www/html/
```

### API Calls Failing (CORS Errors)

**Check Nginx Configuration:**
```bash
docker exec nxtclass-local cat /etc/nginx/sites-available/default
```

**Check Backend CORS:**
```bash
docker exec nxtclass-local grep -r "CORS" /app/backend/src/
```

### Container Keeps Restarting

**Check Logs:**
```bash
docker logs nxtclass-local
```

**Check Health:**
```bash
docker inspect nxtclass-local | grep -A 10 Health
```

---

## 📊 Performance Tuning

### Increase Java Memory

Edit `supervisord-local.conf`:
```ini
[program:backend]
command=java -Xmx1g -Xms512m -jar /app/backend/target/backend-0.0.1-SNAPSHOT.jar
```

Rebuild:
```bash
docker-compose -f docker-compose.local.yml build --no-cache
docker-compose -f docker-compose.local.yml up -d
```

### Optimize MySQL

```bash
docker exec -it nxtclass-local bash

# Inside container, edit MySQL config:
cat >> /etc/mysql/mysql.conf.d/mysqld.cnf <<EOF
[mysqld]
innodb_buffer_pool_size = 256M
max_connections = 100
EOF

supervisorctl restart mysql
```

### Enable MySQL Query Cache

```bash
docker exec -it nxtclass-local mysql -u root -pnxtclass_pass_2024 <<EOF
SET GLOBAL query_cache_size = 67108864;
SET GLOBAL query_cache_type = 1;
EOF
```

---

## 🔒 Security Notes

### For Local Testing Only!

⚠️ **This container is NOT production-ready:**
- Default passwords used
- No SSL/TLS encryption
- Debug logging enabled
- No security hardening
- All services in one container

### Default Credentials

**Database:**
- User: `nxtclass_user`
- Password: `nxtclass_pass_2024`
- Root Password: (empty)

**JWT Secret:**
- `nxtclass_jwt_secret_key_for_local_testing_only_minimum_256_bits_required_here`

**Application Users:**
- Admin: admin@nxtclass.com / Admin@123
- Teacher: teacher@nxtclass.com / Admin@123
- Student: student@nxtclass.com / Admin@123

---

## 📁 File Structure

```
/workspace/
├── Dockerfile.local              ← Main container definition
├── docker-compose.local.yml      ← Docker Compose config
├── nginx-local.conf              ← Nginx web server config
├── supervisord-local.conf        ← Process manager config
├── start-local.sh                ← Container startup script
├── test-local.sh                 ← Interactive test script
└── LOCAL_TESTING_README.md       ← This file
```

---

## 🎓 Understanding the Build

### Build Process

1. **Base Image Setup (5 min)**
   - Install Ubuntu packages
   - Install Node.js 20
   - Setup MySQL

2. **Backend Build (2-3 min)**
   - Copy backend source
   - Run Maven build
   - Create JAR file

3. **Frontend Build (2-3 min)**
   - Copy frontend source
   - Run npm install
   - Run npm build
   - Copy to Nginx

4. **Configuration (1 min)**
   - Setup Nginx
   - Configure Supervisor
   - Create startup script

**Total Build Time: ~10-15 minutes**

### Runtime Process

```
Container starts
    ↓
start-local.sh executes
    ↓
Initialize MySQL data directory
    ↓
Start MySQL temporarily
    ↓
Create database and user
    ↓
Stop temporary MySQL
    ↓
Start Supervisor
    ↓
Supervisor starts:
    1. MySQL (priority 1)
    2. Backend (priority 2, waits for MySQL)
    3. Nginx (priority 3)
    ↓
All services running
    ↓
Container ready (port 80 exposed)
```

---

## 📈 Monitoring

### Container Stats

```bash
# Real-time stats
docker stats nxtclass-local

# Detailed info
docker inspect nxtclass-local
```

### Service Status

```bash
# All services
docker exec nxtclass-local supervisorctl status

# Individual service
docker exec nxtclass-local supervisorctl status backend
```

### Log Monitoring

```bash
# Follow all logs
docker-compose -f docker-compose.local.yml logs -f

# Follow specific service
docker exec nxtclass-local tail -f /var/log/backend-stdout.log
```

---

## 🧹 Cleanup

### Stop and Keep Data

```bash
docker-compose -f docker-compose.local.yml down
```

### Remove Everything

```bash
# Remove container and volumes
docker-compose -f docker-compose.local.yml down -v

# Remove image
docker rmi nxtclass-local

# Remove logs folder
rm -rf logs/
```

### Clean Docker System

```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything (CAREFUL!)
docker system prune -a --volumes
```

---

## 🆚 Comparison with Multi-Container Setup

| Aspect | All-in-One | Multi-Container |
|--------|------------|-----------------|
| **Containers** | 1 | 3 (frontend, backend, database) |
| **Exposed Ports** | 1 (80) | 3 (80, 8080, 3306) |
| **Build Time** | 10-15 min | 5-8 min |
| **Startup Time** | 60-90 sec | 30-40 sec |
| **Memory Usage** | ~1GB | ~1.5GB |
| **Debugging** | Easier (single container) | Moderate (multiple containers) |
| **Production-Like** | No | Yes |
| **Best For** | Quick testing | Development & Production |

---

## ✅ Success Checklist

After starting the container, verify:

- [ ] Container is running: `docker ps`
- [ ] All services running: `docker exec nxtclass-local supervisorctl status`
- [ ] Health check passes: `curl http://localhost/health`
- [ ] Backend healthy: `curl http://localhost/actuator/health`
- [ ] Frontend loads: Open http://localhost in browser
- [ ] Login works: admin@nxtclass.com / Admin@123
- [ ] API calls work: Check browser console
- [ ] No errors in logs: `docker-compose -f docker-compose.local.yml logs`

---

## 📞 Getting Help

### Check Logs First
```bash
docker-compose -f docker-compose.local.yml logs
```

### Common Issues
See **Troubleshooting** section above

### Still Stuck?
1. Check `API_MAPPING_VERIFICATION.md` for API issues
2. Review `DOCKER_SETUP.md` for Docker concepts
3. See `README.md` for general documentation

---

## 🎯 Next Steps

After successful local testing:

1. **Test All Features:**
   - User management
   - Course creation
   - Student/Teacher CRUD
   - Assignments
   - Announcements

2. **Implement Security Fixes:**
   - See `SECURITY_SUMMARY.md`
   - Enable RBAC
   - Add input validation

3. **Move to Production Setup:**
   - Use multi-container setup (`docker-compose.yml`)
   - Configure environment variables
   - Enable SSL/TLS
   - Use strong passwords

---

**Created:** 2025-10-30  
**Status:** Ready for Testing  
**Container:** All-in-One (Local Testing Only)  
**Recommended:** For quick testing and debugging

---

**Happy Testing! 🎉**
