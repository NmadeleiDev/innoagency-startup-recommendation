import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios(url).then((res) => res.data);

export const useAccelerators = () => {
  const { data, error } = useSWR(`/api/getAccelerators`, fetcher);

  return {
    accelerators: data,
    isLoading: !error && !data,
    isError: error,
  };
};
