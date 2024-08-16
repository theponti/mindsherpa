import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import * as FileSystem from 'expo-file-system'

import { useAppContext } from '~/utils/app-provider'
import { request } from '~/utils/query-client'

export type CreateVoiceNoteResponse = {
  id: string
  content: string
  created_at: string
  focus_items: FocusItem[]
}

type FocusItem = {
  id: number
  text: string
  type: string
  task_size: string
  category: string
  priority: number
  sentiment: string
  due_date: string
}

export const useAudioUpload = ({
  onSuccess,
  onError,
}: { onSuccess?: (data: any) => void; onError?: () => void }) => {
  const { session } = useAppContext()
  const token = session?.access_token

  const mutation = useMutation({
    mutationFn: async (fileUri: string) => {
      const audioFile = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      try {
        const { data } = await request({
          url: `/notes/voice`,
          method: 'POST',
          data: {
            filename: 'audio.m4a',
            audio_data: audioFile,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        return data
      } catch (error) {
        throw error
      }
    },
    onSuccess,
    onError,
  })

  return mutation
}

export const useCreateTextNote = ({
  onSuccess,
  onError,
}: { onSuccess?: (data: any) => void; onError?: (error: AxiosError) => void }) => {
  const { session } = useAppContext()
  const token = session?.access_token

  const mutation = useMutation<CreateVoiceNoteResponse, AxiosError, string>({
    mutationFn: async (content: string) => {
      try {
        const { data } = await request({
          url: `/notes/text`,
          method: 'POST',
          data: { content },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        return data
      } catch (error) {
        throw error
      }
    },
    onSuccess,
    onError,
  })

  return mutation
}
