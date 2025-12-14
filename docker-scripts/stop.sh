#!/bin/bash
ENV=${1:-local}
docker-compose -f ../docker-compose.$ENV.yml down
echo "✅ $ENV stopped"
