#!/bin/bash
# deploy.sh

echo "Starting deployment..."

# Build and push Docker images
docker-compose build
docker-compose push

# Deploy to production
ssh deploy@server << EOF
  cd /opt/courses-platform
  docker-compose pull
  docker-compose up -d
  docker system prune -f
EOF

echo "Deployment completed!"