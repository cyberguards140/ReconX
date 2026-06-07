# PentDash — Complete UI Details

---

## The Big Picture

PentDash is a single browser tab running at localhost:8000. The page never reloads. Everything happens inside three fixed zones — a top bar, a left sidebar, and a main working area. The top bar and sidebar never move. Only the main area scrolls. The entire app is dark themed with a near-black background, blue accent color, and comfortable spacing throughout.

---

## Top Bar

The top bar is 48 pixels tall and sits across the full width of the screen. Its background is a shade lighter than the page background so it reads as a distinct surface. A thin border runs along its bottom edge to separate it from the content below.

On the left side, a small shield icon in blue sits next to the text "PentDash" in white. After a thin vertical divider, the name of the currently active project is shown in muted grey text. For example it might read "Project: ACME Corp". This gives the user a constant reminder of which engagement they are working on.

On the right side there are two buttons. The first is "Switch Project" which uses an outlined style with a blue border. The second is "+ New Project" which is a solid filled blue button. Both are small and sit 16 pixels from the right edge with a 16 pixel gap between them.

---

## Sidebar

The sidebar is 220 pixels wide and runs the full height of the screen on the left. Its background is the darkest surface in the app, matching the main page background. A single thin border separates it from the main panel on its right side.

Near the top there is a small label that reads "TOOLS" in uppercase, very small, and in a faint grey color. This is purely a visual section header.

Below it are the nine tool cluster items. Each item is a row 40 pixels tall. On the left side of each row is a small 16-pixel icon followed by the cluster label in 13-pixel text. There is a 10-pixel gap between the icon and the label.

When a cluster is not selected, the icon and text are in muted grey and the background is transparent. When the user hovers over a row, the background shifts to a very slightly lighter dark shade. When a cluster is active, the row gets a solid blue left border that is 2 pixels wide, the background shifts to a deep navy blue, and both the icon and text turn white. The transition between states takes 150 milliseconds and feels smooth.

The nine clusters in order are Recon and Info Gathering with a radar icon, Directory and Brute-Force with a folder search icon, Vulnerability Scanning with a shield alert icon, Web App Exploitation with a bug icon, Exploit Frameworks and Post-Exploit with a terminal icon, Password and Credential with a key icon, Wireless and Sniffing with a wifi icon, Code and Secret Analysis with a code icon, and AI Attack Agents with a cpu icon.

Below a thin horizontal divider there are three more items using the exact same style. Results with a list icon, Workflows with a git branch icon, and Health Check with an activity icon. These navigate to their respective pages.

---

## Dashboard — What You See on First Load

When the app opens it shows the dashboard for the active project. The page title "Dashboard" appears in large semi-bold white text at the top with comfortable padding around it.

Directly below the title is a horizontal row of four stat cards. Each card is roughly 160 pixels wide and 90 pixels tall. They have a slightly lighter background than the page, a thin border, and rounded corners. Inside each card a large bold number sits at the top and a small muted label sits below it. A small blue icon appears in the top right corner of each card. The four cards show Total Scans, Total Findings, Critical and High Findings, and Workflows Saved. There is a 16-pixel gap between each card.

Below the stat cards is a section labelled "Recent Scans" in small uppercase muted text. Under it is a simple table listing recent scan activity. The columns are Tool, Cluster, Status, Time, and Findings. Table rows alternate between two very close dark shades to make them easier to read. The status for each row is shown as a small colored dot — green for completed, red for failed, and a spinning blue dot for currently running.

At the bottom of the dashboard are two side-by-side buttons. "Run New Scan" is a solid blue button that takes the user to the first cluster panel. "View All Results" is an outlined blue button that navigates to the Results page.

---

## Cluster Panel — The Main Working Area

When the user clicks any cluster in the sidebar, the main panel splits into two equal halves side by side. The left half is for options and input. The right half is for command preview and output. A single thin vertical line divides them. Both halves scroll independently of each other so the user can scroll down through results on the right while the input fields on the left stay exactly where they are.

---

## Left Panel — Options and Input

### Cluster Header

The very top of the left panel shows the cluster name in large semi-bold white text. Directly below it is a single short description line in muted grey. For example the Recon cluster might say "Discover hosts, subdomains, and exposed assets." This header sticks to the top of the left panel as the user scrolls down. Its background matches the page and a thin bottom border separates it from the content below. A subtle shadow beneath it gives it visual lift.

