const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const htmlPath = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// SVG 1: Gantt Chart
const SVG_GANTT = `
<div class="figure-box" style="margin:20px 0; text-align:center;">
<svg viewBox="0 0 820 310" width="100%" height="310" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="820" height="310" fill="#f8fafc" rx="8"/>
  <rect x="210" y="15" width="590" height="28" fill="#e2e8f0" rx="4"/>
  <text x="20" y="34" font-size="11" font-weight="700" fill="#1e293b">Project Work Packages</text>
  ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((w, i) => `
    <text x="${225 + i * 39}" y="33" font-size="9.5" font-weight="600" fill="#475569" text-anchor="middle">W${w}</text>
    <line x1="${210 + i * 39}" y1="43" x2="${210 + i * 39}" y2="295" stroke="#cbd5e1" stroke-dasharray="2,2"/>
  `).join('')}
  ${[
    { name: "Requirement Gathering & SRS", start: 0, span: 2, fill: "#3b82f6" },
    { name: "System Design & UML Modeling", start: 1, span: 2, fill: "#3b82f6" },
    { name: "Database Schema & ORM Models", start: 3, span: 2, fill: "#3b82f6" },
    { name: "User Auth & Tour Module", start: 4, span: 2, fill: "#10b981" },
    { name: "Expense Ledger & Receipt Module", start: 6, span: 2, fill: "#10b981" },
    { name: "Smart Expense & Limit Alerts", start: 8, span: 2, fill: "#10b981" },
    { name: "Offline Mode & Sync Engine", start: 9, span: 2, fill: "#8b5cf6" },
    { name: "Settlement Engine (Greedy)", start: 10, span: 2, fill: "#8b5cf6" },
    { name: "Analytics & UI Dashboards", start: 11, span: 2, fill: "#8b5cf6" },
    { name: "Comprehensive Testing (UT/FT/IT)", start: 12, span: 2, fill: "#f59e0b" },
    { name: "Final Deployment & FYP Report", start: 13, span: 2, fill: "#ef4444" }
  ].map((t, i) => `
    <rect x="15" y="${52 + i * 22}" width="185" height="18" fill="#ffffff" rx="3" stroke="#e2e8f0"/>
    <text x="20" y="${65 + i * 22}" font-size="8" font-weight="600" fill="#334155">${t.name}</text>
    <rect x="${212 + t.start * 39}" y="${54 + i * 22}" width="${t.span * 39 - 4}" height="14" rx="4" fill="${t.fill}"/>
  `).join('')}
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 1-1: Pay-Together Project Lifecycle Gantt Schedule (15 Weeks)</div>
</div>
`;

