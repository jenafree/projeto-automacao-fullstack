import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};

const API_BASE_URL = __ENV.API_BASE_URL || 'http://localhost:8000';

export default function () {
  const res = http.get(`${API_BASE_URL}/health`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has ok field': (r) => r.json('status') === 'ok',
  });
  sleep(1);
}



