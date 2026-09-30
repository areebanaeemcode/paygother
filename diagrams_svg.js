// diagrams_svg.js - All 14 Vector SVG Diagrams for Pay-Together 50-Page FYP Report

const SVG_WBS = `
<div class="figure-box">
<svg viewBox="0 0 850 360" width="100%" height="360" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="360" fill="#f8fafc" rx="8"/>
  
  <!-- Level 1 Root -->
  <rect x="300" y="15" width="250" height="40" rx="6" fill="#1e3a8a" stroke="#1d4ed8" stroke-width="2"/>
  <text x="425" y="39" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">PAY-TOGETHER PLATFORM</text>

  <!-- Trunk line -->
  <line x1="425" y1="55" x2="425" y2="85" stroke="#475569" stroke-width="2"/>
  <line x1="75" y1="85" x2="775" y2="85" stroke="#475569" stroke-width="2"/>

  <!-- Level 2 Packages -->
  <!-- 1. Requirements -->
  <line x1="75" y1="85" x2="75" y2="105" stroke="#475569" stroke-width="1.5"/>
  <rect x="10" y="105" width="130" height="34" rx="4" fill="#3b82f6"/>
  <text x="75" y="126" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">1. Requirements</text>

  <!-- 2. System Design -->
  <line x1="215" y1="85" x2="215" y2="105" stroke="#475569" stroke-width="1.5"/>
  <rect x="150" y="105" width="130" height="34" rx="4" fill="#3b82f6"/>
  <text x="215" y="126" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">2. System Design</text>

  <!-- 3. Backend & Core -->
  <line x1="355" y1="85" x2="355" y2="105" stroke="#475569" stroke-width="1.5"/>
  <rect x="290" y="105" width="130" height="34" rx="4" fill="#10b981"/>
  <text x="355" y="126" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">3. Backend Engine</text>

  <!-- 4. Frontend & UI -->
  <line x1="495" y1="85" x2="495" y2="105" stroke="#475569" stroke-width="1.5"/>
  <rect x="430" y="105" width="130" height="34" rx="4" fill="#10b981"/>
  <text x="495" y="126" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">4. Frontend Client</text>

  <!-- 5. Verification -->
  <line x1="635" y1="85" x2="635" y2="105" stroke="#475569" stroke-width="1.5"/>
  <rect x="570" y="105" width="130" height="34" rx="4" fill="#8b5cf6"/>
  <text x="635" y="126" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">5. Verification (QA)</text>

  <!-- 6. Deployment -->
  <line x1="775" y1="85" x2="775" y2="105" stroke="#475569" stroke-width="1.5"/>
  <rect x="710" y="105" width="130" height="34" rx="4" fill="#ef4444"/>
  <text x="775" y="126" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">6. Deployment</text>

  <!-- Level 3 Work Items -->
  <!-- Col 1 -->
  <g transform="translate(10, 150)">
    <rect x="0" y="0" width="130" height="190" fill="#ffffff" rx="4" stroke="#cbd5e1"/>
    <text x="8" y="20" font-size="7.5" font-weight="600" fill="#334155">1.1 Domain Analysis</text>
    <text x="8" y="42" font-size="7.5" font-weight="600" fill="#334155">1.2 Stakeholder Survey</text>
    <text x="8" y="64" font-size="7.5" font-weight="600" fill="#334155">1.3 SRS Documentation</text>
    <text x="8" y="86" font-size="7.5" font-weight="600" fill="#334155">1.4 FR-01 to FR-15 Spec</text>
    <text x="8" y="108" font-size="7.5" font-weight="600" fill="#334155">1.5 NFR Specifications</text>
    <text x="8" y="130" font-size="7.5" font-weight="600" fill="#334155">1.6 Feasibility Study</text>
  </g>

  <!-- Col 2 -->
  <g transform="translate(150, 150)">
    <rect x="0" y="0" width="130" height="190" fill="#ffffff" rx="4" stroke="#cbd5e1"/>
    <text x="8" y="20" font-size="7.5" font-weight="600" fill="#334155">2.1 Use Case Model</text>
    <text x="8" y="42" font-size="7.5" font-weight="600" fill="#334155">2.2 Class Diagram</text>
    <text x="8" y="64" font-size="7.5" font-weight="600" fill="#334155">2.3 Sequence Models</text>
    <text x="8" y="86" font-size="7.5" font-weight="600" fill="#334155">2.4 ER Schema Design</text>
    <text x="8" y="108" font-size="7.5" font-weight="600" fill="#334155">2.5 State Machines</text>
    <text x="8" y="130" font-size="7.5" font-weight="600" fill="#334155">2.6 Data Dictionary</text>
  </g>

  <!-- Col 3 -->
  <g transform="translate(290, 150)">
    <rect x="0" y="0" width="130" height="190" fill="#ffffff" rx="4" stroke="#cbd5e1"/>
    <text x="8" y="20" font-size="7.5" font-weight="600" fill="#334155">3.1 Django 6.0 Setup</text>
    <text x="8" y="42" font-size="7.5" font-weight="600" fill="#334155">3.2 Auth & JWT Provider</text>
    <text x="8" y="64" font-size="7.5" font-weight="600" fill="#334155">3.3 Tour & Token Logic</text>
    <text x="8" y="86" font-size="7.5" font-weight="600" fill="#334155">3.4 Expense & Splits</text>
    <text x="8" y="108" font-size="7.5" font-weight="600" fill="#334155">3.5 Greedy Settlement</text>
    <text x="8" y="130" font-size="7.5" font-weight="600" fill="#334155">3.6 Limit Engine & Sync</text>
  </g>

  <!-- Col 4 -->
  <g transform="translate(430, 150)">
    <rect x="0" y="0" width="130" height="190" fill="#ffffff" rx="4" stroke="#cbd5e1"/>
    <text x="8" y="20" font-size="7.5" font-weight="600" fill="#334155">4.1 Tailwind Layouts</text>
    <text x="8" y="42" font-size="7.5" font-weight="600" fill="#334155">4.2 Modular JS Views</text>
    <text x="8" y="64" font-size="7.5" font-weight="600" fill="#334155">4.3 Offline LocalStorage</text>
    <text x="8" y="86" font-size="7.5" font-weight="600" fill="#334155">4.4 Chart.js Telemetry</text>
    <text x="8" y="108" font-size="7.5" font-weight="600" fill="#334155">4.5 Receipt Lightbox</text>
    <text x="8" y="130" font-size="7.5" font-weight="600" fill="#334155">4.6 Dynamic Modals</text>
  </g>

  <!-- Col 5 -->
  <g transform="translate(570, 150)">
    <rect x="0" y="0" width="130" height="190" fill="#ffffff" rx="4" stroke="#cbd5e1"/>
    <text x="8" y="20" font-size="7.5" font-weight="600" fill="#334155">5.1 Unit Tests (UT 1-8)</text>
    <text x="8" y="42" font-size="7.5" font-weight="600" fill="#334155">5.2 Functional Tests</text>
    <text x="8" y="64" font-size="7.5" font-weight="600" fill="#334155">5.3 Integration Tests</text>
    <text x="8" y="86" font-size="7.5" font-weight="600" fill="#334155">5.4 Latency Benchmark</text>
    <text x="8" y="108" font-size="7.5" font-weight="600" fill="#334155">5.5 Security Penetration</text>
    <text x="8" y="130" font-size="7.5" font-weight="600" fill="#334155">5.6 RTM Validation</text>
  </g>

  <!-- Col 6 -->
  <g transform="translate(710, 150)">
    <rect x="0" y="0" width="130" height="190" fill="#ffffff" rx="4" stroke="#cbd5e1"/>
    <text x="8" y="20" font-size="7.5" font-weight="600" fill="#334155">6.1 Nginx SSL Proxy</text>
    <text x="8" y="42" font-size="7.5" font-weight="600" fill="#334155">6.2 Gunicorn Workers</text>
    <text x="8" y="64" font-size="7.5" font-weight="600" fill="#334155">6.3 Media Storage</text>
    <text x="8" y="86" font-size="7.5" font-weight="600" fill="#334155">6.4 DB Migration</text>
    <text x="8" y="108" font-size="7.5" font-weight="600" fill="#334155">6.5 Operations Manual</text>
    <text x="8" y="130" font-size="7.5" font-weight="600" fill="#334155">6.6 Post-Launch Smoke</text>
  </g>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 1-1: Pay-Together Hierarchical Work Breakdown Structure (WBS)</div>
</div>
`;

