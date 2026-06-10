#!/bin/bash
# Define colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

if [ ! -d ".venv" ]; then
    echo -e "${CYAN}Creating virtual environment...${NC}"
    python3 -m venv .venv
    echo -e "${CYAN}Activating virtual environment...${NC}"
    source .venv/bin/activate
    echo -e "${CYAN}Installing backend requirements...${NC}"
    pip install -r backend/requirements.txt
else
    echo -e "${CYAN}Activating virtual environment...${NC}"
    source .venv/bin/activate
fi

echo -e "${GREEN}Starting PentDash Backend...${NC}"
echo -e "${GREEN}Dashboard is running at: http://127.0.0.1:8000${NC}"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
