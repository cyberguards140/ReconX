// ═══════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════
const CLUSTERS = {
  recon: {
    title: 'Recon & Info Gathering',
    desc: 'Discover live hosts, open ports, subdomains, DNS records, and ASN data.',
    tools: [
      { name: 'Nmap — Fast Scan',           cmd: 'nmap -sV -T4 -F {target}',                    status: 'idle' },
      { name: 'Subfinder — Passive Enum',   cmd: 'subfinder -d {target} -silent',                status: 'idle' },
      { name: 'Amass — Passive Enum',       cmd: 'amass enum -passive -d {target}',              status: 'idle' },
      { name: 'Shodan CLI — Host Lookup',   cmd: 'shodan host {target}',                         status: 'idle' },
      { name: 'Whatweb — Tech Detection',   cmd: 'whatweb {target}',                             status: 'idle' },
    ],
    log: [
      '[10:42:30] <gray>Initialising scan sequence for {target}…</gray>',
      '[10:42:31] <gray>Starting nmap -sV -sC -T4 -p- --open {target}</gray>',
      '[10:42:58] <green>Nmap: 22/tcp open ssh OpenSSH 8.9p1 Ubuntu ✓</green>',
      '[10:42:58] <green>Nmap: 80/tcp open http nginx 1.24.0 ✓</green>',
      '[10:42:59] <green>Nmap: 443/tcp open https ✓</green>',
      '[10:43:00] <gray>Starting subfinder -d {target} -all -silent</gray>',
      '[10:43:14] <green>Subfinder: 45 subdomains discovered ✓</green>',
    ]
  },
  dir: {
    title: 'Directory & Brute-Force',
    desc: 'Enumerate hidden paths, backup files, admin panels, and sensitive endpoints.',
    tools: [
      { name: 'ffuf — Content Discovery',    cmd: 'ffuf -w wordlist.txt -u https://{target}/FUZZ -mc 200,301,302,403', status: 'idle' },
      { name: 'Gobuster — Dir Scan',         cmd: 'gobuster dir -u https://{target} -w wordlist.txt -t 50',             status: 'idle' },
      { name: 'Feroxbuster — Recursive',     cmd: 'feroxbuster --url https://{target} --depth 3 --quiet',              status: 'idle' },
      { name: 'dirsearch — Backup Files',    cmd: 'dirsearch -u https://{target} -e php,bak,zip,sql',                  status: 'idle' },
    ],
    log: [
      '[11:05:10] <gray>Starting ffuf with common.txt against {target}…</gray>',
      '[11:05:11] <green>200 OK  /admin  [Size: 4321] ✓</green>',
      '[11:05:11] <green>200 OK  /backup  [Size: 892] ✓</green>',
      '[11:05:12] <green>301 MOV /api/v1  → /api/v1/ ✓</green>',
      '[11:05:13] <gray>Gobuster: scanning with -t 50 threads…</gray>',
    ]
  },
  vuln: {
    title: 'Vulnerability Scanning',
    desc: 'Automated CVE detection using Nuclei templates, Nikto, and OpenVAS.',
    tools: [
      { name: 'Nuclei — CVE Templates',     cmd: 'nuclei -u https://{target} -t cves/ -severity critical,high',    status: 'idle' },
      { name: 'Nuclei — Misconfigurations', cmd: 'nuclei -u https://{target} -t misconfiguration/',                 status: 'idle' },
      { name: 'Nikto — Web Scanner',        cmd: 'nikto -h https://{target} -Tuning 123bde -Format txt',           status: 'idle' },
      { name: 'OpenVAS — Full Audit',       cmd: 'gvm-cli socket --gmp-username admin --xml \'<start_task/\'',     status: 'idle' },
    ],
    log: [
      '[13:20:01] <gray>Running nuclei CVE templates against {target}…</gray>',
      '[13:20:44] <red>[CRITICAL] CVE-2023-44487 HTTP/2 Rapid Reset DoS ✗</red>',
      '[13:20:45] <red>[HIGH] CVE-2022-22965 Spring4Shell RCE ✗</red>',
      '[13:20:46] <green>Nuclei misconfigs: 3 findings ✓</green>',
    ]
  },
  webapp: {
    title: 'Web App Exploitation',
    desc: 'Test for SQLi, XSS, SSRF, IDOR, XXE, and OWASP Top-10 vectors.',
    tools: [
      { name: 'sqlmap — SQL Injection',     cmd: 'sqlmap -u "https://{target}/search?q=*" --level 5 --risk 3 --batch', status: 'idle' },
      { name: 'XSStrike — XSS Scanner',    cmd: 'python3 xsstrike.py -u "https://{target}" --crawl',                   status: 'idle' },
      { name: 'SSRF Tool — SSRF Probe',    cmd: 'python3 ssrfmap.py -r req.txt -p url',                                 status: 'idle' },
      { name: 'Dalfox — XSS Automation',  cmd: 'dalfox url https://{target} --deep-domxss',                            status: 'idle' },
    ],
    log: [
      '[14:10:00] <gray>sqlmap targeting GET parameter ?q= on {target}…</gray>',
      '[14:10:23] <red>[CRITICAL] Parameter q is injectable — UNION-based ✗</red>',
      '[14:10:24] <red>[HIGH] Database: MySQL 8.0.32 ✗</red>',
      '[14:10:25] <green>XSStrike: 2 reflected XSS payloads confirmed ✓</green>',
    ]
  },
  exploit: {
    title: 'Exploit Frameworks',
    desc: 'Metasploit, custom exploit runners, and post-exploitation modules.',
    tools: [
      { name: 'Metasploit — AutoPwn',      cmd: 'msfconsole -x "use auxiliary/scanner/portscan/tcp; set RHOSTS {target}; run"', status: 'idle' },
      { name: 'Nuclei — Exposed Panels',   cmd: 'nuclei -u {target} -t exposures/panels/',                                       status: 'idle' },
      { name: 'SearchSploit — Match CVEs', cmd: 'searchsploit --id {target}',                                                    status: 'idle' },
    ],
    log: [
      '[15:30:00] <gray>Launching Metasploit auxiliary TCP scan…</gray>',
      '[15:30:42] <green>Open ports found: 22, 80, 443, 8080 ✓</green>',
      '[15:31:00] <gray>Searching ExploitDB for matching CVEs…</gray>',
      '[15:31:08] <red>[HIGH] EDB-ID 50564 — nginx 1.24 header injection ✗</red>',
    ]
  },
  cred: {
    title: 'Password & Credential',
    desc: 'Hash cracking, credential stuffing, and default-credential testing.',
    tools: [
      { name: 'Hashcat — Dictionary Attack', cmd: 'hashcat -m 0 hashes.txt rockyou.txt --force',                  status: 'idle' },
      { name: 'Hydra — SSH Brute Force',     cmd: 'hydra -L users.txt -P rockyou.txt {target} ssh -t 4',          status: 'idle' },
      { name: 'CrackMapExec — SMB Check',    cmd: 'crackmapexec smb {target} -u users.txt -p passwords.txt',      status: 'idle' },
      { name: 'Default Creds — Panel Login', cmd: 'python3 defaultcreds-cheat-sheet.py -u https://{target}',      status: 'idle' },
    ],
    log: [
      '[16:05:00] <gray>Starting hashcat dictionary attack on captured hashes…</gray>',
      '[16:07:33] <green>Cracked: admin:$apr1$hash → "Welcome1!" ✓</green>',
      '[16:08:00] <red>[HIGH] SSH accessible with cracked credentials ✗</red>',
    ]
  },
  wifi: {
    title: 'Wireless & Sniffing',
    desc: 'Capture WPA handshakes, analyse network traffic, and detect rogue APs.',
    tools: [
      { name: 'Aircrack-ng — WPA Capture',  cmd: 'airodump-ng --bssid {target} -c 6 --write capture wlan0mon', status: 'idle' },
      { name: 'Wireshark — PCAP Analysis',  cmd: 'tshark -r capture.pcap -Y "http.request" -T fields -e http.host', status: 'idle' },
      { name: 'Kismet — Wireless Survey',   cmd: 'kismet -c wlan0mon --log-prefix /tmp/kismet',                    status: 'idle' },
    ],
    log: [
      '[17:00:00] <gray>Starting airodump-ng on channel 6…</gray>',
      '[17:00:35] <green>WPA handshake captured for BSSID {target} ✓</green>',
      '[17:01:00] <gray>Running aircrack-ng against captured handshake…</gray>',
    ]
  },
  code: {
    title: 'Code & Secret Analysis',
    desc: 'Static analysis, exposed secrets, hardcoded credentials, and API key leaks.',
    tools: [
      { name: 'TruffleHog — Secret Scan',   cmd: 'trufflehog git https://github.com/{target} --json',             status: 'idle' },
      { name: 'Gitleaks — Repo Audit',      cmd: 'gitleaks detect --source /path/to/repo --report-format json',  status: 'idle' },
      { name: 'Semgrep — SAST Scan',        cmd: 'semgrep --config auto /path/to/code --json',                   status: 'idle' },
      { name: 'Bandit — Python SAST',       cmd: 'bandit -r /path/to/project -f json -o bandit-report.json',     status: 'idle' },
    ],
    log: [
      '[18:00:00] <gray>Cloning repository and scanning commit history…</gray>',
      '[18:00:12] <red>[HIGH] AWS_ACCESS_KEY_ID exposed in commit a3b4c5d ✗</red>',
      '[18:00:13] <red>[HIGH] Stripe secret key in .env file ✗</red>',
      '[18:00:14] <green>Semgrep: 7 medium-severity code issues ✓</green>',
    ]
  },
  ai: {
    title: 'AI Attack Agents',
    desc: 'LLM-driven automated exploitation, prompt injection, and model abuse testing.',
    tools: [
      { name: 'PentestGPT — Guided Attack',  cmd: 'python3 pentestgpt.py --target {target} --mode auto',           status: 'idle' },
      { name: 'LLM Fuzzer — Prompt Inject',  cmd: 'python3 llmfuzzer.py -u https://{target}/api/chat --trials 200',status: 'idle' },
      { name: 'AutoRecon — Full Chain',       cmd: 'python3 autorecon.py {target} --only-scans-dir',               status: 'idle' },
    ],
    log: [
      '[19:00:00] <gray>Initialising PentestGPT against {target}…</gray>',
      '[19:00:40] <green>Agent identified 3 potential attack vectors ✓</green>',
      '[19:01:10] <red>[MEDIUM] Prompt injection bypasses content filter ✗</red>',
    ]
  }
};

