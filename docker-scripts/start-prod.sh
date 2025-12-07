#!/bin/bash
set -e
echo "Starting PRODUCTION (Ports: Frontend 5000, Backend 8082, DB 5434)"
[ ! -f ../.env.prod ] && echo "Create .env.prod first!" && exit 1
export $(cat ../.env.prod | grep -v '^#' | xargs)
docker-compose -f ../docker-compose.prod.yml up -d
echo "✅ PRODUCTION started on ports 5000, 8082, 5434"
