#!/bin/bash

echo "🚀 Starting TavanAI Chat Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Clean up existing containers and images
echo "🧹 Cleaning up existing containers..."
docker-compose down --volumes --remove-orphans

# Remove old images
echo "🗑️ Removing old images..."
docker rmi tavanai_gateway:latest 2>/dev/null || true
docker rmi tavaai-chat-frontend:latest 2>/dev/null || true

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo "✅ Deployment completed!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 RabbitMQ Management: http://localhost:15672 (admin/password)"
echo "🗄️ PostgreSQL: localhost:5432"

echo ""
echo "📝 To view logs:"
echo "   docker-compose logs -f frontend"
echo "   docker-compose logs -f backend"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down" 