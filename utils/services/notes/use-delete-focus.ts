import { captureException } from '@sentry/react-native'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useAuthenticatedRequest } from '~/utils/query-client'
import type { FocusResponse } from './types'

export const useDeleteFocus = ({
  onError,
  onSuccess,
}: {
  onError?: (error: AxiosError) => void
  onSuccess?: (id: number) => void
}) => {
  const authRequest = useAuthenticatedRequest()

  return useMutation<number, AxiosError, number>({
    mutationFn: async (id: number) => {
      await authRequest<FocusResponse>({
        method: 'DELETE',
        url: `/notes/focus/${id}`,
      })
      return id
    },
    onSuccess: (id) => {
      onSuccess?.(id)
    },
    onError: (error) => {
      captureException(error)
      onError?.(error as AxiosError)
    },
  })
}
