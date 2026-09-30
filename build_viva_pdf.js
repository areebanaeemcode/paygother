const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const mdPath = path.resolve(__dirname, 'Pay_Together_FYP_Viva_Questions_and_Answers.md');
const htmlPath = path.resolve(__dirname, 'Pay_Together_FYP_Viva_Questions_and_Answers.html');
const pdfPath = path.resolve(__dirname, 'Pay_Together_FYP_Viva_Questions_and_Answers.pdf');

const md = fs.readFileSync(mdPath, 'utf8');

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Convert markdown to HTML
let html = '';
const lines = md.split('\n');

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  if (line.startsWith('# ')) {
    html += `<h1>${escapeHtml(line.slice(2))}</h1>\n`;
  } else if (line.startsWith('## ')) {
    html += `<h2>${escapeHtml(line.slice(3))}</h2>\n`;
  } else if (line.startsWith('### ')) {
    html += `<h3>${escapeHtml(line.slice(4))}</h3>\n`;
  } else if (line.startsWith('#### ')) {
    const qText = escapeHtml(line.slice(5));
    html += `<div class="question-box"><h4>${qText}</h4>\n`;
  } else if (line.startsWith('**Answer:**')) {
    let ans = line.replace(/^\*\*Answer:\*\*\s*/, '');
    ans = ans.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    ans = ans.replace(/`([^`]+)`/g, '<code>$1</code>');
    html += `<p class="answer"><strong>Answer:</strong> ${ans}</p></div>\n`;
  } else if (line.startsWith('- ')) {
    let li = line.slice(2);
    li = li.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    li = li.replace(/`([^`]+)`/g, '<code>$1</code>');
    html += `<li>${li}</li>\n`;
  } else if (line.trim() === '---') {
    html += `<hr>\n`;
  } else if (line.trim() !== '') {
    let p = line;
    p = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    p = p.replace(/`([^`]+)`/g, '<code>$1</code>');
    html += `<p>${p}</p>\n`;
  }
}

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Pay-Together — 100 FYP Viva Voce Questions & Answers</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
    @bottom-center {
      content: "Page " counter(page);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 8pt;
      color: #94a3b8;
    }
  }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    line-height: 1.55;
    color: #1e293b;
    max-width: 920px;
    margin: 0 auto;
    padding: 30px 20px;
    background: #ffffff;
  }
  h1 { color: #1e3a8a; font-size: 22pt; font-weight: 800; border-bottom: 3px solid #2563eb; padding-bottom: 8px; margin-top: 0; }
  h2 { color: #1d4ed8; font-size: 15pt; font-weight: 700; margin-top: 28px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px; }
  h3 { color: #0f172a; font-size: 12pt; font-weight: 700; margin-top: 20px; page-break-after: avoid; }
  .question-box {
    margin-top: 14px;
    margin-bottom: 14px;
    page-break-inside: avoid;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }
  h4 {
    color: #1e3a8a;
    font-size: 10pt;
    font-weight: 700;
    margin: 0;
    background: #eff6ff;
    padding: 10px 14px;
    border-bottom: 1px solid #dbeafe;
  }
  .answer {
    padding: 12px 14px;
    margin: 0;
    font-size: 9.5pt;
    color: #334155;
    background: #ffffff;
  }
  code { font-family: 'JetBrains Mono', Consolas, monospace; background: #f1f5f9; padding: 2px 5px; border-radius: 4px; color: #be185d; font-size: 8.5pt; }
  hr { border: none; border-top: 1px solid #cbd5e1; margin: 24px 0; }
  li { font-size: 9.5pt; margin-bottom: 4px; }
  ul { padding-left: 20px; margin-top: 6px; margin-bottom: 12px; }
</style>
</head>
<body>
${html}
</body>
</html>`;

fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log('HTML written successfully to:', htmlPath);

// Generate PDF
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = fs.existsSync(chromePath) ? chromePath : edgePath;

const args = [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfPath}`,
  htmlPath
];

const res = spawnSync(browser, args, { encoding: 'utf-8' });
if (fs.existsSync(pdfPath)) {
  const sizeKb = (fs.statSync(pdfPath).size / 1024).toFixed(1);
  console.log(`SUCCESS! Generated Viva PDF: ${pdfPath} (${sizeKb} KB)`);
} else {
  console.log('PDF generation failed:', res.stderr || res.stdout);
}