// SVG 2: Use Case Diagram
const SVG_USECASE = `
<div class="figure-box" style="margin:20px 0; text-align:center;">
<svg viewBox="0 0 820 520" width="100%" height="520" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="820" height="520" fill="#f8fafc" rx="8"/>
  <rect x="220" y="20" width="400" height="480" fill="#ffffff" rx="8" stroke="#2563eb" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="420" y="44" font-size="13" font-weight="800" fill="#1e3a8a" text-anchor="middle">PAY-TOGETHER PLATFORM BOUNDARY</text>

  <!-- Actors Left -->
  <g transform="translate(50, 90)">
    <circle cx="30" cy="18" r="14" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="30" y1="32" x2="30" y2="68" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="12" y1="46" x2="48" y2="46" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="30" y1="68" x2="16" y2="96" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="30" y1="68" x2="44" y2="96" stroke="#1d4ed8" stroke-width="2"/>
    <text x="30" y="116" font-size="10" font-weight="700" fill="#1e293b" text-anchor="middle">Registered User</text>
  </g>

  <g transform="translate(50, 300)">
    <circle cx="30" cy="18" r="14" fill="#dcfce7" stroke="#15803d" stroke-width="2"/>
    <line x1="30" y1="32" x2="30" y2="68" stroke="#15803d" stroke-width="2"/>
    <line x1="12" y1="46" x2="48" y2="46" stroke="#15803d" stroke-width="2"/>
    <line x1="30" y1="68" x2="16" y2="96" stroke="#15803d" stroke-width="2"/>
    <line x1="30" y1="68" x2="44" y2="96" stroke="#15803d" stroke-width="2"/>
    <text x="30" y="116" font-size="10" font-weight="700" fill="#1e293b" text-anchor="middle">Tour Member</text>
  </g>

  <!-- Actors Right -->
  <g transform="translate(710, 130)">
    <circle cx="30" cy="18" r="14" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <line x1="30" y1="32" x2="30" y2="68" stroke="#b45309" stroke-width="2"/>
    <line x1="12" y1="46" x2="48" y2="46" stroke="#b45309" stroke-width="2"/>
    <line x1="30" y1="68" x2="16" y2="96" stroke="#b45309" stroke-width="2"/>
    <line x1="30" y1="68" x2="44" y2="96" stroke="#b45309" stroke-width="2"/>
    <text x="30" y="116" font-size="10" font-weight="700" fill="#1e293b" text-anchor="middle">Tour Creator</text>
  </g>

  <g transform="translate(710, 330)">
    <circle cx="30" cy="18" r="14" fill="#fee2e2" stroke="#b91c1c" stroke-width="2"/>
    <line x1="30" y1="32" x2="30" y2="68" stroke="#b91c1c" stroke-width="2"/>
    <line x1="12" y1="46" x2="48" y2="46" stroke="#b91c1c" stroke-width="2"/>
    <line x1="30" y1="68" x2="16" y2="96" stroke="#b91c1c" stroke-width="2"/>
    <line x1="30" y1="68" x2="44" y2="96" stroke="#b91c1c" stroke-width="2"/>
    <text x="30" y="116" font-size="10" font-weight="700" fill="#1e293b" text-anchor="middle">System Admin</text>
  </g>

  <!-- Use Case Ovals -->
  ${[
    { id: "UC-01", name: "Register Account", y: 70, cx: 320 },
    { id: "UC-02", name: "Login & Authenticate", y: 110, cx: 320 },
    { id: "UC-03", name: "Create Tour Workspace", y: 155, cx: 350 },
    { id: "UC-04", name: "Join Tour via Token", y: 200, cx: 350 },
    { id: "UC-05", name: "Add Expense & Splits", y: 250, cx: 420 },
    { id: "UC-06", name: "Set Personal Limit", y: 295, cx: 420 },
    { id: "UC-07", name: "View Category Analytics", y: 340, cx: 420 },
    { id: "UC-08", name: "View Settlement & Balances", y: 385, cx: 420 },
    { id: "UC-09", name: "Upload & Verify Receipt", y: 430, cx: 420 },
    { id: "UC-10", name: "Record Offline & Auto-Sync", y: 475, cx: 420 },
    { id: "UC-11", name: "Manage Members & Status", y: 155, cx: 520 },
    { id: "UC-12", name: "Admin Telemetry & Gate", y: 385, cx: 520 },
  ].map(uc => `
    <ellipse cx="${uc.cx}" cy="${uc.y}" rx="80" ry="17" fill="#f1f5f9" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="${uc.cx}" y="${uc.y + 4}" font-size="8.5" font-weight="600" fill="#0f172a" text-anchor="middle">${uc.id}: ${uc.name}</text>
  `).join('')}

  <!-- Connecting Lines -->
  <line x1="110" y1="130" x2="245" y2="70" stroke="#64748b" stroke-width="1.2"/>
  <line x1="110" y1="140" x2="245" y2="110" stroke="#64748b" stroke-width="1.2"/>
  <line x1="110" y1="150" x2="275" y2="155" stroke="#64748b" stroke-width="1.2"/>
  <line x1="110" y1="160" x2="275" y2="200" stroke="#64748b" stroke-width="1.2"/>

  <line x1="110" y1="330" x2="345" y2="250" stroke="#64748b" stroke-width="1.2"/>
  <line x1="110" y1="340" x2="345" y2="295" stroke="#64748b" stroke-width="1.2"/>
  <line x1="110" y1="350" x2="345" y2="340" stroke="#64748b" stroke-width="1.2"/>
  <line x1="110" y1="360" x2="345" y2="385" stroke="#64748b" stroke-width="1.2"/>
  <line x1="110" y1="370" x2="345" y2="430" stroke="#64748b" stroke-width="1.2"/>
  <line x1="110" y1="380" x2="345" y2="475" stroke="#64748b" stroke-width="1.2"/>

  <line x1="710" y1="180" x2="435" y2="155" stroke="#64748b" stroke-width="1.2"/>
  <line x1="710" y1="190" x2="505" y2="430" stroke="#64748b" stroke-width="1.2"/>
  <line x1="710" y1="380" x2="600" y2="385" stroke="#64748b" stroke-width="1.2"/>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 2-1: Pay-Together Comprehensive UML Use Case Diagram</div>
</div>
`;

