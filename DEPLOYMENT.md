# 🚀 NXT Class - Deployment Guide (Hostinger + Docker)

This guide will help you deploy the NXT Class application to Hostinger using Docker and docker-compose.

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ Hostinger VPS account with SSH access
- ✅ Domain or subdomain pointed to your Hostinger VPS IP
- ✅ Docker and Docker Compose installed on the VPS
- ✅ Git installed on the VPS
- ✅ Minimum 2GB RAM, 20GB Storage

---

## 🛠️ Step 1: Setup Hostinger VPS

### 1.1 Connect to Your VPS via SSH

```bash
ssh root@your-vps-ip-address
```

### 1.2 Update System

```bash
apt update && apt upgrade -y
```

### 1.3 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Start Docker service
systemctl start docker
systemctl enable docker

# Verify installation
docker --version
```

### 1.4 Install Docker Compose

```bash
# Download Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 1.5 Install Git

```bash
apt install git -y
git --version
```

---

## 📦 Step 2: Clone Your Repository

```bash
# Navigate to your preferred directory
cd /opt

# Clone your monorepo (contains both frontend and backend)
git clone https://github.com/yourusername/your-repo-name.git nxtclass

# Navigate to project directory
cd nxtclass

# Verify structure
ls -la
# You should see: src/, backend/, docker-compose.yml, etc.
```

---

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Create .env file

```bash
# Copy example env file
cp .env.example .env

# Edit the .env file
nano .env
```

### 3.2 Update Environment Variables

**Important: Change these values for production!**

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=your_strong_root_password_here
MYSQL_DATABASE=nxtclass_db
MYSQL_USER=nxtclass_user
MYSQL_PASSWORD=your_strong_db_password_here

# Backend Configuration
SPRING_PROFILE=prod
JWT_SECRET=your-super-long-random-jwt-secret-key-min-64-chars
CORS_ALLOWED_ORIGINS=http://yourdomain.com,https://yourdomain.com

# Frontend Configuration
# Replace with your actual domain
VITE_API_URL=https://yourdomain.com/api

# N8N Configuration (Optional)
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_strong_n8n_password

# Domain Configuration
DOMAIN_NAME=nxtclass.yourdomain.com
LETSENCRYPT_EMAIL=your-email@example.com
```

**Press CTRL+X, then Y, then ENTER to save**

---

## 🏗️ Step 4: Build and Deploy

### 4.1 Build Docker Images

```bash
# Build all services
docker-compose build

# This will take 5-10 minutes on first build
```

### 4.2 Start All Services

```bash
# Start without n8n
docker-compose up -d

# OR Start with n8n (optional)
docker-compose --profile with-n8n up -d
```

### 4.3 Check Service Status

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

---

## 🌐 Step 5: Configure Domain & SSL (Optional but Recommended)

### Option A: Using Nginx Proxy Manager (Recommended)

```bash
# Install Nginx Proxy Manager
cd /opt
git clone https://github.com/NginxProxyManager/nginx-proxy-manager.git npm
cd npm
docker-compose up -d

# Access NPM at http://your-vps-ip:81
# Default credentials:
# Email: admin@example.com
# Password: changeme
```

**Configure in NPM:**
1. Add Proxy Host
2. Domain: yourdomain.com
3. Forward to: nxtclass-frontend:80
4. Enable SSL (Let's Encrypt)

### Option B: Manual SSL with Certbot

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Stop nginx container temporarily
docker-compose stop frontend

# Get SSL certificate
certbot certonly --standalone -d yourdomain.com

# Restart frontend
docker-compose start frontend
```

---

## 🔍 Step 6: Verify Deployment

### 6.1 Check Application Health

```bash
# Test backend health
curl http://localhost:8080/actuator/health

# Test frontend
curl http://localhost/health

# Test MySQL connection
docker-compose exec mysql mysql -u nxtclass_user -p
```

### 6.2 Access Your Application

- **Frontend**: http://yourdomain.com or http://your-vps-ip
- **Backend API**: http://yourdomain.com/api
- **n8n (if enabled)**: http://yourdomain.com:5678

### 6.3 Test Login

