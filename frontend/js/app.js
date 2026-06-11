/* ═══════════ STATE ═══════════ */
let isRunning = false;
let expandedNmap = true;
const $ = id => document.getElementById(id);

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
  startRun($('targetScope').value.trim() || 'scanme.nmap.com');
}
function runOnlyNmap() {
  if (isRunning) return;
  startRun($('targetScope').value.trim() || 'scanme.nmap.com');
}




function getBuiltCommand(target) {
  let cmd = "nmap";
  
  const typeEl = $('nmapType');
  if (typeEl) {
    const sType = typeEl.value.split(' ')[0];
    if (sType && sType !== '-sV') cmd += " " + sType; 
  }

  const toggles = ['tog_sV', 'tog_O', 'tog_sC', 'tog_A', 'tog_Pn', 'tog_v'];
  toggles.forEach(t => {
    if ($(t) && $(t).classList.contains('on')) cmd += ` -${t.split('_')[1]}`;
  });

  const timingEl = $('nmapTiming');
  if (timingEl) {
    const timing = timingEl.value.split(' ')[0];
    if (timing && timing.startsWith('T')) cmd += " -" + timing;
  }

  const portsEl = $('nmapPorts');
  if (portsEl && portsEl.value) {
    if (portsEl.value === '-F') cmd += " -F";
    else if (portsEl.value === '-p-') cmd += " -p-";
    else cmd += " -p " + portsEl.value;
  }
  
  return (cmd + " " + target).replace(/\s+/g, ' ');
}

function handlePortPreset() {
  const preset = $('nmapPortsPreset').value;
  const customInput = $('nmapPorts');
  if (preset === 'custom') {
    customInput.style.display = 'block';
  } else {
    customInput.style.display = 'none';
    customInput.value = preset;
  }
  updatePreview();
}

function updatePreview() {
  const t = $('targetScope').value || 'scanme.nmap.com';
  if ($('nmapPreview')) $('nmapPreview').textContent = getBuiltCommand(t);
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

async function startRun(target) {
  isRunning = true;
  switchRTab('terminal', $('tab-terminal'));

  const btn = $('runBtn');
  btn.classList.add('running');
  $('runBtnTxt').textContent = 'Running...';

  $('nmapBadge').textContent = 'running';
  $('nmapBadge').className = 'badge b-run';
  $('livePill').classList.remove('idle');
  $('scanStatusDot').classList.remove('green');
  $('scanStatusDot').style.background = 'var(--amber)';
  $('scanStatusDot').style.animation = 'pulse 1s ease infinite';
  $('scanStatusVal').textContent = 'Running';
  $('scanStatusVal').style.color = 'var(--amber)';
  $('statTarget').textContent = target;
  $('execTime').textContent = `Started at ${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`;
  $('termTitle').textContent = `pentdash — recon · ${target}`;

  const body = $('termBody');
  const cmd = getBuiltCommand(target);
  
  body.innerHTML = ''; 
  body.insertAdjacentHTML('beforeend', `<span class="tline tc"># Executing 1 tool(s) against ${target}</span>\n`);
  body.insertAdjacentHTML('beforeend', '<span class="tline thead">— Nmap —</span>\n');
  body.insertAdjacentHTML('beforeend', `<span class="tline"><span class="tp">pentdash@kali</span><span class="tlbl">:~$</span> <span class="tcmd">${cmd}</span></span>\n\n`);
  
  try {
    const res = await fetch('/api/run/cluster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cluster_name: 'recon', target: target, project_id: 1, tools: [{name: 'nmap', cmd: cmd}] })
    });
    
    const data = await res.json();
    isRunning = false;
    btn.classList.remove('running');
    $('runBtnTxt').textContent = 'Run All Tools';

    $('nmapBadge').textContent = 'done';
    $('nmapBadge').className = 'badge b-done';
    $('livePill').classList.add('idle');
    $('scanStatusDot').style.background = 'var(--green)';
    $('scanStatusDot').style.animation = 'none';
    $('scanStatusVal').textContent = 'Complete';
    $('scanStatusVal').style.color = 'var(--green)';
    
    const now = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    $('execTime').textContent = `Completed at ${now}`;
    $('statLastScan').textContent = now;

    if (data.outputs && data.outputs.length > 0) {
      let linesToPrint = [];
      let totalOpenPorts = 0;
      
      data.outputs.forEach((out, toolIdx) => {
        if (out.tool === "Gemini AI Summarizer") return;
        
        if (toolIdx > 0) {
          linesToPrint.push({text: `\n— ${out.tool} —`, type: 'header'});
        }
        
        if (out.stdout) {
          out.stdout.split('\n').forEach(l => {
            if (l.trim()) linesToPrint.push({text: l, type: 'stdout', tool: out.tool});
          });
        }
        if (out.stderr) {
          out.stderr.split('\n').forEach(l => {
            if (l.trim()) linesToPrint.push({text: l, type: 'stderr', tool: out.tool});
          });
        }
        if (out.error) {
          linesToPrint.push({text: 'Error: ' + out.error, type: 'error', tool: out.tool});
        }
        
        linesToPrint.push({text: `✓ ${out.tool} exited with code ${out.code !== undefined ? out.code : 0}`, type: 'status'});
        
        if (out.tool.toLowerCase().includes('nmap') && out.stdout) {
          totalOpenPorts += (out.stdout.match(/open/g) || []).length;
        }
      });
      
      let delay = 0;
      linesToPrint.forEach((lineObj, idx) => {
        delay += 60; 
        setTimeout(() => {
          let span = '';
          if (lineObj.type === 'header') {
            span = `<span class="tline thead">${lineObj.text}</span>\n`;
          } else if (lineObj.type === 'status') {
            span = `<span class="tline ts">${lineObj.text} at ${now}</span>\n`;
          } else {
            const formatted = formatToolOutput(lineObj.text, lineObj.tool || '');
            if (lineObj.type === 'stdout') span = `<span class="tline">${formatted}</span>\n`;
            else if (lineObj.type === 'stderr') span = `<span class="tline" style="color:var(--amber)">${formatted}</span>\n`;
            else span = `<span class="tline te">${formatted}</span>\n`;
          }
          
          body.insertAdjacentHTML('beforeend', span);
          body.scrollTop = body.scrollHeight;
        }, delay);
      });
      
      if (linesToPrint.length === 0) {
        body.insertAdjacentHTML('beforeend', `<span class="tline ts">✓ Scan finished at ${now} (No output)</span>\n`);
        body.scrollTop = body.scrollHeight;
      }
      
      $('statPorts').textContent = totalOpenPorts;
      $('statServices').textContent = totalOpenPorts;
      toast(`Scan complete — ${totalOpenPorts} open ports found`, 'green');
    } else {
      toast('Scan complete', 'green');
    }
  } catch (err) {
    isRunning = false;
    btn.classList.remove('running');
    $('runBtnTxt').textContent = 'Error';
    body.insertAdjacentHTML('beforeend', `<span class="tline te">✗ API Connection Error: ${err.message}</span>\n`);
    $('livePill').classList.add('idle');
    $('scanStatusDot').style.background = 'var(--red)';
    $('scanStatusDot').style.animation = 'none';
    $('scanStatusVal').textContent = 'Error';
    $('scanStatusVal').style.color = 'var(--red)';
    toast('API Error', 'red');
  }
}

