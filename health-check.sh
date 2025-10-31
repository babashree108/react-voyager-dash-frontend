#!/bin/bash

# Health Check Script for NXT Class
# Run this to verify all services are running correctly

echo "🏥 NXT Class Health Check"
echo "========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if docker-compose is running
if ! docker-compose ps | grep -q "Up"; then
    echo -e "${RED}❌ No services are running${NC}"
    echo "Start services with: docker-compose up -d"
    exit 1
fi

echo "📊 Container Status:"
echo "-------------------"
docker-compose ps
echo ""

# Check each service
echo "🔍 Service Health Checks:"
echo "------------------------"

# Check MySQL
echo -n "MySQL Database... "
if docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
    echo -e "${GREEN}✅ Healthy${NC}"
else
    echo -e "${RED}❌ Unhealthy${NC}"
fi

# Check Backend
echo -n "Backend API... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health | grep -q "200"; then
    echo -e "${GREEN}✅ Healthy${NC}"
else
    echo -e "${RED}❌ Unhealthy${NC}"
    echo "   Check logs: docker-compose logs backend"
fi

# Check Frontend
echo -n "Frontend... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost/health | grep -q "200"; then
    echo -e "${GREEN}✅ Healthy${NC}"
else
    echo -e "${RED}❌ Unhealthy${NC}"
    echo "   Check logs: docker-compose logs frontend"
fi

# Check n8n if running
if docker-compose ps | grep -q "nxtclass-n8n"; then
    echo -n "n8n... "
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:5678 | grep -q "200"; then
        echo -e "${GREEN}✅ Healthy${NC}"
    else
        echo -e "${RED}❌ Unhealthy${NC}"
    fi
fi

echo ""
echo "🌐 Access URLs:"
echo "--------------"
echo "Frontend:    http://localhost"
echo "Backend:     http://localhost:8080"
echo "Backend API: http://localhost/api"
echo "MySQL:       localhost:3306"

if docker-compose ps | grep -q "nxtclass-n8n"; then
    echo "n8n:         http://localhost:5678"
fi

echo ""
echo "📋 Quick Commands:"
echo "-----------------"
echo "View logs:     docker-compose logs -f"
echo "Restart all:   docker-compose restart"
echo "Stop all:      docker-compose down"
echo ""
echo -e "${GREEN}Health check complete!${NC}"
