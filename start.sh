#!/bin/bash
echo "Installing backend requirements..."
pip3 install -r backend/requirements.txt --break-system-packages

echo "Starting PentDash Backend..."
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
