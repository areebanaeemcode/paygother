const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const htmlPath = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

console.log("Original HTML line count:", html.split('\n').length);

// -------------------------------------------------------------
// 1. FIGURE 1-1: GANTT CHART
// -------------------------------------------------------------
const SVG_GANTT = `
<div class="figure-box" style="margin:20px 0; text-align:center;">
<svg viewBox="0 0 820 330" width="100%" height="330" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <defs>
    <linearGradient id="gBlue" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient>
    <linearGradient id="gGreen" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#059669"/></linearGradient>
    <linearGradient id="gPurple" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#6d28d9"/></linearGradient>
    <linearGradient id="gAmber" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/></linearGradient>
    <linearGradient id="gRed" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#dc2626"/></linearGradient>
  </defs>

  <rect x="0" y="0" width="820" height="330" fill="#f8fafc" rx="8"/>
  <rect x="215" y="14" width="585" height="26" fill="#e2e8f0" rx="4"/>
  <text x="20" y="32" font-size="11" font-weight="700" fill="#1e293b">Project Work Packages (15 Weeks)</text>
  ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((w, i) => `
    <text x="${230 + i * 38.5}" y="31" font-size="9" font-weight="700" fill="#475569" text-anchor="middle">W${w}</text>
    <line x1="${215 + i * 38.5}" y1="40" x2="${215 + i * 38.5}" y2="315" stroke="#cbd5e1" stroke-dasharray="2,2"/>
  `).join('')}

  ${[
    { name: "1. Requirements Elicitation & SRS", start: 0, span: 2, fill: "url(#gBlue)" },
    { name: "2. System Architecture & UML Modeling", start: 1, span: 2, fill: "url(#gBlue)" },
    { name: "3. Relational DB Schema & ORM", start: 3, span: 2, fill: "url(#gBlue)" },
    { name: "4. User Auth & Tour Workspaces", start: 4, span: 2, fill: "url(#gGreen)" },
    { name: "5. Expense Ledger & Receipt Vault", start: 6, span: 2, fill: "url(#gGreen)" },
    { name: "6. Personal Limits & Breach Alerts", start: 8, span: 2, fill: "url(#gGreen)" },
    { name: "7. Offline Queue & Background Sync", start: 9, span: 2, fill: "url(#gPurple)" },
    { name: "8. Greedy Debt Settlement Engine", start: 10, span: 2, fill: "url(#gPurple)" },
    { name: "9. Analytics & Dynamic UI Dashboards", start: 11, span: 2, fill: "url(#gPurple)" },
    { name: "10. Comprehensive Verification (UT/FT/IT)", start: 12, span: 2, fill: "url(#gAmber)" },
    { name: "11. Production Deployment & Final FYP Report", start: 13, span: 2, fill: "url(#gRed)" }
  ].map((t, i) => `
    <rect x="15" y="${48 + i * 24}" width="190" height="20" fill="#ffffff" rx="3" stroke="#e2e8f0"/>
    <text x="22" y="${62 + i * 24}" font-size="8" font-weight="600" fill="#334155">${t.name}</text>
    <rect x="${217 + t.start * 38.5}" y="${50 + i * 24}" width="${t.span * 38.5 - 4}" height="16" rx="4" fill="${t.fill}"/>
  `).join('')}
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 1-1: Pay-Together Project Lifecycle Gantt Schedule (15 Weeks)</div>
</div>
`;

