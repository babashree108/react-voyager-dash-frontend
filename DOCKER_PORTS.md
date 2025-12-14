# 🐳 Docker Port Configuration

## Port Allocation Strategy (Company Best Practice)

Each environment runs on **isolated ports** to prevent conflicts and allow simultaneous deployment:

### 📍 **LOCAL Development**
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8080` 
- **Database**: `localhost:5432`
- **Debug**: `localhost:5005`

### 📍 **STAGING**
- **Frontend**: `http://localhost:4000`
- **Backend**: `http://localhost:8081`
- **Database**: `localhost:5433`

### 📍 **PRODUCTION**
- **Frontend**: `http://localhost:5000`
- **Backend**: `http://localhost:8082`
- **Database**: `localhost:5434`

---

## 🚀 Quick Start

### 1. Setup Environment Files
```bash
cp .env.local.example .env.local      # Ready to use
cp .env.staging.example .env.staging  # Update passwords
cp .env.prod.example .env.prod        # Update passwords
```

### 2. Start Single Environment
```bash
cd docker-scripts

./start-local.sh     # Start LOCAL
./start-staging.sh   # Start STAGING  
./start-prod.sh      # Start PRODUCTION
```

### 3. Start All Environments (Testing)
```bash
./start-all.sh       # Starts all three simultaneously
```

### 4. View Logs
```bash
./logs.sh local              # All LOCAL logs
./logs.sh staging backend    # STAGING backend logs
```

### 5. Stop Services
```bash
./stop.sh local              # Stop LOCAL
./stop.sh staging            # Stop STAGING
./stop-all.sh                # Stop everything
```

---

## 📊 Port Matrix

| Service    | Local | Staging | Production |
|------------|-------|---------|------------|
| Frontend   | 3000  | 4000    | 5000       |
| Backend    | 8080  | 8081    | 8082       |
| Database   | 5432  | 5433    | 5434       |
| Debug      | 5005  | -       | -          |

---

## 🔒 Security Benefits

✅ **Isolation**: Each environment completely isolated
✅ **No Conflicts**: Can run all simultaneously
✅ **Easy Testing**: Test staging while local runs
✅ **Production Safety**: Prod never touches local/staging ports
✅ **Clear Separation**: Developers can't accidentally hit prod

---

## 📝 Container Names

| Environment | Database | Backend | Frontend |
|-------------|----------|---------|----------|
| Local       | nxtclass-db-local | nxtclass-backend-local | nxtclass-frontend-local |
| Staging     | nxtclass-db-staging | nxtclass-backend-staging | nxtclass-frontend-staging |
| Production  | nxtclass-db-prod | nxtclass-backend-prod | nxtclass-frontend-prod |

---

## 🛠️ Useful Commands

```bash
# Check all running containers
docker ps

# Access database
docker exec -it nxtclass-db-local psql -U postgres -d nxtclass_local

# View container stats
docker stats

# Clean everything
docker system prune -a --volumes
```

**Last Updated**: December 7, 2025