const SVG_GANTT = `
<div class="figure-box">
<svg viewBox="0 0 850 330" width="100%" height="330" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <defs>
    <linearGradient id="gBlue" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient>
    <linearGradient id="gGreen" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#059669"/></linearGradient>
    <linearGradient id="gPurple" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#6d28d9"/></linearGradient>
    <linearGradient id="gAmber" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/></linearGradient>
    <linearGradient id="gRed" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#dc2626"/></linearGradient>
  </defs>

  <rect x="0" y="0" width="850" height="330" fill="#f8fafc" rx="8"/>
  <rect x="220" y="14" width="605" height="26" fill="#e2e8f0" rx="4"/>
  <text x="20" y="32" font-size="11" font-weight="700" fill="#1e293b">Project Work Packages (15 Weeks)</text>
  ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((w, i) => `
    <text x="${235 + i * 40}" y="31" font-size="9" font-weight="700" fill="#475569" text-anchor="middle">W${w}</text>
    <line x1="${220 + i * 40}" y1="40" x2="${220 + i * 40}" y2="315" stroke="#cbd5e1" stroke-dasharray="2,2"/>
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
    <rect x="15" y="${48 + i * 24}" width="195" height="20" fill="#ffffff" rx="3" stroke="#e2e8f0"/>
    <text x="22" y="${62 + i * 24}" font-size="8" font-weight="600" fill="#334155">${t.name}</text>
    <rect x="${222 + t.start * 40}" y="${50 + i * 24}" width="${t.span * 40 - 4}" height="16" rx="4" fill="${t.fill}"/>
  `).join('')}
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 1-2: Pay-Together Project Lifecycle Gantt Schedule (15 Weeks)</div>
</div>
`;

const SVG_USECASE = `
<div class="figure-box">
<svg viewBox="0 0 850 520" width="100%" height="520" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="520" fill="#f8fafc" rx="8"/>
  <rect x="230" y="20" width="410" height="480" fill="#ffffff" rx="8" stroke="#2563eb" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="435" y="44" font-size="13" font-weight="800" fill="#1e3a8a" text-anchor="middle">PAY-TOGETHER PLATFORM BOUNDARY</text>

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
  <g transform="translate(730, 130)">
    <circle cx="30" cy="18" r="14" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <line x1="30" y1="32" x2="30" y2="68" stroke="#b45309" stroke-width="2"/>
    <line x1="12" y1="46" x2="48" y2="46" stroke="#b45309" stroke-width="2"/>
    <line x1="30" y1="68" x2="16" y2="96" stroke="#b45309" stroke-width="2"/>
    <line x1="30" y1="68" x2="44" y2="96" stroke="#b45309" stroke-width="2"/>
    <text x="30" y="116" font-size="10" font-weight="700" fill="#1e293b" text-anchor="middle">Tour Creator</text>
  </g>

  <g transform="translate(730, 330)">
    <circle cx="30" cy="18" r="14" fill="#fee2e2" stroke="#b91c1c" stroke-width="2"/>
    <line x1="30" y1="32" x2="30" y2="68" stroke="#b91c1c" stroke-width="2"/>
    <line x1="12" y1="46" x2="48" y2="46" stroke="#b91c1c" stroke-width="2"/>
    <line x1="30" y1="68" x2="16" y2="96" stroke="#b91c1c" stroke-width="2"/>
    <line x1="30" y1="68" x2="44" y2="96" stroke="#b91c1c" stroke-width="2"/>
    <text x="30" y="116" font-size="10" font-weight="700" fill="#1e293b" text-anchor="middle">System Admin</text>
  </g>

  <!-- Use Case Ovals -->
  ${[
    { id: "UC-01", name: "Register Account", y: 70, cx: 330 },
    { id: "UC-02", name: "Login & Authenticate", y: 110, cx: 330 },
    { id: "UC-03", name: "Create Tour Workspace", y: 155, cx: 360 },
    { id: "UC-04", name: "Join Tour via Token", y: 200, cx: 360 },
    { id: "UC-05", name: "Add Expense & Splits", y: 250, cx: 435 },
    { id: "UC-06", name: "Set Personal Limit", y: 295, cx: 435 },
    { id: "UC-07", name: "View Category Analytics", y: 340, cx: 435 },
    { id: "UC-08", name: "View Settlement & Balances", y: 385, cx: 435 },
    { id: "UC-09", name: "Upload & Verify Receipt", y: 430, cx: 435 },
    { id: "UC-10", name: "Record Offline & Auto-Sync", y: 475, cx: 435 },
    { id: "UC-11", name: "Manage Members & Status", y: 155, cx: 535 },
    { id: "UC-12", name: "Admin Telemetry & Gate", y: 385, cx: 535 },
  ].map(u => `
    <ellipse cx="${u.cx}" cy="${u.y}" rx="82" ry="17" fill="#f1f5f9" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="${u.cx}" y="${u.y + 4}" font-size="8.5" font-weight="600" fill="#0f172a" text-anchor="middle">${u.id}: ${u.name}</text>
  `).join('')}

  <!-- Associations -->
  <line x1="95" y1="130" x2="250" y2="70" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="95" y1="130" x2="250" y2="110" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="95" y1="130" x2="280" y2="155" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="95" y1="130" x2="280" y2="200" stroke="#94a3b8" stroke-width="1.2"/>

  <line x1="95" y1="340" x2="355" y2="250" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="95" y1="340" x2="355" y2="295" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="95" y1="340" x2="355" y2="340" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="95" y1="340" x2="355" y2="385" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="95" y1="340" x2="355" y2="430" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="95" y1="340" x2="355" y2="475" stroke="#94a3b8" stroke-width="1.2"/>

  <line x1="720" y1="170" x2="440" y2="155" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="720" y1="170" x2="615" y2="155" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="720" y1="170" x2="515" y2="430" stroke="#94a3b8" stroke-width="1.2"/>

  <line x1="720" y1="370" x2="615" y2="385" stroke="#94a3b8" stroke-width="1.2"/>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 2-1: Pay-Together Comprehensive UML Use Case Diagram</div>
</div>
`;

