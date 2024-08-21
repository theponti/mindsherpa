import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HOST_URI } from './constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

const client = axios.create({
  baseURL: HOST_URI,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const request = async (options: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse) => response;
  return client(options).then(onSuccess);
};

export default queryClient;
