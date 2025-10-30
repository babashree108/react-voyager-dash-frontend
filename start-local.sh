#!/bin/bash

echo "🚀 Starting NXT Class - All-in-One Container"
echo "=============================================="

# Initialize MySQL
echo "📦 Initializing MySQL..."
service mysql start
sleep 5

# Create database and user
echo "🗄️  Setting up database..."
mysql -e "CREATE DATABASE IF NOT EXISTS nxtclass_db;"
mysql -e "CREATE USER IF NOT EXISTS 'nxtclass_user'@'localhost' IDENTIFIED BY 'nxtclass_pass_2024';"
mysql -e "GRANT ALL PRIVILEGES ON nxtclass_db.* TO 'nxtclass_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Import initial SQL if exists
if [ -f /app/backend/init-db.sql ]; then
    echo "📥 Importing initial data..."
    mysql nxtclass_db < /app/backend/init-db.sql
fi

echo "✅ Database ready!"

# Stop MySQL (supervisor will restart it)
service mysql stop
sleep 2

echo "🎯 Starting all services with supervisor..."
echo ""
echo "Services starting:"
echo "  1. MySQL (internal)"
echo "  2. Backend API (internal:8080)"
echo "  3. Nginx (port 80)"
echo ""
echo "Access your application at: http://localhost"
echo ""

# Start supervisor (this keeps the container running)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
