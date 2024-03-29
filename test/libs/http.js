import axios from 'axios'
import https from 'https'

const http = axios.create({
  // baseURL: 'https://127.0.0.1:8000/app_test.php',
  baseURL: 'https://127.0.0.1:8000',
  timeout: 30000,
  // headers: {'X-Custom-Header': 'foobar'}
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

export default http
