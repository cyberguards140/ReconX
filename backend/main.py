from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
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

# Mount frontend static files
# In production, you might want to serve index.html explicitly for the root
import os
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