const FINDINGS = [
  {
    id: 1,
    title: 'Unauthenticated RCE via Deserialization',
    tool: 'nuclei',
    cluster: 'Vulnerability Scanning',
    severity: 'critical',
    desc: 'Target is vulnerable to CVE-2023-44487 (HTTP/2 Rapid Reset) and Spring4Shell RCE. Remote code execution confirmed without authentication.',
    raw: `[2025-09-01 13:20:44] nuclei v3.1.0
Template: cves/2023/CVE-2023-44487.yaml
Matched: https://acmecorp.com:443
Severity: CRITICAL
Details: HTTP/2 Rapid Reset Attack — server accepts unlimited RESET_STREAM
Payload: :method: POST / HTTP/2 → RST_STREAM frame flood
Evidence: Server crashed and recovered — DoS confirmed

[2025-09-01 13:20:45] nuclei v3.1.0
Template: cves/2022/CVE-2022-22965.yaml (Spring4Shell)
Matched: https://acmecorp.com/login
Severity: CRITICAL
Payload: class.module.classLoader.resources.context.parent.pipeline.first.pattern=...
Evidence: Reverse shell callback received on 10.10.14.5:4444`
  },
  {
    id: 2,
    title: 'Exposed .git Directory',
    tool: 'ffuf',
    cluster: 'Directory & Brute-Force',
    severity: 'high',
    desc: 'Source code repository is publicly accessible at /.git/. Entire codebase including commit history, credentials in config, and environment secrets can be reconstructed.',
    raw: `[2025-09-01 11:05:12] ffuf v2.1.0
        /'___\\  /'___\\           /'___\\       
       /\\ \\__/ /\\ \\__/  __  __  /\\ \\__/       
       \\ \\ ,__\\\\ \\ ,__\\/\\ \\/\\ \\ \\ \\ ,__\\      
        \\ \\ \\_/ \\ \\ \\_/\\ \\ \\_\\ \\ \\ \\ \\_/      
         \\ \\_\\   \\ \\_\\  \\ \\____/  \\ \\_\\       
          \\/_/    \\/_/   \\/___/    \\/_/       

Target: https://acmecorp.com
Wordlist: common.txt

200  GET  /.git/HEAD         → "ref: refs/heads/main"
200  GET  /.git/config       → [core] repositoryformatversion = 0
200  GET  /.git/COMMIT_EDITMSG
200  GET  /.git/logs/HEAD
403  GET  /.git/objects/      → Forbidden but directory listable

Recommendation: Block /.git/ via nginx deny rule`
  },
  {
    id: 3,
    title: 'SQL Injection — UNION-Based',
    tool: 'sqlmap',
    cluster: 'Web App Exploitation',
    severity: 'critical',
    desc: 'GET parameter ?q= on /search endpoint is vulnerable to UNION-based SQL injection. Database is MySQL 8.0.32; full schema dump and data extraction confirmed.',
    raw: `[2025-09-01 14:10:23] sqlmap v1.7.9#stable
GET parameter 'q' is vulnerable. Do you want to keep testing the others (if any)? [y/N] N

sqlmap identified the following injection point(s) with a total of 74 HTTP(s) requests:
---
Parameter: q (GET)
    Type: UNION query
    Title: Generic UNION query (NULL) - 6 columns
    Payload: q=test' UNION ALL SELECT NULL,NULL,NULL,NULL,CONCAT(0x71,0x70,0x7a,database()),NULL-- -

[14:10:24] the back-end DBMS is MySQL >= 8.0
[14:10:24] fetched databases: ['acmedb', 'information_schema', 'mysql']
[14:10:25] fetched tables for 'acmedb': ['users', 'sessions', 'orders', 'admin_logs']
[14:10:26] fetching columns for table 'users': id, username, password_hash, email, role
[14:10:27] retrieved: admin | $2y$10$hash... | admin@acmecorp.com | superadmin`
  },
  {
    id: 4,
    title: 'AWS Access Key Exposed in Git History',
    tool: 'trufflehog',
    cluster: 'Code & Secret Analysis',
    severity: 'high',
    desc: 'AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY found in commit a3b4c5d of the public GitHub repository. Key is active and has S3 full-access permissions.',
    raw: `[2025-09-01 18:00:12] TruffleHog v3.62.0
Found verified secret!

Detector Type: AWSKeyID
Decoder Type: PLAIN
Raw: AKIAIOSFODNN7EXAMPLE
Commit: a3b4c5d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4
Date: 2025-08-15T14:32:11Z
File: backend/.env.production
Line: 12
Email: developer@acmecorp.com

AWS Key Validation:
  Region: us-east-1
  Account: 123456789012
  ARN: arn:aws:iam::123456789012:user/deploy-bot
  Attached Policies: AmazonS3FullAccess, CloudFrontFullAccess

Recommendation: Rotate key immediately and audit CloudTrail for unauthorised access.`
  },
  {
    id: 5,
    title: 'Missing Security Headers',
    tool: 'nikto',
    cluster: 'Vulnerability Scanning',
    severity: 'low',
    desc: 'Strict-Transport-Security, X-Frame-Options, Content-Security-Policy, and X-Content-Type-Options headers are absent. Increases risk of clickjacking and MIME sniffing.',
    raw: `[2025-09-01 13:25:00] Nikto v2.1.6
- Target: https://acmecorp.com
- Start Time: 2025-09-01 13:25:00

+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined.
+ The X-Content-Type-Options header is not set.
+ Strict-Transport-Security (HSTS) header is not present on HTTPS.
+ Content-Security-Policy header is absent.

+ Server leaks inodes via ETags, header found with file /: 
  "5f4dcc3b5aa765d61d8327deb882cf99"
+ End Time: 2025-09-01 13:25:47 (47 seconds)`
  },
  {
    id: 6,
    title: 'Open SSH on Non-Standard Port',
    tool: 'nmap',
    cluster: 'Recon & Info Gathering',
    severity: 'info',
    desc: 'SSH service is accessible on port 2222 in addition to port 22. Running OpenSSH 8.9p1 on Ubuntu 22.04. No password-authentication bypass found; key-based auth enforced.',
    raw: `PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
2222/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4
| ssh-hostkey: 
|   256 9d:6e:ec:02:2d:0f:6a:38:60:c6:aa:ac:1e:e0:c2:84 (ECDSA)
|_  256 eb:95:11:c7:a6:fa:ad:74:ab:a2:c5:f6:a4:02:18:41 (ED25519)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Nmap done: 1 IP address (1 host up) scanned in 12.34 seconds`
  }
];

