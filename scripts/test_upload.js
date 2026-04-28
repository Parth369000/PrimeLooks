const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a minimal test image (1x1 red pixel PNG)
const pngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  'base64'
);

const boundary = '----FormBoundary' + Math.random().toString(36).substring(7);
const CRLF = '\r\n';

// Build multipart form data manually
let body = '';
body += `--${boundary}${CRLF}`;
body += `Content-Disposition: form-data; name="files"; filename="test.png"${CRLF}`;
body += `Content-Type: image/png${CRLF}${CRLF}`;

const bodyStart = Buffer.from(body, 'utf8');
const bodyEnd = Buffer.from(`${CRLF}--${boundary}--${CRLF}`, 'utf8');
const fullBody = Buffer.concat([bodyStart, pngBuffer, bodyEnd]);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/upload',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': fullBody.length,
  },
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(fullBody);
req.end();
