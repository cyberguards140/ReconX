if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Cyan
    python -m venv .venv
    Write-Host "Activating virtual environment..." -ForegroundColor Cyan
    . \.venv\Scripts\Activate.ps1
    Write-Host "Installing backend requirements..." -ForegroundColor Cyan
    pip install -r backend\requirements.txt
} else {
    Write-Host "Activating virtual environment..." -ForegroundColor Cyan
    . \.venv\Scripts\Activate.ps1
}

Write-Host "Starting PentDash Backend..." -ForegroundColor Green
Write-Host "Dashboard is running at: http://127.0.0.1:8000" -ForegroundColor Green
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
