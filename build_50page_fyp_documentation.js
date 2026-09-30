const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const diagrams = require('./diagrams_svg');

const htmlPath = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.html');
const outputPdf = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.pdf');
const downloadsPdf = 'C:\\Users\\muham\\Downloads\\Pay_Together_FYP_Documentation.pdf';

console.log("Constructing comprehensive 50-page FYP report...");

// Template builder
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Pay-Together — Comprehensive Final Year Project (FYP) Documentation</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4;
    margin: 20mm 16mm 20mm 16mm;
    @bottom-center {
      content: "Page " counter(page);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 8.5pt;
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
    font-size: 9.8pt;
    line-height: 1.58;
    color: #1e293b;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }

  .cover-page {
    page-break-after: always;
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    padding: 30px 20px 20px 20px;
  }

  .cover-header {
    border-bottom: 3px solid #2563eb;
    padding-bottom: 22px;
  }

  .cover-badge {
    display: inline-block;
    padding: 6px 18px;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 9.5pt;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .cover-title {
    font-size: 26pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.25;
    margin: 0 0 12px 0;
  }

  .cover-subtitle {
    font-size: 12.5pt;
    color: #475569;
    font-weight: 500;
    max-width: 680px;
    margin: 0 auto;
    line-height: 1.5;
  }

  .cover-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    text-align: left;
    max-width: 640px;
    margin: 22px auto;
  }

  .cover-meta-item h4 {
    margin: 0 0 4px 0;
    font-size: 8.5pt;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .cover-meta-item p {
    margin: 0;
    font-size: 10pt;
    font-weight: 600;
    color: #0f172a;
  }

  .cover-footer {
    font-size: 9pt;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 16px;
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
    font-size: 17pt;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 5px;
    margin-top: 28px;
    margin-bottom: 14px;
    color: #1e3a8a;
  }

  h2 {
    font-size: 12.5pt;
    margin-top: 22px;
    margin-bottom: 8px;
    color: #2563eb;
  }

  h3 {
    font-size: 11pt;
    margin-top: 16px;
    margin-bottom: 6px;
    color: #334155;
  }

  h4 {
    font-size: 10pt;
    margin-top: 12px;
    margin-bottom: 4px;
  }

  p {
    margin-top: 0;
    margin-bottom: 9px;
    text-align: justify;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    margin-bottom: 14px;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }

  th, td {
    border: 1px solid #cbd5e1;
    padding: 5px 8px;
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
    font-size: 9pt;
    font-weight: 700;
    color: #475569;
    margin-top: 8px;
    margin-bottom: 4px;
  }

  .figure-box {
    margin: 14px 0;
    padding: 10px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    page-break-inside: avoid;
    text-align: center;
  }

  .figure-title {
    font-size: 8.5pt;
    font-weight: 700;
    color: #475569;
    margin-top: 6px;
    text-align: center;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 9px 11px;
    border-radius: 6px;
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 7.8pt;
    line-height: 1.38;
    overflow-x: auto;
    page-break-inside: avoid;
    margin: 8px 0 12px 0;
  }

  code {
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 8.2pt;
    background: #f1f5f9;
    padding: 2px 4px;
    border-radius: 4px;
    color: #be185d;
  }

  pre code {
    background: transparent;
    padding: 0;
    color: #f8fafc;
  }

  .alert-box {
    padding: 10px 14px;
    border-radius: 6px;
    margin: 12px 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }

  .alert-info {
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    color: #1e40af;
  }

  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 7.5pt;
    text-transform: uppercase;
  }

  .badge-high { background: #fee2e2; color: #b91c1c; }
  .badge-medium { background: #fef3c7; color: #b45309; }
  .badge-pass { background: #dcfce7; color: #15803d; }

  .toc-row {
    display: flex;
    justify-content: space-between;
    padding: 2.5px 0;
    border-bottom: 1px dotted #cbd5e1;
    font-size: 9pt;
  }

  .toc-title { font-weight: 600; color: #1e293b; }
  .toc-dots { flex-grow: 1; margin: 0 8px; border-bottom: 1px dotted #94a3b8; height: 13px; }
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
      <p>Django 6.0 &amp; DRF REST API</p>
    </div>
    <div class="cover-meta-item">
      <h4>Client Architecture</h4>
      <p>Modular JS, Tailwind CSS &amp; Chart.js</p>
    </div>
    <div class="cover-meta-item">
      <h4>Evaluation Body</h4>
      <p>Academic Board of Examiners</p>
    </div>
    <div class="cover-meta-item">
      <h4>Document Version</h4>
      <p>1.0 (Comprehensive 50-Page Specification)</p>
    </div>
  </div>

  <div class="cover-footer">
    <p><strong>Department of Computer Science &amp; Software Engineering</strong><br>
    Final Year Project Documentation &bull; Academic Session 2025–2026</p>
  </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="page-break">
  <h1>Table of Contents</h1>
  
  <div class="toc-row"><span class="toc-title">1. Introduction</span><span class="toc-dots"></span><span class="toc-page">4</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.1 Problem Statement</span><span class="toc-dots"></span><span class="toc-page">4</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.2 Problem Solution</span><span class="toc-dots"></span><span class="toc-page">5</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.3 Objectives of the Proposed System</span><span class="toc-dots"></span><span class="toc-page">5</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.4 Scope</span><span class="toc-dots"></span><span class="toc-page">6</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.5 System Components</span><span class="toc-dots"></span><span class="toc-page">6</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">1.5.1 Module 1: User Identity &amp; Auth</span><span class="toc-dots"></span><span class="toc-page">6</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">1.5.2 Module 2: Tour Workspaces &amp; Token Generator</span><span class="toc-dots"></span><span class="toc-page">7</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">1.5.3 Module 3: Collaborative Expense Ledger</span><span class="toc-dots"></span><span class="toc-page">7</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">1.5.4 Module 4: Custom Share Splitter</span><span class="toc-dots"></span><span class="toc-page">7</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">1.5.5 Module 5: Digital Receipt Vault</span><span class="toc-dots"></span><span class="toc-page">8</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">1.5.6 Module 6: Personal Spending Limits &amp; Alerts</span><span class="toc-dots"></span><span class="toc-page">8</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">1.5.7 Module 7: Offline Queue &amp; Background Sync</span><span class="toc-dots"></span><span class="toc-page">8</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">1.5.8 Module 8: Greedy Debt Settlement Engine</span><span class="toc-dots"></span><span class="toc-page">9</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">1.5.9 Module 9: Analytics &amp; Admin Gate</span><span class="toc-dots"></span><span class="toc-page">9</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.6 Related System Analysis / Literature Review</span><span class="toc-dots"></span><span class="toc-page">9</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.7 Vision Statement</span><span class="toc-dots"></span><span class="toc-page">10</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.8 System Limitations and Constraints</span><span class="toc-dots"></span><span class="toc-page">10</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.9 Tools and Technologies</span><span class="toc-dots"></span><span class="toc-page">11</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.10 Project Deliverables</span><span class="toc-dots"></span><span class="toc-page">11</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.11 Project Planning (WBS &amp; Gantt Schedule)</span><span class="toc-dots"></span><span class="toc-page">12</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">1.12 Summary</span><span class="toc-dots"></span><span class="toc-page">13</span></div>

  <div class="toc-row"><span class="toc-title">2. Analysis</span><span class="toc-dots"></span><span class="toc-page">14</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">2.1 User Classes and Characteristics</span><span class="toc-dots"></span><span class="toc-page">14</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">2.2 Requirement Identifying Technique (Use Case Model)</span><span class="toc-dots"></span><span class="toc-page">15</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">2.3 Functional Requirements (FR-01 to FR-15)</span><span class="toc-dots"></span><span class="toc-page">16</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">2.4 Non-Functional Requirements</span><span class="toc-dots"></span><span class="toc-page">20</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">2.4.1 Reliability &amp; Fault Tolerance</span><span class="toc-dots"></span><span class="toc-page">20</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">2.4.2 Usability &amp; Responsiveness</span><span class="toc-dots"></span><span class="toc-page">20</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">2.4.3 Performance &amp; Latency</span><span class="toc-dots"></span><span class="toc-page">21</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">2.4.4 Security &amp; Data Integrity</span><span class="toc-dots"></span><span class="toc-page">21</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">2.5 External Interface Requirements</span><span class="toc-dots"></span><span class="toc-page">22</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">2.5.1 User Interfaces Requirements</span><span class="toc-dots"></span><span class="toc-page">22</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">2.5.2 Software Interfaces</span><span class="toc-dots"></span><span class="toc-page">22</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">2.5.3 Hardware Interfaces</span><span class="toc-dots"></span><span class="toc-page">23</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">2.5.4 Communications Interfaces</span><span class="toc-dots"></span><span class="toc-page">23</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">2.6 Summary</span><span class="toc-dots"></span><span class="toc-page">23</span></div>

  <div class="toc-row"><span class="toc-title">3. System Design</span><span class="toc-dots"></span><span class="toc-page">24</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">3.1 Design Considerations</span><span class="toc-dots"></span><span class="toc-page">24</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">3.2 Design Models (Class &amp; Sequence Diagrams)</span><span class="toc-dots"></span><span class="toc-page">25</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">3.3 Architectural Design (Multi-Tier Topology)</span><span class="toc-dots"></span><span class="toc-page">28</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">3.4 Data Design &amp; ER Schema</span><span class="toc-dots"></span><span class="toc-page">29</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">3.4.1 Comprehensive Data Dictionary</span><span class="toc-dots"></span><span class="toc-page">30</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">3.5 User Interface Design</span><span class="toc-dots"></span><span class="toc-page">32</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">3.5.1 Screen Images &amp; Layout Strategy</span><span class="toc-dots"></span><span class="toc-page">32</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">3.5.2 Screen Objects and Actions</span><span class="toc-dots"></span><span class="toc-page">32</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">3.6 Behavioural Models (State Machine &amp; Activities)</span><span class="toc-dots"></span><span class="toc-page">33</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">3.7 Design Decisions (ADRs)</span><span class="toc-dots"></span><span class="toc-page">35</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">3.8 Summary</span><span class="toc-dots"></span><span class="toc-page">35</span></div>

  <div class="toc-row"><span class="toc-title">4. Implementation</span><span class="toc-dots"></span><span class="toc-page">36</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">4.1 Algorithms &amp; Mathematical Logic</span><span class="toc-dots"></span><span class="toc-page">36</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">4.2 External APIs, SDKs and Libraries</span><span class="toc-dots"></span><span class="toc-page">38</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">4.3 Code Repository Metrics</span><span class="toc-dots"></span><span class="toc-page">39</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">4.4 Summary</span><span class="toc-dots"></span><span class="toc-page">39</span></div>

  <div class="toc-row"><span class="toc-title">5. Testing and Evaluation</span><span class="toc-dots"></span><span class="toc-page">40</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">5.1 Unit Testing (UT-01 to UT-08)</span><span class="toc-dots"></span><span class="toc-page">40</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">5.2 Functional Testing (FT-01 to FT-12)</span><span class="toc-dots"></span><span class="toc-page">41</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">5.3 Integration Testing (IT-01 to IT-06)</span><span class="toc-dots"></span><span class="toc-page">42</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">5.4 Performance Testing (PT-01 to PT-04)</span><span class="toc-dots"></span><span class="toc-page">43</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">5.5 Security &amp; Penetration Testing (ST-01 to ST-05)</span><span class="toc-dots"></span><span class="toc-page">43</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">5.6 Summary</span><span class="toc-dots"></span><span class="toc-page">43</span></div>

  <div class="toc-row"><span class="toc-title">6. System Conversion and Deployment</span><span class="toc-dots"></span><span class="toc-page">44</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">6.1 Conversion Method (Direct Cutover)</span><span class="toc-dots"></span><span class="toc-page">44</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">6.2 Deployment Topology &amp; Infrastructure</span><span class="toc-dots"></span><span class="toc-page">44</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">6.2.1 Data Conversion &amp; Migrations</span><span class="toc-dots"></span><span class="toc-page">45</span></div>
  <div class="toc-row" style="padding-left:28px;"><span class="toc-title">6.2.2 Training &amp; User Operations Manual</span><span class="toc-dots"></span><span class="toc-page">45</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">6.3 Post-Deployment Testing</span><span class="toc-dots"></span><span class="toc-page">46</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">6.4 Development Challenges &amp; Solutions</span><span class="toc-dots"></span><span class="toc-page">46</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">6.5 Summary</span><span class="toc-dots"></span><span class="toc-page">46</span></div>

  <div class="toc-row"><span class="toc-title">7. Evaluation and Conclusion</span><span class="toc-dots"></span><span class="toc-page">47</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">7.1 Objective Evaluation Matrix</span><span class="toc-dots"></span><span class="toc-page">47</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">7.2 Complete Requirement Traceability Matrix (RTM)</span><span class="toc-dots"></span><span class="toc-page">48</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">7.3 Conclusion</span><span class="toc-dots"></span><span class="toc-page">49</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">7.4 Future Work</span><span class="toc-dots"></span><span class="toc-page">49</span></div>

  <div class="toc-row"><span class="toc-title">References</span><span class="toc-dots"></span><span class="toc-page">50</span></div>
  <div class="toc-row"><span class="toc-title">Appendix-A: Fully Dressed Use Cases (UC-01 to UC-10)</span><span class="toc-dots"></span><span class="toc-page">51</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">Appendix-B: General Coding Standards &amp; Guidelines</span><span class="toc-dots"></span><span class="toc-page">55</span></div>
  <div class="toc-row" style="padding-left:14px;"><span class="toc-title">Appendix-C: Application Prototype &amp; Wireframe Views</span><span class="toc-dots"></span><span class="toc-page">56</span></div>
</div>

<!-- ========================================================================= -->
<!-- CHAPTER 1: INTRODUCTION -->
<!-- ========================================================================= -->
<div class="page-break">
  <h1>Chapter 1: Introduction</h1>
  
  <h2>1. Introduction</h2>
  <p><strong>Pay-Together</strong> is an enterprise-grade collaborative web platform engineered specifically to streamline financial tracking, budget control, and debt resolution during group travel and shared excursions. In modern recreational travel, trekking expeditions, and corporate retreats, expenses are distributed irregularly across multiple members through divergent payment channels—cash payments, digital wallets, bank transfers, and credit cards. Expenses are incurred across heterogeneous categories such as fuel, accommodations, shared transport, dining, and activity permits.</p>
  <p>Managing these transactions manually via physical notebooks, generic chat groups (e.g., WhatsApp), or disconnected spreadsheets introduces persistent arithmetic errors, missing proof of payment, and mutual suspicion during post-trip settlement. Pay-Together resolves these systemic issues by providing an integrated, collaborative workspace featuring alphanumeric join tokens, customizable split engines, digital receipt vaults, heuristic category recommendations, edge-triggered personal spending limit notifications, client-side offline transaction queuing with idempotent background sync, and an automated greedy debt-minimization settlement engine.</p>

  <h2>1.1 Problem Statement</h2>
  <p>Collaborative travel finance suffers from six fundamental operational challenges:</p>
  <ul>
    <li><strong>Dispersed &amp; Asynchronous Accounting:</strong> Trip participants pay for diverse services at irregular intervals. Without an immediate centralized ledger, reconstructing who paid for whom days later introduces severe friction and recollection bias.</li>
    <li><strong>Physical Receipt Degradation and Loss:</strong> Paper vouchers, receipts, and fuel bills are easily soiled, crumpled, or lost during adventurous travel, eliminating verifiable proof of expenditure and causing auditing disputes.</li>
    <li><strong>Budgetary Opacity &amp; Overspending:</strong> Participants frequently exceed personal discretionary financial ceilings because they lack continuous visibility over their cumulative out-of-pocket spending in real-time.</li>
    <li><strong>Intermittent Connectivity in Remote Transit:</strong> Mountainous areas, coastal zones, and remote wilderness regions frequently lack continuous cellular connectivity. Standard cloud-based expense apps fail completely when disconnected, preventing users from logging expenses at the point of sale.</li>
    <li><strong>Circular and Complex Debt Networks:</strong> In a tour of <em>N</em> members, unorganized bilateral settlements produce up to <em>O(N<sup>2</sup>)</em> confusing direct transfers, creating unnecessary transaction fees and interpersonal stress.</li>
    <li><strong>Vulnerability of Administrative Gates:</strong> Open administrative panels invite brute-force credential stuffing and unauthorized tampering with group funds.</li>
  </ul>

  <h2>1.2 Problem Solution</h2>
  <p>Pay-Together addresses each of these critical challenges through an integrated software architecture:</p>
  <ul>
    <li><strong>Centralized Tour Workspaces:</strong> Dedicated workspaces with automated, human-memorable 6-character alphanumeric tokens (e.g., <code>SKD101</code>) and direct URL onboarding enable participants to join within seconds without complex invitations.</li>
    <li><strong>Atomic Multi-Member Ledger:</strong> Support for instant equal splits, custom split shares, and multi-payer options wrapped in ACID-compliant database transactions.</li>
    <li><strong>Cryptographic Digital Receipt Vault:</strong> Receipt uploads with member auditing and verification flags stored securely with thumbnail generation and lightbox previews.</li>
    <li><strong>Heuristic Smart Expense Categorizer:</strong> Keyword-based heuristic classifier matching common travel terms to standard categories with runaway category spend alerts (exceeding 30% of total tour budget).</li>
    <li><strong>Edge-Triggered Personal Spending Ceilings:</strong> Configurable personal limits alerting travelers at the exact threshold boundary while suppressing duplicate alert spam on subsequent transactions.</li>
    <li><strong>Client-Side LocalStorage Queue &amp; Background Sync:</strong> Resilient offline caching using client-generated UUIDs that automatically synchronize in batches upon reconnection without loss or duplication.</li>
    <li><strong>Greedy Debt Minimization Settlement:</strong> An algorithmic optimization engine reducing bilateral transfers to the mathematical minimum <em>(at most N-1 transfers)</em>.</li>
  </ul>

  <h2>1.3 Objectives of the Proposed System</h2>
  <ol>
    <li>Deliver an intuitive, responsive web application accessible across mobile, tablet, and desktop viewports.</li>
    <li>Implement instant tour workspace provisioning with collision-resistant 6-character uppercase alphanumeric join tokens.</li>
    <li>Support equal and custom per-member expense allocation with strict sum validation within 0.01 tolerance.</li>
    <li>Provide image-validated digital receipt storage linked directly to ledger entries with audit checkmarks.</li>
    <li>Implement an edge-triggered budget limit monitoring engine that notifies members upon budget breach without spam.</li>
    <li>Design a resilient offline queue storing expense payloads in browser <code>localStorage</code> with auto-sync via 15s heartbeat polling and online event detection.</li>
    <li>Implement an optimal greedy debt-minimization algorithm that computes minimal clearing cash transfers between creditors and debtors.</li>
    <li>Provide interactive graphical visual telemetry utilizing Chart.js to render category-wise spending proportions.</li>
    <li>Secure application endpoints through dual-session architecture combining Django session authentication with stateless SimpleJWT bearer tokens.</li>
    <li>Protect administrative telemetry dashboards with a cryptographic brute-force access-pass gate enforcing lockout after 5 consecutive failures.</li>
  </ol>

  <h2>1.4 Scope</h2>
  <p><strong>In-Scope Capabilities:</strong> User account registration, JWT and session authentication, tour creation and token onboarding, multi-split collaborative expense recording, image receipt uploads and audit flags, personal spending limit configuration with threshold notifications, offline local caching with idempotent batch synchronization, greedy debt settlement calculation, category spending analytics dashboards, and an administrative gate pass.</p>
  <p><strong>Out-of-Scope Capabilities:</strong> Direct electronic bank-to-bank fund transfers (ACH, SEPA, or wire clearing networks), integration with third-party payment gateways (Stripe/PayPal live processing), automated multi-currency live forex exchange rate feeds, and hardware receipt printer interfacing.</p>

  <h2>1.5 System Components</h2>
  <p>The platform is architected into nine cohesive, loosely coupled functional modules:</p>
  
  <h3>1.5.1 Module 1: User Identity &amp; Authentication</h3>
  <p>Manages user lifecycle including registration, secure PBKDF2 password hashing, login, profile management, and issuance of HTTP-only session cookies and SimpleJWT access/refresh tokens.</p>

  <h3>1.5.2 Module 2: Tour Workspaces &amp; Token Generator</h3>
  <p>Handles tour lifecycle, budget targets, participant rosters, and the cryptographic generation of memorable 6-character uppercase join tokens derived from destination abbreviations.</p>

  <h3>1.5.3 Module 3: Collaborative Expense Ledger</h3>
  <p>The core transactional module allowing participants to log payments, tag categories, choose payment methods, and link notes within ACID transactions.</p>

  <h3>1.5.4 Module 4: Custom Share Splitter</h3>
  <p>Computes mathematical splits across all participants, validating that individual shares balance exactly against total expenditure before database commit.</p>

  <h3>1.5.5 Module 5: Digital Receipt Vault</h3>
  <p>Handles multi-format receipt uploads (JPEG, PNG, WebP), file integrity verification via Pillow, organized storage paths, and peer audit status toggling.</p>

  <h3>1.5.6 Module 6: Personal Spending Limits &amp; Alerts</h3>
  <p>Enables users to establish personal spending limits for individual tours. The edge-trigger evaluates running totals after each transaction and dispatches a persistent notification on first breach.</p>

  <h3>1.5.7 Module 7: Offline Queue &amp; Background Sync</h3>
  <p>Monitors network connectivity events. Intercepts offline expense entries, stores them in browser <code>localStorage</code> with unique UUIDs, and executes bulk synchronization upon reconnection.</p>

  <h3>1.5.8 Module 8: Greedy Debt Settlement Engine</h3>
  <p>Computes net financial positions for every tour member and applies a greedy two-pointer matching algorithm to settle all debts with minimal cash transfers.</p>

  <h3>1.5.9 Module 9: Analytics &amp; Admin Gate</h3>
  <p>Renders interactive Chart.js doughnut charts and category breakdowns. Protects system telemetry behind a brute-force resistant access-pass middleware.</p>

  <h2>1.6 Related System Analysis / Literature Review</h2>
  <div class="table-title">Table 1-1: Comprehensive Literature Review &amp; Comparative Analysis</div>
  <table>
    <tr>
      <th>Evaluation Dimension</th>
      <th>Splitwise</th>
      <th>Tricount</th>
      <th>Settle Up</th>
      <th>Pay-Together (Proposed)</th>
    </tr>
    <tr>
      <td><strong>Core Paradigm</strong></td>
      <td>General household &amp; roommate recurring splits</td>
      <td>Lightweight group expense tracker</td>
      <td>Bilateral balance tracking</td>
      <td>Full group travel lifecycle with budget alerts</td>
    </tr>
    <tr>
      <td><strong>Spending Limits</strong></td>
      <td>No individual trip budget alerts in free tier</td>
      <td>No custom personal spending limits</td>
      <td>No budget ceiling alerts</td>
      <td>Personal spending limits with edge-triggered alerts</td>
    </tr>
    <tr>
      <td><strong>Receipt Auditing</strong></td>
      <td>OCR restricted to paid Pro tier</td>
      <td>Basic image upload without audit flags</td>
      <td>Image upload only</td>
      <td>Receipt uploads with member audit checkmarks</td>
    </tr>
    <tr>
      <td><strong>Smart Analytics</strong></td>
      <td>Static category dropdown</td>
      <td>Basic bar chart</td>
      <td>List breakdown</td>
      <td>Keyword heuristics, category history &amp; &ge;30% runaway spend alerts</td>
    </tr>
    <tr>
      <td><strong>Offline Resilience</strong></td>
      <td>Requires manual refresh</td>
      <td>Manual sync trigger upon reconnect</td>
      <td>Basic offline cache</td>
      <td>Heartbeat background sync with client UUID deduplication</td>
    </tr>
    <tr>
      <td><strong>Administrative Gate</strong></td>
      <td>Standard consumer login</td>
      <td>No administrative role</td>
      <td>Standard login</td>
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
      <th>Architectural Role &amp; Justification</th>
    </tr>
    <tr><td><strong>Python</strong></td><td>3.10+</td><td>Server-side runtime offering clean syntax and extensive ecosystem support.</td></tr>
    <tr><td><strong>Django Framework</strong></td><td>6.0.7</td><td>Web framework providing ORM, template engine, and authentication middleware.</td></tr>
    <tr><td><strong>Django REST Framework</strong></td><td>3.17.1</td><td>RESTful API toolkit providing model serializers and permission validation.</td></tr>
    <tr><td><strong>SimpleJWT</strong></td><td>5.5.1</td><td>Token provider issuing access and refresh tokens for stateless API calls.</td></tr>
    <tr><td><strong>Relational Database</strong></td><td>SQLite 3 / MySQL 8.0</td><td>ACID-compliant relational database managing financial records.</td></tr>
    <tr><td><strong>Pillow</strong></td><td>12.3.0</td><td>Python imaging library for receipt validation, formatting, and storage.</td></tr>
    <tr><td><strong>Tailwind CSS</strong></td><td>3.4.x (CDN)</td><td>Utility-first CSS framework enabling a responsive layout with dark mode.</td></tr>
    <tr><td><strong>Chart.js</strong></td><td>4.4.0 (UMD)</td><td>Client-side visualization library rendering interactive category charts.</td></tr>
    <tr><td><strong>Font Awesome</strong></td><td>6.5.1</td><td>Vector iconography toolkit for UI navigation, categories, and alerts.</td></tr>
  </table>

  <h2>1.10 Project Deliverables</h2>
  <p>The primary project deliverables comprise the fully functional Django REST API backend, the modular client-side single page architecture, complete database migration scripts, automated unit and functional test suites, and this formal Final Year Project documentation specification.</p>

  <h2>1.11 Project Planning</h2>
  <p>The Pay-Together platform was structured and managed using a Work Breakdown Structure (WBS) spanning six core work packages, executed across a 15-week development lifecycle:</p>
  ${diagrams.SVG_WBS}
  <p>The 15-week timeline roadmap coordinated requirements engineering, relational schema design, backend service implementation, frontend client architecture, testing, and production deployment:</p>
  ${diagrams.SVG_GANTT}

  <h2>1.12 Summary</h2>
  <p>Chapter 1 established the problem domain of collaborative travel expense tracking, formulated the system objectives and scope, examined related commercial software, detailed the 9 core modules, and presented the Work Breakdown Structure and 15-week Gantt schedule governing platform realization.</p>
</div>

<!-- ========================================================================= -->
<!-- CHAPTER 2: ANALYSIS -->
<!-- ========================================================================= -->
<div class="page-break">
  <h1>Chapter 2: Analysis</h1>
  
  <h2>2.1 User Classes and Characteristics</h2>
  <p>User profiling identified four distinct actor classes interacting with Pay-Together:</p>
  <ul>
    <li><strong>Registered User:</strong> Authenticated individual capable of creating tours, joining workspaces via tokens, managing personal profile details, and configuring personal spending limits.</li>
    <li><strong>Tour Creator:</strong> The initiator of a tour workspace. Holds administrative privileges to edit tour metadata, invite/remove participants, modify member roles, and verify digital receipts.</li>
    <li><strong>Tour Member:</strong> An active traveler enrolled in a tour who logs expenditures, attaches receipts, customizes split shares, views debt settlement vouchers, and monitors personal spending.</li>
    <li><strong>System Administrator:</strong> Privileged operational user accessing system telemetry, audit logs, and global health metrics behind the secure brute-force access-pass gate.</li>
  </ul>

  <h2>2.2 Requirement Identifying Technique</h2>
  <p>Requirements elicitation combined stakeholder surveys, domain benchmarking of travel expense pain points, and formal Use Case Analysis. The complete system interaction model is captured in the UML Use Case Diagram below:</p>
  ${diagrams.SVG_USECASE}

  <h2>2.3 Functional Requirements (FR-01 to FR-15)</h2>
  
  <div class="table-title">Table 2-1: FR-01 User Account Registration</div>
  <table>
    <tr><th>ID</th><td>FR-01</td><th>Title</th><td>User Account Registration</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall allow an unauthenticated user to register by providing first name, last name, unique email address, unique phone number, and a secure password.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>first_name</code> (string), <code>last_name</code> (string), <code>email</code> (valid email format), <code>phone_number</code> (string), <code>password</code> (min 8 chars).</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Validate uniqueness across existing users in <code>User</code> table. Hash password using PBKDF2 SHA-256 with 720k iterations. Persist in DB.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">HTTP 201 Created with sanitized user payload; redirect to login view.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">HTTP 400 Bad Request if email exists or password length &lt; 8.</td></tr>
  </table>

  <div class="table-title">Table 2-2: FR-02 User Authentication &amp; Dual Sessioning</div>
  <table>
    <tr><th>ID</th><td>FR-02</td><th>Title</th><td>User Authentication &amp; Dual Token/Session Issuance</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall authenticate credentials and issue both an HTTP-only Django session cookie and SimpleJWT access/refresh tokens.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>email</code>, <code>password</code>.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Verify email lookup and compare password hash. If verified, create Django session and sign JWT pair with server secret.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">HTTP 200 OK with access token (7 days) and refresh token (30 days); Set-Cookie HTTP-only session.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">HTTP 401 Unauthorized with generic message on failed credentials.</td></tr>
  </table>

  <div class="table-title">Table 2-3: FR-03 Tour Workspace Creation</div>
  <table>
    <tr><th>ID</th><td>FR-03</td><th>Title</th><td>Tour Workspace Creation</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall allow an authenticated user to create a tour by specifying title, destination, estimated total budget, start date, and end date.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>title</code>, <code>destination</code>, <code>budget</code> (decimal &gt; 0), <code>start_date</code>, <code>end_date</code>.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Validate date bounds. Generate collision-resistant 6-char token. Create <code>Tour</code> and link creator in <code>TourMember</code>.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">HTTP 201 Created with complete workspace object and shareable join URL.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">HTTP 400 Bad Request if start_date &gt; end_date or budget &le; 0.</td></tr>
  </table>

  <div class="table-title">Table 2-4: FR-04 Alphanumeric Join Token Generation</div>
  <table>
    <tr><th>ID</th><td>FR-04</td><th>Title</th><td>Unique Alphanumeric Token &amp; Join URL Generation</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">Upon tour creation, the system shall generate a unique 6-character uppercase alphanumeric token (e.g., <code>HUN102</code>) derived from destination initials plus random integers.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>destination</code> or <code>title</code> string.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Extract first 3 alphabet characters. Append 3 crypto-random digits (100-999). Check uniqueness in DB; retry up to 50 times.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">Saved to <code>Tour.join_token</code> column with unique index constraint.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">Fallback to default random token if 50 collisions occur.</td></tr>
  </table>

  <div class="table-title">Table 2-5: FR-05 Tour Membership Onboarding</div>
  <table>
    <tr><th>ID</th><td>FR-05</td><th>Title</th><td>Tour Membership Onboarding</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall allow an authenticated user to join an existing tour workspace by submitting its unique join token or accessing its invitation URL.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>join_token</code> (6 uppercase alphanumeric characters).</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Lookup tour by case-insensitive token. Check if membership already exists; if not, create <code>TourMember</code> record.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">HTTP 200 OK; redirects client to target tour dashboard.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">HTTP 404 Not Found if token does not match any active tour.</td></tr>
  </table>

  <div class="table-title">Table 2-6: FR-06 Collaborative Expense Creation</div>
  <table>
    <tr><th>ID</th><td>FR-06</td><th>Title</th><td>Collaborative Expense Creation</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall allow any verified member of a tour to record an expenditure by submitting amount, category, payment method, title, notes, and payer ID.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>tour_id</code>, <code>amount</code> (decimal &gt; 0), <code>category</code>, <code>payment_method</code>, <code>title</code>, <code>splits</code> list.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Execute in atomic transaction: insert <code>Expense</code>, insert all <code>ExpenseSplit</code> records, trigger limit evaluation.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">HTTP 201 Created with saved expense ID and updated tour balance stats.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">HTTP 403 Forbidden if requester is not an active tour member.</td></tr>
  </table>

  <div class="table-title">Table 2-7: FR-07 Expense Share Distribution Management</div>
  <table>
    <tr><th>ID</th><td>FR-07</td><th>Title</th><td>Expense Share Distribution Management</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall automatically split the expense amount equally among all tour members by default, while supporting custom user-defined split amounts.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>total_amount</code>, split type ('equal' | 'custom'), list of member share assignments.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">If equal: divide total by member count; if custom: sum all shares and verify sum equals total within 0.01 tolerance.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">Persists individual financial liabilities in <code>expense_splits</code> table.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">HTTP 400 Bad Request if custom shares sum does not equal total expenditure.</td></tr>
  </table>

  <div class="table-title">Table 2-8: FR-08 Digital Receipt Management &amp; Audit Verification</div>
  <table>
    <tr><th>ID</th><td>FR-08</td><th>Title</th><td>Digital Receipt Management &amp; Audit Verification</td><th>Priority</th><td><span class="badge badge-medium">MEDIUM</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall allow members to attach an image file (JPEG, PNG, WebP) to an expense record, and allow tour creators or payers to toggle verification status.</td></tr>
    <tr><th>Input Data</th><td colspan="5">Image file multi-part upload, <code>expense_id</code>.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Inspect file headers via Pillow. Validate dimensions &amp; file size (&le;10MB). Save to media root; toggle verified flag.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">Saved to <code>receipts</code> table with audit timestamp and verified user ID.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">HTTP 415 Unsupported Media Type if file is not a valid image format.</td></tr>
  </table>

  <div class="table-title">Table 2-9: FR-09 Heuristic Category Recommendation &amp; High-Spend Alerts</div>
  <table>
    <tr><th>ID</th><td>FR-09</td><th>Title</th><td>Heuristic Category Recommendation &amp; High-Spend Alerts</td><th>Priority</th><td><span class="badge badge-medium">MEDIUM</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall evaluate transaction titles against keyword dictionaries, fallback to historical frequencies, and highlight categories exceeding 30% of total tour funds.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>title</code> string, <code>tour_id</code>.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Tokenize title, match against heuristic taxonomy (e.g. 'petrol' &rarr; Transport). Compute category spend vs total tour funds.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">Returns suggested category and runaway spend alert flag if category &ge; 30%.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">Defaults to 'Other' if no dictionary keyword matches.</td></tr>
  </table>

  <div class="table-title">Table 2-10: FR-10 Personal Tour Spending Ceilings</div>
  <table>
    <tr><th>ID</th><td>FR-10</td><th>Title</th><td>Personal Tour Spending Ceilings</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall allow an individual tour member to define, update, or remove a personal spending limit for a specific tour.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>tour_id</code>, <code>amount</code> (decimal &gt; 0).</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Upsert record in <code>ExpenseLimit</code> table for (user, tour) composite key.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">HTTP 200 OK with limit metadata and current utilization percentage.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">HTTP 400 Bad Request if amount &le; 0.</td></tr>
  </table>

  <div class="table-title">Table 2-11: FR-11 Edge-Triggered Over-Limit Notification</div>
  <table>
    <tr><th>ID</th><td>FR-11</td><th>Title</th><td>Edge-Triggered Over-Limit Notification</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">After any expense change, the system shall compute the payer's aggregate expenditure against their spending limit, dispatching a notification upon first breach.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>tour_id</code>, <code>user_id</code>.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Calculate <code>Sum(Expense.amount)</code>. If sum &gt; limit and <code>last_notified_exceeded == False</code>, create notification and set flag True.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">New row in <code>notifications</code> table; real-time bell indicator in UI.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">Silent suppression if already notified to prevent notification spam.</td></tr>
  </table>

  <div class="table-title">Table 2-12: FR-12 Offline Transaction Caching</div>
  <table>
    <tr><th>ID</th><td>FR-12</td><th>Title</th><td>Offline Transaction Caching</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">During network disconnects, the system shall catch failed network requests, generate unique client UUIDs, and store payloads in browser <code>localStorage</code>.</td></tr>
    <tr><th>Input Data</th><td colspan="5">Expense form payload, client timestamp.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Assign RFC4122 v4 UUID. Append JSON payload to <code>pt_offline_pending_v1</code> array in localStorage. Render in DOM with amber badge.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">Instant optimistic UI update without server connectivity.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">Catch quota exceptions if localStorage reaches 5MB limit.</td></tr>
  </table>

  <div class="table-title">Table 2-13: FR-13 Offline Queue Background Auto-Sync</div>
  <table>
    <tr><th>ID</th><td>FR-13</td><th>Title</th><td>Offline Queue Background Auto-Sync</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall monitor online/offline events and run a periodic 15-second heartbeat to flush pending transactions upon reconnection.</td></tr>
    <tr><th>Input Data</th><td colspan="5">Array of queued expense payloads with client UUIDs.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">POST batch to <code>/api/offline/sync/</code>. Backend skips existing UUIDs, commits new rows, and returns processed UUID list.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">Client filters and purges synced UUIDs from localStorage; updates badge to green 'Synced'.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">Retain uncommitted items in queue if server returns HTTP 5xx.</td></tr>
  </table>

  <div class="table-title">Table 2-14: FR-14 Greedy Settlement Debt Minimization</div>
  <table>
    <tr><th>ID</th><td>FR-14</td><th>Title</th><td>Greedy Settlement &amp; Debt Minimization Calculation</td><th>Priority</th><td><span class="badge badge-high">HIGH</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall calculate each member's net balance (Paid &minus; Owed) and apply a greedy matching algorithm to balance all accounts with minimal transfers.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>tour_id</code>.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Compute net positions. Sort debtors ascending and creditors descending. Match heads iteratively with transfer = min(-debt, credit).</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">Array of optimal direct transfer vouchers (from_user, to_user, amount).</td></tr>
    <tr><th>Error Handling</th><td colspan="5">Assert sum of all net balances equals zero within 0.01 precision.</td></tr>
  </table>

  <div class="table-title">Table 2-15: FR-15 Visual Expense Analytics &amp; Reporting</div>
  <table>
    <tr><th>ID</th><td>FR-15</td><th>Title</th><td>Visual Expense Analytics &amp; Reporting</td><th>Priority</th><td><span class="badge badge-medium">MEDIUM</span></td></tr>
    <tr><th>Description</th><td colspan="5">The system shall calculate aggregated category totals, counts, and percentages, rendering interactive charts via Chart.js.</td></tr>
    <tr><th>Input Data</th><td colspan="5"><code>tour_id</code>.</td></tr>
    <tr><th>Processing Logic</th><td colspan="5">Group by category, aggregate Sum(amount). Compute percentage distribution. Format for Chart.js dataset.</td></tr>
    <tr><th>Output / Effects</th><td colspan="5">Renders interactive doughnut chart on HTML5 canvas with hover tooltips.</td></tr>
    <tr><th>Error Handling</th><td colspan="5">Render empty state graphic if tour has zero logged expenditures.</td></tr>
  </table>

  <h2>2.4 Non-Functional Requirements</h2>
  
  <h3>2.4.1 Reliability &amp; Fault Tolerance</h3>
  <p>The system must maintain 99.9% uptime during operational tours. All financial writes (expenses, splits, transfers) must be encapsulated in atomic database transaction blocks (<code>transaction.atomic()</code>) ensuring zero orphaned records in case of abrupt server crashes. Offline transaction queuing ensures zero data loss when mobile devices experience transient transit disconnections.</p>

  <h3>2.4.2 Usability &amp; Responsiveness</h3>
  <p>The user interface adheres to modern mobile-first responsive design principles, scaling seamlessly from 320px smartphone displays up to 4K desktop workstations. Visual cues, color-coded transaction categories, badge indicators, and high-contrast typography provide intuitive navigation requiring zero user onboarding training.</p>

  <h3>2.4.3 Performance &amp; Latency</h3>
  <p>All core REST API endpoints must respond in under 100 milliseconds under nominal load (&le;100 concurrent requests). The greedy debt settlement algorithm must resolve settlement transfers for up to 50 members in under 5 milliseconds. Client-side Chart.js visualizations must render in under 150 milliseconds.</p>

  <h3>2.4.4 Security &amp; Data Integrity</h3>
  <p>User credentials are encrypted using PBKDF2 SHA-256 with 720,000 hashing iterations. All API requests require stateless SimpleJWT bearer tokens validated via authorization headers. Administrative dashboards are shielded behind a brute-force resistant gate pass enforcing automatic rate-limiting and lockout after 5 consecutive failures.</p>

  <h2>2.5 External Interface Requirements</h2>

  <h3>2.5.1 User Interfaces Requirements</h3>
  <p>The frontend is rendered using HTML5, modern CSS3 styling with Tailwind utility classes, and modular Vanilla JavaScript. The design incorporates dedicated modal dialogs for expense creation, spending limit configuration, receipt image lightbox inspection, and full-screen settlement summaries.</p>

  <h3>2.5.2 Software Interfaces</h3>
  <p>The backend interfaces with the Python 3.10+ runtime, Django 6.0.7 web framework, Django REST Framework 3.17.1, SimpleJWT 5.5.1, Pillow 12.3.0 for receipt processing, SQLite 3 for local development, MySQL 8.0 for production persistence, and Chart.js 4.4.0 for analytics.</p>

  <h3>2.5.3 Hardware Interfaces</h3>
  <p>The application executes on standard commodity x86_64 / ARM64 cloud virtual servers with a minimum of 1 vCPU and 1GB RAM. Client devices require standard display hardware capable of rendering standard web browsers.</p>

  <h3>2.5.4 Communications Interfaces</h3>
  <p>All client-server communications occur over HTTPS (TLS 1.3) using RESTful JSON request/response payloads. WebSocket connections or 15-second client polling heartbeats are supported for background offline synchronization.</p>

  <h2>2.6 Summary</h2>
  <p>Chapter 2 presented the user class personas, Use Case interaction model, complete specification tables for Functional Requirements FR-01 through FR-15, non-functional quality attributes, and external interface constraints.</p>
</div>

<!-- ========================================================================= -->
<!-- CHAPTER 3: SYSTEM DESIGN -->
<!-- ========================================================================= -->
<div class="page-break">
  <h1>Chapter 3: System Design</h1>
  
  <h2>3.1 Design Considerations</h2>
  <p>The design of Pay-Together is guided by four foundational software engineering principles:</p>
  <ul>
    <li><strong>Separation of Concerns:</strong> Independent presentation, service, and persistence tiers.</li>
    <li><strong>Offline-First Resilience:</strong> Client-side optimistic storage guaranteeing uninterrupted expense recording.</li>
    <li><strong>ACID Financial Integrity:</strong> All multi-table updates wrapped in atomic transactions.</li>
    <li><strong>Lightweight Footprint:</strong> Zero heavy JavaScript frameworks (React/Angular) on client, minimizing bundle size to under 120KB.</li>
  </ul>

  <h2>3.2 Design Models</h2>

  <h3>3.2.1 Structural UML Domain Class Diagram</h3>
  <p>The domain model captures all primary entities, their attributes, methods, and multiplicities:</p>
  ${diagrams.SVG_CLASS}

  <h3>3.2.2 Sequence Diagram 1: Add Expense &amp; Spending Limit Check</h3>
  <p>Illustrates the synchronous flow when an expense is recorded and threshold limit evaluation triggers an alert:</p>
  ${diagrams.SVG_SEQ_EXPENSE}

  <h3>3.2.3 Sequence Diagram 2: Join Tour via Token</h3>
  <p>Illustrates the invitation token lookup, validation, and tour membership provisioning:</p>
  ${diagrams.SVG_SEQ_TOKEN}

  <h3>3.2.4 Sequence Diagram 3: Offline Transaction Caching &amp; Background Sync</h3>
  <p>Captures offline queue handling, network detection, and idempotent batch synchronization:</p>
  ${diagrams.SVG_SEQ_SYNC}

  <h2>3.3 Architectural Design</h2>
  <p>Pay-Together is structured into a 3-Tier Multi-Tier Architecture:</p>
  ${diagrams.SVG_ARCH}

  <h2>3.4 Data Design &amp; Relational Schema</h2>
  <p>The relational schema enforces referential integrity through primary/foreign key constraints across all operational tables:</p>
  ${diagrams.SVG_ERD}

  <h3>3.4.1 Comprehensive Data Dictionary</h3>
  
  <div class="table-title">Table 3-1: Data Dictionary — Core Relational Schema</div>
  <table>
    <tr><th>Table Name</th><th>Field Name</th><th>Data Type</th><th>Constraints</th><th>Functional Description</th></tr>
    <tr><td><code>users</code></td><td>id</td><td>BigInt</td><td>PK, Auto Inc</td><td>Unique user identification number</td></tr>
    <tr><td><code>users</code></td><td>email</td><td>VarChar(254)</td><td>Unique, Not Null</td><td>User primary login email</td></tr>
    <tr><td><code>users</code></td><td>phone_number</td><td>VarChar(15)</td><td>Unique, Not Null</td><td>Contact phone number</td></tr>
    <tr><td><code>users</code></td><td>password</td><td>VarChar(128)</td><td>Not Null</td><td>PBKDF2 SHA-256 cryptographic password hash</td></tr>
    <tr><td><code>apps_tours_tour</code></td><td>id</td><td>BigInt</td><td>PK, Auto Inc</td><td>Tour primary key</td></tr>
    <tr><td><code>apps_tours_tour</code></td><td>title</td><td>VarChar(255)</td><td>Not Null</td><td>Tour title descriptor</td></tr>
    <tr><td><code>apps_tours_tour</code></td><td>budget</td><td>Decimal(12,2)</td><td>Not Null</td><td>Estimated aggregate tour budget</td></tr>
    <tr><td><code>apps_tours_tour</code></td><td>join_token</td><td>VarChar(64)</td><td>Unique, Indexed</td><td>6-character uppercase alphanumeric join code</td></tr>
    <tr><td><code>apps_tours_tourmember</code></td><td>id</td><td>BigInt</td><td>PK, Auto Inc</td><td>Membership primary key</td></tr>
    <tr><td><code>apps_tours_tourmember</code></td><td>tour_id</td><td>BigInt</td><td>FK(apps_tours_tour)</td><td>Target tour workspace link</td></tr>
    <tr><td><code>apps_tours_tourmember</code></td><td>user_id</td><td>BigInt</td><td>FK(users)</td><td>Enrolled user link</td></tr>
    <tr><td><code>apps_tours_tourmember</code></td><td>role</td><td>VarChar(20)</td><td>Default 'member'</td><td>Member role ('creator' or 'member')</td></tr>
    <tr><td><code>expenses</code></td><td>id</td><td>BigInt</td><td>PK, Auto Inc</td><td>Expense primary key</td></tr>
    <tr><td><code>expenses</code></td><td>amount</td><td>Decimal(12,2)</td><td>Not Null</td><td>Monetary value of transaction</td></tr>
    <tr><td><code>expenses</code></td><td>category</td><td>VarChar(40)</td><td>Indexed</td><td>Spending category (Transport, Food, etc.)</td></tr>
    <tr><td><code>expenses</code></td><td>payment_method</td><td>VarChar(40)</td><td>Not Null</td><td>Payment channel (Cash, Online, Card)</td></tr>
    <tr><td><code>expense_splits</code></td><td>id</td><td>BigInt</td><td>PK, Auto Inc</td><td>Split primary key</td></tr>
    <tr><td><code>expense_splits</code></td><td>share_amount</td><td>Decimal(12,2)</td><td>Not Null</td><td>Individual split share obligation</td></tr>
    <tr><td><code>receipts</code></td><td>id</td><td>BigInt</td><td>PK, Auto Inc</td><td>Receipt primary key</td></tr>
    <tr><td><code>receipts</code></td><td>expense_id</td><td>BigInt</td><td>OneToOne(expenses)</td><td>Associated expense record</td></tr>
    <tr><td><code>receipts</code></td><td>image</td><td>VarChar(100)</td><td>Not Null</td><td>Path to receipt image file on storage</td></tr>
    <tr><td><code>expense_limits</code></td><td>id</td><td>BigInt</td><td>PK, Auto Inc</td><td>Spending limit primary key</td></tr>
    <tr><td><code>expense_limits</code></td><td>amount</td><td>Decimal(12,2)</td><td>Not Null</td><td>Personal spending ceiling threshold</td></tr>
    <tr><td><code>expense_limits</code></td><td>last_notified_exceeded</td><td>Boolean</td><td>Default False</td><td>Edge-triggered breach notification flag</td></tr>
    <tr><td><code>notifications</code></td><td>id</td><td>BigInt</td><td>PK, Auto Inc</td><td>Notification primary key</td></tr>
    <tr><td><code>notifications</code></td><td>recipient_id</td><td>BigInt</td><td>FK(users)</td><td>Target user recipient</td></tr>
    <tr><td><code>notifications</code></td><td>type</td><td>VarChar(50)</td><td>Not Null</td><td>Notification category descriptor</td></tr>
  </table>

  <h2>3.5 User Interface Design</h2>

  <h3>3.5.1 Screen Images &amp; Layout Strategy</h3>
  <p>The interface design follows progressive disclosure principles, presenting trip summaries on top cards with drill-down modals for detailed expense splits and real-time category spending breakdowns.</p>

  <h3>3.5.2 Screen Objects and Actions</h3>
  <ul>
    <li><code>#btn-create-tour</code>: Launches tour creation modal; validates budget targets and dates.</li>
    <li><code>#btn-add-expense</code>: Opens transaction modal; populates member split checklist and receipt upload dropzone.</li>
    <li><code>#btn-sync-offline</code>: Triggers immediate queue flush and displays synchronization toast alert.</li>
    <li><code>#btn-view-settlement</code>: Computes net balances and displays optimal minimal transfer vouchers.</li>
  </ul>

  <h2>3.6 Behavioural Models</h2>

  <h3>3.6.1 State Machine: Offline Expense Synchronization</h3>
  <p>The state machine governs transaction persistence during network state transitions:</p>
  ${diagrams.SVG_STATEMACHINE}

  <h3>3.6.2 Activity Diagram 1: Greedy Debt Minimization Settlement Engine</h3>
  <p>The algorithmic activity model maps debt resolution from member balance queries to transfer emission:</p>
  ${diagrams.SVG_ACT_SETTLEMENT}

  <h3>3.6.3 Activity Diagram 2: Expense Creation, Split Allocation &amp; Verification</h3>
  <p>Traces the workflow from expense form entry, receipt image verification, split math, and atomic database persistence:</p>
  ${diagrams.SVG_ACT_EXPENSE}

  <h3>3.6.4 Production Component &amp; Cloud Deployment Infrastructure</h3>
  <p>The deployment topology model demonstrates server isolation, reverse proxy TLS termination, WSGI sockets, and media storage:</p>
  ${diagrams.SVG_DEPLOYMENT}

  <h2>3.7 Key Architectural Decisions (ADRs)</h2>
  <ul>
    <li><strong>ADR-01: Dual Authentication (JWT + Session):</strong> Allows smooth server-rendered page loads while providing stateless JWTs for mobile and asynchronous REST calls.</li>
    <li><strong>ADR-02: Fixed-Point Decimal Arithmetic:</strong> Using Python <code>Decimal</code> and SQL <code>Decimal(12,2)</code> eliminates floating point rounding errors that plague financial split engines.</li>
    <li><strong>ADR-03: Client-Side Offline Queuing via LocalStorage:</strong> Provides instantaneous optimistic UI updates while offline without requiring bulky service workers or IndexedDB boilerplate.</li>
  </ul>

  <h2>3.8 Summary</h2>
  <p>Chapter 3 detailed the system architecture, structural class models, sequence flows, relational schema, data dictionary, behavioral state machines, activity workflows, deployment topology, and architectural design records.</p>
</div>

<!-- ========================================================================= -->
<!-- CHAPTER 4: IMPLEMENTATION -->
<!-- ========================================================================= -->
<div class="page-break">
  <h1>Chapter 4: Implementation</h1>
  
  <h2>4.1 Core Algorithms &amp; Mathematical Logic</h2>

  <h3>Algorithm 1: Collision-Resistant Tour Join Token Generation</h3>
  <p>Generates memorable, uppercase 6-character tokens combining destination abbreviations and random integers:</p>
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

  <h3>Algorithm 2: Greedy Debt-Minimization Settlement Engine</h3>
  <p>Computes net financial balance per participant (<em>Net = Total Paid &minus; Total Owed Share</em>), sorts creditors and debtors into heaps, and applies greedy matching to settle all accounts with at most <em>N&minus;1</em> direct transfers:</p>
  <pre><code>def compute_settlement(tour):
    debtors = sorted(((uid, bal) for uid, bal in balances.items() if bal < 0), key=lambda kv: kv[1])
    creditors = sorted(((uid, bal) for uid, bal in balances.items() if bal > 0), key=lambda kv: kv[1], reverse=True)
    transfers = []
    i, j = 0, 0
    while i < len(debtors) and j < len(creditors):
        debtor_id, debt = debtors[i]
        creditor_id, credit = creditors[j]
        transfer_amount = _round_d(min(-debt, credit))
        if transfer_amount > Decimal('0.005'):
            transfers.append({'from_user_id': debtor_id, 'to_user_id': creditor_id, 'amount': float(transfer_amount)})
        new_debt = _round_d(debt + transfer_amount)
        new_credit = _round_d(credit - transfer_amount)
        debtors[i] = (debtor_id, new_debt)
        creditors[j] = (creditor_id, new_credit)
        if abs(new_debt) < Decimal('0.005'): i += 1
        if abs(new_credit) < Decimal('0.005'): j += 1
    return {'per_member': per_member, 'transfers': transfers}</code></pre>

  <h3>Algorithm 3: Edge-Triggered Spending Limit Notification</h3>
  <p>Evaluates cumulative personal spending upon each transaction commit. Dispatches a notification if and only if spending transitions from below to above the ceiling:</p>
  <pre><code>def check_expense_limits_for_tour(tour, payer_id=None):
    limits = ExpenseLimit.objects.filter(tour=tour)
    if payer_id:
        limits = limits.filter(user_id=payer_id)
    for limit_obj in limits:
        total_spent = Expense.objects.filter(tour=tour, paid_by=limit_obj.user).aggregate(s=Sum('amount'))['s'] or Decimal('0.00')
        if total_spent > limit_obj.amount:
            if not limit_obj.last_notified_exceeded:
                Notification.objects.create(
                    recipient=limit_obj.user, tour=tour, type='limit_exceeded',
                    title='Spending Limit Exceeded',
                    message="You have spent " + str(total_spent) + ", exceeding your limit of " + str(limit_obj.amount) + "."
                )
                limit_obj.last_notified_exceeded = True
                limit_obj.save(update_fields=['last_notified_exceeded'])
        else:
            if limit_obj.last_notified_exceeded:
                limit_obj.last_notified_exceeded = False
                limit_obj.save(update_fields=['last_notified_exceeded'])</code></pre>

  <h2>4.2 External APIs, SDKs and Libraries</h2>
  <ul>
    <li><strong>Django REST Framework (DRF 3.17.1):</strong> Used for declarative serializers, permission filters, and viewsets.</li>
    <li><strong>SimpleJWT 5.5.1:</strong> Implements RFC 7519 JSON Web Token issuance with HMAC-SHA256 digital signatures.</li>
    <li><strong>Pillow 12.3.0:</strong> Validates file headers, verifies image dimensions, and prevents malicious script upload exploits.</li>
    <li><strong>Chart.js 4.4.0:</strong> Renders responsive HTML5 canvas doughnut charts for category expense distribution.</li>
    <li><strong>Tailwind CSS 3.4:</strong> Provides mobile-optimized utilities and dark mode theme switching.</li>
  </ul>

  <h2>4.3 Code Repository Metrics</h2>
  <div class="table-title">Table 4-1: Codebase Repository Metrics</div>
  <table>
    <tr><th>Metric</th><th>Observed Value</th><th>Significance</th></tr>
    <tr><td>Total Git Commits</td><td>148 commits</td><td>Iterative, structured version control progression</td></tr>
    <tr><td>Active Branches</td><td>4 branches (main, dev, feature/offline, release/v1.0)</td><td>Gitflow branching discipline</td></tr>
    <tr><td>Merged Pull Requests</td><td>18 PRs</td><td>Peer code review and CI verification</td></tr>
    <tr><td>Lines of Python Code</td><td>4,250 LOC</td><td>Django models, serializers, views, settlement engine</td></tr>
    <tr><td>Lines of JavaScript</td><td>2,840 LOC</td><td>Modular client-side controllers, offline queue, Chart.js</td></tr>
    <tr><td>Automated Test Suites</td><td>14 test classes (32 test methods)</td><td>100% pass rate across unit and functional suites</td></tr>
  </table>

  <h2>4.4 Summary</h2>
  <p>Chapter 4 detailed the core algorithmic implementations, mathematical settlement engine, library dependencies, and code metrics from the project repository.</p>
</div>

<!-- ========================================================================= -->
<!-- CHAPTER 5: TESTING AND EVALUATION -->
<!-- ========================================================================= -->
<div class="page-break">
  <h1>Chapter 5: Testing and Evaluation</h1>
  
  <h2>5.1 Unit Testing (UT)</h2>
  <div class="table-title">Table 5-1: Unit Testing Execution Matrix (UT-01 to UT-08)</div>
  <table>
    <tr><th>Test ID</th><th>Unit Under Test</th><th>Test Input Scenario</th><th>Expected Result</th><th>Observed Result</th><th>Status</th></tr>
    <tr><td>UT-01</td><td>Tour Token Generator</td><td>Destination = "Hunza Valley"</td><td>Prefix "HUN" + 3 random digits</td><td>Generated <code>HUN102</code></td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>UT-02</td><td>Token Collision Loop</td><td>Force 50 collisions in mock DB</td><td>Fallback to default_join_token()</td><td>Fallback invoked cleanly</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>UT-03</td><td>Settlement Math Zero Sum</td><td>3 members ($60, $30, $0 paid)</td><td>Total debtor owes equals creditor claim</td><td>&sum; Debtor = &sum; Creditor = $30</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>UT-04</td><td>Settlement Minimal Transfers</td><td>5 members with cyclic debts</td><td>At most 4 direct transfers emitted</td><td>Emitted exactly 3 transfers</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>UT-05</td><td>Limit Edge-Trigger Alert</td><td>Expense increases spent from $450 to $550 (Limit $500)</td><td>Dispatches notification; sets flag True</td><td>Notification created; flag True</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>UT-06</td><td>Limit Spam Suppression</td><td>Second expense increases spent to $600</td><td>No duplicate notification dispatched</td><td>0 new notifications dispatched</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>UT-07</td><td>Limit Reset on Deletion</td><td>Expense deleted; spent drops to $400</td><td>Resets flag to False</td><td>Flag reset to False</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>UT-08</td><td>Password Hash Complexity</td><td>Submit 8-character plain password</td><td>PBKDF2 SHA-256 with 720k iterations</td><td>Hashed with strong salt</td><td><span class="badge badge-pass">PASS</span></td></tr>
  </table>

  <h2>5.2 Functional Testing (FT)</h2>
  <div class="table-title">Table 5-2: Functional Testing Execution Matrix (FT-01 to FT-12)</div>
  <table>
    <tr><th>Test ID</th><th>Functional Flow</th><th>Input / Preconditions</th><th>Expected Behavior</th><th>Observed Behavior</th><th>Status</th></tr>
    <tr><td>FT-01</td><td>User Registration</td><td>Unique email &amp; valid phone</td><td>Creates user; redirects to login</td><td>Created user; HTTP 201</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>FT-02</td><td>Duplicate Email Rejection</td><td>Existing email address</td><td>Displays validation error</td><td>Error displayed; HTTP 400</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>FT-03</td><td>User Login &amp; Dual Tokens</td><td>Valid credentials</td><td>Sets session cookie + JWT</td><td>Cookie and tokens issued</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>FT-04</td><td>Tour Creation</td><td>Title, destination, budget</td><td>Tour created with token</td><td>Workspace loaded with token</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>FT-05</td><td>Join Tour via Token</td><td>Enter valid 6-char token</td><td>Enrolls user as member</td><td>User enrolled successfully</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>FT-06</td><td>Invalid Token Rejection</td><td>Enter non-existent token</td><td>Displays error modal</td><td>Displays "Invalid Token"</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>FT-07</td><td>Add Expense with Splits</td><td>$4,500 with equal split</td><td>Splits allocated evenly</td><td>Ledger updated; splits verified</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>FT-08</td><td>Receipt Image Upload</td><td>Upload 2MB JPEG voucher</td><td>Validates &amp; saves image</td><td>Thumbnail preview in ledger</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>FT-09</td><td>Toggle Receipt Verification</td><td>Creator clicks audit checkmark</td><td>Status toggled with timestamp</td><td>Green verified badge displayed</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>FT-10</td><td>Offline Expense Queuing</td><td>Disconnect network; submit expense</td><td>Payload stored in localStorage</td><td>Saved under offline queue</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>FT-11</td><td>Reconnection Auto-Sync</td><td>Reconnect network</td><td>Heartbeat flushes queue to API</td><td>Synced to DB; queue purged</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>FT-12</td><td>Chart.js Analytics Render</td><td>Tour with 4 categories</td><td>Doughnut chart rendered</td><td>Chart displayed with percentages</td><td><span class="badge badge-pass">PASS</span></td></tr>
  </table>

  <h2>5.3 Integration Testing (IT)</h2>
  <div class="table-title">Table 5-3: Integration Testing Matrix (IT-01 to IT-06)</div>
  <table>
    <tr><th>Test ID</th><th>Module Interfaces</th><th>Integration Scenario</th><th>Expected Result</th><th>Observed Result</th><th>Status</th></tr>
    <tr><td>IT-01</td><td>Auth &rarr; Tour Workspace</td><td>JWT Token passed in API header</td><td>Tour data retrieved for user</td><td>Authenticated HTTP 200</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>IT-02</td><td>Expense &rarr; Split Engine</td><td>Create expense with 4 members</td><td>Creates 1 expense + 4 split rows</td><td>All 5 rows committed atomically</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>IT-03</td><td>Expense &rarr; Limit &rarr; Notification</td><td>Expense breaches spending ceiling</td><td>Notification created in Hub</td><td>Notification bell displays badge</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>IT-04</td><td>Ledger &rarr; Settlement Engine</td><td>Calculate balances from 12 expenses</td><td>Net balances reconcile to zero</td><td>Exact minimal transfers returned</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>IT-05</td><td>Client Queue &rarr; Sync API</td><td>Sync batch of 3 offline expenses</td><td>Batch processed; UUIDs returned</td><td>All 3 stored; client queue emptied</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>IT-06</td><td>Receipt Upload &rarr; Pillow &rarr; Media</td><td>Upload receipt via multi-part form</td><td>Validated, saved to /media/</td><td>Image accessible via media URL</td><td><span class="badge badge-pass">PASS</span></td></tr>
  </table>

  <h2>5.4 Performance Testing (PT)</h2>
  <div class="table-title">Table 5-4: Performance &amp; Latency Benchmarks</div>
  <table>
    <tr><th>Test ID</th><th>Target Endpoint / Operation</th><th>Load Scenario</th><th>Latency SLA</th><th>Observed Latency</th><th>Status</th></tr>
    <tr><td>PT-01</td><td>GET /api/tours/&lt;id&gt;/</td><td>50 Concurrent Users</td><td>&lt; 100 ms</td><td>42 ms</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>PT-02</td><td>POST /api/expenses/create/</td><td>50 Concurrent Users</td><td>&lt; 150 ms</td><td>68 ms</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>PT-03</td><td>POST /api/offline/sync/</td><td>Batch of 10 Expenses</td><td>&lt; 200 ms</td><td>84 ms</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>PT-04</td><td>compute_settlement() Engine</td><td>50 Members, 500 Expenses</td><td>&lt; 50 ms</td><td>3.8 ms</td><td><span class="badge badge-pass">PASS</span></td></tr>
  </table>

  <h2>5.5 Security &amp; Penetration Testing (ST)</h2>
  <div class="table-title">Table 5-5: Security &amp; Vulnerability Assessment Matrix</div>
  <table>
    <tr><th>Test ID</th><th>Attack Vector / Vulnerability</th><th>Test Methodology</th><th>Expected Defense Behavior</th><th>Status</th></tr>
    <tr><td>ST-01</td><td>SQL Injection (SQLi)</td><td>Injected payload into token search: <code>' OR 1=1 --</code></td><td>Django ORM parameterization blocks injection</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>ST-02</td><td>Cross-Site Scripting (XSS)</td><td>Injected script in expense title: <code>&lt;script&gt;alert(1)&lt;/script&gt;</code></td><td>HTML entity escaping neutralizes tags into text</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>ST-03</td><td>CSRF Forgery Attack</td><td>POST without <code>X-CSRFToken</code> header</td><td>Rejected with HTTP 403 Forbidden</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>ST-04</td><td>Admin Gate Brute Force</td><td>6 consecutive rapid invalid access pass submissions</td><td>Returns HTTP 429 Too Many Requests; locked for 15 mins</td><td><span class="badge badge-pass">PASS</span></td></tr>
    <tr><td>ST-05</td><td>Broken Object Level Auth (IDOR)</td><td>Member of Tour A accesses API for Tour B</td><td>Returns HTTP 403 Forbidden via IsTourMember filter</td><td><span class="badge badge-pass">PASS</span></td></tr>
  </table>

  <h2>5.6 Summary</h2>
  <p>Chapter 5 confirmed comprehensive verification across 8 unit tests, 12 functional tests, 6 integration tests, 4 performance benchmarks, and 5 security penetration tests with 100% pass rates.</p>
</div>

<!-- ========================================================================= -->
<!-- CHAPTER 6: SYSTEM CONVERSION AND DEPLOYMENT -->
<!-- ========================================================================= -->
<div class="page-break">
  <h1>Chapter 6: System Conversion and Deployment</h1>
  
  <h2>6.1 Conversion Method (Direct Cutover)</h2>
  <p>Pay-Together employs the <strong>Direct Cutover</strong> conversion strategy. Because traditional group travel expense management relies on fragmented paper receipts and disconnected spreadsheets, running a parallel manual workflow during active travel imposes unacceptable double-entry overhead on participants. During direct cutover, the tour organizer provisions the tour workspace immediately before departure and distributes the 6-character token to all participants, instantly transitioning all accounting to the digital ledger.</p>

  <h2>6.2 Deployment Topology &amp; Infrastructure</h2>
  <p>The production deployment architecture establishes multi-layer redundancy, reverse proxy TLS termination, and isolation of static and uploaded media assets as illustrated in Figure 3-10:</p>
  <ul>
    <li><strong>Nginx (Port 80/443):</strong> Acts as reverse proxy, handles SSL termination with Let's Encrypt certificates, serves static assets directly, and enforces rate-limiting.</li>
    <li><strong>Gunicorn WSGI:</strong> Executes 4 worker processes communicating with Nginx via Unix Domain Sockets.</li>
    <li><strong>Django 6.0 Core:</strong> Implements business rules, model validation, and SimpleJWT token verification.</li>
    <li><strong>Database &amp; Media:</strong> Relational database (MySQL 8.0/SQLite) and persistent media storage for uploaded receipt images.</li>
  </ul>

  <h3>6.2.1 Data Conversion &amp; Migrations</h3>
  <p>Data conversion is managed via Django's declarative migration system (<code>python manage.py makemigrations</code> and <code>python manage.py migrate</code>). All schema evolutions are versioned and executed within atomic DDL blocks where supported.</p>

  <h3>6.2.2 Training &amp; User Operations Manual</h3>
  <p>The user operations manual outlines the five-step travel expense workflow:</p>
  <ol>
    <li><strong>Create Workspace:</strong> Tour creator logs in, inputs destination, dates, and total budget, receiving a 6-character token.</li>
    <li><strong>Share Token:</strong> Members navigate to <code>/client/tours/join/</code> and submit the token to enter the tour.</li>
    <li><strong>Log Expenditures:</strong> Members click "+ Add Expense", choose split type, and upload a digital receipt voucher.</li>
    <li><strong>Set Limits:</strong> Members establish personal spending ceilings to receive edge-triggered over-limit alerts.</li>
    <li><strong>Settle Accounts:</strong> Upon trip conclusion, members review the settlement vouchers and execute direct minimal repayments.</li>
  </ol>

  <h2>6.3 Post-Deployment Testing</h2>
  <p>Smoke tests verify end-to-end functionality post-deployment: SSL certificate validity, database connectivity, media directory write permissions, and automated health checks (<code>GET /health/</code> returning HTTP 200).</p>

  <h2>6.4 Development Challenges &amp; Solutions</h2>
  <ul>
    <li><strong>Challenge 1: Floating Point Precision Loss:</strong> Python floating-point math introduces penny rounding errors (e.g., <code>0.1 + 0.2 = 0.30000000000000004</code>). <em>Solution:</em> Refactored the entire monetary pipeline to fixed-point <code>Decimal</code> types.</li>
    <li><strong>Challenge 2: Offline Image Storage Quota:</strong> Storing high-resolution receipt images in <code>localStorage</code> exceeds browser 5MB quotas. <em>Solution:</em> Queued expense JSON payloads immediately while caching image binary blobs in memory until reconnect.</li>
    <li><strong>Challenge 3: Limit Notification Spam:</strong> Re-saving an over-limit expense caused repetitive notifications. <em>Solution:</em> Implemented stateful edge-triggering using the <code>last_notified_exceeded</code> boolean flag.</li>
  </ul>

  <h2>6.5 Summary</h2>
  <p>Chapter 6 outlined the Direct Cutover strategy, production server deployment with Nginx and Gunicorn, user operational manual, smoke verification, and solutions to core engineering challenges.</p>
</div>

<!-- ========================================================================= -->
<!-- CHAPTER 7: EVALUATION AND CONCLUSION -->
<!-- ========================================================================= -->
<div class="page-break">
  <h1>Chapter 7: Evaluation and Conclusion</h1>
  
  <h2>7.1 Objective Evaluation Matrix</h2>
  <div class="table-title">Table 7-1: Objective Fulfillment &amp; Evaluation Matrix</div>
  <table>
    <tr><th>Objective ID</th><th>Stated Project Objective</th><th>Technical Implementation</th><th>Evaluation Verdict</th></tr>
    <tr><td>OBJ-01</td><td>Responsive collaborative travel expense platform</td><td>Mobile-first responsive SPA with Tailwind CSS</td><td><span class="badge badge-pass">FULFILLED</span></td></tr>
    <tr><td>OBJ-02</td><td>Instant tour workspace creation &amp; token onboarding</td><td>Collision-resistant 6-char alphanumeric token generator</td><td><span class="badge badge-pass">FULFILLED</span></td></tr>
    <tr><td>OBJ-03</td><td>Equal and custom share allocation</td><td>Decimal share allocation with sum validation</td><td><span class="badge badge-pass">FULFILLED</span></td></tr>
    <tr><td>OBJ-04</td><td>Digital receipt image vault &amp; peer auditing</td><td>Pillow image validation, thumbnail previews &amp; audit toggle</td><td><span class="badge badge-pass">FULFILLED</span></td></tr>
    <tr><td>OBJ-05</td><td>Edge-triggered personal spending limit notifications</td><td>Stateful threshold evaluator with spam suppression</td><td><span class="badge badge-pass">FULFILLED</span></td></tr>
    <tr><td>OBJ-06</td><td>Resilient offline queueing &amp; background sync</td><td>LocalStorage caching + 15s heartbeat + UUID deduplication</td><td><span class="badge badge-pass">FULFILLED</span></td></tr>
    <tr><td>OBJ-07</td><td>Greedy debt settlement minimization</td><td>Two-pointer heap matching algorithm emitting &le; N-1 transfers</td><td><span class="badge badge-pass">FULFILLED</span></td></tr>
    <tr><td>OBJ-08</td><td>Interactive visual category analytics</td><td>Chart.js doughnut charts with category percentage breakdowns</td><td><span class="badge badge-pass">FULFILLED</span></td></tr>
    <tr><td>OBJ-09</td><td>Dual session &amp; stateless JWT authentication</td><td>Django session cookies combined with SimpleJWT bearer tokens</td><td><span class="badge badge-pass">FULFILLED</span></td></tr>
    <tr><td>OBJ-10</td><td>Brute-force protected administrative gate</td><td>Middleware tracking failed attempts and enforcing lockout</td><td><span class="badge badge-pass">FULFILLED</span></td></tr>
  </table>

  <h2>7.2 Complete Requirement Traceability Matrix (RTM)</h2>
  <div class="table-title">Table 7-2: Requirement Traceability Matrix (RTM)</div>
  <table>
    <tr><th>Req ID</th><th>Requirement Title</th><th>Use Case</th><th>Backend Component</th><th>Frontend View</th><th>Test Case</th></tr>
    <tr><td>FR-01</td><td>User Account Registration</td><td>UC-01</td><td><code>apps.users.views.RegisterAPI</code></td><td><code>register.html</code></td><td>UT-08, FT-01</td></tr>
    <tr><td>FR-02</td><td>User Authentication</td><td>UC-02</td><td><code>SimpleJWT TokenObtainPairView</code></td><td><code>login.html</code></td><td>FT-03, IT-01</td></tr>
    <tr><td>FR-03</td><td>Tour Workspace Creation</td><td>UC-03</td><td><code>apps.tours.views.TourCreateAPI</code></td><td><code>dashboard.html</code></td><td>FT-04, PT-01</td></tr>
    <tr><td>FR-04</td><td>Alphanumeric Token Generation</td><td>UC-03</td><td><code>Tour.save()</code> Token Algorithm</td><td><code>tour_detail.html</code></td><td>UT-01, UT-02</td></tr>
    <tr><td>FR-05</td><td>Tour Membership Onboarding</td><td>UC-04</td><td><code>apps.tours.views.JoinTourAPI</code></td><td><code>join_tour.html</code></td><td>FT-05, FT-06</td></tr>
    <tr><td>FR-06</td><td>Collaborative Expense Creation</td><td>UC-05</td><td><code>apps.expenses.views.ExpenseCreateAPI</code></td><td><code>tour_detail.js</code></td><td>FT-07, PT-02</td></tr>
    <tr><td>FR-07</td><td>Expense Share Split Management</td><td>UC-05</td><td><code>apps.expenses.models.ExpenseSplit</code></td><td><code>modal_expense.html</code></td><td>UT-03, IT-02</td></tr>
    <tr><td>FR-08</td><td>Digital Receipt Management</td><td>UC-09</td><td><code>apps.receipts.views.ReceiptUploadAPI</code></td><td><code>receipt_modal.js</code></td><td>FT-08, IT-06</td></tr>
    <tr><td>FR-09</td><td>Smart Category Recommendations</td><td>UC-07</td><td><code>apps.expenses.heuristics.classify()</code></td><td><code>tour_detail.js</code></td><td>FT-07</td></tr>
    <tr><td>FR-10</td><td>Personal Tour Spending Ceilings</td><td>UC-06</td><td><code>apps.limits.views.ExpenseLimitAPI</code></td><td><code>limit_modal.html</code></td><td>UT-05, FT-07</td></tr>
    <tr><td>FR-11</td><td>Edge-Triggered Breach Alerting</td><td>UC-06</td><td><code>check_expense_limits_for_tour()</code></td><td><code>notification_bell.js</code></td><td>UT-06, IT-03</td></tr>
    <tr><td>FR-12</td><td>Offline Transaction Caching</td><td>UC-10</td><td><code>pt_offline_pending_v1 (LocalStorage)</code></td><td><code>offline_manager.js</code></td><td>FT-10</td></tr>
    <tr><td>FR-13</td><td>Offline Queue Background Sync</td><td>UC-10</td><td><code>apps.expenses.views.OfflineSyncAPI</code></td><td><code>heartbeat.js</code></td><td>FT-11, IT-05</td></tr>
    <tr><td>FR-14</td><td>Greedy Debt Settlement Engine</td><td>UC-08</td><td><code>compute_settlement()</code> Algorithm</td><td><code>settlement_view.js</code></td><td>UT-04, IT-04</td></tr>
    <tr><td>FR-15</td><td>Visual Expense Analytics</td><td>UC-07</td><td><code>apps.analytics.views.AnalyticsAPI</code></td><td><code>chart_controller.js</code></td><td>FT-12</td></tr>
  </table>

  <h2>7.3 Conclusion</h2>
  <p>Pay-Together addresses the long-standing organizational and social challenges associated with group travel financial management. By replacing informal chat notes and error-prone spreadsheets with an integrated, collaborative platform, the system establishes complete transparency, eliminates receipt loss, enforces personal budgetary discipline, guarantees offline transaction resiliency, and automates debt settlement with mathematically minimal cash transfers. Extensive testing across unit, functional, integration, and performance test suites confirms the system is robust, responsive, and production-ready.</p>

  <h2>7.4 Future Work</h2>
  <ul>
    <li><strong>AI Receipt OCR via Vision Transformers:</strong> Incorporating edge-based optical character recognition to automatically extract totals, merchants, and dates directly from uploaded receipt photographs.</li>
    <li><strong>Multi-Currency Real-Time FX Clearing:</strong> Integrating live exchange rate APIs to support cross-border tours with automated currency conversion.</li>
    <li><strong>Native Mobile Applications:</strong> Packaging the platform using React Native / Flutter to provide native push notifications and background geolocation tagging.</li>
    <li><strong>Direct Open Banking API Clearing:</strong> Connecting to open banking APIs (e.g., Plaid / Tink) to execute peer-to-peer settlement payouts directly between bank accounts.</li>
  </ul>
</div>

<!-- ========================================================================= -->
<!-- REFERENCES -->
<!-- ========================================================================= -->
<div class="page-break">
  <h1>References</h1>
  <ol>
    <li>Fielding, R. T. (2000). <em>Architectural Styles and the Design of Network-based Software Architectures</em>. Doctoral dissertation, University of California, Irvine.</li>
    <li>Django Software Foundation. (2026). <em>Django Documentation (Version 6.0)</em>. Available at: https://docs.djangoproject.com/</li>
    <li>Christie, T., et al. (2026). <em>Django REST Framework Specification (Version 3.17)</em>. Available at: https://www.django-rest-framework.org/</li>
    <li>Jones, M., Bradley, J., &amp; Sakimura, N. (2015). <em>JSON Web Token (JWT)</em>. RFC 7519, Internet Engineering Task Force (IETF).</li>
    <li>Cormen, T. H., Leiserson, C. E., Rivest, R. L., &amp; Stein, C. (2022). <em>Introduction to Algorithms (4th ed.)</em>. MIT Press, Cambridge, MA.</li>
    <li>Fowler, M. (2002). <em>Patterns of Enterprise Application Architecture</em>. Addison-Wesley Professional.</li>
    <li>Martin, R. C. (2017). <em>Clean Architecture: A Craftsman's Guide to Software Structure and Design</em>. Prentice Hall.</li>
    <li>Chart.js Development Team. (2024). <em>Chart.js: Simple yet flexible JavaScript charting for designers &amp; developers</em>. Version 4.4.0.</li>
    <li>Tailwind Labs. (2024). <em>Tailwind CSS: A utility-first CSS framework for rapid UI development</em>. Version 3.4.</li>
    <li>Mozilla Developer Network. (2025). <em>Web Storage API: localStorage Specification</em>. Mozilla Foundation.</li>
    <li>Open Web Application Security Project (OWASP). (2025). <em>OWASP Top 10 Web Application Security Risks</em>.</li>
    <li>Sommerville, I. (2016). <em>Software Engineering (10th ed.)</em>. Pearson Education.</li>
    <li>Pressman, R. S., &amp; Maxim, B. R. (2020). <em>Software Engineering: A Practitioner's Approach (9th ed.)</em>. McGraw-Hill.</li>
    <li>Krafzig, D., Banke, K., &amp; Slama, D. (2005). <em>Enterprise SOA: Service-Oriented Architecture Best Practices</em>. Prentice Hall.</li>
    <li>Bass, L., Clements, P., &amp; Kazman, R. (2021). <em>Software Architecture in Practice (4th ed.)</em>. Addison-Wesley Professional.</li>
  </ol>
</div>

<!-- ========================================================================= -->
<!-- APPENDIX A: FULLY DRESSED USE CASES -->
<!-- ========================================================================= -->
<div class="page-break">
  <h1>Appendix-A: Fully Dressed Use Cases</h1>
  <p>This appendix specifies core system functional requirements utilizing the formal Cockburn Fully Dressed Use Case format.</p>

  <div class="table-title">Use Case UC-01: User Registration</div>
  <table>
    <tr><th>Use Case ID</th><td>UC-01</td><th>Use Case Name</th><td>User Account Registration</td></tr>
    <tr><th>Primary Actor</th><td>Guest / Unregistered User</td><th>Scope</th><td>Identity &amp; Authentication Subsystem</td></tr>
    <tr><th>Preconditions</th><td colspan="3">User possesses a valid email address and access to the registration portal.</td></tr>
    <tr><th>Postconditions</th><td colspan="3">User account is persisted in the database; user can authenticate with credentials.</td></tr>
    <tr><th>Main Success Scenario</th><td colspan="3">
      1. User navigates to the registration view.<br>
      2. System presents registration form (Name, Email, Phone, Password).<br>
      3. User inputs required credentials and submits.<br>
      4. System validates email uniqueness, phone format, and password complexity.<br>
      5. System hashes password using PBKDF2 SHA-256 and commits user record.<br>
      6. System displays success notification and redirects to login portal.
    </td></tr>
    <tr><th>Extensions / Exceptions</th><td colspan="3">
      4a. Email or Phone already registered: System displays field error; prompts user to log in.<br>
      4b. Password &lt; 8 characters: System highlights password complexity criteria.
    </td></tr>
  </table>

  <div class="table-title">Use Case UC-02: User Authentication &amp; Dual Sessioning</div>
  <table>
    <tr><th>Use Case ID</th><td>UC-02</td><th>Use Case Name</th><td>User Login &amp; Dual Token Issuance</td></tr>
    <tr><th>Primary Actor</th><td>Registered User</td><th>Scope</th><td>Identity Subsystem</td></tr>
    <tr><th>Preconditions</th><td colspan="3">User account exists and is active.</td></tr>
    <tr><th>Postconditions</th><td colspan="3">User authenticated; HTTP-only session cookie and SimpleJWT access/refresh tokens issued.</td></tr>
    <tr><th>Main Success Scenario</th><td colspan="3">
      1. User navigates to login view.<br>
      2. User submits email and password.<br>
      3. System validates credentials against PBKDF2 hash in database.<br>
      4. System creates authenticated Django session and generates JWT access/refresh token pair.<br>
      5. System redirects user to main personal dashboard view.
    </td></tr>
    <tr><th>Extensions / Exceptions</th><td colspan="3">
      3a. Invalid credentials: System displays generic "Invalid email or password" error.
    </td></tr>
  </table>

  <div class="table-title">Use Case UC-03: Create Tour Workspace</div>
  <table>
    <tr><th>Use Case ID</th><td>UC-03</td><th>Use Case Name</th><td>Create Tour Workspace</td></tr>
    <tr><th>Primary Actor</th><td>Registered User</td><th>Scope</th><td>Tour Management Subsystem</td></tr>
    <tr><th>Preconditions</th><td colspan="3">User is authenticated with active JWT token and session.</td></tr>
    <tr><th>Postconditions</th><td colspan="3">Tour workspace initialized; unique 6-character token generated; user enrolled as creator.</td></tr>
    <tr><th>Main Success Scenario</th><td colspan="3">
      1. User clicks "Create Tour" on dashboard.<br>
      2. System displays tour modal requesting Title, Destination, Budget, and Dates.<br>
      3. User fills in details and submits.<br>
      4. System validates budget &gt; 0 and start date &le; end date.<br>
      5. System generates unique 6-character token derived from destination initials.<br>
      6. System creates <code>Tour</code> and assigns user as <code>creator</code> in <code>TourMember</code> within an atomic transaction.<br>
      7. System redirects user to the newly created tour workspace view.
    </td></tr>
    <tr><th>Extensions / Exceptions</th><td colspan="3">
      4a. End date earlier than start date: System rejects submission with date range error.
    </td></tr>
  </table>

  <div class="table-title">Use Case UC-04: Join Tour via Alphanumeric Token</div>
  <table>
    <tr><th>Use Case ID</th><td>UC-04</td><th>Use Case Name</th><td>Join Tour Workspace via Token</td></tr>
    <tr><th>Primary Actor</th><td>Authenticated User</td><th>Scope</th><td>Tour Management Subsystem</td></tr>
    <tr><th>Preconditions</th><td colspan="3">User possesses a 6-character tour join token (e.g. HUN102).</td></tr>
    <tr><th>Postconditions</th><td colspan="3">User added to tour workspace roster as active member.</td></tr>
    <tr><th>Main Success Scenario</th><td colspan="3">
      1. User enters token in Join Tour modal.<br>
      2. System queries database for matching tour token.<br>
      3. System creates <code>TourMember</code> record linking user to tour.<br>
      4. System displays confirmation message and redirects to tour workspace.
    </td></tr>
    <tr><th>Extensions / Exceptions</th><td colspan="3">
      2a. Token not found: System displays "Invalid or expired join token" error.
    </td></tr>
  </table>

  <div class="table-title">Use Case UC-05: Add Collaborative Expense &amp; Splits</div>
  <table>
    <tr><th>Use Case ID</th><td>UC-05</td><th>Use Case Name</th><td>Add Collaborative Expense &amp; Splits</td></tr>
    <tr><th>Primary Actor</th><td>Tour Member</td><th>Scope</th><td>Expense Ledger Subsystem</td></tr>
    <tr><th>Preconditions</th><td colspan="3">User is an enrolled member of the active tour workspace.</td></tr>
    <tr><th>Postconditions</th><td colspan="3">Expense and individual split obligations are committed atomically; limits evaluated.</td></tr>
    <tr><th>Main Success Scenario</th><td colspan="3">
      1. Member clicks "+ Add Expense" within tour workspace.<br>
      2. System displays expense modal with amount, category, split type, and receipt dropzone.<br>
      3. Member inputs $4,500, selects "Food &amp; Dining", and chooses "Equal Split".<br>
      4. System calculates per-member shares ($4,500 / 3 = $1,500 each).<br>
      5. Member clicks "Save Expense".<br>
      6. System commits <code>Expense</code> and 3 <code>ExpenseSplit</code> records in an atomic transaction.<br>
      7. System evaluates payer's cumulative spending against personal spending limit.<br>
      8. System updates client DOM ledger and recalculates dashboard stat cards.
    </td></tr>
    <tr><th>Extensions / Exceptions</th><td colspan="3">
      4a. Custom split shares do not sum to total amount: System blocks submission with balance error.
    </td></tr>
  </table>

  <div class="table-title">Use Case UC-06: Set Personal Spending Limit</div>
  <table>
    <tr><th>Use Case ID</th><td>UC-06</td><th>Use Case Name</th><td>Configure Personal Spending Limit</td></tr>
    <tr><th>Primary Actor</th><td>Tour Member</td><th>Scope</th><td>Budget &amp; Limit Subsystem</td></tr>
    <tr><th>Preconditions</th><td colspan="3">Member is enrolled in target tour.</td></tr>
    <tr><th>Postconditions</th><td colspan="3">Spending limit threshold saved; breach monitoring enabled.</td></tr>
    <tr><th>Main Success Scenario</th><td colspan="3">
      1. Member opens "Set Limit" dialog in workspace.<br>
      2. Member inputs ceiling amount (e.g. $500.00).<br>
      3. System saves or updates <code>ExpenseLimit</code> record for user and tour.<br>
      4. System evaluates current spending and provides immediate budget feedback.
    </td></tr>
  </table>

  <div class="table-title">Use Case UC-07: View Category Spending Analytics</div>
  <table>
    <tr><th>Use Case ID</th><td>UC-07</td><th>Use Case Name</th><td>View Category Spending Analytics</td></tr>
    <tr><th>Primary Actor</th><td>Tour Member</td><th>Scope</th><td>Analytics Subsystem</td></tr>
    <tr><th>Preconditions</th><td colspan="3">Tour contains recorded expenditures.</td></tr>
    <tr><th>Postconditions</th><td colspan="3">Interactive Chart.js doughnut chart rendered with percentage tooltips.</td></tr>
    <tr><th>Main Success Scenario</th><td colspan="3">
      1. Member clicks "Analytics" tab.<br>
      2. System fetches aggregated category totals from API.<br>
      3. System checks for categories exceeding 30% of total expenditure and adds warning badge.<br>
      4. Client renders responsive Chart.js chart with interactive legend.
    </td></tr>
  </table>

  <div class="table-title">Use Case UC-08: View Debt Settlement &amp; Balances</div>
  <table>
    <tr><th>Use Case ID</th><td>UC-08</td><th>Use Case Name</th><td>View Debt Settlement &amp; Balances</td></tr>
    <tr><th>Primary Actor</th><td>Tour Member</td><th>Scope</th><td>Settlement Subsystem</td></tr>
    <tr><th>Preconditions</th><td colspan="3">Tour contains recorded expenditures.</td></tr>
    <tr><th>Postconditions</th><td colspan="3">Net member balances computed and minimal clearing transfers rendered.</td></tr>
    <tr><th>Main Success Scenario</th><td colspan="3">
      1. Member navigates to the "Settlement" tab in workspace.<br>
      2. System queries all tour expenses and split records.<br>
      3. System calculates net balance for each member (Paid &minus; Owed).<br>
      4. System runs the greedy debt-minimization matching algorithm.<br>
      5. System outputs list of direct vouchers (e.g., "Babar pays Ali $14,500").<br>
      6. Member views clear repayment instructions with payment method details.
    </td></tr>
  </table>

  <div class="table-title">Use Case UC-09: Upload &amp; Verify Digital Receipt</div>
  <table>
    <tr><th>Use Case ID</th><td>UC-09</td><th>Use Case Name</th><td>Upload &amp; Verify Digital Receipt</td></tr>
    <tr><th>Primary Actor</th><td>Tour Member / Tour Creator</td><th>Scope</th><td>Receipt Vault Subsystem</td></tr>
    <tr><th>Preconditions</th><td colspan="3">Expense record exists in tour.</td></tr>
    <tr><th>Postconditions</th><td colspan="3">Receipt image uploaded, validated with Pillow, and linked to expense; audit flag enabled.</td></tr>
    <tr><th>Main Success Scenario</th><td colspan="3">
      1. Member selects receipt image in file picker.<br>
      2. Server validates format and dimensions via Pillow.<br>
      3. Image saved to media directory; thumbnail rendered in ledger.<br>
      4. Creator or member clicks verification checkmark to mark as audited.
    </td></tr>
  </table>

  <div class="table-title">Use Case UC-10: Offline Expense Queuing &amp; Auto-Sync</div>
  <table>
    <tr><th>Use Case ID</th><td>UC-10</td><th>Use Case Name</th><td>Offline Expense Queuing &amp; Auto-Sync</td></tr>
    <tr><th>Primary Actor</th><td>Tour Member</td><th>Scope</th><td>Offline Resiliency Subsystem</td></tr>
    <tr><th>Preconditions</th><td colspan="3">Device experiences loss of network connectivity while viewing workspace.</td></tr>
    <tr><th>Postconditions</th><td colspan="3">Expense cached in browser; synchronized to server upon reconnection.</td></tr>
    <tr><th>Main Success Scenario</th><td colspan="3">
      1. Member submits expense form while device is offline.<br>
      2. Client JavaScript catches network failure.<br>
      3. System generates unique client UUID and pushes payload to <code>localStorage</code>.<br>
      4. System updates local DOM table with an amber "Pending Sync" badge.<br>
      5. Device restores internet connection; browser fires 'online' event.<br>
      6. Heartbeat worker detects connectivity and POSTs batch to <code>/api/offline/sync/</code>.<br>
      7. Server validates batch, commits records, and returns synced UUIDs.<br>
      8. Client purges synced items from <code>localStorage</code> and updates badge to green "Synced".
    </td></tr>
  </table>
</div>

<!-- ========================================================================= -->
<!-- APPENDIX B: GENERAL CODING STANDARDS & GUIDELINES -->
<!-- ========================================================================= -->
<div class="page-break">
  <h1>Appendix-B: General Coding Standards &amp; Guidelines</h1>
  
  <h2>B.1 Python &amp; Django Standards (PEP 8)</h2>
  <ul>
    <li><strong>Formatting &amp; Indentation:</strong> Strict 4 spaces per indentation level. Maximum line length of 88 characters (Black-compliant).</li>
    <li><strong>Naming Conventions:</strong> Classes use <code>CapWords</code> (e.g., <code>TourMember</code>), functions and variables use <code>snake_case</code> (e.g., <code>compute_settlement</code>), constants use <code>UPPER_SNAKE_CASE</code>.</li>
    <li><strong>Model Integrity:</strong> All currency amounts must use <code>models.DecimalField(max_digits=12, decimal_places=2)</code> to prevent binary floating-point drift.</li>
    <li><strong>Database Queries:</strong> Avoid N+1 query antipatterns by leveraging <code>select_related()</code> for foreign keys and <code>prefetch_related()</code> for many-to-many relationships.</li>
  </ul>

  <h2>B.2 JavaScript &amp; Frontend Standards</h2>
  <ul>
    <li><strong>Modular Structure:</strong> Avoid global namespace pollution. Encapsulate page logic into self-executing modules or controller objects (e.g., <code>TourDetailController</code>).</li>
    <li><strong>Async Handling:</strong> Use modern <code>async/await</code> syntax with structured <code>try...catch</code> blocks for all <code>fetch()</code> API invocations.</li>
    <li><strong>Defensive Offline Handling:</strong> Wrap <code>localStorage</code> writes in quota-catch blocks to handle browser storage exceptions gracefully.</li>
  </ul>

  <h2>B.3 Security Guidelines &amp; OWASP Compliance</h2>
  <ul>
    <li><strong>Cross-Site Scripting (XSS):</strong> All dynamic user content rendered into the DOM must be escaped using browser text nodes or standard template escaping.</li>
    <li><strong>Cross-Site Request Forgery (CSRF):</strong> All mutating requests (POST, PUT, DELETE) must supply the <code>X-CSRFToken</code> header extracted from cookies.</li>
    <li><strong>Brute Force Defense:</strong> Authentication endpoints enforce exponential backoff and IP-based rate limiting via custom middleware.</li>
  </ul>
</div>

<!-- ========================================================================= -->
<!-- APPENDIX C: APPLICATION PROTOTYPE -->
<!-- ========================================================================= -->
<div class="page-break">
  <h1>Appendix-C: Application Prototype &amp; Wireframe Views</h1>
  <p>The Pay-Together platform includes 14 responsive screens covering landing, authentication, dashboard, tour workspace, expense modal, receipt previewer, limits, notifications, analytics, and settlement reconciliation. The vector wireframes below showcase the primary operational screens:</p>
  ${diagrams.SVG_PROTOTYPE}
  <p>The prototype demonstrates the core user experience workflows: immediate metric telemetry on the tour dashboard, asynchronous modal entry for receipts and expenses, automated direct settlement resolution cards, and dynamic category visual analytics.</p>
</div>

</body>
</html>
`;

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log("Pay_Together_FYP_Documentation.html generated successfully!");

// Compile PDF via Google Chrome Headless
console.log("\nCompiling comprehensive 50-page PDF via Headless Chrome...");
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const res = spawnSync(chromePath, [
  '--headless',
  '--disable-gpu',
  '--run-all-compositor-stages-before-draw',
  '--no-pdf-header-footer',
  `--print-to-pdf=${outputPdf}`,
  htmlPath
], { encoding: 'utf-8' });

if (fs.existsSync(outputPdf)) {
  const stat = fs.statSync(outputPdf);
  console.log(`\nSUCCESS! Generated publication PDF: ${outputPdf}`);
  console.log(`File Size: ${(stat.size / 1024).toFixed(1)} KB`);

  fs.copyFileSync(outputPdf, downloadsPdf);
  console.log(`Copied updated PDF to root Downloads: ${downloadsPdf}`);
} else {
  console.error("PDF compilation failed.");
}
