/* ═══════════════════════════════════════════
   PENTDASH — app.js
   - Split panel cluster view
   - Nmap accordion with live command preview
   - Other tools as stubs (coming soon)
   - Terminal-themed execution log on right panel
   - localStorage view persistence
═══════════════════════════════════════════ */

'use strict';

// ═══════════════════════════════════════════
//  CLUSTER DATA
// ═══════════════════════════════════════════
const CLUSTERS = {
  recon: {
    title: 'Recon & Info Gathering',
    desc: 'Discover live hosts, open ports, subdomains, and exposed services.',
    tools: [
      {
        id: 'nmap',
        name: 'Nmap',
        label: 'Network Mapper',
        active: true,  // fully wired
        buildCmd: buildNmapCmd,
        fields: 'nmap'
      },
      { id: 'subfinder',   name: 'Subfinder',    label: 'Passive Subdomain Enum',   active: false },
      { id: 'amass',       name: 'Amass',         label: 'Active Subdomain Enum',    active: false },
      { id: 'masscan',     name: 'Masscan',       label: 'High-Speed Port Scan',     active: false },
      { id: 'naabu',       name: 'Naabu',         label: 'Port Discovery',           active: false },
      { id: 'theharvester',name: 'theHarvester',  label: 'OSINT Gathering',          active: false },
      { id: 'shodan',      name: 'Shodan CLI',    label: 'Host Lookup via Shodan',   active: false },
    ]
  },
  dir: {
    title: 'Directory & Brute-Force',
    desc: 'Enumerate hidden paths, files, and endpoints on web targets.',
    tools: [
      { id: 'ffuf',       name: 'FFUF',         label: 'Fast Web Fuzzer',          active: false },
      { id: 'gobuster',   name: 'Gobuster',     label: 'Directory/DNS Brute-Force',active: false },
      { id: 'dirsearch',  name: 'Dirsearch',    label: 'Web Path Discovery',       active: false },
      { id: 'feroxbuster',name: 'Feroxbuster',  label: 'Recursive Dir Scanner',    active: false },
      { id: 'wfuzz',      name: 'Wfuzz',        label: 'Web Fuzzer',               active: false },
    ]
  },
  vuln: {
    title: 'Vulnerability Scanning',
    desc: 'Detect known CVEs, misconfigurations, and exposed services.',
    tools: [
      { id: 'nuclei',    name: 'Nuclei',   label: 'CVE & Template Scanner', active: false },
      { id: 'nikto',     name: 'Nikto',    label: 'Web Server Scanner',     active: false },
      { id: 'wpscan',    name: 'WPScan',   label: 'WordPress Scanner',      active: false },
    ]
  },
  webapp: {
    title: 'Web App Exploitation',
    desc: 'Test for injection, XSS, SSTI, and other OWASP Top-10 vulnerabilities.',
    tools: [
      { id: 'sqlmap',   name: 'SQLmap',   label: 'SQL Injection',      active: false },
      { id: 'xsstrike', name: 'XSStrike', label: 'XSS Discovery',      active: false },
      { id: 'commix',   name: 'Commix',   label: 'Command Injection',  active: false },
    ]
  },
  exploit: {
    title: 'Exploit Frameworks & Post-Exploit',
    desc: 'Run exploits, establish sessions, and perform post-exploitation.',
    tools: [
      { id: 'msfconsole',  name: 'Metasploit',    label: 'Exploit Framework',   active: false },
      { id: 'searchsploit',name: 'Searchsploit',  label: 'Exploit Search',      active: false },
    ]
  },
  cred: {
    title: 'Password & Credential Attacks',
    desc: 'Crack hashes and brute-force authentication services.',
    tools: [
      { id: 'hashcat', name: 'Hashcat',        label: 'GPU Hash Cracker',    active: false },
      { id: 'hydra',   name: 'Hydra',          label: 'Network Auth Brute',  active: false },
      { id: 'john',    name: 'John the Ripper',label: 'Hash Cracker',        active: false },
    ]
  },
  wifi: {
    title: 'Wireless & Sniffing',
    desc: 'Capture and analyze wireless traffic and packets.',
    tools: [
      { id: 'aircrack', name: 'Aircrack-ng', label: 'WPA/WEP Cracking', active: false },
      { id: 'tshark',   name: 'Tshark',      label: 'Packet Capture',   active: false },
    ]
  },
  code: {
    title: 'Code & Secret Analysis',
    desc: 'Scan source code and repos for secrets and vulnerabilities.',
    tools: [
      { id: 'semgrep',    name: 'Semgrep',    label: 'Static Code Analysis', active: false },
      { id: 'trufflehog', name: 'TruffleHog', label: 'Secret Detection',     active: false },
      { id: 'gitleaks',   name: 'Gitleaks',   label: 'Git Secret Scanner',   active: false },
    ]
  },
  ai: {
    title: 'AI Attack Agents',
    desc: 'Autonomous AI-driven penetration testing agents.',
    tools: [
      { id: 'pentagent', name: 'PentAGI',    label: 'AI Pentest Agent',     active: false },
    ]
  },
};

