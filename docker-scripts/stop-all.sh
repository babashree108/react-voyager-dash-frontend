#!/bin/bash
docker-compose -f ../docker-compose.local.yml down 2>/dev/null || true
docker-compose -f ../docker-compose.staging.yml down 2>/dev/null || true
docker-compose -f ../docker-compose.prod.yml down 2>/dev/null || true
echo "✅ All stopped"
