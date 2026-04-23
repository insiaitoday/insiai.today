#!/bin/bash

echo "=========================================="
echo "  Starting LeviAI Today Development"
echo "=========================================="
echo ""

# Check if .env files exist
echo "Checking environment files..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found!"
    echo "   Copy backend/.env.example and configure it"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  frontend/.env.local not found!"
    echo "   Copy frontend/.env.example and configure it"
fi

if [ ! -f "admin/.env.local" ]; then
    echo "⚠️  admin/.env.local not found!"
    echo "   Copy admin/.env.example and configure it"
fi

echo ""
echo "Starting services..."
echo ""

# Start backend
echo "Starting backend on port 3002..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting frontend on port 3000..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

# Start admin
echo "Starting admin on port 3001..."
cd ../admin && npm run dev &
ADMIN_PID=$!

echo ""
echo "=========================================="
echo "  Services Started!"
echo "=========================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Admin:    http://localhost:3001"
echo "Backend:  http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID $ADMIN_PID; exit" INT
wait
