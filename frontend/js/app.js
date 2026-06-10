/* ═══════════ STATE ═══════════ */
let isRunning = false;
let expandedNmap = true;

/* ═══════════ INITIAL LOG ═══════════ */
const initLog = [
  {c:'tc',  h:'# Executing 1 tool(s) against scanme.nmap.com'},
  {c:'',    h:''},
  {c:'thead',h:'— Nmap —'},
  {c:'',    h:'<span class="tp">pentdash@kali</span><span class="tlbl">:~$</span> <span class="tcmd">nmap -sV -sV -T4 -p 1-1000 scanme.nmap.com</span>'},
  {c:'ti',  h:'Nmap scan report for <span class="th">scanme.nmap.com</span> (<span class="th">45.33.32.156</span>)'},
  {c:'tval',h:'Host is up (0.24s latency).'},
  {c:'tval',h:'Other addresses for scanme.nmap.com (not scanned): 2600:3c01::f03c:91ff:fe18:bb2f'},
  {c:'tlbl',h:'rDNS record for 45.33.32.156: scanme.nmap.org'},
  {c:'tval',h:'Not shown: 998 closed tcp ports (conn-refused)'},
  {c:'',    h:'<span class="tlbl">PORT      STATE  SERVICE  VERSION</span>'},
  {c:'',    h:'<span class="tport">22/tcp</span>    <span class="topen">open</span>   <span class="tlbl">ssh</span>      <span class="tval">OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13 (Ubuntu Linux; protocol 2.0)</span>'},
  {c:'',    h:'<span class="tport">80/tcp</span>    <span class="topen">open</span>   <span class="tlbl">http?</span>'},
  {c:'tval',h:'Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel'},
  {c:'tval',h:'Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .'},
  {c:'tlbl',h:'Nmap done: 1 IP address (1 host up) scanned in 88.89 seconds'},
  {c:'tw',  h:'[!] Process killed after 60s timeout.'},
  {c:'te',  h:'✗  Nmap exited with code -1'},
  {c:'',    h:''},
  {c:'ts',  h:'✓  All tools completed at 11:54:33'},
];

function renderLog(lines) {
  const b = document.getElementById('termBody');
  b.innerHTML = lines.map(l =>
    `<span class="tline ${l.c}">${l.h || '&nbsp;'}</span>\n`
  ).join('');
  b.scrollTop = b.scrollHeight;
}

/* ═══════════ RUN SIMULATION ═══════════ */
function buildRunLines(target) {
  const ts = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  return [
    {c:'tc',  h:`# Executing 1 tool(s) against ${target}`, d:0},
    {c:'',    h:'', d:250},
    {c:'thead',h:'— Nmap —', d:350},
    {c:'',    h:`<span class="tp">pentdash@kali</span><span class="tlbl">:~$</span> <span class="tcmd">nmap -sV -T4 -p 1-1000 ${target}</span>`, d:500},
    {c:'ti',  h:`Starting Nmap 7.94 ( https://nmap.org )`, d:900},
    {c:'tlbl',h:'Initiating Ping Scan at 11:54', d:1400},
    {c:'tlbl',h:`Scanning ${target} [4 ports]`, d:2000},
    {c:'ts',  h:`Completed Ping Scan at 11:54, 0.24s elapsed (1 host)`, d:2600},
    {c:'tlbl',h:'Initiating SYN Stealth Scan...', d:3100},
    {c:'tlbl',h:'Scanning ports 1-1000...', d:4000},
    {c:'tlbl',h:'Discovered open port 22/tcp on 45.33.32.156', d:6000},
    {c:'tlbl',h:'Discovered open port 80/tcp on 45.33.32.156', d:6800},
    {c:'tlbl',h:'Completed SYN Stealth Scan, 8.5s elapsed', d:8500},
    {c:'tlbl',h:'Initiating Service scan on 2 open ports...', d:8800},
    {c:'',    h:'<span class="tlbl">PORT      STATE  SERVICE  VERSION</span>', d:10000},
    {c:'',    h:'<span class="tport">22/tcp</span>    <span class="topen">open</span>   <span class="tlbl">ssh</span>      <span class="tval">OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13</span>', d:10400},
    {c:'',    h:'<span class="tport">80/tcp</span>    <span class="topen">open</span>   <span class="tlbl">http</span>     <span class="tval">Apache httpd 2.4.7</span>', d:10800},
    {c:'tval',h:'Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel', d:11100},
    {c:'tlbl',h:`Nmap done: 1 IP address (1 host up) scanned in 88.89 seconds`, d:11500},
    {c:'',    h:'', d:11700},
    {c:'ts',  h:`✓  All tools completed at ${ts}`, d:11900, final:true},
  ];
}

