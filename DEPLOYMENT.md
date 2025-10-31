# Deployment Guide

## Local Testing

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## VPS Deployment

### Prerequisites
- VPS with Ubuntu 20.04+
- Docker and Docker Compose installed
- Git installed

### Setup

1. **Clone repository on VPS:**
```bash
git clone <your-repo-url>
cd nxtclass
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your production values
```

3. **Start services:**
```bash
docker-compose up -d
```

4. **Check services:**
```bash
docker-compose ps
docker-compose logs -f
```

### Access

- Frontend: `http://YOUR_VPS_IP`
- Backend: `http://YOUR_VPS_IP:8080`

### CI/CD with GitHub Actions

The repository includes GitHub Actions workflows in `.github/workflows/`:

- `deploy-frontend.yml` - Deploys frontend on changes to `frontend/**`
- `deploy-backend.yml` - Deploys backend on changes to `backend/**`
- `test.yml` - Runs tests on pull requests

Configure your VPS details in GitHub Secrets:
- `VPS_HOST` - Your VPS IP
- `VPS_USERNAME` - SSH username
- `VPS_SSH_KEY` - SSH private key

### Maintenance

```bash
# Update from git
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Clean restart
docker-compose down -v
docker-compose up -d --build
```
