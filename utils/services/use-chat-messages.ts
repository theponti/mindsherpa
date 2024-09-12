import { useMutation, useQuery, type MutationOptions } from '@tanstack/react-query'
import { useState } from 'react'

import { captureException } from '@sentry/react-native'
import { AxiosError } from 'axios'
import { useAppContext } from '~/utils/app-provider/AppProvider'
import type { Chat } from '~/utils/services/chat/types'
import { components } from '../api-types'
import { log } from '../logger'
import queryClient, { request } from '../query-client'
import { useAuthenticatedRequest } from '../use-authenticated-request'

export type MessageOutput = components['schemas']['MessageOutput']

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
      const { data } = await authRequest<MessageOutput>({
        url: `/chat/${chatId}/messages`,
        method: 'POST',
        data: { message },
      })

      return data
    },
    onSuccess: (response) => {
      setMessage('')
      setSendChatError(false)
      queryClient.invalidateQueries({ queryKey: ['chatMessages', chatId] })
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