function runAllTools() {
  if (isRunning) return;
  const target = document.getElementById('targetScope').value.trim() || 'scanme.nmap.com';
  startRun(target);
}
function runOnlyNmap() {
  if (isRunning) return;
  const target = document.getElementById('targetScope').value.trim() || 'scanme.nmap.com';
  startRun(target);
}




function getBuiltCommand(target) {
  let cmd = "nmap";
  
  // Scan Type
  const typeEl = document.getElementById('nmapType');
  if (typeEl) {
    const sType = typeEl.value.split(' ')[0];
    if (sType && sType !== '-sV') cmd += " " + sType; 
  }

  // Toggles
  if (document.getElementById('tog_sV') && document.getElementById('tog_sV').classList.contains('on')) cmd += " -sV";
  if (document.getElementById('tog_O') && document.getElementById('tog_O').classList.contains('on')) cmd += " -O";
  if (document.getElementById('tog_sC') && document.getElementById('tog_sC').classList.contains('on')) cmd += " -sC";
  if (document.getElementById('tog_A') && document.getElementById('tog_A').classList.contains('on')) cmd += " -A";
  if (document.getElementById('tog_Pn') && document.getElementById('tog_Pn').classList.contains('on')) cmd += " -Pn";
  if (document.getElementById('tog_v') && document.getElementById('tog_v').classList.contains('on')) cmd += " -v";

  // Timing
  const timingEl = document.getElementById('nmapTiming');
  if (timingEl) {
    const timing = timingEl.value.split(' ')[0]; // e.g. T4
    if (timing && timing.startsWith('T')) cmd += " -" + timing;
  }

  // Ports
  const portsEl = document.getElementById('nmapPorts');
  if (portsEl && portsEl.value) {
    if (portsEl.value === '-F') {
      cmd += " -F";
    } else if (portsEl.value === '-p-') {
      cmd += " -p-";
    } else {
      cmd += " -p " + portsEl.value;
    }
  }
  
  cmd += " " + target;
  return cmd.replace(/\s+/g, ' ');
}

function handlePortPreset() {
  const preset = document.getElementById('nmapPortsPreset').value;
  const customInput = document.getElementById('nmapPorts');
  if (preset === 'custom') {
    customInput.style.display = 'block';
  } else {
    customInput.style.display = 'none';
    customInput.value = preset;
  }
  updatePreview();
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
    out = out.replace(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g, '<span style="color:var(--yellow)">$1</span>');
    out = out.replace(/\b(\d{1,5}\/(?:tcp|udp))\b/g, '<span style="color:var(--blue);font-weight:bold">$1</span>');
    out = out.replace(/\b(open)\b/g, '<span style="color:var(--green);font-weight:bold">open</span>');
    out = out.replace(/\b(closed)\b/g, '<span style="color:var(--red)">closed</span>');
    out = out.replace(/\b(filtered)\b/g, '<span style="color:var(--amber)">filtered</span>');
    out = out.replace(/^(Starting Nmap.*)$/gm, '<span style="color:var(--text-dim)">$1</span>');
    out = out.replace(/^(Nmap scan report for.*)$/gm, '<span style="color:var(--accent2);font-weight:bold">$1</span>');
    out = out.replace(/^(Nmap done:.*)$/gm, '<span style="color:var(--text-dim)">$1</span>');
    out = out.replace(/^(PORT\s+STATE\s+SERVICE.*)$/gm, '<span style="color:var(--text-dim);text-decoration:underline">$1</span>');
  }
  return out.replace(/\r?\n/g, '<br>');
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
  body.innerHTML = ''; body.insertAdjacentHTML('beforeend', '<span class="tline tc"># Executing 1 tool(s) against ' + target + '</span>\n');
  
  const cmd = getBuiltCommand(target);
  body.insertAdjacentHTML('beforeend', '<span class="tline thead">— Nmap —</span>\n');
  body.insertAdjacentHTML('beforeend', '<span class="tline"><span class="tp">pentdash@kali</span><span class="tlbl">:~$</span> <span class="tcmd">' + cmd + '</span></span>\n\n');
  
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
      let linesToPrint = [];
      
      if (out.stdout) {
        out.stdout.split('\n').forEach(l => { if (l.trim()) linesToPrint.push({text: l, type: 'stdout'}); });
      }
      if (out.stderr) {
        out.stderr.split('\n').forEach(l => { if (l.trim()) linesToPrint.push({text: l, type: 'stderr'}); });
      }
      if (out.error) {
        linesToPrint.push({text: 'Error: ' + out.error, type: 'error'});
      }
      
      let delay = 0;
      linesToPrint.forEach((lineObj, idx) => {
        delay += 60; // 60ms delay per line for typing effect
        setTimeout(() => {
          let formatted = formatToolOutput(lineObj.text, 'nmap');
          let span = '';
          if (lineObj.type === 'stdout') {
            span = `<span class="tline">${formatted}</span>\n`;
          } else if (lineObj.type === 'stderr') {
            span = `<span class="tline" style="color:var(--amber)">${formatted}</span>\n`;
          } else {
            span = `<span class="tline te">${formatted}</span>\n`;
          }
          body.insertAdjacentHTML('beforeend', span);
          body.scrollTop = body.scrollHeight;
          
          if (idx === linesToPrint.length - 1) {
            body.insertAdjacentHTML('beforeend', `<span class="tline ts">✓ Tool exited with code ${out.code} at ${now}</span>\n`);
            body.scrollTop = body.scrollHeight;
          }
        }, delay);
      });
      
      if (linesToPrint.length === 0) {
        body.innerHTML += `<span class="tline ts">✓ Tool exited with code ${out.code} at ${now} (No output)</span>\n`;
        body.scrollTop = body.scrollHeight;
      }
    }
    
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
    body.innerHTML += `<span class="tline te">✗ API Connection Error: ${err.message}</span>\n`;
    document.getElementById('livePill').classList.add('idle');
    document.getElementById('scanStatusDot').style.background = 'var(--red)';
    document.getElementById('scanStatusDot').style.animation = 'none';
    document.getElementById('scanStatusVal').textContent = 'Error';
    document.getElementById('scanStatusVal').style.color = 'var(--red)';
    toast('API Error', 'red');
  });
}

