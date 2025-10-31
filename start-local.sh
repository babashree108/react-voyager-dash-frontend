#!/bin/bash

echo "========================================"
echo "🚀 Starting NXT Class Local Container"
echo "========================================"

# Initialize MySQL data directory if needed
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "📊 Initializing MySQL database..."
    mysqld --initialize-insecure --user=mysql --datadir=/var/lib/mysql
fi

# Start MySQL temporarily to create database and user
echo "🔧 Starting MySQL for initialization..."
mysqld_safe --skip-networking &
MYSQL_PID=$!

# Wait for MySQL to start
echo "⏳ Waiting for MySQL to be ready..."
for i in {1..30}; do
    if mysqladmin ping &>/dev/null; then
        echo "✅ MySQL is ready!"
        break
    fi
    echo -n "."
    sleep 1
done

# Create database and user
echo "🔨 Creating database and user..."
mysql -u root <<-EOSQL
    CREATE DATABASE IF NOT EXISTS nxtClass108;
    CREATE USER IF NOT EXISTS 'nxtclass_user'@'localhost' IDENTIFIED BY 'nxtclass_pass_2024';
    CREATE USER IF NOT EXISTS 'nxtclass_user'@'%' IDENTIFIED BY 'nxtclass_pass_2024';
    GRANT ALL PRIVILEGES ON nxtClass108.* TO 'nxtclass_user'@'localhost';
    GRANT ALL PRIVILEGES ON nxtClass108.* TO 'nxtclass_user'@'%';
    FLUSH PRIVILEGES;
    USE nxtClass108;
    SHOW TABLES;
EOSQL

echo "✅ Database setup complete!"

# Stop temporary MySQL
echo "🛑 Stopping temporary MySQL..."
mysqladmin shutdown
wait $MYSQL_PID

# Start all services with supervisor
echo "🎯 Starting all services with Supervisor..."
echo ""
echo "Services starting:"
echo "  ✓ MySQL      (port 3306)"
echo "  ✓ Backend    (port 8080)"
echo "  ✓ Nginx      (port 80)"
echo ""
echo "========================================"
echo "Access the application:"
echo "  Frontend: http://localhost"
echo "  API:      http://localhost/api"
echo "  Health:   http://localhost/health"
echo ""
echo "Default login:"
echo "  Email:    admin@nxtclass.com"
echo "  Password: Admin@123"
echo "========================================"

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
