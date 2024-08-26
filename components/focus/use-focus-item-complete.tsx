import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { request } from '~/utils/query-client';
import type { FocusOutputItem } from '~/utils/schema/graphcache';

type UseFocusItemComplete = {
  id: number;
  token: string;
  onSuccess?: (data: FocusOutputItem) => void;
  onError?: (error: AxiosError) => void;
};
export const useFocusItemComplete = ({ id, token }: UseFocusItemComplete) => {
  return useMutation({
    mutationKey: ['completeItem'],
    mutationFn: async () => {
      const { data } = await request<FocusOutputItem>({
        method: 'PUT',
        url: `/tasks/complete/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
  });
};
