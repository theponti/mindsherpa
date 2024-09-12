import { captureException } from '@sentry/react-native'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { components } from '~/utils/api-types'
import { useAuthenticatedRequest } from '~/utils/use-authenticated-request'

export type GetIntents = components['schemas']['GeneratedIntentsResponse']
export type CreateIntents = GetIntents['create']
export type SearchIntents = GetIntents['search']

export const useGetUserIntent = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: GetIntents) => void
  onError?: (error: AxiosError) => void
}) => {
  const authRequest = useAuthenticatedRequest()

  const mutation = useMutation<GetIntents, AxiosError, string>({
    mutationFn: async (content: string) => {
      const { data } = await authRequest<GetIntents>({
        url: '/notes/text',
        method: 'POST',
        data: { content },
      })

      return data
    },
    onSuccess,
    onError: (error) => {
      captureException(error)
      onError?.(error)
    },
  })

  return mutation
}