// SVG 3: Sequence Diagram
const SVG_SEQUENCE = `
<div class="figure-box" style="margin:20px 0; text-align:center;">
<svg viewBox="0 0 820 440" width="100%" height="440" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="820" height="440" fill="#f8fafc" rx="8"/>
  ${[
    { name: "Tour Member", x: 65 },
    { name: "UI (tour_detail.js)", x: 220 },
    { name: "ExpenseCreateAPI", x: 385 },
    { name: "Database (ORM)", x: 545 },
    { name: "LimitEngine", x: 680 },
    { name: "Notif Hub", x: 775 }
  ].map(p => `
    <rect x="${p.x - 52}" y="18" width="104" height="28" fill="#1e3a8a" rx="4"/>
    <text x="${p.x}" y="36" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">${p.name}</text>
    <line x1="${p.x}" y1="46" x2="${p.x}" y2="415" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>
  `).join('')}

  <line x1="65" y1="75" x2="220" y2="75" stroke="#2563eb" stroke-width="1.5"/>
  <text x="142" y="69" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">1. Fill & Submit Expense Form</text>

  <line x1="220" y1="105" x2="385" y2="105" stroke="#2563eb" stroke-width="1.5"/>
  <text x="302" y="99" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">2. POST /api/create/ [JSON + JWT]</text>

  <line x1="385" y1="135" x2="545" y2="135" stroke="#2563eb" stroke-width="1.5"/>
  <text x="465" y="129" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">3. Insert Expense & Splits</text>

  <rect x="540" y="135" width="10" height="35" fill="#93c5fd"/>
  <line x1="545" y1="170" x2="385" y2="170" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="465" y="165" font-size="7.5" fill="#64748b" text-anchor="middle">Expense Saved (ID: 42)</text>

  <line x1="385" y1="200" x2="680" y2="200" stroke="#2563eb" stroke-width="1.5"/>
  <text x="532" y="194" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">4. check_expense_limits_for_tour()</text>

  <line x1="680" y1="225" x2="545" y2="225" stroke="#2563eb" stroke-width="1.5"/>
  <text x="612" y="219" font-size="7.5" fill="#1e293b" text-anchor="middle">5. Sum(amount) for User</text>
  <line x1="545" y1="245" x2="680" y2="245" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="612" y="240" font-size="7.5" fill="#64748b" text-anchor="middle">Spent = $650, Limit = $500</text>

  <rect x="350" y="265" width="445" height="80" fill="#fef2f2" stroke="#f87171" stroke-width="1" rx="4"/>
  <text x="360" y="280" font-size="8" font-weight="700" fill="#991b1b">[alt: Spent &gt; Limit AND last_notified_exceeded == False]</text>

  <line x1="680" y1="305" x2="775" y2="305" stroke="#ef4444" stroke-width="1.5"/>
  <text x="727" y="299" font-size="7.5" font-weight="600" fill="#991b1b" text-anchor="middle">Create Notif</text>
  <line x1="680" y1="330" x2="545" y2="330" stroke="#2563eb" stroke-width="1.5"/>
  <text x="612" y="325" font-size="7.5" fill="#1e293b" text-anchor="middle">last_notified = True</text>

  <line x1="385" y1="370" x2="220" y2="370" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="302" y="364" font-size="8" font-weight="600" fill="#047857" text-anchor="middle">HTTP 201 Created [Payload + Alert Flag]</text>

  <line x1="220" y1="398" x2="65" y2="398" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="142" y="392" font-size="8" font-weight="600" fill="#047857" text-anchor="middle">Update DOM Ledger & Trigger Banner</text>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-2: Add Expense and Edge-Triggered Limit Checking Sequence Diagram</div>
</div>
`;

