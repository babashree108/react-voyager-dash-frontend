# 🔄 CI/CD Setup with GitHub Actions

Complete guide to setup automatic deployment to Hostinger VPS on every push to main branch.

> **Note:** This guide is for **monorepo setup** with smart deployments. Frontend and backend deploy independently based on which files changed.

---

## 📋 Overview

When you push to `main` branch:
1. GitHub Actions detects which files changed (frontend or backend)
2. Triggers appropriate workflow (frontend-only, backend-only, or both)
3. Connects to your Hostinger VPS via SSH
4. Pulls latest code
5. Rebuilds only the changed service(s)
6. Restarts only what was rebuilt
7. ✅ Your application is updated (2-5 min)!

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Setup SSH Access to VPS

```bash
# On your LOCAL machine, generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/hostinger_deploy
# Press Enter for no passphrase (for automation)

# Copy public key
cat ~/.ssh/hostinger_deploy.pub
# Copy the entire output

# SSH to your Hostinger VPS
ssh root@your-vps-ip

# Add the public key
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key, save and exit

# Test connection from your local machine
ssh -i ~/.ssh/hostinger_deploy root@your-vps-ip
# Should connect without password
exit
```

### Step 2: Add GitHub Secrets

Go to your GitHub repository:

**GitHub.com → Your Repo → Settings → Secrets and variables → Actions → New repository secret**

Add these 3 secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `VPS_HOST` | Your VPS IP address | `123.45.67.89` |
| `VPS_USERNAME` | SSH username | `root` |
| `VPS_SSH_KEY` | Private SSH key content | Content of `~/.ssh/hostinger_deploy` |

**To get private key content:**
```bash
cat ~/.ssh/hostinger_deploy
# Copy ENTIRE content including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... key content ...
# -----END OPENSSH PRIVATE KEY-----
```

**Optional secret:**
| Secret Name | Value | Default |
|-------------|-------|---------|
| `VPS_PORT` | SSH port | `22` |

### Step 3: Initial VPS Setup

```bash
# SSH to your VPS
ssh root@your-vps-ip

# Install Docker and Docker Compose (if not already)
curl -fsSL https://get.docker.com | sh
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create project directory and clone repo
cd /opt
git clone https://github.com/yourusername/your-repo-name.git nxtclass
cd nxtclass

# Create .env file
cp .env.example .env
nano .env
```

**Important: Update .env with your VPS IP:**
```env
# Use your VPS IP address (no domain needed)
VITE_API_URL=http://YOUR_VPS_IP/api
CORS_ALLOWED_ORIGINS=http://YOUR_VPS_IP

# Change all passwords!
MYSQL_ROOT_PASSWORD=strong_password_here
MYSQL_PASSWORD=strong_password_here
JWT_SECRET=very-long-random-secret-key-minimum-64-characters

# Rest keep default
MYSQL_DATABASE=nxtclass_db
MYSQL_USER=nxtclass_user
```

**Save and initial deploy:**
```bash
# First deployment
docker-compose build
docker-compose up -d

# Check status
docker-compose ps
./health-check.sh
```

**Your app is now accessible at:** `http://YOUR_VPS_IP`

---

## ✅ Testing the CI/CD Pipeline

### Test 1: Manual Trigger

1. Go to GitHub: **Your Repo → Actions**
2. Click **Deploy to Hostinger VPS**
3. Click **Run workflow** → **Run workflow**
4. Watch the deployment in real-time
5. Check your VPS: `http://YOUR_VPS_IP`

### Test 2: Automatic Trigger (Push to Main)

```bash
# On your local machine
cd /path/to/nxtclass

# Make a small change
echo "# Test CI/CD" >> README.md

# Commit and push
git add .
git commit -m "test: CI/CD deployment"
git push origin main

# Watch GitHub Actions
# Go to: GitHub.com → Your Repo → Actions
# You'll see the workflow running

# Wait 3-5 minutes
# Check your VPS: http://YOUR_VPS_IP
```

