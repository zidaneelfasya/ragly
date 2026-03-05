#!/bin/bash

# Ragly Auto-Deploy Script
# Script ini akan dipanggil oleh GitHub Actions untuk melakukan deployment otomatis

set -e  # Exit on error

# Color codes untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fungsi untuk logging
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
APP_DIR="/opt/ragly"
COMPOSE_FILE="docker-compose.vps.yml"
IMAGE_NAME="zidaneelfasya/ragly-app:latest"
CONTAINER_NAME="ragly-app"

log_info "Starting Ragly deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed!"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed!"
    exit 1
fi

# Navigate to app directory
if [ ! -d "$APP_DIR" ]; then
    log_error "Application directory $APP_DIR does not exist!"
    exit 1
fi

cd "$APP_DIR" || exit 1
log_info "Working directory: $(pwd)"

# Pull latest image
log_info "Pulling latest Docker image: $IMAGE_NAME"
if docker pull "$IMAGE_NAME"; then
    log_info "Successfully pulled latest image"
else
    log_error "Failed to pull Docker image"
    exit 1
fi

# Stop and remove old container
log_info "Stopping old container..."
docker-compose -f "$COMPOSE_FILE" down || log_warn "No existing container to stop"

# Remove dangling images
log_info "Cleaning up old images..."
docker image prune -af --filter "until=24h" || log_warn "Failed to cleanup images"

# Start new container
log_info "Starting new container..."
if docker-compose -f "$COMPOSE_FILE" up -d; then
    log_info "Container started successfully"
else
    log_error "Failed to start container"
    docker-compose -f "$COMPOSE_FILE" logs --tail=50
    exit 1
fi

# Wait for container to be healthy
log_info "Waiting for container to be healthy..."
sleep 10

# Check if container is running
if docker ps | grep -q "$CONTAINER_NAME"; then
    log_info "✅ Deployment successful!"
    log_info "Container status:"
    docker ps | grep "$CONTAINER_NAME"
    
    # Show recent logs
    log_info "Recent logs:"
    docker-compose -f "$COMPOSE_FILE" logs --tail=20
else
    log_error "❌ Deployment failed! Container is not running."
    docker-compose -f "$COMPOSE_FILE" logs --tail=50
    exit 1
fi

log_info "Deployment completed successfully!"
