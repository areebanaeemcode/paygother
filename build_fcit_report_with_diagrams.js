const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const diagrams = require('./diagrams_svg.js');

const MD_PATH = path.resolve(__dirname, 'Pay_Together_FCIT_FYDP_Complete_Documentation.md');
const HTML_PATH = path.resolve(__dirname, 'Pay_Together_FCIT_FYDP_Final_Report.html');
const PDF_PATH = path.resolve(__dirname, 'Pay_Together_FCIT_FYDP_Final_Report.pdf');
const DOWNLOADS_PDF = 'C:\\Users\\muham\\Downloads\\Pay_Together_FCIT_FYDP_Final_Report.pdf';

console.log("Reading Markdown documentation...");
const md = fs.readFileSync(MD_PATH, 'utf-8');

function formatInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
}

const lines = md.split(/\r?\n/);
let htmlBody = [];
let inTable = false;
let tableRows = [];
let inCode = false;
let codeLines = [];
let codeLang = '';
let codeBlockIndex = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const stripped = line.trim();

  // Code block handling
  if (stripped.startsWith('```')) {
    if (inCode) {
      codeBlockIndex++;
      const codeContent = codeLines.join('\n');
      let replacedSvg = null;

      // Check which block this is and map to vector SVG diagram
      if (codeBlockIndex === 1 && codeContent.includes('Pay-Together Core Platform')) {
        replacedSvg = diagrams.SVG_WBS;
      } else if (codeBlockIndex === 2 && codeContent.includes('gantt')) {
        replacedSvg = diagrams.SVG_GANTT;
      } else if (codeBlockIndex === 3 && codeContent.includes('subgraph Actors')) {
        replacedSvg = diagrams.SVG_USECASE;
      } else if (codeBlockIndex === 4 && codeContent.includes('class User')) {
        replacedSvg = diagrams.SVG_CLASS;
      } else if (codeBlockIndex === 5 && codeContent.includes('sequenceDiagram')) {
        replacedSvg = diagrams.SVG_SEQ_EXPENSE;
      } else if (codeBlockIndex === 6 && codeContent.includes('stateDiagram-v2')) {
        replacedSvg = diagrams.SVG_STATEMACHINE;
      } else if (codeBlockIndex === 7 && codeContent.includes('Presentation Layer')) {
        replacedSvg = diagrams.SVG_ARCH;
      } else if (codeBlockIndex === 11 && codeContent.includes('Client Web Browser')) {
        replacedSvg = diagrams.SVG_DEPLOYMENT;
      }

      if (replacedSvg) {
        htmlBody.push(replacedSvg);
      } else {
        const escaped = codeLines.map(l => l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')).join('\n');
        htmlBody.push(`<pre class="code-box"><code>${escaped}</code></pre>`);
      }

      inCode = false;
      codeLines = [];
      codeLang = '';
    } else {
      inCode = true;
      codeLang = stripped.slice(3).trim();
      codeLines = [];
    }
    continue;
  }

  if (inCode) {
    codeLines.push(line);
    continue;
  }

  // Table handling
  if (stripped.startsWith('|') && stripped.endsWith('|')) {
    if (!inTable) {
      inTable = true;
      tableRows = [];
    }
    if (/^\|[\s\-:|]+\|$/.test(stripped)) {
      continue;
    }
    const cells = stripped.slice(1, -1).split('|').map(c => c.trim());
    tableRows.push(cells);
    continue;
  } else {
    if (inTable) {
      htmlBody.push("<div class='table-container'><table class='report-table'>");
      tableRows.forEach((r, idx) => {
        const tag = idx === 0 ? 'th' : 'td';
        htmlBody.push('<tr>' + r.map(c => `<${tag}>${formatInline(c)}</${tag}>`).join('') + '</tr>');
      });
      htmlBody.push("</table></div>");
      inTable = false;
      tableRows = [];
    }
  }

  if (!stripped) continue;

  // Headings & Blocks
  if (stripped.startsWith('# ')) {
    htmlBody.push(`<h1 class='title-main'>${formatInline(stripped.slice(2))}</h1>`);
  } else if (stripped.startsWith('## ')) {
    const txt = stripped.slice(3);
    if (/DECLARATION|CERTIFICATE OF APPROVAL|Executive Summary|Chapter|Appendix|References/i.test(txt)) {
      htmlBody.push(`<div class='page-break'></div><h2 class='section-h1'>${formatInline(txt)}</h2>`);
    } else {
      htmlBody.push(`<h2 class='section-h1'>${formatInline(txt)}</h2>`);
    }
  } else if (stripped.startsWith('### ')) {
    const headingText = stripped.slice(4);
    htmlBody.push(`<h3 class='section-h2'>${formatInline(headingText)}</h3>`);

    // Inject ERD right after 3.4 Data Design & Data Dictionary heading
    if (headingText.includes('3.4 Data Design')) {
      htmlBody.push(diagrams.SVG_ERD);
    }
  } else if (stripped.startsWith('#### ')) {
    htmlBody.push(`<h4 class='section-h3'>${formatInline(stripped.slice(5))}</h4>`);
  } else if (stripped.startsWith('- ') || stripped.startsWith('* ')) {
    htmlBody.push(`<li class='bullet-item'>${formatInline(stripped.slice(2))}</li>`);
  } else if (/^\d+\.\s/.test(stripped)) {
    const m = stripped.match(/^\d+\.\s*(.*)/);
    htmlBody.push(`<li class='number-item'>${formatInline(m[1])}</li>`);
  } else if (stripped.startsWith('---')) {
    htmlBody.push("<hr class='divider'/>");
  } else {
    htmlBody.push(`<p class='body-para'>${formatInline(stripped)}</p>`);

    // Inject prototypes after Appendix-C introductory paragraph
    if (stripped.includes('Appendix-C') || stripped.includes('Screen Walkthrough') || stripped.includes('prototype screens')) {
      htmlBody.push(diagrams.SVG_PROTOTYPE);
    }
  }
}

if (inTable) {
  htmlBody.push("<div class='table-container'><table class='report-table'>");
  tableRows.forEach((r, idx) => {
    const tag = idx === 0 ? 'th' : 'td';
    htmlBody.push('<tr>' + r.map(c => `<${tag}>${formatInline(c)}</${tag}>`).join('') + '</tr>');
  });
  htmlBody.push("</table></div>");
}

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Pay-Together — FCIT PU FYDP Final Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  @page {
    size: A4;
    margin: 18mm 14mm 18mm 16mm;
    @bottom-right {
      content: counter(page);
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
    font-family: 'Times New Roman', 'Merriweather', Georgia, serif;
    font-size: 11pt;
    line-height: 1.55;
    color: #0f172a;
    background-color: #ffffff;
    margin: 0;
    padding: 10px;
  }

  .page-break {
    page-break-before: always;
  }

  h1.title-main {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 24pt;
    font-weight: 800;
    color: #1e3a8a;
    text-align: center;
    margin-top: 36px;
    margin-bottom: 18px;
  }

  h2.section-h1 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 16pt;
    font-weight: 700;
    color: #0e4660;
    border-bottom: 2px solid #0e4660;
    padding-bottom: 5px;
    margin-top: 26px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }

  h3.section-h2 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13pt;
    font-weight: 600;
    color: #1e293b;
    margin-top: 18px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }

  h4.section-h3 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11pt;
    font-weight: 600;
    color: #334155;
    margin-top: 14px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }

  p.body-para {
    margin-top: 0;
    margin-bottom: 8px;
    text-align: justify;
    text-justify: inter-word;
  }

  li.bullet-item, li.number-item {
    margin-bottom: 4px;
    line-height: 1.48;
  }

  .figure-box {
    margin: 20px 0;
    text-align: center;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .figure-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    color: #475569;
    margin-top: 8px;
    font-size: 9pt;
  }

  .table-container {
    margin: 14px 0;
    page-break-inside: avoid;
  }

  table.report-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
    font-family: 'Plus Jakarta Sans', Arial, sans-serif;
  }

  table.report-table th {
    background-color: #0e4660;
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 7px 9px;
    border: 1px solid #0e4660;
  }

  table.report-table td {
    padding: 5px 8px;
    border: 1px solid #cbd5e1;
    color: #1e293b;
    vertical-align: top;
  }

  table.report-table tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  pre.code-box {
    background: #0f172a;
    color: #f8fafc;
    padding: 12px;
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    line-height: 1.45;
    overflow-x: auto;
    page-break-inside: avoid;
    margin: 12px 0;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9pt;
    background: #f1f5f9;
    color: #0f172a;
    padding: 2px 4px;
    border-radius: 3px;
  }

  hr.divider {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 18px 0;
  }
</style>
</head>
<body>
${htmlBody.join('\n')}
</body>
</html>
`;

console.log("Writing HTML with embedded vector diagrams to:", HTML_PATH);
fs.writeFileSync(HTML_PATH, fullHtml, 'utf-8');
console.log("HTML successfully written!");

// Check browser
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = fs.existsSync(chromePath) ? chromePath : edgePath;

console.log("Generating high-resolution PDF via headless browser:", browser);
const args = [
  '--headless',
  '--disable-gpu',
  '--run-all-compositor-stages-before-draw',
  '--no-pdf-header-footer',
  `--print-to-pdf=${PDF_PATH}`,
  HTML_PATH
];

const res = spawnSync(browser, args, { encoding: 'utf-8' });
if (fs.existsSync(PDF_PATH)) {
  const stat = fs.statSync(PDF_PATH);
  console.log(`SUCCESS! Generated PDF: ${PDF_PATH} (${(stat.size / 1024).toFixed(1)} KB)`);
  fs.copyFileSync(PDF_PATH, DOWNLOADS_PDF);
  console.log(`Copied updated PDF to Downloads root: ${DOWNLOADS_PDF}`);
} else {
  console.error("Failed to generate PDF:", res.stderr);
}
