#!/bin/bash

echo "🔍 Checking NXT Class Container Logs"
echo "====================================="
echo ""

echo "1️⃣  Container Status:"
docker ps | grep nxtclass-local
echo ""

echo "2️⃣  All Services Status (inside container):"
docker exec nxtclass-local supervisorctl status
echo ""

echo "3️⃣  Backend Logs (last 50 lines):"
echo "-----------------------------------"
docker exec nxtclass-local tail -50 /var/log/backend-stdout.log
echo ""

echo "4️⃣  Backend Errors (if any):"
echo "-----------------------------------"
docker exec nxtclass-local tail -50 /var/log/backend-stderr.log
echo ""

echo "5️⃣  Nginx Logs (last 20 lines):"
echo "-----------------------------------"
docker exec nxtclass-local tail -20 /var/log/nginx/access.log
echo ""

echo "6️⃣  Test API Endpoint:"
echo "-----------------------------------"
curl -s http://localhost/api/student-details/list || echo "API not responding"
echo ""

echo "7️⃣  Test Backend Direct:"
echo "-----------------------------------"
docker exec nxtclass-local curl -s http://localhost:8080/api/student-details/list || echo "Backend not responding"
echo ""

echo "✅ Diagnostics complete!"