// -------------------------------------------------------------
// 2. FIGURE 3-5: OFFLINE STATE MACHINE
// -------------------------------------------------------------
const SVG_STATEMACHINE = `
<div class="figure-box" style="margin:20px 0; text-align:center;">
<svg viewBox="0 0 820 330" width="100%" height="330" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="820" height="330" fill="#f8fafc" rx="8"/>

  <!-- Start State -->
  <circle cx="50" cy="90" r="14" fill="#0f172a"/>
  
  <!-- State 1: Form Submitted -->
  <rect x="100" y="68" width="140" height="44" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="170" y="94" font-size="9.5" font-weight="700" fill="#1e40af" text-anchor="middle">Expense Submitted</text>

  <!-- Decision Diamond: Connectivity -->
  <polygon points="310,90 355,58 400,90 355,122" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="355" y="93" font-size="8" font-weight="700" fill="#92400e" text-anchor="middle">Online?</text>

  <!-- Online Direct State -->
  <rect x="500" y="30" width="165" height="44" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
  <text x="582" y="56" font-size="9" font-weight="700" fill="#065f46" text-anchor="middle">Direct POST /api/create/</text>

  <!-- Offline Branch: Local Queue -->
  <rect x="275" y="190" width="160" height="44" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
  <text x="355" y="210" font-size="8.5" font-weight="700" fill="#991b1b" text-anchor="middle">Queue to LocalStorage</text>
  <text x="355" y="224" font-size="7" fill="#7f1d1d" text-anchor="middle">(pt_offline_pending_v1)</text>

  <!-- Awaiting Connection -->
  <rect x="500" y="190" width="165" height="44" rx="6" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/>
  <text x="582" y="210" font-size="8.5" font-weight="700" fill="#92400e" text-anchor="middle">Awaiting Reconnection</text>
  <text x="582" y="224" font-size="7" fill="#78350f" text-anchor="middle">(15s Heartbeat Polling)</text>

  <!-- Batch Sync Gateway -->
  <rect x="500" y="110" width="165" height="44" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="582" y="130" font-size="8.5" font-weight="700" fill="#1e40af" text-anchor="middle">POST /api/offline/sync/</text>
  <text x="582" y="143" font-size="7" fill="#1e3a8a" text-anchor="middle">(Batch Deduplication)</text>

  <!-- Final State -->
  <circle cx="750" cy="52" r="16" fill="none" stroke="#10b981" stroke-width="3"/>
  <circle cx="750" cy="52" r="10" fill="#10b981"/>
  <text x="750" y="85" font-size="8.5" font-weight="700" fill="#065f46" text-anchor="middle">Synchronized</text>

  <!-- Transitions -->
  <line x1="64" y1="90" x2="100" y2="90" stroke="#475569" stroke-width="1.5"/>
  <line x1="240" y1="90" x2="310" y2="90" stroke="#475569" stroke-width="1.5"/>

  <!-- Online Branch -->
  <line x1="355" y1="58" x2="355" y2="52" stroke="#10b981" stroke-width="1.5"/>
  <line x1="355" y1="52" x2="500" y2="52" stroke="#10b981" stroke-width="1.5"/>
  <text x="425" y="46" font-size="7.5" font-weight="700" fill="#047857">[Yes - Online]</text>
  <line x1="665" y1="52" x2="734" y2="52" stroke="#10b981" stroke-width="1.5"/>

  <!-- Offline Branch -->
  <line x1="355" y1="122" x2="355" y2="190" stroke="#ef4444" stroke-width="1.5"/>
  <text x="360" y="155" font-size="7.5" font-weight="700" fill="#b91c1c">[No - Offline]</text>

  <line x1="435" y1="212" x2="500" y2="212" stroke="#d97706" stroke-width="1.5"/>
  <line x1="582" y1="190" x2="582" y2="154" stroke="#2563eb" stroke-width="1.5"/>
  <text x="588" y="176" font-size="7.5" font-weight="700" fill="#1d4ed8">['online' event]</text>

  <line x1="665" y1="132" x2="710" y2="132" stroke="#10b981" stroke-width="1.5"/>
  <line x1="710" y1="132" x2="740" y2="66" stroke="#10b981" stroke-width="1.5"/>
  <text x="715" y="122" font-size="7" fill="#047857">Purge Queue</text>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-5: Offline Expense Synchronization State Machine Diagram</div>
</div>
`;

