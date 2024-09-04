import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { useAuthenticatedRequest } from '~/utils/query-client'
import type { FocusItem } from '~/utils/services/notes/types'

type UseFocusItemComplete = {
  onSuccess?: (data: FocusItem) => void
  onError?: (error: AxiosError) => void
}
export const useFocusItemComplete = ({ onSuccess, onError }: UseFocusItemComplete) => {
  const authRequest = useAuthenticatedRequest()
  return useMutation({
    mutationKey: ['completeItem'],
    mutationFn: async (id: number) => {
      const { data } = await authRequest<FocusItem>({
        method: 'PUT',
        url: `/tasks/complete/${id}`,
      })
      return data
    },
    onSuccess,
    onError,
  })
}