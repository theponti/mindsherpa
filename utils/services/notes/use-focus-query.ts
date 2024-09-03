import { captureException } from '@sentry/react-native'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { useAuthenticatedRequest } from '~/utils/query-client'
import type { FocusResponse } from './types'

export const useFocusQuery = ({
  onError,
  onSuccess,
  params,
}: {
  onError?: (error: AxiosError) => void
  onSuccess?: (data: FocusResponse) => void
  params?: Record<string, string | string[] | number>
}) => {
  const authRequest = useAuthenticatedRequest()
  return useQuery<FocusResponse | null>({
    queryKey: ['focus'],
    queryFn: async () => {
      try {
        const { data } = await authRequest<FocusResponse>({
          method: 'GET',
          url: '/notes/focus',
          ...(params ? { params } : {}),
        })
        onSuccess?.(data)
        return data
      } catch (error) {
        captureException(error)
        onError?.(error as AxiosError)
        return null
      }
    },
  })
}
