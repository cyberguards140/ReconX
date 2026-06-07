Write-Host "Installing backend requirements..."
pip install -r backend\requirements.txt

Write-Host "Starting PentDash Backend..."
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
