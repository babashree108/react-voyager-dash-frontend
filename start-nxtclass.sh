#!/bin/bash

echo "🚀 Starting NXT Class (Single Container)"
echo "=========================================="
echo ""

# Stop ccbp-ide if running
if docker ps | grep -q ccbp-ide; then
    echo "🛑 Stopping ccbp-ide container..."
    docker stop ccbp-ide
    echo "✅ ccbp-ide stopped"
    echo ""
fi

# Stop any existing nxtclass container
docker-compose -f docker-compose.local.yml down 2>/dev/null

echo "🧹 Cleaning old builds..."
docker rmi nxtclass-local 2>/dev/null
docker builder prune -f

echo ""
echo "🏗️  Building nxtclass container..."
echo "   Installing Node.js 20, MySQL, Java, Nginx"
echo "   This takes 5-10 minutes (first time only)"
echo ""

# Build
docker-compose -f docker-compose.local.yml build --no-cache

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting nxtclass container..."
    docker-compose -f docker-compose.local.yml up -d
    
    echo ""
    echo "⏳ Waiting 30 seconds for services to start..."
    sleep 30
    
    echo ""
    echo "📊 Container status:"
    docker ps | grep nxtclass-local
    
    echo ""
    echo "================================================"
    echo "✅ NXT Class is ready!"
    echo "================================================"
    echo ""
    echo "Access at: http://localhost"
    echo ""
    echo "Useful commands:"
    echo "  View logs:  docker-compose -f docker-compose.local.yml logs -f"
    echo "  Stop:       docker-compose -f docker-compose.local.yml down"
    echo "  Restart:    docker-compose -f docker-compose.local.yml restart"
    echo ""
    echo "To restart ccbp-ide later:"
    echo "  docker start ccbp-ide"
    echo ""
    
    # Try to open browser
    if command -v open &> /dev/null; then
        echo "🌐 Opening browser..."
        sleep 2
        open http://localhost
    fi
    
    echo ""
    echo "✅ Done! Check http://localhost"
else
    echo ""
    echo "❌ Build failed! Check errors above"
    echo ""
    echo "To see detailed logs:"
    echo "  docker-compose -f docker-compose.local.yml logs"
fi