### General Options (Shared Fields)

Immediately below the sticky header is another sticky section labelled "General Options" in small uppercase muted text. These are the fields that are shared across every tool in the cluster. The user fills these once and every tool uses them automatically when the scan runs.

The fields are arranged in a two-column grid that wraps naturally. Each field has a small label above it telling the user what to enter. Required fields have a small red asterisk after the label. The input box itself has a dark background, a thin border, rounded corners, and light-colored text. When the user clicks into a field, the border turns blue and a very soft blue glow appears around it. Select dropdowns follow the exact same visual style. Password fields have a small eye icon on the right side that toggles visibility. Toggle switches are small pills that are dark grey when off and blue when on.

At the bottom of this sticky section is the "Run All Tools" button. It spans the full width of the section, is filled solid blue, and has bold text. When clicked it briefly shows a small spinner and the text changes to "Running..." and the button disables itself until all tools complete. The entire sticky section — header, shared fields, and run button — has a shadow underneath to visually separate it from the scrollable accordion content below.

### Tool-Specific Options (Accordion)

Below the sticky section is a scrollable list of accordion rows, one per tool in the cluster. All accordions start closed when the cluster first loads.

Each accordion row in its closed state shows the tool name in semi-bold white text on the left. Directly below the tool name is the exact CLI command that will be built and executed, shown in small monospace grey text. For example it might show "nmap -sV -T3 192.168.1.0/24". On the right side of the row is a small chevron pointing downward and a status dot. The status dot is grey before the tool runs, green after it completes successfully, and red if it fails. The row has a slightly lighter dark background and rounded corners. Hovering over it shifts the background slightly lighter.

When the user clicks a row, its content smoothly slides open in 200 milliseconds. The chevron rotates to point upward. The content area that appears has an even darker background and shows the tool-specific fields in a two-column grid. These fields follow the exact same style as the shared fields above. At the very bottom of the open accordion is a small italic faint note that reads "These options override general settings for this tool only." Opening one accordion automatically closes any previously open one.

### What Fields Each Tool Has

Every tool across all nine clusters has its most commonly used flags exposed as proper form fields. The full list per tool is as follows.

**Recon and Info Gathering cluster:**

Nmap has fields for scan type as a dropdown with options SYN, TCP Connect, UDP, and Comprehensive. Port range as a text field where the user types something like 1-1000 or a dash for all ports. Timing template as a dropdown from T1 Sneaky through T5 Insane. Three toggles for OS detection, service version detection, and script scan. And an output format dropdown with Normal, XML, and Grepable options.

Masscan has a port range text field, a rate field for packets per second, and a toggle for banner grabbing.

Amass has a mode dropdown for Passive or Active, a toggle for brute-force subdomain enumeration, and a text field for the path to a DNS wordlist.

Subfinder has a resolver list path field, an all-sources toggle, and an output format dropdown for Text or JSON.

Assetfinder has a single toggle for subdomains only.

Naabu has a port range field, a scan rate number field, and a service discovery toggle.

Recon-ng has a workspace name field and a module name field.

theHarvester has a multi-select for data sources such as Google, Bing, LinkedIn, and GitHub. A result limit number field and a DNS lookup toggle.

Shodan has a search query text field, a result limit number field, a facets text field for things like country and org, and a password field for the API key.

Cloudfox has an AWS profile text field and an output format dropdown for Text, JSON, or CSV.

**Directory and Brute-Force cluster:**

FFUF has a required wordlist path field, an extensions field for comma-separated values like php and html, a match HTTP codes field, a filter response size number field, a threads number field, a follow redirects toggle, and an optional proxy field.

Gobuster has a mode dropdown for dir, dns, or vhost. A required wordlist path field. An extensions field. A status codes field. And a threads number field.

Dirsearch has an extensions field, a threads number field, a recursive toggle, and an exclude status codes field.

Feroxbuster has a required wordlist path, a depth number, an extensions field, a threads number, and a filter response size number.

Wfuzz has a required payload file path, a filter codes field, a hide chars number, and a threads number.

**Vulnerability Scanning cluster:**

Nuclei has a template tags text field for things like cve, sqli, and xss. A multi-select severity filter with Critical, High, Medium, Low, and Info options. A rate limit number. A bulk size number. And an output format dropdown for Text or JSON.

Nikto has an SSL toggle, an auth credentials field for user and password, a max scan time field in seconds, and an evasion technique dropdown.

