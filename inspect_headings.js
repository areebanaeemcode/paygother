const fs = require('fs');
const md = fs.readFileSync('Pay_Together_FCIT_FYDP_Complete_Documentation.md', 'utf8');

const regex = /```(\w+)?([\s\S]*?)```/g;
let match;
let i = 0;
while ((match = regex.exec(md)) !== null) {
  i++;
  const prevText = md.substring(Math.max(0, match.index - 200), match.index).trim();
  const heading = prevText.split('\n').filter(l => l.startsWith('#')).pop() || 'No heading';
  console.log(`Block ${i} [${match[1]}]: near "${heading}"`);
}