/* ═══════════ TOGGLES ═══════════ */
function toggleExpand() {
  expandedNmap = !expandedNmap;
  $('nmapExpand').style.display = expandedNmap ? 'block' : 'none';
}

$('targetScope').addEventListener('input', updatePreview);
$('nmapPorts').addEventListener('input', updatePreview);

/* ═══════════ TAB SWITCHING ═══════════ */
function switchTab(el, id) {
  document.querySelectorAll('.topnav-center .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
function switchRTab(name, el) {
  ['terminal','findings','history'].forEach(v => {
    const view = $('view-'+v);
    if(view) {
      view.style.display = 'none';
      view.classList.remove('visible');
    }
  });
  document.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
  const view = $('view-'+name);
  if (view) { 
    view.style.display = 'flex'; 
    if(view.classList.contains('findings-panel')||view.classList.contains('history-panel')) { 
      view.style.display='block'; 
      view.classList.add('visible'); 
    } 
  }
  if (el) el.classList.add('active');
}

/* ═══════════ MODALS ═══════════ */
function openModal(id) { $(id).classList.add('open'); }
function closeModal(id) { $(id).classList.remove('open'); }
document.querySelectorAll('.overlay').forEach(o => {
  o.addEventListener('click', e => { if(e.target===o) o.classList.remove('open'); });
});
function confirmDelete() {
  closeModal('deleteModal');
  $('termBody').insertAdjacentHTML('beforeend', '<span class="tline te">✗  Project Q3/2625 deleted. All data removed.</span>');
  $('execTime').textContent = 'Project deleted.';
  $('livePill').classList.add('idle');
  $('scanStatusVal').textContent = 'Idle';
  toast('Project deleted', 'red');
}
function confirmNew() {
  const name = $('newProjectName').value || 'New Project';
  closeModal('newModal');
  toast(`Project "${name}" created`, 'green');
}

/* ═══════════ COPY LOG ═══════════ */
function copyLog() {
  navigator.clipboard.writeText($('termBody').innerText)
    .then(()=>toast('Log copied to clipboard','blue'))
    .catch(()=>{});
}

/* ═══════════ TOAST ═══════════ */
function toast(msg, color='green') {
  const t = $('toast');
  const colors = {green:'var(--green)', blue:'var(--blue)', red:'var(--red)', amber:'var(--amber)'};
  $('toastDot').style.background = colors[color]||'var(--green)';
  $('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 3000);
}

/* ═══════════ INIT ═══════════ */
renderLog(initLog);
$('view-findings').style.display = 'none';
$('view-history').style.display = 'none';