#!/bin/bash

echo "========================================"
echo "🚀 Starting NXT Class Local Container"
echo "========================================"

# Ensure MySQL listens on all interfaces for host access (DBeaver)
if [ -f "/etc/mysql/mysql.conf.d/mysqld.cnf" ]; then
    echo "🔧 Configuring MySQL to bind on 0.0.0.0 for external access..."
    sed -i 's/^bind-address\s*=.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf || true
    # Also handle newer MySQLX config if present
    sed -i 's/^mysqlx-bind-address\s*=.*/mysqlx-bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf || true
fi

# Initialize MySQL data directory if needed
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "📊 Initializing MySQL database..."
    mysqld --initialize-insecure --user=mysql --datadir=/var/lib/mysql
fi

# Ensure supervisor log directory exists
mkdir -p /var/log/supervisor

# Ensure MySQL and Nginx log directories exist with proper ownership
mkdir -p /var/log/mysql /var/log/nginx
chown -R mysql:mysql /var/log/mysql || true
chown -R www-data:www-data /var/log/nginx || true

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
