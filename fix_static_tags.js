const fs = require('fs');
const path = require('path');

const templatesDir = path.resolve(__dirname, 'FYP', 'templates');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = walk(templatesDir);
console.log(`Scanning ${htmlFiles.length} template files...`);

let totalFixed = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Pattern: ({% static '[^']+' %})\?v=[^"'\s>]+
  content = content.replace(/({%\s*static\s+['"][^'"]+['"]\s*%})\?v=[a-zA-Z0-9_\-]+/g, '$1');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    const rel = path.relative(templatesDir, filePath);
    console.log(`[FIXED] ${rel}`);
    totalFixed++;
  }
});

console.log(`Done! Fixed ${totalFixed} files.`);
