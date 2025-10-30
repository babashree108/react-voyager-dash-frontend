#!/bin/bash

# Script to help split monorepo into separate frontend and backend repositories

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║   Repository Separation Helper         ║"
echo "║   NXT Class - Split Frontend/Backend   ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Get information
echo -e "${YELLOW}Repository Information:${NC}"
echo ""
read -p "Enter your GitHub username: " GITHUB_USER
read -p "Enter frontend repo name [nxtclass-frontend]: " FRONTEND_REPO
FRONTEND_REPO=${FRONTEND_REPO:-nxtclass-frontend}
read -p "Enter backend repo name [nxtclass-backend]: " BACKEND_REPO
BACKEND_REPO=${BACKEND_REPO:-nxtclass-backend}
read -p "Enter working directory [$(pwd)/../]: " WORK_DIR
WORK_DIR=${WORK_DIR:-$(pwd)/../}

echo ""
echo -e "${BLUE}Configuration:${NC}"
echo "GitHub User: $GITHUB_USER"
echo "Frontend Repo: $FRONTEND_REPO"
echo "Backend Repo: $BACKEND_REPO"
echo "Working Directory: $WORK_DIR"
echo ""

read -p "Continue? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Cancelled."
    exit 0
fi

# Get current directory (monorepo location)
MONOREPO_DIR=$(pwd)

echo ""
echo -e "${GREEN}[1/6] Creating directory structure...${NC}"
mkdir -p "$WORK_DIR/$FRONTEND_REPO"
mkdir -p "$WORK_DIR/$BACKEND_REPO"

echo -e "${GREEN}[2/6] Setting up frontend repository...${NC}"
cd "$WORK_DIR/$FRONTEND_REPO"
git init
git remote add origin "https://github.com/$GITHUB_USER/$FRONTEND_REPO.git"

# Copy frontend files
echo "Copying frontend files..."
cp -r "$MONOREPO_DIR/src" ./
cp -r "$MONOREPO_DIR/public" ./
cp "$MONOREPO_DIR/package.json" ./
cp "$MONOREPO_DIR/package-lock.json" ./
cp "$MONOREPO_DIR/vite.config.ts" ./
cp "$MONOREPO_DIR"/tsconfig*.json ./
cp "$MONOREPO_DIR/tailwind.config.ts" ./
cp "$MONOREPO_DIR/postcss.config.js" ./
cp "$MONOREPO_DIR/index.html" ./
cp "$MONOREPO_DIR/Dockerfile" ./
cp "$MONOREPO_DIR/nginx.conf" ./
cp "$MONOREPO_DIR/components.json" ./
cp "$MONOREPO_DIR/eslint.config.js" ./

# Copy frontend-specific configs
cp "$MONOREPO_DIR/docker-compose.frontend.yml" ./docker-compose.yml
mkdir -p .github/workflows
cp "$MONOREPO_DIR/.github/workflows/deploy-frontend.yml" ./.github/workflows/deploy.yml

# Create .env.example
cat > .env.example << 'EOF'
# Frontend Environment Variables
VITE_API_URL=http://localhost:8080/api
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
EOF

# Create README
cat > README.md << EOF
# $FRONTEND_REPO

React + TypeScript + Vite frontend for NXT Class.

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## Deployment