// ═══════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════
let currentView = 'dashboard';
let activeCluster = null;
let isRunning = false;
let logOpen = false;

// ═══════════════════════════════════════════
//  NAV
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
  // Hide all static views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('cluster-view').classList.remove('active');

  if (view === 'dashboard') {
    document.getElementById('view-dashboard').classList.add('active');
  } else if (view === 'results') {
    document.getElementById('view-results').classList.add('active');
    renderFindings('All');
  } else if (view === 'workflows') {
    document.getElementById('view-workflows').classList.add('active');
  } else if (CLUSTERS[view]) {
    activeCluster = view;
    renderClusterView(view);
    document.getElementById('cluster-view').classList.add('active');
  }
}

// ═══════════════════════════════════════════
//  CLUSTER VIEW
// ═══════════════════════════════════════════
function renderClusterView(id) {
  const c = CLUSTERS[id];
  document.getElementById('cv-title').textContent = c.title;
  document.getElementById('cv-desc').textContent = c.desc;

  const list = document.getElementById('cv-tool-list');
  list.innerHTML = '';

  c.tools.forEach((t, i) => {
    list.innerHTML += `
      <div class="tool-row" id="tool-row-${i}">
        <div>
          <div class="tool-name">${t.name}</div>
          <div class="tool-cmd">${t.cmd}</div>
        </div>
        <div class="status-icon" id="tool-icon-${i}">
          <div class="circle-idle"></div>
        </div>
      </div>`;
  });

  // Log section
  list.innerHTML += `
    <button class="log-toggle" onclick="toggleLog()" id="log-toggle-btn">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      Execution Log
    </button>
    <div class="log-body" id="log-body">
      ${c.log.map(l => {
        let cls = 'log-gray';
        let text = l;
        if (l.includes('<green>')) { cls = 'log-green'; text = l.replace(/<\/?green>/g,''); }
        else if (l.includes('<red>')) { cls = 'log-red'; text = l.replace(/<\/?red>/g,''); }
        else if (l.includes('<blue>')) { cls = 'log-blue'; text = l.replace(/<\/?blue>/g,''); }
        else { text = l.replace(/<\/?gray>/g,''); }
        return `<div class="${cls}">${text}</div>`;
      }).join('')}
    </div>`;

  logOpen = false;
  isRunning = false;
  const btn = document.getElementById('cv-run-btn');
  btn.classList.remove('running');
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run All Tools';
}

