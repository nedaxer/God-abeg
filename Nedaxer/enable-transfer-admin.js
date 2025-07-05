// Direct admin action to enable transfer access
const http = require('http');

const postData = JSON.stringify({
  userId: '6863fa4c866058dcc7f026f1',
  transferAccess: true
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/users/toggle-transfer-access',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Cookie': 'connect.sid=s%3ALSR3dxqw9Uoa8x8-ockw_GyNs4T9NGO5.2zCBCz%2BlX2Q4ZSkzojnT6%2ByQGFO1fzQQ1r0HZ2yVJug'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();