# 🚀 NXT Class - Docker Deployment Package

## 📦 What's Included

This repository now includes complete Docker deployment configuration:

### Configuration Files

- ✅ **Dockerfile** (Frontend) - Multi-stage build with Nginx
- ✅ **backend/Dockerfile** (Backend) - Multi-stage build with Maven
- ✅ **docker-compose.yml** - Main orchestration file
- ✅ **docker-compose.prod.yml** - Production overrides
- ✅ **nginx.conf** - Nginx reverse proxy configuration
- ✅ **.env.example** - Environment variables template
- ✅ **backend/init-db.sql** - Database initialization

### Documentation

- 📖 **DEPLOYMENT.md** - Complete deployment guide (15 mins read)
- 📖 **QUICKSTART.md** - Quick start guide (5 mins)

### Helper Scripts

- 🔧 **deploy.sh** - Interactive deployment script

## 🎯 Three Ways to Deploy

### Option 1: Quick Local Test (5 minutes)

```bash
# 1. Setup
cp .env.example .env
./deploy.sh
# Choose option 1

# 2. Access
open http://localhost
```

### Option 2: Hostinger VPS (15 minutes)

Follow the complete guide: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

```bash
# On your VPS
git clone <repo> nxtclass && cd nxtclass
cp .env.example .env
nano .env  # Edit with your values
./deploy.sh
```

### Option 3: Manual Docker Commands

```bash
# Setup
cp .env.example .env
# Edit .env file

# Build and run
docker-compose build
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

## 🌐 Architecture Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Nginx (Port 80)│  Frontend + Reverse Proxy
│  React/Vite     │
└────────┬────────┘
         │
         │ /api/* → 
         ▼
┌─────────────────┐
│  Spring Boot    │  Backend API
│  (Port 8080)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MySQL 8.0      │  Database
│  (Port 3306)    │
└─────────────────┘

Optional:
┌─────────────────┐
│  n8n            │  Workflow Automation
│  (Port 5678)    │
└─────────────────┘
```

## 📊 Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 80 | React app with Nginx |
| Backend | 8080 | Spring Boot API |
| MySQL | 3306 | Database |
| n8n | 5678 | Workflow automation (optional) |

## 🔒 Security Features

- ✅ Non-root user in containers
- ✅ Health checks for all services
- ✅ Nginx security headers
- ✅ CORS configuration
- ✅ JWT authentication
- ✅ Environment-based secrets
- ✅ Docker network isolation

## 📝 Environment Variables

Key variables to configure in `.env`:

```env
# Database
MYSQL_ROOT_PASSWORD=your_strong_password
MYSQL_DATABASE=nxtclass_db
MYSQL_USER=nxtclass_user
MYSQL_PASSWORD=your_db_password

# Backend
JWT_SECRET=your_long_random_secret_key
CORS_ALLOWED_ORIGINS=http://yourdomain.com

# Frontend
VITE_API_URL=http://yourdomain.com/api

# n8n (Optional)
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_n8n_password
```

## 🛠️ Management Commands

```bash
# Status
docker-compose ps

# Logs
docker-compose logs -f
docker-compose logs -f backend

# Restart
docker-compose restart
docker-compose restart backend

# Stop
docker-compose down

# Update
git pull
docker-compose build
docker-compose up -d

# Backup Database
docker-compose exec mysql mysqldump -u root -p nxtclass_db > backup.sql
```

## 🎯 For Reviewers

After deployment, share:

1. **Application URL**: http://your-domain.com
2. **Test Credentials**: (Create admin user first)
3. **API Documentation**: http://your-domain.com/api

## 📋 Pre-deployment Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Update all passwords in `.env`
- [ ] Set correct domain in `VITE_API_URL`
- [ ] Set correct domain in `CORS_ALLOWED_ORIGINS`
- [ ] Verify Docker and Docker Compose are installed
- [ ] Ensure ports 80, 8080, 3306 are available
- [ ] Point domain DNS to VPS IP (if using domain)

## 🚨 Common Issues

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :80
sudo lsof -i :8080

# Kill the process or change ports in docker-compose.yml
```

### Backend Can't Connect to Database

- Check `.env` database credentials match
- Wait 30 seconds for MySQL to fully start
- Check logs: `docker-compose logs mysql`

### Frontend Shows API Errors

- Verify `VITE_API_URL` in `.env`
- Rebuild frontend: `docker-compose build frontend`
- Check backend is running: `docker-compose ps backend`

## 📞 Support Resources

- **Full Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)
- **Troubleshooting**: See DEPLOYMENT.md Section 8

## 🎉 Next Steps

1. Deploy using one of the three options above
2. Create your first admin user
3. Test all features
4. Share URL with reviewers
5. Configure SSL certificate (for production)
6. Setup automated backups

---

**Ready to deploy? Start with [QUICKSTART.md](./QUICKSTART.md)** 🚀
