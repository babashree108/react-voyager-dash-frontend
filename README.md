# 🎓 NXT Class - School Management System

A comprehensive digital platform for managing school operations including classroom management, student admissions, course management, and interactive learning tools.

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone the repository
git clone <YOUR_REPO_URL>
cd nxtclass

# 2. Start with Docker (Recommended)
./deploy.sh
# Choose option 1 (Fresh deployment)

# 3. Access the application
open http://localhost
```

**That's it!** Your application is now running with:
- Frontend: http://localhost
- Backend API: http://localhost:8080
- Database: MySQL on port 3306

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide for Hostinger VPS
- **[README_DEPLOYMENT.md](./README_DEPLOYMENT.md)** - Docker deployment overview

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS + shadcn/ui components
- React Router for navigation
- Axios for API calls

**Backend:**
- Java 17 + Spring Boot 3.2
- Spring Data JPA + Hibernate
- MySQL 8.0 database
- JWT authentication
- RESTful API

**DevOps:**
- Docker + Docker Compose
- Nginx reverse proxy
- n8n workflow automation (optional)

### System Architecture

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Frontend   │──────▶│   Backend    │──────▶│   MySQL DB   │
│ React + Vite │       │ Spring Boot  │       │   Database   │
│  (Port 80)   │       │  (Port 8080) │       │  (Port 3306) │
└──────────────┘       └──────────────┘       └──────────────┘
```

## 🎯 Features Implemented

### ✅ Core Features (Complete)
- User authentication and authorization
- Role-based access control (Admin, Teacher, Student)
- Student management (CRUD operations)
- Teacher management (CRUD operations)
- Subject management
- Course management with sections
- Dashboard for all user roles
- Responsive UI with modern design

### ⚠️ In Progress
- Virtual classroom (UI only)
- Digital notebook (UI only)
- Assignment system (UI only)
- Analytics dashboard

### 📋 Planned Features
- Real-time video/audio (WebRTC)
- Quiz system with 3-round structure
- Age-based student admissions
- Innovation hub for project ideas
- Multi-language support

See [Feature Progress Analysis](#) for detailed status.

## 🛠️ Development Setup

### Prerequisites
- Node.js 20+ and npm
- Java 17+
- Maven 3.9+
- MySQL 8.0+
- Docker & Docker Compose (recommended)

### Local Development (Without Docker)

**Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Frontend:**
```bash
npm install
npm run dev
```

### With Docker (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📦 Project Structure

```
nxtclass/
├── src/                      # Frontend source
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── api/                 # API services
│   └── types/               # TypeScript types
├── backend/                  # Backend source
│   └── src/main/java/       # Java source code
│       └── com/nxtclass/    # Main package
├── docker-compose.yml        # Docker orchestration
├── Dockerfile               # Frontend Docker image
├── backend/Dockerfile       # Backend Docker image
└── nginx.conf               # Nginx configuration
```

## 🌐 Deployment

### Deploy to Hostinger VPS

1. **SSH into your VPS:**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

3. **Clone and configure:**
   ```bash
   git clone <repo> nxtclass && cd nxtclass
   cp .env.example .env
   nano .env  # Update with your values
   ```

4. **Deploy:**
   ```bash
   ./deploy.sh
   ```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

## 🔧 Management Commands

```bash
# Health check
./health-check.sh

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Backup database
docker-compose exec mysql mysqldump -u root -p nxtclass_db > backup.sql

# Update application
git pull
docker-compose build
docker-compose up -d
```

## 🔒 Security

- JWT-based authentication
- BCrypt password hashing
- CORS configuration
- Environment-based secrets
- Non-root Docker containers
- Security headers in Nginx

## 📊 Current Implementation Status

**Overall Progress: ~25-30%** based on the complete design document

| Module | Status | Progress |
|--------|--------|----------|
| Core Infrastructure | ✅ Complete | 90% |
| User Management | ✅ Complete | 100% |
| Student/Teacher Onboarding | ✅ Complete | 100% |
| Virtual Classroom | ⚠️ UI Only | 15% |
| Digital Notebook | ⚠️ UI Only | 20% |
| Quiz System | ❌ Not Started | 0% |
| Innovation Hub | ❌ Not Started | 0% |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check DEPLOYMENT.md and QUICKSTART.md
- **Logs**: `docker-compose logs -f`

## 📄 License

This project is proprietary software for NXT Class educational platform.

## 🎉 Quick Links

- **Start Locally**: `./deploy.sh` → option 1
- **Deploy to VPS**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Health Check**: `./health-check.sh`
- **View Logs**: `docker-compose logs -f`

---

**Built with ❤️ for modern education**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