// SVG 4: Architecture Diagram
const SVG_ARCH = `
<div class="figure-box" style="margin:20px 0; text-align:center;">
<svg viewBox="0 0 820 420" width="100%" height="420" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="820" height="420" fill="#f8fafc" rx="8"/>

  <g transform="translate(25, 25)">
    <rect x="0" y="0" width="770" height="80" fill="#eff6ff" rx="6" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="20" y="22" font-size="11" font-weight="800" fill="#1e3a8a">TIER 1: PRESENTATION TIER (CLIENT BROWSER)</text>
    <rect x="20" y="32" width="165" height="34" fill="#ffffff" rx="4" stroke="#93c5fd"/>
    <text x="102" y="53" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">HTML5 & Tailwind CSS</text>
    <rect x="200" y="32" width="185" height="34" fill="#ffffff" rx="4" stroke="#93c5fd"/>
    <text x="292" y="53" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">Vanilla JS Controllers</text>
    <rect x="400" y="32" width="165" height="34" fill="#ffffff" rx="4" stroke="#93c5fd"/>
    <text x="482" y="53" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">Chart.js Visualizations</text>
    <rect x="580" y="32" width="170" height="34" fill="#ffffff" rx="4" stroke="#f59e0b"/>
    <text x="665" y="53" font-size="8.5" font-weight="700" fill="#b45309" text-anchor="middle">Offline localStorage Queue</text>
  </g>

  <line x1="410" y1="105" x2="410" y2="145" stroke="#2563eb" stroke-width="2"/>
  <text x="420" y="130" font-size="8.5" font-weight="600" fill="#2563eb">HTTPS / JSON REST API</text>

  <g transform="translate(25, 145)">
    <rect x="0" y="0" width="770" height="145" fill="#f0fdf4" rx="6" stroke="#10b981" stroke-width="1.5"/>
    <text x="20" y="22" font-size="11" font-weight="800" fill="#065f46">TIER 2: APPLICATION SERVICE TIER (DJANGO 6.0 & DRF)</text>
    
    <rect x="20" y="32" width="225" height="98" fill="#ffffff" rx="4" stroke="#86efac"/>
    <text x="132" y="50" font-size="9.5" font-weight="700" fill="#1e293b" text-anchor="middle">Security & Gate Layer</text>
    <text x="30" y="70" font-size="7.5" fill="#475569">&bull; AdminAccessPassMiddleware</text>
    <text x="30" y="85" font-size="7.5" fill="#475569">&bull; SimpleJWT Bearer Authentication</text>
    <text x="30" y="100" font-size="7.5" fill="#475569">&bull; Session Cookie & CSRF Defense</text>
    <text x="30" y="115" font-size="7.5" fill="#475569">&bull; IsTourMember Permissions</text>

    <rect x="260" y="32" width="245" height="98" fill="#ffffff" rx="4" stroke="#86efac"/>
    <text x="382" y="50" font-size="9.5" font-weight="700" fill="#1e293b" text-anchor="middle">Business Engines</text>
    <text x="270" y="70" font-size="7.5" fill="#475569">&bull; Greedy Debt Minimization Engine</text>
    <text x="270" y="85" font-size="7.5" fill="#475569">&bull; Edge-Triggered Limit Service</text>
    <text x="270" y="100" font-size="7.5" fill="#475569">&bull; Smart Expense Keyword Classifier</text>
    <text x="270" y="115" font-size="7.5" fill="#475569">&bull; Alphanumeric Token Generator</text>

    <rect x="520" y="32" width="230" height="98" fill="#ffffff" rx="4" stroke="#86efac"/>
    <text x="635" y="50" font-size="9.5" font-weight="700" fill="#1e293b" text-anchor="middle">Controllers & APIs</text>
    <text x="530" y="70" font-size="7.5" fill="#475569">&bull; TourListAPI / CreateTourAPI</text>
    <text x="530" y="85" font-size="7.5" fill="#475569">&bull; ExpenseCreateAPI / Splits</text>
    <text x="530" y="100" font-size="7.5" fill="#475569">&bull; OfflinePendingExpenseSyncAPI</text>
    <text x="530" y="115" font-size="7.5" fill="#475569">&bull; ReceiptUpload & Verification</text>
  </g>

  <line x1="410" y1="290" x2="410" y2="330" stroke="#10b981" stroke-width="2"/>
  <text x="420" y="315" font-size="8.5" font-weight="600" fill="#047857">Django ORM / SQL</text>

  <g transform="translate(25, 330)">
    <rect x="0" y="0" width="770" height="70" fill="#fdf4ff" rx="6" stroke="#c084fc" stroke-width="1.5"/>
    <text x="20" y="20" font-size="11" font-weight="800" fill="#6b21a8">TIER 3: DATA PERSISTENCE & MEDIA STORAGE TIER</text>
    <rect x="20" y="28" width="360" height="32" fill="#ffffff" rx="4" stroke="#e9d5ff"/>
    <text x="200" y="48" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">Relational Database Engine (SQLite 3 / MySQL 8.0)</text>
    <rect x="395" y="28" width="355" height="32" fill="#ffffff" rx="4" stroke="#e9d5ff"/>
    <text x="572" y="48" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">Media Root Directory (/media/receipts/%Y/%m/)</text>
  </g>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-3: Pay-Together Multi-Tier Architecture Topology</div>
</div>
`;

