import re

# 1. Update index.html
with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace toggles block
old_toggles = """        <div class="toggle-row">
          <span class="toggle-lbl">Service Version Detection (-sV)</span>
          <button class="toggle on" onclick="this.classList.toggle('on')"></button>
        </div>
        <div class="toggle-row">
          <span class="toggle-lbl">OS Detection (-O)</span>
          <button class="toggle" onclick="this.classList.toggle('on')"></button>
        </div>
        <div class="toggle-row">
          <span class="toggle-lbl">Script Scan (-sC)</span>
          <button class="toggle" onclick="this.classList.toggle('on')"></button>
        </div>"""

new_toggles = """        <div class="toggle-row">
          <span class="toggle-lbl">Service Version (-sV)</span>
          <button id="tog_sV" class="toggle on" onclick="this.classList.toggle('on'); updatePreview()"></button>
        </div>
        <div class="toggle-row">
          <span class="toggle-lbl">OS Detection (-O)</span>
          <button id="tog_O" class="toggle" onclick="this.classList.toggle('on'); updatePreview()"></button>
        </div>
        <div class="toggle-row">
          <span class="toggle-lbl">Script Scan (-sC)</span>
          <button id="tog_sC" class="toggle" onclick="this.classList.toggle('on'); updatePreview()"></button>
        </div>
        <div class="toggle-row">
          <span class="toggle-lbl">Aggressive Scan (-A)</span>
          <button id="tog_A" class="toggle" onclick="this.classList.toggle('on'); updatePreview()"></button>
        </div>
        <div class="toggle-row">
          <span class="toggle-lbl">Skip Host Discovery (-Pn)</span>
          <button id="tog_Pn" class="toggle on" onclick="this.classList.toggle('on'); updatePreview()"></button>
        </div>
        <div class="toggle-row">
          <span class="toggle-lbl">Verbose (-v)</span>
          <button id="tog_v" class="toggle" onclick="this.classList.toggle('on'); updatePreview()"></button>
        </div>"""

if old_toggles in html:
    html = html.replace(old_toggles, new_toggles)
else:
    print("Could not find old toggles in html")

# Add onchange="updatePreview()" to the selects if not there
html = html.replace('id="nmapType"', 'id="nmapType" onchange="updatePreview()"')
html = html.replace('id="nmapTiming"', 'id="nmapTiming" onchange="updatePreview()"')

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# 2. Update app.js
with open('frontend/js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Fix getBuiltCommand
old_getBuilt = """function getBuiltCommand(target) {
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
}"""

new_getBuilt = """function getBuiltCommand(target) {
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
    cmd += " -p " + portsEl.value;
  }
  
  cmd += " " + target;
  return cmd.replace(/\\s+/g, ' ');
}"""

if old_getBuilt in js:
    js = js.replace(old_getBuilt, new_getBuilt)
else:
    print("Could not find getBuiltCommand in app.js")

# Fix flicker in startRun
old_flicker = """          if (lineObj.type === 'stdout') {
            body.innerHTML += `<span class="tline">${formatted}</span>\\n`;
          } else if (lineObj.type === 'stderr') {
            body.innerHTML += `<span class="tline" style="color:var(--amber)">${formatted}</span>\\n`;
          } else {
            body.innerHTML += `<span class="tline te">${formatted}</span>\\n`;
          }
          body.scrollTop = body.scrollHeight;
          
          if (idx === linesToPrint.length - 1) {
            body.innerHTML += `<span class="tline ts">✓ Tool exited with code ${out.code} at ${now}</span>\\n`;
            body.scrollTop = body.scrollHeight;
          }"""

new_flicker = """          let span = '';
          if (lineObj.type === 'stdout') {
            span = `<span class="tline">${formatted}</span>\\n`;
          } else if (lineObj.type === 'stderr') {
            span = `<span class="tline" style="color:var(--amber)">${formatted}</span>\\n`;
          } else {
            span = `<span class="tline te">${formatted}</span>\\n`;
          }
          body.insertAdjacentHTML('beforeend', span);
          body.scrollTop = body.scrollHeight;
          
          if (idx === linesToPrint.length - 1) {
            body.insertAdjacentHTML('beforeend', `<span class="tline ts">✓ Tool exited with code ${out.code} at ${now}</span>\\n`);
            body.scrollTop = body.scrollHeight;
          }"""

if old_flicker in js:
    js = js.replace(old_flicker, new_flicker)
else:
    print("Could not find flicker fix in app.js")

# Fix innerHTML assignments
js = js.replace(
    "body.innerHTML = '<span class=\"tline tc\"># Executing 1 tool(s) against ' + target + '</span>\\n';",
    "body.innerHTML = ''; body.insertAdjacentHTML('beforeend', '<span class=\"tline tc\"># Executing 1 tool(s) against ' + target + '</span>\\n');"
)
js = js.replace(
    "body.innerHTML += '<span class=\"tline thead\">— Nmap —</span>\\n';",
    "body.insertAdjacentHTML('beforeend', '<span class=\"tline thead\">— Nmap —</span>\\n');"
)
js = js.replace(
    "body.innerHTML += '<span class=\"tline\"><span class=\"tp\">pentdash@kali</span><span class=\"tlbl\">:~$</span> <span class=\"tcmd\">' + cmd + '</span></span>\\n\\n';",
    "body.insertAdjacentHTML('beforeend', '<span class=\"tline\"><span class=\"tp\">pentdash@kali</span><span class=\"tlbl\">:~$</span> <span class=\"tcmd\">' + cmd + '</span></span>\\n\\n');"
)

with open('frontend/js/app.js', 'w', encoding='utf-8') as f:
    f.write(js)