// ═══════════════════════════════════════════
//  NMAP COMMAND BUILDER
// ═══════════════════════════════════════════
function buildNmapCmd(target) {
  const scanType  = document.getElementById('nmap-scan-type') ? document.getElementById('nmap-scan-type').value : '-sV';
  const portRange = document.getElementById('nmap-ports') ? document.getElementById('nmap-ports').value.trim() : '1-1000';
  const timing    = document.getElementById('nmap-timing') ? document.getElementById('nmap-timing').value : 'T4';
  const osDetect  = document.getElementById('nmap-os') ? document.getElementById('nmap-os').checked : false;
  const svcVer    = document.getElementById('nmap-svc') ? document.getElementById('nmap-svc').checked : true;
  const scriptScan= document.getElementById('nmap-scripts') ? document.getElementById('nmap-scripts').checked : false;

  let cmd = `nmap`;
  cmd += ` ${scanType}`;
  if (svcVer) cmd += ' -sV';
  if (osDetect) cmd += ' -O';
  if (scriptScan) cmd += ' -sC';
  cmd += ` -${timing}`;
  if (portRange && portRange !== '-') cmd += ` -p ${portRange}`;
  cmd += ` ${target || '{target}'}`;
  return cmd;
}

// ═══════════════════════════════════════════
//  NMAP ACCORDION FIELDS HTML
// ═══════════════════════════════════════════
function nmapFieldsHtml() {
  return `
    <div class="param-group">
      <label>Scan Type</label>
      <select id="nmap-scan-type" onchange="updatePreviews()">
        <option value="-sS">-sS · SYN (Stealth)</option>
        <option value="-sT">-sT · TCP Connect</option>
        <option value="-sU">-sU · UDP</option>
        <option value="-sV" selected>-sV · Version Detection</option>
      </select>
    </div>
    <div class="param-group">
      <label>Port Range</label>
      <input type="text" id="nmap-ports" value="1-1000" placeholder="e.g. 80,443 or 1-65535" oninput="updatePreviews()" />
    </div>
    <div class="param-group">
      <label>Timing Template</label>
      <select id="nmap-timing" onchange="updatePreviews()">
        <option value="T1">T1 · Sneaky</option>
        <option value="T2">T2 · Polite</option>
        <option value="T3">T3 · Normal</option>
        <option value="T4" selected>T4 · Aggressive</option>
        <option value="T5">T5 · Insane</option>
      </select>
    </div>
    <div class="param-group">
      <label>Output Format</label>
      <select id="nmap-output">
        <option value="">Normal (stdout)</option>
        <option value="-oX nmap_out.xml">XML</option>
        <option value="-oG nmap_out.gnmap">Grepable</option>
      </select>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Service Version Detection (-sV)</span>
      <label class="toggle"><input type="checkbox" id="nmap-svc" checked onchange="updatePreviews()"><span class="toggle-slider"></span></label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">OS Detection (-O)</span>
      <label class="toggle"><input type="checkbox" id="nmap-os" onchange="updatePreviews()"><span class="toggle-slider"></span></label>
    </div>
    <div class="toggle-row">
      <span class="toggle-label">Script Scan (-sC)</span>
      <label class="toggle"><input type="checkbox" id="nmap-scripts" onchange="updatePreviews()"><span class="toggle-slider"></span></label>
    </div>
    <div class="acc-note">These options override general settings for this tool only.</div>
  `;
}

