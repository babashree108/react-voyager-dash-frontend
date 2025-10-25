# Cloud Deployment Guide - NXT Class Platform

## Table of Contents
1. [Current Setup Overview](#current-setup-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Cloud Platform Options](#cloud-platform-options)
4. [Recommended Deployment Architecture](#recommended-deployment-architecture)
5. [Step-by-Step Deployment](#step-by-step-deployment)
6. [Environment Variables Configuration](#environment-variables-configuration)
7. [Database Migration](#database-migration)

---

## Current Setup Overview

### Backend
- **Framework**: Spring Boot 3.2.0 with Java 17
- **Current Database**: MySQL (local) - `localhost:3306/expenseManagement`
- **Production Config**: Ready for PostgreSQL with environment variables
- **Port**: 8080

### Frontend
- **Framework**: React + TypeScript (Vite)
- **API Config**: Environment-based (`VITE_API_URL`)
- **Port**: 5173 (dev)

---

## Pre-Deployment Checklist

### 1. Backend Configuration Updates

#### a. Enable PostgreSQL Dependency
Edit `backend/pom.xml` and uncomment the PostgreSQL dependency:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

#### b. Update Production Properties
Edit `backend/src/main/resources/application-prod.properties`:

```properties
# Database Configuration (use environment variables)
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# CORS (use your frontend URL)
spring.mvc.cors.allowed-origins=${FRONTEND_URL}
spring.mvc.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.mvc.cors.allowed-headers=*
spring.mvc.cors.allow-credentials=true

# Production logging
logging.level.com.nxtclass=INFO
logging.level.org.springframework=INFO

# Security
server.servlet.session.cookie.secure=true
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.same-site=strict
```

#### c. Create application.properties for Cloud
The main `application.properties` should use profile-specific configs:

```properties
spring.profiles.active=${SPRING_PROFILES_ACTIVE:dev}
```

---

## Cloud Platform Options

### Option 1: Railway (Recommended for Beginners) ⭐
**Pros:**
- Easy deployment from GitHub
- Free PostgreSQL database included
- Auto-deployments on git push
- Built-in environment variables
- Free tier available

**Pricing:** Free tier, then $5/month for hobby plan

### Option 2: Render
**Pros:**
- Free PostgreSQL database
- Auto-deploy from GitHub
- Easy to use
- Free tier for web services

**Pricing:** Free tier, paid plans start at $7/month

### Option 3: AWS (Amazon Web Services)
**Services Needed:**
- **Backend**: Elastic Beanstalk or ECS
- **Frontend**: S3 + CloudFront or Amplify
- **Database**: RDS (PostgreSQL)

**Pricing:** Pay-as-you-go, ~$20-50/month minimum

### Option 4: Google Cloud Platform (GCP)
**Services Needed:**
- **Backend**: Cloud Run or App Engine
- **Frontend**: Cloud Storage + Cloud CDN or Firebase Hosting
- **Database**: Cloud SQL (PostgreSQL)

**Pricing:** Free tier available, ~$20-40/month after

### Option 5: Azure
**Services Needed:**
- **Backend**: App Service
- **Frontend**: Static Web Apps
- **Database**: Azure Database for PostgreSQL

**Pricing:** Free tier available, ~$30-60/month after

### Option 6: Heroku (Easiest but Pricier)
**Pros:**
- Extremely simple deployment
- Add-ons for PostgreSQL
- Good documentation

**Pricing:** $7/month minimum (no free tier anymore)

---

## Recommended Deployment Architecture

### Architecture 1: Railway (Simple & Cost-Effective)
```
┌─────────────────────────────────────────────┐
│              Railway Platform                │
│                                              │
│  ┌──────────────┐     ┌──────────────┐     │
│  │   Frontend   │────▶│   Backend    │     │
│  │  (Static)    │     │ (Spring Boot)│     │
│  └──────────────┘     └──────┬───────┘     │
│                              │              │
│                       ┌──────▼───────┐      │
│                       │  PostgreSQL  │      │
│                       │   Database   │      │
│                       └──────────────┘      │
└─────────────────────────────────────────────┘
```

### Architecture 2: Cloud Provider (AWS/GCP/Azure)
```
┌────────────────┐         ┌────────────────┐
│   Frontend     │         │    Backend     │
│  CDN/Storage   │────────▶│  App Service   │
│                │         │                │
└────────────────┘         └───────┬────────┘
                                   │
                            ┌──────▼──────┐
                            │  Managed DB │
                            │ PostgreSQL  │
                            └─────────────┘
```

---

## Step-by-Step Deployment

## 🚀 DEPLOYMENT OPTION 1: Railway (Recommended)

### Backend Deployment on Railway

#### Step 1: Prepare Backend for Cloud
1. **Update `pom.xml`** - Uncomment PostgreSQL:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

2. **Create Dockerfile** in `backend/` directory:
```dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
```

3. **Build the JAR**:
```bash
cd backend
mvn clean package -DskipTests
```

#### Step 2: Create Railway Project
1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your repository
6. Choose "backend" directory

#### Step 3: Add PostgreSQL Database
1. In Railway dashboard, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create the database
4. Note: Railway automatically provides `DATABASE_URL` environment variable

#### Step 4: Configure Environment Variables
In Railway backend service settings, add:

```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=${DATABASE_URL}  # Auto-provided by Railway
DB_USERNAME=${PGUSER}         # Auto-provided by Railway
DB_PASSWORD=${PGPASSWORD}     # Auto-provided by Railway
JWT_SECRET=your-secure-jwt-secret-min-256-bits-long-change-this
FRONTEND_URL=https://your-frontend-url.railway.app
```

#### Step 5: Deploy Backend
1. Railway will auto-deploy on push
2. Get your backend URL (e.g., `https://your-backend.railway.app`)

### Frontend Deployment on Railway

#### Step 1: Add Build Configuration
Create `railway.json` in root:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Step 2: Update Production Environment
Update `.env.production`:
```
VITE_API_URL=https://your-backend.railway.app/api
```

#### Step 3: Deploy Frontend
1. In Railway dashboard, click "+ New"
2. Select "Empty Service"
3. Connect to same GitHub repo
4. Choose root directory (frontend)
5. Railway will auto-detect and deploy

---

## 🚀 DEPLOYMENT OPTION 2: Render

### Backend on Render

#### Step 1: Create Web Service
1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Select "backend" directory

#### Step 2: Configure Build Settings
- **Name**: nxtclass-backend
- **Environment**: Java
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar -Dspring.profiles.active=prod target/*.jar`
- **Instance Type**: Free (or paid)

#### Step 3: Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name it (e.g., "nxtclass-db")
3. Copy the "Internal Database URL"

#### Step 4: Add Environment Variables
In Web Service settings → Environment:
```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=<your-internal-database-url>
DB_USERNAME=<from-database-credentials>
DB_PASSWORD=<from-database-credentials>
JWT_SECRET=<your-secure-secret>
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend on Render

#### Step 1: Create Static Site
1. Click "New +" → "Static Site"
2. Connect repository (root directory)
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`

#### Step 2: Add Environment Variable
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🚀 DEPLOYMENT OPTION 3: AWS

### Backend on AWS Elastic Beanstalk

#### Step 1: Prepare Application
```bash
cd backend
mvn clean package -DskipTests
```

#### Step 2: Install AWS CLI
```bash
# For Linux/Mac
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure
aws configure
```

#### Step 3: Create RDS PostgreSQL Database
1. Go to AWS Console → RDS
2. Create Database
3. Choose PostgreSQL
4. Select Free Tier (if available)
5. Note down endpoint, username, password

#### Step 4: Create Elastic Beanstalk Application
```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p java-17 nxtclass-backend --region us-east-1

# Create environment
eb create nxtclass-prod \
  --instance-type t2.micro \
  --envvars SPRING_PROFILES_ACTIVE=prod,DATABASE_URL=jdbc:postgresql://<rds-endpoint>:5432/nxtclass,DB_USERNAME=<username>,DB_PASSWORD=<password>,JWT_SECRET=<secret>
```

#### Step 5: Deploy
```bash
eb deploy
```

### Frontend on AWS S3 + CloudFront

#### Step 1: Build Frontend
```bash
npm run build
```

#### Step 2: Create S3 Bucket
```bash
aws s3 mb s3://nxtclass-frontend
aws s3 website s3://nxtclass-frontend --index-document index.html
```

#### Step 3: Upload Build
```bash
aws s3 sync dist/ s3://nxtclass-frontend --acl public-read
```

#### Step 4: Create CloudFront Distribution (Optional)
- Go to CloudFront console
- Create distribution pointing to S3 bucket
- Use HTTPS

---

## Environment Variables Configuration

### Backend Environment Variables (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Spring profile to use | `prod` |
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://host:5432/dbname` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `your-secure-password` |
| `JWT_SECRET` | JWT secret key (min 256 bits) | `your-very-long-secret-key-here` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://yourapp.com` |
| `SERVER_PORT` | Port (optional, defaults to 8080) | `8080` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.yourapp.com/api` |

### Generating Secure JWT Secret

```bash
# Using OpenSSL
openssl rand -base64 64

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## Database Migration

### Option 1: Export from Local MySQL and Import to Cloud PostgreSQL

#### Step 1: Export MySQL Data
```bash
# Export schema and data
mysqldump -u root -p expenseManagement > backup.sql
```

#### Step 2: Convert MySQL to PostgreSQL Format
Use [pgloader](https://pgloader.io/) or manual conversion:

```bash
# Install pgloader (Linux/Mac)
apt-get install pgloader  # Ubuntu/Debian
brew install pgloader      # Mac

# Convert and load
pgloader mysql://root:password@localhost/expenseManagement \
         postgresql://username:password@your-cloud-db:5432/nxtclass
```

#### Step 3: Manual Conversion (if needed)
- MySQL uses backticks `` ` ``, PostgreSQL uses double quotes `"`
- AUTO_INCREMENT → SERIAL or IDENTITY
- `DATETIME` → `TIMESTAMP`
- `TINYINT(1)` → `BOOLEAN`

### Option 2: Let Hibernate Re-create Schema (Easier but loses data)

Since your `application-prod.properties` has:
```properties
spring.jpa.hibernate.ddl-auto=update
```

Hibernate will automatically create tables on first run. You can:

1. Deploy with empty database
2. Let Hibernate create schema
3. Manually insert initial/seed data if needed

### Option 3: Use Migration Scripts

Create migration SQL scripts in `backend/src/main/resources/db/migration/`:

```sql
-- V1__Initial_schema.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    -- ... rest of schema
);
```

Add Flyway dependency to `pom.xml`:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

---

## Testing Your Deployment

### 1. Test Backend Health
```bash
curl https://your-backend-url.com/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### 2. Test Database Connection
```bash
curl https://your-backend-url.com/api/users
```

### 3. Test Frontend
1. Open your frontend URL in browser
2. Try to login
3. Check browser console for CORS errors

---

## Common Issues & Solutions

### Issue 1: CORS Errors
**Symptom**: "Access to fetch has been blocked by CORS policy"

**Solution**: Update `FRONTEND_URL` in backend environment variables to match exact frontend URL (including https://)

### Issue 2: Database Connection Failed
**Symptom**: "Connection refused" or "Unknown database"

**Solution**:
1. Verify `DATABASE_URL` format is correct
2. Check database is running
3. Verify credentials
4. Check firewall/security group settings

### Issue 3: 502 Bad Gateway
**Symptom**: Frontend loads but API calls fail

**Solution**:
1. Check backend logs
2. Verify backend is running
3. Check backend URL in frontend env vars

### Issue 4: Missing Environment Variables
**Symptom**: Backend fails to start

**Solution**: Double-check all required environment variables are set in your cloud platform

---

## Cost Estimates

### Railway (Recommended for Learning)
- **Free Tier**: $5 credit/month
- **Hobby Plan**: $5/month per service
- **Total**: ~$10-15/month for both services + DB

### Render
- **Free Tier**: Available but with limitations (spins down after inactivity)
- **Paid**: $7/month per service
- **Total**: ~$14-21/month

### AWS
- **RDS (db.t3.micro)**: ~$15/month
- **Elastic Beanstalk (t2.micro)**: ~$10/month
- **S3 + CloudFront**: ~$1-5/month
- **Total**: ~$25-35/month

### GCP
- **Cloud SQL (db-f1-micro)**: ~$10/month
- **Cloud Run**: Pay per use, ~$5-15/month
- **Cloud Storage**: ~$1-5/month
- **Total**: ~$15-30/month

---

## Next Steps

1. **Choose Your Platform** (Railway recommended for simplicity)
2. **Enable PostgreSQL** in pom.xml
3. **Update Configuration Files** with environment variables
4. **Create Cloud Database** (PostgreSQL)
5. **Deploy Backend** with environment variables
6. **Deploy Frontend** with backend URL
7. **Test Thoroughly**
8. **Set Up CI/CD** (optional) for automatic deployments

---

## Security Best Practices

1. **Never commit sensitive data** (passwords, keys) to git
2. **Use strong JWT secrets** (minimum 256 bits)
3. **Enable HTTPS** on both frontend and backend
4. **Use environment variables** for all configurations
5. **Regular database backups**
6. **Keep dependencies updated**
7. **Use security groups/firewall rules** properly
8. **Enable database SSL** if available

---

## Support Resources

- **Railway**: [railway.app/docs](https://docs.railway.app/)
- **Render**: [render.com/docs](https://render.com/docs)
- **AWS**: [aws.amazon.com/getting-started](https://aws.amazon.com/getting-started/)
- **Spring Boot**: [spring.io/guides](https://spring.io/guides)

---

## Quick Start Commands

### Build Backend
```bash
cd backend
mvn clean package -DskipTests
```

### Build Frontend
```bash
npm install
npm run build
```

### Test Locally with Production Profile
```bash
# Backend
cd backend
export SPRING_PROFILES_ACTIVE=prod
export DATABASE_URL=jdbc:postgresql://localhost:5432/nxtclass
export DB_USERNAME=postgres
export DB_PASSWORD=yourpassword
export JWT_SECRET=your-secret-key
export FRONTEND_URL=http://localhost:5173
mvn spring-boot:run

# Frontend
VITE_API_URL=http://localhost:8080/api npm run dev
```

---

Good luck with your deployment! 🚀
