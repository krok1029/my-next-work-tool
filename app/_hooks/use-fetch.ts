import { api } from '@/lib/api/client';
import useSWR, { SWRConfiguration } from 'swr';

const fetcher = async <T>(url: string): Promise<T> => {
  try {
    return await api(url).json<T>();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
};
const useFetch = <T>(path: string, options?: SWRConfiguration) => {
  const defaultOptions: SWRConfiguration = {
    refreshInterval: 0,
    revalidateOnFocus: true,
    ...options,
  };

  const { data, error, isLoading, mutate } = useSWR<T>(
    path,
    fetcher,
    defaultOptions
  );

  return { data, error, isLoading, mutate };
};

export default useFetch;