const SVG_CLASS = `
<div class="figure-box">
<svg viewBox="0 0 850 490" width="100%" height="490" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="490" fill="#f8fafc" rx="8"/>

  <!-- Class: User -->
  <g transform="translate(25, 20)">
    <rect x="0" y="0" width="230" height="150" fill="#ffffff" rx="6" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="0" y="0" width="230" height="24" fill="#eff6ff" rx="6"/>
    <text x="115" y="16" font-size="10" font-weight="700" fill="#1e40af" text-anchor="middle">User (AbstractUser)</text>
    <line x1="0" y1="24" x2="230" y2="24" stroke="#bfdbfe"/>
    <text x="10" y="40" font-size="7.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="55" font-size="7.5" fill="#334155">+ email: String (Unique)</text>
    <text x="10" y="70" font-size="7.5" fill="#334155">+ phone_number: String</text>
    <text x="10" y="85" font-size="7.5" fill="#334155">+ first_name, last_name: String</text>
    <text x="10" y="100" font-size="7.5" fill="#334155">+ password: Hash (PBKDF2)</text>
    <line x1="0" y1="108" x2="230" y2="108" stroke="#e2e8f0"/>
    <text x="10" y="124" font-size="7.5" font-weight="600" fill="#2563eb">+ get_full_name(): String</text>
    <text x="10" y="139" font-size="7.5" font-weight="600" fill="#2563eb">+ check_password(): Boolean</text>
  </g>

  <!-- Class: Tour -->
  <g transform="translate(320, 20)">
    <rect x="0" y="0" width="230" height="150" fill="#ffffff" rx="6" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="0" y="0" width="230" height="24" fill="#eff6ff" rx="6"/>
    <text x="115" y="16" font-size="10" font-weight="700" fill="#1e40af" text-anchor="middle">Tour</text>
    <line x1="0" y1="24" x2="230" y2="24" stroke="#bfdbfe"/>
    <text x="10" y="40" font-size="7.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="55" font-size="7.5" fill="#334155">+ title, destination: String</text>
    <text x="10" y="70" font-size="7.5" fill="#334155">+ budget: Decimal(12,2)</text>
    <text x="10" y="85" font-size="7.5" fill="#334155">+ start_date, end_date: Date</text>
    <text x="10" y="100" font-size="7.5" fill="#334155">+ join_token: String(6) [Unique]</text>
    <line x1="0" y1="108" x2="230" y2="108" stroke="#e2e8f0"/>
    <text x="10" y="124" font-size="7.5" font-weight="600" fill="#2563eb">+ is_member(user): Boolean</text>
    <text x="10" y="139" font-size="7.5" font-weight="600" fill="#2563eb">+ total_spent(): Decimal</text>
  </g>

  <!-- Class: TourMember -->
  <g transform="translate(610, 20)">
    <rect x="0" y="0" width="215" height="120" fill="#ffffff" rx="6" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="0" y="0" width="215" height="24" fill="#eff6ff" rx="6"/>
    <text x="107" y="16" font-size="10" font-weight="700" fill="#1e40af" text-anchor="middle">TourMember</text>
    <line x1="0" y1="24" x2="215" y2="24" stroke="#bfdbfe"/>
    <text x="10" y="42" font-size="7.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="60" font-size="7.5" fill="#334155">+ tour_id: FK(Tour)</text>
    <text x="10" y="78" font-size="7.5" fill="#334155">+ user_id: FK(User)</text>
    <text x="10" y="96" font-size="7.5" fill="#334155">+ role: 'creator' | 'member'</text>
    <text x="10" y="114" font-size="7.5" fill="#334155">+ joined_at: DateTime</text>
  </g>

  <!-- Class: Expense -->
  <g transform="translate(320, 220)">
    <rect x="0" y="0" width="230" height="140" fill="#ffffff" rx="6" stroke="#059669" stroke-width="1.5"/>
    <rect x="0" y="0" width="230" height="24" fill="#ecfdf5" rx="6"/>
    <text x="115" y="16" font-size="10" font-weight="700" fill="#065f46" text-anchor="middle">Expense</text>
    <line x1="0" y1="24" x2="230" y2="24" stroke="#a7f3d0"/>
    <text x="10" y="40" font-size="7.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="55" font-size="7.5" fill="#334155">+ tour_id: FK(Tour)</text>
    <text x="10" y="70" font-size="7.5" fill="#334155">+ paid_by_id: FK(User)</text>
    <text x="10" y="85" font-size="7.5" fill="#334155">+ amount: Decimal(12,2)</text>
    <text x="10" y="100" font-size="7.5" fill="#334155">+ category: Enum(Transport,...)</text>
    <text x="10" y="115" font-size="7.5" fill="#334155">+ payment_method: Enum</text>
    <text x="10" y="130" font-size="7.5" fill="#334155">+ paid_at, created_at: DateTime</text>
  </g>

  <!-- Class: ExpenseSplit -->
  <g transform="translate(25, 230)">
    <rect x="0" y="0" width="230" height="100" fill="#ffffff" rx="6" stroke="#059669" stroke-width="1.5"/>
    <rect x="0" y="0" width="230" height="24" fill="#ecfdf5" rx="6"/>
    <text x="115" y="16" font-size="10" font-weight="700" fill="#065f46" text-anchor="middle">ExpenseSplit</text>
    <line x1="0" y1="24" x2="230" y2="24" stroke="#a7f3d0"/>
    <text x="10" y="44" font-size="7.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="62" font-size="7.5" fill="#334155">+ expense_id: FK(Expense)</text>
    <text x="10" y="80" font-size="7.5" fill="#334155">+ user_id: FK(User)</text>
    <text x="10" y="98" font-size="7.5" fill="#334155">+ share_amount: Decimal(12,2)</text>
  </g>

  <!-- Class: Receipt -->
  <g transform="translate(610, 230)">
    <rect x="0" y="0" width="215" height="110" fill="#ffffff" rx="6" stroke="#059669" stroke-width="1.5"/>
    <rect x="0" y="0" width="215" height="24" fill="#ecfdf5" rx="6"/>
    <text x="107" y="16" font-size="10" font-weight="700" fill="#065f46" text-anchor="middle">Receipt</text>
    <line x1="0" y1="24" x2="215" y2="24" stroke="#a7f3d0"/>
    <text x="10" y="42" font-size="7.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="58" font-size="7.5" fill="#334155">+ expense_id: OneToOne(Expense)</text>
    <text x="10" y="74" font-size="7.5" fill="#334155">+ image: ImageField</text>
    <text x="10" y="90" font-size="7.5" fill="#334155">+ verified_at: DateTime</text>
    <text x="10" y="106" font-size="7.5" font-weight="600" fill="#059669">+ mark_verified(user)</text>
  </g>

  <!-- Class: ExpenseLimit -->
  <g transform="translate(25, 380)">
    <rect x="0" y="0" width="230" height="95" fill="#ffffff" rx="6" stroke="#d97706" stroke-width="1.5"/>
    <rect x="0" y="0" width="230" height="24" fill="#fffbeb" rx="6"/>
    <text x="115" y="16" font-size="10" font-weight="700" fill="#92400e" text-anchor="middle">ExpenseLimit</text>
    <line x1="0" y1="24" x2="230" y2="24" stroke="#fde68a"/>
    <text x="10" y="44" font-size="7.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="60" font-size="7.5" fill="#334155">+ user_id: FK(User), tour_id: FK(Tour)</text>
    <text x="10" y="76" font-size="7.5" fill="#334155">+ amount: Decimal(12,2)</text>
    <text x="10" y="92" font-size="7.5" fill="#334155">+ last_notified_exceeded: Bool</text>
  </g>

  <!-- Class: Notification -->
  <g transform="translate(320, 380)">
    <rect x="0" y="0" width="230" height="95" fill="#ffffff" rx="6" stroke="#d97706" stroke-width="1.5"/>
    <rect x="0" y="0" width="230" height="24" fill="#fffbeb" rx="6"/>
    <text x="115" y="16" font-size="10" font-weight="700" fill="#92400e" text-anchor="middle">Notification</text>
    <line x1="0" y1="24" x2="230" y2="24" stroke="#fde68a"/>
    <text x="10" y="44" font-size="7.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="60" font-size="7.5" fill="#334155">+ recipient_id: FK(User)</text>
    <text x="10" y="76" font-size="7.5" fill="#334155">+ type: 'limit_exceeded',...</text>
    <text x="10" y="92" font-size="7.5" fill="#334155">+ is_read: Boolean</text>
  </g>

  <!-- Connectors & Multiplicities -->
  <line x1="255" y1="75" x2="320" y2="75" stroke="#475569" stroke-width="1.5"/>
  <text x="260" y="70" font-size="8" fill="#475569">1</text><text x="310" y="70" font-size="8" fill="#475569">*</text>

  <line x1="550" y1="75" x2="610" y2="75" stroke="#475569" stroke-width="1.5"/>
  <text x="555" y="70" font-size="8" fill="#475569">1</text><text x="600" y="70" font-size="8" fill="#475569">*</text>

  <line x1="435" y1="170" x2="435" y2="220" stroke="#475569" stroke-width="1.5"/>
  <text x="440" y="185" font-size="8" fill="#475569">1</text><text x="440" y="212" font-size="8" fill="#475569">*</text>

  <line x1="320" y1="280" x2="255" y2="280" stroke="#475569" stroke-width="1.5"/>
  <text x="305" y="275" font-size="8" fill="#475569">1</text><text x="265" y="275" font-size="8" fill="#475569">*</text>

  <line x1="550" y1="280" x2="610" y2="280" stroke="#475569" stroke-width="1.5"/>
  <text x="555" y="275" font-size="8" fill="#475569">1</text><text x="595" y="275" font-size="8" fill="#475569">0..1</text>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-1: Pay-Together Structural UML Class Diagram</div>
</div>
`;

