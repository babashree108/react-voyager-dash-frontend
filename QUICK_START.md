# Quick Start Guide - Cloud Deployment

## 🚀 Fastest Way to Deploy (Railway - 15 minutes)

### Prerequisites
- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- Your code pushed to GitHub

---

## Step 1: Prepare Your Code (5 minutes)

### 1.1 Enable PostgreSQL in Backend
Edit `backend/pom.xml` and uncomment lines 48-52:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 1.2 Commit and Push Changes
```bash
git add .
git commit -m "Prepare for cloud deployment"
git push origin main
```

---

## Step 2: Deploy Backend to Railway (5 minutes)

### 2.1 Create Railway Project
1. Go to [railway.app](https://railway.app) and login
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your repository

### 2.2 Add PostgreSQL Database
1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create and connect the database

### 2.3 Configure Backend Service
1. Click on your backend service
2. Go to **"Settings"** → **"Environment Variables"**
3. Add these variables:

```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=PUT_YOUR_SECURE_JWT_SECRET_HERE
FRONTEND_URL=https://your-app.up.railway.app
```

**Generate JWT Secret:**
```bash
openssl rand -base64 64
```

### 2.4 Configure Build Settings
1. In backend service settings
2. Go to **"Settings"** → **"Deploy"**
3. Set **"Root Directory"** to: `backend`
4. Railway will auto-detect Dockerfile and build

### 2.5 Get Backend URL
1. Click on backend service
2. Go to **"Settings"** → **"Networking"**
3. Click **"Generate Domain"**
4. Copy your backend URL (e.g., `https://your-backend.up.railway.app`)

---

## Step 3: Deploy Frontend to Railway (5 minutes)

### 3.1 Create Frontend Service
1. In Railway dashboard, click **"+ New"**
2. Select **"GitHub Repo"** → Choose same repository
3. Railway will create a new service

### 3.2 Configure Frontend Service
1. Click on frontend service
2. Go to **"Settings"** → **"Environment Variables"**
3. Add:

```
VITE_API_URL=https://your-backend.up.railway.app/api
```
(Replace with your actual backend URL from Step 2.5)

### 3.3 Configure Build Settings
1. In frontend service settings
2. **"Root Directory"**: Leave empty (or set to `/`)
3. Railway will auto-detect and use `railway.json` configuration

### 3.4 Update CORS
1. Go back to backend service
2. Update `FRONTEND_URL` environment variable
3. Set it to your frontend URL (from **"Settings"** → **"Networking"** → **"Generate Domain"**)

### 3.5 Redeploy Backend
1. Click on backend service
2. Go to **"Deployments"**
3. Click **"⋮"** menu on latest deployment
4. Click **"Redeploy"**

---

## Step 4: Test Your Deployment

### 4.1 Check Backend Health
```bash
curl https://your-backend.up.railway.app/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### 4.2 Test Frontend
1. Open your frontend URL in browser
2. Try to login with demo credentials
3. Check if data loads properly

---

## Alternative: Deploy with Docker Compose Locally (5 minutes)

If you want to test everything locally first:

```bash
# 1. Navigate to project root
cd /workspace

# 2. Build and start all services
docker-compose up --build

# 3. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# Database: localhost:5432
```

To stop:
```bash
docker-compose down
```

To clean up (remove volumes):
```bash
docker-compose down -v
```

---

## Troubleshooting

### Backend Not Starting
**Check logs:**
1. Railway Dashboard → Backend Service → "Deployments"
2. Click on latest deployment to view logs

**Common issues:**
- Missing environment variables → Add them in Settings
- Database not connected → Check `DATABASE_URL` format
- Wrong Java version → Railway uses Java 17 automatically

### Frontend Not Loading
**Check:**
1. Is `VITE_API_URL` set correctly?
2. Does backend URL end without trailing slash?
3. Is backend service running?

### CORS Errors
**Fix:**
1. Update backend `FRONTEND_URL` to exact frontend URL
2. Include `https://` protocol
3. No trailing slash
4. Redeploy backend

### Database Connection Failed
**Check:**
1. Is PostgreSQL database running in Railway?
2. Are database environment variables referenced correctly?
3. Format: `${{Postgres.DATABASE_URL}}` in Railway

---

## Environment Variable Reference

### Backend (Railway)
```env
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=your-generated-secret-here
FRONTEND_URL=https://your-frontend.up.railway.app
```

### Frontend (Railway)
```env
VITE_API_URL=https://your-backend.up.railway.app/api
```

---

## Cost Estimation

### Railway Pricing
- **Free Trial**: $5 credit per month
- **Developer Plan**: $5/month per user (includes $5 credit)
- **Team Plan**: $20/month per user (includes $10 credit)

**Estimated Usage:**
- Backend: ~$2-3/month
- Frontend: ~$1-2/month
- PostgreSQL: ~$3-5/month
- **Total**: ~$6-10/month

### Tips to Save Money
1. Use Railway's free trial to test
2. Set resource limits in Railway settings
3. Use sleep mode for non-critical services
4. Monitor usage in Railway dashboard

---

## Next Steps

1. ✅ Deploy to Railway
2. 🔐 Set up custom domain (optional)
3. 📊 Monitor logs and metrics
4. 🔄 Set up automatic deployments (already enabled by default)
5. 🔒 Review security settings
6. 📝 Add database backups
7. 📈 Set up monitoring/alerts

---

## Support

Need help? Check:
- [Railway Docs](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- Full deployment guide: `DEPLOYMENT_GUIDE.md`

---

## Quick Commands Cheat Sheet

```bash
# Generate JWT secret
openssl rand -base64 64

# Test backend locally with prod profile
cd backend
export SPRING_PROFILES_ACTIVE=prod
export DATABASE_URL=jdbc:postgresql://localhost:5432/nxtclass
mvn spring-boot:run

# Build frontend for production
npm run build

# Test production build locally
npm run preview

# Docker: Start all services
docker-compose up -d

# Docker: View logs
docker-compose logs -f

# Docker: Stop all services
docker-compose down
```

---

Good luck! 🚀 Your app should be live in about 15 minutes!
