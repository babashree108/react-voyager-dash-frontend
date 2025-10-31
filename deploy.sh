#!/bin/bash

# NXT Class Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 NXT Class Deployment Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${RED}❗ Please edit .env file with your configuration before continuing!${NC}"
    echo "   Run: nano .env"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Please install Docker first:"
    echo "  curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "  sh get-docker.sh"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    echo "Please install Docker Compose first"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Ask what to do
echo "What would you like to do?"
echo "1) Fresh deployment (build and start)"
echo "2) Rebuild and restart"
echo "3) Start existing containers"
echo "4) Stop containers"
echo "5) View logs"
echo "6) Backup database"
echo "7) Clean everything (⚠️  WARNING: Deletes all data!)"
read -p "Enter choice [1-7]: " choice

case $choice in
    1)
        echo -e "${YELLOW}📦 Starting fresh deployment...${NC}"
        echo "Building Docker images (this may take 5-10 minutes)..."
        docker-compose build --no-cache
        echo ""
        echo "Starting services..."
        docker-compose up -d
        echo ""
        echo -e "${GREEN}✅ Deployment complete!${NC}"
        ;;
    2)
        echo -e "${YELLOW}🔄 Rebuilding and restarting...${NC}"
        docker-compose down
        docker-compose build
        docker-compose up -d
        echo -e "${GREEN}✅ Rebuild complete!${NC}"
        ;;
    3)
        echo -e "${YELLOW}▶️  Starting containers...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✅ Containers started!${NC}"
        ;;
    4)
        echo -e "${YELLOW}⏹️  Stopping containers...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Containers stopped!${NC}"
        ;;
    5)
        echo -e "${YELLOW}📋 Showing logs (Ctrl+C to exit)...${NC}"
        docker-compose logs -f
        ;;
    6)
        echo -e "${YELLOW}💾 Creating database backup...${NC}"
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        docker-compose exec -T mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} nxtclass_db > "$BACKUP_FILE"
        echo -e "${GREEN}✅ Backup saved to: $BACKUP_FILE${NC}"
        ;;
    7)
        read -p "⚠️  Are you sure? This will delete ALL data! (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${RED}🗑️  Cleaning everything...${NC}"
            docker-compose down -v
            docker system prune -a -f
            echo -e "${GREEN}✅ Cleanup complete!${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo "📊 Container Status:"
echo "================================"
docker-compose ps

echo ""
echo "================================"
echo "🌐 Access URLs:"
echo "================================"
echo "Frontend:  http://localhost or http://your-domain.com"
echo "Backend:   http://localhost:8080"
echo "MySQL:     localhost:3306"
echo "n8n:       http://localhost:5678 (if enabled)"
echo ""
echo "================================"
echo "📝 Useful Commands:"
echo "================================"
echo "View logs:           docker-compose logs -f"
echo "Stop services:       docker-compose down"
echo "Restart service:     docker-compose restart <service-name>"
echo "Check health:        docker-compose ps"
echo ""
echo -e "${GREEN}🎉 Done!${NC}"
