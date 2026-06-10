import re

# 1. Update index.html
with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_ports = '<input class="inp" id="nmapPorts" type="text" value="1-1000" oninput="updatePreview()"/>'
new_ports = """<select class="inp" id="nmapPortsPreset" onchange="handlePortPreset()">
              <option value="1-1000">Top 1000 (1-1000)</option>
              <option value="-F">Fast (Top 100)</option>
              <option value="-p-">All Ports (1-65535)</option>
              <option value="80,443,8080,8443">Web Ports</option>
              <option value="custom">Custom...</option>
            </select>
            <input class="inp" id="nmapPorts" type="text" value="1-1000" oninput="updatePreview()" style="display:none; margin-top:8px;" placeholder="e.g. 1-1000, 80,443"/>"""

if old_ports in html:
    html = html.replace(old_ports, new_ports)
else:
    print("Could not find old ports input in index.html")

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update app.js
with open('frontend/js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace ports logic in getBuiltCommand
old_ports_js = """  // Ports
  const portsEl = document.getElementById('nmapPorts');
  if (portsEl && portsEl.value) {
    cmd += " -p " + portsEl.value;
  }"""

new_ports_js = """  // Ports
  const portsEl = document.getElementById('nmapPorts');
  if (portsEl && portsEl.value) {
    if (portsEl.value === '-F') {
      cmd += " -F";
    } else if (portsEl.value === '-p-') {
      cmd += " -p-";
    } else {
      cmd += " -p " + portsEl.value;
    }
  }"""

if old_ports_js in js:
    js = js.replace(old_ports_js, new_ports_js)
else:
    print("Could not find old ports logic in app.js")

# Insert handlePortPreset function before updatePreview
handle_func = """function handlePortPreset() {
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

function updatePreview() {"""

if "function updatePreview() {" in js:
    js = js.replace("function updatePreview() {", handle_func)
else:
    print("Could not find updatePreview function in app.js")

with open('frontend/js/app.js', 'w', encoding='utf-8') as f:
    f.write(js)
