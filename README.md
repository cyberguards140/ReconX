# PentDash

PentDash is a modern, responsive, API-driven Penetration Testing Dashboard. It provides a sleek, premium web UI to run automated pentesting tools (such as Nmap) via a FastAPI backend, streams the raw execution logs to a beautifully colorized terminal interface in real-time, and generates automated scan summaries using Google's Gemini AI.

---

## Key Features

- **Stateless & State-backed Modes**: Launch parallel scans and stream results in real-time. Execution details, findings (like open ports), and raw scan logs are persisted locally in SQLite.
- **Gemini AI Summarizer**: Automated vulnerability, service, and open port analysis powered by the Gemini 1.5 Flash API.
- **Terminal Style Output**: Rich terminal theme log streaming with dynamic colorization and auto-scroll.
- **Cross-Platform Compatibility**: Fully compatible with Linux and Windows (using Windows Subsystem for Linux - WSL).
- **Network-wide Access**: The web server binds to `0.0.0.0:8000`, allowing anyone on your local network to access the dashboard.
- **Desktop First**: Tailored and optimized specifically for desktop monitors for the ultimate SOC/command center experience.

---

## Directory Structure

```text
ReconX/
├── .env.example              # Example Gemini API configuration
├── .gitignore                # Git ignore rules for virtual environments & database
├── README.md                 # Project documentation
├── backend/                  # FastAPI Application Core
│   ├── core/                 # Core utilities (database config)
│   │   └── database.py
│   ├── routers/              # API Route Handlers
│   │   ├── projects.py       # Project management
│   │   ├── scans.py          # Scan execution & database logging
│   │   ├── findings.py       # Vulnerability & port findings
│   │   └── workflows.py      # Workflow definitions
│   ├── services/             # Application Services (business logic)
│   │   ├── executor.py       # Asynchronous process execution
│   │   ├── summarizer.py     # Gemini AI interface
│   │   └── workflow_runner.py# Multi-stage scan runner
│   ├── tools/                # Pentest tool builder modules
│   │   └── recon.py
│   ├── main.py               # Main entry point (FastAPI server mount)
│   ├── models.py             # SQLAlchemy schemas
│   ├── schemas.py            # Pydantic validation schemas
│   └── requirements.txt      # Python dependencies
├── data/                     # Local SQLite database directory
│   └── pentdash.db
├── frontend/                 # Web Dashboard Frontend
│   ├── css/
│   │   └── style.css         # Custom styling
│   ├── js/
│   │   └── app.js            # Frontend logic & log renderer
│   └── index.html            # Dashboard markup
└── scripts/                  # Setup & Control Scripts
    ├── install_tools.sh      # Essential CLI security tool installer
    ├── start.sh              # Unix/WSL entry script (venv creation + server launch)
    └── start.bat             # Windows WSL wrapper batch file
```

---

## Prerequisites

- **Python 3.10+**
- **WSL (Windows Subsystem for Linux)** if you are running on Windows.
- Standard security tools installed in your system PATH (e.g. `nmap`).

---

## Getting Started

### 1. Install Pentesting Tools
Run the lean tools installer to prepare your Linux/WSL environment:
```bash
# Set executable permission if required
chmod +x scripts/install_tools.sh

# Execute tool installer
./scripts/install_tools.sh
```

### 2. Configure Gemini API Key (Optional)
To enable AI summarization of your scans, copy the example `.env` file to the root directory and add your API key:
```bash
cp .env.example .env
# Edit the .env file and set GEMINI_API_KEY="your_api_key"
```

### 3. Launch the Server
Start the dashboard server using the wrapper script from anywhere in your workspace:

#### On Linux / WSL:
```bash
# Set executable permission if required
chmod +x scripts/start.sh

# Run start script
./scripts/start.sh
```

#### On Windows Command Prompt / PowerShell:
Double-click `scripts/start.bat` or run:
```cmd
.\scripts\start.bat
```
*(This batch file automatically invokes WSL to boot the backend environment).*

---

## Accessing the Dashboard

Once started, the server is accessible at:
- Local machine: [http://localhost:8000](http://localhost:8000)
- Network devices: `http://<your-machine-ip>:8000`

---

## Development Notes

- **Aesthetics & Styling**: Built using pure vanilla CSS and HTML. No heavy frontend libraries or TailwindCSS dependency.
- **Port Binding**: Binds to `0.0.0.0` by default. Do not expose this port to public networks directly.
