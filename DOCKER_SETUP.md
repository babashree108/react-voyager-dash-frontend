# 🐳 Docker Setup Guide - NXT Class

Complete guide for running NXT Class with Docker and Docker Compose.

---

## 📋 Prerequisites

### Required Software
- **Docker:** Version 20.10 or higher
- **Docker Compose:** Version 2.0 or higher

### Installation

**Linux (Ubuntu/Debian):**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

**macOS:**
```bash
# Install Docker Desktop
brew install --cask docker
```

**Windows:**
- Download and install [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

### Verify Installation
```bash
docker --version
docker-compose --version
```

---

## 🚀 Quick Start

### 1. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Generate secure JWT secret
openssl rand -base64 64 | tr -d '\n'

# Edit .env file
nano .env
```

**Required Variables:**
```env
JWT_SECRET=<paste-generated-secret-here>
DB_ROOT_PASSWORD=SecureRootPassword123!
DB_PASSWORD=SecureDbPassword456!
```

### 2. Start All Services

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Access Application

- **Frontend:** http://localhost
- **Backend API:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/actuator/health

### 4. Stop Services

```bash
# Stop services (preserves data)
docker-compose down

# Stop and remove data volumes
docker-compose down -v
```

---

## 📦 Services Overview

### Service Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (Nginx)              │
│         http://localhost:80             │
└─────────────┬───────────────────────────┘
              │
              │ HTTP Requests
              ▼
┌─────────────────────────────────────────┐
│      Backend (Spring Boot)              │
│       http://localhost:8080             │
└─────────────┬───────────────────────────┘
              │
              │ JDBC
              ▼
┌─────────────────────────────────────────┐
│         Database (MySQL)                │
│         Port: 3306                      │
└─────────────────────────────────────────┘
```

### Container Details

| Service | Port | Health Check | Auto-Restart |
|---------|------|--------------|--------------|
| Frontend | 80 | /health | ✅ |
| Backend | 8080 | /actuator/health | ✅ |
| Database | 3306 | mysqladmin ping | ✅ |

---

## 🔧 Docker Compose Commands

### Basic Operations

```bash
# Start services
docker-compose up -d

# Start with rebuild
docker-compose up -d --build

# Start specific service
docker-compose up -d backend

# Stop all services
docker-compose down

# Stop and remove volumes (DELETES DATA!)
docker-compose down -v

# Restart service
docker-compose restart backend

# View status
docker-compose ps
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# View last 100 lines
docker-compose logs --tail=100 backend

# Follow logs with timestamps
docker-compose logs -f -t backend
```

### Container Management

```bash
# Execute command in container
docker-compose exec backend bash
docker-compose exec database mysql -u root -p

# View container resource usage
docker-compose stats

# Remove stopped containers
docker-compose rm

# Pull latest images
docker-compose pull

# Build images without cache
docker-compose build --no-cache
```

---

## 🔍 Troubleshooting

### Port Already in Use

**Problem:** Port 80, 8080, or 3306 is already in use.

**Solution:**
```bash
# Check what's using the port
sudo lsof -i :80
sudo lsof -i :8080
sudo lsof -i :3306

# Kill the process or change port in docker-compose.yml
# Example: Change frontend port
ports:
  - "8081:80"  # Access at http://localhost:8081
```

### Container Won't Start

**Check Logs:**
```bash
docker-compose logs backend
```

**Common Issues:**
1. **Environment variables not set:**
   - Verify `.env` file exists
   - Check `docker-compose config` output

2. **Database not ready:**
   - Wait for database health check
   - Check: `docker-compose ps`

3. **Port conflicts:**
   - Change ports in `docker-compose.yml`

**Rebuild from scratch:**
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Issues

**Problem:** Backend can't connect to database.

**Check Database Status:**
```bash
# Check if database is healthy
docker-compose ps

# View database logs
docker-compose logs database

# Connect to database manually
docker-compose exec database mysql -u root -p
```

**Solutions:**
1. Wait for database health check to pass
2. Verify database credentials in `.env`
3. Check network connectivity:
   ```bash
   docker-compose exec backend ping database
   ```

### Frontend Can't Reach Backend

**Problem:** Frontend shows API connection errors.

**Check:**
1. Backend is running: `curl http://localhost:8080/actuator/health`
2. CORS configuration in backend
3. Frontend environment variable: `VITE_API_URL`

**Solution:**
```bash
# Rebuild frontend with correct API URL
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Out of Disk Space

**Check Disk Usage:**
```bash
docker system df
```

**Clean Up:**
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Clean everything (CAREFUL!)
docker system prune -a --volumes
```

### Container Keeps Restarting

**Check Logs:**
```bash
docker-compose logs --tail=50 backend
```

**Common Causes:**
1. Application crashes on startup
2. Health check failing
3. Missing environment variables
4. Database connection issues

**Debug:**
```bash
# Disable restart policy temporarily
docker-compose up backend --no-deps

# Run container interactively
docker-compose run --rm backend bash
```

---

## 🔒 Security Best Practices

### 1. Environment Variables

```bash
# NEVER commit .env to git
echo ".env" >> .gitignore

# Use strong passwords
DB_ROOT_PASSWORD=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 32)

# Restrict .env file permissions
chmod 600 .env
```

### 2. Container Security

```bash
# Run containers as non-root user (already configured in Dockerfile)
# Update images regularly
docker-compose pull
docker-compose up -d

# Scan images for vulnerabilities
docker scan nxtclass-backend
docker scan nxtclass-frontend
```

### 3. Network Security

```yaml
# Use internal networks (already configured)
networks:
  nxtclass-network:
    driver: bridge
    internal: true  # Prevents external access
```

### 4. Volume Security

```bash
# Backup volumes regularly
docker run --rm -v nxtclass_mysql_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/db-backup-$(date +%Y%m%d).tar.gz -C /data .

# Restore from backup
docker run --rm -v nxtclass_mysql_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/db-backup-20231030.tar.gz -C /data
```

---

## 🎯 Production Deployment

### Docker Compose Production Setup

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    environment:
      SPRING_PROFILES_ACTIVE: prod
      JPA_SHOW_SQL: false
      LOG_LEVEL: WARN
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 1G
    restart: always

  frontend:
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    restart: always
```

**Start Production:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### SSL/TLS Configuration

**Using Nginx with Let's Encrypt:**
```bash
# Install certbot
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx.conf with SSL
```

### Monitoring

**Container Stats:**
```bash
docker-compose stats
```

**Health Checks:**
```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost/health

# Database health
docker-compose exec database mysqladmin ping
```

**Logging:**
```bash
# Export logs
docker-compose logs > logs.txt

# Use external logging driver
docker-compose -f docker-compose.yml -f docker-compose.logging.yml up -d
```

---

## 📊 Performance Tuning

### Backend (Spring Boot)

**Dockerfile JVM Options:**
```dockerfile
ENV JAVA_OPTS="-Xmx1g -Xms512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
```

**docker-compose.yml:**
```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
      reservations:
        cpus: '1'
        memory: 1G
```

### Frontend (Nginx)

**nginx.conf Optimization:**
```nginx
worker_processes auto;
worker_connections 2048;

# Enable HTTP/2
listen 443 ssl http2;

# Optimize buffers
client_body_buffer_size 128k;
client_max_body_size 10m;
```

### Database (MySQL)

**docker-compose.yml:**
```yaml
database:
  command: >
    --default-authentication-plugin=mysql_native_password
    --max_connections=200
    --innodb_buffer_pool_size=512M
  deploy:
    resources:
      limits:
        memory: 1G
```

---

## 🔄 Updates and Maintenance

### Update Images

```bash
# Pull latest images
docker-compose pull

# Restart with new images
docker-compose up -d

# Remove old images
docker image prune
```

### Database Migrations

```bash
# Backup before migration
docker-compose exec database mysqldump -u root -p nxtClass108 > backup.sql

# Run migration
docker-compose exec backend bash
# Run migration scripts
```

### Rolling Updates

```bash
# Update backend without downtime
docker-compose up -d --no-deps --build backend

# Update frontend without downtime
docker-compose up -d --no-deps --build frontend
```

---

## 📝 Useful Docker Commands

### Image Management

```bash
# List images
docker images

# Remove image
docker rmi <image-id>

# Remove all unused images
docker image prune -a

# Build image manually
docker build -t nxtclass-backend ./backend
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect nxtclass_mysql_data

# Backup volume
docker run --rm -v nxtclass_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/data.tar.gz -C /data .

# Restore volume
docker run --rm -v nxtclass_mysql_data:/data -v $(pwd):/backup alpine tar xzf /backup/data.tar.gz -C /data
```

### Network Management

```bash
# List networks
docker network ls

# Inspect network
docker network inspect nxtclass_nxtclass-network

# Connect container to network
docker network connect nxtclass_nxtclass-network <container-name>
```

---

## 🆘 Getting Help

### Check Configuration

```bash
# Validate docker-compose.yml
docker-compose config

# View resolved configuration
docker-compose config --resolve-image-digests
```

### Debug Container

```bash
# Access container shell
docker-compose exec backend bash

# Run one-off command
docker-compose run --rm backend java -version

# Inspect container
docker inspect nxtclass-backend
```

### Reset Everything

```bash
# NUCLEAR OPTION: Remove everything
docker-compose down -v
docker system prune -a --volumes
docker-compose build --no-cache
docker-compose up -d
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot with Docker](https://spring.io/guides/gs/spring-boot-docker/)
- [Nginx Docker Official Image](https://hub.docker.com/_/nginx)
- [MySQL Docker Official Image](https://hub.docker.com/_/mysql)

---

**Last Updated:** 2025-10-30  
**Version:** 1.0  
**Status:** Production Ready
