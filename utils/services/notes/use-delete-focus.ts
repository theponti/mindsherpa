import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useAuthenticatedRequest } from '~/utils/use-authenticated-request'
import type { FocusResponse } from './types'

export const useDeleteFocus = (
  props: UseMutationOptions<number, AxiosError, number> & {
    onError?: (error: AxiosError) => void
  }
) => {
  const authRequest = useAuthenticatedRequest()

  return useMutation<number, AxiosError, number>({
    mutationFn: async (id: number) => {
      await authRequest<FocusResponse>({
        method: 'DELETE',
        url: `/notes/focus/${id}`,
      })
      return id
    },
    ...props,
  })
}