// ═══════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════
let currentView = 'dashboard';
let activeCluster = null;
let isRunning = false;
let currentFilter = 'All';

// ═══════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function getTarget() {
  const el = document.getElementById('cv-target');
  return el ? el.value.trim() || 'TARGET' : 'TARGET';
}

// ═══════════════════════════════════════════
//  NAV / VIEW
// ═══════════════════════════════════════════
function setView(el, view) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  currentView = view;
  localStorage.setItem('activeView', view);
  showView(view);
}

function setViewById(view) {
  const el = document.querySelector(`.nav-item[data-view="${view}"]`);
  if (el) setView(el, view);
}

function showView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('cluster-view').classList.remove('active');

  if (view === 'dashboard') {
    document.getElementById('view-dashboard').classList.add('active');
  } else if (view === 'results') {
    document.getElementById('view-results').classList.add('active');
    renderFindings();
  } else if (view === 'workflows') {
    document.getElementById('view-workflows').classList.add('active');
    renderWorkflows();
  } else if (view === 'health') {
    document.getElementById('view-health').classList.add('active');
    runHealthCheck();
  } else if (CLUSTERS[view]) {
    activeCluster = view;
    renderClusterView(view);
    document.getElementById('cluster-view').classList.add('active');
  }
}

// ═══════════════════════════════════════════
//  CLUSTER VIEW RENDER
// ═══════════════════════════════════════════
function renderClusterView(id) {
  const c = CLUSTERS[id];
  document.getElementById('cv-title').textContent = c.title;
  document.getElementById('cv-desc').textContent  = c.desc;

  isRunning = false;
  const runBtn = document.getElementById('cv-run-btn');
  runBtn.classList.remove('running');
  runBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run All Tools';

  // Build accordion
  const list = document.getElementById('cv-tool-list');
  list.innerHTML = '';

  c.tools.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'acc-item';
    div.id = `acc-${t.id}`;

    const comingSoon = t.active ? '' : '<span style="font-size:9px;font-family:var(--mono);color:var(--text-faint);background:var(--bg-hover);border:1px solid var(--border);padding:1px 6px;border-radius:3px;margin-left:6px;">coming soon</span>';

    div.innerHTML = `
      <div class="acc-header" onclick="toggleAcc('${t.id}', ${t.active})">
        <div class="acc-left">
          <div class="acc-name">${t.name} ${comingSoon}</div>
          <div class="acc-cmd" id="acc-cmd-${t.id}">${t.active ? buildToolCmd(t, getTarget()) : t.label}</div>
        </div>
        <div class="acc-right">
          <div class="acc-status-dot" id="acc-dot-${t.id}"></div>
          <svg class="acc-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
      <div class="acc-body" id="acc-body-${t.id}">
        <div class="acc-body-inner" id="acc-inner-${t.id}">
          ${t.active ? getFieldsHtml(t) : `<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--text-faint);font-family:var(--mono);font-size:12px;">⚙ ${t.name} fields coming soon</div>`}
        </div>
      </div>`;
    list.appendChild(div);
  });

  // Build command preview cards on the right
  renderPreviewCards(id);

  // Reset terminal
  showPreviewPanel();
}

function buildToolCmd(t, target) {
  if (t.buildCmd) return t.buildCmd(target);
  return `${t.id} {target}`;
}

function getFieldsHtml(t) {
  if (t.fields === 'nmap') return nmapFieldsHtml();
  return '';
}

// ═══════════════════════════════════════════
//  ACCORDION TOGGLE
// ═══════════════════════════════════════════
function toggleAcc(id, active) {
  const item = document.getElementById(`acc-${id}`);
  const wasOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.acc-item').forEach(el => el.classList.remove('open'));

  if (!wasOpen) {
    item.classList.add('open');
  }
}

// ═══════════════════════════════════════════
//  LIVE COMMAND PREVIEW
// ═══════════════════════════════════════════
function updatePreviews() {
  if (!activeCluster) return;
  const c = CLUSTERS[activeCluster];
  const target = getTarget();

  c.tools.forEach(t => {
    if (!t.active) return;
    const cmd = buildToolCmd(t, target);
    // Update accordion subtitle
    const cmdEl = document.getElementById(`acc-cmd-${t.id}`);
    if (cmdEl) cmdEl.textContent = cmd;
    // Update preview card
    const previewEl = document.getElementById(`preview-cmd-${t.id}`);
    if (previewEl) previewEl.textContent = cmd;
  });
}

function renderPreviewCards(clusterId) {
  const c = CLUSTERS[clusterId];
  const target = getTarget();
  const area = document.getElementById('cp-preview-area');
  area.innerHTML = '';

  const activeTools = c.tools.filter(t => t.active);

  if (activeTools.length === 0) {
    area.innerHTML = `<div class="preview-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
      <span>Fill in the fields on the left<br>to preview commands</span>
    </div>`;
    return;
  }

  activeTools.forEach(t => {
    const cmd = buildToolCmd(t, target);
    const card = document.createElement('div');
    card.className = 'preview-card';
    card.innerHTML = `
      <div class="preview-card-header">
        <span class="preview-card-name">${t.name}</span>
        <span class="preview-card-status">ready</span>
      </div>
      <div class="preview-card-cmd" id="preview-cmd-${t.id}">$ ${cmd}</div>`;
    area.appendChild(card);
  });
}

function showPreviewPanel() {
  document.getElementById('cp-preview-area').style.display = 'block';
  document.getElementById('cp-terminal').style.display = 'none';
  document.getElementById('cp-right-title').textContent = 'Command Preview';
  document.getElementById('cp-right-sub').textContent = 'Commands update as you fill in the fields';
  document.getElementById('cp-right-badge').textContent = 'PREVIEW';
  document.getElementById('cp-right-badge').className = 'cp-right-badge';
}

function showTerminalPanel() {
  document.getElementById('cp-preview-area').style.display = 'none';
  document.getElementById('cp-terminal').style.display = 'flex';
  document.getElementById('cp-right-title').textContent = 'Execution Log';
  document.getElementById('cp-right-sub').textContent = 'Live output from running tools';
  document.getElementById('cp-right-badge').textContent = 'LIVE';
  document.getElementById('cp-right-badge').className = 'cp-right-badge live';
}

// ═══════════════════════════════════════════
//  NMAP SYNTAX HIGHLIGHTER
// ═══════════════════════════════════════════
function highlightNmap(raw) {
  let out = escHtml(raw);
  // IP addresses
  out = out.replace(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g, '<span class="nm-ip">$1</span>');
  // ports like 80/tcp
  out = out.replace(/\b(\d{1,5}\/(tcp|udp))\b/g, '<span class="nm-port">$1</span>');
  // open
  out = out.replace(/\bopen\b/g, '<span class="nm-open">open</span>');
  // closed
  out = out.replace(/\bclosed\b/g, '<span class="nm-closed">closed</span>');
  // filtered
  out = out.replace(/\bfiltered\b/g, '<span class="nm-filter">filtered</span>');
  // "Nmap scan report for …"
  out = out.replace(/(Nmap scan report for .+)/g, '<span class="nm-title">$1</span>');
  // "Starting Nmap …" and "Nmap done: …"
  out = out.replace(/(Starting Nmap .+)/g, '<span class="nm-dim">$1</span>');
  out = out.replace(/(Nmap done:.+)/g,     '<span class="nm-dim">$1</span>');
  // PORT STATE SERVICE VERSION header line
  out = out.replace(/(PORT\s+STATE\s+SERVICE.*)/g, '<span class="nm-header">$1</span>');
  return out;
}

function formatOutput(rawText, toolId) {
  if (!rawText) return '';
  if (toolId === 'nmap') {
    return rawText.split('\n').map(line => `<div class="t-stdout">${highlightNmap(line)}</div>`).join('');
  }
  // default: plain
  return rawText.split('\n').map(line =>
    `<div class="t-stdout">${escHtml(line)}</div>`
  ).join('');
}

// ═══════════════════════════════════════════
//  TERMINAL HELPER
// ═══════════════════════════════════════════
function termAppend(html) {
  const body = document.getElementById('terminal-body');
  body.insertAdjacentHTML('beforeend', html);
  body.scrollTop = body.scrollHeight;
}

function termPrompt(cmd) {
  termAppend(`<div><span class="t-prompt">pentdash@kali</span><span class="t-dim">:</span><span class="t-prompt">~</span><span class="t-dim">$</span> <span class="t-cmd">${escHtml(cmd)}</span></div>`);
}

function termSep() {
  termAppend(`<hr class="t-sep">`);
}

function termStatus(ok, label) {
  const cls = ok ? 't-ok' : 't-fail';
  const icon = ok ? '✔' : '✖';
  termAppend(`<div class="${cls}">${icon} ${escHtml(label)}</div>`);
}

// ═══════════════════════════════════════════
//  RUN CLUSTER
// ═══════════════════════════════════════════
async function runCluster() {
  if (isRunning) return;
  const c = CLUSTERS[activeCluster];
  if (!c) return;

  // Only run active (wired) tools
  const activeTools = c.tools.filter(t => t.active);
  if (activeTools.length === 0) {
    showToast('No Active Tools', 'This cluster has no wired tools yet.', 'error');
    return;
  }

  isRunning = true;
  const btn = document.getElementById('cv-run-btn');
  btn.classList.add('running');
  btn.innerHTML = '<div class="spinner"></div> Running…';

  // Switch to terminal view
  showTerminalPanel();
  const termBody = document.getElementById('terminal-body');
  termBody.innerHTML = '';
  document.getElementById('terminal-title').textContent = `pentdash — ${activeCluster}`;

  const target = getTarget();

  // Build payload — only active tools
  const toolPayload = activeTools.map(t => ({
    name: t.name,
    cmd: buildToolCmd(t, target)
  }));

  // Show all commands upfront
  termAppend(`<div class="t-dim"># Executing ${toolPayload.length} tool(s) against ${escHtml(target)}</div>`);
  termSep();
  toolPayload.forEach(t => termPrompt(t.cmd));
  termSep();

  // Mark running dots
  activeTools.forEach(t => {
    const dot = document.getElementById(`acc-dot-${t.id}`);
    if (dot) dot.className = 'acc-status-dot running';
  });

  try {
    const resp = await fetch('/api/run/cluster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cluster_name: activeCluster,
        target: target,
        project_id: 1,
        tools: toolPayload
      })
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    // Render outputs in terminal
    if (data.outputs && data.outputs.length > 0) {
      data.outputs.forEach(out => {
        termSep();
        termAppend(`<div class="t-header">── ${escHtml(out.tool)} ──</div>`);
        termPrompt(toolPayload.find(t => t.name === out.tool)?.cmd || out.tool);

        if (out.stdout && out.stdout.trim()) {
          termAppend(formatOutput(out.stdout, activeTools.find(t => t.name === out.tool)?.id || ''));
        }
        if (out.stderr && out.stderr.trim()) {
          out.stderr.split('\n').forEach(line => {
            if (line.trim()) termAppend(`<div class="t-stderr">${escHtml(line)}</div>`);
          });
        }
        if (out.error) {
          termAppend(`<div class="t-error">Error: ${escHtml(out.error)}</div>`);
        }

        const ok = out.code === 0;
        termStatus(ok, `${out.tool} exited with code ${out.code}`);

        // Update dot
        const toolDef = activeTools.find(t => t.name === out.tool);
        if (toolDef) {
          const dot = document.getElementById(`acc-dot-${toolDef.id}`);
          if (dot) dot.className = 'acc-status-dot ' + (ok ? 'success' : 'fail');
        }
      });

      termSep();
      termAppend(`<div class="t-ok">✔ All tools completed at ${new Date().toLocaleTimeString()}</div>`);
    }

    // Update right panel badge
    document.getElementById('cp-right-title').textContent = 'Execution Log';
    document.getElementById('cp-right-sub').textContent = `Completed at ${new Date().toLocaleTimeString()}`;

  } catch (err) {
    termAppend(`<div class="t-error">✖ Request failed: ${escHtml(err.message)}</div>`);
    termAppend(`<div class="t-dim">Is the backend running? ./start.sh</div>`);
    showToast('Scan Failed', err.message, 'error');
  }

  isRunning = false;
  btn.classList.remove('running');
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run All Tools';
}

