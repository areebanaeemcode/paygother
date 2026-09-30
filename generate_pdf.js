const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = fs.existsSync(chromePath) ? chromePath : edgePath;

const inputHtml = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.html');
const outputPdf = path.resolve(__dirname, 'Pay_Together_FYP_Documentation.pdf');

console.log('Browser:', browser);
console.log('Input:', inputHtml);
console.log('Output:', outputPdf);

const args = [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${outputPdf}`,
  inputHtml
];

const res = spawnSync(browser, args, { encoding: 'utf-8' });
console.log('Exit code:', res.status);
if (res.stdout) console.log('STDOUT:', res.stdout);
if (res.stderr) console.log('STDERR:', res.stderr);

if (fs.existsSync(outputPdf)) {
  const sizeKb = (fs.statSync(outputPdf).size / 1024).toFixed(1);
  console.log(`SUCCESS! Generated PDF: ${outputPdf} (${sizeKb} KB)`);
} else {
  console.log('FAILED: PDF was not generated.');
}
