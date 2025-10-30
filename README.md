# 🎓 NXT Class - Educational Platform

Enterprise-grade virtual learning platform with real-time collaboration, digital notebooks, and comprehensive analytics.

## 📦 Project Structure

```
nxtclass/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/             # API services
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── config/          # Configuration
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   ├── Dockerfile           # Frontend Docker build
│   ├── nginx.conf           # Nginx configuration
│   └── package.json         # Dependencies
│
├── backend/                  # Spring Boot + MySQL
│   ├── src/main/java/
│   │   └── com/nxtclass/
│   │       ├── controller/  # REST controllers
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access
│   │       ├── entity/      # JPA entities
│   │       ├── dto/         # DTOs
│   │       ├── security/    # Security config
│   │       └── config/      # Configuration
│   ├── src/main/resources/  # Config files
│   ├── Dockerfile           # Backend Docker build
│   └── pom.xml              # Maven dependencies
│
├── docker-compose.yml        # Docker orchestration
├── .env.example             # Environment variables template
├── SECURITY_ANALYSIS_REPORT.md
├── SECURITY_IMPLEMENTATION_GUIDE.md
└── SECURITY_SUMMARY.md
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (Recommended)
  - Docker 20.10+
  - Docker Compose 2.0+

OR

- **Local Development:**
  - Node.js 18+ / Bun
  - Java 17+
  - Maven 3.8+
  - MySQL 8.0+

### 🐳 Docker Setup (Recommended)

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd nxtclass
```

#### 2. Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Generate secure JWT secret
openssl rand -base64 64 | tr -d '\n'

# Edit .env and update with your values
nano .env
```

**Important:** Update these values in `.env`:
- `JWT_SECRET` - Use the generated value from openssl
- `DB_ROOT_PASSWORD` - Secure root password
- `DB_PASSWORD` - Secure database password

#### 3. Start All Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

#### 4. Access the Application

- **Frontend:** http://localhost:80
- **Backend API:** http://localhost:8080/api
- **API Health:** http://localhost:8080/actuator/health

#### 5. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: Deletes database data)
docker-compose down -v
```

### 💻 Local Development Setup

#### Backend Setup

```bash
cd backend

# Create .env file with secrets
cat > .env << 'EOF'
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
JWT_EXPIRATION=3600000
DB_URL=jdbc:mysql://localhost:3306/nxtClass108
DB_USERNAME=root
DB_PASSWORD=root
EOF

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

Backend will start at `http://localhost:8080`

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start at `http://localhost:5173`

## 🔐 Default Test Accounts

```
Admin:
  Email: admin@nxtclass.com
  Password: Admin@123
  Role: ORGADMIN

Teacher:
  Email: teacher@nxtclass.com
  Password: Admin@123
  Role: TEACHER

Student:
  Email: student@nxtclass.com
  Password: Admin@123
  Role: STUDENT
```

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Library:** Radix UI + shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query
- **Routing:** React Router v6
- **HTTP Client:** Axios

### Backend
- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **Build Tool:** Maven
- **Database:** MySQL 8.0
- **Security:** Spring Security + JWT
- **ORM:** JPA/Hibernate
- **Validation:** Bean Validation
- **API Docs:** Spring Actuator

### DevOps
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Web Server:** Nginx (Frontend)
- **Reverse Proxy:** Nginx

## 📱 Features

### Core Features
- ✅ **User Management** - Multi-role user system (Admin, Teacher, Student)
- ✅ **Course Management** - Create and manage courses and subjects
- ✅ **Virtual Classroom** - Live video conferencing integration
- ✅ **Assignments** - Assignment creation, submission, and grading
- ✅ **Announcements** - System-wide announcements
- ✅ **Digital Notebook** - Real-time note-taking with Huion integration
- ✅ **Analytics** - Comprehensive reporting and analytics
- ✅ **Multi-tenant** - Organization-based user isolation

### Security Features
- ✅ JWT-based authentication
- ✅ BCrypt password hashing
- ⚠️ Role-based access control (In Progress - See Security Reports)
- ✅ CORS configuration
- ✅ Security headers
- ✅ Protected API endpoints
- ⚠️ Rate limiting (Planned)
- ⚠️ Audit logging (Planned)

## 🔒 Security

**Important:** This project is undergoing security hardening. Please review:

1. **SECURITY_SUMMARY.md** - Quick overview of security status
2. **SECURITY_ANALYSIS_REPORT.md** - Detailed security audit (18 vulnerabilities found)
3. **SECURITY_IMPLEMENTATION_GUIDE.md** - Step-by-step security fixes

**Current Security Score: 4/10** ⚠️

