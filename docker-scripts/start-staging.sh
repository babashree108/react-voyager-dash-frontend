#!/bin/bash
set -e
echo "Starting STAGING (Ports: Frontend 4000, Backend 8081, DB 5433)"
[ ! -f ../.env.staging ] && echo "Create .env.staging first!" && exit 1
export $(cat ../.env.staging | grep -v '^#' | xargs)
docker-compose -f ../docker-compose.staging.yml up -d
echo "✅ STAGING started on ports 4000, 8081, 5433"
