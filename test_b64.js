const fs = require('fs');
const txt = fs.readFileSync('Pay_Together_FYP_Documentation.html', 'utf8');
const idx = txt.indexOf('var PDF_B64="');
if (idx === -1) {
  console.log('Not found');
} else {
  const endIdx = txt.indexOf('";', idx);
  console.log('Found PDF_B64, length:', endIdx - idx - 13);
  const b64 = txt.substring(idx + 13, endIdx);
  const buf = Buffer.from(b64, 'base64');
  console.log('Decoded buffer size:', buf.length, 'bytes');
  console.log('PDF header:', buf.subarray(0, 10).toString('utf8'));
}
