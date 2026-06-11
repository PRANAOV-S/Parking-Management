#!/bin/bash

# Function to handle cleanup on script exit
cleanup() {
    echo "Stopping servers..."
    # Kill backend if running
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    # Kill frontend if running
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit
}

# Trap exit signals to cleanup processes
trap cleanup SIGINT SIGTERM EXIT

echo "========================================="
echo "   Parking Management Dev Environment   "
echo "========================================="

# 1. Start Backend Server
echo "Starting Backend server (Port 5001)..."
cd backend
npm install
node server.js &
BACKEND_PID=$!
cd ..

# 2. Start Frontend Server
echo "Starting Frontend Vite server (Port 5173 over HTTPS)..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait 3 seconds for Vite server to spin up
sleep 3

# 3. Open Chrome
echo "Opening Chrome browser..."
open -a "Google Chrome" https://localhost:5173/

# Keep script running to allow logs viewing and handle graceful termination
echo "Dev environment is running. Press [Ctrl+C] to stop both servers."
wait