// -------------------------------------------------------------
// 3. FIGURE 3-6: GREEDY DEBT SETTLEMENT ACTIVITY DIAGRAM
// -------------------------------------------------------------
const SVG_SETTLEMENT_FLOW = `
<div class="figure-box" style="margin:20px 0; text-align:center;">
<svg viewBox="0 0 820 360" width="100%" height="360" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="820" height="360" fill="#f8fafc" rx="8"/>

  <!-- Start Node -->
  <circle cx="410" cy="25" r="12" fill="#0f172a"/>
  
  <!-- Step 1 -->
  <rect x="290" y="55" width="240" height="36" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="410" y="77" font-size="8.5" font-weight="700" fill="#1e40af" text-anchor="middle">1. Query All Tour Expenses &amp; Splits</text>

  <!-- Step 2 -->
  <rect x="260" y="110" width="300" height="36" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="410" y="132" font-size="8.5" font-weight="700" fill="#1e40af" text-anchor="middle">2. Compute Net Balances: (Paid Amount &minus; Owed Share)</text>

  <!-- Two Columns: Debtors & Creditors -->
  <rect x="60" y="165" width="300" height="40" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
  <text x="210" y="185" font-size="8" font-weight="700" fill="#991b1b" text-anchor="middle">Debtors List (Net &lt; 0)</text>
  <text x="210" y="198" font-size="7.5" fill="#7f1d1d" text-anchor="middle">Sorted Ascending: Largest Owed First</text>

  <rect x="460" y="165" width="300" height="40" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
  <text x="610" y="185" font-size="8" font-weight="700" fill="#065f46" text-anchor="middle">Creditors List (Net &gt; 0)</text>
  <text x="610" y="198" font-size="7.5" fill="#047857" text-anchor="middle">Sorted Descending: Largest Credit First</text>

  <!-- Greedy Pair Matching Core -->
  <rect x="230" y="225" width="360" height="42" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="410" y="243" font-size="8.5" font-weight="700" fill="#92400e" text-anchor="middle">Greedy Transfer Matching: transfer = min(&minus;debt, credit)</text>
  <text x="410" y="258" font-size="7.5" fill="#78350f" text-anchor="middle">Emit: Debtor pays Creditor transfer amount | Decrement balances</text>

  <!-- Decision: Unsettled Members Remain? -->
  <polygon points="410,285 455,305 410,325 365,305" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
  <text x="410" y="308" font-size="7" font-weight="700" fill="#334155" text-anchor="middle">More?</text>

  <!-- Loop back arrow -->
  <path d="M 455,305 L 610,305 L 610,246 L 590,246" fill="none" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="615" y="280" font-size="7" font-weight="700" fill="#d97706">[Yes: Remainder &gt; 0]</text>

  <!-- Final Node -->
  <circle cx="210" cy="305" r="14" fill="none" stroke="#10b981" stroke-width="3"/>
  <circle cx="210" cy="305" r="8" fill="#10b981"/>
  <text x="210" y="335" font-size="8" font-weight="700" fill="#065f46" text-anchor="middle">Minimal Direct Transfers Emitted</text>

  <!-- Connecting Lines -->
  <line x1="410" y1="37" x2="410" y2="55" stroke="#475569" stroke-width="1.5"/>
  <line x1="410" y1="91" x2="410" y2="110" stroke="#475569" stroke-width="1.5"/>
  <line x1="330" y1="146" x2="210" y2="165" stroke="#ef4444" stroke-width="1.5"/>
  <line x1="490" y1="146" x2="610" y2="165" stroke="#10b981" stroke-width="1.5"/>
  <line x1="210" y1="205" x2="330" y2="225" stroke="#d97706" stroke-width="1.5"/>
  <line x1="610" y1="205" x2="490" y2="225" stroke="#d97706" stroke-width="1.5"/>
  <line x1="410" y1="267" x2="410" y2="285" stroke="#475569" stroke-width="1.5"/>
  <line x1="365" y1="305" x2="224" y2="305" stroke="#10b981" stroke-width="1.5"/>
  <text x="290" y="300" font-size="7" font-weight="700" fill="#047857">[No: All Settled]</text>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-6: Greedy Debt Settlement &amp; Transfer Minimization Activity Diagram</div>
</div>
`;

