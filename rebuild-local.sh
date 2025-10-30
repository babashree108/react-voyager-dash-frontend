#!/bin/bash

echo "🧹 Cleaning up failed builds..."
echo ""

# Stop any existing containers
docker-compose -f docker-compose.local.yml down 2>/dev/null

# Remove failed build
docker rmi nxtclass-local 2>/dev/null

# Clean build cache
docker builder prune -f

echo "✅ Cleanup done"
echo ""
echo "🏗️  Building fresh container with Node.js 20..."
echo "   This will take 5-10 minutes"
echo ""

# Build with no cache
docker-compose -f docker-compose.local.yml build --no-cache

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting container..."
    docker-compose -f docker-compose.local.yml up -d
    
    echo ""
    echo "⏳ Waiting 30 seconds for services to start..."
    sleep 30
    
    echo ""
    echo "📊 Container status:"
    docker ps | grep nxtclass-local
    
    echo ""
    echo "✅ Done! Access at: http://localhost"
    echo ""
    echo "To check logs: docker-compose -f docker-compose.local.yml logs -f"
    
    # Try to open browser
    if command -v open &> /dev/null; then
        sleep 2
        open http://localhost
    fi
else
    echo ""
    echo "❌ Build failed!"
    echo ""
    echo "Check logs above for errors"
    echo ""
    echo "Common issues:"
    echo "  - Network connection for downloading Node.js"
    echo "  - Disk space"
    echo ""
    echo "View build logs: docker-compose -f docker-compose.local.yml build"
fi
