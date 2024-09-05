import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAppContext } from './app-provider'
import { HOST_URI } from './constants'

export const authenticatedClient = axios.create({
  baseURL: HOST_URI,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const useAuthenticatedRequest = () => {
  const { session } = useAppContext()

  return async <T>(options: AxiosRequestConfig) => {
    const onSuccess = (response: AxiosResponse<T>) => response

    return authenticatedClient<T>({
      ...options,
      headers: {
        ...(options.headers ?? {}),
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then(onSuccess)
      .catch((error) => {
        throw error
      })
  }
}