// -------------------------------------------------------------
// 4. FIGURE 6-1: PRODUCTION DEPLOYMENT TOPOLOGY DIAGRAM
// -------------------------------------------------------------
const SVG_DEPLOYMENT = `
<div class="figure-box" style="margin:20px 0; text-align:center;">
<svg viewBox="0 0 820 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="820" height="280" fill="#f8fafc" rx="8"/>

  <!-- Client Browser -->
  <g transform="translate(30, 70)">
    <rect x="0" y="0" width="130" height="130" fill="#eff6ff" rx="8" stroke="#2563eb" stroke-width="2"/>
    <rect x="0" y="0" width="130" height="26" fill="#1e3a8a" rx="8"/>
    <text x="65" y="17" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Client Browsers</text>
    <text x="65" y="55" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">Desktop / Mobile</text>
    <text x="65" y="75" font-size="7.5" fill="#475569" text-anchor="middle">HTML5, Tailwind</text>
    <text x="65" y="95" font-size="7.5" fill="#475569" text-anchor="middle">Vanilla JS Apps</text>
    <text x="65" y="115" font-size="7.5" fill="#059669" text-anchor="middle">LocalStorage DB</text>
  </g>

  <!-- Reverse Proxy -->
  <g transform="translate(230, 70)">
    <rect x="0" y="0" width="140" height="130" fill="#f0fdf4" rx="8" stroke="#16a34a" stroke-width="2"/>
    <rect x="0" y="0" width="140" height="26" fill="#14532d" rx="8"/>
    <text x="70" y="17" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Nginx Reverse Proxy</text>
    <text x="70" y="55" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">Port 80 / 443 (TLS)</text>
    <text x="70" y="75" font-size="7.5" fill="#475569" text-anchor="middle">SSL Termination</text>
    <text x="70" y="95" font-size="7.5" fill="#475569" text-anchor="middle">Static File Cache</text>
    <text x="70" y="115" font-size="7.5" fill="#059669" text-anchor="middle">Rate Limiter Gate</text>
  </g>

  <!-- Application Server -->
  <g transform="translate(440, 70)">
    <rect x="0" y="0" width="160" height="130" fill="#fef3c7" rx="8" stroke="#d97706" stroke-width="2"/>
    <rect x="0" y="0" width="160" height="26" fill="#78350f" rx="8"/>
    <text x="80" y="17" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Gunicorn + Django</text>
    <text x="80" y="55" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">WSGI Unix Sockets</text>
    <text x="80" y="75" font-size="7.5" fill="#475569" text-anchor="middle">Django 6.0 Core</text>
    <text x="80" y="95" font-size="7.5" fill="#475569" text-anchor="middle">DRF 3.17 REST API</text>
    <text x="80" y="115" font-size="7.5" fill="#059669" text-anchor="middle">JWT Middleware</text>
  </g>

  <!-- Persistence Tier -->
  <g transform="translate(660, 40)">
    <rect x="0" y="0" width="135" height="90" fill="#faf5ff" rx="8" stroke="#9333ea" stroke-width="2"/>
    <rect x="0" y="0" width="135" height="24" fill="#581c87" rx="8"/>
    <text x="67" y="16" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Relational DB</text>
    <text x="67" y="48" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">SQLite / MySQL</text>
    <text x="67" y="68" font-size="7.5" fill="#475569" text-anchor="middle">ACID Transactions</text>
  </g>

  <g transform="translate(660, 150)">
    <rect x="0" y="0" width="135" height="80" fill="#fff1f2" rx="8" stroke="#e11d48" stroke-width="2"/>
    <rect x="0" y="0" width="135" height="24" fill="#881337" rx="8"/>
    <text x="67" y="16" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Media Storage</text>
    <text x="67" y="48" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">/media/receipts/</text>
    <text x="67" y="68" font-size="7.5" fill="#475569" text-anchor="middle">Pillow Validated</text>
  </g>

  <!-- Connector Lines -->
  <line x1="160" y1="135" x2="230" y2="135" stroke="#2563eb" stroke-width="2"/>
  <text x="195" y="128" font-size="7.5" font-weight="700" fill="#1d4ed8" text-anchor="middle">HTTPS</text>

  <line x1="370" y1="135" x2="440" y2="135" stroke="#16a34a" stroke-width="2"/>
  <text x="405" y="128" font-size="7.5" font-weight="700" fill="#15803d" text-anchor="middle">Proxy Pass</text>

  <line x1="600" y1="110" x2="660" y2="85" stroke="#9333ea" stroke-width="2"/>
  <line x1="600" y1="160" x2="660" y2="190" stroke="#e11d48" stroke-width="2"/>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 6-1: Pay-Together Production Infrastructure &amp; Deployment Topology</div>
</div>
`;