const SVG_ARCH = `
<div class="figure-box">
<svg viewBox="0 0 850 420" width="100%" height="420" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="420" fill="#f8fafc" rx="8"/>

  <!-- Tier 1 -->
  <g transform="translate(25, 25)">
    <rect x="0" y="0" width="800" height="80" fill="#eff6ff" rx="6" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="20" y="22" font-size="11" font-weight="800" fill="#1e3a8a">TIER 1: PRESENTATION TIER (CLIENT BROWSER)</text>
    <rect x="20" y="32" width="170" height="34" fill="#ffffff" rx="4" stroke="#93c5fd"/>
    <text x="105" y="53" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">HTML5 &amp; Tailwind CSS</text>
    <rect x="210" y="32" width="190" height="34" fill="#ffffff" rx="4" stroke="#93c5fd"/>
    <text x="305" y="53" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">Vanilla JS Controllers</text>
    <rect x="420" y="32" width="170" height="34" fill="#ffffff" rx="4" stroke="#93c5fd"/>
    <text x="505" y="53" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">Chart.js Visualizations</text>
    <rect x="610" y="32" width="170" height="34" fill="#ffffff" rx="4" stroke="#93c5fd"/>
    <text x="695" y="53" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">Offline localStorage Queue</text>
  </g>

  <!-- Arrow T1 -> T2 -->
  <text x="425" y="128" font-size="8" font-weight="700" fill="#2563eb" text-anchor="middle">HTTPS / JSON REST API</text>
  <line x1="425" y1="105" x2="425" y2="140" stroke="#2563eb" stroke-width="1.5"/>

  <!-- Tier 2 -->
  <g transform="translate(25, 145)">
    <rect x="0" y="0" width="800" height="140" fill="#ecfdf5" rx="6" stroke="#10b981" stroke-width="1.5"/>
    <text x="20" y="22" font-size="11" font-weight="800" fill="#065f46">TIER 2: APPLICATION SERVICE TIER (DJANGO 6.0 &amp; DRF)</text>
    
    <rect x="20" y="34" width="240" height="92" fill="#ffffff" rx="4" stroke="#a7f3d0"/>
    <text x="140" y="52" font-size="8.5" font-weight="700" fill="#065f46" text-anchor="middle">Security &amp; Gate Layer</text>
    <text x="30" y="70" font-size="7.5" fill="#334155">&bull; AdminAccessPassMiddleware</text>
    <text x="30" y="85" font-size="7.5" fill="#334155">&bull; SimpleJWT Bearer Authentication</text>
    <text x="30" y="100" font-size="7.5" fill="#334155">&bull; Session Cookie &amp; CSRF Defense</text>
    <text x="30" y="115" font-size="7.5" fill="#334155">&bull; IsTourMember Permissions</text>

    <rect x="280" y="34" width="240" height="92" fill="#ffffff" rx="4" stroke="#a7f3d0"/>
    <text x="400" y="52" font-size="8.5" font-weight="700" fill="#065f46" text-anchor="middle">Business Engines</text>
    <text x="290" y="70" font-size="7.5" fill="#334155">&bull; Greedy Debt Minimization Engine</text>
    <text x="290" y="85" font-size="7.5" fill="#334155">&bull; Edge-Triggered Limit Service</text>
    <text x="290" y="100" font-size="7.5" fill="#334155">&bull; Smart Expense Keyword Classifier</text>
    <text x="290" y="115" font-size="7.5" fill="#334155">&bull; Alphanumeric Token Generator</text>

    <rect x="540" y="34" width="240" height="92" fill="#ffffff" rx="4" stroke="#a7f3d0"/>
    <text x="660" y="52" font-size="8.5" font-weight="700" fill="#065f46" text-anchor="middle">Controllers &amp; APIs</text>
    <text x="550" y="70" font-size="7.5" fill="#334155">&bull; TourListAPI / CreateTourAPI</text>
    <text x="550" y="85" font-size="7.5" fill="#334155">&bull; ExpenseCreateAPI / Splits</text>
    <text x="550" y="100" font-size="7.5" fill="#334155">&bull; OfflinePendingExpenseSyncAPI</text>
    <text x="550" y="115" font-size="7.5" fill="#334155">&bull; ReceiptUpload &amp; Verification</text>
  </g>

  <!-- Arrow T2 -> T3 -->
  <text x="425" y="306" font-size="8" font-weight="700" fill="#059669" text-anchor="middle">Django ORM / SQL</text>
  <line x1="425" y1="285" x2="425" y2="320" stroke="#059669" stroke-width="1.5"/>

  <!-- Tier 3 -->
  <g transform="translate(25, 325)">
    <rect x="0" y="0" width="800" height="75" fill="#faf5ff" rx="6" stroke="#9333ea" stroke-width="1.5"/>
    <text x="20" y="22" font-size="11" font-weight="800" fill="#6b21a8">TIER 3: DATA PERSISTENCE &amp; MEDIA STORAGE TIER</text>
    <rect x="20" y="32" width="370" height="30" fill="#ffffff" rx="4" stroke="#d8b4fe"/>
    <text x="205" y="51" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">Relational Database Engine (SQLite 3 / MySQL 8.0)</text>
    <rect x="410" y="32" width="370" height="30" fill="#ffffff" rx="4" stroke="#d8b4fe"/>
    <text x="595" y="51" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">Media Root Directory (/media/receipts/%Y/%m/)</text>
  </g>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-2: Pay-Together Multi-Tier Architecture Topology</div>
</div>
`;

const SVG_SEQ_EXPENSE = `
<div class="figure-box">
<svg viewBox="0 0 850 430" width="100%" height="430" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="430" fill="#f8fafc" rx="8"/>
  
  ${[
    { name: "Tour Member", x: 70 },
    { name: "UI (tour_detail.js)", x: 230 },
    { name: "ExpenseCreateAPI", x: 400 },
    { name: "Database (ORM)", x: 560 },
    { name: "LimitEngine", x: 700 },
    { name: "Notif Hub", x: 790 }
  ].map(p => `
    <rect x="${p.x - 52}" y="18" width="104" height="28" fill="#1e3a8a" rx="4"/>
    <text x="${p.x}" y="36" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">${p.name}</text>
    <line x1="${p.x}" y1="46" x2="${p.x}" y2="405" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>
  `).join('')}

  <line x1="70" y1="75" x2="230" y2="75" stroke="#2563eb" stroke-width="1.5"/>
  <text x="150" y="69" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">1. Fill &amp; Submit Expense Form</text>

  <line x1="230" y1="105" x2="400" y2="105" stroke="#2563eb" stroke-width="1.5"/>
  <text x="315" y="99" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">2. POST /api/create/ [JSON + JWT]</text>

  <line x1="400" y1="135" x2="560" y2="135" stroke="#2563eb" stroke-width="1.5"/>
  <text x="480" y="129" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">3. Insert Expense &amp; Splits</text>

  <rect x="555" y="135" width="10" height="35" fill="#93c5fd"/>
  <line x1="560" y1="170" x2="400" y2="170" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="480" y="165" font-size="7.5" fill="#64748b" text-anchor="middle">Expense Saved (ID: 42)</text>

  <line x1="400" y1="200" x2="700" y2="200" stroke="#2563eb" stroke-width="1.5"/>
  <text x="550" y="194" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">4. check_expense_limits_for_tour()</text>

  <line x1="700" y1="225" x2="560" y2="225" stroke="#2563eb" stroke-width="1.5"/>
  <text x="630" y="219" font-size="7.5" fill="#1e293b" text-anchor="middle">5. Sum(amount) for User</text>
  <line x1="560" y1="245" x2="700" y2="245" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="630" y="240" font-size="7.5" fill="#64748b" text-anchor="middle">Spent = $650, Limit = $500</text>

  <!-- Alt Box -->
  <rect x="365" y="265" width="460" height="80" fill="#fef2f2" stroke="#f87171" stroke-width="1" rx="4"/>
  <text x="375" y="280" font-size="8" font-weight="700" fill="#991b1b">[alt: Spent &gt; Limit AND last_notified_exceeded == False]</text>

  <line x1="700" y1="305" x2="790" y2="305" stroke="#ef4444" stroke-width="1.5"/>
  <text x="745" y="299" font-size="7.5" font-weight="600" fill="#991b1b" text-anchor="middle">Create Notif</text>
  <line x1="700" y1="330" x2="560" y2="330" stroke="#2563eb" stroke-width="1.5"/>
  <text x="630" y="325" font-size="7.5" fill="#1e293b" text-anchor="middle">last_notified = True</text>

  <line x1="400" y1="365" x2="230" y2="365" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="315" y="359" font-size="8" font-weight="600" fill="#047857" text-anchor="middle">HTTP 201 Created [Payload + Alert Flag]</text>

  <line x1="230" y1="390" x2="70" y2="390" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="150" y="384" font-size="8" font-weight="600" fill="#047857" text-anchor="middle">Update DOM Ledger &amp; Trigger Alert Banner</text>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-3: Add Expense and Edge-Triggered Limit Checking Sequence Diagram</div>
</div>
`;

const SVG_SEQ_TOKEN = `
<div class="figure-box">
<svg viewBox="0 0 850 380" width="100%" height="380" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="380" fill="#f8fafc" rx="8"/>

  ${[
    { name: "Invited User", x: 100 },
    { name: "Browser / Client JS", x: 300 },
    { name: "JoinTourAPI View", x: 500 },
    { name: "Tour / Member Models", x: 720 }
  ].map(p => `
    <rect x="${p.x - 70}" y="18" width="140" height="28" fill="#1e3a8a" rx="4"/>
    <text x="${p.x}" y="36" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">${p.name}</text>
    <line x1="${p.x}" y1="46" x2="${p.x}" y2="355" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>
  `).join('')}

  <line x1="100" y1="80" x2="300" y2="80" stroke="#2563eb" stroke-width="1.5"/>
  <text x="200" y="74" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">1. Input 6-char token (e.g. HUN102)</text>

  <line x1="300" y1="115" x2="500" y2="115" stroke="#2563eb" stroke-width="1.5"/>
  <text x="400" y="109" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">2. POST /api/tours/join/ { token: 'HUN102' }</text>

  <line x1="500" y1="150" x2="720" y2="150" stroke="#2563eb" stroke-width="1.5"/>
  <text x="610" y="144" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">3. Tour.objects.filter(join_token=token).first()</text>

  <line x1="720" y1="180" x2="500" y2="180" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="610" y="174" font-size="7.5" fill="#64748b" text-anchor="middle">Return Tour Instance (ID: 15)</text>

  <line x1="500" y1="215" x2="720" y2="215" stroke="#2563eb" stroke-width="1.5"/>
  <text x="610" y="209" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">4. TourMember.objects.get_or_create(tour, user)</text>

  <line x1="720" y1="245" x2="500" y2="245" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="610" y="239" font-size="7.5" fill="#64748b" text-anchor="middle">Created = True, Role = 'member'</text>

  <line x1="500" y1="285" x2="300" y2="285" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="400" y="279" font-size="8" font-weight="600" fill="#047857" text-anchor="middle">HTTP 200 OK { success: true, tour_id: 15 }</text>

  <line x1="300" y1="320" x2="100" y2="320" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="200" y="314" font-size="8" font-weight="600" fill="#047857" text-anchor="middle">Redirect to Tour Workspace Dashboard</text>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-4: Tour Join Token Onboarding Sequence Diagram</div>
</div>
`;

const SVG_SEQ_SYNC = `
<div class="figure-box">
<svg viewBox="0 0 850 400" width="100%" height="400" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="400" fill="#f8fafc" rx="8"/>

  ${[
    { name: "Browser App", x: 90 },
    { name: "localStorage Queue", x: 270 },
    { name: "Heartbeat Worker", x: 450 },
    { name: "Sync API Endpoint", x: 630 },
    { name: "Django DB Ledger", x: 770 }
  ].map(p => `
    <rect x="${p.x - 65}" y="18" width="130" height="28" fill="#1e3a8a" rx="4"/>
    <text x="${p.x}" y="36" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">${p.name}</text>
    <line x1="${p.x}" y1="46" x2="${p.x}" y2="375" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>
  `).join('')}

  <line x1="90" y1="75" x2="270" y2="75" stroke="#ef4444" stroke-width="1.5"/>
  <text x="180" y="69" font-size="8" font-weight="600" fill="#b91c1c" text-anchor="middle">1. Offline Catch: Save payload + client_uuid</text>

  <line x1="450" y1="110" x2="90" y2="110" stroke="#2563eb" stroke-width="1.5"/>
  <text x="270" y="104" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">2. Window 'online' event triggers flushQueue()</text>

  <line x1="90" y1="145" x2="270" y2="145" stroke="#2563eb" stroke-width="1.5"/>
  <text x="180" y="139" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">3. Read all pending entries</text>

  <line x1="90" y1="180" x2="630" y2="180" stroke="#2563eb" stroke-width="1.5"/>
  <text x="360" y="174" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">4. POST /api/offline/sync/ { batch: [p1, p2, ...], client_uuid }</text>

  <line x1="630" y1="215" x2="770" y2="215" stroke="#2563eb" stroke-width="1.5"/>
  <text x="700" y="209" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">5. Check UUID duplicates</text>

  <rect x="765" y="215" width="10" height="40" fill="#93c5fd"/>
  <line x1="770" y1="255" x2="630" y2="255" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="700" y="249" font-size="7.5" fill="#64748b" text-anchor="middle">Batch committed atomically</text>

  <line x1="630" y1="290" x2="90" y2="290" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="360" y="284" font-size="8" font-weight="600" fill="#047857" text-anchor="middle">6. HTTP 200 OK { synced_uuids: [u1, u2], count: 2 }</text>

  <line x1="90" y1="330" x2="270" y2="330" stroke="#10b981" stroke-width="1.5"/>
  <text x="180" y="324" font-size="8" font-weight="600" fill="#047857" text-anchor="middle">7. Filter and clear synced UUIDs from queue</text>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-5: Offline Transaction Queuing and Synchronization Sequence Diagram</div>
</div>
`;

const SVG_ERD = `
<div class="figure-box">
<svg viewBox="0 0 850 500" width="100%" height="500" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="500" fill="#f8fafc" rx="8"/>

  <!-- USERS Table -->
  <g transform="translate(30, 25)">
    <rect x="0" y="0" width="200" height="150" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="24" fill="#0f172a" rx="4"/>
    <text x="100" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">users</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" fill="#334155">email: VarChar(254) [UQ]</text>
    <text x="10" y="70" font-size="8" fill="#334155">phone_number: VarChar(15)</text>
    <text x="10" y="85" font-size="8" fill="#334155">first_name, last_name: Str</text>
    <text x="10" y="100" font-size="8" fill="#334155">password: VarChar(128)</text>
    <text x="10" y="115" font-size="8" fill="#334155">is_active: Boolean</text>
    <text x="10" y="130" font-size="8" fill="#334155">created_at: DateTime</text>
  </g>

  <!-- APPS_TOURS_TOUR Table -->
  <g transform="translate(325, 25)">
    <rect x="0" y="0" width="200" height="150" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="24" fill="#0f172a" rx="4"/>
    <text x="100" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">apps_tours_tour</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK created_by_id: BigInt</text>
    <text x="10" y="70" font-size="8" fill="#334155">title, destination: Str</text>
    <text x="10" y="85" font-size="8" fill="#334155">budget: Decimal(12,2)</text>
    <text x="10" y="100" font-size="8" fill="#334155">join_token: VarChar(64) [UQ]</text>
    <text x="10" y="115" font-size="8" fill="#334155">status: Enum(planned,...)</text>
    <text x="10" y="130" font-size="8" fill="#334155">start_date, end_date: Date</text>
  </g>

  <!-- APPS_TOURS_TOURMEMBER Table -->
  <g transform="translate(620, 25)">
    <rect x="0" y="0" width="200" height="130" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="24" fill="#0f172a" rx="4"/>
    <text x="100" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">apps_tours_tourmember</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK tour_id: BigInt</text>
    <text x="10" y="70" font-size="8" font-weight="700" fill="#2563eb">FK user_id: BigInt</text>
    <text x="10" y="85" font-size="8" fill="#334155">role: 'creator' | 'member'</text>
    <text x="10" y="100" font-size="8" fill="#334155">joined_at: DateTime</text>
  </g>

  <!-- EXPENSES Table -->
  <g transform="translate(325, 215)">
    <rect x="0" y="0" width="200" height="135" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="24" fill="#0f172a" rx="4"/>
    <text x="100" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">expenses</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK tour_id: BigInt</text>
    <text x="10" y="70" font-size="8" font-weight="700" fill="#2563eb">FK paid_by_id: BigInt</text>
    <text x="10" y="85" font-size="8" fill="#334155">amount: Decimal(12,2)</text>
    <text x="10" y="100" font-size="8" fill="#334155">category: VarChar(40)</text>
    <text x="10" y="115" font-size="8" fill="#334155">payment_method: VarChar(40)</text>
    <text x="10" y="130" font-size="8" fill="#334155">paid_at: DateTime</text>
  </g>

  <!-- EXPENSE_SPLITS Table -->
  <g transform="translate(30, 230)">
    <rect x="0" y="0" width="200" height="105" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="24" fill="#0f172a" rx="4"/>
    <text x="100" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">expense_splits</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK expense_id: BigInt</text>
    <text x="10" y="70" font-size="8" font-weight="700" fill="#2563eb">FK user_id: BigInt</text>
    <text x="10" y="85" font-size="8" fill="#334155">share_amount: Decimal(12,2)</text>
  </g>

  <!-- RECEIPTS Table -->
  <g transform="translate(620, 220)">
    <rect x="0" y="0" width="200" height="120" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="24" fill="#0f172a" rx="4"/>
    <text x="100" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">receipts</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK expense_id: BigInt [UQ]</text>
    <text x="10" y="70" font-size="8" fill="#334155">image: VarChar(100)</text>
    <text x="10" y="85" font-size="8" font-weight="700" fill="#2563eb">FK verified_by_id: BigInt</text>
    <text x="10" y="100" font-size="8" fill="#334155">verified_at: DateTime</text>
  </g>

  <!-- EXPENSE_LIMITS Table -->
  <g transform="translate(30, 385)">
    <rect x="0" y="0" width="200" height="95" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="24" fill="#0f172a" rx="4"/>
    <text x="100" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">expense_limits</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK user_id, tour_id: BigInt</text>
    <text x="10" y="70" font-size="8" fill="#334155">amount: Decimal(12,2)</text>
    <text x="10" y="85" font-size="8" fill="#334155">last_notified: Boolean</text>
  </g>

  <!-- NOTIFICATIONS Table -->
  <g transform="translate(325, 385)">
    <rect x="0" y="0" width="200" height="95" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="24" fill="#0f172a" rx="4"/>
    <text x="100" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">notifications</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK recipient_id, tour_id</text>
    <text x="10" y="70" font-size="8" fill="#334155">type, title, message</text>
    <text x="10" y="85" font-size="8" fill="#334155">is_read: Boolean</text>
  </g>

  <!-- Crow's foot connector lines -->
  <line x1="230" y1="85" x2="325" y2="85" stroke="#64748b" stroke-width="1.5"/>
  <line x1="525" y1="85" x2="620" y2="85" stroke="#64748b" stroke-width="1.5"/>
  <line x1="425" y1="175" x2="425" y2="215" stroke="#64748b" stroke-width="1.5"/>
  <line x1="325" y1="280" x2="230" y2="280" stroke="#64748b" stroke-width="1.5"/>
  <line x1="525" y1="280" x2="620" y2="280" stroke="#64748b" stroke-width="1.5"/>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-6: Pay-Together Relational Entity-Relationship (ER) Schema Diagram</div>
</div>
`;

const SVG_STATEMACHINE = `
<div class="figure-box">
<svg viewBox="0 0 850 330" width="100%" height="330" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="330" fill="#f8fafc" rx="8"/>

  <!-- Start State -->
  <circle cx="50" cy="90" r="14" fill="#0f172a"/>
  
  <!-- State 1: Form Submitted -->
  <rect x="100" y="68" width="140" height="44" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="170" y="94" font-size="9.5" font-weight="700" fill="#1e40af" text-anchor="middle">Expense Submitted</text>

  <!-- Decision Diamond: Connectivity -->
  <polygon points="310,90 355,58 400,90 355,122" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="355" y="93" font-size="8" font-weight="700" fill="#92400e" text-anchor="middle">Online?</text>

  <!-- Online Direct State -->
  <rect x="500" y="30" width="170" height="44" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
  <text x="585" y="56" font-size="9" font-weight="700" fill="#065f46" text-anchor="middle">Direct POST /api/create/</text>

  <!-- Offline Branch: Local Queue -->
  <rect x="275" y="190" width="165" height="44" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
  <text x="357" y="210" font-size="8.5" font-weight="700" fill="#991b1b" text-anchor="middle">Queue to LocalStorage</text>
  <text x="357" y="224" font-size="7" fill="#7f1d1d" text-anchor="middle">(pt_offline_pending_v1)</text>

  <!-- Awaiting Connection -->
  <rect x="500" y="190" width="170" height="44" rx="6" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/>
  <text x="585" y="210" font-size="8.5" font-weight="700" fill="#92400e" text-anchor="middle">Awaiting Reconnection</text>
  <text x="585" y="224" font-size="7" fill="#78350f" text-anchor="middle">(15s Heartbeat Polling)</text>

  <!-- Batch Sync Gateway -->
  <rect x="500" y="110" width="170" height="44" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="585" y="130" font-size="8.5" font-weight="700" fill="#1e40af" text-anchor="middle">POST /api/offline/sync/</text>
  <text x="585" y="143" font-size="7" fill="#1e3a8a" text-anchor="middle">(Batch Deduplication)</text>

  <!-- Final State -->
  <circle cx="760" cy="52" r="16" fill="none" stroke="#10b981" stroke-width="3"/>
  <circle cx="760" cy="52" r="10" fill="#10b981"/>
  <text x="760" y="85" font-size="8.5" font-weight="700" fill="#065f46" text-anchor="middle">Synchronized</text>

  <!-- Transitions -->
  <line x1="64" y1="90" x2="100" y2="90" stroke="#475569" stroke-width="1.5"/>
  <line x1="240" y1="90" x2="310" y2="90" stroke="#475569" stroke-width="1.5"/>

  <!-- Online Branch -->
  <line x1="355" y1="58" x2="355" y2="52" stroke="#10b981" stroke-width="1.5"/>
  <line x1="355" y1="52" x2="500" y2="52" stroke="#10b981" stroke-width="1.5"/>
  <text x="425" y="46" font-size="7.5" font-weight="700" fill="#047857">[Yes - Online]</text>
  <line x1="670" y1="52" x2="744" y2="52" stroke="#10b981" stroke-width="1.5"/>

  <!-- Offline Branch -->
  <line x1="355" y1="122" x2="355" y2="190" stroke="#ef4444" stroke-width="1.5"/>
  <text x="360" y="155" font-size="7.5" font-weight="700" fill="#b91c1c">[No - Offline]</text>

  <line x1="440" y1="212" x2="500" y2="212" stroke="#d97706" stroke-width="1.5"/>
  <line x1="585" y1="190" x2="585" y2="154" stroke="#2563eb" stroke-width="1.5"/>
  <text x="590" y="176" font-size="7.5" font-weight="700" fill="#1d4ed8">['online' event]</text>

  <line x1="670" y1="132" x2="720" y2="132" stroke="#10b981" stroke-width="1.5"/>
  <line x1="720" y1="132" x2="750" y2="66" stroke="#10b981" stroke-width="1.5"/>
  <text x="725" y="122" font-size="7" fill="#047857">Purge Queue</text>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-7: Offline Expense Synchronization State Machine Diagram</div>
</div>
`;

const SVG_ACT_SETTLEMENT = `
<div class="figure-box">
<svg viewBox="0 0 850 360" width="100%" height="360" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="360" fill="#f8fafc" rx="8"/>

  <!-- Start Node -->
  <circle cx="425" cy="25" r="12" fill="#0f172a"/>
  
  <!-- Step 1 -->
  <rect x="300" y="55" width="250" height="36" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="425" y="77" font-size="8.5" font-weight="700" fill="#1e40af" text-anchor="middle">1. Query All Tour Expenses &amp; Splits</text>

  <!-- Step 2 -->
  <rect x="270" y="110" width="310" height="36" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="425" y="132" font-size="8.5" font-weight="700" fill="#1e40af" text-anchor="middle">2. Compute Net Balances: (Paid Amount &minus; Owed Share)</text>

  <!-- Two Columns: Debtors & Creditors -->
  <rect x="70" y="165" width="310" height="40" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
  <text x="225" y="185" font-size="8" font-weight="700" fill="#991b1b" text-anchor="middle">Debtors List (Net &lt; 0)</text>
  <text x="225" y="198" font-size="7.5" fill="#7f1d1d" text-anchor="middle">Sorted Ascending: Largest Owed First</text>

  <rect x="470" y="165" width="310" height="40" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
  <text x="625" y="185" font-size="8" font-weight="700" fill="#065f46" text-anchor="middle">Creditors List (Net &gt; 0)</text>
  <text x="625" y="198" font-size="7.5" fill="#047857" text-anchor="middle">Sorted Descending: Largest Credit First</text>

  <!-- Greedy Pair Matching Core -->
  <rect x="235" y="225" width="380" height="42" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="425" y="243" font-size="8.5" font-weight="700" fill="#92400e" text-anchor="middle">Greedy Transfer Matching: transfer = min(&minus;debt, credit)</text>
  <text x="425" y="258" font-size="7.5" fill="#78350f" text-anchor="middle">Emit: Debtor pays Creditor transfer amount | Decrement balances</text>

  <!-- Decision: Unsettled Members Remain? -->
  <polygon points="425,285 470,305 425,325 380,305" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
  <text x="425" y="308" font-size="7" font-weight="700" fill="#334155" text-anchor="middle">More?</text>

  <!-- Loop back arrow -->
  <path d="M 470,305 L 630,305 L 630,246 L 615,246" fill="none" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="635" y="280" font-size="7" font-weight="700" fill="#d97706">[Yes: Remainder &gt; 0]</text>

  <!-- Final Node -->
  <circle cx="215" cy="305" r="14" fill="none" stroke="#10b981" stroke-width="3"/>
  <circle cx="215" cy="305" r="8" fill="#10b981"/>
  <text x="215" y="335" font-size="8" font-weight="700" fill="#065f46" text-anchor="middle">Minimal Direct Transfers Emitted</text>

  <!-- Connecting Lines -->
  <line x1="425" y1="37" x2="425" y2="55" stroke="#475569" stroke-width="1.5"/>
  <line x1="425" y1="91" x2="425" y2="110" stroke="#475569" stroke-width="1.5"/>
  <line x1="340" y1="146" x2="225" y2="165" stroke="#ef4444" stroke-width="1.5"/>
  <line x1="510" y1="146" x2="625" y2="165" stroke="#10b981" stroke-width="1.5"/>
  <line x1="225" y1="205" x2="340" y2="225" stroke="#d97706" stroke-width="1.5"/>
  <line x1="625" y1="205" x2="510" y2="225" stroke="#d97706" stroke-width="1.5"/>
  <line x1="425" y1="267" x2="425" y2="285" stroke="#475569" stroke-width="1.5"/>
  <line x1="380" y1="305" x2="229" y2="305" stroke="#10b981" stroke-width="1.5"/>
  <text x="300" y="300" font-size="7" font-weight="700" fill="#047857">[No: All Settled]</text>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-8: Greedy Debt Settlement &amp; Transfer Minimization Activity Diagram</div>
</div>
`;

const SVG_ACT_EXPENSE = `
<div class="figure-box">
<svg viewBox="0 0 850 340" width="100%" height="340" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="340" fill="#f8fafc" rx="8"/>

  <!-- Start Node -->
  <circle cx="40" cy="170" r="12" fill="#0f172a"/>
  <line x1="52" y1="170" x2="80" y2="170" stroke="#475569" stroke-width="1.5"/>

  <!-- Step 1: Form Input -->
  <rect x="80" y="145" width="120" height="50" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="140" y="167" font-size="8" font-weight="700" fill="#1e40af" text-anchor="middle">Input Expense</text>
  <text x="140" y="181" font-size="7" fill="#475569" text-anchor="middle">Title, Amount, Cat</text>
  <line x1="200" y1="170" x2="230" y2="170" stroke="#475569" stroke-width="1.5"/>

  <!-- Step 2: Receipt Attached? -->
  <polygon points="270,170 305,145 340,170 305,195" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
  <text x="305" y="173" font-size="7.5" font-weight="700" fill="#92400e" text-anchor="middle">Receipt?</text>

  <!-- Branch Yes: Validate Image -->
  <line x1="305" y1="145" x2="305" y2="90" stroke="#10b981" stroke-width="1.5"/>
  <text x="310" y="120" font-size="7" font-weight="700" fill="#047857">[Yes]</text>
  <rect x="250" y="60" width="110" height="30" rx="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
  <text x="305" y="79" font-size="7.5" font-weight="600" fill="#065f46" text-anchor="middle">Pillow Validate &amp; Save</text>
  <line x1="360" y1="75" x2="430" y2="75" stroke="#10b981" stroke-width="1.5"/>
  <line x1="430" y1="75" x2="430" y2="145" stroke="#10b981" stroke-width="1.5"/>

  <!-- Branch No -->
  <line x1="340" y1="170" x2="390" y2="170" stroke="#475569" stroke-width="1.5"/>
  <text x="360" y="163" font-size="7" font-weight="700" fill="#475569">[No]</text>

  <!-- Step 3: Split Allocation -->
  <rect x="390" y="145" width="125" height="50" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="452" y="167" font-size="8" font-weight="700" fill="#1e40af" text-anchor="middle">Split Allocation</text>
  <text x="452" y="181" font-size="7" fill="#475569" text-anchor="middle">Equal or Custom</text>
  <line x1="515" y1="170" x2="545" y2="170" stroke="#475569" stroke-width="1.5"/>

  <!-- Step 4: Atomic DB Write -->
  <rect x="545" y="145" width="125" height="50" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="607" y="167" font-size="8" font-weight="700" fill="#1e40af" text-anchor="middle">Atomic DB Write</text>
  <text x="607" y="181" font-size="7" fill="#475569" text-anchor="middle">Expense + Splits</text>
  <line x1="670" y1="170" x2="700" y2="170" stroke="#475569" stroke-width="1.5"/>

  <!-- Step 5: Check Spending Limit -->
  <rect x="700" y="145" width="115" height="50" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="757" y="167" font-size="8" font-weight="700" fill="#1e40af" text-anchor="middle">Check Limit</text>
  <text x="757" y="181" font-size="7" fill="#475569" text-anchor="middle">Edge-Trigger Alert</text>
  <line x1="757" y1="195" x2="757" y2="245" stroke="#475569" stroke-width="1.5"/>

  <!-- Final Node -->
  <circle cx="757" cy="280" r="14" fill="none" stroke="#10b981" stroke-width="3"/>
  <circle cx="757" cy="280" r="8" fill="#10b981"/>
  <text x="757" y="312" font-size="8" font-weight="700" fill="#065f46" text-anchor="middle">Completed</text>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-9: Expense Creation, Split Allocation &amp; Verification Activity Diagram</div>
</div>
`;

const SVG_DEPLOYMENT = `
<div class="figure-box">
<svg viewBox="0 0 850 280" width="100%" height="280" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="280" fill="#f8fafc" rx="8"/>

  <!-- Client Browser -->
  <g transform="translate(30, 70)">
    <rect x="0" y="0" width="135" height="130" fill="#eff6ff" rx="8" stroke="#2563eb" stroke-width="2"/>
    <rect x="0" y="0" width="135" height="26" fill="#1e3a8a" rx="8"/>
    <text x="67" y="17" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Client Browsers</text>
    <text x="67" y="55" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">Desktop / Mobile</text>
    <text x="67" y="75" font-size="7.5" fill="#475569" text-anchor="middle">HTML5, Tailwind</text>
    <text x="67" y="95" font-size="7.5" fill="#475569" text-anchor="middle">Vanilla JS Apps</text>
    <text x="67" y="115" font-size="7.5" fill="#059669" text-anchor="middle">LocalStorage DB</text>
  </g>

  <!-- Reverse Proxy -->
  <g transform="translate(240, 70)">
    <rect x="0" y="0" width="145" height="130" fill="#f0fdf4" rx="8" stroke="#16a34a" stroke-width="2"/>
    <rect x="0" y="0" width="145" height="26" fill="#14532d" rx="8"/>
    <text x="72" y="17" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Nginx Reverse Proxy</text>
    <text x="72" y="55" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">Port 80 / 443 (TLS)</text>
    <text x="72" y="75" font-size="7.5" fill="#475569" text-anchor="middle">SSL Termination</text>
    <text x="72" y="95" font-size="7.5" fill="#475569" text-anchor="middle">Static File Cache</text>
    <text x="72" y="115" font-size="7.5" fill="#059669" text-anchor="middle">Rate Limiter Gate</text>
  </g>

  <!-- Application Server -->
  <g transform="translate(460, 70)">
    <rect x="0" y="0" width="165" height="130" fill="#fef3c7" rx="8" stroke="#d97706" stroke-width="2"/>
    <rect x="0" y="0" width="165" height="26" fill="#78350f" rx="8"/>
    <text x="82" y="17" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Gunicorn + Django</text>
    <text x="82" y="55" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">WSGI Unix Sockets</text>
    <text x="82" y="75" font-size="7.5" fill="#475569" text-anchor="middle">Django 6.0 Core</text>
    <text x="82" y="95" font-size="7.5" fill="#475569" text-anchor="middle">DRF 3.17 REST API</text>
    <text x="82" y="115" font-size="7.5" fill="#059669" text-anchor="middle">JWT Middleware</text>
  </g>

  <!-- Persistence Tier -->
  <g transform="translate(690, 40)">
    <rect x="0" y="0" width="135" height="90" fill="#faf5ff" rx="8" stroke="#9333ea" stroke-width="2"/>
    <rect x="0" y="0" width="135" height="24" fill="#581c87" rx="8"/>
    <text x="67" y="16" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Relational DB</text>
    <text x="67" y="48" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">SQLite / MySQL</text>
    <text x="67" y="68" font-size="7.5" fill="#475569" text-anchor="middle">ACID Transactions</text>
  </g>

  <g transform="translate(690, 150)">
    <rect x="0" y="0" width="135" height="80" fill="#fff1f2" rx="8" stroke="#e11d48" stroke-width="2"/>
    <rect x="0" y="0" width="135" height="24" fill="#881337" rx="8"/>
    <text x="67" y="16" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Media Storage</text>
    <text x="67" y="48" font-size="8" font-weight="600" fill="#1e293b" text-anchor="middle">/media/receipts/</text>
    <text x="67" y="68" font-size="7.5" fill="#475569" text-anchor="middle">Pillow Validated</text>
  </g>

  <!-- Connector Lines -->
  <line x1="165" y1="135" x2="240" y2="135" stroke="#2563eb" stroke-width="2"/>
  <text x="202" y="128" font-size="7.5" font-weight="700" fill="#1d4ed8" text-anchor="middle">HTTPS</text>

  <line x1="385" y1="135" x2="460" y2="135" stroke="#16a34a" stroke-width="2"/>
  <text x="422" y="128" font-size="7.5" font-weight="700" fill="#15803d" text-anchor="middle">Proxy Pass</text>

  <line x1="625" y1="110" x2="690" y2="85" stroke="#9333ea" stroke-width="2"/>
  <line x1="625" y1="160" x2="690" y2="190" stroke="#e11d48" stroke-width="2"/>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure 3-10: Production Component &amp; Cloud Deployment Infrastructure Topology</div>
</div>
`;

const SVG_PROTOTYPE = `
<div class="figure-box">
<svg viewBox="0 0 850 480" width="100%" height="480" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif; border:1px solid #e2e8f0;">
  <rect x="0" y="0" width="850" height="480" fill="#f8fafc" rx="8"/>

  <!-- Screen 1: Tour Dashboard Mockup -->
  <g transform="translate(25, 20)">
    <rect x="0" y="0" width="380" height="210" fill="#ffffff" rx="6" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="0" y="0" width="380" height="24" fill="#1e293b" rx="6"/>
    <text x="15" y="16" font-size="9" font-weight="700" fill="#ffffff">Tour Workspace &bull; Skardu Expedition</text>
    <rect x="15" y="35" width="110" height="35" fill="#eff6ff" rx="4" stroke="#bfdbfe"/>
    <text x="22" y="49" font-size="7.5" fill="#1e40af">Total Budget</text>
    <text x="22" y="63" font-size="9.5" font-weight="700" fill="#1e3a8a">$150,000</text>
    <rect x="135" y="35" width="110" height="35" fill="#ecfdf5" rx="4" stroke="#a7f3d0"/>
    <text x="142" y="49" font-size="7.5" fill="#065f46">Total Spent</text>
    <text x="142" y="63" font-size="9.5" font-weight="700" fill="#047857">$84,250</text>
    <rect x="255" y="35" width="110" height="35" fill="#fef3c7" rx="4" stroke="#fde68a"/>
    <text x="262" y="49" font-size="7.5" fill="#92400e">Join Token</text>
    <text x="262" y="63" font-size="9.5" font-weight="700" fill="#b45309">SKD101</text>
    <!-- Expense Table Mini -->
    <rect x="15" y="80" width="350" height="115" fill="#f8fafc" rx="4" stroke="#e2e8f0"/>
    <text x="25" y="98" font-size="8" font-weight="700" fill="#334155">Recent Tour Expenses</text>
    <text x="25" y="118" font-size="7.5" fill="#475569">SUV Rental &bull; Transport</text><text x="350" y="118" font-size="7.5" font-weight="600" fill="#1e293b" text-anchor="end">$45,000</text>
    <text x="25" y="138" font-size="7.5" fill="#475569">Resort Stay &bull; Accommodation</text><text x="350" y="138" font-size="7.5" font-weight="600" fill="#1e293b" text-anchor="end">$32,000</text>
    <text x="25" y="158" font-size="7.5" fill="#475569">Dinner Buffet &bull; Food</text><text x="350" y="158" font-size="7.5" font-weight="600" fill="#1e293b" text-anchor="end">$7,250</text>
    <text x="25" y="180" font-size="7" fill="#2563eb">+ Add Expense &bull; Set Limit &bull; View Settlement</text>
  </g>

  <!-- Screen 2: Add Expense Modal Mockup -->
  <g transform="translate(440, 20)">
    <rect x="0" y="0" width="380" height="210" fill="#ffffff" rx="6" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="0" y="0" width="380" height="24" fill="#2563eb" rx="6"/>
    <text x="15" y="16" font-size="9" font-weight="700" fill="#ffffff">Record New Expense Modal</text>
    <rect x="20" y="38" width="340" height="24" fill="#f1f5f9" rx="3" stroke="#cbd5e1"/>
    <text x="30" y="54" font-size="8" fill="#64748b">Amount: $ 4,500.00</text>
    <rect x="20" y="70" width="165" height="24" fill="#f1f5f9" rx="3" stroke="#cbd5e1"/>
    <text x="30" y="86" font-size="8" fill="#334155">Category: Food &amp; Dining</text>
    <rect x="195" y="70" width="165" height="24" fill="#f1f5f9" rx="3" stroke="#cbd5e1"/>
    <text x="205" y="86" font-size="8" fill="#334155">Method: Online Transfer</text>
    <!-- Receipt Box -->
    <rect x="20" y="102" width="340" height="32" fill="#faf5ff" rx="3" stroke="#d8b4fe"/>
    <text x="30" y="122" font-size="7.5" fill="#7e22ce">&#128247; Receipt: hotel_bill_2026.jpg (Attached)</text>
    <rect x="20" y="142" width="340" height="26" fill="#eff6ff" rx="3" stroke="#93c5fd"/>
    <text x="30" y="159" font-size="7.5" fill="#1e40af">&#9889; Smart Suggestion: Food matches 'dinner' keyword</text>
    <rect x="20" y="176" width="340" height="24" fill="#10b981" rx="4"/>
    <text x="190" y="192" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Save Expense &amp; Compute Splits</text>
  </g>

  <!-- Screen 3: Settlement & Transfer Vouchers -->
  <g transform="translate(25, 250)">
    <rect x="0" y="0" width="380" height="205" fill="#ffffff" rx="6" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="0" y="0" width="380" height="24" fill="#047857" rx="6"/>
    <text x="15" y="16" font-size="9" font-weight="700" fill="#ffffff">Settlement &amp; Debt Resolution</text>
    <text x="20" y="45" font-size="8" font-weight="700" fill="#334155">Net Member Balances</text>
    <text x="20" y="65" font-size="7.5" fill="#1e293b">Ali Ahmed (Creditor):</text><text x="350" y="65" font-size="7.5" font-weight="700" fill="#059669" text-anchor="end">+$24,500</text>
    <text x="20" y="85" font-size="7.5" fill="#1e293b">Babar Khan (Debtor):</text><text x="350" y="85" font-size="7.5" font-weight="700" fill="#dc2626" text-anchor="end">&minus;$14,500</text>
    <text x="20" y="105" font-size="7.5" fill="#1e293b">Hamza Butt (Debtor):</text><text x="350" y="105" font-size="7.5" font-weight="700" fill="#dc2626" text-anchor="end">&minus;$10,000</text>
    <!-- Optimized Transfer Box -->
    <rect x="15" y="120" width="350" height="70" fill="#f0fdf4" rx="4" stroke="#86efac"/>
    <text x="25" y="138" font-size="8" font-weight="700" fill="#065f46">Optimized Minimal Direct Transfers:</text>
    <text x="25" y="156" font-size="7.5" fill="#1e293b">&bull; Babar Khan &rarr; pays $14,500 to Ali Ahmed</text>
    <text x="25" y="174" font-size="7.5" fill="#1e293b">&bull; Hamza Butt &rarr; pays $10,000 to Ali Ahmed</text>
  </g>

  <!-- Screen 4: Category Analytics Doughnut -->
  <g transform="translate(440, 250)">
    <rect x="0" y="0" width="380" height="205" fill="#ffffff" rx="6" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="0" y="0" width="380" height="24" fill="#6d28d9" rx="6"/>
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
      <rect x="0" y="110" width="175" height="24" fill="#fee2e2" rx="3" stroke="#f87171"/>
      <text x="8" y="126" font-size="7" font-weight="700" fill="#b91c1c">&#9888; Transport &ge; 30% Runaway Alert</text>
    </g>
  </g>
</svg>
<div class="figure-title" style="font-weight:700; color:#475569; margin-top:8px; font-size:9pt;">Figure C-1: Pay-Together Application Prototype Screen Layouts (Dashboard, Modal, Settlement, &amp; Analytics)</div>
</div>
`;

module.exports = {
  SVG_WBS,
  SVG_GANTT,
  SVG_USECASE,
  SVG_CLASS,
  SVG_ARCH,
  SVG_SEQ_EXPENSE,
  SVG_SEQ_TOKEN,
  SVG_SEQ_SYNC,
  SVG_ERD,
  SVG_STATEMACHINE,
  SVG_ACT_SETTLEMENT,
  SVG_ACT_EXPENSE,
  SVG_DEPLOYMENT,
  SVG_PROTOTYPE
};
