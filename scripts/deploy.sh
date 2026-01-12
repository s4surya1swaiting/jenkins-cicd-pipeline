#!/bin/bash
set -e

ENV=$1

case $ENV in
    dev)
        echo "🚀 Deploying to Development..."
        docker-compose -f docker-compose.dev.yml up -d
        ;;
    staging)
        echo "🎯 Deploying to Staging..."
        docker-compose -f docker-compose.staging.yml up -d
        ;;
    prod)
        echo "🏭 Deploying to Production..."
        docker-compose -f docker-compose.prod.yml up -d
        ;;
    *)
        echo "❌ Unknown environment: $ENV"
        echo "Usage: deploy.sh [dev|staging|prod]"
        exit 1
        ;;
esac

echo "✅ Deployment to $ENV completed!"