// -------------------------------------------------------------
// 5. FIGURE C-1: PROTOTYPE UI WIREFRAMES
// -------------------------------------------------------------
const SVG_PROTOTYPE = `
<div class="figure-box" style="margin:20px 0; text-align:center;">
<svg viewBox="0 0 820 480" width="100%" height="480" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="820" height="480" fill="#f8fafc" rx="8"/>

  <!-- Screen 1: Tour Dashboard Mockup -->
  <g transform="translate(25, 20)">
    <rect x="0" y="0" width="365" height="210" fill="#ffffff" rx="6" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="0" y="0" width="365" height="24" fill="#1e293b" rx="6"/>
    <text x="15" y="16" font-size="9" font-weight="700" fill="#ffffff">Tour Workspace &bull; Skardu Expedition</text>
    <rect x="15" y="35" width="105" height="35" fill="#eff6ff" rx="4" stroke="#bfdbfe"/>
    <text x="22" y="49" font-size="7.5" fill="#1e40af">Total Budget</text>
    <text x="22" y="63" font-size="9.5" font-weight="700" fill="#1e3a8a">$150,000</text>
    <rect x="130" y="35" width="105" height="35" fill="#ecfdf5" rx="4" stroke="#a7f3d0"/>
    <text x="137" y="49" font-size="7.5" fill="#065f46">Total Spent</text>
    <text x="137" y="63" font-size="9.5" font-weight="700" fill="#047857">$84,250</text>
    <rect x="245" y="35" width="105" height="35" fill="#fef3c7" rx="4" stroke="#fde68a"/>
    <text x="252" y="49" font-size="7.5" fill="#92400e">Join Token</text>
    <text x="252" y="63" font-size="9.5" font-weight="700" fill="#b45309">SKD101</text>
    <!-- Expense Table Mini -->
    <rect x="15" y="80" width="335" height="115" fill="#f8fafc" rx="4" stroke="#e2e8f0"/>
    <text x="25" y="98" font-size="8" font-weight="700" fill="#334155">Recent Tour Expenses</text>
    <text x="25" y="118" font-size="7.5" fill="#475569">SUV Rental &bull; Transport</text><text x="320" y="118" font-size="7.5" font-weight="600" fill="#1e293b" text-anchor="end">$45,000</text>
    <text x="25" y="138" font-size="7.5" fill="#475569">Resort Stay &bull; Accommodation</text><text x="320" y="138" font-size="7.5" font-weight="600" fill="#1e293b" text-anchor="end">$32,000</text>
    <text x="25" y="158" font-size="7.5" fill="#475569">Dinner Buffet &bull; Food</text><text x="320" y="158" font-size="7.5" font-weight="600" fill="#1e293b" text-anchor="end">$7,250</text>
    <text x="25" y="180" font-size="7" fill="#2563eb">+ Add Expense &bull; Set Limit &bull; View Settlement</text>
  </g>

  <!-- Screen 2: Add Expense Modal Mockup -->
  <g transform="translate(425, 20)">
    <rect x="0" y="0" width="370" height="210" fill="#ffffff" rx="6" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="0" y="0" width="370" height="24" fill="#2563eb" rx="6"/>
    <text x="15" y="16" font-size="9" font-weight="700" fill="#ffffff">Record New Expense Modal</text>
    <rect x="20" y="38" width="330" height="24" fill="#f1f5f9" rx="3" stroke="#cbd5e1"/>
    <text x="30" y="54" font-size="8" fill="#64748b">Amount: $ 4,500.00</text>
    <rect x="20" y="70" width="160" height="24" fill="#f1f5f9" rx="3" stroke="#cbd5e1"/>
    <text x="30" y="86" font-size="8" fill="#334155">Category: Food &amp; Dining</text>
    <rect x="190" y="70" width="160" height="24" fill="#f1f5f9" rx="3" stroke="#cbd5e1"/>
    <text x="200" y="86" font-size="8" fill="#334155">Method: Online Transfer</text>
    <!-- Receipt Box -->
    <rect x="20" y="102" width="330" height="32" fill="#faf5ff" rx="3" stroke="#d8b4fe"/>
    <text x="30" y="122" font-size="7.5" fill="#7e22ce">&#128247; Receipt: hotel_bill_2026.jpg (Attached)</text>
    <rect x="20" y="142" width="330" height="26" fill="#eff6ff" rx="3" stroke="#93c5fd"/>
    <text x="30" y="159" font-size="7.5" fill="#1e40af">&#9889; Smart Suggestion: Food matches 'dinner' keyword</text>
    <rect x="20" y="176" width="330" height="24" fill="#10b981" rx="4"/>
    <text x="185" y="192" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Save Expense &amp; Compute Splits</text>
  </g>

  <!-- Screen 3: Settlement & Transfer Vouchers -->
  <g transform="translate(25, 250)">
    <rect x="0" y="0" width="365" height="205" fill="#ffffff" rx="6" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="0" y="0" width="365" height="24" fill="#047857" rx="6"/>
    <text x="15" y="16" font-size="9" font-weight="700" fill="#ffffff">Settlement &amp; Debt Resolution</text>
    <text x="20" y="45" font-size="8" font-weight="700" fill="#334155">Net Member Balances</text>
    <text x="20" y="65" font-size="7.5" fill="#1e293b">Ali Ahmed (Creditor):</text><text x="330" y="65" font-size="7.5" font-weight="700" fill="#059669" text-anchor="end">+$24,500</text>
    <text x="20" y="85" font-size="7.5" fill="#1e293b">Babar Khan (Debtor):</text><text x="330" y="85" font-size="7.5" font-weight="700" fill="#dc2626" text-anchor="end">&minus;$14,500</text>
    <text x="20" y="105" font-size="7.5" fill="#1e293b">Hamza Butt (Debtor):</text><text x="330" y="105" font-size="7.5" font-weight="700" fill="#dc2626" text-anchor="end">&minus;$10,000</text>
    <!-- Optimized Transfer Box -->
    <rect x="15" y="120" width="335" height="70" fill="#f0fdf4" rx="4" stroke="#86efac"/>
    <text x="25" y="138" font-size="8" font-weight="700" fill="#065f46">Optimized Minimal Direct Transfers:</text>
    <text x="25" y="156" font-size="7.5" fill="#1e293b">&bull; Babar Khan &rarr; pays $14,500 to Ali Ahmed</text>
    <text x="25" y="174" font-size="7.5" fill="#1e293b">&bull; Hamza Butt &rarr; pays $10,000 to Ali Ahmed</text>
  </g>

  <!-- Screen 4: Category Analytics Doughnut -->
  <g transform="translate(425, 250)">
    <rect x="0" y="0" width="370" height="205" fill="#ffffff" rx="6" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="0" y="0" width="370" height="24" fill="#6d28d9" rx="6"/>
    <text x="15" y="16" font-size="9" font-weight="700" fill="#ffffff">Category Spending Analytics (Chart.js)</text>
    <!-- Visual Doughnut -->
    <circle cx="95" cy="115" r="55" fill="none" stroke="#6366f1" stroke-width="26" stroke-dasharray="140 345"/>
    <circle cx="95" cy="115" r="55" fill="none" stroke="#0ea5e9" stroke-width="26" stroke-dasharray="100 345" stroke-dashoffset="-140"/>
    <circle cx="95" cy="115" r="55" fill="none" stroke="#f43f5e" stroke-width="26" stroke-dasharray="70 345" stroke-dashoffset="-240"/>
    <circle cx="95" cy="115" r="55" fill="none" stroke="#10b981" stroke-width="26" stroke-dasharray="35 345" stroke-dashoffset="-310"/>
    <text x="95" y="118" font-size="8" font-weight="700" fill="#1e293b" text-anchor="middle">$84,250</text>
    <!-- Legend -->
    <g transform="translate(180, 50)">
      <rect x="0" y="10" width="12" height="12" fill="#6366f1" rx="2"/><text x="20" y="20" font-size="7.5" fill="#334155">Transport (42%)</text>
      <rect x="0" y="35" width="12" height="12" fill="#0ea5e9" rx="2"/><text x="20" y="45" font-size="7.5" fill="#334155">Accommodation (30%)</text>
      <rect x="0" y="60" width="12" height="12" fill="#f43f5e" rx="2"/><text x="20" y="70" font-size="7.5" fill="#334155">Food &amp; Dining (20%)</text>
      <rect x="0" y="85" width="12" height="12" fill="#10b981" rx="2"/><text x="20" y="95" font-size="7.5" fill="#334155">Activities (8%)</text>
      <!-- Alert Tag -->
      <rect x="0" y="110" width="165" height="24" fill="#fee2e2" rx="3" stroke="#f87171"/>
      <text x="8" y="126" font-size="7" font-weight="700" fill="#b91c1c">&#9888; Transport &ge; 30% Runaway Alert</text>
    </g>
  </g>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure C-1: Pay-Together Application Prototype Screen Layouts (Dashboard, Modal, Settlement, &amp; Analytics)</div>
</div>
`;

