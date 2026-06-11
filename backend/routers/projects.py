from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.database import get_db
from .. import models, schemas

router = APIRouter()

@router.get("/projects", response_model=list[schemas.Project])
def get_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = db.query(models.Project).offset(skip).limit(limit).all()
    return projects

@router.post("/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/projects/{project_id}/scans", response_model=list[schemas.Scan])
def get_project_scans(project_id: int, db: Session = Depends(get_db)):
    scans = db.query(models.Scan).filter(models.Scan.project_id == project_id).all()
    return scans