function toggleLog() {
  logOpen = !logOpen;
  const body = document.getElementById('log-body');
  const btn  = document.getElementById('log-toggle-btn');
  body.classList.toggle('open', logOpen);
  const arrow = logOpen
    ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>'
    : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
  btn.innerHTML = arrow + ' Execution Log';
}

function formatToolOutput(text, toolName) {
  if (!text) return '';
  let out = escHtml(text);

  if (toolName.toLowerCase().includes('nmap')) {
    out = out.replace(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g, '<span style="color:var(--yellow)">$1</span>');
    out = out.replace(/\b(\d{1,5}\/(?:tcp|udp))\b/g, '<span style="color:var(--blue);font-weight:bold">$1</span>');
    out = out.replace(/\b(open)\b/g, '<span style="color:var(--green);font-weight:bold">open</span>');
    out = out.replace(/\b(closed)\b/g, '<span style="color:var(--red)">closed</span>');
    out = out.replace(/\b(filtered)\b/g, '<span style="color:var(--orange)">filtered</span>');
    out = out.replace(/^(Starting Nmap.*)$/gm, '<span style="color:var(--text-dim)">$1</span>');
    out = out.replace(/^(Nmap scan report for.*)$/gm, '<span style="color:var(--accent2);font-weight:bold">$1</span>');
    out = out.replace(/^(Nmap done:.*)$/gm, '<span style="color:var(--text-dim)">$1</span>');
    out = out.replace(/^(PORT\s+STATE\s+SERVICE.*)$/gm, '<span style="color:var(--text-dim);text-decoration:underline">$1</span>');
  }

  return out.replace(/\r?\n/g, '<br>');
}

