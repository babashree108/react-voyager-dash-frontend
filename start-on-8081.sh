#!/bin/bash

echo "🚀 Starting NXT Class on port 8081 (port 80 is in use)"
echo "========================================================"
echo ""

# Stop if already running
docker-compose -f docker-compose.local.yml down 2>/dev/null

echo "🧹 Cleaning old builds..."
docker rmi nxtclass-local 2>/dev/null
docker builder prune -f

echo ""
echo "🏗️  Building container (5-10 minutes)..."
echo ""

# Build with no cache
docker-compose -f docker-compose.local.yml build --no-cache

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting container on port 8081..."
    docker-compose -f docker-compose.local.yml up -d
    
    echo ""
    echo "⏳ Waiting 30 seconds for services to start..."
    sleep 30
    
    echo ""
    echo "📊 Container status:"
    docker ps | grep nxtclass-local
    
    echo ""
    echo "================================================"
    echo "✅ Your application is ready!"
    echo "================================================"
    echo ""
    echo "Access at: http://localhost:8081"
    echo ""
    echo "Commands:"
    echo "  View logs:  docker-compose -f docker-compose.local.yml logs -f"
    echo "  Stop:       docker-compose -f docker-compose.local.yml down"
    echo "  Restart:    docker-compose -f docker-compose.local.yml restart"
    echo ""
    
    # Try to open browser
    if command -v open &> /dev/null; then
        echo "🌐 Opening browser..."
        sleep 2
        open http://localhost:8081
    fi
    
    echo ""
    echo "✅ Done! Check http://localhost:8081"
else
    echo ""
    echo "❌ Build failed! Check errors above"
fi
