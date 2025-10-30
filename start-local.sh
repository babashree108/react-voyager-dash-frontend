#!/bin/bash
set -e

echo "🚀 Starting NXT Class - All-in-One Container"
echo "=============================================="

# Start MySQL directly (don't use service command)
echo "📦 Starting MySQL..."
mkdir -p /var/run/mysqld
chown mysql:mysql /var/run/mysqld
mysqld --user=mysql --daemonize

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
for i in {1..30}; do
    if mysqladmin ping -h localhost --silent; then
        echo "✅ MySQL is ready!"
        break
    fi
    echo "   Waiting... ($i/30)"
    sleep 2
done

# Create database and user
echo "🗄️  Setting up database..."
mysql -e "CREATE DATABASE IF NOT EXISTS nxtclass_db;" || true
mysql -e "CREATE USER IF NOT EXISTS 'nxtclass_user'@'localhost' IDENTIFIED BY 'nxtclass_pass_2024';" || true
mysql -e "GRANT ALL PRIVILEGES ON nxtclass_db.* TO 'nxtclass_user'@'localhost';" || true
mysql -e "FLUSH PRIVILEGES;" || true

# Import initial SQL if exists
if [ -f /app/backend/init-db.sql ]; then
    echo "📥 Importing initial data..."
    mysql nxtclass_db < /app/backend/init-db.sql || true
fi

echo "✅ Database configured!"
echo ""

# Start Backend
echo "🚀 Starting Backend..."
cd /app/backend
nohup java -jar target/*.jar > /var/log/backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "⏳ Waiting for backend to be ready..."
for i in {1..60}; do
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    echo "   Waiting... ($i/60)"
    sleep 2
done

# Start Nginx
echo "🌐 Starting Nginx..."
nginx

echo ""
echo "================================================"
echo "✅ ALL SERVICES STARTED!"
echo "================================================"
echo ""
echo "Access your application at: http://localhost"
echo ""
echo "Services running:"
echo "  - MySQL (internal:3306)"
echo "  - Backend (internal:8080)"
echo "  - Nginx (port 80)"
echo ""

# Keep container running and show logs
echo "📋 Viewing backend logs (Ctrl+C won't stop container)..."
tail -f /var/log/backend.log
