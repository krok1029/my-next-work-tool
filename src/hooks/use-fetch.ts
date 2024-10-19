import useSWR, { SWRConfiguration } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