/* ═══════════ TOGGLES ═══════════ */
function toggleExpand() {
  const el = document.getElementById('nmapExpand');
  expandedNmap = !expandedNmap;
  el.style.display = expandedNmap ? 'block' : 'none';
}

document.getElementById('targetScope').addEventListener('input', updatePreview);
document.getElementById('nmapPorts').addEventListener('input', updatePreview);

/* ═══════════ TAB SWITCHING ═══════════ */
function switchTab(el, id) {
  document.querySelectorAll('.topnav-center .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
function switchRTab(name, el) {
  ['terminal','findings','history'].forEach(v => {
    const view = document.getElementById('view-'+v);
    if(view) view.style.display = 'none';
    if(view) view.classList.remove('visible');
  });
  document.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
  const view = document.getElementById('view-'+name);
  if (view) { view.style.display = 'flex'; if(view.classList.contains('findings-panel')||view.classList.contains('history-panel')) { view.style.display='block'; view.classList.add('visible'); } }
  if (el) el.classList.add('active');
}

/* ═══════════ MODALS ═══════════ */
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
document.querySelectorAll('.overlay').forEach(o => {
  o.addEventListener('click', e => { if(e.target===o) o.classList.remove('open'); });
});
function confirmDelete() {
  closeModal('deleteModal');
  const b = document.getElementById('termBody');
  b.innerHTML = '<span class="tline te">✗  Project Q3/2625 deleted. All data removed.</span>';
  document.getElementById('execTime').textContent = 'Project deleted.';
  document.getElementById('livePill').classList.add('idle');
  document.getElementById('scanStatusVal').textContent = 'Idle';
  toast('Project deleted', 'red');
}
function confirmNew() {
  const name = document.getElementById('newProjectName').value || 'New Project';
  closeModal('newModal');
  toast(`Project "${name}" created`, 'green');
}

/* ═══════════ COPY LOG ═══════════ */
function copyLog() {
  const text = document.getElementById('termBody').innerText;
  navigator.clipboard.writeText(text).then(()=>toast('Log copied to clipboard','blue')).catch(()=>{});
}

/* ═══════════ TOAST ═══════════ */
function toast(msg, color='green') {
  const t = document.getElementById('toast');
  const d = document.getElementById('toastDot');
  const m = document.getElementById('toastMsg');
  const colors = {green:'var(--green)', blue:'var(--blue)', red:'var(--red)', amber:'var(--amber)'};
  d.style.background = colors[color]||'var(--green)';
  m.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 3000);
}

/* ═══════════ INIT ═══════════ */
renderLog(initLog);
// set initial tab correctly
document.getElementById('view-findings').style.display = 'none';
document.getElementById('view-history').style.display = 'none';