W3af has a profile dropdown for fast scan, OWASP TOP10, or audit. And an output plugin dropdown for console, XML, or HTML.

WPScan has a multi-select enumerate option for Users, Plugins, Themes, and Timthumbs. A password field for the API token. And a detection mode dropdown for Passive, Aggressive, or Mixed.

Droopescan has a CMS type dropdown and an output format dropdown.

**Web App Exploitation cluster:**

SQLmap has a target parameter text field. A multi-select technique picker with options B, E, U, S, T, and Q. A level dropdown from 1 to 5. A risk dropdown from 1 to 3. A DBMS dropdown with Auto, MySQL, PostgreSQL, MSSQL, and Oracle. A batch mode toggle. A dump database toggle. A cookie or session text field. And an optional proxy field.

SSTImap has a template engine dropdown with Auto and common engines like Jinja2 and Twig. A shell command field. And an encoding dropdown.

Commix has a technique dropdown for Classic, Eval, Time-based, and File-based. A shell type dropdown. And a proxy field.

XSStrike has a crawl toggle, a blind XSS payload URL field, and a fuzzer toggle.

Ggau for GraphQL has an introspection toggle, a mutation testing toggle, and a depth number field.

**Exploit Frameworks and Post-Exploit cluster:**

Msfconsole has a module path text field, an LHOST field, an LPORT number field, a payload text field, and a run as background job toggle.

Searchsploit has a required search term field, an exact match toggle, and an exclude term field.

Impacket has a script dropdown listing tools like secretsdump, psexec, wmiexec, and GetUserSPNs. Fields for domain, username, and password or hash.

CrackMapExec and NetExec have a protocol dropdown for SMB, SSH, WinRM, LDAP, and RDP. A credentials field. And a module name field.

BloodHound.py has a collection method dropdown with Default, All, DCOnly, Session, and ACL options. And a zip output toggle.

Mimikatz has a command dropdown listing the most common commands like sekurlsa::logonpasswords and lsadump::sam.

**Password and Credential cluster:**

Hashcat has an attack mode dropdown for Dictionary, Brute-force, Hybrid wordlist and mask, and Hybrid mask and wordlist. A hash type field where the user enters the -m value like 1000 for NTLM. A rules file path field. A session name field. And a GPU acceleration toggle.

John the Ripper has a hash format field, a wordlist path field, a rules field, and an incremental mode toggle.

Hydra has a service dropdown for SSH, FTP, HTTP-POST, SMB, RDP, and Telnet. Username or list field. Password or list field. Threads number. And a verbose toggle.

Medusa has a service dropdown, username or list field, password or list field, and threads number.

Ncrack has a service dropdown, a timing template dropdown from T0 to T5, a username list field, and a password list field.

Crowbar has a service dropdown for RDP, SSH, VNC, and OpenVPN. A username field. And a key file or password list field.

**Wireless and Sniffing cluster:**

Aircrack-ng has a required capture file path, a wordlist path, and a BSSID text field.

Tshark has a capture filter field, a display filter field, an output format dropdown for Text, PCAP, and JSON, and a packet count number field.

Tcpdump has a required interface field, a filter expression field, a packet count number, and a write to file toggle.

Bettercap has a caplet file path, a required interface field, and a module dropdown listing arp.spoof, net.sniff, dns.spoof, and http.proxy.

**Code and Secret Analysis cluster:**

Semgrep has a config dropdown for auto, OWASP top ten, CI, Python, and custom path. An output format dropdown for Text, JSON, and SARIF. And a severity filter multi-select.

TruffleHog has a source type dropdown for Git, GitHub, S3, Filesystem, and GCS. An only-verified secrets toggle. And a branch text field.

Gitleaks has a required source path field, a report format dropdown for JSON, CSV, and SARIF, and a baseline path field.

Trivy has a scan type dropdown for image, fs, repo, and config. A severity filter multi-select. And an output format dropdown.

Checkov has a required directory field, a framework dropdown for terraform, cloudformation, kubernetes, dockerfile, and all, and a check IDs field.

**AI Attack Agents cluster:**

PentestGPT has a model dropdown for GPT-4o, GPT-4, and GPT-3.5-turbo. A required target field. A resume session toggle. And an API key password field.

PentAGI has a required objective textarea, a max iterations number field, and a model text field.

Deadend CLI has a required target field, a strategy dropdown for Default, Aggressive, and Stealth, and a verbosity dropdown for Low, Medium, and High.

