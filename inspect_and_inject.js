const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const diagrams = require('./diagrams_svg.js');

const mdPath = path.resolve(__dirname, 'Pay_Together_FCIT_FYDP_Complete_Documentation.md');
const md = fs.readFileSync(mdPath, 'utf8');

const blocks = [...md.matchAll(/```(\w+)?([\s\S]*?)```/g)];
console.log('Total code blocks found in markdown:', blocks.length);
blocks.forEach((b, i) => {
  const lang = b[1] || 'none';
  const preview = b[2].trim().slice(0, 50).replace(/\r?\n/g, ' ');
  console.log(`${i + 1}. [${lang}] ${preview}`);
});
