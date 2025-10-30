# 🧪 Complete Testing & Deployment Guide

**Your complete guide from local testing to production deployment with CI/CD**

---

## 📋 Table of Contents

1. [Local Testing First](#-step-1-local-testing-first)
2. [VPS Initial Setup](#-step-2-vps-initial-setup)
3. [CI/CD Configuration](#-step-3-cicd-configuration)
4. [Testing the Pipeline](#-step-4-testing-the-pipeline)
5. [Sharing with Reviewers](#-step-5-sharing-with-reviewers)

---

## 🧪 Step 1: Local Testing First

**Goal:** Verify everything works locally before deploying to VPS

### Prerequisites Check

```bash
# Check Docker
docker --version
docker-compose --version

# If not installed:
# - Windows/Mac: Download Docker Desktop
# - Linux: curl -fsSL https://get.docker.com | sh
```

### Start Local Testing

```bash
# 1. Navigate to project
cd /path/to/nxtclass

# 2. Verify .env exists
ls -la .env
# Should already exist with localhost configuration

# 3. Start everything
./deploy.sh
# Choose: 1 (Fresh deployment)

# 4. Wait 5-10 minutes for first build
# Coffee break! ☕

# 5. Check health
./health-check.sh
```

### Verify Everything Works

```bash
# Test frontend
curl http://localhost/health
# Expected: healthy

# Test backend
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"}

# Test API
curl http://localhost/api/student-details/list
# Expected: [] or JSON array

# Open browser
open http://localhost
```

### Local Testing Checklist

- [ ] Frontend loads at http://localhost
- [ ] No console errors (F12 → Console)
- [ ] Can navigate to login page
- [ ] Backend API responds
- [ ] Database connection works
- [ ] All services show "Up" in `docker-compose ps`

**✅ If all checks pass, proceed to Step 2!**

### Stop Local Testing

```bash
# Stop services (keeps data)
docker-compose down

# Or full cleanup
docker-compose down -v
```

---

## 🚀 Step 2: VPS Initial Setup

**Goal:** Setup your Hostinger VPS with automated script

### Get Your VPS IP

1. Login to Hostinger control panel
2. Find your VPS IP address
3. Note it down: `123.45.67.89` (example)

### SSH to Your VPS

```bash
# Connect to VPS
ssh root@YOUR_VPS_IP
# Enter your VPS password

# You should see something like:
# Welcome to Ubuntu 22.04 LTS
# root@vps-xxxxx:~#
```

### Run Automated Setup Script

**Option A: Run from GitHub (Recommended)**

```bash
# Download and run setup script
curl -sL https://raw.githubusercontent.com/YOURUSERNAME/YOURREPO/main/vps-initial-setup.sh -o setup.sh
chmod +x setup.sh
./setup.sh

# Follow the prompts:
# 1. Enter your GitHub repository URL
#    Example: https://github.com/username/nxtclass.git
# 2. Wait 10-15 minutes for installation
# 3. Note down the credentials shown at the end
```

**Option B: Manual Setup (If script fails)**

```bash
# 1. Update system
apt update && apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com | sh

# 3. Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. Install Git
apt install git -y

# 5. Clone repository
cd /opt
git clone https://github.com/YOURUSERNAME/YOURREPO.git nxtclass
cd nxtclass

# 6. Get your VPS IP
VPS_IP=$(curl -s ifconfig.me)
echo "Your VPS IP: $VPS_IP"

# 7. Create .env file
cp .env.example .env
nano .env

# Update these values in .env:
VITE_API_URL=http://YOUR_VPS_IP/api
CORS_ALLOWED_ORIGINS=http://YOUR_VPS_IP
# Change all passwords to strong values!

# 8. Configure firewall
apt install ufw -y
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 9. Deploy
docker-compose build
docker-compose up -d

# 10. Check status
docker-compose ps
```

### Verify VPS Deployment

```bash
# On VPS, check services
cd /opt/nxtclass
./health-check.sh

# From your local machine
curl http://YOUR_VPS_IP/health
# Expected: healthy

# Open in browser
http://YOUR_VPS_IP
```

### VPS Setup Checklist

- [ ] SSH access working
- [ ] Docker installed
- [ ] Repository cloned to `/opt/nxtclass`
- [ ] `.env` configured with VPS IP
- [ ] Firewall configured
- [ ] Services running (`docker-compose ps` shows all Up)
- [ ] Application accessible at http://YOUR_VPS_IP
- [ ] Credentials saved securely

**✅ VPS is ready! Proceed to Step 3 for CI/CD.**

---

## 🔄 Step 3: CI/CD Configuration

**Goal:** Setup automatic deployment on git push to main

### Part A: Setup SSH Keys for GitHub Actions

**On your LOCAL machine:**

```bash
# 1. Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/nxtclass_deploy
# Press Enter for no passphrase (required for automation)

# 2. View public key
cat ~/.ssh/nxtclass_deploy.pub
# Copy this entire output

# 3. View private key
cat ~/.ssh/nxtclass_deploy
# Copy this entire output (including BEGIN and END lines)
```

**On your VPS:**

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Add public key to authorized_keys
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the PUBLIC key content
# Save: Ctrl+X, Y, Enter

# Set permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**Test SSH key authentication:**

```bash
# From your local machine
ssh -i ~/.ssh/nxtclass_deploy root@YOUR_VPS_IP
# Should connect WITHOUT asking for password
exit
```

### Part B: Add GitHub Secrets

Go to GitHub:

**Your Repository → Settings → Secrets and variables → Actions → New repository secret**

Add these 3 secrets:

#### Secret 1: VPS_HOST
- **Name:** `VPS_HOST`
- **Value:** Your VPS IP (e.g., `123.45.67.89`)

#### Secret 2: VPS_USERNAME  
- **Name:** `VPS_USERNAME`
- **Value:** `root`

#### Secret 3: VPS_SSH_KEY
- **Name:** `VPS_SSH_KEY`
- **Value:** Paste ENTIRE content of `~/.ssh/nxtclass_deploy` (private key)
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAA...
  ... entire key content ...
  -----END OPENSSH PRIVATE KEY-----
  ```

#### Optional Secret: VPS_PORT
- **Name:** `VPS_PORT`
- **Value:** `22` (default SSH port)

### Part C: Verify Workflow Files Exist

```bash
# Check if workflow files exist
ls -la .github/workflows/

# Should show:
# deploy.yml - Deploys on push to main
# test.yml   - Tests on PRs and feature branches
```

### CI/CD Setup Checklist

- [ ] SSH key pair generated
- [ ] Public key added to VPS authorized_keys
- [ ] SSH key authentication tested (works without password)
- [ ] GitHub secret `VPS_HOST` added
- [ ] GitHub secret `VPS_USERNAME` added
- [ ] GitHub secret `VPS_SSH_KEY` added (private key)
- [ ] Workflow files exist in `.github/workflows/`

**✅ CI/CD configured! Proceed to Step 4 for testing.**

---

## 🧪 Step 4: Testing the Pipeline

**Goal:** Verify automatic deployment works

### Test 1: Manual Workflow Trigger

1. **Go to GitHub:**
   - Your Repository → **Actions** tab

2. **Find Deploy Workflow:**
   - Click **Deploy to Hostinger VPS**

3. **Trigger Manually:**
   - Click **Run workflow** button (top right)
   - Select branch: `main`
   - Click **Run workflow**

4. **Watch Deployment:**
   - Click on the running workflow
   - Click **deploy** job
   - Watch logs in real-time

5. **Verify Success:**
   - Should complete in 3-5 minutes
   - All steps should show ✅
   - Final status should be green

6. **Test Application:**
   - Open: http://YOUR_VPS_IP
   - Should load successfully

### Test 2: Automatic Deployment (Push to Main)

```bash
# On your local machine
cd /path/to/nxtclass

# Make a small test change
echo "# CI/CD Test" >> README.md

# Check status
git status

# Add and commit
git add README.md
git commit -m "test: verify CI/CD deployment"

# Push to main
git push origin main
```

**Watch the magic happen! 🪄**

1. **GitHub Actions starts automatically**
   - Go to: Repository → Actions
   - You'll see new workflow running

2. **Deployment process (3-5 minutes):**
   - ⬇️ Connects to VPS
   - 📥 Pulls latest code
   - ⏹️ Stops services
   - 🏗️ Rebuilds images
   - ▶️ Starts services
   - ✅ Complete!

3. **Verify deployment:**
   ```bash
   # Check from local machine
   curl http://YOUR_VPS_IP/health
   
   # Or open in browser
   open http://YOUR_VPS_IP
   ```

### Test 3: Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feature/test-feature

# Make changes
echo "console.log('test');" >> src/test.js

# Commit and push
git add .
git commit -m "feat: test feature"
git push origin feature/test-feature

# Go to GitHub
# Create Pull Request
# This triggers TEST workflow (not deploy)
# Tests should pass before merging
```

### CI/CD Testing Checklist

- [ ] Manual workflow trigger works
- [ ] Automatic deployment on push to main works
- [ ] Deployment completes successfully (green checkmark)
- [ ] Application updates on VPS
- [ ] Application accessible after deployment
- [ ] Test workflow runs on feature branches/PRs

**✅ CI/CD is working! Ready to share with reviewers.**

---

## 👥 Step 5: Sharing with Reviewers

**Goal:** Share your application and provide access details

### What to Share

**1. Application URL:**
```
http://YOUR_VPS_IP
```

**2. Access Information:**
```
Application: http://YOUR_VPS_IP
Backend API: http://YOUR_VPS_IP/api
Health Check: http://YOUR_VPS_IP/health
```

**3. Test Credentials:**

⚠️ **You need to create test accounts first!**

**Option 1: Create via API**
```bash
curl -X POST http://YOUR_VPS_IP/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo_admin",
    "email": "admin@nxtclass.com",
    "password": "Demo@123",
    "role": "orgadmin"
  }'
```

**Option 2: Create via Database**
```bash
# SSH to VPS
ssh root@YOUR_VPS_IP
cd /opt/nxtclass

# Connect to database
docker-compose exec mysql mysql -u nxtclass_user -p
# Use password from /opt/nxtclass/.env

# Create user
USE nxtclass_db;
INSERT INTO users (username, email, password, role, status) 
VALUES ('demo_admin', 'admin@nxtclass.com', 'hashed_password', 'orgadmin', 'active');
```

### Sample Email to Reviewers

```
Subject: NXT Class Application - Review Request

Hi [Reviewer Name],

I've deployed the NXT Class application for your review. Here are the access details:

🌐 Application URL: http://YOUR_VPS_IP

📱 Test Credentials:
- Username: demo_admin
- Password: Demo@123
- Role: Administrator

✨ Features to Test:
1. Login and Dashboard
2. Student Management (Add/Edit/Delete students)
3. Teacher Management (Add/Edit/Delete teachers)
4. Subject Management
5. Course Management
6. Responsive UI (try on mobile/tablet)

📊 Current Status:
- Core features: 100% complete
- User management: Fully functional
- Virtual classroom: UI only (planned)
- Quiz system: Planned

🔄 Deployment:
- Auto-deploys on code updates
- Available 24/7
- Updates take 3-5 minutes

📝 Feedback:
Please share any bugs, suggestions, or issues you encounter.

Thank you!
```

### Monitoring for Reviewers

```bash
# Check application status
curl http://YOUR_VPS_IP/health

# Check API
curl http://YOUR_VPS_IP/api/student-details/list

# View deployment history
# https://github.com/YOURUSERNAME/YOURREPO/actions
```

### Reviewer Checklist Document

Share this with reviewers:

```markdown
# NXT Class - Review Checklist

## Access
- [ ] Can access http://YOUR_VPS_IP
- [ ] Can login with provided credentials
- [ ] Dashboard loads successfully

## Features to Test
- [ ] Student Management
  - [ ] Add new student
  - [ ] Edit student details
  - [ ] Delete student
  - [ ] View student list
  
- [ ] Teacher Management
  - [ ] Add new teacher
  - [ ] Edit teacher details
  - [ ] Delete teacher
  - [ ] View teacher list

- [ ] Navigation
  - [ ] Sidebar navigation works
  - [ ] All pages accessible
  - [ ] No broken links

- [ ] UI/UX
  - [ ] Responsive design (mobile/tablet)
  - [ ] No visual bugs
  - [ ] Forms work correctly
  - [ ] Loading states visible

## Report Issues
- Browser used: ____________
- Issue description: ____________
- Steps to reproduce: ____________
```

---

## 🎉 Complete Workflow Summary

### Your Development Workflow

```
1. Local Development
   ├── Make changes in IDE
   ├── Test locally: ./deploy.sh
   └── Verify at http://localhost

2. Feature Branch
   ├── Create branch: git checkout -b feature/name
   ├── Make changes
   ├── Commit: git commit -m "feat: description"
   └── Push: git push origin feature/name

3. Pull Request
   ├── Create PR on GitHub
   ├── Tests run automatically
   ├── Review and approve
   └── Merge to main

4. Automatic Deployment
   ├── GitHub Actions triggered
   ├── Deploys to VPS (3-5 min)
   └── Live at http://YOUR_VPS_IP

5. Share with Reviewers
   └── http://YOUR_VPS_IP
```

---

## 🔧 Quick Reference Commands

### Local Testing
```bash
./deploy.sh              # Interactive deployment
./health-check.sh        # Check service health
docker-compose logs -f   # View logs
docker-compose down      # Stop services
```

### VPS Management
```bash
ssh root@YOUR_VPS_IP                    # Connect to VPS
cd /opt/nxtclass                        # Go to project
docker-compose ps                       # Check status
docker-compose logs -f                  # View logs
docker-compose restart                  # Restart services
git log -1                              # Last deployment
```

### Monitoring Deployments
```bash
# GitHub Actions
https://github.com/YOURUSERNAME/YOURREPO/actions

# Application Health
curl http://YOUR_VPS_IP/health

# API Health
curl http://YOUR_VPS_IP/api/student-details/list
```

---

## 📞 Need Help?

### Documentation
- **Local Testing:** [LOCAL_TESTING.md](./LOCAL_TESTING.md)
- **CI/CD Setup:** [CICD_SETUP.md](./CICD_SETUP.md)
- **Full Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)

### Troubleshooting

**Local Issues:**
- Services won't start: `docker-compose down -v && docker-compose up -d`
- Port conflicts: Change ports in `docker-compose.yml`
- See: [LOCAL_TESTING.md](./LOCAL_TESTING.md)

**VPS Issues:**
- SSH to VPS and check: `cd /opt/nxtclass && docker-compose logs`
- Restart services: `docker-compose restart`
- Check firewall: `ufw status`

**CI/CD Issues:**
- Check GitHub Actions logs
- Verify GitHub secrets are set correctly
- Test SSH: `ssh -i ~/.ssh/nxtclass_deploy root@VPS_IP`

---

## ✅ Final Checklist

### Before Going Live
- [ ] Local testing complete
- [ ] VPS setup complete
- [ ] CI/CD configured and tested
- [ ] Application accessible at http://YOUR_VPS_IP
- [ ] Test accounts created
- [ ] Reviewers can access application
- [ ] Documentation shared
- [ ] Monitoring in place

**🎉 You're all set! Your application is live and ready for review!**

**Share this URL with reviewers:** `http://YOUR_VPS_IP`
