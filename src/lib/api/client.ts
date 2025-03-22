// lib/api/client.ts
import ky from 'ky';

export const api = ky.create({
  prefixUrl: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  retry: 1,
});