// SVG 5: ER Diagram
const SVG_ERD = `
<div class="figure-box" style="margin:20px 0; text-align:center;">
<svg viewBox="0 0 820 520" width="100%" height="520" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="820" height="520" fill="#f8fafc" rx="8"/>

  <!-- USERS -->
  <g transform="translate(25, 20)">
    <rect x="0" y="0" width="180" height="140" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="180" height="22" fill="#0f172a" rx="4"/>
    <text x="90" y="15" font-size="9.5" font-weight="700" fill="#ffffff" text-anchor="middle">users</text>
    <text x="8" y="36" font-size="7.5" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="8" y="50" font-size="7.5" fill="#334155">email: VarChar(254) [UQ]</text>
    <text x="8" y="64" font-size="7.5" fill="#334155">phone_number: VarChar(15)</text>
    <text x="8" y="78" font-size="7.5" fill="#334155">first_name, last_name: Str</text>
    <text x="8" y="92" font-size="7.5" fill="#334155">password: VarChar(128)</text>
    <text x="8" y="106" font-size="7.5" fill="#334155">is_active: Boolean</text>
    <text x="8" y="120" font-size="7.5" fill="#334155">created_at: DateTime</text>
  </g>

  <!-- TOURS -->
  <g transform="translate(295, 20)">
    <rect x="0" y="0" width="205" height="140" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="205" height="22" fill="#0f172a" rx="4"/>
    <text x="102" y="15" font-size="9.5" font-weight="700" fill="#ffffff" text-anchor="middle">apps_tours_tour</text>
    <text x="8" y="36" font-size="7.5" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="8" y="50" font-size="7.5" font-weight="700" fill="#2563eb">FK created_by_id: BigInt</text>
    <text x="8" y="64" font-size="7.5" fill="#334155">title, destination: Str</text>
    <text x="8" y="78" font-size="7.5" fill="#334155">budget: Decimal(12,2)</text>
    <text x="8" y="92" font-size="7.5" fill="#334155">join_token: VarChar(64) [UQ]</text>
    <text x="8" y="106" font-size="7.5" fill="#334155">status: Enum(planned,...)</text>
    <text x="8" y="120" font-size="7.5" fill="#334155">start_date, end_date: Date</text>
  </g>

  <!-- TOUR_MEMBERS -->
  <g transform="translate(585, 20)">
    <rect x="0" y="0" width="205" height="110" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="205" height="22" fill="#0f172a" rx="4"/>
    <text x="102" y="15" font-size="9.5" font-weight="700" fill="#ffffff" text-anchor="middle">apps_tours_tourmember</text>
    <text x="8" y="36" font-size="7.5" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="8" y="50" font-size="7.5" font-weight="700" fill="#2563eb">FK tour_id: BigInt</text>
    <text x="8" y="64" font-size="7.5" font-weight="700" fill="#2563eb">FK user_id: BigInt</text>
    <text x="8" y="78" font-size="7.5" fill="#334155">role: 'creator' | 'member'</text>
    <text x="8" y="92" font-size="7.5" fill="#334155">joined_at: DateTime</text>
  </g>

  <!-- EXPENSES -->
  <g transform="translate(295, 205)">
    <rect x="0" y="0" width="205" height="145" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="205" height="22" fill="#0f172a" rx="4"/>
    <text x="102" y="15" font-size="9.5" font-weight="700" fill="#ffffff" text-anchor="middle">expenses</text>
    <text x="8" y="36" font-size="7.5" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="8" y="50" font-size="7.5" font-weight="700" fill="#2563eb">FK tour_id: BigInt</text>
    <text x="8" y="64" font-size="7.5" font-weight="700" fill="#2563eb">FK paid_by_id: BigInt</text>
    <text x="8" y="78" font-size="7.5" fill="#334155">amount: Decimal(12,2)</text>
    <text x="8" y="92" font-size="7.5" fill="#334155">category: VarChar(40)</text>
    <text x="8" y="106" font-size="7.5" fill="#334155">payment_method: VarChar(40)</text>
    <text x="8" y="120" font-size="7.5" fill="#334155">paid_at: DateTime</text>
  </g>

  <!-- EXPENSE_SPLITS -->
  <g transform="translate(25, 205)">
    <rect x="0" y="0" width="180" height="110" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="180" height="22" fill="#0f172a" rx="4"/>
    <text x="90" y="15" font-size="9.5" font-weight="700" fill="#ffffff" text-anchor="middle">expense_splits</text>
    <text x="8" y="36" font-size="7.5" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="8" y="50" font-size="7.5" font-weight="700" fill="#2563eb">FK expense_id: BigInt</text>
    <text x="8" y="64" font-size="7.5" font-weight="700" fill="#2563eb">FK user_id: BigInt</text>
    <text x="8" y="78" font-size="7.5" fill="#334155">share_amount: Decimal(12,2)</text>
  </g>

  <!-- RECEIPTS -->
  <g transform="translate(585, 205)">
    <rect x="0" y="0" width="205" height="120" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="205" height="22" fill="#0f172a" rx="4"/>
    <text x="102" y="15" font-size="9.5" font-weight="700" fill="#ffffff" text-anchor="middle">receipts</text>
    <text x="8" y="36" font-size="7.5" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="8" y="50" font-size="7.5" font-weight="700" fill="#2563eb">FK expense_id: BigInt [UQ]</text>
    <text x="8" y="64" font-size="7.5" fill="#334155">image: VarChar(100)</text>
    <text x="8" y="78" font-size="7.5" font-weight="700" fill="#2563eb">FK verified_by_id: BigInt</text>
    <text x="8" y="92" font-size="7.5" fill="#334155">verified_at: DateTime</text>
  </g>

  <!-- EXPENSE_LIMITS -->
  <g transform="translate(25, 385)">
    <rect x="0" y="0" width="180" height="110" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="180" height="22" fill="#0f172a" rx="4"/>
    <text x="90" y="15" font-size="9.5" font-weight="700" fill="#ffffff" text-anchor="middle">expense_limits</text>
    <text x="8" y="36" font-size="7.5" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="8" y="50" font-size="7.5" font-weight="700" fill="#2563eb">FK user_id: BigInt</text>
    <text x="8" y="64" font-size="7.5" font-weight="700" fill="#2563eb">FK tour_id: BigInt</text>
    <text x="8" y="78" font-size="7.5" fill="#334155">amount: Decimal(12,2)</text>
    <text x="8" y="92" font-size="7.5" fill="#334155">last_notified: Boolean</text>
  </g>

  <!-- NOTIFICATIONS -->
  <g transform="translate(295, 385)">
    <rect x="0" y="0" width="205" height="110" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="205" height="22" fill="#0f172a" rx="4"/>
    <text x="102" y="15" font-size="9.5" font-weight="700" fill="#ffffff" text-anchor="middle">notifications</text>
    <text x="8" y="36" font-size="7.5" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="8" y="50" font-size="7.5" font-weight="700" fill="#2563eb">FK recipient_id: BigInt</text>
    <text x="8" y="64" font-size="7.5" fill="#334155">type, title, message</text>
    <text x="8" y="78" font-size="7.5" fill="#334155">is_read: Boolean</text>
  </g>

  <!-- Crow's foot connections -->
  <line x1="205" y1="80" x2="295" y2="80" stroke="#64748b" stroke-width="1.5"/>
  <line x1="500" y1="80" x2="585" y2="80" stroke="#64748b" stroke-width="1.5"/>
  <line x1="397" y1="160" x2="397" y2="205" stroke="#64748b" stroke-width="1.5"/>
  <line x1="295" y1="260" x2="205" y2="260" stroke="#64748b" stroke-width="1.5"/>
  <line x1="500" y1="260" x2="585" y2="260" stroke="#64748b" stroke-width="1.5"/>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-4: Pay-Together Relational Entity-Relationship (ER) Schema Diagram</div>
</div>
`;

