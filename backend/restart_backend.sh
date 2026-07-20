#!/bin/bash
sudo pkill -f "main:app" || true
sleep 2
cd /home/ubuntu/TRIP_Planner/backend
source ../.env
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > /tmp/uvicorn.log 2>&1 &
echo "Backend restarted with PID $!"
