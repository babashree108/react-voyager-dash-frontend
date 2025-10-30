# 🚀 Quick Start: Separate Frontend & Backend

**Split your monorepo in 15 minutes**

---

## 🎯 What You'll Get

```
Current (1 repo):               After (2 repos):
nxtclass/                       nxtclass-frontend/
├── src/                        ├── src/
├── backend/                    └── ...
└── ...                         
                                nxtclass-backend/
                                ├── src/
                                └── ...
```

**Benefits:**
- ✅ Frontend and backend deploy independently
- ✅ Faster CI/CD (only rebuild what changed)
- ✅ Better team separation
- ✅ Cleaner organization

---

## 🚀 Option 1: Automated Split (Easiest)

### Step 1: Run Split Script

```bash
# In your current monorepo
./split-repositories.sh

# Follow prompts:
# - GitHub username
# - Frontend repo name (default: nxtclass-frontend)
# - Backend repo name (default: nxtclass-backend)
# - Working directory
```

### Step 2: Create GitHub Repositories

Go to: https://github.com/new

Create two repositories:
1. `nxtclass-frontend`
2. `nxtclass-backend`

**Important:** Keep them **empty** (no README, no .gitignore)

### Step 3: Push to GitHub

```bash
# Push frontend
cd ../nxtclass-frontend
git branch -M main
git push -u origin main

# Push backend
cd ../nxtclass-backend
git branch -M main
git push -u origin main
```

### Step 4: Setup VPS

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Setup frontend
cd /opt
git clone https://github.com/yourusername/nxtclass-frontend.git
cd nxtclass-frontend
cp .env.example .env
nano .env  # Set VITE_API_URL=http://YOUR_VPS_IP/api
docker-compose up -d

# Setup backend
cd /opt
git clone https://github.com/yourusername/nxtclass-backend.git
cd nxtclass-backend
cp .env.example .env
nano .env  # Set passwords and CORS
docker-compose up -d
```

### Step 5: Configure CI/CD

Add GitHub secrets to **BOTH** repositories:

**GitHub → Repository → Settings → Secrets and variables → Actions**

| Secret | Value |
|--------|-------|
| `VPS_HOST` | Your VPS IP |
| `VPS_USERNAME` | `root` |
| `VPS_SSH_KEY` | Your SSH private key |

### Step 6: Test

```bash
# Test frontend deploy
cd /path/to/nxtclass-frontend
echo "# Test" >> README.md
git add .
git commit -m "test: frontend deploy"
git push origin main
# Watch: GitHub → Actions

# Test backend deploy
cd /path/to/nxtclass-backend
echo "# Test" >> README.md
git add .
git commit -m "test: backend deploy"
git push origin main
# Watch: GitHub → Actions
```

**Done! ✅**

---

## 📋 Option 2: Manual Split (More Control)

### Frontend Repository

```bash
# Create directory
mkdir nxtclass-frontend
cd nxtclass-frontend
git init

# Copy files from monorepo
cp -r /path/to/monorepo/src ./
cp -r /path/to/monorepo/public ./
cp /path/to/monorepo/package*.json ./
cp /path/to/monorepo/vite.config.ts ./
cp /path/to/monorepo/tsconfig*.json ./
cp /path/to/monorepo/Dockerfile ./
cp /path/to/monorepo/nginx.conf ./

# Copy config
cp /path/to/monorepo/docker-compose.frontend.yml ./docker-compose.yml
mkdir -p .github/workflows
cp /path/to/monorepo/.github/workflows/deploy-frontend.yml ./.github/workflows/deploy.yml

# Create .env.example
echo "VITE_API_URL=http://localhost:8080/api" > .env.example

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
EOF

# Commit
git add .
git commit -m "Initial frontend repository"

# Push to GitHub
git remote add origin https://github.com/yourusername/nxtclass-frontend.git
git branch -M main
git push -u origin main
```

### Backend Repository

```bash
# Create directory
mkdir nxtclass-backend
cd nxtclass-backend
git init

# Copy files from monorepo
cp -r /path/to/monorepo/backend/src ./
cp /path/to/monorepo/backend/pom.xml ./
cp /path/to/monorepo/backend/Dockerfile ./
cp /path/to/monorepo/backend/init-db.sql ./

