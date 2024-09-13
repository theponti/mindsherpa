import { captureException } from '@sentry/react-native'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { components } from '~/utils/api-types'
import { useAuthenticatedRequest } from '~/utils/use-authenticated-request'

export type GeneratedIntentsResponse = components['schemas']['GeneratedIntentsResponse']
export type CreateIntents = GeneratedIntentsResponse['create']
export type SearchIntents = GeneratedIntentsResponse['search']

export const useGetUserIntent = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: GeneratedIntentsResponse) => void
  onError?: (error: AxiosError) => void
}) => {
  const authRequest = useAuthenticatedRequest()

  const mutation = useMutation<GeneratedIntentsResponse, AxiosError, string>({
    mutationFn: async (content: string) => {
      const { data } = await authRequest<GeneratedIntentsResponse>({
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