// -------------------------------------------------------------
// INJECTION EXECUTION
// -------------------------------------------------------------

// 1. Inject Figure 1-1 into Chapter 1 (before Chapter 2)
if (!html.includes('Figure 1-1: Pay-Together Project Lifecycle Gantt Schedule')) {
  console.log("Injecting Figure 1-1 Gantt Chart into Chapter 1...");
  const targetC1 = '<!-- CHAPTER 2: REQUIREMENTS ANALYSIS -->';
  const ganttSection = `
  <h2>1.10 Project Deliverables &amp; Planning</h2>
  <p>The Pay-Together platform was executed across an intensive 15-week milestone roadmap encompassing requirements engineering, relational modeling, core service development, offline synchronization, testing, and production hardening:</p>
  ${SVG_GANTT}
  <p>The project deliverables comprise the fully functional Django REST API backend, the modular client-side single page architecture, complete database migration scripts, automated unit and functional test suites, and this formal Final Year Project documentation specification.</p>
</div>

${targetC1}`;
  html = html.replace(targetC1, ganttSection);
}

// 2. Inject Figure 3-5 into Chapter 3 (before Chapter 4)
if (!html.includes('Figure 3-5: Offline Expense Synchronization State Machine Diagram')) {
  console.log("Injecting Figure 3-5 State Machine into Chapter 3...");
  const targetC4 = '<!-- CHAPTER 4: IMPLEMENTATION -->';
  const stateSection = `
  <h2>3.5 User Interface Architecture &amp; Progressive Disclosure</h2>
  <p>The user interface follows modern component-driven UX standards, presenting high-level trip telemetry on top stat cards and enabling focused interaction via asynchronous modals for expense logging, limit threshold settings, and receipt audits.</p>

  <h2>3.6 Behavioural Models (Offline Expense Synchronization State Machine)</h2>
  <p>The offline synchronization engine operates as a deterministic state machine capturing transaction payloads during offline disconnects and batch-syncing upon reconnection:</p>
  ${SVG_STATEMACHINE}
</div>

${targetC4}`;
  html = html.replace(targetC4, stateSection);
}

