import asyncio
import logging
from .executor import execute_cluster_tools
from . import schemas

logger = logging.getLogger(__name__)

async def run_workflow_sequence(req: schemas.WorkflowRunRequest, db=None):
    """
    Executes a saved workflow sequentially without saving to DB.
    Steps are dynamic and provided directly from the frontend request.
    """
    current_target = req.target
    all_outputs = []
    
    logger.info(f"Starting workflow on target: {current_target}")
    
    for step in req.steps:
        cluster_name = step.cluster_name
        logger.info(f"Starting workflow step: {cluster_name}")
        
        # Build commands from the step tools
        commands = [{"name": t.name, "cmd": t.cmd} for t in step.tools]
        
        if commands:
            step_outputs = await execute_cluster_tools(commands)
            
            from .summarizer import generate_ai_summary
            summary_data = await generate_ai_summary(cluster_name, step_outputs)
            
            # Embed AI summary as a special 'tool' output so it gets logged in the UI seamlessly
            step_outputs.append({
                "tool": "Gemini AI Summarizer",
                "stdout": summary_data.get("ai_summary", ""),
                "stderr": "",
                "code": 0
            })
            
            all_outputs.extend(step_outputs)
            
    logger.info("Workflow completed.")
    return all_outputs