\`\`\`bash
docker-compose up -d
\`\`\`

## Environment Variables

Copy \`.env.example\` to \`.env\` and configure.
EOF

echo -e "${GREEN}✅ Frontend repository prepared${NC}"

echo ""
echo -e "${GREEN}[3/6] Setting up backend repository...${NC}"
cd "$WORK_DIR/$BACKEND_REPO"
git init
git remote add origin "https://github.com/$GITHUB_USER/$BACKEND_REPO.git"

# Copy backend files
echo "Copying backend files..."
cp -r "$MONOREPO_DIR/backend/src" ./
cp "$MONOREPO_DIR/backend/pom.xml" ./
cp "$MONOREPO_DIR/backend/Dockerfile" ./
cp "$MONOREPO_DIR/backend/init-db.sql" ./
[ -f "$MONOREPO_DIR/backend/.dockerignore" ] && cp "$MONOREPO_DIR/backend/.dockerignore" ./

# Copy backend-specific configs
cp "$MONOREPO_DIR/backend/docker-compose.backend.yml" ./docker-compose.yml
mkdir -p .github/workflows
cp "$MONOREPO_DIR/.github/workflows/deploy-backend.yml" ./.github/workflows/deploy.yml

# Create .env.example
cat > .env.example << 'EOF'
# Database Configuration
MYSQL_ROOT_PASSWORD=change_me
MYSQL_DATABASE=nxtclass_db
MYSQL_USER=nxtclass_user
MYSQL_PASSWORD=change_me

# Backend Configuration
SPRING_PROFILE=prod
JWT_SECRET=change_me_to_long_random_string
CORS_ALLOWED_ORIGINS=http://localhost

# Deployment
SHOW_SQL=false
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
target/
.env
.env.local
*.log
.DS_Store
*.iml
.idea/
.vscode/
EOF

# Create README
cat > README.md << EOF
# $BACKEND_REPO

Spring Boot backend API for NXT Class.

## Quick Start

\`\`\`bash
mvn clean package
mvn spring-boot:run
\`\`\`

## Deployment

\`\`\`bash
docker-compose up -d
\`\`\`

## Environment Variables

See \`.env.example\` for configuration.
EOF

echo -e "${GREEN}✅ Backend repository prepared${NC}"

echo ""
echo -e "${GREEN}[4/6] Creating initial commits...${NC}"

cd "$WORK_DIR/$FRONTEND_REPO"
git add .
git commit -m "Initial commit: Frontend repository"
echo -e "${GREEN}✅ Frontend committed${NC}"

cd "$WORK_DIR/$BACKEND_REPO"
git add .
git commit -m "Initial commit: Backend repository"
echo -e "${GREEN}✅ Backend committed${NC}"

echo ""
echo -e "${GREEN}[5/6] Repository structure complete!${NC}"
echo ""

echo -e "${BLUE}📊 Summary:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}Frontend Repository:${NC}"
echo "  Location: $WORK_DIR/$FRONTEND_REPO"
echo "  Remote: https://github.com/$GITHUB_USER/$FRONTEND_REPO.git"
echo ""
echo -e "${YELLOW}Backend Repository:${NC}"
echo "  Location: $WORK_DIR/$BACKEND_REPO"
echo "  Remote: https://github.com/$GITHUB_USER/$BACKEND_REPO.git"
echo ""

echo -e "${GREEN}[6/6] Next Steps:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Create repositories on GitHub:"
echo "   - https://github.com/new"
echo "   - Create: $FRONTEND_REPO"
echo "   - Create: $BACKEND_REPO"
echo ""
echo "2. Push to GitHub:"
echo "   ${YELLOW}cd $WORK_DIR/$FRONTEND_REPO${NC}"
echo "   ${YELLOW}git branch -M main${NC}"
echo "   ${YELLOW}git push -u origin main${NC}"
echo ""
echo "   ${YELLOW}cd $WORK_DIR/$BACKEND_REPO${NC}"
echo "   ${YELLOW}git branch -M main${NC}"
echo "   ${YELLOW}git push -u origin main${NC}"
echo ""
echo "3. Setup VPS (see SEPARATE_REPOS.md)"
echo ""
echo "4. Configure GitHub Actions secrets for both repos:"
echo "   - VPS_HOST"
echo "   - VPS_USERNAME"
echo "   - VPS_SSH_KEY"
echo ""
echo -e "${GREEN}✅ Repository separation complete!${NC}"
echo ""
echo "📚 For detailed instructions, see: SEPARATE_REPOS.md"
