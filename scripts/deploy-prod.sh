#!/usr/bin/env bash
set -euo pipefail

# Simple deploy script for VPS (Ubuntu/Debian)
# - Installs Docker & Compose plugin if missing
# - Builds and starts the 3-container stack (db, backend, frontend)
# - Uses docker-compose.prod.yml and .env.prod if present

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE=".env.prod"
COMPOSE_FILE="docker-compose.prod.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "ERROR: $COMPOSE_FILE not found in $ROOT_DIR" >&2
  exit 1
fi

if [ -f "$ENV_FILE" ]; then
  echo "Using env file: $ENV_FILE"
  export $(grep -v '^#' "$ENV_FILE" | xargs -d '\n' -I {} echo {}) || true
else
  echo "NOTE: $ENV_FILE not found. Defaults will be used."
fi

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

install_docker() {
  echo "Installing Docker engine and compose plugin..."
  curl -fsSL https://get.docker.com | sh
  # Ensure docker is usable without sudo after relogin; keep sudo for current session
  sudo usermod -aG docker "$USER" || true
}

if ! need_cmd docker; then
  install_docker
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Installing docker compose plugin..."
  # Most recent distros get compose via docker.io package installed above
  # Fallback to manual install if needed
  DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
  mkdir -p "$DOCKER_CONFIG/cli-plugins"
  curl -SL "https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-$(uname -s)-$(uname -m)" \
    -o "$DOCKER_CONFIG/cli-plugins/docker-compose"
  chmod +x "$DOCKER_CONFIG/cli-plugins/docker-compose"
fi

echo "Building and starting stack..."
docker compose -f "$COMPOSE_FILE" up -d --build

echo "Waiting for services to become healthy..."
# Wait for backend health
for i in {1..60}; do
  if docker exec nxtclass-backend wget -q --spider http://localhost:8080/actuator/health; then
    echo "Backend healthy"
    break
  fi
  sleep 2
  if [ $i -eq 60 ]; then
    echo "WARNING: Backend did not report healthy in time" >&2
  fi
done

# Check frontend health
for i in {1..60}; do
  if curl -fsS http://localhost/health >/dev/null; then
    echo "Frontend healthy"
    break
  fi
  sleep 2
  if [ $i -eq 60 ]; then
    echo "WARNING: Frontend did not report healthy in time" >&2
  fi
done

echo "Done. Visit: http://<your-server-ip>/"
