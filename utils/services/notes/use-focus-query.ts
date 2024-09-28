import { captureException } from '@sentry/react-native'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { useAuthenticatedRequest } from '~/utils/use-authenticated-request'
import type { FocusItems, FocusResponse } from './types'

export const useFocusQuery = ({
  onError,
  onSuccess,
  params,
}: {
  onError?: (error: AxiosError) => void
  onSuccess?: (data: FocusResponse) => void
  params?: Record<string, string | string[] | number>
}) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const authRequest = useAuthenticatedRequest()

  return useQuery<FocusItems | null>({
    queryKey: ['focusItems'],
    queryFn: async () => {
      try {
        const { data } = await authRequest<FocusResponse>({
          method: 'GET',
          url: '/focus',
          params: {
            timezone,
          },
          ...(params ? { params } : {}),
        })
        onSuccess?.(data)
        return data.items
      } catch (error) {
        captureException(error)
        onError?.(error as AxiosError)
        return null
      }
    },
  })
}
