import { useMutation, useQuery, type MutationOptions } from '@tanstack/react-query'
import { useState } from 'react'

import { captureException } from '@sentry/react-native'
import type { AxiosError } from 'axios'
import { useAppContext } from '~/utils/app-provider'
import type { Chat } from '~/utils/services/chat/types'
import type { components } from '../../api-types'
import { log } from '../../logger'
import queryClient, { request } from '../../query-client'
import { useAuthenticatedRequest } from '../../use-authenticated-request'

export type SendChatMessageOutput = components['schemas']['SendChatMessageOutput']
export type MessageOutput = components['schemas']['MessageOutput']
export type ChatOutput = components['schemas']['ChatOutput']

export const useChatMessages = ({ chatId }: { chatId: string }) => {
  const authRequest = useAuthenticatedRequest()

  return useQuery<MessageOutput[], AxiosError>({
    queryKey: ['chatMessages', chatId],
    queryFn: async () => {
      const { data } = await authRequest<MessageOutput[]>({
        url: `/chat/${chatId}`,
        method: 'GET',
      })

      return data
    },
    enabled: Boolean(chatId),
  })
}

export const useSendMessage = ({
  chatId,
}: {
  chatId: string
}) => {
  const authRequest = useAuthenticatedRequest()
  const [message, setMessage] = useState('')
  const [sendChatError, setSendChatError] = useState(false)
  const { mutateAsync: sendChatMessage, isPending: isChatSending } = useMutation({
    mutationKey: ['sendChatMessage', chatId],
    mutationFn: async () => {
      const { data } = await authRequest<SendChatMessageOutput>({
        url: `/chat/${chatId}/messages`,
        method: 'POST',
        data: { message },
      })

      return data
    },
    onSuccess: (response) => {
      setMessage('')
      setSendChatError(false)

      // If any tasks were created, invalidate the focus items query so the Focus view
      // will have the latest data when the user navigates back to it.
      if (response.function_calls.indexOf('create_tasks') > -1) {
        queryClient.invalidateQueries({ queryKey: ['focusItems'] })
      }

      queryClient.setQueryData(['chatMessages', chatId], (old: MessageOutput[]) => [
        ...old,
        ...response.messages,
      ])
    },
    onError: (error) => {
      log('Error sending chat message:', error)
      captureException(error)
    },
  })

  return {
    message,
    isChatSending,
    sendChatMessage,
    setMessage,

    // Error handling
    sendChatError,
    setSendChatError,
  }
}

export const useStartChat = ({
  userMessage,
  sherpaMessage,
  ...props
}: { userMessage: string; sherpaMessage: string } & MutationOptions<ChatOutput>) => {
  const { session } = useAppContext()
  return useMutation<ChatOutput>({
    mutationKey: ['startChat'],
    mutationFn: async () => {
      const response = await request<ChatOutput>({
        method: 'POST',
        url: '/chat/start',
        data: { user_message: userMessage, sherpa_message: sherpaMessage },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      })

      return response.data
    },
    ...props,
  })
}

export const useEndChat = ({ chatId, ...props }: { chatId: string } & MutationOptions<Chat>) => {
  const { session } = useAppContext()
  return useMutation<Chat>({
    mutationKey: ['endChat', chatId],
    mutationFn: async () => {
      const response = await request<Chat>({
        method: 'POST',
        url: '/chat/end',
        data: JSON.stringify({ chat_id: chatId }),
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      })

      return response.data
    },
    ...props,
  })
}

export const useActiveChat = () => {
  const { session } = useAppContext()
  return useQuery<Chat>({
    queryKey: ['activeChat'],
    queryFn: async () => {
      const { data } = await request<Chat>({
        method: 'GET',
        url: '/chat/active',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      })

      return data
    },
  })
}
