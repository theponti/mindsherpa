import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { FocusItemInput, FocusItems } from '~/utils/services/notes/types'
import { useAuthenticatedRequest } from '~/utils/use-authenticated-request'

export const useFocusItemsCreate = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: FocusItems) => void
  onError?: (error: AxiosError) => void
}) => {
  const authRequest = useAuthenticatedRequest()

  const mutation = useMutation<FocusItems, AxiosError, FocusItemInput[]>({
    mutationFn: async (items) => {
      const response = await authRequest<FocusItems>({
        url: '/notes/focus',
        method: 'POST',
        data: { items },
      })

      return response.data
    },
    onSuccess,
    onError,
  })

  return mutation
}
