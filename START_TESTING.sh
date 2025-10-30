#!/bin/bash

# START TESTING - Mac Quick Test Script
# Run this script to test your NXT Class application on Mac

set -e

echo "🍎 NXT Class - Mac Testing Script"
echo "=================================="
echo ""

# Check if Docker is running
echo "1️⃣  Checking Docker Desktop..."
if ! docker ps &> /dev/null; then
    echo "❌ Docker is not running!"
    echo ""
    echo "Please:"
    echo "  1. Open Docker Desktop from Applications"
    echo "  2. Wait for whale icon to be steady in menu bar"
    echo "  3. Run this script again"
    exit 1
fi
echo "✅ Docker is running"
echo ""

# Check if services are already running
echo "2️⃣  Checking existing services..."
if docker-compose ps | grep -q "Up"; then
    echo "⚠️  Services are already running"
    echo ""
    read -p "Stop and restart? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Stopping services..."
        docker-compose down
    else
        echo "Keeping existing services"
        docker-compose ps
        echo ""
        echo "✅ Access your application:"
        echo "   Frontend: http://localhost"
        echo "   Backend:  http://localhost:8080"
        exit 0
    fi
fi

# Start services
echo "3️⃣  Starting services..."
echo ""
echo "⏳ This will take 5-10 minutes on first run (grab coffee ☕)"
echo "   Subsequent runs: ~30 seconds"
echo ""

docker-compose up -d

echo ""
echo "4️⃣  Waiting for services to start..."
sleep 10

# Show status
echo ""
echo "5️⃣  Service status:"
docker-compose ps
echo ""

# Wait for backend to be healthy
echo "6️⃣  Waiting for backend to be ready..."
echo -n "   "
for i in {1..30}; do
    if curl -s http://localhost:8080/actuator/health &> /dev/null; then
        echo " ✅"
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

# Run health checks
echo "7️⃣  Running health checks..."
echo ""

echo "   Frontend health:"
FRONTEND_HEALTH=$(curl -s http://localhost/health 2>/dev/null || echo "Not ready")
echo "   Response: $FRONTEND_HEALTH"

echo ""
echo "   Backend health:"
BACKEND_HEALTH=$(curl -s http://localhost:8080/actuator/health 2>/dev/null || echo "Not ready")
echo "   Response: $BACKEND_HEALTH"

echo ""
echo "   API test:"
API_TEST=$(curl -s http://localhost/api/student-details/list 2>/dev/null || echo "Not ready")
echo "   Response: $API_TEST"

echo ""
echo "✅ Setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Your application is ready!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Access URLs:"
echo "  🌐 Frontend:  http://localhost"
echo "  🔌 Backend:   http://localhost:8080"
echo "  📡 API:       http://localhost/api"
echo ""
echo "Useful commands:"
echo "  View logs:    docker-compose logs -f"
echo "  Check status: docker-compose ps"
echo "  Stop all:     docker-compose down"
echo "  Restart:      docker-compose restart"
echo ""
echo "Opening browser..."
sleep 2

# Try to open browser
if command -v open &> /dev/null; then
    open http://localhost
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost
else
    echo "Please open: http://localhost"
fi

echo ""
echo "🎯 Check your browser for the login page!"
echo ""
echo "Need help? See: TEST_NOW.md or MAC_TESTING_GUIDE.md"
echo ""
