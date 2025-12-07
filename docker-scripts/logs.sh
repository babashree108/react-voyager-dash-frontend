#!/bin/bash
ENV=${1:-local}
docker-compose -f ../docker-compose.$ENV.yml logs -f --tail=100 ${2:-}
