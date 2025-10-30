# 🔀 Separating Frontend & Backend Repositories

Complete guide to split your monorepo into separate frontend and backend repositories with independent CI/CD.

---

## 📋 Table of Contents

1. [Why Separate Repositories?](#-why-separate-repositories)
2. [Repository Structure](#-repository-structure)
3. [Step-by-Step Separation](#-step-by-step-separation)
4. [VPS Setup for Separate Repos](#-vps-setup-for-separate-repos)
5. [CI/CD Configuration](#-cicd-configuration)
6. [Development Workflow](#-development-workflow)

---

## 🎯 Why Separate Repositories?

### Benefits

✅ **Independent Development**
- Frontend team works without backend interference
- Backend team can update APIs independently
- Different release cycles

✅ **Faster CI/CD**
- Only rebuild what changed
- Frontend changes don't rebuild backend (and vice versa)
- Parallel deployments

✅ **Better Organization**
- Clearer ownership
- Separate issue tracking
- Independent versioning

✅ **Technology Flexibility**
- Use different CI/CD tools per repo
- Different deployment strategies
- Easier to migrate technologies

---

## 📁 Repository Structure

### Current (Monorepo)
```
nxtclass/
├── src/              # Frontend
├── public/
├── backend/
│   └── src/          # Backend
├── docker-compose.yml
└── .github/workflows/
```

### After Separation

**Frontend Repository: `nxtclass-frontend`**
```
nxtclass-frontend/
├── src/
├── public/
├── package.json
├── Dockerfile
├── nginx.conf
├── docker-compose.frontend.yml
├── .github/workflows/
│   └── deploy-frontend.yml
└── .env.example
```

**Backend Repository: `nxtclass-backend`**
```
nxtclass-backend/
├── src/
├── pom.xml
├── Dockerfile
├── docker-compose.backend.yml
├── init-db.sql
├── .github/workflows/
│   └── deploy-backend.yml
└── .env.example
```

---

## 🔨 Step-by-Step Separation

### Step 1: Create Frontend Repository

```bash
# 1. Create new repo on GitHub: nxtclass-frontend

# 2. On your local machine
cd /path/to/new/location
mkdir nxtclass-frontend
cd nxtclass-frontend

# 3. Initialize git
git init
git remote add origin https://github.com/yourusername/nxtclass-frontend.git

# 4. Copy frontend files from original repo
cp -r /path/to/original/nxtclass/src ./
cp -r /path/to/original/nxtclass/public ./
cp /path/to/original/nxtclass/package*.json ./
cp /path/to/original/nxtclass/vite.config.ts ./
cp /path/to/original/nxtclass/tsconfig*.json ./
cp /path/to/original/nxtclass/tailwind.config.ts ./
cp /path/to/original/nxtclass/postcss.config.js ./
cp /path/to/original/nxtclass/index.html ./
cp /path/to/original/nxtclass/Dockerfile ./
cp /path/to/original/nxtclass/nginx.conf ./
cp /path/to/original/nxtclass/components.json ./
cp /path/to/original/nxtclass/eslint.config.js ./

# 5. Copy frontend-specific files
cp /path/to/original/nxtclass/docker-compose.frontend.yml ./docker-compose.yml
mkdir -p .github/workflows
cp /path/to/original/nxtclass/.github/workflows/deploy-frontend.yml ./.github/workflows/deploy.yml

# 6. Create .env.example
cat > .env.example << 'EOF'
# Frontend Environment Variables
VITE_API_URL=http://localhost:8080/api
EOF

# 7. Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
EOF

# 8. Create README
cat > README.md << 'EOF'
# NXT Class - Frontend

React + TypeScript + Vite frontend for NXT Class.

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy with Docker
docker-compose up -d
\`\`\`

## Environment Variables

Copy `.env.example` to `.env` and configure:
- VITE_API_URL - Backend API URL
EOF

# 9. Commit and push
git add .
git commit -m "Initial frontend repository"
git branch -M main
git push -u origin main
```

### Step 2: Create Backend Repository

```bash
# 1. Create new repo on GitHub: nxtclass-backend

# 2. On your local machine
cd /path/to/new/location
mkdir nxtclass-backend
cd nxtclass-backend

# 3. Initialize git
git init
git remote add origin https://github.com/yourusername/nxtclass-backend.git

# 4. Copy backend files from original repo
cp -r /path/to/original/nxtclass/backend/src ./
cp /path/to/original/nxtclass/backend/pom.xml ./
cp /path/to/original/nxtclass/backend/Dockerfile ./
cp /path/to/original/nxtclass/backend/init-db.sql ./
cp /path/to/original/nxtclass/backend/.dockerignore ./

# 5. Copy backend-specific files
cp /path/to/original/nxtclass/backend/docker-compose.backend.yml ./docker-compose.yml
mkdir -p .github/workflows
cp /path/to/original/nxtclass/.github/workflows/deploy-backend.yml ./.github/workflows/deploy.yml

# 6. Create .env.example
cat > .env.example << 'EOF'
# Database Configuration
MYSQL_ROOT_PASSWORD=change_me
MYSQL_DATABASE=nxtclass_db
MYSQL_USER=nxtclass_user
MYSQL_PASSWORD=change_me

# Backend Configuration
SPRING_PROFILE=prod
JWT_SECRET=change_me_to_long_random_string
CORS_ALLOWED_ORIGINS=http://localhost,http://your-vps-ip

# Deployment
SHOW_SQL=false
EOF

# 7. Create .gitignore
cat > .gitignore << 'EOF'
target/
.env
.env.local
*.log
.DS_Store
*.iml
.idea/
.vscode/
EOF

# 8. Create README
cat > README.md << 'EOF'
# NXT Class - Backend

Spring Boot backend API for NXT Class.

## Quick Start

\`\`\`bash
# Build
mvn clean package

# Run locally
mvn spring-boot:run

# Deploy with Docker
docker-compose up -d
\`\`\`

## Environment Variables

See `.env.example` for configuration options.
EOF

# 9. Commit and push
git add .
git commit -m "Initial backend repository"
git branch -M main
git push -u origin main
```

### Step 3: Verify Separation

```bash
# Check frontend repo
cd /path/to/nxtclass-frontend
ls -la
# Should see: src/, public/, package.json, Dockerfile, etc.

# Check backend repo
cd /path/to/nxtclass-backend
ls -la
# Should see: src/, pom.xml, Dockerfile, docker-compose.yml, etc.
```

---

## 🚀 VPS Setup for Separate Repos

### Architecture on VPS

```
/opt/
├── nxtclass-frontend/     # Frontend repo
│   ├── Frontend container (Port 80)
│   └── Nginx reverse proxy
│
└── nxtclass-backend/      # Backend repo
    ├── Backend container (Port 8080)
    └── MySQL container (Port 3306)
```

### Initial VPS Setup

```bash
# 1. SSH to VPS
ssh root@YOUR_VPS_IP

# 2. Install Docker & Docker Compose (if not already)
curl -fsSL https://get.docker.com | sh
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 3. Clone frontend repository
cd /opt
git clone https://github.com/yourusername/nxtclass-frontend.git
cd nxtclass-frontend

# 4. Configure frontend .env
cp .env.example .env
nano .env
# Set: VITE_API_URL=http://YOUR_VPS_IP/api

# 5. Start frontend
docker-compose up -d

# 6. Clone backend repository
cd /opt
git clone https://github.com/yourusername/nxtclass-backend.git
cd nxtclass-backend

# 7. Configure backend .env
cp .env.example .env
nano .env
# Set passwords and CORS_ALLOWED_ORIGINS=http://YOUR_VPS_IP

# 8. Start backend
docker-compose up -d

# 9. Verify both running
docker ps
# Should see: nxtclass-frontend, nxtclass-backend, nxtclass-mysql
```

### Update Nginx for Backend Proxy

Edit `/opt/nxtclass-frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;

    # Frontend files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy to backend
    location /api/ {
        proxy_pass http://YOUR_VPS_IP:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Rebuild frontend:
```bash
cd /opt/nxtclass-frontend
docker-compose build frontend
docker-compose up -d
```

---

## 🔄 CI/CD Configuration

### Setup for Both Repositories

Both repos need the same GitHub secrets:

**GitHub → Repo → Settings → Secrets and variables → Actions**

Add these secrets to **BOTH** repositories:

| Secret Name | Value |
|-------------|-------|
| `VPS_HOST` | Your VPS IP |
| `VPS_USERNAME` | `root` |
| `VPS_SSH_KEY` | Your SSH private key |
| `VPS_PORT` | `22` (optional) |

### Frontend CI/CD

File: `.github/workflows/deploy.yml` (in frontend repo)

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/nxtclass-frontend
            git pull origin main
            docker-compose build frontend
            docker-compose up -d frontend
            docker image prune -f
```

### Backend CI/CD

File: `.github/workflows/deploy.yml` (in backend repo)

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/nxtclass-backend
            git pull origin main
            docker-compose build backend
            docker-compose up -d backend
            docker image prune -f
```

### Test CI/CD

**Frontend:**
```bash
cd /path/to/nxtclass-frontend
echo "# Test" >> README.md
git add .
git commit -m "test: frontend deploy"
git push origin main
# Watch: GitHub → Actions
```

**Backend:**
```bash
cd /path/to/nxtclass-backend
echo "# Test" >> README.md
git add .
git commit -m "test: backend deploy"
git push origin main
# Watch: GitHub → Actions
```

---

## 💻 Development Workflow

### Local Development

**Terminal 1 - Backend:**
```bash
cd /path/to/nxtclass-backend
mvn spring-boot:run
# Runs on: http://localhost:8080
```

**Terminal 2 - Frontend:**
```bash
cd /path/to/nxtclass-frontend
npm run dev
# Runs on: http://localhost:5173
# Configure VITE_API_URL=http://localhost:8080/api
```

### Testing Changes

**Frontend changes:**
```bash
cd nxtclass-frontend
# Make changes
npm run dev
# Test locally
git add .
git commit -m "feat: add feature"
git push origin main
# Auto-deploys frontend only
```

**Backend changes:**
```bash
cd nxtclass-backend
# Make changes
mvn spring-boot:run
# Test locally
git add .
git commit -m "feat: add endpoint"
git push origin main
# Auto-deploys backend only
```

### Feature Branch Workflow

**Frontend feature:**
```bash
cd nxtclass-frontend
git checkout -b feature/new-ui
# Make changes
git push origin feature/new-ui
# Create PR → Merge to main → Auto-deploy
```

**Backend feature:**
```bash
cd nxtclass-backend
git checkout -b feature/new-api
# Make changes
git push origin feature/new-api
# Create PR → Merge to main → Auto-deploy
```

---

## 🎯 Quick Reference

### Local Testing

```bash
# Frontend
cd nxtclass-frontend
npm install
npm run dev

# Backend
cd nxtclass-backend
mvn spring-boot:run
```

### VPS Management

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Frontend
cd /opt/nxtclass-frontend
docker-compose ps
docker-compose logs -f frontend
docker-compose restart frontend

# Backend
cd /opt/nxtclass-backend
docker-compose ps
docker-compose logs -f backend
docker-compose restart backend
```

### Deployment

```bash
# Frontend changes
cd nxtclass-frontend
git push origin main
# Auto-deploys frontend

# Backend changes
cd nxtclass-backend
git push origin main
# Auto-deploys backend
```

---

## ✅ Advantages Summary

| Aspect | Monorepo | Separate Repos |
|--------|----------|----------------|
| **Deployment Speed** | Rebuilds everything | Rebuilds only what changed ✅ |
| **Team Independence** | Coupled | Independent ✅ |
| **CI/CD Time** | 5-10 minutes | 2-3 minutes per service ✅ |
| **Complexity** | Simple | Moderate |
| **Version Control** | Single version | Independent versions ✅ |

---

## 🚨 Important Notes

### Database Sharing

Both frontend and backend connect to the same MySQL database on the VPS:
- Database runs with backend: `/opt/nxtclass-backend`
- Frontend connects to backend API
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

### Networking

On VPS, services communicate via:
- Frontend → Backend: `http://YOUR_VPS_IP:8080/api/`
- Backend → MySQL: `mysql:3306` (Docker network)
- External access: `http://YOUR_VPS_IP`

---

## 🎉 Complete!

You now have:
- ✅ Separate frontend repository
- ✅ Separate backend repository
- ✅ Independent CI/CD pipelines
- ✅ Faster deployments
- ✅ Better organization

**Deploy independently:**
- Frontend: Push to `nxtclass-frontend/main`
- Backend: Push to `nxtclass-backend/main`

**Access application:** `http://YOUR_VPS_IP`
