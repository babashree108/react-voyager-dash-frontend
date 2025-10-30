# 📁 Monorepo Structure with Independent Deployments

**One repository, independent frontend and backend deployments**

---

## 🎯 Overview

Your repository is structured as a **monorepo** with clear separation:

```
nxtclass/                          # One Git repository
├── frontend/                      # Frontend folder
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── backend/                       # Backend folder
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── docker-compose.yml             # Orchestrates all services
└── .github/workflows/
    ├── deploy-frontend.yml        # Deploys only on frontend changes
    └── deploy-backend.yml         # Deploys only on backend changes
```

---

## ✨ How It Works

### Smart Path-Based Deployment

GitHub Actions monitors which files changed:

**Frontend changes** (`frontend/**`):
```bash
# You change: frontend/src/components/Dashboard.tsx
git push origin main
# Result: ✅ Only frontend rebuilds and deploys (2-3 min)
#         ⏭️  Backend unchanged, keeps running
```

**Backend changes** (`backend/**`):
```bash
# You change: backend/src/main/java/Controller.java
git push origin main
# Result: ✅ Only backend rebuilds and deploys (3-5 min)
#         ⏭️  Frontend unchanged, keeps running
```

**Both changed**:
```bash
# You change files in both frontend/ and backend/
git push origin main
# Result: ✅ Both deploy in parallel
```

---

## 🚀 Current Setup (No Changes Needed)

Your repository is **already structured correctly**:

```
nxtclass/
├── src/              → Move to frontend/src/
├── public/           → Move to frontend/public/
├── backend/          → Already in backend/ ✅
└── ...
```

### Option 1: Reorganize Structure (Recommended)

```bash
# In your repository
mkdir -p frontend
mv src frontend/
mv public frontend/
mv package*.json frontend/
mv vite.config.ts frontend/
mv tsconfig*.json frontend/
mv tailwind.config.ts frontend/
mv postcss.config.js frontend/
mv index.html frontend/
mv components.json frontend/
mv eslint.config.js frontend/

# backend/ already exists, no changes needed

# Update paths in docker-compose.yml
# See below for configuration
```

### Option 2: Keep Current Structure

If you prefer to keep `src/` and `public/` at root:

**Update workflow paths:**

`.github/workflows/deploy-frontend.yml`:
```yaml
paths:
  - 'src/**'
  - 'public/**'
  - 'package.json'
  - 'vite.config.ts'
  - 'Dockerfile'
  - 'nginx.conf'
```

`.github/workflows/deploy-backend.yml`:
```yaml
paths:
  - 'backend/**'
```

---

## 📝 Updated Docker Compose (If Reorganizing)

If you move files to `frontend/` folder:

```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    # ... existing MySQL config

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    # ... rest of backend config

  frontend:
    build:
      context: ./frontend    # Changed from .
      dockerfile: Dockerfile
    # ... rest of frontend config
```

**Update frontend Dockerfile:**

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .                    # Copies from frontend/ directory
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔄 Development Workflow

### Current Structure (src/ at root)

```bash
# Frontend changes
cd /path/to/nxtclass
# Edit files in src/
git add src/
git commit -m "feat: update UI"
git push origin main
# ✅ Only frontend deploys

# Backend changes
cd /path/to/nxtclass
# Edit files in backend/src/
git add backend/
git commit -m "feat: add API"
git push origin main
# ✅ Only backend deploys
```

### Reorganized Structure (frontend/ folder)

```bash
# Frontend changes
cd /path/to/nxtclass
# Edit files in frontend/src/
git add frontend/
git commit -m "feat: update UI"
git push origin main
# ✅ Only frontend deploys

# Backend changes
cd /path/to/nxtclass
# Edit files in backend/src/
git add backend/
git commit -m "feat: add API"
git push origin main
# ✅ Only backend deploys
```

---

## 🧪 Local Testing

### Current Structure

```bash
# Terminal 1 - Backend
cd /path/to/nxtclass/backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd /path/to/nxtclass
npm install
npm run dev
```

### Reorganized Structure

```bash
# Terminal 1 - Backend
cd /path/to/nxtclass/backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd /path/to/nxtclass/frontend
npm install
npm run dev
```

---

## 📊 Deployment Comparison

| Change | Monorepo (Smart Deploy) | Separate Repos |
|--------|------------------------|----------------|
| **Frontend only** | 2-3 min ✅ | 2-3 min ✅ |
| **Backend only** | 3-5 min ✅ | 3-5 min ✅ |
| **Both** | 5-8 min (parallel) | 5-8 min (separate) |
| **Repository Management** | One repo ✅ | Two repos to sync |
| **Complexity** | Simple ✅ | Moderate |

---

## ✅ Advantages of Monorepo

### Why Keep One Repo?

✅ **Simpler Management**
- One repository to clone
- One place for issues
- One place for PRs
- Easier to keep in sync

