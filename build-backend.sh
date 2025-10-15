#!/bin/bash

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'
echo "${BLUE}🔄 Starting backend rebuild...${NC}"

# exit on error
set -e

# move recursively storage to storage-backup before pulling in case of error
# mv storage storage-backup

# Navigate to the application directory
pushd backend > /dev/null

# Update the repository
echo "${BLUE}📦 Pulling latest changes..."
git pull

# Install dependencies
npm install

# Build the application
npm run build

# Copy the .env file to the build directory
cp .env build/.env


# Install production dependencies
pushd build > /dev/null
npm i --omit="dev"
popd > /dev/null

# restore storage from storage-backup
# mv storage-backup storage

# back to root
popd > /dev/null


# Restart the application with PM2
pm2 reload lumiq.api.101.lu

echo "${GREEN}🔄 Backend rebuild completed successfully${NC}"