// ═══════════════════════════════════════════
//  RESULTS PAGE
// ═══════════════════════════════════════════
const FINDINGS = [
  { id:1, tool:'nmap',      cluster:'Recon & Info Gathering',  sev:'high',     title:'Port 22/tcp (SSH) Open',       desc:'SSH service exposed. Brute-force or key-based attacks may be possible.', raw:'22/tcp open  ssh  OpenSSH 8.2p1' },
  { id:2, tool:'nmap',      cluster:'Recon & Info Gathering',  sev:'info',     title:'Port 80/tcp (HTTP) Open',       desc:'Standard HTTP port open. Check for redirect to HTTPS and header security.', raw:'80/tcp open  http nginx 1.18' },
  { id:3, tool:'nmap',      cluster:'Recon & Info Gathering',  sev:'medium',   title:'Port 3306/tcp (MySQL) Open',    desc:'Database port exposed to the network. Restrict to localhost only.', raw:'3306/tcp open  mysql  MySQL 5.7.32' },
  { id:4, tool:'nuclei',    cluster:'Vulnerability Scanning',  sev:'critical', title:'CVE-2021-44228 (Log4Shell)',    desc:'Remote code execution via JNDI injection in Apache Log4j library.', raw:'[critical] CVE-2021-44228 matched at https://target.com/api/v1/login' },
  { id:5, tool:'subfinder', cluster:'Recon & Info Gathering',  sev:'info',     title:'28 Subdomains Discovered',      desc:'Subfinder identified 28 unique subdomains via passive DNS enumeration.', raw:'dev.acmecorp.com\nstaging.acmecorp.com\napi.acmecorp.com' },
];