✅ **Atomic Commits**
- Change frontend and backend together
- Single commit for full features
- Easier code reviews

✅ **Shared Configuration**
- One .gitignore
- One CI/CD setup
- Shared documentation

✅ **Smart Deployment**
- Only rebuilds what changed
- Path-based triggers
- Same speed as separate repos

---

## 🎯 Recommended Approach

### Option A: Keep Current Structure ⭐ (Easiest)

**No restructuring needed!**

1. Workflows already configured for current structure
2. Paths already set correctly
3. Just push and deploy

**Workflow paths:**
- Frontend: `src/**`, `public/**`, `package.json`, etc.
- Backend: `backend/**`

### Option B: Reorganize to frontend/ folder

**Better long-term organization**

1. Move frontend files to `frontend/` folder
2. Update docker-compose.yml context paths
3. Update Dockerfile paths
4. Clearer separation

**Structure:**
```
nxtclass/
├── frontend/     # All frontend code
├── backend/      # All backend code
└── ...
```

---

## 🚀 Quick Start (No Changes Needed)

Your current setup already works!

### Test Frontend Deployment

```bash
# Make a change to frontend
echo "// test" >> src/App.tsx

git add src/App.tsx
git commit -m "test: frontend deploy"
git push origin main

# Watch: GitHub → Actions → Deploy Frontend to VPS
# Only frontend rebuilds (2-3 min)
```

### Test Backend Deployment

```bash
# Make a change to backend
echo "// test" >> backend/src/main/java/com/nxtclass/BackendApplication.java

git add backend/
git commit -m "test: backend deploy"
git push origin main

# Watch: GitHub → Actions → Deploy Backend to VPS
# Only backend rebuilds (3-5 min)
```

---

## 📁 File Structure Options

### Option 1: Current (Works Now) ⭐

```
nxtclass/
├── src/                    # Frontend source
├── public/                 # Frontend public
├── package.json           # Frontend deps
├── backend/               # Backend code
│   ├── src/
│   └── pom.xml
├── Dockerfile            # Frontend Dockerfile
├── backend/Dockerfile    # Backend Dockerfile
└── docker-compose.yml
```

**Pros:**
- ✅ No changes needed
- ✅ Works right now
- ✅ Familiar structure

### Option 2: Reorganized (Better)

```
nxtclass/
├── frontend/              # All frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── backend/               # All backend
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
└── docker-compose.yml
```

**Pros:**
- ✅ Clearer separation
- ✅ Easier to navigate
- ✅ Better organization

---

## 🔧 Configuration Summary

### GitHub Actions Workflows

**Already configured for you:**

`.github/workflows/deploy-frontend.yml`:
- Triggers on: `frontend/**` changes (or current paths)
- Rebuilds: Frontend container only
- Time: 2-3 minutes

`.github/workflows/deploy-backend.yml`:
- Triggers on: `backend/**` changes
- Rebuilds: Backend container only
- Time: 3-5 minutes

### VPS Setup

**Single clone, all services:**

```bash
# On VPS
cd /opt
git clone https://github.com/yourusername/nxtclass.git
cd nxtclass

# Configure
cp .env.example .env
nano .env

# Deploy everything
docker-compose up -d

# All services running:
# - Frontend (Port 80)
# - Backend (Port 8080)
# - MySQL (Port 3306)
```

---

## 🎉 Benefits Summary

✅ **One Repository**
- Single source of truth
- Simpler workflow
- Atomic commits

✅ **Independent Deployments**
- Only rebuilds changed service
- Fast deployments (2-5 min)
- No downtime for unchanged services

✅ **Smart CI/CD**
- Path-based triggers
- Parallel builds
- Automatic deployments

✅ **Easy Management**
- One repo to maintain
- Shared configuration
- Simple for team

---

## 📚 Quick Commands

### Local Development

```bash
# Start both (Docker)
docker-compose up -d

# Or separate terminals
# Terminal 1
cd backend && mvn spring-boot:run

# Terminal 2
npm run dev  # (or cd frontend && npm run dev)
```

### Deployment

```bash
# Frontend change
git add src/  # (or frontend/)
git commit -m "feat: UI update"
git push
# ✅ Frontend deploys only

# Backend change
git add backend/
git commit -m "feat: API update"
git push
# ✅ Backend deploys only
```

### VPS Management

```bash
ssh root@YOUR_VPS_IP
cd /opt/nxtclass

# Check status
docker-compose ps

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Restart specific service
docker-compose restart frontend
docker-compose restart backend
```

---

## ✅ Ready to Use!

Your monorepo structure is **already configured** for independent deployments!

**No changes required** - just push your code:
- Frontend changes → Frontend deploys only
- Backend changes → Backend deploys only
- Both changed → Both deploy

**Access:** http://YOUR_VPS_IP

---

**Best of both worlds: Simple monorepo + Independent deployments! 🎉**
