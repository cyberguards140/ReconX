from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json
import re
from sqlalchemy.sql import func

from ..core.database import get_db
from .. import models, schemas
from ..services.executor import execute_cluster_tools
from ..services.summarizer import generate_ai_summary
from ..services.workflow_runner import run_workflow_sequence

router = APIRouter()

@router.get("/scans/{scan_id}/results", response_model=schemas.Result)
def get_scan_results(scan_id: int, db: Session = Depends(get_db)):
    result = db.query(models.Result).filter(models.Result.scan_id == scan_id).first()
    return result

@router.post("/run/cluster")
async def run_cluster(req: schemas.ClusterRunRequest, db: Session = Depends(get_db)):
    # Convert schema ToolCommands to dicts expected by executor
    commands = [{"name": t.name, "cmd": t.cmd} for t in req.tools]
    
    # Create scan record in database
    db_scan = models.Scan(
        project_id=req.project_id,
        cluster=req.cluster_name,
        tool=", ".join([t.name for t in req.tools]),
        command="; ".join([t.cmd for t in req.tools]),
        status="running",
        started_at=func.now()
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
        
    outputs = await execute_cluster_tools(commands)
    
    summary_data = await generate_ai_summary(req.cluster_name, outputs)
    
    # Parse open port findings from Nmap output
    findings_list = []
    for out in outputs:
        if out.get('tool', '').lower() == 'nmap' and 'stdout' in out:
            stdout = out['stdout']
            for line in stdout.split('\n'):
                match = re.search(r"(\d+)/(tcp|udp)\s+open\s+(\S+)\s*(.*)", line)
                if match:
                    port, proto, service, version = match.groups()
                    title = f"{port}/{proto} — {service.upper()} Open"
                    evidence = f"Service: {service}\nVersion: {version}" if version else f"Service: {service}"
                    findings_list.append(models.Finding(
                        scan_id=db_scan.id,
                        title=title,
                        severity="Medium" if port in ['22', '23', '21', '3389', '445'] else "Info",
                        description=f"Port {port}/{proto} was found open running {service}.",
                        evidence=evidence
                    ))
    if findings_list:
        db.add_all(findings_list)
        
    # Save raw result
    db_result = models.Result(
        scan_id=db_scan.id,
        raw_output=json.dumps(outputs),
        parsed_json=json.dumps(summary_data)
    )
    db.add(db_result)
    
    # Update scan status
    db_scan.status = "completed"
    db_scan.finished_at = func.now()
    db.commit()
    
    return {"status": "completed", "outputs": outputs, "ai_summary": summary_data.get("ai_summary", "")}

@router.post("/run/workflow")
async def run_workflow(req: schemas.WorkflowRunRequest, db: Session = Depends(get_db)):
    # Run the workflow dynamically and wait for the results
    outputs = await run_workflow_sequence(req, db)
    return {"status": "completed", "outputs": outputs}
