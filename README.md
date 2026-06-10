# PentDash

PentDash is a modern, responsive, API-driven Penetration Testing Dashboard. It provides a sleek UI to run automated pentesting tools (like Nmap, Subfinder, Amass, ffuf) via a local backend and streams the raw execution logs to a beautifully colorized web interface. It also includes an AI summarization engine powered by Gemini.

## Architecture
- **Frontend**: Vanilla HTML/JS/CSS with no heavy frontend framework dependencies.
- **Backend**: FastAPI (Python) running asynchronous subprocess execution for CLI pentesting tools.
- **AI Summary**: Uses the Google Gemini API to analyze raw tool output and extract critical vulnerabilities and open ports automatically.

## Prerequisites
- Windows Subsystem for Linux (WSL) or native Linux
- Python 3.10+
- The CLI pentesting tools installed in your system `PATH` (e.g. `nmap`, `subfinder`, `amass`)

## Setup Instructions

1. **Install Base Tools**
   Run the included installation script to set up the necessary tools on your Linux/WSL environment:
   ```bash
   chmod +x install_tools.sh
   ./install_tools.sh
   ```

2. **Configure API Key (Optional but Recommended)**
   To enable AI Summarization of your scans, copy the example `.env` file and add your Gemini API key:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your GEMINI_API_KEY
   ```

3. **Start the Dashboard**
   Launch the FastAPI backend and serve the frontend:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```
   *If you are running natively on Windows PowerShell, you can use `./start.ps1` instead.*

4. **Access the Application**
   Open your browser and navigate to:
   [http://localhost:5000](http://localhost:5000)

## Features
- **Stateless Execution**: PentDash acts as a proxy, natively running your tools and streaming the output back to the UI in real-time.
- **Syntax Highlighting**: Custom regex formatters detect ports, IPs, and statuses (open/closed) in the Execution Log and automatically apply syntax highlighting.
- **Workflow Sequences**: Chain multiple tools together into a seamless workflow (e.g., Recon -> Dir Brute-force -> Vuln Scan).
