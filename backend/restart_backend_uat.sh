#!/bin/bash
sudo pkill -f "uvicorn main:app --host 0.0.0.0 --port 8001" || true
sleep 2
cd /home/ubuntu/TRIP_Planner_UAT/backend
source ../.env
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 > /tmp/uvicorn_uat.log 2>&1 &