1. Navigate to http://yourdomain.com
2. Login with default credentials (if you have seed data)
3. Verify dashboard loads

---

## 🔧 Step 7: Useful Management Commands

### Docker Commands

```bash
# Stop all services
docker-compose down

# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend

# View logs
docker-compose logs -f --tail=100

# Remove all containers and volumes (⚠️ WARNING: Deletes data!)
docker-compose down -v

# Update application
git pull origin main
docker-compose build
docker-compose up -d
```

### Database Backup

```bash
# Create backup
docker-compose exec mysql mysqldump -u root -p nxtclass_db > backup_$(date +%Y%m%d).sql

# Restore backup
docker-compose exec -T mysql mysql -u root -p nxtclass_db < backup_20241030.sql
```

### View Container Resources

```bash
# View resource usage
docker stats

# View disk usage
docker system df
```

---

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Database connection failed - Check MySQL is running
docker-compose ps mysql

# 2. Port already in use - Stop conflicting service
sudo lsof -i :8080
sudo kill -9 <PID>
```

### Frontend Won't Load

```bash
# Check logs
docker-compose logs frontend

# Rebuild frontend with correct API URL
docker-compose build frontend --no-cache
docker-compose up -d frontend
```

### Database Connection Issues

```bash
# Check MySQL logs
docker-compose logs mysql

# Connect to MySQL container
docker-compose exec mysql bash
mysql -u root -p

# Check user permissions
SHOW GRANTS FOR 'nxtclass_user'@'%';
```

### Reset Everything

```bash
# ⚠️ WARNING: This deletes all data!
docker-compose down -v
docker system prune -a
docker volume prune
docker-compose up -d --build
```

---

## 🔒 Security Best Practices

### 1. Change Default Passwords

- ✅ MySQL root password
- ✅ MySQL user password
- ✅ JWT secret
- ✅ n8n admin password

### 2. Configure Firewall

```bash
# Install UFW
apt install ufw -y

# Allow SSH
ufw allow 22/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow n8n (optional)
ufw allow 5678/tcp

# Enable firewall
ufw enable
```

### 3. Setup SSL Certificate

Always use HTTPS in production. Use Option A or B from Step 5.

### 4. Regular Backups

```bash
# Create backup script
nano /opt/backup.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cd /opt/nxtclass
docker-compose exec -T mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD nxtclass_db > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Make executable and add to crontab:
```bash
chmod +x /opt/backup.sh
crontab -e
# Add: 0 2 * * * /opt/backup.sh
```

---

## 📊 Monitoring

### Setup Monitoring (Optional)

```bash
# Add monitoring services to docker-compose.yml
# Use Prometheus + Grafana or similar tools
```

### Check Service Health

```bash
# Create health check script
nano /opt/health-check.sh
```

Add:
```bash
#!/bin/bash
services=("frontend" "backend" "mysql")

for service in "${services[@]}"; do
    if docker-compose ps | grep $service | grep -q "Up"; then
        echo "✅ $service is running"
    else
        echo "❌ $service is down"
        docker-compose restart $service
    fi
done
```

---

## 🎯 Quick Start Commands

```bash
# One-time setup
git clone <repo> nxtclass && cd nxtclass
cp .env.example .env
nano .env  # Update with your values
docker-compose build
docker-compose up -d

# Daily operations
docker-compose ps                    # Check status
docker-compose logs -f              # View logs
docker-compose restart backend      # Restart service
docker-compose down && docker-compose up -d  # Full restart

# Updates
git pull origin main
docker-compose build
docker-compose up -d
```

---

## 📞 Support

If you encounter any issues:

1. Check logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure ports are not in use: `netstat -tuln | grep -E '80|8080|3306'`
4. Check container health: `docker-compose ps`

---

## 📝 Next Steps

1. ✅ Complete deployment
2. ✅ Configure SSL certificate
3. ✅ Setup automated backups
4. ✅ Configure monitoring
5. ✅ Test all features
6. ✅ Share URL with reviewers

**Your application will be accessible at: http://yourdomain.com**

---

## 🎉 Congratulations!

Your NXT Class application is now deployed and ready for review! 🚀

Share this URL with your reviewers: **http://yourdomain.com**
