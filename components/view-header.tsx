import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

export const ViewHeader = ({ children }: PropsWithChildren) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
        style={styles.gradient}>
        <View style={styles.header}>{children}</View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    maxHeight: 100,
  },
  gradient: {
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
});
