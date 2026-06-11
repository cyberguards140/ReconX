import os
import httpx
import json
from dotenv import load_dotenv

# Look for .env in the repository root
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
load_dotenv(dotenv_path=env_path)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

async def generate_ai_summary(cluster: str, tool_outputs: list):
    """
    Calls the Google Gemini API to summarize the raw tool outputs.
    Optimized for minimal token usage.
    """
    # Combine all stdout/stderr into a single string, truncating if insanely large to save tokens
    combined_output = ""
    for out in tool_outputs:
        combined_output += f"--- {out['tool']} ---\n"
        # truncate each tool's output to ~5000 chars to save tokens
        stdout = out.get('stdout', '')[:5000]
        stderr = out.get('stderr', '')[:2000]
        if stdout: combined_output += f"STDOUT: {stdout}\n"
        if stderr: combined_output += f"STDERR: {stderr}\n"

    if not combined_output.strip() or not GEMINI_API_KEY:
        return {"cluster": cluster, "outputs": tool_outputs, "ai_summary": "No output to summarize or API key missing."}

    prompt = (
        f"You are a pentester. Summarize the following scan output for the '{cluster}' cluster. "
        "Be extremely brief (bullet points). Focus ONLY on critical vulnerabilities, open ports, "
        "or successful findings. Ignore normal logs. Use minimal tokens.\n\n"
        f"OUTPUT:\n{combined_output}"
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    ai_summary = ""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=payload, headers={'Content-Type': 'application/json'}, timeout=15.0)
            if resp.status_code == 200:
                data = resp.json()
                ai_summary = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'No summary generated.')
            else:
                ai_summary = f"API Error {resp.status_code}: {resp.text}"
    except Exception as e:
        ai_summary = f"Summarization failed: {str(e)}"

    return {
        "cluster": cluster,
        "outputs": tool_outputs,
        "ai_summary": ai_summary.strip()
    }