function runCluster() {
  if (isRunning) return;
  const c = CLUSTERS[activeCluster];
  if (!c) return;
  isRunning = true;

  const btn = document.getElementById('cv-run-btn');
  btn.classList.add('running');
  btn.innerHTML = '<div class="spinner" style="width:14px;height:14px;border-width:2px"></div> Running…';

  // Open log
  if (!logOpen) toggleLog();

  const body = document.getElementById('log-body');
  body.innerHTML = ''; // Clear previous logs
  const target = document.getElementById('cv-target') ? document.getElementById('cv-target').value : '127.0.0.1';

  // Mark all tools as running visually
  c.tools.forEach((t, i) => {
    document.getElementById(`tool-icon-${i}`).innerHTML = '<div class="spinner"></div>';
  });

  const payload = {
    cluster_name: activeCluster,
    target: target,
    project_id: 1,
    tools: c.tools.map(t => ({
      name: t.name,
      cmd: t.cmd.replace(/{target}/g, target)
    }))
  };

  fetch('/api/run/cluster', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    isRunning = false;
    btn.classList.remove('running');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run All Tools';
    
    // Add real output to log UI
    if (data.outputs && data.outputs.length > 0) {
      data.outputs.forEach(out => {
        body.innerHTML += `<div class="log-gray" style="margin-top:12px; margin-bottom:4px; font-weight:bold;">[SYSTEM] Tool: ${out.tool} finished with code ${out.code}</div>`;
        if (out.stdout) body.innerHTML += `<div style="color:var(--text);">${formatToolOutput(out.stdout, out.tool)}</div>`;
        if (out.stderr) body.innerHTML += `<div style="color:var(--text-dim);">${formatToolOutput(out.stderr, out.tool)}</div>`;
        if (out.error) body.innerHTML += `<div class="log-red">Error: ${formatToolOutput(out.error, out.tool)}</div>`;
      });
    } else {
      body.innerHTML += `<div class="log-gray">No tools configured for ${activeCluster} yet.</div>`;
    }
    
    // Mark tools done
    c.tools.forEach((t, i) => {
      document.getElementById(`tool-icon-${i}`).innerHTML = '<span class="check-done">✓</span>';
    });
    
    showToast('Scan Complete', `${c.title} finished executing.`, 'success');
  })
  .catch(err => {
    isRunning = false;
    btn.classList.remove('running');
    btn.innerHTML = 'Error Running';
    body.innerHTML += `<div class="log-red">API Connection Error: ${err.message}</div>`;
    c.tools.forEach((t, i) => {
      document.getElementById(`tool-icon-${i}`).innerHTML = '<span class="check-done" style="color:var(--red)">✗</span>';
    });
  });
}

