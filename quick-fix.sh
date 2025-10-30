#!/bin/bash

echo "🔧 Quick Fix - Restart Services"
echo "================================"
echo ""

echo "1. Checking service status..."
docker exec nxtclass-local supervisorctl status

echo ""
echo "2. Restarting all services..."
docker exec nxtclass-local supervisorctl restart all

echo ""
echo "3. Waiting 10 seconds..."
sleep 10

echo ""
echo "4. Checking status again..."
docker exec nxtclass-local supervisorctl status

echo ""
echo "5. Testing backend..."
docker exec nxtclass-local curl -s http://localhost:8080/actuator/health

echo ""
echo "6. Testing API..."
curl -s http://localhost/api/student-details/list

echo ""
echo "✅ Done! Refresh http://localhost in your browser"
