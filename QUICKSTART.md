# 🚀 Quick Start Guide - NXT Class

Get your application running in **5 minutes**!

## For Local Testing (Development)

```bash
# 1. Clone the repository
git clone <your-repo-url> nxtclass
cd nxtclass

# 2. Create environment file
cp .env.example .env

# 3. Start everything (first time - takes 5-10 mins)
./deploy.sh
# Choose option 1 (Fresh deployment)

# 4. Access your application
# Frontend: http://localhost
# Backend API: http://localhost:8080/api
# n8n: http://localhost:5678
```

## For Hostinger VPS Deployment

### One-Time Setup (15 minutes)

```bash
# 1. SSH into your Hostinger VPS
ssh root@your-vps-ip

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# 3. Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. Clone your repository
cd /opt
git clone <your-repo-url> nxtclass
cd nxtclass

# 5. Configure environment
cp .env.example .env
nano .env
# UPDATE these values:
#   - All passwords (make them strong!)
#   - VITE_API_URL=http://your-domain.com/api
#   - CORS_ALLOWED_ORIGINS=http://your-domain.com
#   - DOMAIN_NAME=your-domain.com

# 6. Deploy
./deploy.sh
# Choose option 1

# 7. Wait 2-3 minutes for services to start
docker-compose ps

# 8. Test
curl http://localhost/health
```

### Access Your Application

- **Application**: http://your-vps-ip or http://your-domain.com
- **Backend API**: http://your-domain.com/api
- **n8n**: http://your-domain.com:5678

## Daily Commands

```bash
# View status
docker-compose ps

# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Stop application
docker-compose down

# Update application
git pull origin main
docker-compose build
docker-compose up -d
```

## Default Credentials

⚠️ **No default user accounts are created. You need to:**

1. Use the backend API to create your first admin user, OR
2. Insert a user directly into the database, OR
3. Modify your backend to create a default admin on startup

## Testing the Deployment

```bash
# Test backend health
curl http://localhost:8080/actuator/health

# Test frontend
curl http://localhost/health

# Test API endpoint
curl http://localhost/api/student-details/list
```

## Troubleshooting

### Services won't start?

```bash
# Check logs
docker-compose logs -f

# Restart everything
docker-compose down
docker-compose up -d
```

### Can't access from browser?

1. Check firewall: `ufw status`
2. Check ports are open: `netstat -tuln | grep -E '80|8080'`
3. Check containers are running: `docker-compose ps`

### Backend can't connect to database?

```bash
# Check MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

## 🎯 Share with Reviewers

Once deployed, share this information:

**Application URL**: http://your-domain.com  
**Test Accounts**: (You need to create these)  
**Documentation**: Share this file

## 📞 Need Help?

Check the full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**That's it! Your application is now running and ready for review! 🎉**
