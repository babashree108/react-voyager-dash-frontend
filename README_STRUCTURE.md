# ✅ Repository Structure - Two Separate Folders

**Clean separation: `frontend/` and `backend/` folders**

---

## 📁 Current Structure

```
nxtclass/                          # Repository root
│
├── frontend/                      # Frontend folder (React)
│   ├── src/                       # React source code
│   │   ├── components/            # UI components
│   │   ├── pages/                 # Page components
│   │   ├── api/                   # API service calls
│   │   ├── config/                # Configuration
│   │   ├── data/                  # Mock data
│   │   ├── hooks/                 # React hooks
│   │   ├── lib/                   # Utilities
│   │   └── types/                 # TypeScript types
│   ├── public/                    # Static assets
│   ├── package.json               # Frontend dependencies
│   ├── package-lock.json
│   ├── vite.config.ts            # Vite configuration
│   ├── tsconfig*.json            # TypeScript configs
│   ├── tailwind.config.ts        # Tailwind CSS config
│   ├── postcss.config.js
│   ├── index.html                # Entry HTML
│   ├── Dockerfile                # Frontend Docker build
│   ├── nginx.conf                # Nginx configuration
│   └── .dockerignore
│
├── backend/                       # Backend folder (Spring Boot)
│   ├── src/                       # Java source code
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/nxtclass/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── entity/
│   │   │   │       ├── dto/
│   │   │   │       └── config/
│   │   │   └── resources/
│   │   │       └── application*.properties
│   │   └── test/
│   ├── pom.xml                    # Maven dependencies
│   ├── Dockerfile                 # Backend Docker build
│   ├── init-db.sql                # Database initialization
│   └── .dockerignore
│
├── .github/workflows/             # CI/CD workflows
│   ├── deploy.yml                 # Deploy all
│   ├── deploy-frontend.yml        # Deploy frontend only
│   └── deploy-backend.yml         # Deploy backend only
│
├── docker-compose.yml             # Orchestration
├── .env                           # Environment variables
├── deploy.sh                      # Deployment helper
├── health-check.sh                # Health check script
└── README.md                      # This file
```

---

## 🎯 Key Points

### ✅ Complete Separation
- **Frontend**: Everything in `frontend/` folder
- **Backend**: Everything in `backend/` folder
- **No mixing**: Clean, organized structure

### ✅ Independent Development
```bash
# Work on frontend
cd frontend
npm install
npm run dev

# Work on backend
cd backend
mvn spring-boot:run
```

### ✅ Independent Deployment
```bash
# Frontend changes
git add frontend/
git push origin main
# ✅ Only frontend deploys

# Backend changes
git add backend/
git push origin main
# ✅ Only backend deploys
```

---

## 🚀 How to Work With This Structure

### Local Development

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on: http://localhost:5173
```

**Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Runs on: http://localhost:8080
```

### Docker Deployment

**From repository root:**
```bash
docker-compose up -d
# Builds both from their respective folders
# Frontend: http://localhost
# Backend: http://localhost:8080
```

### File Changes

**Editing frontend:**
```bash
# Edit any file in frontend/
vim frontend/src/App.tsx
git add frontend/
git commit -m "feat: update UI"
git push
# Only frontend deploys
```

**Editing backend:**
```bash
# Edit any file in backend/
vim backend/src/main/java/Controller.java
git add backend/
git commit -m "feat: add API"
git push
# Only backend deploys
```

---

## 🔧 Docker Configuration

### docker-compose.yml

```yaml
services:
  frontend:
    build:
      context: ./frontend    # Builds from frontend folder
      dockerfile: Dockerfile
    ports:
      - "80:80"
  
  backend:
    build:
      context: ./backend     # Builds from backend folder
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
```

### GitHub Actions

**deploy-frontend.yml:**
```yaml
paths:
  - 'frontend/**'    # Monitors frontend folder
```

**deploy-backend.yml:**
```yaml
paths:
  - 'backend/**'     # Monitors backend folder
```

---

## ✅ Benefits

| Benefit | Description |
|---------|-------------|
| **Clear Separation** | Frontend and backend completely separate |
| **Easy Navigation** | Know exactly where to find files |
| **Independent Deploys** | Change one without affecting the other |
| **Team Collaboration** | Frontend/backend teams work independently |
| **Clean Organization** | Professional structure |

---

## 🎯 Summary

**You now have:**
- ✅ `frontend/` folder - All React/TypeScript code
- ✅ `backend/` folder - All Spring Boot/Java code
- ✅ Complete separation
- ✅ Independent development
- ✅ Independent deployment

**Two folders, clean structure, professional setup! 🎉**
