# 🔄 What To Do After Code Changes

## When You Change Code

The single container **bakes in your code** during build, so you need to **rebuild** when code changes.

---

## 🎯 Quick Rebuild Process

### If You Changed Frontend Code (React/TypeScript):

```bash
# 1. Stop container
docker-compose -f docker-compose.local.yml down

# 2. Rebuild (only rebuilds changed layers - fast!)
docker-compose -f docker-compose.local.yml build

# 3. Start again
docker-compose -f docker-compose.local.yml up -d

# 4. Access
open http://localhost
```

**Time: 2-5 minutes** (Docker caches unchanged layers)

---

### If You Changed Backend Code (Java/Spring Boot):

```bash
# 1. Stop container
docker-compose -f docker-compose.local.yml down

# 2. Rebuild
docker-compose -f docker-compose.local.yml build

# 3. Start again
docker-compose -f docker-compose.local.yml up -d
```

**Time: 2-5 minutes** (Maven caches dependencies)

---

### If You Changed Both:

Same process - rebuild once:

```bash
docker-compose -f docker-compose.local.yml down
docker-compose -f docker-compose.local.yml build
docker-compose -f docker-compose.local.yml up -d
```

---

## ⚡ One-Command Rebuild

I'll create a script for you:

```bash
./rebuild.sh
```

This does everything automatically!

---

## 🚀 For Faster Development (Alternative)

Instead of using the single container during development, you can run services separately:

### Option 1: Run Frontend Locally (Hot Reload)

```bash
# Start backend in Docker (3 containers)
docker-compose up -d

# Run frontend locally with hot reload
cd frontend
npm run dev

# Access: http://localhost:5173
# Changes reflect instantly! No rebuild needed!
```

### Option 2: Run Backend Locally

```bash
# Start MySQL only
docker-compose up -d mysql

# Run backend locally
cd backend
mvn spring-boot:run

# Run frontend locally
cd frontend
npm run dev
```

**This is FASTER for development!** No rebuild needed - changes are instant.

---

## 📊 When To Use What

| Scenario | Use | Rebuild Needed? |
|----------|-----|-----------------|
| **Quick local test** | Single container (`./start-nxtclass.sh`) | Yes - 2-5 min |
| **Active development** | Local dev (`npm run dev` + `docker-compose up`) | No - instant |
| **Final testing before deploy** | Single container | Yes |
| **Production (VPS)** | Multi-container (`docker-compose up`) | Yes |

---

## 🔧 Rebuild Commands Reference

### Full Clean Rebuild (Slow - 10 min)
```bash
docker-compose -f docker-compose.local.yml down
docker-compose -f docker-compose.local.yml build --no-cache
docker-compose -f docker-compose.local.yml up -d
```

### Quick Rebuild (Fast - 2-5 min)
```bash
docker-compose -f docker-compose.local.yml down
docker-compose -f docker-compose.local.yml build
docker-compose -f docker-compose.local.yml up -d
```

### One Command (Using script)
```bash
./rebuild.sh
```

---

## 🎯 Recommended Workflow

### During Development:

1. **Run frontend locally** with hot reload:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Run backend in Docker**:
   ```bash
   docker-compose up -d backend mysql
   ```

3. **Make changes** → See instantly in browser!

### Before Committing:

1. **Test with single container**:
   ```bash
   ./start-nxtclass.sh
   ```

2. **Verify everything works**

3. **Commit and push**

### On VPS (Production):

1. **Git pull** on VPS
2. **Rebuild and restart**:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

---

## 🚀 CI/CD (Automatic Deployment)

Your GitHub Actions already handle this:

- Push to `main` branch
- GitHub Actions builds and deploys automatically
- No manual rebuild needed on VPS!

---

## ✅ Summary

**Single Container (Local Testing):**
- Code changes? → Rebuild required (2-5 min)
- Command: `./rebuild.sh`

**Local Development (Faster):**
- Frontend: `npm run dev` → Instant hot reload
- Backend: Run in Docker or locally
- No rebuild needed!

**Production (VPS):**
- Push to GitHub → Auto-deploys
- Or manually: `git pull` + `docker-compose build` + restart
