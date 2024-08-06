import { PropsWithChildren } from 'react';
import { Box, Text } from 'theme';

type ScreenContentProps = PropsWithChildren<{
  title: string;
  path: string;
}>;

export const ScreenContent = ({ title, children }: ScreenContentProps) => {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Text variant="title">{title}</Text>
      <Box height={1} marginVertical="l_32" width="80%" backgroundColor="gray" />
      {children}
    </Box>
  );
};