// ═══════════════════════════════════════════
//  RESULTS
// ═══════════════════════════════════════════
const SEV_CLASS = { critical: 'sev-critical', high: 'sev-high', medium: 'sev-medium', low: 'sev-low', info: 'sev-info' };
const SEV_BORDER = { critical: '#f43f5e', high: '#fb923c', medium: '#fbbf24', low: '#60a5fa', info: '#4a5568' };

function renderFindings(filter) {
  const list = document.getElementById('findings-list');
  const data = filter === 'All' ? FINDINGS : FINDINGS.filter(f => f.cluster === filter);
  list.innerHTML = data.map(f => `
    <div class="finding-card" style="border-left-color:${SEV_BORDER[f.severity]}">
      <div class="finding-head">
        <div class="finding-top">
          <div class="finding-title">${f.title}</div>
          <span class="sev-badge ${SEV_CLASS[f.severity]}">${f.severity}</span>
        </div>
        <div class="finding-meta">${f.tool} · ${f.cluster}</div>
        <div class="finding-desc">${f.desc}</div>
        <span class="finding-toggle" onclick="toggleRaw(${f.id})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          Show Raw Output
        </span>
      </div>
      <pre class="finding-raw" id="raw-${f.id}">${escHtml(f.raw)}</pre>
    </div>`).join('');
}

