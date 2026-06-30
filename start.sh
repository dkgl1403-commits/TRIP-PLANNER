#!/bin/bash
echo "========================================="
echo "   Starting Trip Planner Services..."
echo "========================================="

# 1. Start the FastAPI Backend in the background
echo "-> Starting FastAPI Backend (Port 8000)..."
cd backend
# Assuming uvicorn is installed in a global or active virtual environment
python -m uvicorn main:app --reload &
BACKEND_PID=$!
cd ..

# 2. Start the React Frontend
echo "-> Starting React Frontend (Vite)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "========================================="
echo "   Both servers are running!"
echo "   Backend: http://127.0.0.1:8000"
echo "   Frontend: http://localhost:5173"
echo "   Press [CTRL+C] to stop both servers."
echo "========================================="

# Wait for user to press Ctrl+C
wait $FRONTEND_PID $BACKEND_PID
