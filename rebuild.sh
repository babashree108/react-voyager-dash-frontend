#!/bin/bash

echo "🔄 Rebuilding NXT Class Container"
echo "=================================="
echo ""

echo "📝 Your code changes will be included in this rebuild"
echo ""

# Stop container
echo "1️⃣  Stopping container..."
docker-compose -f docker-compose.local.yml down

echo ""
echo "2️⃣  Rebuilding container (2-5 minutes)..."
echo "   - Frontend build (npm)"
echo "   - Backend build (Maven)"
echo ""

# Rebuild
docker-compose -f docker-compose.local.yml build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "3️⃣  Starting container..."
    docker-compose -f docker-compose.local.yml up -d
    
    echo ""
    echo "⏳ Waiting 20 seconds for services..."
    sleep 20
    
    echo ""
    echo "✅ Done!"
    echo ""
    echo "Access your updated app at: http://localhost"
    echo ""
    echo "To view logs: docker-compose -f docker-compose.local.yml logs -f"
    
    # Open browser
    if command -v open &> /dev/null; then
        sleep 2
        open http://localhost
    fi
else
    echo ""
    echo "❌ Build failed! Check errors above"
    echo ""
    echo "Try clean rebuild: docker-compose -f docker-compose.local.yml build --no-cache"
fi