// SVG 6: Offline State Machine
const SVG_STATEMACHINE = `
<div class="figure-box" style="margin:20px 0; text-align:center;">
<svg viewBox="0 0 820 330" width="100%" height="330" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="820" height="330" fill="#f8fafc" rx="8"/>

  <circle cx="45" cy="100" r="12" fill="#0f172a"/>
  
  <rect x="95" y="78" width="135" height="44" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="162" y="104" font-size="9" font-weight="700" fill="#1e40af" text-anchor="middle">Expense Submitted</text>

  <polygon points="310,100 355,70 400,100 355,130" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="355" y="103" font-size="8" font-weight="700" fill="#92400e" text-anchor="middle">Online?</text>

  <rect x="520" y="35" width="150" height="44" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
  <text x="595" y="61" font-size="9" font-weight="700" fill="#065f46" text-anchor="middle">Direct POST /api/create/</text>

  <rect x="280" y="195" width="150" height="44" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
  <text x="355" y="215" font-size="8.5" font-weight="700" fill="#991b1b" text-anchor="middle">Queue to LocalStorage</text>
  <text x="355" y="228" font-size="7" fill="#7f1d1d" text-anchor="middle">(pt_offline_pending_v1)</text>

  <rect x="520" y="195" width="150" height="44" rx="6" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/>
  <text x="595" y="215" font-size="8.5" font-weight="700" fill="#92400e" text-anchor="middle">Awaiting Reconnection</text>
  <text x="595" y="228" font-size="7" fill="#78350f" text-anchor="middle">(15s Heartbeat Polling)</text>

  <rect x="520" y="115" width="150" height="44" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="595" y="135" font-size="8.5" font-weight="700" fill="#1e40af" text-anchor="middle">POST /api/offline/sync/</text>
  <text x="595" y="148" font-size="7" fill="#1e3a8a" text-anchor="middle">(Batch Deduplication)</text>

  <circle cx="760" cy="60" r="15" fill="none" stroke="#10b981" stroke-width="3"/>
  <circle cx="760" cy="60" r="9" fill="#10b981"/>
  <text x="760" y="92" font-size="8.5" font-weight="700" fill="#065f46" text-anchor="middle">Synchronized</text>

  <line x1="57" y1="100" x2="95" y2="100" stroke="#475569" stroke-width="1.5"/>
  <line x1="230" y1="100" x2="310" y2="100" stroke="#475569" stroke-width="1.5"/>
  <line x1="355" y1="70" x2="355" y2="57" stroke="#10b981" stroke-width="1.5"/>
  <line x1="355" y1="57" x2="520" y2="57" stroke="#10b981" stroke-width="1.5"/>
  <text x="435" y="52" font-size="7.5" font-weight="700" fill="#047857">[Yes - Online]</text>
  <line x1="670" y1="57" x2="745" y2="58" stroke="#10b981" stroke-width="1.5"/>

  <line x1="355" y1="130" x2="355" y2="195" stroke="#ef4444" stroke-width="1.5"/>
  <text x="360" y="165" font-size="7.5" font-weight="700" fill="#b91c1c">[No - Offline]</text>
  <line x1="430" y1="217" x2="520" y2="217" stroke="#d97706" stroke-width="1.5"/>

  <line x1="595" y1="195" x2="595" y2="159" stroke="#2563eb" stroke-width="1.5"/>
  <text x="600" y="180" font-size="7.5" font-weight="700" fill="#1d4ed8">['online' event]</text>

  <line x1="670" y1="137" x2="720" y2="137" stroke="#10b981" stroke-width="1.5"/>
  <line x1="720" y1="137" x2="750" y2="74" stroke="#10b981" stroke-width="1.5"/>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-5: Offline Expense Synchronization State Machine Diagram</div>
</div>
`;

