# 🚀 Quick Start - NXT Class with Docker

**Ready in 5 minutes!** ⚡

---

## ✅ Prerequisites

- Docker installed
- Docker Compose installed

**Check:** `docker --version && docker-compose --version`

---

## 🎯 3-Step Setup

### Step 1: Configure Environment (2 minutes)

```bash
# Navigate to project
cd /workspace

# Copy environment template
cp .env.example .env

# Generate secure JWT secret
openssl rand -base64 64 | tr -d '\n'
# Copy the output!

# Edit .env file
nano .env
# Paste the JWT secret and set secure passwords
```

**Minimum Required in `.env`:**
```env
JWT_SECRET=<paste-your-generated-secret-here>
DB_ROOT_PASSWORD=SecureRoot123!
DB_PASSWORD=SecureDb456!
```

### Step 2: Start All Services (1 minute)

```bash
# Build and start everything
docker-compose up -d

# Watch services start (wait for 'healthy')
docker-compose ps
```

**Expected Output:**
```
NAME                    STATUS          PORTS
nxtclass-backend        Up (healthy)    0.0.0.0:8080->8080/tcp
nxtclass-database       Up (healthy)    0.0.0.0:3306->3306/tcp
nxtclass-frontend       Up (healthy)    0.0.0.0:80->80/tcp
```

### Step 3: Access & Test (1 minute)

**Open in Browser:**
- Frontend: http://localhost
- Backend API: http://localhost:8080/api
- Health Check: http://localhost:8080/actuator/health

**Test Login:**
```
Email: admin@nxtclass.com
Password: Admin@123
```

---

## 📊 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

---

## 🛑 Stop Services

```bash
# Stop (preserves data)
docker-compose down

# Stop and remove all data
docker-compose down -v
```

---

## 🔧 Useful Commands

```bash
# Check service status
docker-compose ps

# Restart a service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build

# Access backend container
docker-compose exec backend bash

# Access database
docker-compose exec database mysql -u root -p
```

---

## 🧪 Test API

```bash
# Health check
curl http://localhost:8080/actuator/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nxtclass.com","password":"Admin@123"}'

# Get courses (replace TOKEN with the one from login)
curl http://localhost:8080/api/course/list \
  -H "Authorization: Bearer TOKEN"
```

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :80
sudo lsof -i :8080
sudo lsof -i :3306

# Change port in docker-compose.yml
ports:
  - "8081:80"  # Change 80 to 8081
```

### Services Won't Start

```bash
# Check logs for errors
docker-compose logs backend

# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Failed

```bash
# Wait for database health check
docker-compose ps

# Check database logs
docker-compose logs database

# Verify .env database credentials
cat .env | grep DB_
```

---

## 📱 Default Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@nxtclass.com | Admin@123 |
| **Teacher** | teacher@nxtclass.com | Admin@123 |
| **Student** | student@nxtclass.com | Admin@123 |

---

## 🎯 What You Get

✅ **Frontend** - React app at http://localhost  
✅ **Backend** - Spring Boot API at http://localhost:8080  
✅ **Database** - MySQL 8.0 with persistent data  
✅ **Auto-restart** - Services restart automatically  
✅ **Health checks** - Monitors service health  
✅ **Logging** - Comprehensive logs for debugging  

---

## 📚 Next Steps

1. ✅ **Test the Application** - Login and explore features
2. ⚠️ **Implement Security Fixes** - See `SECURITY_SUMMARY.md`
3. 🔧 **Customize Configuration** - Update `.env` for your needs
4. 📖 **Read Documentation** - Check `README.md` for details

---

## 💡 Using Helper Script

```bash
# Run the interactive startup script
./start-dev.sh

# Menu options:
# 1 - Start with Docker Compose (full stack)
# 2 - Start Backend only (local dev)
# 3 - Start Frontend only (local dev)
# 4 - Start Both (local dev)
# 5 - Stop all Docker containers
# 6 - Clean all Docker resources
```

---

## ⚡ One-Liner Setup

For the impatient:

```bash
cp .env.example .env && \
echo "JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')" >> .env && \
echo "DB_ROOT_PASSWORD=$(openssl rand -base64 32 | tr -d '\n')" >> .env && \
echo "DB_PASSWORD=$(openssl rand -base64 32 | tr -d '\n')" >> .env && \
docker-compose up -d && \
echo "✅ Services starting... Check http://localhost in 30 seconds"
```

Then wait 30 seconds and open http://localhost

---

**That's it! You're ready to go! 🎉**

**Need help?** Check `DOCKER_SETUP.md` for comprehensive guide.