Pentest-Swarm-AI has a required target field, an agent count number field, and a required objective textarea.

---

## Right Panel — Command Preview and Output

### Before the Scan Runs — Command Preview

As soon as the cluster panel loads, the right panel shows a live command preview. This replaces what would otherwise be a blank placeholder. The right panel has a sticky header at the top that reads "Command Preview" in semi-bold white text with a subtitle below it in muted grey that says "Commands will update as you fill in the fields."

Below the header, each tool in the cluster gets its own small preview card. Each card shows the tool name at the top and below it the full CLI command that will be executed, displayed in a monospace code block with a very dark background. As the user types in any field on the left panel, the commands in the right panel update instantly to reflect the new values. The user can verify exactly what will run before clicking anything.

If no fields have been filled yet, the right panel shows a centered terminal icon in muted grey with the text "Fill in the fields on the left to preview commands."

### After the Scan Runs — Results

Once the user clicks Run All Tools and all tools complete, the right panel automatically switches from the command preview to the results view. This happens silently without any notification. The sticky header updates to say "Results" on the left and shows the scan completion timestamp on the right.

At the very top of the results area, just below the header, is a collapsed execution log. It shows as a single clickable row that reads something like "Execution Log (7 / 7 completed)" with a small chevron on the left. Clicking it expands a dark code block area showing one line per tool. Each line shows a timestamp, the tool name, and either a green checkmark with the word "completed" or a red cross with the word "failed."

Below the execution log, the findings from all tools are stacked as cards in the order they completed. Each card has a 3-pixel colored left border indicating severity — red for Critical, orange for High, yellow for Medium, blue for Low, and grey for Info. The card background is a slightly lighter dark shade with rounded corners.

Inside each card the top line shows the tool name in semi-bold white on the left, a severity badge as a small colored pill in the middle, and the completion timestamp on the right. The second line shows the cluster name in small muted text. The body of the card shows the parsed finding description in normal readable text. At the bottom of each card is a "Show Raw Output" link in small muted blue. Clicking it smoothly expands a scrollable code block below showing the full raw terminal output from the tool. The code block has a very dark background, monospace font, and a maximum height of 280 pixels with its own scroll.

Cards are separated by a 10-pixel gap. There is no table or outer container around them, just a clean vertical stack.

### Deduplication

After all tools in a single scan run complete, the backend compares all findings by host, port, and finding type. If two or more tools produced findings that match on all three of those attributes, they are merged into a single card instead of showing duplicate cards. The merged card shows all the tool names that contributed to it as small grey tags below the title. For example a card might show "nmap" and "masscan" as two grey chips, indicating both tools found the same thing.

---

## Results Page

The Results page is accessed by clicking "Results" in the sidebar. It shows all findings from all scans across the active project.

At the top of the page below the title is a full-width search bar. The user can type any keyword and the list of findings below filters in real time. The search looks across finding titles, descriptions, and raw output content. A small X button inside the field clears the search instantly.

Below the search bar is a row of filter buttons shaped as rounded pills. There is one pill for "All" and one pill for each of the nine cluster names. The active filter pill is filled solid blue. All others are outlined in grey. Clicking a pill instantly filters the findings list to show only findings from that cluster's tools.

Each finding is displayed as a card using the same structure as the right panel output cards — severity left border, tool and cluster name, parsed description, and a raw output toggle. Additionally, in the top right corner of each card is a small status dropdown. The user can set each finding to one of four statuses: Unreviewed in grey, Confirmed in red, False Positive in yellow, or Accepted Risk in green. This status is saved to the database immediately when changed and persists across sessions.

In the top right of the page, next to the title, is an "Export CSV" button with an outlined style. Clicking it downloads a CSV file containing all the currently visible findings — meaning it respects whatever filter is active. The CSV columns are Tool, Cluster, Severity, Title, Description, Status, and Timestamp. The filename follows the format pentdash_findings_projectname_date.csv.

If there are no findings yet, the page shows a centered icon with the text "No findings yet. Run a scan to see results here."

---

## Workflows Page

The Workflows page is accessed via "Workflows" in the sidebar. It is for building, saving, scheduling, and sharing multi-cluster scan sequences.

The page title "Workflows" appears at the top. On the right side of the title row are two buttons side by side. The first is "+ New Workflow" in solid blue. The second is "Import JSON" in outlined grey, which lets the user load a workflow template that was previously exported from another machine.

