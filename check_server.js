const http = require('http');

http.get('http://localhost:3333/', (res) => {
  console.log('Download server status code:', res.statusCode);
  res.resume();
}).on('error', (err) => {
  console.log('Download server error:', err.message);
});
