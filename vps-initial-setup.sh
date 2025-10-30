#!/bin/bash

# NXT Class - Hostinger VPS Initial Setup Script
# Run this script on your VPS for first-time setup

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║   NXT Class - VPS Initial Setup        ║"
echo "║   Hostinger VPS Configuration          ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root: sudo ./vps-initial-setup.sh${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Running as root${NC}"
echo ""

# Get VPS IP
VPS_IP=$(curl -s ifconfig.me)
echo -e "${BLUE}📍 Your VPS IP: ${YELLOW}$VPS_IP${NC}"
echo ""

# Get GitHub repo URL
echo -e "${YELLOW}Enter your GitHub repository URL:${NC}"
echo "(Example: https://github.com/username/repo.git)"
read -p "GitHub URL: " GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
    echo -e "${RED}❌ GitHub URL is required${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Starting setup...${NC}"
echo ""

# Step 1: Update system
echo -e "${YELLOW}[1/8] Updating system packages...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✅ System updated${NC}"
echo ""

# Step 2: Install Docker
echo -e "${YELLOW}[2/8] Installing Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker already installed${NC}"
else
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl start docker
    systemctl enable docker
    echo -e "${GREEN}✅ Docker installed${NC}"
fi
echo ""

# Step 3: Install Docker Compose
echo -e "${YELLOW}[3/8] Installing Docker Compose...${NC}"
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
else
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
fi
echo ""

# Step 4: Install Git
echo -e "${YELLOW}[4/8] Installing Git...${NC}"
if command -v git &> /dev/null; then
    echo -e "${GREEN}✅ Git already installed${NC}"
else
    apt install git -y
    echo -e "${GREEN}✅ Git installed${NC}"
fi
echo ""

# Step 5: Clone repository
echo -e "${YELLOW}[5/8] Cloning repository...${NC}"
cd /opt
if [ -d "nxtclass" ]; then
    echo -e "${YELLOW}⚠️  Directory /opt/nxtclass already exists${NC}"
    read -p "Remove and re-clone? (y/n): " RECLONE
    if [ "$RECLONE" = "y" ]; then
        rm -rf nxtclass
        git clone "$GITHUB_URL" nxtclass
        echo -e "${GREEN}✅ Repository cloned${NC}"
    else
        echo -e "${YELLOW}⏭️  Skipping clone${NC}"
    fi
else
    git clone "$GITHUB_URL" nxtclass
    echo -e "${GREEN}✅ Repository cloned${NC}"
fi
cd nxtclass
echo ""

# Step 6: Configure environment
echo -e "${YELLOW}[6/8] Configuring environment...${NC}"

# Generate strong passwords
MYSQL_ROOT_PASS=$(openssl rand -base64 32)
MYSQL_USER_PASS=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)

# Create .env file
cat > .env << EOF
# NXT Class - Production Configuration
# Auto-generated on $(date)

# ===================================
# DATABASE CONFIGURATION
# ===================================
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASS
MYSQL_DATABASE=nxtclass_db
MYSQL_USER=nxtclass_user
MYSQL_PASSWORD=$MYSQL_USER_PASS

# ===================================
# BACKEND CONFIGURATION
# ===================================
SPRING_PROFILE=prod
SHOW_SQL=false
JWT_SECRET=$JWT_SECRET
CORS_ALLOWED_ORIGINS=http://$VPS_IP,http://localhost

# ===================================
# FRONTEND CONFIGURATION
# ===================================
VITE_API_URL=http://$VPS_IP/api

# ===================================
# N8N CONFIGURATION (Optional)
# ===================================
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=$(openssl rand -base64 16)
N8N_HOST=$VPS_IP
N8N_PROTOCOL=http
WEBHOOK_URL=http://$VPS_IP:5678/
TIMEZONE=Asia/Kolkata

# ===================================
# DEPLOYMENT CONFIGURATION
# ===================================
DOMAIN_NAME=$VPS_IP
LETSENCRYPT_EMAIL=admin@localhost
EOF

echo -e "${GREEN}✅ Environment configured${NC}"
echo ""

# Step 7: Configure firewall
echo -e "${YELLOW}[7/8] Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw --force enable
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    ufw allow 5678/tcp  # n8n (optional)
    echo -e "${GREEN}✅ Firewall configured${NC}"
else
    apt install ufw -y
    ufw --force enable
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 5678/tcp
    echo -e "${GREEN}✅ Firewall installed and configured${NC}"
fi
echo ""

# Step 8: Initial deployment
echo -e "${YELLOW}[8/8] Building and starting services...${NC}"
echo "This will take 5-10 minutes for the first build..."
echo ""

docker-compose build
docker-compose up -d

echo ""
echo -e "${GREEN}✅ Services started${NC}"
echo ""

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start (30 seconds)...${NC}"
sleep 30

# Check status
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
docker-compose ps
echo ""

# Display summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     🎉 Setup Complete!                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📝 Important Information:${NC}"
echo ""
echo -e "${YELLOW}🌐 Access URLs:${NC}"
echo "   Frontend: http://$VPS_IP"
echo "   Backend:  http://$VPS_IP:8080"
echo "   API:      http://$VPS_IP/api"
echo ""
echo -e "${YELLOW}🔐 Database Credentials (saved in /opt/nxtclass/.env):${NC}"
echo "   MySQL Root Password: $MYSQL_ROOT_PASS"
echo "   MySQL User: nxtclass_user"
echo "   MySQL Password: $MYSQL_USER_PASS"
echo ""
echo -e "${YELLOW}🔑 JWT Secret (for backend):${NC}"
echo "   $JWT_SECRET"
echo ""
echo -e "${YELLOW}📂 Project Location:${NC}"
echo "   /opt/nxtclass"
echo ""
echo -e "${YELLOW}🔧 Useful Commands:${NC}"
echo "   View logs:    cd /opt/nxtclass && docker-compose logs -f"
echo "   Restart:      cd /opt/nxtclass && docker-compose restart"
echo "   Stop:         cd /opt/nxtclass && docker-compose down"
echo "   Health check: cd /opt/nxtclass && ./health-check.sh"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "   1. Test access: http://$VPS_IP"
echo "   2. Create admin user via API or database"
echo "   3. Setup GitHub Actions CI/CD (see CICD_SETUP.md)"
echo "   4. Share URL with reviewers: http://$VPS_IP"
echo ""
echo -e "${BLUE}📧 Save these credentials in a secure location!${NC}"
echo ""
echo -e "${GREEN}Setup script completed successfully!${NC}"
