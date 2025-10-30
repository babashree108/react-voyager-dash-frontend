# Local Testing - Single Container

**One container with everything. One URL. Simple.**

---

## 🚀 Quick Start

```bash
./test-local.sh
```

**Access:** http://localhost

**That's all you need!**

---

## 📦 What's Inside the Container?

The single container includes:

1. **MySQL** (internal) - Database
2. **Spring Boot Backend** (internal:8080) - API
3. **Nginx** (port 80) - Web server

```
┌─────────────────────────────────────┐
│     Single Docker Container         │
│                                     │
│  ┌──────────┐   ┌───────────┐     │
│  │  Nginx   │──▶│  Backend  │     │
│  │ (port 80)│   │ (port 8080)│     │
│  └──────────┘   └─────┬─────┘     │
│                       │            │
│                 ┌─────▼─────┐     │
│                 │   MySQL   │     │
│                 └───────────┘     │
│                                     │
└─────────────────────────────────────┘
         │
         ▼
   http://localhost
```

---

## 🛠️ Commands

### Start
```bash
./test-local.sh
```

### View Logs
```bash
docker-compose -f docker-compose.local.yml logs -f
```

### Stop
```bash
docker-compose -f docker-compose.local.yml down
```

### Restart
```bash
docker-compose -f docker-compose.local.yml restart
```

### Rebuild (after code changes)
```bash
docker-compose -f docker-compose.local.yml down
docker-compose -f docker-compose.local.yml build --no-cache
docker-compose -f docker-compose.local.yml up -d
```

---

## 🔍 Verify It's Working

```bash
# Check container is running
docker ps | grep nxtclass-local

# Test the app
curl http://localhost

# Test the API
curl http://localhost/api/student-details/list
```

---

## 📊 Container vs Multi-Container

| Feature | Single Container | Multi-Container |
|---------|-----------------|-----------------|
| **Containers** | 1 | 3 (MySQL, Backend, Frontend) |
| **Ports** | 80 only | 80, 8080, 3306 |
| **Startup** | `./test-local.sh` | `docker-compose up -d` |
| **URL** | http://localhost | http://localhost |
| **Best For** | Local testing | Production deployment |
| **Build Time** | 5-10 min | 8-12 min |

---

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose -f docker-compose.local.yml logs -f

# Rebuild
docker-compose -f docker-compose.local.yml build --no-cache
```

### Port 80 already in use
```bash
# Stop Apache/other web servers
sudo apachectl stop

# Or use different port - edit docker-compose.local.yml:
# ports: "8080:80"
# Then access: http://localhost:8080
```

### Database issues
```bash
# Clean restart with fresh database
docker-compose -f docker-compose.local.yml down -v
./test-local.sh
```

---

## ✅ Advantages of Single Container

- ✅ **Simpler** - Just one container to manage
- ✅ **Faster startup** - No network coordination between containers
- ✅ **One URL** - Just http://localhost
- ✅ **Less memory** - One container vs three
- ✅ **Easier debugging** - All logs in one place
- ✅ **Perfect for local testing**

---

## 🎯 When to Use What?

**Single Container (`./test-local.sh`):**
- ✅ Local development
- ✅ Quick testing
- ✅ Demos
- ✅ Learning the app

**Multi-Container (`docker-compose up -d`):**
- ✅ Production deployment
- ✅ Scaling individual services
- ✅ Independent service updates
- ✅ VPS hosting

---

**For local testing, single container is the way to go! 🚀**

```bash
./test-local.sh
```
