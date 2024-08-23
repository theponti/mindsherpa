import { QueryClient } from '@tanstack/react-query';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
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

export const request = async <T>(options: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse<T>) => response;
  return client<T>(options)
    .then(onSuccess)
    .catch((error) => {
      throw error;
    });
};

export default queryClient;
