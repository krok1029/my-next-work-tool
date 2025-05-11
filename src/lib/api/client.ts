// lib/api/client.ts
import ky from 'ky';
import { useLoadingStore } from '@/lib/zustandStore';

export const api = ky.create({
  prefixUrl: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      () => {
        useLoadingStore.getState().incrementLoading();
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        useLoadingStore.getState().decrementLoading();
        return response;
      },
    ],
    beforeError: [
      (error) => {
        useLoadingStore.getState().decrementLoading();
        return error;
      },
    ],
  },
  timeout: 10000,
  retry: 1,
});