// 3. Inject Figure 3-6 Settlement Activity Diagram into Chapter 4
if (!html.includes('Figure 3-6: Greedy Debt Settlement')) {
  console.log("Injecting Figure 3-6 Settlement Flow into Chapter 4...");
  const targetAlgo2 = '<h3>Algorithm 2: Greedy Debt-Minimization Settlement</h3>';
  const flowSection = `
  <h3>Algorithm 2: Greedy Debt-Minimization Settlement</h3>
  <p>The debt minimization algorithm resolves multi-party debts with the minimum possible number of individual cash or online transfers:</p>
  ${SVG_SETTLEMENT_FLOW}`;
  html = html.replace(targetAlgo2, flowSection);
}

// 4. Inject Figure 6-1 Deployment Topology into Chapter 6
if (!html.includes('Figure 6-1: Pay-Together Production Infrastructure')) {
  console.log("Injecting Figure 6-1 Deployment Topology into Chapter 6...");
  html = html.replace(
    /<h2>6\.\s*Deployment Topology\s*(&amp;|&)\s*User Guide<\/h2>/,
    `<h2>6. Deployment Topology &amp; Production Architecture</h2>
  <p>The production deployment architecture establishes multi-layer redundancy, reverse proxy TLS termination, and isolation of static and uploaded media assets:</p>
  ${SVG_DEPLOYMENT}
  <h2>6.1 User Operations Manual &amp; Direct Cutover</h2>`
  );
}

