# 🚀 START HERE - Complete Setup Guide

**Your step-by-step guide from local testing to production with CI/CD**

---

## 📖 Quick Navigation

Choose your path:

1. **[Test Locally First](#-path-1-test-locally-first-recommended)** ⭐ Recommended
2. **[Deploy to VPS](#-path-2-deploy-to-vps)**
3. **[Setup CI/CD](#-path-3-setup-cicd-auto-deployment)**

---

## 🎯 Path 1: Test Locally First (Recommended)

**Time:** 10 minutes  
**Goal:** Verify everything works on your machine

### Quick Start

```bash
# 1. Open terminal in project directory
cd /path/to/nxtclass

# 2. Run deployment script
./deploy.sh

# 3. Choose option 1 (Fresh deployment)
# Wait 5-10 minutes ☕

# 4. Open browser
http://localhost
```

### What You Get

✅ Frontend: http://localhost  
✅ Backend: http://localhost:8080  
✅ API: http://localhost/api  
✅ MySQL: localhost:3306

### Verify It Works

```bash
# Check health
./health-check.sh

# Should show:
# ✅ MySQL Database... Healthy
# ✅ Backend API... Healthy
# ✅ Frontend... Healthy
```

### Troubleshooting

**Port 80 already in use?**
```bash
# Change port in docker-compose.yml
ports:
  - "8081:80"  # Use 8081 instead of 80
# Access via http://localhost:8081
```

**Services won't start?**
```bash
docker-compose down -v
docker-compose up -d --build
```

**📚 Full guide:** [LOCAL_TESTING.md](./LOCAL_TESTING.md)

---

## 🌐 Path 2: Deploy to VPS

**Time:** 20 minutes  
**Goal:** Get your app live on Hostinger VPS

### Prerequisites

- Hostinger VPS account
- VPS IP address
- SSH access to VPS

### Option A: Automated Setup (Easy) ⭐

```bash
# 1. SSH to your VPS
ssh root@YOUR_VPS_IP

# 2. Download and run setup script
curl -sL https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/vps-initial-setup.sh -o setup.sh
chmod +x setup.sh
./setup.sh

# 3. Enter your GitHub repo URL when prompted
# https://github.com/username/repo.git

# 4. Wait 10-15 minutes
# Script will:
# ✅ Install Docker & Docker Compose
# ✅ Clone your repository
# ✅ Configure environment with your VPS IP
# ✅ Setup firewall
# ✅ Deploy application

# 5. Save the credentials shown at the end!
```

### Option B: Manual Setup

See [CICD_SETUP.md](./CICD_SETUP.md) for detailed manual setup instructions.

### Access Your App

Once setup completes:

```
✅ Your app is live at: http://YOUR_VPS_IP
✅ Backend API: http://YOUR_VPS_IP/api
✅ Health check: http://YOUR_VPS_IP/health
```

### Test It Works

```bash
# From your local machine
curl http://YOUR_VPS_IP/health
# Should return: healthy

# Open in browser
http://YOUR_VPS_IP
```

**📚 Full guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🔄 Path 3: Setup CI/CD (Auto-deployment)

**Time:** 15 minutes  
**Goal:** Auto-deploy on every git push to main

### Prerequisites

- ✅ Local testing complete
- ✅ VPS setup complete  
- ✅ Application accessible at http://YOUR_VPS_IP

### Step 1: Generate SSH Key

```bash
# On YOUR LOCAL machine
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/nxtclass_deploy
# Press Enter for no passphrase

# View public key
cat ~/.ssh/nxtclass_deploy.pub
# Copy this output

# View private key
cat ~/.ssh/nxtclass_deploy
# Copy this ENTIRE output (including BEGIN and END lines)
```

### Step 2: Add Public Key to VPS

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Add public key
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste public key, save (Ctrl+X, Y, Enter)

# Set permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
exit
```

### Step 3: Test SSH Connection

```bash
# From local machine
ssh -i ~/.ssh/nxtclass_deploy root@YOUR_VPS_IP
# Should connect WITHOUT password
exit
```

### Step 4: Add GitHub Secrets

Go to: **GitHub.com → Your Repo → Settings → Secrets and variables → Actions**

Click **New repository secret** and add:

#### Secret 1: VPS_HOST
- Name: `VPS_HOST`
- Value: `YOUR_VPS_IP` (e.g., 123.45.67.89)

#### Secret 2: VPS_USERNAME
- Name: `VPS_USERNAME`
- Value: `root`

#### Secret 3: VPS_SSH_KEY
- Name: `VPS_SSH_KEY`
- Value: Paste entire content of `~/.ssh/nxtclass_deploy` (private key)

### Step 5: Test CI/CD

#### Manual Test

1. Go to **GitHub → Your Repo → Actions**
2. Click **Deploy to Hostinger VPS**
3. Click **Run workflow** → **Run workflow**
4. Watch it deploy! (3-5 minutes)
5. Check: http://YOUR_VPS_IP

#### Automatic Test

```bash
# Make a change
echo "# CI/CD Test" >> README.md

# Commit and push
git add README.md
git commit -m "test: CI/CD"
git push origin main

# Watch GitHub Actions
# Go to: GitHub → Actions
# Should deploy automatically!
```

### What Happens on Every Push

```
1. You push to main branch
   ↓
2. GitHub Actions starts automatically
   ↓
3. Connects to VPS via SSH
   ↓
4. Pulls latest code
   ↓
5. Rebuilds Docker images
   ↓
6. Restarts services
   ↓
7. ✅ Live in 3-5 minutes!
```

**📚 Full guide:** [CICD_SETUP.md](./CICD_SETUP.md)

---

## 👥 Sharing with Reviewers

### What to Share

**Application URL:**
```
http://YOUR_VPS_IP
```

**Test Credentials:**

⚠️ Create test account first:

```bash
# Method 1: Via API
curl -X POST http://YOUR_VPS_IP/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo_admin",
    "email": "admin@nxtclass.com", 
    "password": "Demo@123",
    "role": "orgadmin"
  }'

# Method 2: Via Database
ssh root@YOUR_VPS_IP
cd /opt/nxtclass
docker-compose exec mysql mysql -u nxtclass_user -p
# Use password from .env file
```

### Sample Email

```
Subject: NXT Class - Review Access

Hi Team,

The NXT Class application is now live!

🌐 URL: http://YOUR_VPS_IP

🔐 Demo Credentials:
Username: demo_admin
Password: Demo@123

✨ Features Available:
- Student Management (Add/Edit/Delete)
- Teacher Management (Add/Edit/Delete)
- Subject Management
- Course Management
- Dashboard Views

🔄 Updates:
- Auto-deploys on code changes
- Available 24/7
- Always latest version

Please test and share feedback!

Thanks!
```

---

## 🎯 Complete Workflow

### Your Daily Development

```
1. Local Development
   └── Make changes → Test with ./deploy.sh

2. Create Feature Branch  
   └── git checkout -b feature/name

3. Commit Changes
   └── git commit -m "feat: description"

4. Push Feature Branch
   └── git push origin feature/name

5. Create Pull Request
   └── Tests run automatically on GitHub

6. Merge to Main
   └── Auto-deploys to VPS in 3-5 minutes

7. Share
   └── http://YOUR_VPS_IP is updated!
```

---

## 📚 Documentation Reference

| Guide | Purpose | Time |
|-------|---------|------|
| **[LOCAL_TESTING.md](./LOCAL_TESTING.md)** | Test locally before VPS | 10 min |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Complete VPS deployment | 30 min |
| **[CICD_SETUP.md](./CICD_SETUP.md)** | Setup auto-deployment | 15 min |
| **[TESTING_DEPLOYMENT_GUIDE.md](./TESTING_DEPLOYMENT_GUIDE.md)** | Full workflow guide | Reference |
| **[QUICKSTART.md](./QUICKSTART.md)** | Quick reference | 5 min |

---

## 🔧 Quick Commands

### Local Development
```bash
./deploy.sh              # Start/deploy locally
./health-check.sh        # Check service health
docker-compose ps        # View status
docker-compose logs -f   # View logs
docker-compose down      # Stop services
```

### VPS Management
```bash
ssh root@YOUR_VPS_IP                # Connect
cd /opt/nxtclass                    # Go to project
./health-check.sh                   # Check health
docker-compose restart              # Restart
docker-compose logs -f              # View logs
git log -1                          # Last deployment
```

### Monitoring
```bash
# Check application
curl http://YOUR_VPS_IP/health

# Check API
curl http://YOUR_VPS_IP/api/student-details/list

# View GitHub Actions
https://github.com/USERNAME/REPO/actions
```

---

## 🚨 Common Issues

### Local: Port 80 in use
```bash
# Edit docker-compose.yml, change port
ports: ["8081:80"]
# Access via http://localhost:8081
```

### VPS: Can't connect
```bash
# Check firewall
ufw status
ufw allow 80/tcp

# Check services
docker-compose ps
docker-compose restart
```

### CI/CD: SSH connection failed
```bash
# Test SSH key
ssh -i ~/.ssh/nxtclass_deploy root@VPS_IP

# Verify GitHub secret VPS_SSH_KEY is correct
# Copy ENTIRE private key including BEGIN/END lines
```

---

## ✅ Final Checklist

### Before Going Live

- [ ] Local testing complete ✅
- [ ] VPS setup complete ✅  
- [ ] CI/CD configured ✅
- [ ] Application accessible at http://YOUR_VPS_IP ✅
- [ ] Test accounts created ✅
- [ ] Firewall configured ✅
- [ ] Credentials saved securely ✅
- [ ] Documentation shared with team ✅

---

## 🎉 You're All Set!

Your application is:
- ✅ Running locally
- ✅ Deployed to VPS
- ✅ Auto-deploying on git push
- ✅ Ready to share with reviewers

**Share this URL:** `http://YOUR_VPS_IP`

---

## 📞 Need Help?

1. **Check the guides:**
   - Local issues → [LOCAL_TESTING.md](./LOCAL_TESTING.md)
   - VPS issues → [DEPLOYMENT.md](./DEPLOYMENT.md)
   - CI/CD issues → [CICD_SETUP.md](./CICD_SETUP.md)

2. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Run health check:**
   ```bash
   ./health-check.sh
   ```

4. **Check GitHub Actions:**
   - Go to Actions tab
   - View deployment logs

---

**Happy Deploying! 🚀**
