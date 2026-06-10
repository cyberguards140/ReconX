import sys

with open('frontend/js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_logic = """
function getBuiltCommand(target) {
  let cmd = "nmap";
  
  // Toggles
  const toggles = document.querySelectorAll('.toggle-row .toggle');
  if (toggles[0] && toggles[0].classList.contains('on')) cmd += " -sV";
  if (toggles[1] && toggles[1].classList.contains('on')) cmd += " -O";
  if (toggles[2] && toggles[2].classList.contains('on')) cmd += " -sC";

  // Timing
  const timingEl = document.getElementById('nmapTiming');
  if (timingEl) {
    const timing = timingEl.value.split(' ')[0]; // e.g. T4
    if (timing) cmd += " -" + timing;
  }

  // Ports
  const portsEl = document.getElementById('nmapPorts');
  if (portsEl && portsEl.value) {
    cmd += " -p " + portsEl.value;
  }
  
  cmd += " " + target;
  return cmd;
}

function updatePreview() {
  const t = document.getElementById('targetScope').value || 'scanme.nmap.com';
  const preview = document.getElementById('nmapPreview');
  if (preview) {
    preview.textContent = getBuiltCommand(t);
  }
}

function formatToolOutput(text, toolName) {
  if (!text) return '';
  let out = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  if (toolName.toLowerCase().includes('nmap')) {
    out = out.replace(/\\b(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})\\b/g, '<span style="color:var(--yellow)">$1</span>');
    out = out.replace(/\\b(\\d{1,5}\\/(?:tcp|udp))\\b/g, '<span style="color:var(--blue);font-weight:bold">$1</span>');
    out = out.replace(/\\b(open)\\b/g, '<span style="color:var(--green);font-weight:bold">open</span>');
    out = out.replace(/\\b(closed)\\b/g, '<span style="color:var(--red)">closed</span>');
    out = out.replace(/\\b(filtered)\\b/g, '<span style="color:var(--amber)">filtered</span>');
    out = out.replace(/^(Starting Nmap.*)$/gm, '<span style="color:var(--text-dim)">$1</span>');
    out = out.replace(/^(Nmap scan report for.*)$/gm, '<span style="color:var(--accent2);font-weight:bold">$1</span>');
    out = out.replace(/^(Nmap done:.*)$/gm, '<span style="color:var(--text-dim)">$1</span>');
    out = out.replace(/^(PORT\\s+STATE\\s+SERVICE.*)$/gm, '<span style="color:var(--text-dim);text-decoration:underline">$1</span>');
  }
  return out.replace(/\\r?\\n/g, '<br>');
}

function startRun(target) {
  isRunning = true;
  switchRTab('terminal', document.getElementById('tab-terminal'));

  const btn = document.getElementById('runBtn');
  btn.classList.add('running');
  document.getElementById('runBtnTxt').textContent = 'Running...';

  document.getElementById('nmapBadge').textContent = 'running';
  document.getElementById('nmapBadge').className = 'badge b-run';
  document.getElementById('livePill').classList.remove('idle');
  document.getElementById('scanStatusDot').classList.remove('green');
  document.getElementById('scanStatusDot').style.background = 'var(--amber)';
  document.getElementById('scanStatusDot').style.animation = 'pulse 1s ease infinite';
  document.getElementById('scanStatusVal').textContent = 'Running';
  document.getElementById('scanStatusVal').style.color = 'var(--amber)';
  document.getElementById('statTarget').textContent = target;
  document.getElementById('execTime').textContent = `Started at ${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`;
  document.getElementById('termTitle').textContent = `pentdash — recon · ${target}`;

  const body = document.getElementById('termBody');
  body.innerHTML = '<span class="tline tc"># Executing 1 tool(s) against ' + target + '</span>\\n';
  
  const cmd = getBuiltCommand(target);
  body.innerHTML += '<span class="tline thead">— Nmap —</span>\\n';
  body.innerHTML += '<span class="tline"><span class="tp">pentdash@kali</span><span class="tlbl">:~$</span> <span class="tcmd">' + cmd + '</span></span>\\n\\n';
  
  fetch('/api/run/cluster', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cluster_name: 'recon',
      target: target,
      project_id: 1,
      tools: [{name: 'nmap', cmd: cmd}]
    })
  })
  .then(res => res.json())
  .then(data => {
    isRunning = false;
    btn.classList.remove('running');
    document.getElementById('runBtnTxt').textContent = 'Run All Tools';

    document.getElementById('nmapBadge').textContent = 'done';
    document.getElementById('nmapBadge').className = 'badge b-done';
    document.getElementById('livePill').classList.add('idle');
    document.getElementById('scanStatusDot').style.background = 'var(--green)';
    document.getElementById('scanStatusDot').style.animation = 'none';
    document.getElementById('scanStatusVal').textContent = 'Complete';
    document.getElementById('scanStatusVal').style.color = 'var(--green)';
    const now = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    document.getElementById('execTime').textContent = `Completed at ${now}`;
    document.getElementById('statLastScan').textContent = now;

    if (data.outputs && data.outputs.length > 0) {
      const out = data.outputs[0];
      if (out.stdout) body.innerHTML += `<span class="tline">${formatToolOutput(out.stdout, 'nmap')}</span>\\n`;
      if (out.stderr) body.innerHTML += `<span class="tline" style="color:var(--amber)">${formatToolOutput(out.stderr, 'nmap')}</span>\\n`;
      if (out.error) body.innerHTML += `<span class="tline te">Error: ${formatToolOutput(out.error, 'nmap')}</span>\\n`;
      body.innerHTML += `<span class="tline ts">✓ Tool exited with code ${out.code} at ${now}</span>\\n`;
    }

    body.scrollTop = body.scrollHeight;
    
    // Parse stats
    if (data.outputs && data.outputs[0].stdout) {
      const openPorts = (data.outputs[0].stdout.match(/open/g) || []).length;
      document.getElementById('statOpenPorts').textContent = openPorts;
      document.getElementById('statServices').textContent = openPorts;
      toast(`Scan complete — ${openPorts} open ports found`, 'green');
    } else {
      toast('Scan complete', 'green');
    }
  })
  .catch(err => {
    isRunning = false;
    btn.classList.remove('running');
    document.getElementById('runBtnTxt').textContent = 'Error';
    body.innerHTML += `<span class="tline te">✗ API Connection Error: ${err.message}</span>\\n`;
    document.getElementById('livePill').classList.add('idle');
    document.getElementById('scanStatusDot').style.background = 'var(--red)';
    document.getElementById('scanStatusDot').style.animation = 'none';
    document.getElementById('scanStatusVal').textContent = 'Error';
    document.getElementById('scanStatusVal').style.color = 'var(--red)';
    toast('API Error', 'red');
  });
}
"""

# Replace the functions startRun and updatePreview
import re
content = re.sub(r'function updatePreview\(\) \{.*?\n\}', '', content, flags=re.DOTALL)
content = re.sub(r'function startRun\(target\) \{.*?\n\}', '', content, flags=re.DOTALL)

# Insert the new logic before toggleExpand
content = content.replace('/* ═══════════ TOGGLES ═══════════ */', new_logic + '\n/* ═══════════ TOGGLES ═══════════ */')

with open('frontend/js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
