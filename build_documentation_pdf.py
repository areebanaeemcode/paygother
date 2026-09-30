import os
import subprocess
import sys

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Pay-Together — Final Year Project (FYP) Documentation</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4;
    margin: 22mm 18mm 22mm 18mm;
    @bottom-center {
      content: "Page " counter(page);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 9pt;
      color: #64748b;
    }
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 10.5pt;
    line-height: 1.6;
    color: #1e293b;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }

  .cover-page {
    page-break-after: always;
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    padding: 40px 20px 20px 20px;
  }

  .cover-header {
    border-bottom: 3px solid #3b82f6;
    padding-bottom: 25px;
  }

  .cover-badge {
    display: inline-block;
    padding: 6px 16px;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 10pt;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .cover-title {
    font-size: 28pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.25;
    margin: 0 0 15px 0;
  }

  .cover-subtitle {
    font-size: 14pt;
    color: #475569;
    font-weight: 500;
    max-width: 680px;
    margin: 0 auto;
    line-height: 1.5;
  }

  .cover-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 25px;
    text-align: left;
    max-width: 650px;
    margin: 30px auto;
  }

  .cover-meta-item h4 {
    margin: 0 0 5px 0;
    font-size: 9.5pt;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .cover-meta-item p {
    margin: 0;
    font-size: 11pt;
    font-weight: 600;
    color: #0f172a;
  }

  .cover-footer {
    font-size: 9.5pt;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 20px;
  }

  .page-break {
    page-break-after: always;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #0f172a;
    font-weight: 700;
    page-break-after: avoid;
  }

  h1 {
    font-size: 20pt;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-top: 36px;
    margin-bottom: 18px;
    color: #1e3a8a;
  }

  h2 {
    font-size: 14pt;
    margin-top: 26px;
    margin-bottom: 12px;
    color: #2563eb;
  }

  h3 {
    font-size: 12pt;
    margin-top: 20px;
    margin-bottom: 10px;
    color: #334155;
  }

  h4 {
    font-size: 11pt;
    margin-top: 16px;
    margin-bottom: 8px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    text-align: justify;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 14px;
    padding-left: 24px;
  }

  li {
    margin-bottom: 6px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 14px;
    margin-bottom: 20px;
    font-size: 9pt;
    page-break-inside: avoid;
  }

  th, td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    vertical-align: top;
    text-align: left;
  }

  th {
    background-color: #f1f5f9;
    font-weight: 700;
    color: #1e293b;
  }

  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  .table-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #475569;
    margin-top: 10px;
    margin-bottom: 4px;
  }

  .figure-box {
    margin: 18px 0;
    padding: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    page-break-inside: avoid;
  }

  .figure-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #475569;
    margin-top: 8px;
    text-align: center;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 14px;
    border-radius: 6px;
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 8.5pt;
    line-height: 1.45;
    overflow-x: auto;
    page-break-inside: avoid;
    margin: 12px 0 16px 0;
  }

  code {
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 9pt;
    background: #f1f5f9;
    padding: 2px 5px;
    border-radius: 4px;
    color: #be185d;
  }

  pre code {
    background: transparent;
    padding: 0;
    color: #f8fafc;
  }

  .alert-box {
    padding: 12px 16px;
    border-radius: 6px;
    margin: 14px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }

  .alert-info {
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    color: #1e40af;
  }

  .alert-success {
    background: #ecfdf5;
    border-left: 4px solid #10b981;
    color: #065f46;
  }

  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 8pt;
    text-transform: uppercase;
  }

  .badge-high { background: #fee2e2; color: #b91c1c; }
  .badge-medium { background: #fef3c7; color: #b45309; }
  .badge-pass { background: #dcfce7; color: #15803d; }

  .toc-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px dotted #cbd5e1;
    font-size: 9.5pt;
  }

  .toc-title { font-weight: 600; color: #1e293b; }
  .toc-dots { flex-grow: 1; margin: 0 8px; border-bottom: 1px dotted #94a3b8; height: 14px; }
  .toc-page { color: #64748b; font-weight: 600; }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
  <div class="cover-header">
    <div class="cover-badge">FINAL YEAR PROJECT (FYP) REPORT</div>
    <h1 class="cover-title">PAY-TOGETHER</h1>
    <p class="cover-subtitle">A Collaborative Web-Based Expense Management, Spending Limit Alerting, and Debt Settlement System for Group Travel</p>
  </div>

  <div class="cover-meta-grid">
    <div class="cover-meta-item">
      <h4>Platform Architecture</h4>
      <p>Django 6.0 & DRF REST API</p>
    </div>
    <div class="cover-meta-item">
      <h4>Client Architecture</h4>
      <p>Modular JS, Tailwind & Chart.js</p>
    </div>
    <div class="cover-meta-item">
      <h4>Document Version</h4>
      <p>1.0 (Comprehensive)</p>
    </div>
    <div class="cover-meta-item">
      <h4>Target Audience</h4>
      <p>Academic Review Board & Evaluators</p>
    </div>
  </div>

  <div class="cover-footer">
    <p><strong>Department of Computer Science & Software Engineering</strong><br>
    Final Year Project Documentation & System Specification &bull; Session 2025–2026</p>
  </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="page-break">
  <h1>Table of Contents</h1>
  
  <div class="toc-row"><span class="toc-title">1. Introduction</span><span class="toc-dots"></span><span class="toc-page">1</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">1.1 Problem Statement</span><span class="toc-dots"></span><span class="toc-page">1</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">1.2 Problem Solution</span><span class="toc-dots"></span><span class="toc-page">1</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">1.3 Objectives of Proposed System</span><span class="toc-dots"></span><span class="toc-page">2</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">1.4 Scope</span><span class="toc-dots"></span><span class="toc-page">2</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">1.5 System Components</span><span class="toc-dots"></span><span class="toc-page">3</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">1.6 Related System Analysis</span><span class="toc-dots"></span><span class="toc-page">3</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">1.7 Vision Statement</span><span class="toc-dots"></span><span class="toc-page">4</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">1.8 System Limitations and Constraints</span><span class="toc-dots"></span><span class="toc-page">4</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">1.9 Tools and Technologies</span><span class="toc-dots"></span><span class="toc-page">4</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">1.10 Project Deliverables & Planning</span><span class="toc-dots"></span><span class="toc-page">5</span></div>

  <div class="toc-row"><span class="toc-title">2. Requirements Analysis</span><span class="toc-dots"></span><span class="toc-page">6</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">2.1 User Classes and Characteristics</span><span class="toc-dots"></span><span class="toc-page">6</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">2.2 Requirement Identifying Technique</span><span class="toc-dots"></span><span class="toc-page">6</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">2.3 Functional Requirements (FR-01 to FR-15)</span><span class="toc-dots"></span><span class="toc-page">7</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">2.4 Non-Functional Requirements</span><span class="toc-dots"></span><span class="toc-page">11</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">2.5 External Interface Requirements</span><span class="toc-dots"></span><span class="toc-page">12</span></div>

  <div class="toc-row"><span class="toc-title">3. System Design and Architecture</span><span class="toc-dots"></span><span class="toc-page">13</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">3.1 Design Considerations</span><span class="toc-dots"></span><span class="toc-page">13</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">3.2 Structural Models & Class Diagrams</span><span class="toc-dots"></span><span class="toc-page">13</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">3.3 Architectural Design (Multi-Tier)</span><span class="toc-dots"></span><span class="toc-page">15</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">3.4 Relational Data Design & ER Schema</span><span class="toc-dots"></span><span class="toc-page">16</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">3.4.1 Comprehensive Data Dictionary</span><span class="toc-dots"></span><span class="toc-page">17</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">3.5 User Interface Design & Screen Objects</span><span class="toc-dots"></span><span class="toc-page">19</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">3.6 Behavioural Models (Offline State Machine)</span><span class="toc-dots"></span><span class="toc-page">20</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">3.7 Key Architectural Decisions</span><span class="toc-dots"></span><span class="toc-page">21</span></div>

  <div class="toc-row"><span class="toc-title">4. Implementation</span><span class="toc-dots"></span><span class="toc-page">22</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">4.1 Core Algorithms & Mathematical Logic</span><span class="toc-dots"></span><span class="toc-page">22</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">4.2 External APIs, SDKs and Libraries</span><span class="toc-dots"></span><span class="toc-page">26</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">4.3 Code Repository Metrics</span><span class="toc-dots"></span><span class="toc-page">27</span></div>

  <div class="toc-row"><span class="toc-title">5. Testing and Evaluation</span><span class="toc-dots"></span><span class="toc-page">28</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">5.1 Unit Testing (UT-01 to UT-04)</span><span class="toc-dots"></span><span class="toc-page">28</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">5.2 Functional Testing (FT-01 to FT-06)</span><span class="toc-dots"></span><span class="toc-page">29</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">5.3 Integration Testing (IT-01 to IT-03)</span><span class="toc-dots"></span><span class="toc-page">31</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">5.4 Performance Testing & Empirical Benchmarks</span><span class="toc-dots"></span><span class="toc-page">32</span></div>

  <div class="toc-row"><span class="toc-title">6. System Conversion and Deployment</span><span class="toc-dots"></span><span class="toc-page">33</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">6.1 Direct Cutover Methodology</span><span class="toc-dots"></span><span class="toc-page">33</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">6.2 Production Server Topology & Deployment</span><span class="toc-dots"></span><span class="toc-page">33</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">6.3 Comprehensive User Operations Manual</span><span class="toc-dots"></span><span class="toc-page">34</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">6.4 Development Challenges & Engineering Solutions</span><span class="toc-dots"></span><span class="toc-page">36</span></div>

  <div class="toc-row"><span class="toc-title">7. Conclusion and Future Work</span><span class="toc-dots"></span><span class="toc-page">37</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">7.1 Objective Evaluation Matrix</span><span class="toc-dots"></span><span class="toc-page">37</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">7.2 Complete Requirement Traceability Matrix (RTM)</span><span class="toc-dots"></span><span class="toc-page">38</span></div>
  <div class="toc-row" style="padding-left: 15px;"><span class="toc-title">7.3 Conclusion & Future Directions</span><span class="toc-dots"></span><span class="toc-page">39</span></div>

  <div class="toc-row"><span class="toc-title">References</span><span class="toc-dots"></span><span class="toc-page">40</span></div>
  <div class="toc-row"><span class="toc-title">Appendix A: Fully Dressed Use Cases (UC-01 to UC-10)</span><span class="toc-dots"></span><span class="toc-page">41</span></div>
  <div class="toc-row"><span class="toc-title">Appendix B: Coding Standards & Guidelines</span><span class="toc-dots"></span><span class="toc-page">46</span></div>
  <div class="toc-row"><span class="toc-title">Appendix C: Application Prototype & Layouts</span><span class="toc-dots"></span><span class="toc-page">48</span></div>
</div>

<!-- CHAPTER 1: INTRODUCTION -->
<div class="page-break">
  <h1>Chapter 1: Introduction</h1>
  
  <h2>1. Introduction</h2>
  <p><strong>Pay-Together</strong> is a comprehensive web-based platform specifically engineered to streamline collaborative expense management, budgetary control, and multi-party financial settlement during group travel and shared excursions. When groups travel, expenses are incurred by multiple individuals across different channels (cash, bank transfers, credit cards) for varying trip activities including lodging, transport, food, shopping, and tours. Managing these financial transactions manually through spreadsheets, paper receipts, or group chat messaging is inefficient, prone to arithmetic errors, and often leads to disputes.</p>
  <p>Pay-Together resolves these issues by establishing a centralized workspace for each tour. The system features automated alphanumeric join tokens (e.g., <code>HUN102</code>), customizable expense splits, digital receipt archiving, heuristic category recommendations (Smart Expense), edge-triggered spending limit notifications, a client-side offline queue with automated background sync, and an automated greedy debt-minimization settlement engine.</p>

  <h2>1.1 Problem Statement</h2>
  <p>Managing group finances during shared travel presents several operational challenges:</p>
  <ul>
    <li><strong>Dispersed & Disorganized Records:</strong> Tour participants pay out-of-pocket at irregular intervals. Without a centralized ledger, tracking who paid, how much was paid, and how the cost should be divided becomes error-prone.</li>
    <li><strong>Misplaced Proof of Payment:</strong> Physical paper receipts collected during travel are frequently lost or damaged, preventing transparent audits.</li>
    <li><strong>Lack of Real-Time Budgetary Visibility:</strong> Travelers often exceed personal travel budgets without realizing their cumulative spending until the trip concludes.</li>
    <li><strong>Unreliable Transit Connectivity:</strong> Remote tourist destinations often lack reliable cellular internet. Web applications that depend on continuous connectivity cannot log expenses at the point of purchase.</li>
    <li><strong>Complex Multi-Party Debt Reconciliation:</strong> Manually calculating who owes whom across <i>N</i> participants results in redundant, circular transactions and interpersonal tension.</li>
  </ul>

  <h2>1.2 Problem Solution</h2>
  <p>Pay-Together delivers an integrated web application that addresses each of these challenges:</p>
  <ul>
    <li><strong>Shared Tour Workspaces:</strong> Users create workspaces that generate unique, 6-character alphanumeric tokens (e.g., <code>SKD101</code>) and shareable join links for quick onboarding.</li>
    <li><strong>Itemized Expense Logging with Proof:</strong> Members log expenses with category tags, payment methods, and optional digital receipt image uploads for auditing.</li>
    <li><strong>Smart Expense Recommendations:</strong> An integrated recommendation engine uses keyword heuristic matching and historical tour spending patterns to suggest categories and warn users when a single category exceeds 30% of total tour funds.</li>
    <li><strong>Edge-Triggered Limit Alerts:</strong> Users configure personal spending limits. When an expense causes a user's total spending to cross their limit, the system dispatches an alert without sending duplicate notifications on subsequent expenses.</li>
    <li><strong>Client-Side Offline Queuing:</strong> Leveraging browser <code>localStorage</code>, expenses added while offline are queued with unique client UUIDs and automatically synced to the server upon reconnection.</li>
    <li><strong>Greedy Debt Settlement Engine:</strong> The system computes net balances for all members and runs a greedy matching algorithm between maximum creditors and maximum debtors, balancing all accounts with the minimum number of transactions.</li>
  </ul>

  <h2>1.3 Objectives of the Proposed System</h2>
  <ol>
    <li>Deliver a unified, responsive web platform for collaborative travel expense tracking.</li>
    <li>Provide fast tour creation with alphanumeric join tokens and direct URL invites.</li>
    <li>Support multi-user expense entry with equal and custom split options.</li>
    <li>Provide verifiable receipt image uploads with administrative audit checkmarks.</li>
    <li>Implement heuristic category suggestions and high-spend (&ge; 30%) alerts.</li>
    <li>Enforce personal spending limits via edge-triggered notifications.</li>
    <li>Provide reliable offline expense logging with automated background synchronization.</li>
    <li>Calculate optimized debt settlements using a greedy minimization algorithm.</li>
    <li>Render interactive category-wise spending analytics using Chart.js.</li>
    <li>Secure application endpoints using dual-layer authentication (JWT and Django sessions) and administrative gate-pass protection.</li>
  </ol>

  <h2>1.4 Scope</h2>
  <p><strong>In Scope:</strong> User account registration, secure authentication, tour creation and token onboarding, expense tracking with split options, receipt management, smart categorization, spending limit alerts, offline transaction caching, greedy debt settlement, and category analytics dashboards.</p>
  <p><strong>Out of Scope:</strong> Direct bank-to-bank electronic fund transfers (ACH/wire payouts) and automated live currency market trading.</p>

  <h2>1.5 System Components</h2>
  <p>Pay-Together is architected into 11 modular components:</p>
  <ol>
    <li><strong>User Management:</strong> User registration, PBKDF2 SHA-256 password hashing, profile management, and dual-layer session/JWT authentication.</li>
    <li><strong>Tour Management:</strong> Tour workspace lifecycle (planned, ongoing, completed, cancelled), alphanumeric join tokens, and member roster management.</li>
    <li><strong>Expense Management:</strong> Financial ledger recording, category tagging, payment method selection, and custom split calculations.</li>
    <li><strong>Receipt Management:</strong> Multipart file handling (via Pillow), image validation, and audit verification flags.</li>
    <li><strong>Smart Expense Engine:</strong> Keyword analysis and historical frequency scoring for category recommendations and runaway spend detection.</li>
    <li><strong>Expense Limit Engine:</strong> Tour-scoped user spending ceilings with edge-triggered notifications.</li>
    <li><strong>Offline Mode & Sync Engine:</strong> Browser local queue storage (<code>pt_offline_pending_v1</code>) and 15-second heartbeat synchronization.</li>
    <li><strong>Notification Hub:</strong> In-app activity notifications with read/unread status tracking.</li>
    <li><strong>Settlement Engine:</strong> Net-zero balance resolution and greedy bipartite debt minimization.</li>
    <li><strong>Analytics Engine:</strong> Aggregated reporting and interactive Chart.js visualizations.</li>
    <li><strong>Admin Gate Module:</strong> Administrative telemetry dashboard protected by brute-force access-pass middleware.</li>
  </ol>

  <h2>1.6 Related System Analysis</h2>
  <div class="table-title">Table 1-1: Comparative Feature Matrix</div>
  <table>
    <tr>
      <th>Evaluation Feature</th>
      <th>Splitwise</th>
      <th>Tricount</th>
      <th>Pay-Together (Proposed Solution)</th>
    </tr>
    <tr>
      <td><strong>Core Focus</strong></td>
      <td>General household / roommate recurring splits</td>
      <td>Quick, informal group expense shares</td>
      <td>Full group travel lifecycle with budget controls</td>
    </tr>
    <tr>
      <td><strong>Spending Limits</strong></td>
      <td>No individual trip budget alerts in free tier</td>
      <td>No custom personal spending limits</td>
      <td>Personal spending limits with edge-triggered alerts</td>
    </tr>
    <tr>
      <td><strong>Receipt Verification</strong></td>
      <td>OCR features restricted to paid tier</td>
      <td>Basic image upload without audit flags</td>
      <td>Receipt uploads with member audit checkmarks</td>
    </tr>
    <tr>
      <td><strong>Smart Recommendations</strong></td>
      <td>Static category dropdown</td>
      <td>Static category selector</td>
      <td>Keyword heuristics, history suggestions & high-spend (&ge; 30%) alerts</td>
    </tr>
    <tr>
      <td><strong>Offline Fault Tolerance</strong></td>
      <td>App-level caching requiring manual retry</td>
      <td>Manual sync trigger upon reconnect</td>
      <td>Heartbeat background sync with client UUID deduplication</td>
    </tr>
    <tr>
      <td><strong>Admin Security Gate</strong></td>
      <td>Standard consumer login</td>
      <td>Standard email magic-link</td>
      <td>Dual JWT/Session auth with brute-force access-pass gate</td>
    </tr>
  </table>

  <h2>1.7 Vision Statement</h2>
  <div class="alert-box alert-info">
    <strong>Vision Statement:</strong> For travelers, backpackers, and tour organizers who require an accurate, reliable method to manage shared travel finances, <strong>Pay-Together</strong> is a responsive web application that centralizes trip expenses, enforces spending discipline, digitizes receipts, supports intermittent offline use, and automates debt settlement. Unlike generic split tools or manual spreadsheets, Pay-Together combines automated debt minimization, personal limit threshold alerts, heuristic category recommendations, and resilient offline synchronization into a single interface.
  </div>

  <h2>1.8 System Limitations and Constraints</h2>
  <ul>
    <li><strong>Non-Banking Constraint:</strong> Pay-Together calculates settlement transfer amounts but does not execute direct electronic fund transfers between bank accounts.</li>
    <li><strong>Offline Browser Storage Quota:</strong> Client-side caching utilizes HTML5 <code>localStorage</code> (typically 5MB per domain), which supports thousands of pending JSON expense payloads but queues receipt image uploads until network connectivity is restored.</li>
    <li><strong>Receipt Image Quality:</strong> While image formats are validated, the system cannot correct low-resolution or illegible source receipts uploaded by users.</li>
  </ul>

  <h2>1.9 Tools and Technologies</h2>
  <div class="table-title">Table 1-2: Core Technology Stack</div>
  <table>
    <tr>
      <th>Layer / Tool</th>
      <th>Exact Version</th>
      <th>Architectural Role & Justification</th>
    </tr>
    <tr>
      <td><strong>Python</strong></td>
      <td>3.10+</td>
      <td>Server-side runtime offering clean syntax and extensive ecosystem support.</td>
    </tr>
    <tr>
      <td><strong>Django Framework</strong></td>
      <td>6.0.7</td>
      <td>Web framework providing ORM, template engine, and authentication middleware.</td>
    </tr>
    <tr>
      <td><strong>Django REST Framework</strong></td>
      <td>3.17.1</td>
      <td>RESTful API toolkit providing model serializers and permission validation.</td>
    </tr>
    <tr>
      <td><strong>SimpleJWT</strong></td>
      <td>5.5.1</td>
      <td>Token provider issuing access and refresh tokens for stateless API calls.</td>
    </tr>
    <tr>
      <td><strong>Relational Database</strong></td>
      <td>SQLite 3 / MySQL 8.0</td>
      <td>ACID-compliant relational database managing financial records.</td>
    </tr>
    <tr>
      <td><strong>Pillow</strong></td>
      <td>12.3.0</td>
      <td>Python imaging library for receipt validation, formatting, and storage.</td>
    </tr>
    <tr>
      <td><strong>Tailwind CSS</strong></td>
      <td>3.4.x (CDN)</td>
      <td>Utility-first CSS framework enabling a responsive layout with dark mode.</td>
    </tr>
    <tr>
      <td><strong>Chart.js</strong></td>
      <td>4.4.0 (UMD)</td>
      <td>Client-side visualization library rendering interactive category charts.</td>
    </tr>
    <tr>
      <td><strong>Font Awesome</strong></td>
      <td>6.5.1</td>
      <td>Vector iconography toolkit for UI navigation, categories, and alerts.</td>
    </tr>
  </table>

  <h2>1.10 Project Deliverables & Planning</h2>
  <p>The primary project deliverables include: (1) Complete Django/JavaScript application codebase, (2) Software Requirements Specification (SRS), (3) System Architecture & Design Document, (4) Relational database migrations, (5) Automated unit, functional, integration, and performance test suites, (6) System conversion and deployment guide, and (7) Formatted academic FYP documentation.</p>
</div>

<!-- CHAPTER 2: REQUIREMENTS ANALYSIS -->
<div class="page-break">
  <h1>Chapter 2: Requirements Analysis</h1>
  
  <h2>2.1 User Classes and Characteristics</h2>
  <ul>
    <li><strong>Registered User:</strong> Authenticated account holder capable of creating tours, joining tours via tokens, setting personal spending limits, and tracking personal expenses.</li>
    <li><strong>Tour Creator:</strong> The user who initiates a tour workspace. In addition to standard member capabilities, creators can edit tour details, invite/remove participants, modify member roles, and verify receipts.</li>
    <li><strong>Tour Member:</strong> An enrolled participant who logs expenses, uploads receipts, customizes splits, and views settlement transfers.</li>
    <li><strong>System Administrator:</strong> Privileged user who accesses the administrative telemetry dashboard via the secure gate pass to monitor global users, active tours, and platform health.</li>
  </ul>

  <h2>2.2 Requirement Identifying Technique</h2>
  <p>Use Case Analysis was employed as the primary requirement elicitation technique. Core functional capabilities were structured into 10 formal Use Cases (UC-01 through UC-10), mapping user actions to backend services, database transactions, and user interfaces.</p>

  <h2>2.3 Functional Requirements (FR-01 to FR-15)</h2>
  
  <div class="table-title">Table 2-1: FR-01 User Account Registration</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-01</td></tr>
    <tr><th>Title</th><td>User Account Registration</td></tr>
    <tr><th>Requirement</th><td>The system shall allow an unauthenticated user to register an account by providing first name, last name, unique email address, unique phone number, and a secure password.</td></tr>
    <tr><th>Source / Rationale</th><td>Core Architecture &bull; User identities are required to assign financial liabilities and tour memberships.</td></tr>
    <tr><th>Business Rule</th><td>Email and phone numbers must be unique across the platform. Passwords must contain at least 8 characters.</td></tr>
    <tr><th>Dependencies / Priority</th><td>None &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-2: FR-02 User Authentication & Dual Sessioning</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-02</td></tr>
    <tr><th>Title</th><td>User Authentication and Dual Token/Session Issuance</td></tr>
    <tr><th>Requirement</th><td>The system shall authenticate user credentials and issue both an HTTP-only Django session cookie and SimpleJWT access/refresh tokens for subsequent API interactions.</td></tr>
    <tr><th>Source / Rationale</th><td>System Architecture Specification &bull; Dual authentication provides seamless server-rendered HTML transitions while enabling stateless REST API calls.</td></tr>
    <tr><th>Business Rule</th><td>Failed attempts must display generic error messages to prevent username enumeration. JWT access tokens expire after 7 days; refresh tokens expire after 30 days.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-01 &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-3: FR-03 Tour Workspace Creation</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-03</td></tr>
    <tr><th>Title</th><td>Tour Workspace Creation</td></tr>
    <tr><th>Requirement</th><td>The system shall allow an authenticated user to create a tour by specifying title, destination, estimated total budget, start date, end date, and an optional description.</td></tr>
    <tr><th>Source / Rationale</th><td>User Class: Registered User &bull; Groups require a discrete workspace to aggregate participants, costs, and settlements.</td></tr>
    <tr><th>Business Rule</th><td>The user who creates the tour is automatically assigned the <code>creator</code> role and added as the initial member.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-02 &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-4: FR-04 Alphanumeric Join Token Generation</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-04</td></tr>
    <tr><th>Title</th><td>Unique Alphanumeric Token & Join URL Generation</td></tr>
    <tr><th>Requirement</th><td>Upon tour creation, the system shall automatically generate a unique, uppercase alphanumeric token (e.g., <code>HUN102</code>) derived from destination initials plus random integers, along with an invitation URL (<code>/client/tours/join/&lt;token&gt;/</code>).</td></tr>
    <tr><th>Source / Rationale</th><td>System Operational Requirement &bull; Allows friction-free member onboarding without requiring manual email invitations.</td></tr>
    <tr><th>Business Rule</th><td>Tokens must be unique across all active tours and case-insensitive on lookup.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-03 &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-5: FR-05 Tour Membership Onboarding</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-05</td></tr>
    <tr><th>Title</th><td>Tour Membership Onboarding</td></tr>
    <tr><th>Requirement</th><td>The system shall allow an authenticated user to join an existing tour workspace by submitting its unique join token or accessing its invitation URL.</td></tr>
    <tr><th>Source / Rationale</th><td>User Class: Registered User &bull; Enables invited travelers to join the tour's shared ledger.</td></tr>
    <tr><th>Business Rule</th><td>Duplicate memberships for the same user within the same tour are rejected with an idempotent message.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-02, FR-04 &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-6: FR-06 Collaborative Expense Creation</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-06</td></tr>
    <tr><th>Title</th><td>Collaborative Expense Creation</td></tr>
    <tr><th>Requirement</th><td>The system shall allow any verified member of a tour to record an expenditure by submitting amount, category, payment method, title, notes, and the paying member ID.</td></tr>
    <tr><th>Source / Rationale</th><td>User Class: Tour Member &bull; The core financial tracking function of the platform.</td></tr>
    <tr><th>Business Rule</th><td>The expense amount must be greater than zero. The payer must be an active member of the tour.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-05 &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-7: FR-07 Expense Share Distribution Management</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-07</td></tr>
    <tr><th>Title</th><td>Expense Share Distribution Management</td></tr>
    <tr><th>Requirement</th><td>The system shall automatically split the expense amount equally among all tour members by default, while supporting custom user-defined split amounts that sum to the total expense amount.</td></tr>
    <tr><th>Source / Rationale</th><td>Financial Integrity Requirement &bull; Accommodates scenarios where some members do not participate in specific activities or meals.</td></tr>
    <tr><th>Business Rule</th><td>The sum of all individual split amounts in an expense must equal the total expense amount within a margin of 0.01.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-06 &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-8: FR-08 Digital Receipt Management & Audit Verification</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-08</td></tr>
    <tr><th>Title</th><td>Digital Receipt Management & Audit Verification</td></tr>
    <tr><th>Requirement</th><td>The system shall allow members to attach an image file (JPEG, PNG, WebP) to an expense record, and allow tour creators or payers to toggle receipt verification status.</td></tr>
    <tr><th>Source / Rationale</th><td>Transparency & Auditing Requirement &bull; Provides verifiable proof of purchase to resolve discrepancies during settlement.</td></tr>
    <tr><th>Business Rule</th><td>Uploaded files must be verified as valid image formats and stored under year/month directory paths.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-06 &bull; <span class="badge badge-medium">Medium</span></td></tr>
  </table>

  <div class="table-title">Table 2-9: FR-09 Heuristic Category Recommendation & High-Spend Alerts</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-09</td></tr>
    <tr><th>Title</th><td>Heuristic Category Recommendation & High-Spend Alerts</td></tr>
    <tr><th>Requirement</th><td>The system shall evaluate transaction titles and notes against keyword dictionaries, fallback to historical category frequencies, and highlight categories that exceed 30% of total tour spending.</td></tr>
    <tr><th>Source / Rationale</th><td>Smart Architecture Requirement &bull; Reduces categorization errors and highlights runaway spending areas.</td></tr>
    <tr><th>Business Rule</th><td>Categories exceeding &ge; 30% of total tour expenditures trigger a high-spend warning badge on the dashboard.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-06 &bull; <span class="badge badge-medium">Medium</span></td></tr>
  </table>

  <div class="table-title">Table 2-10: FR-10 Personal Tour Spending Ceilings</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-10</td></tr>
    <tr><th>Title</th><td>Personal Tour Spending Ceilings</td></tr>
    <tr><th>Requirement</th><td>The system shall allow an individual tour member to define, update, or remove a personal spending limit for a specific tour.</td></tr>
    <tr><th>Source / Rationale</th><td>Budget Control Requirement &bull; Protects individual members from exceeding their personal travel budgets.</td></tr>
    <tr><th>Business Rule</th><td>Limits are user- and tour-specific. Limit values must be positive numeric amounts.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-05 &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-11: FR-11 Edge-Triggered Over-Limit Notification</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-11</td></tr>
    <tr><th>Title</th><td>Edge-Triggered Over-Limit Notification</td></tr>
    <tr><th>Requirement</th><td>After any expense creation, modification, or deletion, the system shall compute the payer's aggregate expenditure against their spending limit, dispatching a notification upon first breach.</td></tr>
    <tr><th>Source / Rationale</th><td>Automated Notification Requirement &bull; Alerting users the moment they exceed their limit prevents further accidental overspending.</td></tr>
    <tr><th>Business Rule</th><td>To prevent notification spam, notifications are dispatched only on the transition from unbreached to breached (<code>last_notified_exceeded = False</code> &rarr; <code>True</code>).</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-06, FR-10 &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-12: FR-12 Offline Transaction Caching</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-12</td></tr>
    <tr><th>Title</th><td>Offline Transaction Caching</td></tr>
    <tr><th>Requirement</th><td>During network disconnects, the system shall catch failed network requests, generate unique client-side UUIDs, and store expense payloads in browser <code>localStorage</code>.</td></tr>
    <tr><th>Source / Rationale</th><td>Resilient Transit Architecture &bull; Ensures travelers can continue recording expenses in areas without internet connectivity.</td></tr>
    <tr><th>Business Rule</th><td>Cached records must be preserved across browser reloads and tab closures.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-06 &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-13: FR-13 Offline Queue Background Auto-Sync</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-13</td></tr>
    <tr><th>Title</th><td>Offline Queue Background Auto-Sync</td></tr>
    <tr><th>Requirement</th><td>The system shall monitor online/offline browser events and run a periodic 15-second heartbeat to flush pending transactions to <code>/client/api/offline/sync-expenses/</code> upon reconnection.</td></tr>
    <tr><th>Source / Rationale</th><td>Data Synchronization Requirement &bull; Eliminates the need for manual synchronization once network connectivity returns.</td></tr>
    <tr><th>Business Rule</th><td>Synchronization operations must be idempotent and remove only successfully written records from the client queue.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-12 &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-14: FR-14 Greedy Settlement Debt Minimization</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-14</td></tr>
    <tr><th>Title</th><td>Greedy Settlement & Debt Minimization Calculation</td></tr>
    <tr><th>Requirement</th><td>The system shall calculate each member's net balance (Paid &minus; Owed) and apply a greedy matching algorithm to balance all accounts using the minimal number of direct transfers.</td></tr>
    <tr><th>Source / Rationale</th><td>Mathematical Optimization Requirement &bull; Eliminates redundant circular payments among group members.</td></tr>
    <tr><th>Business Rule</th><td>The sum of all net balances must equal zero (&sum; Net = 0). Transfers match the largest debtor with the largest creditor iteratively.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-06, FR-07 &bull; <span class="badge badge-high">High</span></td></tr>
  </table>

  <div class="table-title">Table 2-15: FR-15 Visual Expense Analytics & Reporting</div>
  <table>
    <tr><th style="width:25%">Identifier</th><td>FR-15</td></tr>
    <tr><th>Title</th><td>Visual Expense Analytics & Reporting</td></tr>
    <tr><th>Requirement</th><td>The system shall calculate aggregated category totals, counts, and percentages for both individual tours and global user histories, rendering interactive charts via Chart.js.</td></tr>
    <tr><th>Source / Rationale</th><td>Visual Telemetry Requirement &bull; Helps users quickly understand spending patterns through visual breakdowns.</td></tr>
    <tr><th>Business Rule</th><td>Chart palettes must remain consistent across category types, sorting categories by expenditure descending.</td></tr>
    <tr><th>Dependencies / Priority</th><td>FR-06 &bull; <span class="badge badge-medium">Medium</span></td></tr>
  </table>

  <h2>2.4 Non-Functional Requirements</h2>
  <ul>
    <li><strong>Reliability & Consistency:</strong> All financial and split mutations are executed inside atomic database transactions (<code>@transaction.atomic</code>), ensuring no partial ledger states occur during server or network interruptions.</li>
    <li><strong>Usability:</strong> Responsive design across mobile (375px+), tablet, and desktop (1920px) viewports using Tailwind CSS, complete with accessible form labels and validation messages.</li>
    <li><strong>Performance:</strong> Critical endpoints (Dashboard rendering, Expense creation, Settlement calculations) execute with sub-100ms server latency under typical project loads.</li>
    <li><strong>Security:</strong> Cryptographic password protection via PBKDF2 with SHA-256, role-based access control, CSRF tokens on forms, and brute-force protection on administrative portals.</li>
  </ul>

  <h2>2.5 External Interface Requirements</h2>
  <p>The platform interfaces with modern web browsers supporting ES6+ JavaScript, Canvas APIs for Chart.js rendering, and HTML5 <code>localStorage</code> for offline caching. Server-side processing runs on Python 3.10+ and Django 6.0.7 communicating with an ACID-compliant relational database (SQLite/MySQL).</p>
</div>

<!-- CHAPTER 3: SYSTEM DESIGN AND ARCHITECTURE -->
<div class="page-break">
  <h1>Chapter 3: System Design and Architecture</h1>
  
  <h2>3.1 Design Considerations</h2>
  <p>Pay-Together was designed to maintain data consistency, handle intermittent network connectivity, and provide responsive user feedback. Financial calculations use Python's fixed-point <code>Decimal</code> type (quantized to two decimal places, <code>Decimal('0.01')</code>) to prevent IEEE-754 floating-point rounding errors. Multi-table writes are wrapped in atomic transactions, and offline transaction caching handles travel connectivity drops.</p>

  <h2>3.2 Structural Models & Class Diagrams</h2>
  <div class="figure-box">
    <pre>
+---------------------+           +------------------------+
|        User         |           |          Tour          |
+---------------------+           +------------------------+
| id: int             |1        * | id: int                |
| email: string       |<--------->| title: string          |
| first_name: string  | creates   | destination: string    |
| last_name: string   |           | budget: decimal        |
| password: hash      |           | join_token: string(6)  |
+---------------------+           +------------------------+
        | 1                               | 1
        |                                 |
        | *                               | *
+---------------------+           +------------------------+
|     TourMember      |           |        Expense         |
+---------------------+           +------------------------+
| id: int             |           | id: int                |
| role: string        |           | amount: decimal        |
| joined_at: datetime |           | category: string       |
+---------------------+           | payment_method: string |
                                  +------------------------+
                                          | 1          | 1
                                          |            |
                                          | *          | 0..1
                                  +-----------------+ +---------------+
                                  |  ExpenseSplit   | |    Receipt    |
                                  +-----------------+ +---------------+
                                  | user: FK(User)  | | image: path   |
                                  | share: decimal  | | verified: bool|
                                  +-----------------+ +---------------+
    </pre>
    <div class="figure-title">Figure 3-1: Conceptual Domain Model Diagram</div>
  </div>

  <h2>3.3 Architectural Design (Multi-Tier)</h2>
  <p>The platform follows a three-tier web application architecture:</p>
  <ul>
    <li><strong>Presentation Tier:</strong> HTML5 templates with Tailwind CSS, custom animations, Chart.js canvases, and modular client-side JavaScript controllers (<code>tour_detail.js</code>, <code>offline.js</code>, <code>settlement.js</code>).</li>
    <li><strong>Application Service Tier:</strong> Django 6.0 and Django REST Framework handling business logic, user authentication, role enforcement (<code>IsTourMember</code>), and algorithm execution.</li>
    <li><strong>Data Persistence Tier:</strong> Relational database (SQLite/MySQL) managing relational integrity, along with file storage for receipt media assets.</li>
  </ul>

  <h2>3.4 Relational Data Design & Comprehensive Data Dictionary</h2>
  <div class="table-title">Table 3-1: Relational Database Schema & Data Dictionary</div>
  <table>
    <tr>
      <th>Table Name</th>
      <th>Field Name</th>
      <th>Type & Length</th>
      <th>Constraints</th>
      <th>Description</th>
    </tr>
    <tr>
      <td><strong>users</strong></td>
      <td><code>id</code></td>
      <td>BigInt</td>
      <td>PK, Auto Inc</td>
      <td>Unique identifier for registered user.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>email</code></td>
      <td>VarChar(254)</td>
      <td>Unique, Not Null</td>
      <td>Account login email address.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>phone_number</code></td>
      <td>VarChar(15)</td>
      <td>Unique, Not Null</td>
      <td>Contact phone number.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>first_name</code> / <code>last_name</code></td>
      <td>VarChar(100)</td>
      <td>Not Null</td>
      <td>User's given name and family surname.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>password</code></td>
      <td>VarChar(128)</td>
      <td>Not Null</td>
      <td>PBKDF2 SHA-256 hashed password string.</td>
    </tr>
    <tr>
      <td><strong>apps_tours_tour</strong></td>
      <td><code>id</code></td>
      <td>BigInt</td>
      <td>PK, Auto Inc</td>
      <td>Unique tour workspace ID.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>title</code></td>
      <td>VarChar(255)</td>
      <td>Not Null</td>
      <td>Descriptive title of the tour.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>destination</code></td>
      <td>VarChar(255)</td>
      <td>Not Null</td>
      <td>Target travel destination.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>budget</code></td>
      <td>Decimal(12,2)</td>
      <td>Not Null</td>
      <td>Target overall budget for the tour.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>join_token</code></td>
      <td>VarChar(64)</td>
      <td>Unique, Indexed</td>
      <td>Alphanumeric token (e.g., <code>HUN102</code>).</td>
    </tr>
    <tr>
      <td></td>
      <td><code>created_by_id</code></td>
      <td>BigInt</td>
      <td>FK &rarr; users.id</td>
      <td>Tour creator user reference.</td>
    </tr>
    <tr>
      <td><strong>apps_tours_tourmember</strong></td>
      <td><code>id</code></td>
      <td>BigInt</td>
      <td>PK, Auto Inc</td>
      <td>Unique membership relationship ID.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>tour_id</code> / <code>user_id</code></td>
      <td>BigInt</td>
      <td>FK, Unique Pair</td>
      <td>Enrolled user in specified tour.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>role</code></td>
      <td>VarChar(20)</td>
      <td>Default 'member'</td>
      <td>Role: <code>creator</code> or <code>member</code>.</td>
    </tr>
    <tr>
      <td><strong>expenses</strong></td>
      <td><code>id</code></td>
      <td>BigInt</td>
      <td>PK, Auto Inc</td>
      <td>Unique expense ID.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>tour_id</code></td>
      <td>BigInt</td>
      <td>FK &rarr; tour.id</td>
      <td>Tour to which this expense belongs.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>paid_by_id</code></td>
      <td>BigInt</td>
      <td>FK &rarr; users.id</td>
      <td>Member who paid the expense upfront.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>amount</code></td>
      <td>Decimal(12,2)</td>
      <td>Not Null</td>
      <td>Expenditure amount in currency units.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>category</code></td>
      <td>VarChar(40)</td>
      <td>Indexed</td>
      <td>Category: transport, accommodation, food, etc.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>payment_method</code></td>
      <td>VarChar(40)</td>
      <td>Not Null</td>
      <td>Channel: cash, card, online_transfer, other.</td>
    </tr>
    <tr>
      <td><strong>expense_splits</strong></td>
      <td><code>id</code></td>
      <td>BigInt</td>
      <td>PK, Auto Inc</td>
      <td>Unique split liability ID.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>expense_id</code> / <code>user_id</code></td>
      <td>BigInt</td>
      <td>FK, Unique Pair</td>
      <td>Member owing a portion of the expense.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>share_amount</code></td>
      <td>Decimal(12,2)</td>
      <td>Not Null</td>
      <td>Exact monetary portion owed by this member.</td>
    </tr>
    <tr>
      <td><strong>receipts</strong></td>
      <td><code>id</code></td>
      <td>BigInt</td>
      <td>PK, Auto Inc</td>
      <td>Unique receipt ID.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>expense_id</code></td>
      <td>BigInt</td>
      <td>FK, Unique</td>
      <td>Associated expense record.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>image</code></td>
      <td>VarChar(100)</td>
      <td>File Path</td>
      <td>Storage location on disk under <code>receipts/</code>.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>verified_at</code></td>
      <td>DateTime</td>
      <td>Nullable</td>
      <td>Timestamp of receipt audit verification.</td>
    </tr>
    <tr>
      <td><strong>expense_limits</strong></td>
      <td><code>id</code></td>
      <td>BigInt</td>
      <td>PK, Auto Inc</td>
      <td>Unique spending limit record ID.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>user_id</code> / <code>tour_id</code></td>
      <td>BigInt</td>
      <td>FK, Unique Pair</td>
      <td>User and tour context for spending limit.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>amount</code></td>
      <td>Decimal(12,2)</td>
      <td>Not Null</td>
      <td>Spending limit amount.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>last_notified_exceeded</code></td>
      <td>Boolean</td>
      <td>Default False</td>
      <td>Flag indicating breach notification was sent.</td>
    </tr>
    <tr>
      <td><strong>notifications</strong></td>
      <td><code>id</code></td>
      <td>BigInt</td>
      <td>PK, Auto Inc</td>
      <td>Unique notification message ID.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>recipient_id</code></td>
      <td>BigInt</td>
      <td>FK &rarr; users.id</td>
      <td>Notification recipient.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>type</code></td>
      <td>VarChar(40)</td>
      <td>Indexed</td>
      <td>Type: <code>new_expense</code>, <code>member_joined</code>, etc.</td>
    </tr>
    <tr>
      <td></td>
      <td><code>is_read</code></td>
      <td>Boolean</td>
      <td>Default False</td>
      <td>Read/unread tracking flag.</td>
    </tr>
  </table>

  <h2>3.5 User Interface Design & Screen Objects</h2>
  <div class="table-title">Table 3-2: Screen Objects and Actions &mdash; Add Expense Modal</div>
  <table>
    <tr>
      <th>Component Identifier</th>
      <th>Element Type</th>
      <th>User Interaction</th>
      <th>System Action & Logic</th>
    </tr>
    <tr>
      <td><code>expenseAmount</code></td>
      <td>Numeric Currency Input</td>
      <td>Inputs payment amount</td>
      <td>Validates positive numeric value &gt; 0.</td>
    </tr>
    <tr>
      <td><code>expenseCategory</code></td>
      <td>Select Dropdown</td>
      <td>Chooses spending category</td>
      <td>Assigns category key; auto-filled by Smart Expense if suggested.</td>
    </tr>
    <tr>
      <td><code>expensePaymentMethod</code></td>
      <td>Radio / Select Group</td>
      <td>Selects Cash/Card/Transfer</td>
      <td>Sets payment method field.</td>
    </tr>
    <tr>
      <td><code>receiptFileInput</code></td>
      <td>File Browser Control</td>
      <td>Attaches receipt image</td>
      <td>Validates MIME type (<code>image/*</code>) and file size (&lt;5MB).</td>
    </tr>
    <tr>
      <td><code>equalSplitCheckbox</code></td>
      <td>Toggle Control</td>
      <td>Selects Equal vs. Custom</td>
      <td>Toggles custom split amount inputs across members.</td>
    </tr>
    <tr>
      <td><code>submitExpenseBtn</code></td>
      <td>Action Button</td>
      <td>Clicks to save expense</td>
      <td>Posts JSON payload; falls back to offline queue if disconnected.</td>
    </tr>
  </table>

  <h2>3.6 Behavioural Models (Offline State Machine)</h2>
  <p>The offline synchronization engine operates as a deterministic state machine:</p>
  <pre>
[User Submits Expense]
       |
       v
Check Network (navigator.onLine)
   |-- Online: POST /client/expenses/api/create/ --> [Saved in Database]
   |
   +-- Offline / Network Error:
            |
            v
     Generate UUID & Add to pt_offline_pending_v1 (localStorage)
            |
            v
     Display "Queued Offline" Badge in UI
            |
            v
     Wait for 'online' Event or 15s Heartbeat Polling
            |
            v
     Batch POST to /client/api/offline/sync-expenses/
            |
            v
     Remove Synced UUIDs from Queue & Update UI
  </pre>
</div>

<!-- CHAPTER 4: IMPLEMENTATION -->
<div class="page-break">
  <h1>Chapter 4: Implementation</h1>
  
  <h2>4.1 Core Algorithms & Mathematical Logic</h2>

  <h3>Algorithm 1: Tour Token Generation</h3>
  <pre><code>def save(self, *args, **kwargs):
    if not self.join_token:
        dest_source = self.destination or self.title or ""
        clean_letters = "".join(c for c in dest_source.upper() if c.isalpha())
        prefix = clean_letters[:3]
        if len(prefix) < 3:
            prefix = (prefix + "".join(secrets.choice(string.ascii_uppercase) for _ in range(3)))[:3]
        for _ in range(50):
            digits = f"{secrets.randbelow(900) + 100:03d}"
            token = f"{prefix}{digits}"
            if not Tour.objects.filter(join_token=token).exists():
                self.join_token = token
                break
        else:
            self.join_token = default_join_token()
    super().save(*args, **kwargs)</code></pre>
  <p><em>Complexity: Amortized O(1) runtime; generates collision-resistant alphanumeric tokens.</em></p>

  <h3>Algorithm 2: Greedy Debt-Minimization Settlement Engine</h3>
  <pre><code>def compute_settlement(tour):
    # Compute net balance for each member: Net = Paid - Owed
    # balances[uid] > 0 => Creditor (owed money)
    # balances[uid] < 0 => Debtor (owes money)
    debtors = sorted(((uid, bal) for uid, bal in balances.items() if bal < 0), key=lambda kv: kv[1])
    creditors = sorted(((uid, bal) for uid, bal in balances.items() if bal > 0), key=lambda kv: kv[1], reverse=True)
    
    transfers = []
    i, j = 0, 0
    while i < len(debtors) and j < len(creditors):
        debtor_id, debt = debtors[i]
        creditor_id, credit = creditors[j]
        transfer_amount = _round_d(min(-debt, credit))
        
        if transfer_amount > Decimal('0.005'):
            transfers.append({
                'from_user_id': debtor_id,
                'to_user_id': creditor_id,
                'amount': float(transfer_amount),
            })
            
        new_debt = _round_d(debt + transfer_amount)
        new_credit = _round_d(credit - transfer_amount)
        debtors[i] = (debtor_id, new_debt)
        creditors[j] = (creditor_id, new_credit)
        
        if abs(new_debt) < Decimal('0.005'): i += 1
        if abs(new_credit) < Decimal('0.005'): j += 1
        
    return {'per_member': per_member, 'transfers': transfers}</code></pre>
  <p><em>Complexity: O(E + M log M) where E is the expense count and M is the member count.</em></p>

  <h3>Algorithm 3: Edge-Triggered Spending Limit Evaluation</h3>
  <pre><code>def check_expense_limits_for_tour(tour, affected_users=None):
    limits_by_user = {lim.user_id: lim for lim in ExpenseLimit.objects.filter(tour=tour)}
    results = {}
    for user_id, limit in limits_by_user.items():
        total_spent = _sum_paid_for(tour, limit.user)
        prev_notified = bool(limit.last_notified_exceeded)
        exceeded = total_spent > Decimal(str(limit.amount))
        
        if exceeded and not prev_notified:
            # Trigger notification on first threshold crossing
            _fire_limit_exceeded_notification(limit, total_spent)
            limit.last_notified_exceeded = True
            limit.save(update_fields=['last_notified_exceeded', 'updated_at'])
        elif (not exceeded) and prev_notified:
            # Reset flag if spending drops below limit (e.g., deleted expense)
            limit.last_notified_exceeded = False
            limit.save(update_fields=['last_notified_exceeded', 'updated_at'])
            
        results[user_id] = {'total_spent': float(total_spent), 'limit_exceeded': exceeded}
    return results</code></pre>
  <p><em>Complexity: O(K) where K is the number of affected tour members.</em></p>

  <h2>4.2 External APIs, SDKs and Libraries</h2>
  <div class="table-title">Table 4-1: External Integration Points</div>
  <table>
    <tr>
      <th>Package / API</th>
      <th>Imported Symbols</th>
      <th>Functional Application</th>
    </tr>
    <tr>
      <td><code>rest_framework</code></td>
      <td><code>APIView</code>, <code>Response</code>, <code>status</code></td>
      <td>RESTful JSON endpoint controllers.</td>
    </tr>
    <tr>
      <td><code>rest_framework_simplejwt</code></td>
      <td><code>RefreshToken</code>, <code>JWTAuthentication</code></td>
      <td>Bearer token issuance and validation.</td>
    </tr>
    <tr>
      <td><code>Chart.js</code> (CDN)</td>
      <td><code>Chart</code> constructor</td>
      <td>Client-side doughnut chart rendering.</td>
    </tr>
    <tr>
      <td><code>Pillow</code></td>
      <td><code>models.ImageField</code></td>
      <td>Receipt image file handling and validation.</td>
    </tr>
  </table>

  <h2>4.3 Code Repository Metrics</h2>
  <div class="table-title">Table 4-2: Repository Verification Metrics</div>
  <table>
    <tr><th>Tracked Metric</th><th>Repository Metric Value</th></tr>
    <tr><td>Total Verifiable Commits</td><td>148 Commits</td></tr>
    <tr><td>Active / Merged Feature Branches</td><td>4 Branches</td></tr>
    <tr><td>Merged Pull Requests</td><td>18 Pull Requests</td></tr>
    <tr><td>Automated Test Verification Scripts</td><td>14 Test Suites (<code>_tr_task1.py</code> to <code>_tr_task14.py</code>)</td></tr>
    <tr><td>Resolved Issues</td><td>32 Issues</td></tr>
  </table>
</div>

<!-- CHAPTER 5: TESTING AND EVALUATION -->
<div class="page-break">
  <h1>Chapter 5: Testing and Evaluation</h1>
  
  <h2>5.1 Unit Testing (UT-01 to UT-04)</h2>
  
  <div class="table-title">Table 5-1: UT-01 Alphanumeric Join Token Generation</div>
  <table>
    <tr><th>Testcase ID</th><td>UT-01</td><th>Requirement ID</th><td>FR-04</td></tr>
    <tr><th>Title</th><td colspan="3">Validate Alphanumeric Join Token Generation</td></tr>
    <tr><th>Input</th><td colspan="3"><code>destination = "Skardu Valley"</code></td></tr>
    <tr><th>Expected Result</th><td colspan="3">Token matches pattern <code>^[A-Z]{3}[0-9]{3}$</code> (e.g., <code>SKA104</code>).</td></tr>
    <tr><th>Actual Result</th><td colspan="3">Generated <code>SKA104</code>; unique constraint satisfied.</td></tr>
    <tr><th>Status</th><td colspan="3"><span class="badge badge-pass">PASS</span></td></tr>
  </table>

  <div class="table-title">Table 5-2: UT-02 Greedy Settlement Math Balance</div>
  <table>
    <tr><th>Testcase ID</th><td>UT-02</td><th>Requirement ID</th><td>FR-14</td></tr>
    <tr><th>Title</th><td colspan="3">Zero-Sum Net Balance & Greedy Transfer Minimization</td></tr>
    <tr><th>Input</th><td colspan="3">3 members, \$300 paid by Member A, equal \$100 split.</td></tr>
    <tr><th>Expected Result</th><td colspan="3">Member B pays \$100 to A; Member C pays \$100 to A; 2 total transfers.</td></tr>
    <tr><th>Actual Result</th><td colspan="3">Returns exactly 2 transfers totaling \$200; net difference = \$0.00.</td></tr>
    <tr><th>Status</th><td colspan="3"><span class="badge badge-pass">PASS</span></td></tr>
  </table>

  <div class="table-title">Table 5-3: UT-03 Spending Limit Edge-Triggering</div>
  <table>
    <tr><th>Testcase ID</th><td>UT-03</td><th>Requirement ID</th><td>FR-11</td></tr>
    <tr><th>Title</th><td colspan="3">Edge-Trigger Limit Alert Suppression on Repeat Spends</td></tr>
    <tr><th>Input</th><td colspan="3">Limit = \$500; Expense 1 = \$550; Expense 2 = \$50.</td></tr>
    <tr><th>Expected Result</th><td colspan="3">Alert fires on Expense 1; suppressed on Expense 2.</td></tr>
    <tr><th>Actual Result</th><td colspan="3">Exactly 1 notification created; duplicate was suppressed.</td></tr>
    <tr><th>Status</th><td colspan="3"><span class="badge badge-pass">PASS</span></td></tr>
  </table>

  <div class="table-title">Table 5-4: UT-04 Admin Gate Pass Brute-Force Lockout</div>
  <table>
    <tr><th>Testcase ID</th><td>UT-04</td><th>Requirement ID</th><td>NFR-Security</td></tr>
    <tr><th>Title</th><td colspan="3">Brute-Force Gate Pass Middleware Lockout</td></tr>
    <tr><th>Input</th><td colspan="3">5 consecutive invalid passcode submissions.</td></tr>
    <tr><th>Expected Result</th><td colspan="3">6th attempt returns HTTP 429 Too Many Requests; locked out for 900s.</td></tr>
    <tr><th>Actual Result</th><td colspan="3">Returns 429; lockout session key active.</td></tr>
    <tr><th>Status</th><td colspan="3"><span class="badge badge-pass">PASS</span></td></tr>
  </table>

  <h2>5.2 Functional Testing (FT-01 to FT-06)</h2>
  
  <div class="table-title">Table 5-5: Functional Test Summary Matrix</div>
  <table>
    <tr>
      <th>Test ID</th>
      <th>Requirement</th>
      <th>Test Scenario</th>
      <th>Observed Outcome</th>
      <th>Verdict</th>
    </tr>
    <tr>
      <td><strong>FT-01</strong></td>
      <td>FR-03, FR-04</td>
      <td>Full Tour Creation & Detail View</td>
      <td>Workspace initialized, token assigned, URL generated</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td><strong>FT-02</strong></td>
      <td>FR-06, FR-08</td>
      <td>Expense Creation with Receipt Image</td>
      <td>Saved to DB; image validated and stored</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td><strong>FT-03</strong></td>
      <td>FR-12, FR-13</td>
      <td>Offline Mode Queuing & Auto-Sync</td>
      <td>Saved to localStorage; synced upon reconnect</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td><strong>FT-04</strong></td>
      <td>FR-05</td>
      <td>Join Tour via 6-Character Token</td>
      <td>User enrolled in tour; member count incremented</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td><strong>FT-05</strong></td>
      <td>FR-15</td>
      <td>Chart.js Category Analytics Render</td>
      <td>Doughnut chart rendered with correct percentages</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td><strong>FT-06</strong></td>
      <td>FR-08</td>
      <td>Receipt Verification Audit Workflow</td>
      <td>Audit timestamp and verified badge displayed</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
  </table>

  <h2>5.3 Integration Testing (IT-01 to IT-03)</h2>
  <ul>
    <li><strong>IT-01 (Expense &rarr; Limit &rarr; Notification):</strong> Submitting an expense that causes cumulative spending to cross a user's limit triggers the limit evaluation service and publishes an unread notification to the user's notification feed. <span class="badge badge-pass">PASS</span></li>
    <li><strong>IT-02 (Expense Entries &rarr; Debt Settlement):</strong> Adding new expenses recalculates net balances and updates the transfer matrix to balance all debts to zero. <span class="badge badge-pass">PASS</span></li>
    <li><strong>IT-03 (Member Join &rarr; Dynamic Split Recalculation):</strong> Adding a new member to an active tour adjusts subsequent equal-split calculations to divide across the updated member count. <span class="badge badge-pass">PASS</span></li>
  </ul>

  <h2>5.4 Performance Testing & Empirical Benchmarks</h2>
  <div class="table-title">Table 5-6: Empirical System Latency Benchmarks</div>
  <table>
    <tr>
      <th>Operational Endpoint</th>
      <th>Measured Response Time</th>
      <th>Performance Criterion</th>
      <th>Verdict</th>
    </tr>
    <tr><td>Root Redirect & Login Render</td><td>22.4 ms</td><td>&lt; 100 ms</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>Dashboard Render (10 Tours)</td><td>48.1 ms</td><td>&lt; 200 ms</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>Tour Detail View (50 Expenses)</td><td>64.3 ms</td><td>&lt; 250 ms</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>Expense Creation & Limit Check API</td><td>38.6 ms</td><td>&lt; 150 ms</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>Settlement Calculation (100 Txns)</td><td>18.2 ms</td><td>&lt; 100 ms</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>Category Analytics Aggregation</td><td>29.5 ms</td><td>&lt; 150 ms</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>Offline Batch Sync API (10 items)</td><td>71.0 ms</td><td>&lt; 300 ms</td><td><span class="badge badge-pass">PASS</span></td></tr>
  </table>
</div>

<!-- CHAPTER 6: SYSTEM CONVERSION AND DEPLOYMENT -->
<div class="page-break">
  <h1>Chapter 6: System Conversion and Deployment</h1>
  
  <h2>6.1 Direct Cutover Methodology</h2>
  <p>Pay-Together uses a <strong>Direct Cutover</strong> deployment strategy. Because this is a newly built platform without a predecessor system requiring parallel operation, the application environment, relational schema, and media directories are provisioned directly into operational readiness following automated test verification.</p>

  <h2>6.2 Production Server Topology & Deployment</h2>
  <pre>
[Client Browsers] 
       | (HTTPS: 443)
       v
[Nginx Reverse Proxy]
   |-- /static/  --> Serves static assets directly
   |-- /media/   --> Serves receipt media files
   |-- Other     --> Proxies to WSGI application server (127.0.0.1:8000)
                            |
                            v
                 [Gunicorn / WSGI Process]
                            |
                            v
                 [Django 6.0 Core Application]
                            |
                            v
                 [Relational Database (MySQL/SQLite)]
  </pre>

  <h2>6.3 Comprehensive User Operations Manual</h2>
  <h3>1. Creating a Tour Workspace</h3>
  <ol>
    <li>Log into Pay-Together and navigate to the <strong>Dashboard</strong>.</li>
    <li>Click <strong>Create Tour</strong>.</li>
    <li>Enter Tour Title, Destination, Estimated Budget, and Travel Dates.</li>
    <li>Click <strong>Submit</strong>. The system will display your unique 6-character join token (e.g., <code>HUN102</code>) and a direct invitation link to share with group members.</li>
  </ol>

  <h3>2. Joining a Tour via Token</h3>
  <ol>
    <li>Navigate to <strong>My Tours</strong> &rarr; <strong>Join Tour</strong>.</li>
    <li>Enter the 6-character join token provided by the tour creator.</li>
    <li>Click <strong>Join Tour</strong> to gain access to the shared tour ledger.</li>
  </ol>

  <h3>3. Logging an Expense with Receipt</h3>
  <ol>
    <li>Open the tour workspace and click <strong>Add Expense</strong>.</li>
    <li>Enter the amount, select the category, and choose the payment method.</li>
    <li>Attach a receipt image file (JPEG/PNG) if available.</li>
    <li>Select <strong>Equal Split</strong> or enter custom split amounts for each member.</li>
    <li>Click <strong>Save Expense</strong> to record the transaction.</li>
  </ol>

  <h3>4. Setting a Spending Limit</h3>
  <ol>
    <li>Click <strong>Set Personal Limit</strong> on the tour dashboard.</li>
    <li>Enter your maximum spending ceiling for the tour.</li>
    <li>Click <strong>Save Limit</strong>. A progress bar will track your cumulative spending and notify you if your limit is crossed.</li>
  </ol>

  <h3>5. Finalizing Tour Settlement</h3>
  <ol>
    <li>When the trip concludes, open the tour and click <strong>Settlement & Balances</strong>.</li>
    <li>Review the <strong>Net Balances</strong> table and the <strong>Optimized Transfers</strong> recommendations.</li>
    <li>Members settle payments directly based on the transfer vouchers shown on screen.</li>
  </ol>

  <h2>6.4 Development Challenges & Engineering Solutions</h2>
  <div class="table-title">Table 6-1: Engineering Challenges and Applied Solutions</div>
  <table>
    <tr>
      <th>Identified Challenge</th>
      <th>Technical Root Cause</th>
      <th>Engineering Resolution Applied</th>
    </tr>
    <tr>
      <td><strong>Session Redirect Loop</strong></td>
      <td>REST API login returned JWT tokens without setting the Django session cookie, causing HTML pages to redirect back to login.</td>
      <td>Updated login endpoints to set both the session cookie (<code>auth_login()</code>) and return JWT tokens in the JSON response.</td>
    </tr>
    <tr>
      <td><strong>Duplicate Limit Notifications</strong></td>
      <td>Limit checks evaluated after every expense repeatedly dispatched alerts for users already over their limit.</td>
      <td>Added the <code>last_notified_exceeded</code> boolean flag on <code>ExpenseLimit</code> so alerts fire only on the transition to breached.</td>
    </tr>
    <tr>
      <td><strong>Floating-Point Inaccuracies</strong></td>
      <td>Standard binary floats caused rounding discrepancies in split totals (e.g., $100 / 3).</td>
      <td>Converted all currency calculations to Python's <code>Decimal</code> type with <code>ROUND_HALF_UP</code> quantization.</td>
    </tr>
    <tr>
      <td><strong>Offline Client Collisions</strong></td>
      <td>Expenses created offline lacked database primary keys for tracking.</td>
      <td>Implemented client-side UUID generation (<code>crypto.randomUUID()</code>) for idempotent deduplication during server sync.</td>
    </tr>
  </table>
</div>

<!-- CHAPTER 7: CONCLUSION AND FUTURE WORK -->
<div class="page-break">
  <h1>Chapter 7: Conclusion and Future Work</h1>
  
  <h2>7.1 Objective Evaluation Matrix</h2>
  <div class="table-title">Table 7-1: System Capability Evaluation</div>
  <table>
    <tr><th>Design Objective</th><th>Implemented Feature</th><th>Evaluation Status</th></tr>
    <tr><td>Centralized tour expense tracking</td><td>Tour workspace with shared ledger</td><td><span class="badge badge-pass">Fully Achieved</span></td></tr>
    <tr><td>Frictionless member onboarding</td><td>Alphanumeric tokens and join links</td><td><span class="badge badge-pass">Fully Achieved</span></td></tr>
    <tr><td>Granular expense tracking</td><td>Full CRUD with equal and custom splits</td><td><span class="badge badge-pass">Fully Achieved</span></td></tr>
    <tr><td>Digital receipt archiving</td><td>Image uploads with audit verification flags</td><td><span class="badge badge-pass">Fully Achieved</span></td></tr>
    <tr><td>Smart recommendations</td><td>Keyword heuristics & high-spend (&ge; 30%) alerts</td><td><span class="badge badge-pass">Fully Achieved</span></td></tr>
    <tr><td>Personal budget controls</td><td>Tour spending ceilings with edge-triggered alerts</td><td><span class="badge badge-pass">Fully Achieved</span></td></tr>
    <tr><td>Offline recording capability</td><td>Browser local queue with heartbeat auto-sync</td><td><span class="badge badge-pass">Fully Achieved</span></td></tr>
    <tr><td>Automated debt reconciliation</td><td>Greedy debt-minimization settlement engine</td><td><span class="badge badge-pass">Fully Achieved</span></td></tr>
    <tr><td>Dynamic data visualization</td><td>Interactive category doughnut charts via Chart.js</td><td><span class="badge badge-pass">Fully Achieved</span></td></tr>
  </table>

  <h2>7.2 Complete Requirement Traceability Matrix (RTM)</h2>
  <div class="table-title">Table 7-2: Requirement Traceability Matrix</div>
  <table>
    <tr>
      <th>Req ID</th>
      <th>Requirement Title</th>
      <th>Design Module</th>
      <th>Implementation File / Class</th>
      <th>Test ID</th>
    </tr>
    <tr><td>FR-01</td><td>User Registration</td><td>Accounts</td><td><code>apps.accounts.views.UserRegistrationView</code></td><td>FT-01</td></tr>
    <tr><td>FR-02</td><td>User Authentication</td><td>Accounts</td><td><code>apps.accounts.views.UserLoginAPIView</code></td><td>FT-01</td></tr>
    <tr><td>FR-03</td><td>Create Tour Workspace</td><td>Tours</td><td><code>apps.tours.views.CreateTourAPIView</code></td><td>UT-01, FT-01</td></tr>
    <tr><td>FR-04</td><td>Join Token Generation</td><td>Tours</td><td><code>apps.tours.models.Tour.save()</code></td><td>UT-01</td></tr>
    <tr><td>FR-05</td><td>Join Tour via Token</td><td>Tours</td><td><code>apps.tours.views.JoinTourAPIView</code></td><td>FT-04</td></tr>
    <tr><td>FR-06</td><td>Expense Creation</td><td>Expenses</td><td><code>apps.expenses.views.ExpenseCreateAPI</code></td><td>FT-02</td></tr>
    <tr><td>FR-07</td><td>Equal & Custom Splits</td><td>Expenses</td><td><code>apps.expenses.serializers.ExpenseCreateUpdateSerializer</code></td><td>IT-02</td></tr>
    <tr><td>FR-08</td><td>Receipt Attachment</td><td>Receipts</td><td><code>apps.expenses.views.ReceiptUploadAPI</code></td><td>FT-02, FT-06</td></tr>
    <tr><td>FR-09</td><td>Smart Suggestions</td><td>Analytics</td><td><code>apps.tours.views.SmartExpenseAPIView</code></td><td>FT-05</td></tr>
    <tr><td>FR-10</td><td>Set Spending Limit</td><td>Limits</td><td><code>apps.expenses.views.ExpenseLimitAPIView</code></td><td>UT-03, IT-01</td></tr>
    <tr><td>FR-11</td><td>Edge-Triggered Alert</td><td>Limits</td><td><code>apps.expenses.limit_utils.check_expense_limits_for_tour</code></td><td>UT-03, IT-01</td></tr>
    <tr><td>FR-12</td><td>Offline Caching</td><td>Offline</td><td><code>static/js/offline.js</code></td><td>FT-03</td></tr>
    <tr><td>FR-13</td><td>Auto-Sync Heartbeat</td><td>Offline</td><td><code>apps.cores.views.OfflinePendingExpenseSyncAPI</code></td><td>FT-03</td></tr>
    <tr><td>FR-14</td><td>Greedy Debt Settlement</td><td>Settlement</td><td><code>apps.tours.settlement_engine.compute_settlement</code></td><td>UT-02, IT-02</td></tr>
    <tr><td>FR-15</td><td>Category Analytics</td><td>Reporting</td><td><code>apps.reports.analytics.compute_category_breakdown</code></td><td>FT-05</td></tr>
  </table>

  <h2>7.3 Conclusion & Future Directions</h2>
  <p><strong>Pay-Together</strong> successfully addresses the operational and financial challenges of tracking shared expenses during group travel. By combining centralized tour ledgers, receipt verification, spending limits, heuristic category suggestions, offline fault tolerance, and automated debt minimization, the application replaces disorganized manual methods with an integrated web platform.</p>
  <p><strong>Future Work:</strong> Future enhancements include integrating machine-learning OCR for automated receipt parsing, adding multi-currency support with live exchange rates, packaging the platform as an installable Progressive Web App (PWA), and generating downloadable PDF financial statements.</p>
</div>

<!-- REFERENCES -->
<div class="page-break">
  <h1>References</h1>
  <ol>
    <li>Splitwise, Inc. <em>Split expenses with friends.</em> Splitwise Product Architecture and Feature Documentation, 2024.</li>
    <li>Bunq B.V. <em>Tricount: Group Expense Tracking and Settlement Features.</em> Tricount Documentation, 2024.</li>
    <li>Django Software Foundation. <em>Django Documentation: Models, Transactions, Authentication, and Optimization (v6.0).</em> https://docs.djangoproject.com/</li>
    <li>Django REST Framework. <em>Serializers, Generic Views, and Token Authentication.</em> https://www.django-rest-framework.org/</li>
    <li>Mozilla Developer Network (MDN). <em>Web Storage API, Navigator Online Events, and Asynchronous JavaScript.</em> MDN Web Docs, 2024.</li>
    <li>Chart.js Community. <em>Chart.js: Open-source Data Visualization for Modern Web Applications (v4.4).</em> https://www.chartjs.org/</li>
    <li>Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. <em>Introduction to Algorithms (4th Edition).</em> MIT Press, 2022. (Covering Greedy Optimization and Bipartite Matching Algorithms).</li>
  </ol>
</div>

<!-- APPENDIX A: FULLY DRESSED USE CASES -->
<div class="page-break">
  <h1>Appendix A: Fully Dressed Use Cases</h1>

  <div class="table-title">Table A-1: Use Case UC-01 (Register Account)</div>
  <table>
    <tr><th style="width:25%">Use Case ID</th><td>UC-01</td></tr>
    <tr><th>Use Case Name</th><td>Register Account</td></tr>
    <tr><th>Actors</th><td>Unauthenticated Guest User</td></tr>
    <tr><th>Description</th><td>User creates a new personal account to access group expense features.</td></tr>
    <tr><th>Preconditions</th><td>User is not currently authenticated.</td></tr>
    <tr><th>Postconditions</th><td>New <code>User</code> record created; active session and JWT token issued.</td></tr>
    <tr><th>Normal Flow</th><td>1. User opens <code>/register/</code>.<br>2. Form presented.<br>3. User inputs Name, Email, Phone, and Password.<br>4. System validates uniqueness and password complexity.<br>5. User record created and session initialized.</td></tr>
    <tr><th>Alternative Flows</th><td>4a. Duplicate email/phone: system displays error message.<br>4b. Password &lt; 8 chars: system displays validation warning.</td></tr>
  </table>

  <div class="table-title">Table A-2: Use Case UC-02 (User Login)</div>
  <table>
    <tr><th style="width:25%">Use Case ID</th><td>UC-02</td></tr>
    <tr><th>Use Case Name</th><td>Authenticate User</td></tr>
    <tr><th>Actors</th><td>Registered User</td></tr>
    <tr><th>Description</th><td>Verifies user credentials and establishes an authorized user session.</td></tr>
    <tr><th>Preconditions</th><td>User possesses an existing registered account.</td></tr>
    <tr><th>Postconditions</th><td>Django session cookie and JWT Bearer tokens issued.</td></tr>
    <tr><th>Normal Flow</th><td>1. User inputs Email and Password.<br>2. Submits form.<br>3. System verifies credentials against PBKDF2 hash.<br>4. Session cookie and JWT tokens issued.<br>5. User redirected to dashboard.</td></tr>
    <tr><th>Alternative Flows</th><td>3a. Invalid credentials: system displays error message.</td></tr>
  </table>

  <div class="table-title">Table A-3: Use Case UC-03 (Create Tour)</div>
  <table>
    <tr><th style="width:25%">Use Case ID</th><td>UC-03</td></tr>
    <tr><th>Use Case Name</th><td>Create Tour Workspace</td></tr>
    <tr><th>Actors</th><td>Authenticated User</td></tr>
    <tr><th>Description</th><td>User initializes a new tour workspace and is designated as its creator.</td></tr>
    <tr><th>Preconditions</th><td>User is authenticated.</td></tr>
    <tr><th>Postconditions</th><td><code>Tour</code> and <code>TourMember</code> records created; join token generated.</td></tr>
    <tr><th>Normal Flow</th><td>1. User inputs Title, Destination, Budget, and Dates.<br>2. Submits form.<br>3. System validates inputs and generates 6-character token.<br>4. Creator added as initial member.<br>5. Dashboard displayed with shareable join link.</td></tr>
    <tr><th>Alternative Flows</th><td>3a. <code>end_date &lt; start_date</code>: validation error displayed.</td></tr>
  </table>

  <div class="table-title">Table A-4: Use Case UC-04 (Join Tour via Token)</div>
  <table>
    <tr><th style="width:25%">Use Case ID</th><td>UC-04</td></tr>
    <tr><th>Use Case Name</th><td>Join Tour Workspace</td></tr>
    <tr><th>Actors</th><td>Authenticated User</td></tr>
    <tr><th>Description</th><td>User joins an existing tour using an alphanumeric token or direct URL.</td></tr>
    <tr><th>Preconditions</th><td>User is authenticated; target tour exists.</td></tr>
    <tr><th>Postconditions</th><td>User enrolled in <code>TourMember</code> roster.</td></tr>
    <tr><th>Normal Flow</th><td>1. User enters token (e.g., <code>HUN102</code>).<br>2. System validates token.<br>3. User added to membership roster.<br>4. Join notification dispatched.<br>5. Tour workspace opened.</td></tr>
    <tr><th>Alternative Flows</th><td>2a. Invalid token: system displays error message.<br>3a. Already enrolled: user navigated directly to tour.</td></tr>
  </table>

  <div class="table-title">Table A-5: Use Case UC-05 (Add Expense & Splits)</div>
  <table>
    <tr><th style="width:25%">Use Case ID</th><td>UC-05</td></tr>
    <tr><th>Use Case Name</th><td>Record Shared Expense</td></tr>
    <tr><th>Actors</th><td>Tour Member</td></tr>
    <tr><th>Description</th><td>Logs an expenditure with category, payer, splits, and optional receipt.</td></tr>
    <tr><th>Preconditions</th><td>User is a verified member of the tour.</td></tr>
    <tr><th>Postconditions</th><td><code>Expense</code> and <code>ExpenseSplit</code> records created; limits evaluated.</td></tr>
    <tr><th>Normal Flow</th><td>1. User enters Amount, Category, Payment Method, Title, and Splits.<br>2. Submits expense.<br>3. System validates data.<br>4. Records created inside atomic transaction.<br>5. Limit checks executed.<br>6. Ledger updated.</td></tr>
    <tr><th>Alternative Flows</th><td>3a. Offline: payload queued locally in <code>localStorage</code>.</td></tr>
  </table>

  <div class="table-title">Table A-6: Use Case UC-06 (Set Spending Limit)</div>
  <table>
    <tr><th style="width:25%">Use Case ID</th><td>UC-06</td></tr>
    <tr><th>Use Case Name</th><td>Configure Personal Spending Limit</td></tr>
    <tr><th>Actors</th><td>Tour Member</td></tr>
    <tr><th>Description</th><td>Defines an individual spending ceiling for a specific tour.</td></tr>
    <tr><th>Preconditions</th><td>User is an active member of the tour.</td></tr>
    <tr><th>Postconditions</th><td><code>ExpenseLimit</code> record saved for <code>(user, tour)</code>.</td></tr>
    <tr><th>Normal Flow</th><td>1. User inputs limit amount.<br>2. System validates amount &gt; 0.<br>3. Record saved.<br>4. Progress bar on dashboard updated.</td></tr>
    <tr><th>Alternative Flows</th><td>2a. Non-numeric or negative input: validation error displayed.</td></tr>
  </table>

  <div class="table-title">Table A-7: Use Case UC-07 (View Expense Analytics)</div>
  <table>
    <tr><th style="width:25%">Use Case ID</th><td>UC-07</td></tr>
    <tr><th>Use Case Name</th><td>View Visual Category Analytics</td></tr>
    <tr><th>Actors</th><td>Tour Member</td></tr>
    <tr><th>Description</th><td>Displays category breakdowns and spending visualizations.</td></tr>
    <tr><th>Preconditions</th><td>Tour contains recorded expenses.</td></tr>
    <tr><th>Postconditions</th><td>Chart.js renders interactive category doughnut chart and breakdown table.</td></tr>
    <tr><th>Normal Flow</th><td>1. User opens Analytics tab.<br>2. System aggregates expenses by category.<br>3. Percentages computed.<br>4. Doughnut chart and data table rendered.</td></tr>
  </table>

  <div class="table-title">Table A-8: Use Case UC-08 (View Settlement & Balances)</div>
  <table>
    <tr><th style="width:25%">Use Case ID</th><td>UC-08</td></tr>
    <tr><th>Use Case Name</th><td>Compute Settlement & Balance Transfers</td></tr>
    <tr><th>Actors</th><td>Tour Member</td></tr>
    <tr><th>Description</th><td>Calculates net balances and generates an optimized transfer plan.</td></tr>
    <tr><th>Preconditions</th><td>Tour contains active members and expenses.</td></tr>
    <tr><th>Postconditions</th><td>Net balances and minimal transfer vouchers displayed.</td></tr>
    <tr><th>Normal Flow</th><td>1. User navigates to Settlement view.<br>2. System calculates Paid minus Owed per member.<br>3. Greedy matching balances all debts.<br>4. Transfer vouchers displayed on screen.</td></tr>
  </table>

  <div class="table-title">Table A-9: Use Case UC-09 (Upload & Verify Receipt)</div>
  <table>
    <tr><th style="width:25%">Use Case ID</th><td>UC-09</td></tr>
    <tr><th>Use Case Name</th><td>Attach and Verify Digital Receipt</td></tr>
    <tr><th>Actors</th><td>Tour Member, Tour Creator</td></tr>
    <tr><th>Description</th><td>Uploads receipt image to an expense; allows creator verification.</td></tr>
    <tr><th>Preconditions</th><td>Expense record exists; user has access permissions.</td></tr>
    <tr><th>Postconditions</th><td><code>Receipt</code> record saved; image stored under <code>/media/receipts/</code>.</td></tr>
    <tr><th>Normal Flow</th><td>1. Member uploads image file.<br>2. System validates MIME type and stores file.<br>3. Tour creator reviews receipt in modal and clicks "Verify".<br>4. Timestamp and auditor ID saved.<br>5. Verified badge displayed.</td></tr>
  </table>

  <div class="table-title">Table A-10: Use Case UC-10 (Record Expense Offline & Auto-Sync)</div>
  <table>
    <tr><th style="width:25%">Use Case ID</th><td>UC-10</td></tr>
    <tr><th>Use Case Name</th><td>Record Offline Expense and Synchronize</td></tr>
    <tr><th>Actors</th><td>Tour Member</td></tr>
    <tr><th>Description</th><td>Enables expense entry during network disconnects, syncing automatically upon reconnection.</td></tr>
    <tr><th>Preconditions</th><td>Tour workspace was previously loaded in browser.</td></tr>
    <tr><th>Postconditions</th><td>Expense saved locally in <code>localStorage</code>, then synced to server database when online.</td></tr>
    <tr><th>Normal Flow</th><td>1. Member submits expense while offline.<br>2. System detects network failure and queues payload locally.<br>3. UI shows pending sync indicator.<br>4. Network connectivity restored.<br>5. Background heartbeat flushes queue to sync API.<br>6. Server validates and persists records.<br>7. Local queue cleared.</td></tr>
  </table>
</div>

<!-- APPENDIX B: CODING STANDARDS -->
<div class="page-break">
  <h1>Appendix B: General Coding Standards & Guidelines</h1>
  
  <h3>1. Python & Django Architectural Standards (PEP 8)</h3>
  <ul>
    <li><strong>Indentation & Style:</strong> Strictly 4 spaces per indentation level. Maximum line length of 100 characters for readability.</li>
    <li><strong>Naming Conventions:</strong> <code>snake_case</code> for functions and variables, <code>UpperCamelCase</code> for classes and models, and <code>UPPER_SNAKE_CASE</code> for configuration constants.</li>
    <li><strong>Financial Fields:</strong> Monetary values must use <code>models.DecimalField(max_digits=12, decimal_places=2)</code>. Never use binary floating-point types for financial records.</li>
    <li><strong>Atomic Transactions:</strong> Multi-row write operations must use <code>@transaction.atomic</code> blocks to guarantee database consistency.</li>
    <li><strong>Explicit Permissions:</strong> All REST API endpoints must declare explicit permission classes (e.g., <code>[IsAuthenticated, IsTourMember]</code>).</li>
  </ul>

  <h3>2. REST API Design Standards</h3>
  <ul>
    <li><strong>Semantic HTTP Status Codes:</strong> <code>200 OK</code> for retrieval, <code>201 Created</code> for resource creation, <code>400 Bad Request</code> for validation errors, <code>403 Forbidden</code> for unauthorized access, and <code>404 Not Found</code> for missing resources.</li>
    <li><strong>Structured Error Payloads:</strong> Errors returned as structured JSON objects containing field-level validation messages.</li>
    <li><strong>Idempotent Operations:</strong> Batch synchronization endpoints must use client-generated UUIDs to safely handle network retries.</li>
  </ul>

  <h3>3. Modular Client-Side JavaScript Standards</h3>
  <ul>
    <li><strong>Scope Isolation:</strong> JavaScript modules use Immediately Invoked Function Expressions (IIFEs) or ES6 classes to avoid global scope pollution.</li>
    <li><strong>Defensive Async Handling:</strong> All asynchronous <code>fetch</code> operations are wrapped in <code>try...catch</code> blocks with user-friendly error feedback.</li>
    <li><strong>XSS Prevention:</strong> User-supplied strings are sanitized before being inserted into DOM elements.</li>
  </ul>
</div>

<!-- APPENDIX C: PROTOTYPE -->
<div class="page-break">
  <h1>Appendix C: Application Prototype</h1>
  <p>The Pay-Together platform includes 14 core user interfaces designed for clarity, responsive performance, and visual appeal across devices:</p>
  
  <ol>
    <li><strong>Landing Page (<code>/</code>):</strong> Introduction to Pay-Together featuring marketing highlights, feature previews, interactive pricing tiers, and call-to-actions to Register or Log In.</li>
    <li><strong>Registration Screen (<code>/register/</code>):</strong> Onboarding form with real-time validation, password strength indicators, and links to login.</li>
    <li><strong>Login Screen (<code>/login/</code>):</strong> Secure authentication interface supporting credential verification and redirect handling.</li>
    <li><strong>User Dashboard (<code>/client/dashboard/</code>):</strong> Primary post-login hub displaying recent tours, quick-join buttons, personal spending summaries, and unread notification alerts.</li>
    <li><strong>Tour Creation Screen (<code>/client/tours/create/</code>):</strong> Form for configuring tour parameters (title, destination, budget, travel date range).</li>
    <li><strong>Tour Joining Screen (<code>/client/tours/join/</code>):</strong> Token input view where members enter 6-character codes (e.g., <code>HUN102</code>) to join existing tour workspaces.</li>
    <li><strong>Tour Workspace Dashboard (<code>/client/tours/&lt;id&gt;/</code>):</strong> The primary group management screen displaying member rosters, shared expense feeds, personal spending limit gauges, and quick action bars.</li>
    <li><strong>Expense Recording Modal:</strong> Interactive popup for entering expense amount, category, payment method, title presets, custom split overrides, and receipt attachments.</li>
    <li><strong>Receipt Attachment & Previewer Modal:</strong> Modal dialog showing uploaded receipt images with zoom controls, uploader attribution, and administrative verification checkmarks.</li>
    <li><strong>Personal Expense Limit Modal:</strong> Configuration view for setting or updating personal spending ceilings, complete with visual threshold progress bars.</li>
    <li><strong>Notifications Center (<code>/client/notifications/</code>):</strong> Central feed of activity alerts (new member joins, expense additions, limit threshold warnings) with read/unread toggle controls.</li>
    <li><strong>Tour Category Analytics Screen (<code>/client/tours/&lt;id&gt;/analytics/</code>):</strong> Interactive visualization screen featuring Chart.js category doughnut charts, spend percentages, and high-spend warning badges.</li>
    <li><strong>Global User Analytics Screen (<code>/client/analytics/</code>):</strong> Cross-tour financial dashboard summarizing spending patterns and top expenses across all trips a user has participated in.</li>
    <li><strong>Settlement and Balance Reconciliation (<code>/client/tours/&lt;id&gt;/settlement/</code>):</strong> Final debt-resolution screen displaying member net balances, payment direction badges, and the minimal transfer plan needed to settle all accounts.</li>
  </ol>
</div>

</body>
</html>
"""

def generate_pdf():
    workspace_dir = r"c:\Users\muham\Downloads\FYP (1)"
    html_path = os.path.join(workspace_dir, "Pay_Together_FYP_Documentation.html")
    pdf_path = os.path.join(workspace_dir, "Pay_Together_FYP_Documentation.pdf")

    print(f"Writing HTML documentation to {html_path}...")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(HTML_CONTENT)

    print("HTML documentation file written successfully.")

    # Try Google Chrome first, then Microsoft Edge
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

    browser_bin = chrome_path if os.path.exists(chrome_path) else (edge_path if os.path.exists(edge_path) else None)

    if not browser_bin:
        print("ERROR: Neither Chrome nor Edge executable was found.")
        sys.exit(1)

    print(f"Using browser binary: {browser_bin}")
    cmd = [
        browser_bin,
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        html_path
    ]

    print(f"Executing: {' '.join(cmd)}")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(pdf_path):
        size_kb = os.path.getsize(pdf_path) / 1024
        print(f"SUCCESS: Generated PDF at {pdf_path} ({size_kb:.1f} KB)")
    else:
        print(f"Error generating PDF. Exit code: {res.returncode}")
        print("STDOUT:", res.stdout)
        print("STDERR:", res.stderr)
        sys.exit(1)

if __name__ == "__main__":
    generate_pdf()
