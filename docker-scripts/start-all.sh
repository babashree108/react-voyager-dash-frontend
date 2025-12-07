#!/bin/bash
echo "Starting ALL: Local(3000,8080,5432) Staging(4000,8081,5433) Prod(5000,8082,5434)"
./start-local.sh && ./start-staging.sh && ./start-prod.sh
