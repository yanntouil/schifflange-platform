#!/bin/bash

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'
echo "${BLUE}🔄 Starting dashboard rebuild...${NC}"

# exit on error
set -e

# Navigate to the application directory
pushd apps/dashboard > /dev/null

# Update the repository
echo "${BLUE}📦 Pulling latest changes..."
git pull

# Install dependencies
echo "${BLUE}📦 Installing dependencies..."
npm install

# Build the application
echo "${BLUE}📦 Building dashboard..."
npm run build

# Commit and push changes
echo "${BLUE}📦 Committing and pushing changes..."
git add .
git commit -m "Dashboard build update"
git push

# back to root
popd > /dev/null

echo "${GREEN}🔄 Dashboard rebuild completed${NC}"