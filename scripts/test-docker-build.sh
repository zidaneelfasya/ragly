#!/bin/bash

# Test Docker Build Script
# Script ini untuk test build Docker image di local sebelum push ke GitHub

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🐳 Testing Docker Build...${NC}"

# Load environment variables dari .env.local
if [ -f .env.local ]; then
    source .env.local
    echo -e "${GREEN}✓ Loaded .env.local${NC}"
else
    echo -e "${YELLOW}⚠ .env.local not found, using dummy values${NC}"
    NEXT_PUBLIC_SUPABASE_URL="dummy"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="dummy"
    NEXT_PUBLIC_RAG_BASE_URL="dummy"
    NEXT_PUBLIC_LLM_SERVICE_URL="dummy"
fi

# Build Docker image dengan build args
echo -e "${GREEN}📦 Building Docker image...${NC}"
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_RAG_BASE_URL="$NEXT_PUBLIC_RAG_BASE_URL" \
  --build-arg NEXT_PUBLIC_LLM_SERVICE_URL="$NEXT_PUBLIC_LLM_SERVICE_URL" \
  --build-arg NEXT_PUBLIC_SITE_URL="http://localhost:3000" \
  -t ragly-app:test \
  -f Dockerfile \
  .

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""
echo "To run the container:"
echo "  docker run -p 3000:3000 --env-file .env.local ragly-app:test"
echo ""
echo "To test with docker-compose:"
echo "  docker-compose up"
