import { QueryClient } from '@tanstack/react-query'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAppContext } from './app-provider'
import { HOST_URI } from './constants'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
})

export const client = axios.create({
  baseURL: HOST_URI,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const request = async <T>(options: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse<T>) => response
  return client<T>(options)
    .then(onSuccess)
    .catch((error) => {
      throw error
    })
}

export const useAuthenticatedRequest = <T>() => {
  const { session } = useAppContext()

  return async <T>(options: AxiosRequestConfig) => {
    const onSuccess = (response: AxiosResponse<T>) => response

    return client<T>({
      ...options,
      headers: {
        // ...options.headers,
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then(onSuccess)
      .catch((error) => {
        throw error
      })
  }
}

export default queryClient
