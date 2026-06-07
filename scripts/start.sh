#!/bin/bash
# ─────────────────────────────────────────────
#  PentDash — Start Script (Linux / WSL)
# ─────────────────────────────────────────────
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo ""
echo "  ██████╗ ███████╗███╗   ██╗████████╗██████╗  █████╗ ███████╗██╗  ██╗"
echo "  ██╔══██╗██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║  ██║"
echo "  ██████╔╝█████╗  ██╔██╗ ██║   ██║   ██║  ██║███████║███████╗███████║"
echo "  ██╔═══╝ ██╔══╝  ██║╚██╗██║   ██║   ██║  ██║██╔══██║╚════██║██╔══██║"
echo "  ██║     ███████╗██║ ╚████║   ██║   ██████╔╝██║  ██║███████║██║  ██║"
echo "  ╚═╝     ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝"
echo ""
echo "  Penetration Testing Dashboard"
echo "─────────────────────────────────────────────"

# Check Python
if ! command -v python3 &>/dev/null; then
  echo "[ERROR] Python 3 not found. Please install Python 3.10+"
  exit 1
fi

# Install Python deps
echo "[1/3] Installing Python dependencies..."
pip3 install -q -r backend/requirements.txt

# Copy .env if not exists
if [ ! -f backend/.env ]; then
  if [ -f backend/.env.example ]; then
    cp backend/.env.example backend/.env
    echo "[2/3] Created backend/.env from example (add your GEMINI_API_KEY)"
  fi
else
  echo "[2/3] backend/.env found"
fi

# Launch
echo "[3/3] Starting PentDash at http://localhost:5000"
echo "─────────────────────────────────────────────"
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 5000 --reload
