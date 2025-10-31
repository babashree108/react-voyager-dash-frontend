#!/bin/bash

# NXT Class Development Startup Script
# This script helps you start the development environment quickly

set -e

echo "🎓 NXT Class - Development Environment Setup"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created. Please update it with your values!${NC}"
    echo ""
    echo "Important: Generate a secure JWT secret with:"
    echo "  openssl rand -base64 64 | tr -d '\n'"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to exit and update .env..."
fi

# Check if JWT_SECRET is set
if grep -q "your_jwt_secret_here" .env; then
    echo -e "${RED}❌ JWT_SECRET not configured in .env${NC}"
    echo "Please update .env with a secure JWT secret:"
    echo "  openssl rand -base64 64 | tr -d '\n'"
    exit 1
fi

echo -e "${GREEN}✅ Environment file configured${NC}"
echo ""

# Menu
echo "Select startup option:"
echo "1) Start with Docker Compose (Recommended)"
echo "2) Start Backend only (Local Dev)"
echo "3) Start Frontend only (Local Dev)"
echo "4) Start Both Backend & Frontend (Local Dev)"
echo "5) Stop all Docker containers"
echo "6) Clean all Docker resources"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo -e "${GREEN}🐳 Starting all services with Docker Compose...${NC}"
        docker-compose up -d
        echo ""
        echo -e "${GREEN}✅ Services started!${NC}"
        echo ""
        echo "Access points:"
        echo "  Frontend: http://localhost"
        echo "  Backend:  http://localhost:8080"
        echo "  API Docs: http://localhost:8080/actuator"
        echo ""
        echo "View logs with: docker-compose logs -f"
        echo "Stop with: docker-compose down"
        ;;
    2)
        echo -e "${GREEN}🚀 Starting Backend (Local)...${NC}"
        cd backend
        echo "Loading environment variables..."
        export $(cat ../.env | grep -v '^#' | xargs)
        echo "Starting Spring Boot..."
        mvn spring-boot:run
        ;;
    3)
        echo -e "${GREEN}🚀 Starting Frontend (Local)...${NC}"
        cd frontend
        echo "Installing dependencies (if needed)..."
        npm install
        echo "Starting Vite dev server..."
        npm run dev
        ;;
    4)
        echo -e "${GREEN}🚀 Starting Backend & Frontend (Local)...${NC}"
        
        # Start backend in background
        echo "Starting Backend..."
        cd backend
        export $(cat ../.env | grep -v '^#' | xargs)
        mvn spring-boot:run > ../backend.log 2>&1 &
        BACKEND_PID=$!
        cd ..
        
        # Wait a bit for backend to start
        echo "Waiting for backend to initialize..."
        sleep 10
        
        # Start frontend
        echo "Starting Frontend..."
        cd frontend
        npm install
        npm run dev
        
        # Cleanup on exit
        trap "kill $BACKEND_PID" EXIT
        ;;
    5)
        echo -e "${YELLOW}🛑 Stopping all Docker containers...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ All containers stopped${NC}"
        ;;
    6)
        echo -e "${RED}⚠️  This will remove all containers, volumes, and data!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" == "yes" ]; then
            echo "Cleaning up Docker resources..."
            docker-compose down -v
            docker system prune -f
            echo -e "${GREEN}✅ Docker resources cleaned${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac
