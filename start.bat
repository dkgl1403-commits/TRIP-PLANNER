@echo off
echo =========================================
echo    Starting Trip Planner Services...
echo =========================================

echo -^> Starting FastAPI Backend (Port 8000)...
cd backend
start cmd /k "python -m uvicorn main:app --reload"
cd ..

echo -^> Starting React Frontend (Vite)...
cd frontend
start cmd /k "npm run dev"
cd ..

echo =========================================
echo    Both servers are starting in new windows!
echo    Backend: http://127.0.0.1:8000
echo    Frontend: http://localhost:5173
echo    Close the new command windows to stop them.
echo =========================================
pause
