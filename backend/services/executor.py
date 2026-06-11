import asyncio
import subprocess
import logging

logger = logging.getLogger(__name__)

async def run_command_async(command: str):
    """Run a shell command asynchronously and return stdout/stderr."""
    process = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    
    try:
        # 600 second (10 min) timeout for real pentesting
        stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=600.0)
        code = process.returncode
    except asyncio.TimeoutError:
        # Kill process if it takes too long
        process.kill()
        stdout, stderr = await process.communicate()
        code = -1
        stderr += b"\n[!] Process killed after 10m timeout."
        
    return stdout.decode(errors='replace'), stderr.decode(errors='replace'), code

async def execute_cluster_tools(tools_commands: list):
    """
    Run multiple tools in parallel.
    tools_commands is a list of dicts: [{'name': 'nmap', 'cmd': 'nmap ...'}, ...]
    """
    tasks = []
    for tool in tools_commands:
        tasks.append(run_command_async(tool['cmd']))
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    output = []
    for i, res in enumerate(results):
        tool = tools_commands[i]
        if isinstance(res, Exception):
            output.append({"tool": tool['name'], "error": str(res)})
        else:
            stdout, stderr, code = res
            output.append({
                "tool": tool['name'],
                "stdout": stdout,
                "stderr": stderr,
                "code": code
            })
    return output
