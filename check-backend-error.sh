#!/bin/bash
echo "🔍 Checking why backend crashed..."
echo ""

echo "1. Backend error log:"
echo "===================="
docker exec nxtclass-local cat /var/log/backend-stderr.log 2>/dev/null || echo "No error log found"

echo ""
echo "2. Backend JAR file:"
echo "===================="
docker exec nxtclass-local ls -lh /app/backend/target/*.jar 2>/dev/null || echo "No JAR found"

echo ""
echo "3. MySQL is accessible?"
echo "===================="
docker exec nxtclass-local mysql -u nxtclass_user -pnxtclass_pass_2024 -e "SHOW DATABASES;" 2>/dev/null || echo "MySQL not accessible"

echo ""
echo "4. Try starting backend manually:"
echo "================================="
docker exec nxtclass-local bash -c "cd /app/backend && java -jar target/*.jar" &
sleep 5
pkill -f "java -jar"