**Critical Issues to Address:**
- [ ] No role-based access control on endpoints
- [ ] Hardcoded secrets (must externalize)
- [ ] Missing input validation
- [ ] Exposed actuator endpoints
- [ ] No rate limiting

See `SECURITY_IMPLEMENTATION_GUIDE.md` for immediate fixes (~3.5 hours).

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm run lint
npm run type-check
```

### Docker Health Checks
```bash
# Check all services
docker-compose ps

# Check backend health
curl http://localhost:8080/actuator/health

# Check frontend health
curl http://localhost/health
```

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/login - User login
```

### Course Endpoints
```
GET    /api/course/list - List all courses
GET    /api/course/{id} - Get course details
POST   /api/course/save - Create course
PUT    /api/course/update - Update course
DELETE /api/course/{id} - Delete course
```

### Student Endpoints
```
GET    /api/student-details/list - List all students
GET    /api/student-details/{id} - Get student details
POST   /api/student-details/save - Create student
PUT    /api/student-details/update - Update student
DELETE /api/student-details/{id} - Delete student
```

### Teacher Endpoints
```
GET    /api/teacher-details/list - List all teachers
GET    /api/teacher-details/{id} - Get teacher details
POST   /api/teacher-details/save - Create teacher
PUT    /api/teacher-details/update - Update teacher
DELETE /api/teacher-details/{id} - Delete teacher
```

### Other Endpoints
- Announcements: `/api/announcements`
- Assignments: `/api/assignments`
- Subjects: `/api/subject`
- Stats: `/api/stats`

## 🐛 Troubleshooting

### Docker Issues

**Port Already in Use:**
```bash
# Check what's using the port
sudo lsof -i :8080  # Backend
sudo lsof -i :80    # Frontend
sudo lsof -i :3306  # MySQL

# Stop conflicting services or change ports in docker-compose.yml
```

**Container Won't Start:**
```bash
# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database

# Rebuild without cache
docker-compose build --no-cache
```

**Database Connection Issues:**
```bash
# Ensure database is healthy
docker-compose ps

# Check database logs
docker-compose logs database

# Restart database
docker-compose restart database
```

### Environment Variable Issues

**Variables Not Loading:**
```bash
# Verify .env file exists
cat .env

# Check Docker Compose loads .env
docker-compose config

# Manually set environment variables
export JWT_SECRET="your-secret-here"
docker-compose up
```

### Build Issues

**Frontend Build Fails:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Backend Build Fails:**
```bash
cd backend
mvn clean
mvn clean install -DskipTests
```

## 📈 Performance

### Production Optimization

**Backend:**
- JVM tuning in Dockerfile
- Connection pooling configured
- Hibernate second-level cache (optional)
- Actuator monitoring

**Frontend:**
- Vite production build optimization
- Nginx gzip compression
- Static asset caching (1 year)
- Code splitting and lazy loading

**Database:**
- MySQL persistent volume
- Optimized query indexes
- Connection pool sizing

## 🔄 CI/CD (Coming Soon)

Planned CI/CD pipeline:
- GitHub Actions / GitLab CI
- Automated testing
- Docker image building
- Security scanning
- Kubernetes deployment

## 📝 Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | JWT signing key (min 64 chars) | - | ✅ |
| `JWT_EXPIRATION` | Token expiration (milliseconds) | 3600000 | ❌ |
| `DB_URL` | Database JDBC URL | - | ✅ |
| `DB_USERNAME` | Database username | - | ✅ |
| `DB_PASSWORD` | Database password | - | ✅ |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | localhost:5173 | ❌ |
| `LOG_LEVEL` | Application log level | INFO | ❌ |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | http://localhost:8080/api | ✅ |

## 🤝 Contributing

This is a private educational platform. For contribution guidelines, contact the development team.

## 📄 License

Proprietary - NXT Class Educational Platform

## 📞 Support

For issues, questions, or feature requests:
- Create an issue in the repository
- Contact the development team
- Review documentation in `/docs`

## 🎯 Roadmap

### Phase 1 - Security Hardening (Current)
- [ ] Implement role-based access control
- [ ] Externalize all secrets
- [ ] Add input validation
- [ ] Secure actuator endpoints
- [ ] Add rate limiting

### Phase 2 - Feature Enhancement
- [ ] Real-time chat integration
- [ ] Video recording and playback
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Notification system

### Phase 3 - Scalability
- [ ] Kubernetes deployment
- [ ] Redis caching layer
- [ ] Microservices architecture
- [ ] Load balancing
- [ ] Auto-scaling

## 🌟 Acknowledgments

Built with:
- Spring Boot
- React
- Radix UI
- shadcn/ui
- Tailwind CSS
- And many other amazing open-source projects

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-30  
**Status:** Development
