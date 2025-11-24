#!/bin/bash
# Development setup script for Life Sciences LMS

set -e

echo "🚀 Setting up Life Sciences LMS Development Environment..."

# Check for required tools
echo "Checking for required tools..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Please install Node.js 20+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed."; exit 1; }

echo "✅ Node.js $(node -v) and npm $(npm -v) found"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd server
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo ""
  echo "⚙️  Creating backend .env file from example..."
  cp .env.example .env
  echo "✅ Created server/.env - Please update with your configuration"
else
  echo "✅ Backend .env already exists"
fi

# Build backend
echo ""
echo "🔨 Building backend..."
npm run build

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure server/.env with your settings"
echo "2. Start the development servers:"
echo "   - Backend:  cd server && npm run dev"
echo "   - Frontend: npm run dev"
echo "   - Or use Docker: cd server && docker-compose up"
echo ""
echo "3. Access the application at http://localhost:5173"
echo "   - Backend API will be proxied from http://localhost:3000"
echo ""
