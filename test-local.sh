#!/bin/bash

echo "🚀 NXT Class - Local Testing (Single Container)"
echo "================================================"
echo ""

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Stop existing container
if docker ps -a | grep -q nxtclass-local; then
    echo "🛑 Stopping existing container..."
    docker-compose -f docker-compose.local.yml down
    echo ""
fi

echo "🏗️  Building container (this may take 5-10 minutes first time)..."
docker-compose -f docker-compose.local.yml build

echo ""
echo "🚀 Starting container..."
docker-compose -f docker-compose.local.yml up -d

echo ""
echo "⏳ Waiting for services to start (30 seconds)..."
sleep 30

echo ""
echo "✅ Container started!"
echo ""
echo "================================================"
echo "🎉 Your application is ready!"
echo "================================================"
echo ""
echo "Access at: http://localhost"
echo ""
echo "Useful commands:"
echo "  View logs:  docker-compose -f docker-compose.local.yml logs -f"
echo "  Stop:       docker-compose -f docker-compose.local.yml down"
echo "  Restart:    docker-compose -f docker-compose.local.yml restart"
echo ""

# Try to open browser
if command -v open &> /dev/null; then
    echo "🌐 Opening browser..."
    sleep 2
    open http://localhost
elif command -v xdg-open &> /dev/null; then
    echo "🌐 Opening browser..."
    sleep 2
    xdg-open http://localhost
fi

echo ""
echo "✅ All done! Check http://localhost in your browser"