Below the title, saved workflow templates are listed as cards. Each card shows the template name at the top in semi-bold white. Below it are the cluster step chips — small rounded grey pills showing the cluster names in order with arrows between them. For example it might read "[Recon] → [Dir Brute-Force] → [Vuln Scan]". If the workflow has a schedule set, a small clock icon appears beside the name followed by the next scheduled run time in muted text.

At the bottom of each template card are four actions. "Run Workflow" is a small outlined blue button. "Schedule" is a small outlined grey button. "Export JSON" is another small outlined grey button that downloads the workflow as a JSON file. "Delete" is a plain text link in muted red.

Clicking "+ New Workflow" opens a modal. Inside the modal there is a text input for the workflow name at the top. Below it is a list of all nine clusters. Each cluster row has a drag handle icon on the far left, the cluster name in the middle, and a toggle switch on the right to include or exclude it. The user drags rows up and down to set the execution order. At the bottom of the modal are two buttons — "Save Template" in solid blue and "Cancel" as plain text.

Clicking "Schedule" on any existing template opens a smaller modal. This modal has a datetime picker for running the workflow once at a specific time. Below it is a dropdown to set a repeating schedule — Daily, Weekly, or Custom. If Custom is selected, a cron expression input appears. At the bottom are "Save Schedule" in solid blue and "Cancel" as plain text.

The export format for workflows is a clean JSON file that includes the workflow name, version, and an array of steps. Each step has the cluster name and its order number. This file can be sent to a teammate and imported on another machine using the Import JSON button.

---

## Tool Health Check Page

The Health Check page is accessed via "Health Check" in the sidebar. It shows whether each of the 40-plus tools is installed and ready on the system.

The page title reads "Tool Health Check." On the right side is a "Re-check All" button in outlined blue. Clicking it re-runs the availability check for every tool immediately.

Just below the title and before the table is a single summary line in muted text that reads something like "37 / 40 tools installed." This gives the user a quick overview.

The main content is a table. Each row represents one tool. The columns are Tool, Cluster, Status, Version, and Install Command.

The Status column shows either a green checkmark icon followed by "Installed" in green text, or a red X icon followed by "Missing" in red text. The Version column shows the detected version number if the tool is installed, or a dash if it is missing. The Install Command column is empty for installed tools. For missing tools it shows the exact terminal command needed to install it, displayed in a small dark monospace code chip. Clicking anywhere on that code chip copies it to the clipboard.

The health check works by the backend calling "which toolname" for each tool when the page loads. Results are cached for the current session so the page loads instantly on subsequent visits. Clicking Re-check All clears the cache and reruns all checks.

---

## Modals

All modals in the app share the same visual style. A dark semi-transparent overlay covers the entire screen behind the modal. The modal box itself has a dark surface background, a thin border, and rounded corners of 10 pixels. It is 520 pixels wide at most and centered both horizontally and vertically on screen. Internal padding is 24 pixels on all sides.

The modal title appears at the top in 16-pixel semi-bold white text. A small X icon sits in the top-right corner. Hovering over it turns it white. Clicking it or clicking anywhere on the backdrop closes the modal.

All form fields inside modals use the same input style as the cluster panel fields. At the bottom of every modal the primary action button sits on the left in solid blue and the cancel option sits on the right as plain muted text.

---

## Toast Notifications

Toast notifications appear in the bottom-right corner of the screen, 16 pixels from the bottom and right edges. Each toast is 280 pixels wide with automatic height. It has a dark surface background, thin border, rounded corners, and a soft drop shadow.

A 3-pixel colored bar on the left side indicates the type — green for success, red for error, blue for info. Inside the toast, the title appears in 13-pixel semi-bold white and a detail line appears below it in 13-pixel muted text.

When a toast appears it slides in from the right side of the screen. After 4 seconds it fades out and disappears. Toasts are used only for things like saving a workflow, exporting a file, importing a workflow, or showing an error message. Scan completion never triggers a toast — the results page simply updates silently.

---

## Additional Features

### Favourite and Pin Fields

Every input field label in the cluster panel has a small pin icon that appears when the user hovers over it. Clicking the pin saves the current value of that field so it auto-populates the next time the app loads. Pinned fields show a filled pin icon at all times. This is useful for things like a commonly used wordlist path or a local IP address. Values are stored in the database per field key and persist across sessions.

