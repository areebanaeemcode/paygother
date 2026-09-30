const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const htmlPath = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// Fix the accidental regex replacement artifact
html = html.replace(/\+&4,500/g, '+$24,500');
html = html.replace(/&minus;&4,500/g, '&minus;$14,500');
html = html.replace(/&minus;&0,000/g, '&minus;$10,000');
html = html.replace(/pays &4,500/g, 'pays $14,500');
html = html.replace(/pays &0,000/g, 'pays $10,000');
html = html.replace(/&50,000/g, '$150,000');

// Also remove duplicate paragraph at end of Appendix C
const dupPara = '<p>The codebase adheres to PEP 8 standards, wraps multi-table writes in atomic transactions, uses fixed-point Decimal types for all currency fields, and structures client-side JavaScript into modular controllers. The platform includes 14 responsive screens covering landing, authentication, dashboard, tour workspace, expense modal, receipt previewer, limits, notifications, analytics, and settlement reconciliation.</p>';
const firstIdx = html.indexOf(dupPara);
if (firstIdx !== -1) {
  const secondIdx = html.indexOf(dupPara, firstIdx + dupPara.length);
  if (secondIdx !== -1) {
    html = html.slice(0, secondIdx) + html.slice(secondIdx + dupPara.length);
    console.log('Removed duplicate paragraph in Appendix C');
  }
}

fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('Fixed artifacts in Pay_Together_FYP_Documentation.html');

// Recompile PDF
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputPdf = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.pdf');
const downloadsPdf = 'C:\\Users\\muham\\Downloads\\Pay_Together_FYP_Documentation.pdf';

const res = spawnSync(chromePath, [
  '--headless',
  '--disable-gpu',
  '--run-all-compositor-stages-before-draw',
  '--no-pdf-header-footer',
  `--print-to-pdf=${outputPdf}`,
  htmlPath
], { encoding: 'utf-8' });

if (fs.existsSync(outputPdf)) {
  fs.copyFileSync(outputPdf, downloadsPdf);
  console.log('Successfully recompiled PDF and copied to Downloads folder!');
}
