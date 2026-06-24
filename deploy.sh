#!/bin/bash

# AMTMTI Platform - cPanel Deployment Script
# Usage: ./deploy.sh <ssh-user@host> <target-path>
# Example: ./deploy.sh user@amtmti.africa /home/user/public_html

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SSH_TARGET="${1:-}"
DEPLOY_PATH="${2:-/home/user/public_html/amtmti}"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Check arguments
if [ -z "$SSH_TARGET" ]; then
    echo -e "${RED}Error: SSH target not provided${NC}"
    echo "Usage: ./deploy.sh <ssh-user@host> <target-path>"
    echo "Example: ./deploy.sh user@amtmti.africa /home/user/public_html"
    exit 1
fi

echo -e "${YELLOW}AMTMTI Platform - Deployment Script${NC}"
echo "======================================"
echo "Target: $SSH_TARGET"
echo "Deploy Path: $DEPLOY_PATH"
echo "Timestamp: $TIMESTAMP"
echo ""

# Step 1: Create backup directory
echo -e "${YELLOW}Step 1: Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
ZIP_FILE="${BACKUP_DIR}/amtmti-backup-${TIMESTAMP}.zip"

# Step 2: Build the application
echo -e "${YELLOW}Step 2: Building application...${NC}"
npm run build || {
    echo -e "${RED}Build failed. Aborting deployment.${NC}"
    exit 1
}

# Step 3: Create deployment package
echo -e "${YELLOW}Step 3: Creating deployment package...${NC}"
DEPLOY_ZIP="amtmti-deploy-${TIMESTAMP}.zip"

# Exclude unnecessary files
zip -r "$DEPLOY_ZIP" . \
    -x "node_modules/*" \
    ".next/cache/*" \
    ".next/static/*" \
    ".git/*" \
    ".gitignore" \
    "backups/*" \
    "*.env.local" \
    ".env.local" \
    ".vercel/*" \
    "supabase/migrations/test/*" \
    ".DS_Store" \
    "Thumbs.db" \
    "deploy.sh" \
    "*.md" \
    ".eslintrc*" \
    "jest.config*" \
    "tsconfig*.json" \
    "CPANEL_DEPLOYMENT.md" \
    ".next/cache" \
    ".vercel" || {
    echo -e "${RED}Failed to create deployment package.${NC}"
    exit 1
}

echo -e "${GREEN}Created: $DEPLOY_ZIP${NC}"

# Step 4: Upload to server
echo -e "${YELLOW}Step 4: Uploading to server...${NC}"
scp "$DEPLOY_ZIP" "$SSH_TARGET:$DEPLOY_PATH/" || {
    echo -e "${RED}Upload failed.${NC}"
    exit 1
}

echo -e "${GREEN}Upload complete!${NC}"

# Step 5: Extract and build on server
echo -e "${YELLOW}Step 5: Extracting and building on server...${NC}"
ssh "$SSH_TARGET" << 'EOF'
    set -e
    echo "Extracting deployment package..."
    unzip -o amtmti-deploy-*.zip
    echo "Installing dependencies..."
    npm install --production
    echo "Build complete!"
EOF

echo -e "${GREEN}Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. SSH into your server: ssh $SSH_TARGET"
echo "2. Navigate to: cd $DEPLOY_PATH"
echo "3. Configure .env.local with your values"
echo "4. Restart the application:"
echo "   - npm start (for direct execution)"
echo "   - pm2 restart amtmti (if using PM2)"
echo "   - Restart via cPanel Node.js manager"
echo ""
