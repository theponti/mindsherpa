import { captureException } from '@sentry/react-native'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useAuthenticatedRequest } from '~/utils/query-client'
import type { FocusItems } from '~/utils/services/notes/types'

export const useFocusItemsCreate = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: FocusItems) => void
  onError?: (error: AxiosError) => void
}) => {
  const authRequest = useAuthenticatedRequest()

  const mutation = useMutation<FocusItems, AxiosError, FocusItems>({
    mutationFn: async (items) => {
      try {
        const response = await authRequest<FocusItems>({
          url: '/notes/focus',
          method: 'POST',
          data: { items },
        })

        return response.data
      } catch (error) {
        captureException(error)
        throw error
      }
    },
    onSuccess,
    onError,
  })

  return mutation
}
