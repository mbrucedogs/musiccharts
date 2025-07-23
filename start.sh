#!/bin/bash

echo "🎵 Starting Music Charts Archive Scraper..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "🚀 Starting services..."
echo ""

# Start backend in background
echo "🔧 Starting backend server on http://localhost:3001"
cd ../backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server on http://localhost:3000"
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Services started successfully!"
echo "📊 Frontend: http://localhost:3000"
echo "🔌 Backend: http://localhost:3001"
echo "🏥 Health check: http://localhost:3001/api/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait 