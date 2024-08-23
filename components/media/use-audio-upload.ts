import { captureException } from '@sentry/react-native';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import * as FileSystem from 'expo-file-system';

import { useAppContext } from '~/utils/app-provider';
import { request } from '~/utils/query-client';

export type CreateNoteOutput = {
  id: string;
  content: string;
  created_at: string;
  focus_items: FocusItem[];
};

export type FocusItem = {
  id: number;
  text: string;
  type: string;
  task_size: string;
  category: string;
  priority: number;
  sentiment: string;
  due_date: string;
};

export const useAudioUpload = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: CreateNoteOutput) => void;
  onError?: () => void;
}) => {
  const { session } = useAppContext();
  const token = session?.access_token;

  const mutation = useMutation<CreateNoteOutput, AxiosError, string>({
    mutationFn: async (fileUri: string) => {
      const audioFile = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { data } = await request<CreateNoteOutput>({
        url: '/notes/voice',
        method: 'POST',
        data: {
          filename: 'audio.m4a',
          audio_data: audioFile,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
    onSuccess,
    onError: (error) => {
      captureException(error);
      onError?.();
    },
  });

  return mutation;
};

export const useFocusItemsTextGenerate = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: CreateNoteOutput) => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { session } = useAppContext();
  const token = session?.access_token;

  const mutation = useMutation<CreateNoteOutput, AxiosError, string>({
    mutationFn: async (content: string) => {
      const { data } = await request<CreateNoteOutput>({
        url: '/notes/text',
        method: 'POST',
        data: { content },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
    onSuccess,
    onError: (error) => {
      captureException(error);
      onError?.(error);
    },
  });

  return mutation;
};

export const useFocusItemsCreate = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: FocusItem[]) => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { session } = useAppContext();
  const token = session?.access_token;

  const mutation = useMutation<FocusItem[], AxiosError, CreateNoteOutput['focus_items']>({
    mutationFn: async (items) => {
      try {
        const response = await request<FocusItem[]>({
          url: '/notes/focus',
          method: 'POST',
          data: { items },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        return response.data;
      } catch (error) {
        captureException(error);
        throw error;
      }
    },
    onSuccess,
    onError,
  });

  return mutation;
};