### Schedule a Workflow

Scheduling is handled by APScheduler running inside the FastAPI backend. When a schedule is saved through the Workflows page, it is stored in the database with the cron or datetime configuration. At the scheduled time, the backend triggers the workflow exactly as if the user had clicked Run Workflow themselves. All results are saved to the project just like any normal scan run.

### Import and Export Workflows

Workflows can be exported as JSON files and imported on any other PentDash instance. This makes it easy to share standard engagement templates between team members or machines. The JSON format is simple — it contains the workflow name, a version number, and an ordered list of cluster names.

### CSV Export

From the Results page, all currently visible findings can be exported to a CSV file in one click. The file contains Tool, Cluster, Severity, Title, Description, Status, and Timestamp columns. The active cluster filter is respected so the user can export findings from a specific cluster only.

### Single Start Script

A file called start.sh at the project root handles everything needed to launch the app. It checks that Python 3 is available, installs Python dependencies from requirements.txt, creates the SQLite database if it does not exist yet, and starts the FastAPI server. The user only ever needs to run one command.

### Environment Validation on Startup

When the backend starts, it silently checks whether each tool is available on the system using Python's shutil.which function. If critical tools like nmap, nuclei, or ffuf are missing, a warning is printed to the terminal. The backend also exposes a health API endpoint that returns the tool availability status as JSON. This is what the Health Check page reads from when it loads.

---

## Fonts and Icons

The app uses Inter from Google Fonts as the main sans-serif font in weights 400, 500, and 600. For all code blocks, commands, and raw terminal output it uses JetBrains Mono from Google Fonts. Both are loaded via a link tag in the HTML head.

Icons throughout the app come from Lucide Icons, loaded from a CDN as a single JavaScript file. Icons are placed in the HTML as simple i tags with a data-lucide attribute set to the icon name. After the page loads, a single JavaScript call to lucide.createIcons() renders all of them. Lucide has consistent stroke-width SVG icons and covers every icon needed in this app including shield, radar, folder-search, bug, terminal, key, wifi, code, cpu, list, git-branch, and activity.

---

## Color Reference

The app uses a fixed set of color values that are defined as CSS custom properties in the root of the stylesheet. The background of the app itself is #0d1117. Cards, panels, and input fields use #161b22. Hover states and row highlights use #1e262f. All borders and dividers are #21262d.

Primary text is #e2e8f0. Muted text is #94a3b8. Placeholder and disabled text is #64748b.

The accent blue used for buttons and active states is #2563eb. Its hover shade is #1d4ed8. The focus glow is rgba(37, 99, 235, 0.25).

Severity colors are red #ef4444 for Critical, orange #f97316 for High, yellow #eab308 for Medium, blue #3b82f6 for Low, and grey #64748b for Info. Completed status uses green #22c55e and failed status uses red #ef4444.

---

## How Every Element Behaves

Buttons in their default state are either filled solid blue or outlined with a blue border. Hovering darkens the color by about 10 percent. Clicking or pressing scales the button down very slightly, by 2 percent, and darkens it another 10 percent. When a button is disabled it becomes 40 percent opaque and the cursor changes to not-allowed. When a button is in a loading state it shows a small 12-pixel spinner on the left and the label text changes to reflect that something is happening.

Input fields show their default thin border at rest. Clicking into one turns the border blue and adds the soft glow. If validation fails the border turns red and a small error message appears directly below the field.

Accordion rows are transparent at rest. Hovering shifts their background to a slightly lighter shade. Clicking opens the content with a 200-millisecond smooth slide animation. Opening a second accordion automatically closes the first.

Sidebar items are transparent at rest. Hovering darkens them slightly. The active item gets a bright blue left border, a deep navy background, and fully white text and icon.

All transitions across the entire app use 150 milliseconds ease unless otherwise specified.

---

## Responsive Behaviour

The app is designed entirely for desktop use at 1280 pixels wide and above. It runs on localhost so mobile use is not a consideration.

On screens narrower than 1024 pixels, the sidebar collapses to a 48-pixel-wide icon-only strip with no labels. A hamburger icon appears in the top bar that, when clicked, slides the full sidebar in as an overlay on top of the content. The two-panel cluster layout stacks vertically with the left input panel on top and the right output panel below. Input field grids drop to a single column. The four stat cards on the dashboard wrap into a two-by-two grid.

---

*PentDash UI Details — v3.0 — For authorised security testing only*
