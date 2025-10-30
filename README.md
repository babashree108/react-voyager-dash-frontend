# 🎓 NXT Class - School Management System

A comprehensive digital platform for managing school operations including classroom management, student admissions, course management, and interactive learning tools.

## 📁 Repository Structure

```
nxtclass/
├── frontend/          # React + TypeScript frontend
├── backend/           # Spring Boot backend
└── docker-compose.yml # Docker orchestration (MySQL + Backend + Frontend)
```

---

## 🚀 Quick Start

### Start with Docker (Recommended)

```bash
# Clone and start
git clone <YOUR_REPO_URL>
cd nxtclass
docker-compose up -d

# Open browser
open http://localhost
```

### Or Local Development

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Access: http://localhost:5173
```

**Backend:**
```bash
cd backend
mvn spring-boot:run
# Access: http://localhost:8080
```

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS + shadcn/ui
- React Router
- Axios

**Backend:**
- Java 17 + Spring Boot 3.2
- Spring Data JPA + Hibernate
- MySQL 8.0
- JWT authentication
- RESTful API

**DevOps:**
- Docker + Docker Compose
- Nginx reverse proxy

### Services

```
Frontend (port 80)
    ↓
Backend (port 8080)
    ↓
MySQL (port 3306)
```

---

## 📦 Project Structure

```
nxtclass/
├── frontend/
│   ├── src/
│   │   ├── api/              # API services
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── config/           # Configuration
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   ├── package.json          # Dependencies
│   ├── Dockerfile            # Frontend Docker build
│   └── nginx.conf            # Nginx configuration
│
├── backend/
│   ├── src/main/java/
│   │   └── com/nxtclass/
│   │       ├── controller/   # REST controllers
│   │       ├── service/      # Business logic
│   │       ├── repository/   # Data access
│   │       ├── entity/       # JPA entities
│   │       ├── dto/          # DTOs
│   │       └── config/       # Configuration
│   ├── src/main/resources/   # Config files
│   ├── pom.xml               # Maven dependencies
│   └── Dockerfile            # Backend Docker build
│
├── .github/workflows/        # CI/CD
│   ├── deploy-frontend.yml   # Frontend deployment
│   └── deploy-backend.yml    # Backend deployment
│
└── docker-compose.yml        # Docker orchestration
```

---

## 🎯 Features

### ✅ Implemented
- User authentication & authorization
- Role-based access (Admin, Teacher, Student)
- Student management (CRUD)
- Teacher management (CRUD)
- Subject management
- Course management
- Responsive UI with modern design

### ⚠️ UI Only (No Backend)
- Virtual classroom
- Digital notebook
- Assignment system

### 📋 Planned
- Real-time video/audio (WebRTC)
- Quiz system
- Student admissions
- Innovation hub

---

## 🛠️ Development

### Prerequisites
- Docker & Docker Compose (recommended)
- OR: Node.js 20+, Java 17+, Maven 3.9+, MySQL 8.0+

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Check status (should show 3 services)
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean restart
docker-compose down -v
docker-compose up -d --build
```

### Access Points

- **Frontend:** http://localhost
- **Backend API:** http://localhost:8080/api
- **Backend Health:** http://localhost:8080/actuator/health
- **Database:** localhost:3306

### Database Configuration

```
Database: nxtclass_db
User: nxtclass_user
Password: nxtclass_pass_2024
```

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for VPS deployment instructions.

### Quick Deploy to VPS

```bash
# 1. SSH to VPS
ssh root@your-vps-ip

# 2. Install Docker
curl -fsSL https://get.docker.com | sh

# 3. Clone and start
git clone <repo> nxtclass
cd nxtclass
cp .env.example .env
docker-compose up -d
```

---

## 🔧 Management

```bash
# Health check
./health-check.sh

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update application
git pull
docker-compose up -d --build
```

---

## 🔒 Security

- JWT authentication
- BCrypt password hashing
- CORS configuration
- Environment-based secrets
- Non-root Docker containers

---

## 📊 Progress Status

**Overall: ~25-30% complete**

| Module | Status | Progress |
|--------|--------|----------|
| Infrastructure | ✅ Complete | 90% |
| User Management | ✅ Complete | 100% |
| Student/Teacher | ✅ Complete | 100% |
| Virtual Classroom | ⚠️ UI Only | 15% |
| Digital Notebook | ⚠️ UI Only | 20% |
| Quiz System | ❌ Not Started | 0% |

---

**Built with ❤️ for modern education**
