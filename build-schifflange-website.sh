#!/bin/bash

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'
echo "${BLUE}🔄 Starting Lumiq rebuild...${NC}"

# exit on error
set -e

# Navigate to the application directory
pushd sites/schifflange-website > /dev/null

# Update the repository
echo "${BLUE}📦 Pulling latest changes..."
git pull

# Install dependencies
echo "${BLUE}📦 Installing dependencies..."
npm install

# Build the application
echo "${BLUE}📦 Building dashboard..."
npm run build

# back to root
popd > /dev/null

# Restart the application with PM2
pm2 reload lumiq.101.lu

echo "${GREEN}🔄 Lumiq rebuild completed${NC}"