function toggleRaw(id) {
  const raw = document.getElementById(`raw-${id}`);
  const isOpen = raw.classList.toggle('open');
  const toggle = raw.previousElementSibling;
  toggle.innerHTML = isOpen
    ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg> Hide Raw Output'
    : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg> Show Raw Output';
}

function filterFindings(btn, filter) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderFindings(filter);
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function runWorkflow(name) {
  showToast('Workflow queued', `${name} dispatched to runner.`, 'success');
  
  // Dummy logic to pick clusters based on name
  let clustersToRun = [];
  if (name.includes('Web App')) clustersToRun = ['recon', 'dir', 'vuln', 'webapp'];
  else if (name.includes('Internal')) clustersToRun = ['recon', 'exploit', 'cred'];
  else if (name.includes('API')) clustersToRun = ['recon', 'webapp', 'code'];
  else if (name.includes('Wireless')) clustersToRun = ['wifi', 'cred', 'exploit'];
  else clustersToRun = ['recon']; // fallback

  const target = document.getElementById('cv-target') ? document.getElementById('cv-target').value : '127.0.0.1';
  
  const payload = {
    target: target,
    project_id: 1,
    steps: clustersToRun.map(c => ({
      cluster_name: c,
      tools: (CLUSTERS[c]?.tools || []).map(t => ({
        name: t.name,
        cmd: t.cmd.replace(/{target}/g, target)
      }))
    }))
  };

  fetch('/api/run/workflow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    showToast('Workflow Complete', `${name} finished executing.`, 'success');
    console.log(data.outputs);
  })
  .catch(err => {
    showToast('Workflow Error', `Failed to run ${name}: ${err.message}`, 'error');
  });
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
  closeModal('modal-project');
  document.getElementById('project-label').textContent = 'project: New Client Scan';
  showToast('Project Created', 'New workspace initialised successfully.', 'success');
  setViewById('dashboard');
}

function saveWorkflow() {
  closeModal('modal-workflow');
  
  fetch('/api/workflows', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'New Custom Workflow',
      steps_json: '[]'
    })
  }).then(r => r.json()).then(data => {
    showToast('Workflow Saved', 'New template added to your library via API.', 'success');
  }).catch(err => {
    // Fallback to preserve UI if backend isn't running
    showToast('Workflow Saved', 'New template added to your library (Mock).', 'success');
  });
}

// ═══════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════
let toastTimer;
function showToast(title, desc, type = 'success') {
  const t = document.getElementById('toast');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-desc').textContent = desc;
  t.className = type === 'error' ? 'error' : '';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 4000);
}

// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════
renderFindings('All');

const savedView = localStorage.getItem('activeView');
if (savedView) {
  setViewById(savedView);
}