import { captureException } from '@sentry/react-native';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useAppContext } from '~/utils/app-provider';
import { request } from '~/utils/query-client';
import type { FocusOutputItem } from '~/utils/schema/graphcache';

export const useFocusItemsCreate = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: FocusOutputItem[]) => void;
  onError?: (error: AxiosError) => void;
}) => {
  const { session } = useAppContext();
  const token = session?.access_token;

  const mutation = useMutation<FocusOutputItem[], AxiosError, FocusOutputItem[]>({
    mutationFn: async (items) => {
      try {
        const response = await request<FocusOutputItem[]>({
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
