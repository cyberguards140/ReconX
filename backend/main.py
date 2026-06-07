from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import projects, scans, findings, workflows

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PentDash API")

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router, prefix="/api", tags=["projects"])
app.include_router(scans.router, prefix="/api", tags=["scans"])
app.include_router(findings.router, prefix="/api", tags=["findings"])
app.include_router(workflows.router, prefix="/api", tags=["workflows"])

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/health")
def tool_health_check():
    import shutil, subprocess
    TOOLS = [
        "nmap","subfinder","amass","masscan","naabu","ffuf","gobuster",
        "dirsearch","feroxbuster","nuclei","nikto","sqlmap","hashcat",
        "hydra","john","tshark","tcpdump","semgrep","gitleaks","trufflehog",
    ]
    result = {}
    for tool in TOOLS:
        path = shutil.which(tool)
        if path:
            try:
                out = subprocess.run([tool, "--version"], capture_output=True, text=True, timeout=3)
                version_line = (out.stdout or out.stderr or "").strip().split("\n")[0][:60]
            except Exception:
                version_line = ""
            result[tool] = {"installed": True, "path": path, "version": version_line}
        else:
            result[tool] = {"installed": False, "path": None, "version": None}
    installed = sum(1 for v in result.values() if v["installed"])
    return {"total": len(TOOLS), "installed": installed, "tools": result}

# Mount frontend static files
# In production, you might want to serve index.html explicitly for the root
import os
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
