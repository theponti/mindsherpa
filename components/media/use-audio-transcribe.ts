import { captureException } from '@sentry/react-native';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import * as FileSystem from 'expo-file-system';

import { useAppContext } from '~/utils/app-provider';
import { request } from '~/utils/query-client';

export const useAudioTranscribe = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: string) => void;
  onError?: () => void;
}) => {
  const { session } = useAppContext();
  const token = session?.access_token;

  const mutation = useMutation<string, AxiosError, string>({
    mutationFn: async (fileUri: string) => {
      const audioFile = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { data } = await request<string>({
        url: '/ai/speech-to-text',
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
