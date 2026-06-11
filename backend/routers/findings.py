from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.database import get_db
from .. import models, schemas

router = APIRouter()

@router.get("/findings", response_model=list[schemas.Finding])
def get_findings(project_id: int | None = None, severity: str | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Finding)
    if project_id:
        query = query.join(models.Scan).filter(models.Scan.project_id == project_id)
    if severity and severity.lower() != 'all':
        query = query.filter(models.Finding.severity == severity)
    return query.all()