// SVG 7: Prototype UI Mockups (Appendix C)
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
    <text x="30" y="86" font-size="8" fill="#334155">Category: Food & Dining</text>
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
    <text x="20" y="85" font-size="7.5" fill="#1e293b">Babar Khan (Debtor):</text><text x="330" y="85" font-size="7.5" font-weight="700" fill="#dc2626" text-anchor="end">-$14,500</text>
    <text x="20" y="105" font-size="7.5" fill="#1e293b">Hamza Butt (Debtor):</text><text x="330" y="105" font-size="7.5" font-weight="700" fill="#dc2626" text-anchor="end">-$10,000</text>
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
// EXACT INJECTION INTO CHAPTERS
// -------------------------------------------------------------

// 1. Inject Figure 1-1 into Section 1.10
html = html.replace(
  /<h2>1\.10 Project Deliverables & Planning<\/h2>[\s\S]*?<p>The primary project deliverables include:/,
  `<h2>1.10 Project Deliverables & Planning</h2>
  <p>The project was executed across an intensive 15-week milestone roadmap encompassing requirements engineering, relational modeling, service implementation, offline synchronization, and verification:</p>
  ${SVG_GANTT}
  <p>The primary project deliverables include:`
);

// 2. Inject Figure 2-1 into Section 2.2
html = html.replace(
  /<h2>2\.2 Functional Requirements \(FR-01 to FR-15\)<\/h2>/,
  `<h2>2.2 Use Case Architecture Model</h2>
  <p>The platform use case model establishes clear actor boundaries between unauthenticated guests, registered users, active tour participants, tour creators, and administrative moderators:</p>
  ${SVG_USECASE}
  <h2>2.3 Functional Requirements (FR-01 to FR-15)</h2>`
);