// 5. Inject Figure C-1 into Appendix C
if (!html.includes('Figure C-1: Pay-Together Application Prototype Screen Layouts')) {
  console.log("Injecting Figure C-1 Prototype Screens into Appendix C...");
  html = html.replace(
    /<h2>Appendix B\s*(&amp;|&)\s*C:\s*Standards\s*(&amp;|&)\s*Application Prototype<\/h2>/,
    `<h2>Appendix B: Coding Standards &amp; Architecture Guidelines</h2>
  <p>The codebase adheres to PEP 8 standards, wraps multi-table writes in atomic transactions, uses fixed-point Decimal types for all currency fields, and structures client-side JavaScript into modular controllers.</p>
  <h2>Appendix C: Application Prototype Screen Layouts &amp; Wireframes</h2>
  <p>The platform includes 14 responsive screens covering landing, authentication, dashboard, tour workspace, expense modal, receipt previewer, limits, notifications, analytics, and settlement reconciliation. The vector wireframes below showcase the primary operational screens:</p>
  ${SVG_PROTOTYPE}`
  );
}

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log("Pay_Together_FYP_Documentation.html updated successfully!");

// Verify all figures in updated HTML
const figures = [...html.matchAll(/Figure [^<:]+:[^<]+/g)].map(m => m[0]);
console.log(`Verified total figures in HTML (${figures.length}):`);
figures.forEach((f, idx) => console.log(` ${idx + 1}. ${f}`));

// -------------------------------------------------------------
// COMPILE PDF VIA GOOGLE CHROME HEADLESS
// -------------------------------------------------------------
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputPdf = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.pdf');
const downloadsPdf = 'C:\\Users\\muham\\Downloads\\Pay_Together_FYP_Documentation.pdf';

console.log("\nCompiling publication PDF with all diagrams...");
const args = [
  '--headless',
  '--disable-gpu',
  '--run-all-compositor-stages-before-draw',
  '--no-pdf-header-footer',
  `--print-to-pdf=${outputPdf}`,
  htmlPath
];

const res = spawnSync(chromePath, args, { encoding: 'utf-8' });
if (fs.existsSync(outputPdf)) {
  const stat = fs.statSync(outputPdf);
  console.log(`\nSUCCESS! Generated PDF: ${outputPdf}`);
  console.log(`File Size: ${(stat.size / 1024).toFixed(1)} KB`);
  
  fs.copyFileSync(outputPdf, downloadsPdf);
  console.log(`Copied updated PDF to root Downloads: ${downloadsPdf}`);
} else {
  console.error("PDF generation failed.");
}