---

## 📊 How It Works

### Workflow File: `.github/workflows/deploy.yml`

```yaml
on:
  push:
    branches: [main]  # Triggers on push to main
  workflow_dispatch:   # Allows manual trigger
```

**Deployment Steps:**
1. ✅ Connects to VPS via SSH
2. ✅ Navigates to `/opt/nxtclass`
3. ✅ Pulls latest code from GitHub
4. ✅ Stops running containers
5. ✅ Rebuilds Docker images
6. ✅ Starts new containers
7. ✅ Cleans up old images
8. ✅ Checks service health

**Typical deployment time:** 3-5 minutes

---

## 🔍 Monitoring Deployments

### View Deployment Logs on GitHub

1. Go to **Your Repo → Actions**
2. Click on latest workflow run
3. Click **deploy** job
4. See real-time logs

### View Deployment Logs on VPS

```bash
# SSH to VPS
ssh root@your-vps-ip

# Check service status
cd /opt/nxtclass
docker-compose ps

# View logs
docker-compose logs -f

# Check last deployment
git log -1
```

---

## 🛠️ Configuration for IP-Based Access (No Domain)

Since you don't have a domain yet, here's the complete setup:

### 1. Update .env on VPS

```bash
ssh root@your-vps-ip
cd /opt/nxtclass
nano .env
```

**Set these values:**
```env
# Replace with YOUR actual VPS IP
VITE_API_URL=http://123.45.67.89/api
CORS_ALLOWED_ORIGINS=http://123.45.67.89,http://localhost

# Security (change these!)
MYSQL_ROOT_PASSWORD=your_strong_password
MYSQL_PASSWORD=your_strong_password
JWT_SECRET=your-very-long-random-secret-key-min-64-chars

# Rest keep default
MYSQL_DATABASE=nxtclass_db
MYSQL_USER=nxtclass_user
SPRING_PROFILE=prod
```

### 2. Rebuild and Restart

```bash
docker-compose down
docker-compose build --no-cache frontend  # Rebuild with new API URL
docker-compose up -d
```

### 3. Configure Firewall (Important!)

```bash
# Install UFW firewall
apt install ufw -y

# Allow SSH (important - don't lock yourself out!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS (for future SSL)
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

### 4. Test Access

```bash
# From your local machine
curl http://YOUR_VPS_IP/health
# Should return: healthy

curl http://YOUR_VPS_IP/api/student-details/list
# Should return: JSON data or empty array

# Open in browser
http://YOUR_VPS_IP
```

---

## 🎯 Development Workflow

### Recommended Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and test locally
./deploy.sh
# Test at http://localhost

# 3. Commit changes
git add .
git commit -m "feat: add new feature"

# 4. Push feature branch
git push origin feature/new-feature

# 5. Create Pull Request on GitHub
# This triggers test builds (see .github/workflows/test.yml)

# 6. After PR review, merge to main
# This automatically deploys to VPS!
```

### Testing Before Deployment

The test workflow (`.github/workflows/test.yml`) runs on:
- ✅ Pull requests to main
- ✅ Pushes to feature branches

**Tests include:**
- Frontend build verification
- Backend build verification  
- Docker image build tests

---

## 🔧 Advanced Configuration

### Add Deployment Notifications

Update `.github/workflows/deploy.yml` to send notifications:

```yaml
# Add at end of deploy job
- name: 📧 Send notification
  if: always()
  run: |
    if [ "${{ job.status }}" == "success" ]; then
      curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
        -d '{"text":"✅ Deployment successful!"}'
    else
      curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
        -d '{"text":"❌ Deployment failed!"}'
    fi
```

### Add Rollback on Failure

```yaml
# In deploy.yml, add after deployment:
- name: 🔄 Rollback on failure
  if: failure()
  run: |
    ssh ${{ secrets.VPS_USERNAME }}@${{ secrets.VPS_HOST }} \
      "cd /opt/nxtclass && \
       git checkout HEAD~1 && \
       docker-compose up -d --build"
```

