#!/usr/bin/env bash

INTERVAL=60  # seconds between retries

echo "=== Ampere Bot Started: $(date) ==="
echo "Retrying every ${INTERVAL}s until Instance 2 is created..."
echo "-----------------------------------------------------------"
attempt=1

while true; do
  echo ""
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] >>> Attempt #$attempt"

  terraform apply -auto-approve

  if [ $? -eq 0 ]; then
    echo ""
    echo "============================================================"
    echo "  SUCCESS! DKGL-INSTANCE2 created on Attempt #$attempt"
    echo "  Check the Public IP printed above."
    echo "============================================================"
    exit 0
  else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Capacity not available. Retrying in ${INTERVAL}s..."
    echo "-----------------------------------------------------------"
    sleep $INTERVAL
    attempt=$((attempt + 1))
  fi
done
