#!/bin/bash
# Define colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

cd ..

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
echo -e "${GREEN}Dashboard is running at: http://0.0.0.0:8000 (accessible from any device on your network)${NC}"
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
