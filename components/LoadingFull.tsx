import type { PropsWithChildren } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import { Box } from '~/theme'

export const LoadingFull = ({ children }: PropsWithChildren) => {
  return (
    <LoadingContainer>
      {children}
      <ActivityIndicator size="large" color="black" />
    </LoadingContainer>
  )
}

export const LoadingContainer = ({ children }: PropsWithChildren) => {
  return <Box style={styles.loading}>{children}</Box>
}

const styles = StyleSheet.create({
  loading: {
    height: '100%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    rowGap: 24,
  },
})