function renderFindings() {
  const query = (document.getElementById('results-search')?.value || '').toLowerCase();
  const list  = document.getElementById('findings-list');
  if (!list) return;

  const filtered = FINDINGS.filter(f => {
    const matchCluster = currentFilter === 'All' || f.cluster === currentFilter;
    const matchQuery   = !query || f.title.toLowerCase().includes(query) || f.desc.toLowerCase().includes(query);
    return matchCluster && matchQuery;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-faint);font-family:var(--mono);font-size:12px;">No findings match your filter.</div>`;
    return;
  }

  list.innerHTML = filtered.map(f => `
    <div class="finding-card sev-${f.sev}">
      <div class="finding-head">
        <div class="finding-top">
          <div class="finding-title">${escHtml(f.title)}</div>
          <span class="sev-badge sev-${f.sev}">${f.sev}</span>
        </div>
        <div class="finding-meta"><span class="tool-tag">${f.tool}</span> ${escHtml(f.cluster)}</div>
        <div class="finding-desc">${escHtml(f.desc)}</div>
        <div class="finding-toggle" onclick="this.nextElementSibling.classList.toggle('open')">
          ▸ Show Raw Output
        </div>
        <div class="finding-raw">${escHtml(f.raw)}</div>
      </div>
    </div>`).join('');
}