### Multiple Environment Deployment

Create separate workflows for staging/production:

```bash
.github/workflows/
├── deploy-staging.yml   # Deploys on push to develop
├── deploy-production.yml # Deploys on push to main
└── test.yml
```

---

## 🚨 Troubleshooting CI/CD

### Issue 1: SSH Connection Failed

**Error:** `Permission denied (publickey)`

**Solution:**
```bash
# 1. Verify GitHub secret VPS_SSH_KEY is correct
# Copy private key again:
cat ~/.ssh/hostinger_deploy

# 2. Verify public key is on VPS
ssh root@your-vps-ip
cat ~/.ssh/authorized_keys
# Should contain your public key

# 3. Test manual SSH
ssh -i ~/.ssh/hostinger_deploy root@your-vps-ip
```

### Issue 2: Git Pull Fails on VPS

**Error:** `error: Your local changes would be overwritten`

**Solution:**
```bash
# SSH to VPS
ssh root@your-vps-ip
cd /opt/nxtclass

# Reset to clean state
git fetch origin main
git reset --hard origin/main

# Or in deploy.yml (already included):
git reset --hard origin/main
```

### Issue 3: Docker Build Fails

**Check logs in GitHub Actions:**
1. Go to Actions tab
2. Click failed workflow
3. Look for error messages

**Common causes:**
- Missing dependencies
- Build errors in code
- Insufficient VPS resources

### Issue 4: Services Don't Start

**SSH to VPS and check:**
```bash
cd /opt/nxtclass
docker-compose ps
docker-compose logs

# Check disk space
df -h

# Check memory
free -h

# Restart services
docker-compose restart
```

---

## 📈 Monitoring Your Application

### Setup Health Check Monitoring

Create a simple monitoring script on VPS:

```bash
# On VPS
nano /opt/monitor.sh
```

Add:
```bash
#!/bin/bash
if curl -f http://localhost/health > /dev/null 2>&1; then
  echo "✅ App is healthy"
else
  echo "❌ App is down, restarting..."
  cd /opt/nxtclass
  docker-compose restart
fi
```

```bash
chmod +x /opt/monitor.sh

# Add to crontab (check every 5 minutes)
crontab -e
# Add: */5 * * * * /opt/monitor.sh
```

---

## ✅ Deployment Checklist

Before setting up CI/CD:

- [ ] Local testing complete (all tests pass)
- [ ] GitHub repository created
- [ ] SSH key generated
- [ ] SSH access to VPS configured
- [ ] GitHub secrets added (VPS_HOST, VPS_USERNAME, VPS_SSH_KEY)
- [ ] Initial VPS setup done
- [ ] .env configured on VPS with VPS IP
- [ ] Firewall configured
- [ ] Manual deployment tested

After CI/CD setup:

- [ ] Manual workflow trigger works
- [ ] Automatic deployment on push works
- [ ] Application accessible at http://VPS_IP
- [ ] All features work correctly
- [ ] Monitoring setup (optional)

---

## 🎉 You're All Set!

Your CI/CD pipeline is now configured!

**Workflow:**
1. ✅ Make changes locally
2. ✅ Test with `./deploy.sh`
3. ✅ Push to GitHub
4. ✅ Automatic deployment to VPS
5. ✅ Access at `http://YOUR_VPS_IP`

**Share with reviewers:** `http://YOUR_VPS_IP`

---

## 📞 Quick Commands Reference

```bash
# View GitHub Actions
https://github.com/yourusername/repo/actions

# SSH to VPS
ssh root@your-vps-ip

# Check deployment status
cd /opt/nxtclass && docker-compose ps

# View logs
docker-compose logs -f

# Manual restart
docker-compose restart

# Check latest deployment
git log -1

# Test access
curl http://YOUR_VPS_IP/health
```

---

**Need help? Check deployment logs in GitHub Actions or SSH to VPS and run `docker-compose logs -f`**
