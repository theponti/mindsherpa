import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthenticatedRequest } from '~/utils/use-authenticated-request'

export interface UpdateFocusItemInput {
  id: number
  text: string
  due_date?: Date
  category: string
  timezone: string
}

export interface UpdateFocusItemResponse {
  id: number
  text: string
  due_date: string | null
  category: string | null
}

export const useUpdateFocusItem = (): UseMutationResult<
  UpdateFocusItemResponse,
  Error,
  UpdateFocusItemInput
> => {
  const authRequest = useAuthenticatedRequest()

  return useMutation<UpdateFocusItemResponse, Error, UpdateFocusItemInput>({
    mutationKey: ['updateFocusItem'],
    mutationFn: async (input: UpdateFocusItemInput) => {
      const response = await authRequest<UpdateFocusItemResponse>({
        method: 'PUT',
        url: `/focus/${input.id}`,
        data: input,
      })
      return response.data
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error(
          error.response?.data?.detail || 'An error occurred while updating the focus item.'
        )
      } else {
        console.error('An unexpected error occurred.')
      }
    },
  })
}
