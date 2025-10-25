#!/bin/bash

# Script to test deployment endpoints

echo "🧪 Testing Deployment Endpoints"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if URLs are provided
if [ -z "$1" ]; then
    echo "Usage: ./test-deployment.sh <backend-url> [frontend-url]"
    echo "Example: ./test-deployment.sh https://backend.railway.app https://frontend.railway.app"
    exit 1
fi

BACKEND_URL=$1
FRONTEND_URL=$2

echo "Backend URL: $BACKEND_URL"
if [ ! -z "$FRONTEND_URL" ]; then
    echo "Frontend URL: $FRONTEND_URL"
fi
echo ""

# Test 1: Backend Health Check
echo "Test 1: Backend Health Check"
echo "----------------------------"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/actuator/health")
if [ "$HEALTH_RESPONSE" -eq 200 ]; then
    echo -e "${GREEN}✓ Backend health check passed (200 OK)${NC}"
else
    echo -e "${RED}✗ Backend health check failed (HTTP $HEALTH_RESPONSE)${NC}"
fi
echo ""

# Test 2: Backend API Endpoint
echo "Test 2: Backend API Endpoint"
echo "----------------------------"
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/users")
if [ "$API_RESPONSE" -eq 200 ] || [ "$API_RESPONSE" -eq 401 ]; then
    echo -e "${GREEN}✓ Backend API endpoint accessible (HTTP $API_RESPONSE)${NC}"
else
    echo -e "${RED}✗ Backend API endpoint failed (HTTP $API_RESPONSE)${NC}"
fi
echo ""

# Test 3: Frontend (if URL provided)
if [ ! -z "$FRONTEND_URL" ]; then
    echo "Test 3: Frontend Accessibility"
    echo "------------------------------"
    FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
    if [ "$FRONTEND_RESPONSE" -eq 200 ]; then
        echo -e "${GREEN}✓ Frontend accessible (200 OK)${NC}"
    else
        echo -e "${RED}✗ Frontend failed (HTTP $FRONTEND_RESPONSE)${NC}"
    fi
    echo ""
fi

# Test 4: CORS Check
echo "Test 4: CORS Headers Check"
echo "--------------------------"
CORS_HEADERS=$(curl -s -I "$BACKEND_URL/api/users" | grep -i "access-control")
if [ ! -z "$CORS_HEADERS" ]; then
    echo -e "${GREEN}✓ CORS headers present${NC}"
    echo "$CORS_HEADERS"
else
    echo -e "${YELLOW}⚠ No CORS headers found (may need configuration)${NC}"
fi
echo ""

# Test 5: SSL/TLS Check
echo "Test 5: SSL/TLS Certificate"
echo "---------------------------"
if [[ $BACKEND_URL == https://* ]]; then
    SSL_CHECK=$(curl -s -I "$BACKEND_URL" | head -n 1)
    if [[ $SSL_CHECK == *"200"* ]] || [[ $SSL_CHECK == *"302"* ]]; then
        echo -e "${GREEN}✓ HTTPS working correctly${NC}"
    else
        echo -e "${RED}✗ HTTPS connection issue${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Backend not using HTTPS${NC}"
fi
echo ""

# Summary
echo "================================"
echo "📊 Test Summary"
echo "================================"
echo ""
echo "Next steps:"
echo "1. If all tests passed, your deployment is successful! 🎉"
echo "2. If any tests failed, check your environment variables"
echo "3. Review logs in your cloud platform dashboard"
echo "4. Ensure database is connected and running"
echo ""