function setFilter(el, filter) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  currentFilter = filter;
  renderFindings();
}

function filterFindings() { renderFindings(); }

function exportCSV() {
  const rows = [['Tool','Cluster','Severity','Title','Description']];
  FINDINGS.forEach(f => rows.push([f.tool, f.cluster, f.sev, f.title, f.desc]));
  const csv = rows.map(r => r.map(v => `"${v.replace(/"/g,'""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = `pentdash_findings_${Date.now()}.csv`;
  a.click();
  showToast('Export Ready', 'CSV downloaded successfully.', 'success');
}

// ═══════════════════════════════════════════
//  WORKFLOWS
// ═══════════════════════════════════════════
const WORKFLOWS = [
  { name: 'Full Recon', steps: ['Recon & Info Gathering', 'Directory & Brute-Force'] },
  { name: 'Web App Audit', steps: ['Recon & Info Gathering', 'Vulnerability Scanning', 'Web App Exploitation'] },
  { name: 'Password Sprint', steps: ['Recon & Info Gathering', 'Password & Credential'] },
];

function renderWorkflows() {
  const grid = document.getElementById('wf-grid');
  if (!grid) return;
  grid.innerHTML = WORKFLOWS.map(w => `
    <div class="wf-card">
      <div class="wf-name">${escHtml(w.name)}</div>
      <div class="wf-steps">
        ${w.steps.map((s,i) => `<span class="wf-step">${escHtml(s)}</span>${i < w.steps.length-1 ? '<span class="wf-arrow">→</span>' : ''}`).join('')}
      </div>
      <div class="wf-footer">
        <button class="btn-run-wf">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Run Workflow
        </button>
        <span style="font-size:11px;color:var(--text-faint);cursor:pointer" onclick="showToast('Export','Workflow exported as JSON.','success')">Export JSON</span>
      </div>
    </div>`).join('');
}

// ═══════════════════════════════════════════
//  HEALTH CHECK
// ═══════════════════════════════════════════
const HEALTH_TOOLS = [
  { name:'nmap',         cluster:'Recon',           install:'sudo apt install nmap' },
  { name:'subfinder',    cluster:'Recon',           install:'go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest' },
  { name:'amass',        cluster:'Recon',           install:'go install -v github.com/owasp-amass/amass/v4/...@master' },
  { name:'masscan',      cluster:'Recon',           install:'sudo apt install masscan' },
  { name:'naabu',        cluster:'Recon',           install:'go install -v github.com/projectdiscovery/naabu/v2/cmd/naabu@latest' },
  { name:'ffuf',         cluster:'Dir Brute-Force', install:'go install github.com/ffuf/ffuf/v2@latest' },
  { name:'gobuster',     cluster:'Dir Brute-Force', install:'go install github.com/OJ/gobuster/v3@latest' },
  { name:'dirsearch',    cluster:'Dir Brute-Force', install:'pip3 install dirsearch' },
  { name:'feroxbuster',  cluster:'Dir Brute-Force', install:'cargo install feroxbuster' },
  { name:'nuclei',       cluster:'Vuln Scanning',   install:'go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest' },
  { name:'nikto',        cluster:'Vuln Scanning',   install:'sudo apt install nikto' },
  { name:'sqlmap',       cluster:'Web App',         install:'pip3 install sqlmap' },
  { name:'hashcat',      cluster:'Password',        install:'sudo apt install hashcat' },
  { name:'hydra',        cluster:'Password',        install:'sudo apt install hydra' },
  { name:'tshark',       cluster:'Wireless',        install:'sudo apt install tshark' },
  { name:'semgrep',      cluster:'Code Analysis',   install:'pip3 install semgrep' },
  { name:'gitleaks',     cluster:'Code Analysis',   install:'go install github.com/gitleaks/gitleaks/v8@latest' },
];

async function runHealthCheck() {
  const tbody   = document.getElementById('health-tbody');
  const summary = document.getElementById('health-summary');
  if (!tbody) return;

  tbody.innerHTML = HEALTH_TOOLS.map(t => `
    <tr id="hrow-${t.name}">
      <td><span class="tool-tag">${t.name}</span></td>
      <td style="color:var(--text-dim)">${t.cluster}</td>
      <td><span class="status-dot"><span class="dot dot-blue"></span> Checking…</span></td>
      <td style="color:var(--text-faint)">—</td>
      <td>—</td>
    </tr>`).join('');
  summary.textContent = 'Checking tools…';

  try {
    const resp = await fetch('/api/health');
    const data = await resp.json();
    const tools = data.tools || {};
    let installed = 0;

    HEALTH_TOOLS.forEach(t => {
      const row = document.getElementById(`hrow-${t.name}`);
      if (!row) return;
      const info = tools[t.name];
      const ok   = info && info.installed;
      if (ok) installed++;
      const cells = row.querySelectorAll('td');
      cells[2].innerHTML = ok
        ? '<span class="status-dot"><span class="dot dot-green"></span> <span style="color:var(--green)">Installed</span></span>'
        : '<span class="status-dot"><span class="dot dot-red"></span> <span style="color:var(--red)">Missing</span></span>';
      cells[3].innerHTML = ok ? `<span style="color:var(--text-dim);font-family:var(--mono);font-size:11px">${escHtml(info.version || '—')}</span>` : '<span style="color:var(--text-faint)">—</span>';
      cells[4].innerHTML = ok ? '—' : `<code style="font-family:var(--mono);font-size:10px;background:var(--bg-hover);border:1px solid var(--border);padding:2px 7px;border-radius:4px;cursor:pointer;color:var(--cyan)" onclick="navigator.clipboard.writeText('${t.install}');showToast('Copied','Install command copied to clipboard.','success')" title="Click to copy">${escHtml(t.install)}</code>`;
    });

    summary.textContent = `${installed} / ${HEALTH_TOOLS.length} tools installed`;
  } catch {
    // Fallback: mark all as unknown
    HEALTH_TOOLS.forEach(t => {
      const row = document.getElementById(`hrow-${t.name}`);
      if (!row) return;
      row.querySelectorAll('td')[2].innerHTML = '<span class="status-dot"><span class="dot dot-orange"></span> <span style="color:var(--orange)">Unknown</span></span>';
    });
    summary.textContent = 'Could not reach backend — is it running?';
  }
}

// ═══════════════════════════════════════════
//  MODALS
// ═══════════════════════════════════════════
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

function createProject() {
  const name = document.getElementById('modal-proj-name')?.value || 'New Project';
  document.getElementById('project-label').innerHTML = `<span class="project-dot"></span>${escHtml(name)}`;
  closeModal('modal-project');
  showToast('Project Created', `"${name}" workspace initialised.`, 'success');
  setViewById('dashboard');
}

function saveWorkflow() {
  closeModal('modal-workflow');
  showToast('Workflow Saved', 'New template added to your library.', 'success');
}

// ═══════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════
let toastTimer;
function showToast(title, desc, type = 'success') {
  const t = document.getElementById('toast');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-desc').textContent  = desc;
  t.className = type === 'error' ? 'error' : '';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 4000);
}

// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════
renderFindings();

const savedView = localStorage.getItem('activeView');
if (savedView) {
  setViewById(savedView);
}