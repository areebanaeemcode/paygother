const http = require('http');

http.get('http://localhost:3333/download-fcit-pdf', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
  let size = 0;
  res.on('data', chunk => size += chunk.length);
  res.on('end', () => console.log('Downloaded bytes:', size));
}).on('error', err => console.error(err));
