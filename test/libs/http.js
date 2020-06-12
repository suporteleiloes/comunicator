const axios = require('axios')
const https = require('https');

const http = axios.create({
  baseURL: 'https://127.0.0.1:8000/app_test.php',
  timeout: 30000,
  // headers: {'X-Custom-Header': 'foobar'}
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

if (typeof module !== 'undefined') {
  module.exports = http;
}
