// lib/api/client.ts
import ky from 'ky';

export const api = ky.create({
  prefixUrl: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  retry: 1,
});
