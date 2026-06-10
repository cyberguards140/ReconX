from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import models, schemas

router = APIRouter()

@router.get("/scans/{scan_id}/results", response_model=schemas.Result)
def get_scan_results(scan_id: int, db: Session = Depends(get_db)):
    result = db.query(models.Result).filter(models.Result.scan_id == scan_id).first()
    return result

@router.post("/run/cluster")
async def run_cluster(req: schemas.ClusterRunRequest, db: Session = Depends(get_db)):
    from ..executor import execute_cluster_tools
    
    # Convert schema ToolCommands to dicts expected by executor
    commands = [{"name": t.name, "cmd": t.cmd} for t in req.tools]
        
    outputs = await execute_cluster_tools(commands)
    
    from ..summarizer import generate_ai_summary
    summary_data = await generate_ai_summary(req.cluster_name, outputs)
    
    return {"status": "completed", "outputs": outputs, "ai_summary": summary_data.get("ai_summary", "")}

@router.post("/run/workflow")
async def run_workflow(req: schemas.WorkflowRunRequest, db: Session = Depends(get_db)):
    from ..workflow_runner import run_workflow_sequence
    
    # Run the workflow dynamically and wait for the results
    outputs = await run_workflow_sequence(req, db)
    return {"status": "completed", "outputs": outputs}
