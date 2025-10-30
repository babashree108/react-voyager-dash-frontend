#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo "🧪 NXT Class Local Testing Script"
echo -e "========================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo "Please start Docker and try again."
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Menu
echo "Select an option:"
echo "1) Build and start container"
echo "2) Start existing container"
echo "3) Stop container"
echo "4) View logs"
echo "5) Enter container shell"
echo "6) Check service status"
echo "7) Test API endpoints"
echo "8) Clean up (remove container and volumes)"
echo ""
read -p "Enter choice [1-8]: " choice

case $choice in
    1)
        echo -e "${YELLOW}🔨 Building container...${NC}"
        docker-compose -f docker-compose.local.yml build --no-cache
        
        echo -e "${YELLOW}🚀 Starting container...${NC}"
        docker-compose -f docker-compose.local.yml up -d
        
        echo ""
        echo -e "${GREEN}✅ Container started!${NC}"
        echo ""
        echo "Waiting for services to initialize (this takes ~60 seconds)..."
        sleep 10
        
        echo ""
        echo "Checking container status..."
        docker-compose -f docker-compose.local.yml ps
        
        echo ""
        echo -e "${BLUE}========================================"
        echo "Access the application:"
        echo "  Frontend: http://localhost"
        echo "  Health:   http://localhost/health"
        echo ""
        echo "View logs:"
        echo "  docker-compose -f docker-compose.local.yml logs -f"
        echo ""
        echo "Or run: ./test-local.sh and select option 4"
        echo -e "========================================${NC}"
        ;;
    2)
        echo -e "${YELLOW}🚀 Starting container...${NC}"
        docker-compose -f docker-compose.local.yml up -d
        docker-compose -f docker-compose.local.yml ps
        ;;
    3)
        echo -e "${YELLOW}🛑 Stopping container...${NC}"
        docker-compose -f docker-compose.local.yml down
        echo -e "${GREEN}✅ Container stopped${NC}"
        ;;
    4)
        echo -e "${YELLOW}📋 Viewing logs (Ctrl+C to exit)...${NC}"
        docker-compose -f docker-compose.local.yml logs -f
        ;;
    5)
        echo -e "${YELLOW}🔧 Entering container shell...${NC}"
        docker exec -it nxtclass-local bash
        ;;
    6)
        echo -e "${YELLOW}🔍 Checking service status...${NC}"
        docker exec nxtclass-local supervisorctl status
        ;;
    7)
        echo -e "${YELLOW}🧪 Testing API endpoints...${NC}"
        echo ""
        
        echo "1. Testing health endpoint..."
        curl -s http://localhost/health
        echo ""
        
        echo ""
        echo "2. Testing login..."
        TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
          -H "Content-Type: application/json" \
          -d '{"email":"admin@nxtclass.com","password":"Admin@123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        
        if [ -n "$TOKEN" ]; then
            echo -e "${GREEN}✅ Login successful!${NC}"
            echo "Token: ${TOKEN:0:20}..."
            echo ""
            
            echo "3. Testing course list..."
            curl -s http://localhost/api/course/list \
              -H "Authorization: Bearer $TOKEN" | head -c 200
            echo ""
            echo ""
            
            echo "4. Testing student list..."
            curl -s http://localhost/api/student-details/list \
              -H "Authorization: Bearer $TOKEN" | head -c 200
            echo ""
            echo ""
            
            echo -e "${GREEN}✅ All API tests passed!${NC}"
        else
            echo -e "${RED}❌ Login failed${NC}"
        fi
        ;;
    8)
        echo -e "${RED}⚠️  This will remove the container and all data!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" == "yes" ]; then
            echo -e "${YELLOW}🧹 Cleaning up...${NC}"
            docker-compose -f docker-compose.local.yml down -v
            docker rmi nxtclass-local 2>/dev/null
            rm -rf logs/
            echo -e "${GREEN}✅ Cleanup complete${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac
