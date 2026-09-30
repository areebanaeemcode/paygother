const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// -------------------------------------------------------------
// SVG DIAGRAMS DEFINITIONS
// -------------------------------------------------------------

// Figure 1-1: Gantt Chart
const SVG_GANTT = `
<svg viewBox="0 0 850 340" width="100%" height="340" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif;">
  <defs>
    <linearGradient id="ganttBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="ganttBar2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="ganttBar3" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#6d28d9"/>
    </linearGradient>
  </defs>

  <!-- Title -->
  <rect x="0" y="0" width="850" height="340" fill="#f8fafc" rx="8" stroke="#e2e8f0" stroke-width="1"/>
  
  <!-- Grid Header -->
  <rect x="200" y="20" width="630" height="30" fill="#e2e8f0" rx="4"/>
  <text x="20" y="40" font-size="12" font-weight="700" fill="#1e293b">Project Activities / Work Packages</text>
  
  <!-- Weeks 1 to 15 -->
  ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((w, idx) => `
    <text x="${215 + idx * 41}" y="40" font-size="10" font-weight="600" fill="#475569" text-anchor="middle">W${w}</text>
    <line x1="${200 + idx * 42}" y1="50" x2="${200 + idx * 42}" y2="320" stroke="#cbd5e1" stroke-dasharray="2,2"/>
  `).join('')}

  <!-- Task Rows -->
  ${[
    { name: "1. Requirement Gathering & SRS", start: 0, span: 2, fill: "url(#ganttBar)" },
    { name: "2. System Design & UML Modeling", start: 1, span: 2, fill: "url(#ganttBar)" },
    { name: "3. DB Schema & Models Implementation", start: 3, span: 2, fill: "url(#ganttBar)" },
    { name: "4. User Auth & Tour Management", start: 4, span: 2, fill: "url(#ganttBar2)" },
    { name: "5. Expense Ledger & Receipt Module", start: 6, span: 2, fill: "url(#ganttBar2)" },
    { name: "6. Smart Expense & Spending Limits", start: 8, span: 2, fill: "url(#ganttBar2)" },
    { name: "7. Offline Mode & Auto-Sync Engine", start: 9, span: 2, fill: "url(#ganttBar3)" },
    { name: "8. Settlement Engine & Min Transfers", start: 10, span: 2, fill: "url(#ganttBar3)" },
    { name: "9. Analytics & Dynamic UI Dashboards", start: 11, span: 2, fill: "url(#ganttBar3)" },
    { name: "10. Comprehensive Verification (UT/FT/IT)", start: 12, span: 2, fill: "#f59e0b" },
    { name: "11. Production Deployment & FYP Report", start: 13, span: 2, fill: "#ef4444" },
  ].map((t, i) => `
    <rect x="15" y="${60 + i * 23}" width="180" height="19" fill="#ffffff" rx="3" stroke="#f1f5f9"/>
    <text x="20" y="${74 + i * 23}" font-size="9" font-weight="600" fill="#334155">${t.name}</text>
    <rect x="${202 + t.start * 42}" y="${62 + i * 23}" width="${t.span * 42 - 4}" height="15" rx="4" fill="${t.fill}"/>
  `).join('')}
</svg>
`;

// Figure 2-1: UML Use Case Diagram
const SVG_USECASE = `
<svg viewBox="0 0 850 540" width="100%" height="540" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif;">
  <rect x="0" y="0" width="850" height="540" fill="#f8fafc" rx="8" stroke="#e2e8f0" stroke-width="1"/>
  
  <!-- System Boundary -->
  <rect x="230" y="25" width="410" height="490" fill="#ffffff" rx="8" stroke="#2563eb" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="435" y="48" font-size="14" font-weight="800" fill="#1e3a8a" text-anchor="middle">PAY-TOGETHER APPLICATION BOUNDARY</text>

  <!-- Actor 1: Registered User -->
  <g transform="translate(60, 110)">
    <circle cx="30" cy="20" r="14" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="30" y1="34" x2="30" y2="70" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="10" y1="48" x2="50" y2="48" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="30" y1="70" x2="15" y2="100" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="30" y1="70" x2="45" y2="100" stroke="#1d4ed8" stroke-width="2"/>
    <text x="30" y="120" font-size="11" font-weight="700" fill="#1e293b" text-anchor="middle">Registered User</text>
  </g>

  <!-- Actor 2: Tour Member -->
  <g transform="translate(60, 310)">
    <circle cx="30" cy="20" r="14" fill="#dcfce7" stroke="#15803d" stroke-width="2"/>
    <line x1="30" y1="34" x2="30" y2="70" stroke="#15803d" stroke-width="2"/>
    <line x1="10" y1="48" x2="50" y2="48" stroke="#15803d" stroke-width="2"/>
    <line x1="30" y1="70" x2="15" y2="100" stroke="#15803d" stroke-width="2"/>
    <line x1="30" y1="70" x2="45" y2="100" stroke="#15803d" stroke-width="2"/>
    <text x="30" y="120" font-size="11" font-weight="700" fill="#1e293b" text-anchor="middle">Tour Member</text>
  </g>

  <!-- Actor 3: Tour Creator -->
  <g transform="translate(730, 150)">
    <circle cx="30" cy="20" r="14" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
    <line x1="30" y1="34" x2="30" y2="70" stroke="#b45309" stroke-width="2"/>
    <line x1="10" y1="48" x2="50" y2="48" stroke="#b45309" stroke-width="2"/>
    <line x1="30" y1="70" x2="15" y2="100" stroke="#b45309" stroke-width="2"/>
    <line x1="30" y1="70" x2="45" y2="100" stroke="#b45309" stroke-width="2"/>
    <text x="30" y="120" font-size="11" font-weight="700" fill="#1e293b" text-anchor="middle">Tour Creator</text>
  </g>

  <!-- Actor 4: System Admin -->
  <g transform="translate(730, 340)">
    <circle cx="30" cy="20" r="14" fill="#fee2e2" stroke="#b91c1c" stroke-width="2"/>
    <line x1="30" y1="34" x2="30" y2="70" stroke="#b91c1c" stroke-width="2"/>
    <line x1="10" y1="48" x2="50" y2="48" stroke="#b91c1c" stroke-width="2"/>
    <line x1="30" y1="70" x2="15" y2="100" stroke="#b91c1c" stroke-width="2"/>
    <line x1="30" y1="70" x2="45" y2="100" stroke="#b91c1c" stroke-width="2"/>
    <text x="30" y="120" font-size="11" font-weight="700" fill="#1e293b" text-anchor="middle">System Admin</text>
  </g>

  <!-- Use Case Ovals inside System Boundary -->
  ${[
    { id: "UC-01", name: "Register Account", y: 75, cx: 330 },
    { id: "UC-02", name: "Login & Authenticate", y: 115, cx: 330 },
    { id: "UC-03", name: "Create Tour Workspace", y: 160, cx: 360 },
    { id: "UC-04", name: "Join Tour via Token", y: 205, cx: 360 },
    { id: "UC-05", name: "Add Expense & Splits", y: 255, cx: 435 },
    { id: "UC-06", name: "Set Personal Limit", y: 300, cx: 435 },
    { id: "UC-07", name: "View Category Analytics", y: 345, cx: 435 },
    { id: "UC-08", name: "View Settlement & Balances", y: 390, cx: 435 },
    { id: "UC-09", name: "Upload & Verify Receipt", y: 435, cx: 435 },
    { id: "UC-10", name: "Record Offline & Auto-Sync", y: 480, cx: 435 },
    { id: "UC-11", name: "Manage Members & Status", y: 160, cx: 540 },
    { id: "UC-12", name: "Admin Telemetry & Gate", y: 390, cx: 540 },
  ].map(uc => `
    <ellipse cx="${uc.cx}" cy="${uc.y}" rx="85" ry="18" fill="#f1f5f9" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="${uc.cx}" y="${uc.y + 4}" font-size="8.5" font-weight="600" fill="#0f172a" text-anchor="middle">${uc.id}: ${uc.name}</text>
  `).join('')}

  <!-- Associations from Registered User -->
  <line x1="120" y1="140" x2="250" y2="75" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="150" x2="250" y2="115" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="160" x2="280" y2="160" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="170" x2="280" y2="205" stroke="#64748b" stroke-width="1.2"/>

  <!-- Associations from Tour Member -->
  <line x1="120" y1="340" x2="350" y2="255" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="350" x2="350" y2="300" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="360" x2="350" y2="345" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="370" x2="350" y2="390" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="380" x2="350" y2="435" stroke="#64748b" stroke-width="1.2"/>
  <line x1="120" y1="390" x2="350" y2="480" stroke="#64748b" stroke-width="1.2"/>

  <!-- Associations from Tour Creator -->
  <line x1="730" y1="200" x2="445" y2="160" stroke="#64748b" stroke-width="1.2"/>
  <line x1="730" y1="210" x2="520" y2="435" stroke="#64748b" stroke-width="1.2"/>

  <!-- Associations from Sys Admin -->
  <line x1="730" y1="380" x2="620" y2="390" stroke="#64748b" stroke-width="1.2"/>
</svg>
`;

// Figure 3-1: UML Class Diagram
const SVG_CLASS = `
<svg viewBox="0 0 850 560" width="100%" height="560" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif;">
  <rect x="0" y="0" width="850" height="560" fill="#f8fafc" rx="8" stroke="#e2e8f0" stroke-width="1"/>

  <!-- User Class -->
  <g transform="translate(30, 20)">
    <rect x="0" y="0" width="220" height="150" fill="#ffffff" rx="6" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="0" y="0" width="220" height="26" fill="#eff6ff" rx="6"/>
    <text x="110" y="18" font-size="11" font-weight="700" fill="#1e3a8a" text-anchor="middle">User</text>
    <line x1="0" y1="26" x2="220" y2="26" stroke="#2563eb" stroke-width="1"/>
    <text x="10" y="44" font-size="8.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="58" font-size="8.5" fill="#334155">+ email: String (Unique)</text>
    <text x="10" y="72" font-size="8.5" fill="#334155">+ phone_number: String</text>
    <text x="10" y="86" font-size="8.5" fill="#334155">+ first_name, last_name: String</text>
    <text x="10" y="100" font-size="8.5" fill="#334155">+ password: Hash (PBKDF2)</text>
    <line x1="0" y1="108" x2="220" y2="108" stroke="#e2e8f0" stroke-width="1"/>
    <text x="10" y="124" font-size="8.5" fill="#2563eb">+ get_full_name(): String</text>
    <text x="10" y="138" font-size="8.5" fill="#2563eb">+ check_password(): Boolean</text>
  </g>

  <!-- Tour Class -->
  <g transform="translate(310, 20)">
    <rect x="0" y="0" width="230" height="160" fill="#ffffff" rx="6" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="0" y="0" width="230" height="26" fill="#eff6ff" rx="6"/>
    <text x="115" y="18" font-size="11" font-weight="700" fill="#1e3a8a" text-anchor="middle">Tour</text>
    <line x1="0" y1="26" x2="230" y2="26" stroke="#2563eb" stroke-width="1"/>
    <text x="10" y="44" font-size="8.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="58" font-size="8.5" fill="#334155">+ title, destination: String</text>
    <text x="10" y="72" font-size="8.5" fill="#334155">+ budget: Decimal(12,2)</text>
    <text x="10" y="86" font-size="8.5" fill="#334155">+ start_date, end_date: Date</text>
    <text x="10" y="100" font-size="8.5" fill="#334155">+ join_token: String(6) [Unique]</text>
    <line x1="0" y1="108" x2="230" y2="108" stroke="#e2e8f0" stroke-width="1"/>
    <text x="10" y="124" font-size="8.5" fill="#2563eb">+ is_member(user): Boolean</text>
    <text x="10" y="138" font-size="8.5" fill="#2563eb">+ total_spent(): Decimal</text>
    <text x="10" y="152" font-size="8.5" fill="#2563eb">+ save(): Generates Token</text>
  </g>

  <!-- TourMember Class -->
  <g transform="translate(600, 20)">
    <rect x="0" y="0" width="210" height="120" fill="#ffffff" rx="6" stroke="#2563eb" stroke-width="1.5"/>
    <rect x="0" y="0" width="210" height="26" fill="#eff6ff" rx="6"/>
    <text x="105" y="18" font-size="11" font-weight="700" fill="#1e3a8a" text-anchor="middle">TourMember</text>
    <line x1="0" y1="26" x2="210" y2="26" stroke="#2563eb" stroke-width="1"/>
    <text x="10" y="44" font-size="8.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="58" font-size="8.5" fill="#334155">+ tour_id: FK(Tour)</text>
    <text x="10" y="72" font-size="8.5" fill="#334155">+ user_id: FK(User)</text>
    <text x="10" y="86" font-size="8.5" fill="#334155">+ role: 'creator' | 'member'</text>
    <text x="10" y="100" font-size="8.5" fill="#334155">+ joined_at: DateTime</text>
  </g>

  <!-- Expense Class -->
  <g transform="translate(310, 230)">
    <rect x="0" y="0" width="230" height="160" fill="#ffffff" rx="6" stroke="#10b981" stroke-width="1.5"/>
    <rect x="0" y="0" width="230" height="26" fill="#ecfdf5" rx="6"/>
    <text x="115" y="18" font-size="11" font-weight="700" fill="#065f46" text-anchor="middle">Expense</text>
    <line x1="0" y1="26" x2="230" y2="26" stroke="#10b981" stroke-width="1"/>
    <text x="10" y="44" font-size="8.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="58" font-size="8.5" fill="#334155">+ tour_id: FK(Tour)</text>
    <text x="10" y="72" font-size="8.5" fill="#334155">+ paid_by_id: FK(User)</text>
    <text x="10" y="86" font-size="8.5" fill="#334155">+ amount: Decimal(12,2)</text>
    <text x="10" y="100" font-size="8.5" fill="#334155">+ category: Enum(Transport,...)</text>
    <text x="10" y="114" font-size="8.5" fill="#334155">+ payment_method: Enum</text>
    <text x="10" y="128" font-size="8.5" fill="#334155">+ paid_at, created_at: DateTime</text>
  </g>

  <!-- ExpenseSplit Class -->
  <g transform="translate(30, 230)">
    <rect x="0" y="0" width="220" height="110" fill="#ffffff" rx="6" stroke="#10b981" stroke-width="1.5"/>
    <rect x="0" y="0" width="220" height="26" fill="#ecfdf5" rx="6"/>
    <text x="110" y="18" font-size="11" font-weight="700" fill="#065f46" text-anchor="middle">ExpenseSplit</text>
    <line x1="0" y1="26" x2="220" y2="26" stroke="#10b981" stroke-width="1"/>
    <text x="10" y="44" font-size="8.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="58" font-size="8.5" fill="#334155">+ expense_id: FK(Expense)</text>
    <text x="10" y="72" font-size="8.5" fill="#334155">+ user_id: FK(User)</text>
    <text x="10" y="86" font-size="8.5" fill="#334155">+ share_amount: Decimal(12,2)</text>
  </g>

  <!-- Receipt Class -->
  <g transform="translate(600, 230)">
    <rect x="0" y="0" width="210" height="120" fill="#ffffff" rx="6" stroke="#10b981" stroke-width="1.5"/>
    <rect x="0" y="0" width="210" height="26" fill="#ecfdf5" rx="6"/>
    <text x="105" y="18" font-size="11" font-weight="700" fill="#065f46" text-anchor="middle">Receipt</text>
    <line x1="0" y1="26" x2="210" y2="26" stroke="#10b981" stroke-width="1"/>
    <text x="10" y="44" font-size="8.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="58" font-size="8.5" fill="#334155">+ expense_id: OneToOne(Expense)</text>
    <text x="10" y="72" font-size="8.5" fill="#334155">+ image: ImageField</text>
    <text x="10" y="86" font-size="8.5" fill="#334155">+ verified_at: DateTime</text>
    <text x="10" y="100" font-size="8.5" fill="#10b981">+ mark_verified(user)</text>
  </g>

  <!-- ExpenseLimit Class -->
  <g transform="translate(30, 410)">
    <rect x="0" y="0" width="220" height="110" fill="#ffffff" rx="6" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="0" y="0" width="220" height="26" fill="#fffbeb" rx="6"/>
    <text x="110" y="18" font-size="11" font-weight="700" fill="#92400e" text-anchor="middle">ExpenseLimit</text>
    <line x1="0" y1="26" x2="220" y2="26" stroke="#f59e0b" stroke-width="1"/>
    <text x="10" y="44" font-size="8.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="58" font-size="8.5" fill="#334155">+ user_id: FK(User)</text>
    <text x="10" y="72" font-size="8.5" fill="#334155">+ tour_id: FK(Tour)</text>
    <text x="10" y="86" font-size="8.5" fill="#334155">+ amount: Decimal(12,2)</text>
    <text x="10" y="100" font-size="8.5" fill="#334155">+ last_notified_exceeded: Bool</text>
  </g>

  <!-- Notification Class -->
  <g transform="translate(310, 430)">
    <rect x="0" y="0" width="230" height="110" fill="#ffffff" rx="6" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="0" y="0" width="230" height="26" fill="#fffbeb" rx="6"/>
    <text x="115" y="18" font-size="11" font-weight="700" fill="#92400e" text-anchor="middle">Notification</text>
    <line x1="0" y1="26" x2="230" y2="26" stroke="#f59e0b" stroke-width="1"/>
    <text x="10" y="44" font-size="8.5" fill="#334155">+ id: BigInt [PK]</text>
    <text x="10" y="58" font-size="8.5" fill="#334155">+ recipient_id: FK(User)</text>
    <text x="10" y="72" font-size="8.5" fill="#334155">+ type: 'limit_exceeded',...</text>
    <text x="10" y="86" font-size="8.5" fill="#334155">+ is_read: Boolean</text>
    <text x="10" y="100" font-size="8.5" fill="#f59e0b">+ mark_read()</text>
  </g>

  <!-- Connectors with Multiplicity -->
  <line x1="250" y1="90" x2="310" y2="90" stroke="#475569" stroke-width="1.5"/>
  <text x="260" y="82" font-size="8" fill="#475569">1</text>
  <text x="295" y="82" font-size="8" fill="#475569">*</text>

  <line x1="540" y1="90" x2="600" y2="90" stroke="#475569" stroke-width="1.5"/>
  <text x="550" y="82" font-size="8" fill="#475569">1</text>
  <text x="590" y="82" font-size="8" fill="#475569">*</text>

  <line x1="425" y1="180" x2="425" y2="230" stroke="#475569" stroke-width="1.5"/>
  <text x="430" y="195" font-size="8" fill="#475569">1</text>
  <text x="430" y="220" font-size="8" fill="#475569">*</text>

  <line x1="310" y1="285" x2="250" y2="285" stroke="#475569" stroke-width="1.5"/>
  <text x="295" y="278" font-size="8" fill="#475569">1</text>
  <text x="260" y="278" font-size="8" fill="#475569">*</text>

  <line x1="540" y1="285" x2="600" y2="285" stroke="#475569" stroke-width="1.5"/>
  <text x="550" y="278" font-size="8" fill="#475569">1</text>
  <text x="585" y="278" font-size="8" fill="#475569">0..1</text>
</svg>
`;

// Figure 3-2: Sequence Diagram
const SVG_SEQUENCE = `
<svg viewBox="0 0 850 460" width="100%" height="460" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif;">
  <rect x="0" y="0" width="850" height="460" fill="#f8fafc" rx="8" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Lifeline Headers -->
  ${[
    { name: "Tour Member", x: 70 },
    { name: "UI (tour_detail.js)", x: 230 },
    { name: "ExpenseCreateAPI", x: 400 },
    { name: "Database (ORM)", x: 560 },
    { name: "LimitEngine", x: 700 },
    { name: "Notif Hub", x: 800 }
  ].map(p => `
    <rect x="${p.x - 55}" y="20" width="110" height="30" fill="#1e3a8a" rx="5"/>
    <text x="${p.x}" y="39" font-size="9" font-weight="700" fill="#ffffff" text-anchor="middle">${p.name}</text>
    <line x1="${p.x}" y1="50" x2="${p.x}" y2="430" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>
  `).join('')}

  <!-- Message 1 -->
  <line x1="70" y1="80" x2="230" y2="80" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arrow)"/>
  <text x="150" y="74" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">1. Submit Expense Form</text>

  <!-- Message 2 -->
  <line x1="230" y1="110" x2="400" y2="110" stroke="#2563eb" stroke-width="1.5"/>
  <text x="315" y="104" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">2. POST /api/create/ [JSON + JWT]</text>

  <!-- Message 3 -->
  <line x1="400" y1="140" x2="560" y2="140" stroke="#2563eb" stroke-width="1.5"/>
  <text x="480" y="134" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">3. Validate & Insert Expense</text>

  <!-- DB Activation -->
  <rect x="555" y="140" width="10" height="40" fill="#93c5fd"/>
  <line x1="560" y1="180" x2="400" y2="180" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="480" y="174" font-size="8" fill="#64748b" text-anchor="middle">Record Created (ID: 42)</text>

  <!-- Message 4: Call Limit Check -->
  <line x1="400" y1="210" x2="700" y2="210" stroke="#2563eb" stroke-width="1.5"/>
  <text x="550" y="204" font-size="8.5" font-weight="600" fill="#1e293b" text-anchor="middle">4. check_expense_limits_for_tour()</text>

  <!-- Message 5: Query Total -->
  <line x1="700" y1="235" x2="560" y2="235" stroke="#2563eb" stroke-width="1.5"/>
  <text x="630" y="229" font-size="8" fill="#1e293b" text-anchor="middle">5. Sum(amount) for User</text>
  <line x1="560" y1="255" x2="700" y2="255" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="630" y="250" font-size="8" fill="#64748b" text-anchor="middle">Total Spent = $650, Limit = $500</text>

  <!-- Alt Box -->
  <rect x="360" y="275" width="460" height="85" fill="#fef2f2" stroke="#f87171" stroke-width="1" rx="4"/>
  <text x="370" y="290" font-size="8.5" font-weight="700" fill="#991b1b">[alt: Total &gt; Limit AND last_notified == False]</text>

  <!-- Fire Notification -->
  <line x1="700" y1="315" x2="800" y2="315" stroke="#ef4444" stroke-width="1.5"/>
  <text x="750" y="309" font-size="8" font-weight="600" fill="#991b1b" text-anchor="middle">Create Notif</text>
  <line x1="700" y1="340" x2="560" y2="340" stroke="#2563eb" stroke-width="1.5"/>
  <text x="630" y="334" font-size="8" fill="#1e293b" text-anchor="middle">Set last_notified=True</text>

  <!-- Response -->
  <line x1="400" y1="385" x2="230" y2="385" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="315" y="379" font-size="8.5" font-weight="600" fill="#047857" text-anchor="middle">HTTP 201 Created [Payload + Alert Flag]</text>

  <line x1="230" y1="415" x2="70" y2="415" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="150" y="409" font-size="8.5" font-weight="600" fill="#047857" text-anchor="middle">Render Expense Row & Show Alert Banner</text>
</svg>
`;

// Figure 3-3: Multi-Tier Architecture Diagram
const SVG_ARCH = `
<svg viewBox="0 0 850 440" width="100%" height="440" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif;">
  <rect x="0" y="0" width="850" height="440" fill="#f8fafc" rx="8" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Tier 1: Client Presentation -->
  <g transform="translate(30, 30)">
    <rect x="0" y="0" width="790" height="85" fill="#eff6ff" rx="6" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="20" y="24" font-size="12" font-weight="800" fill="#1e3a8a">TIER 1: PRESENTATION TIER (CLIENT BROWSER)</text>
    
    <rect x="20" y="35" width="170" height="36" fill="#ffffff" rx="4" stroke="#93c5fd"/>
    <text x="105" y="58" font-size="9" font-weight="600" fill="#1e293b" text-anchor="middle">HTML5 & Tailwind CSS</text>

    <rect x="210" y="35" width="190" height="36" fill="#ffffff" rx="4" stroke="#93c5fd"/>
    <text x="305" y="58" font-size="9" font-weight="600" fill="#1e293b" text-anchor="middle">Vanilla JS (api.js, tour_detail.js)</text>

    <rect x="420" y="35" width="170" height="36" fill="#ffffff" rx="4" stroke="#93c5fd"/>
    <text x="505" y="58" font-size="9" font-weight="600" fill="#1e293b" text-anchor="middle">Chart.js Analytics Canvas</text>

    <rect x="610" y="35" width="160" height="36" fill="#ffffff" rx="4" stroke="#f59e0b"/>
    <text x="690" y="58" font-size="9" font-weight="700" fill="#b45309" text-anchor="middle">Offline localStorage Queue</text>
  </g>

  <!-- Connectors -->
  <line x1="425" y1="115" x2="425" y2="155" stroke="#2563eb" stroke-width="2"/>
  <text x="435" y="140" font-size="9" font-weight="600" fill="#2563eb">HTTPS / JSON REST API</text>

  <!-- Tier 2: Application Service Layer -->
  <g transform="translate(30, 155)">
    <rect x="0" y="0" width="790" height="150" fill="#f0fdf4" rx="6" stroke="#10b981" stroke-width="1.5"/>
    <text x="20" y="24" font-size="12" font-weight="800" fill="#065f46">TIER 2: APPLICATION SERVICE TIER (DJANGO 6.0 & DRF)</text>

    <!-- Middleware Sub-box -->
    <rect x="20" y="35" width="230" height="100" fill="#ffffff" rx="4" stroke="#86efac"/>
    <text x="135" y="55" font-size="10" font-weight="700" fill="#1e293b" text-anchor="middle">Security & Gate Middleware</text>
    <text x="30" y="75" font-size="8" fill="#475569">&bull; AdminAccessPassMiddleware</text>
    <text x="30" y="90" font-size="8" fill="#475569">&bull; SimpleJWT Authentication</text>
    <text x="30" y="105" font-size="8" fill="#475569">&bull; SessionAuthentication & CSRF</text>
    <text x="30" y="120" font-size="8" fill="#475569">&bull; CORS & IsTourMember Permissions</text>

    <!-- Business Engines Sub-box -->
    <rect x="270" y="35" width="250" height="100" fill="#ffffff" rx="4" stroke="#86efac"/>
    <text x="395" y="55" font-size="10" font-weight="700" fill="#1e293b" text-anchor="middle">Business Logic & Engines</text>
    <text x="280" y="75" font-size="8" fill="#475569">&bull; Greedy Debt Settlement Engine</text>
    <text x="280" y="90" font-size="8" fill="#475569">&bull; Edge-Triggered Limit Service</text>
    <text x="280" y="105" font-size="8" fill="#475569">&bull; Smart Expense Keyword Analyzer</text>
    <text x="280" y="120" font-size="8" fill="#475569">&bull; Alphanumeric Token Generator</text>

    <!-- API Views Sub-box -->
    <rect x="540" y="35" width="230" height="100" fill="#ffffff" rx="4" stroke="#86efac"/>
    <text x="655" y="55" font-size="10" font-weight="700" fill="#1e293b" text-anchor="middle">API Controllers & Views</text>
    <text x="550" y="75" font-size="8" fill="#475569">&bull; TourListAPI / CreateTourAPI</text>
    <text x="550" y="90" font-size="8" fill="#475569">&bull; ExpenseCreateAPI / Splits</text>
    <text x="550" y="105" font-size="8" fill="#475569">&bull; OfflinePendingExpenseSyncAPI</text>
    <text x="550" y="120" font-size="8" fill="#475569">&bull; ReceiptUpload & Verification</text>
  </g>

  <!-- Connectors -->
  <line x1="425" y1="305" x2="425" y2="345" stroke="#10b981" stroke-width="2"/>
  <text x="435" y="330" font-size="9" font-weight="600" fill="#047857">Django ORM / SQL Queries</text>

  <!-- Tier 3: Persistence Layer -->
  <g transform="translate(30, 345)">
    <rect x="0" y="0" width="790" height="75" fill="#fdf4ff" rx="6" stroke="#c084fc" stroke-width="1.5"/>
    <text x="20" y="22" font-size="12" font-weight="800" fill="#6b21a8">TIER 3: DATA PERSISTENCE & STORAGE TIER</text>

    <rect x="20" y="30" width="370" height="35" fill="#ffffff" rx="4" stroke="#e9d5ff"/>
    <text x="205" y="52" font-size="9" font-weight="600" fill="#1e293b" text-anchor="middle">Relational Database Engine (SQLite 3 / MySQL 8.0)</text>

    <rect x="410" y="30" width="360" height="35" fill="#ffffff" rx="4" stroke="#e9d5ff"/>
    <text x="590" y="52" font-size="9" font-weight="600" fill="#1e293b" text-anchor="middle">Media Storage Root (/media/receipts/%Y/%m/)</text>
  </g>
</svg>
`;

// Figure 3-4: Entity-Relationship Diagram
const SVG_ERD = `
<svg viewBox="0 0 850 540" width="100%" height="540" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif;">
  <rect x="0" y="0" width="850" height="540" fill="#f8fafc" rx="8" stroke="#e2e8f0" stroke-width="1"/>

  <!-- USERS Table -->
  <g transform="translate(30, 20)">
    <rect x="0" y="0" width="190" height="150" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="190" height="24" fill="#0f172a" rx="4"/>
    <text x="95" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">users</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" fill="#334155">email: VarChar(254) [UQ]</text>
    <text x="10" y="70" font-size="8" fill="#334155">phone_number: VarChar(15)</text>
    <text x="10" y="85" font-size="8" fill="#334155">first_name: VarChar(100)</text>
    <text x="10" y="100" font-size="8" fill="#334155">last_name: VarChar(100)</text>
    <text x="10" y="115" font-size="8" fill="#334155">password: VarChar(128)</text>
    <text x="10" y="130" font-size="8" fill="#334155">created_at: DateTime</text>
  </g>

  <!-- TOURS Table -->
  <g transform="translate(310, 20)">
    <rect x="0" y="0" width="210" height="150" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="210" height="24" fill="#0f172a" rx="4"/>
    <text x="105" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">apps_tours_tour</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK created_by_id: BigInt</text>
    <text x="10" y="70" font-size="8" fill="#334155">title: VarChar(255)</text>
    <text x="10" y="85" font-size="8" fill="#334155">destination: VarChar(255)</text>
    <text x="10" y="100" font-size="8" fill="#334155">budget: Decimal(12,2)</text>
    <text x="10" y="115" font-size="8" fill="#334155">join_token: VarChar(64) [UQ]</text>
    <text x="10" y="130" font-size="8" fill="#334155">start_date, end_date: Date</text>
  </g>

  <!-- TOUR_MEMBERS Table -->
  <g transform="translate(610, 20)">
    <rect x="0" y="0" width="200" height="110" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="24" fill="#0f172a" rx="4"/>
    <text x="100" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">apps_tours_tourmember</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK tour_id: BigInt</text>
    <text x="10" y="70" font-size="8" font-weight="700" fill="#2563eb">FK user_id: BigInt</text>
    <text x="10" y="85" font-size="8" fill="#334155">role: VarChar(20)</text>
    <text x="10" y="100" font-size="8" fill="#334155">joined_at: DateTime</text>
  </g>

  <!-- EXPENSES Table -->
  <g transform="translate(310, 220)">
    <rect x="0" y="0" width="210" height="150" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="210" height="24" fill="#0f172a" rx="4"/>
    <text x="105" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">expenses</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK tour_id: BigInt</text>
    <text x="10" y="70" font-size="8" font-weight="700" fill="#2563eb">FK paid_by_id: BigInt</text>
    <text x="10" y="85" font-size="8" fill="#334155">amount: Decimal(12,2)</text>
    <text x="10" y="100" font-size="8" fill="#334155">category: VarChar(40)</text>
    <text x="10" y="115" font-size="8" fill="#334155">payment_method: VarChar(40)</text>
    <text x="10" y="130" font-size="8" fill="#334155">paid_at: DateTime</text>
  </g>

  <!-- EXPENSE_SPLITS Table -->
  <g transform="translate(30, 220)">
    <rect x="0" y="0" width="190" height="110" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="190" height="24" fill="#0f172a" rx="4"/>
    <text x="95" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">expense_splits</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK expense_id: BigInt</text>
    <text x="10" y="70" font-size="8" font-weight="700" fill="#2563eb">FK user_id: BigInt</text>
    <text x="10" y="85" font-size="8" fill="#334155">share_amount: Decimal(12,2)</text>
  </g>

  <!-- RECEIPTS Table -->
  <g transform="translate(610, 220)">
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
  <g transform="translate(30, 400)">
    <rect x="0" y="0" width="190" height="110" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="190" height="24" fill="#0f172a" rx="4"/>
    <text x="95" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">expense_limits</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK user_id: BigInt</text>
    <text x="10" y="70" font-size="8" font-weight="700" fill="#2563eb">FK tour_id: BigInt</text>
    <text x="10" y="85" font-size="8" fill="#334155">amount: Decimal(12,2)</text>
    <text x="10" y="100" font-size="8" fill="#334155">last_notified_exceeded: Bool</text>
  </g>

  <!-- NOTIFICATIONS Table -->
  <g transform="translate(310, 400)">
    <rect x="0" y="0" width="210" height="120" fill="#ffffff" rx="4" stroke="#334155" stroke-width="1.5"/>
    <rect x="0" y="0" width="210" height="24" fill="#0f172a" rx="4"/>
    <text x="105" y="16" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">notifications</text>
    <text x="10" y="40" font-size="8" font-weight="700" fill="#dc2626">PK id: BigInt</text>
    <text x="10" y="55" font-size="8" font-weight="700" fill="#2563eb">FK recipient_id: BigInt</text>
    <text x="10" y="70" font-size="8" font-weight="700" fill="#2563eb">FK tour_id: BigInt</text>
    <text x="10" y="85" font-size="8" fill="#334155">type, title, message</text>
    <text x="10" y="100" font-size="8" fill="#334155">is_read: Boolean</text>
  </g>

  <!-- Crow's foot connector lines -->
  <line x1="220" y1="80" x2="310" y2="80" stroke="#64748b" stroke-width="1.5"/>
  <line x1="520" y1="80" x2="610" y2="80" stroke="#64748b" stroke-width="1.5"/>
  <line x1="415" y1="170" x2="415" y2="220" stroke="#64748b" stroke-width="1.5"/>
  <line x1="310" y1="270" x2="220" y2="270" stroke="#64748b" stroke-width="1.5"/>
  <line x1="520" y1="270" x2="610" y2="270" stroke="#64748b" stroke-width="1.5"/>
</svg>
`;

// Figure 3-5: Offline State Machine Diagram
const SVG_STATEMACHINE = `
<svg viewBox="0 0 850 360" width="100%" height="360" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; border-radius:8px; font-family:'Plus Jakarta Sans', Arial, sans-serif;">
  <rect x="0" y="0" width="850" height="360" fill="#f8fafc" rx="8" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Start State -->
  <circle cx="50" cy="110" r="14" fill="#0f172a"/>
  
  <!-- State 1: Form Submitted -->
  <rect x="110" y="85" width="140" height="50" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="180" y="115" font-size="10" font-weight="700" fill="#1e40af" text-anchor="middle">Expense Submitted</text>

  <!-- Decision Diamond: Connectivity -->
  <polygon points="340,110 390,75 440,110 390,145" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="390" y="113" font-size="8.5" font-weight="700" fill="#92400e" text-anchor="middle">Online?</text>

  <!-- Online Direct State -->
  <rect x="540" y="40" width="160" height="50" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
  <text x="620" y="70" font-size="10" font-weight="700" fill="#065f46" text-anchor="middle">Direct POST /api/create/</text>

  <!-- Offline Branch: Local Queue -->
  <rect x="310" y="210" width="160" height="50" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
  <text x="390" y="233" font-size="9.5" font-weight="700" fill="#991b1b" text-anchor="middle">Push to LocalStorage</text>
  <text x="390" y="248" font-size="7.5" fill="#7f1d1d" text-anchor="middle">(Key: pt_offline_pending_v1)</text>

  <!-- Awaiting Connection -->
  <rect x="540" y="210" width="160" height="50" rx="8" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/>
  <text x="620" y="233" font-size="9.5" font-weight="700" fill="#92400e" text-anchor="middle">Awaiting Reconnection</text>
  <text x="620" y="248" font-size="7.5" fill="#78350f" text-anchor="middle">(15s Heartbeat Polling)</text>

  <!-- Batch Sync Gateway -->
  <rect x="540" y="120" width="160" height="50" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="620" y="143" font-size="9.5" font-weight="700" fill="#1e40af" text-anchor="middle">POST /api/offline/sync/</text>
  <text x="620" y="158" font-size="7.5" fill="#1e3a8a" text-anchor="middle">(Batch Deduplication)</text>

  <!-- Final State -->
  <circle cx="790" cy="70" r="16" fill="none" stroke="#10b981" stroke-width="3"/>
  <circle cx="790" cy="70" r="10" fill="#10b981"/>
  <text x="790" y="105" font-size="9" font-weight="700" fill="#065f46" text-anchor="middle">Synchronized</text>

  <!-- Arrows -->
  <line x1="64" y1="110" x2="110" y2="110" stroke="#475569" stroke-width="1.5"/>
  <line x1="250" y1="110" x2="340" y2="110" stroke="#475569" stroke-width="1.5"/>

  <!-- Online True -->
  <line x1="390" y1="75" x2="390" y2="65" stroke="#10b981" stroke-width="1.5"/>
  <line x1="390" y1="65" x2="540" y2="65" stroke="#10b981" stroke-width="1.5"/>
  <text x="450" y="60" font-size="8" font-weight="700" fill="#047857">[Yes - Online]</text>
  <line x1="700" y1="65" x2="774" y2="68" stroke="#10b981" stroke-width="1.5"/>

  <!-- Online False -->
  <line x1="390" y1="145" x2="390" y2="210" stroke="#ef4444" stroke-width="1.5"/>
  <text x="395" y="180" font-size="8" font-weight="700" fill="#b91c1c">[No - Offline]</text>

  <!-- Connect LocalStorage to Awaiting -->
  <line x1="470" y1="235" x2="540" y2="235" stroke="#d97706" stroke-width="1.5"/>

  <!-- Connect Awaiting to Sync on 'online' event -->
  <line x1="620" y1="210" x2="620" y2="170" stroke="#2563eb" stroke-width="1.5"/>
  <text x="625" y="195" font-size="8" font-weight="700" fill="#1d4ed8">['online' fired]</text>

  <!-- Connect Sync to Synced Final -->
  <line x1="700" y1="145" x2="750" y2="145" stroke="#10b981" stroke-width="1.5"/>
  <line x1="750" y1="145" x2="780" y2="84" stroke="#10b981" stroke-width="1.5"/>
  <text x="735" y="138" font-size="7.5" fill="#047857">Purge Local Queue</text>
</svg>
`;

// Assemble the Complete HTML
console.log("Reading existing HTML file...");
let html = fs.readFileSync(path.resolve(__dirname, 'Pay_Together_FYP_Documentation.html'), 'utf-8');

// Replace Text Pre-tags with Rich SVG Visuals

// 1. Replace Figure 1-1 Gantt
html = html.replace(
  /<div class="figure-title">Figure 1-1: Gantt Chart.*?<\/div>/s,
  `<div class="figure-box">${SVG_GANTT}<div class="figure-title">Figure 1-1: Pay-Together Project Lifecycle Gantt Chart</div></div>`
);

// 2. Replace Figure 2-1 Use Case
html = html.replace(
  /<div class="figure-title">Figure 2-1: Pay-Together System Use Case Diagram.*?<\/div>/s,
  `<div class="figure-box">${SVG_USECASE}<div class="figure-title">Figure 2-1: Pay-Together UML Use Case Diagram</div></div>`
);
// In case Figure 2-1 wasn't in a figure-box earlier:
if (!html.includes('Figure 2-1: Pay-Together UML Use Case Diagram')) {
  html = html.replace(
    /<h2>2\.2 Requirement Identifying Technique<\/h2>[\s\S]*?<p>Use Case Analysis was employed as the primary requirement elicitation technique\./,
    `<h2>2.2 Requirement Identifying Technique</h2>
    <p>Use Case Analysis was employed as the primary requirement elicitation technique. Core functional capabilities were structured into formal Use Cases (UC-01 through UC-10), mapping user actions to backend services, database transactions, and user interfaces.</p>
    <div class="figure-box">${SVG_USECASE}<div class="figure-title">Figure 2-1: Pay-Together UML Use Case Diagram</div></div>`
  );
}

// 3. Replace Figure 3-1 Domain Class Model
html = html.replace(
  /<div class="figure-box">\s*<pre>[\s\S]*?<\/pre>\s*<div class="figure-title">Figure 3-1: Conceptual Domain Model Diagram<\/div>\s*<\/div>/,
  `<div class="figure-box">${SVG_CLASS}<div class="figure-title">Figure 3-1: Pay-Together Structural UML Class Diagram</div></div>`
);

// 4. Add Figure 3-2 Sequence Diagram & Figure 3-3 Architecture
html = html.replace(
  /<h2>3\.3 Architectural Design \(Multi-Tier\)<\/h2>/,
  `<h2>3.2.2 Add Expense & Limit Check Sequence Model</h2>
  <div class="figure-box">${SVG_SEQUENCE}<div class="figure-title">Figure 3-2: Add Expense and Edge-Triggered Limit Checking Sequence Diagram</div></div>
  <h2>3.3 Architectural Design (Multi-Tier)</h2>
  <div class="figure-box">${SVG_ARCH}<div class="figure-title">Figure 3-3: Pay-Together Multi-Tier Architecture Topology</div></div>`
);

// 5. Add Figure 3-4 ERD in section 3.4
html = html.replace(
  /<h2>3\.4 Relational Data Design & Comprehensive Data Dictionary<\/h2>/,
  `<h2>3.4 Relational Data Design & Entity-Relationship Model</h2>
  <div class="figure-box">${SVG_ERD}<div class="figure-title">Figure 3-4: Pay-Together Entity-Relationship (ER) Schema Diagram</div></div>
  <h2>3.4.1 Comprehensive Data Dictionary</h2>`
);

// 6. Replace Figure 3-5 Offline State Machine
html = html.replace(
  /<h2>3\.6 Behavioural Models \(Offline State Machine\)<\/h2>[\s\S]*?<pre>[\s\S]*?<\/pre>/,
  `<h2>3.6 Behavioural Models (Offline State Machine)</h2>
  <p>The offline synchronization engine operates as a deterministic state machine capturing transaction payloads during offline disconnects and batch-syncing upon reconnection:</p>
  <div class="figure-box">${SVG_STATEMACHINE}<div class="figure-title">Figure 3-5: Offline Expense Synchronization State Machine Diagram</div></div>`
);

// Write Updated HTML
const updatedHtmlPath = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.html');
fs.writeFileSync(updatedHtmlPath, html, 'utf-8');
console.log("Successfully updated Pay_Together_FYP_Documentation.html with ALL rich SVG diagrams!");

// Generate PDF via Headless Chrome
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = fs.existsSync(chromePath) ? chromePath : edgePath;

const outputPdf = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.pdf');

console.log("Compiling new PDF with all vector diagrams...");
const args = [
  '--headless',
  '--disable-gpu',
  '--run-all-compositor-stages-before-draw',
  '--no-pdf-header-footer',
  `--print-to-pdf=${outputPdf}`,
  updatedHtmlPath
];

const res = spawnSync(browser, args, { encoding: 'utf-8' });
if (fs.existsSync(outputPdf)) {
  const sizeKb = (fs.statSync(outputPdf).size / 1024).toFixed(1);
  console.log(`SUCCESS! Generated PDF with all diagrams: ${outputPdf} (${sizeKb} KB)`);
  
  // Copy to primary Downloads folder
  const downloadsPdf = 'C:\\Users\\muham\\Downloads\\Pay_Together_FYP_Documentation.pdf';
  fs.copyFileSync(outputPdf, downloadsPdf);
  console.log(`Copied updated PDF to Downloads root: ${downloadsPdf}`);
} else {
  console.error("PDF generation failed.");
}