// 3. Inject Figure 3-2 Sequence & Figure 3-3 Architecture in Chapter 3
html = html.replace(
  /<h2>3\.3 Complete Data Dictionary<\/h2>/,
  `<h2>3.2.2 Add Expense Interaction &amp; Limit Checking Sequence Model</h2>
  <p>The sequence diagram illustrates synchronous request dispatch, database persistence, edge-triggered spending threshold comparison, and notification delivery:</p>
  ${SVG_SEQUENCE}
  <h2>3.3 Multi-Tier System Architecture</h2>
  <p>The system is organized into three distinct tiers: Client Browser Presentation, Application Service Tier (Django & DRF), and Relational Data Persistence with media assets:</p>
  ${SVG_ARCH}
  <h2>3.4 Complete Data Dictionary</h2>`
);

// 4. Inject Figure 3-4 ERD in Section 3.4
html = html.replace(
  /<div class="table-title">Table 3-1: Database Data Dictionary<\/div>/,
  `<h2>3.4.1 Relational Entity-Relationship (ER) Schema Model</h2>
  <p>The entity-relationship model specifies foreign key constraints, primary keys, and table associations across the Pay-Together relational schema:</p>
  ${SVG_ERD}
  <div class="table-title">Table 3-1: Database Data Dictionary</div>`
);

// 5. Inject Figure 3-5 in Section 3.6 (or after Chapter 3)
html = html.replace(
  /<h2>Chapter 4: Implementation<\/h2>/,
  `<h2>3.5 Behavioural State Model: Offline Expense Synchronization</h2>
  <p>The state machine tracks transaction lifecycles through client-side offline caching, network detection, and idempotent batch synchronization:</p>
  ${SVG_STATEMACHINE}
  <h2>Chapter 4: Implementation</h2>`
);

// 6. Inject Figure C-1 in Appendix C
html = html.replace(
  /<h2>Appendix B & C: Standards & Application Prototype<\/h2>[\s\S]*?<ol>/,
  `<h2>Appendix B & C: Standards & Application Prototype</h2>
  <p>The Pay-Together platform includes 14 responsive interfaces. The vector wireframes below illustrate the Tour Workspace Dashboard, Add Expense Modal, Settlement Reconciliation, and Chart.js Category Analytics:</p>
  ${SVG_PROTOTYPE}
  <ol>`
);

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log("HTML successfully enriched with ALL 7 full SVG diagrams!");

// Compile PDF via Headless Chrome
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputPdf = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.pdf');

console.log("Compiling publication PDF with all diagrams...");
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
  const sizeKb = (fs.statSync(outputPdf).size / 1024).toFixed(1);
  console.log(`SUCCESS! Generated PDF with ALL diagrams: ${outputPdf} (${sizeKb} KB)`);
  
  // Also copy to Downloads root
  const downloadsPdf = 'C:\\Users\\muham\\Downloads\\Pay_Together_FYP_Documentation.pdf';
  fs.copyFileSync(outputPdf, downloadsPdf);
  console.log(`Copied updated PDF to root Downloads: ${downloadsPdf}`);
} else {
  console.error("PDF generation failed.");
}