# Copy config
cp /path/to/monorepo/backend/docker-compose.backend.yml ./docker-compose.yml
mkdir -p .github/workflows
cp /path/to/monorepo/.github/workflows/deploy-backend.yml ./.github/workflows/deploy.yml

# Create .env.example
cat > .env.example << 'EOF'
MYSQL_ROOT_PASSWORD=change_me
MYSQL_DATABASE=nxtclass_db
MYSQL_USER=nxtclass_user
MYSQL_PASSWORD=change_me
JWT_SECRET=change_me
CORS_ALLOWED_ORIGINS=http://localhost
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
target/
.env
*.log
EOF

# Commit
git add .
git commit -m "Initial backend repository"

# Push to GitHub
git remote add origin https://github.com/yourusername/nxtclass-backend.git
git branch -M main
git push -u origin main
```

---

## 🎯 After Separation: Your New Workflow

### Frontend Changes

```bash
cd nxtclass-frontend
# Make changes
git add .
git commit -m "feat: new UI"
git push origin main
# ✅ Only frontend rebuilds and deploys
```

### Backend Changes

```bash
cd nxtclass-backend
# Make changes
git add .
git commit -m "feat: new API"
git push origin main
# ✅ Only backend rebuilds and deploys
```

### Local Development

**Terminal 1 - Backend:**
```bash
cd nxtclass-backend
mvn spring-boot:run
# Runs on: http://localhost:8080
```

**Terminal 2 - Frontend:**
```bash
cd nxtclass-frontend
npm run dev
# Runs on: http://localhost:5173
```

---

## 🔍 Verify Everything Works

### On VPS

```bash
ssh root@YOUR_VPS_IP

# Check frontend
cd /opt/nxtclass-frontend
docker-compose ps
curl http://localhost/health

# Check backend
cd /opt/nxtclass-backend
docker-compose ps
curl http://localhost:8080/actuator/health
```

### From Browser

- **Application:** http://YOUR_VPS_IP
- **Backend API:** http://YOUR_VPS_IP/api
- **Health Check:** http://YOUR_VPS_IP/health

---

## 📊 Deployment Comparison

| Aspect | Monorepo | Separate Repos |
|--------|----------|----------------|
| **Frontend change** | Rebuilds both (5-10 min) | Rebuilds frontend only (2-3 min) ✅ |
| **Backend change** | Rebuilds both (5-10 min) | Rebuilds backend only (3-5 min) ✅ |
| **CI/CD complexity** | Simple | Moderate |
| **Team independence** | Low | High ✅ |

---

## 🚨 Important Notes

### Database Location

The MySQL database runs with the **backend**:
- Location: `/opt/nxtclass-backend/`
- Frontend connects to backend API only
- No direct frontend-database connection

### Environment Variables

**Frontend `.env`:**
```env
VITE_API_URL=http://YOUR_VPS_IP/api
```

**Backend `.env`:**
```env
MYSQL_PASSWORD=your_password
JWT_SECRET=your_secret
CORS_ALLOWED_ORIGINS=http://YOUR_VPS_IP
```

### Nginx Configuration

Frontend nginx proxies API calls to backend:

```nginx
# In frontend nginx.conf
location /api/ {
    proxy_pass http://YOUR_VPS_IP:8080/api/;
    # ... proxy settings
}
```

---

## 📚 Full Documentation

For detailed instructions, see:
- **[SEPARATE_REPOS.md](./SEPARATE_REPOS.md)** - Complete guide

---

## ✅ Checklist

After separation:

- [ ] Frontend repo created on GitHub
- [ ] Backend repo created on GitHub
- [ ] Both repos cloned to VPS
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] GitHub secrets configured for both
- [ ] CI/CD tested for both repos
- [ ] Application works at http://YOUR_VPS_IP

---

## 🎉 You're Done!

Your repositories are now separated!

**Frontend:** Push to `nxtclass-frontend/main` → Deploys frontend  
**Backend:** Push to `nxtclass-backend/main` → Deploys backend

**Access:** http://YOUR_VPS_IP
