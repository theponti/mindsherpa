import { Link } from 'expo-router';
import { UserCircle } from 'lucide-react-native';
import React, { PropsWithChildren } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Colors } from '~/utils/styles';

export const ViewHeader = ({ children }: PropsWithChildren) => {
  return (
    <View>
      <View style={styles.navbar}>
        <View style={{ width: 32 }} />
        <Image source={require('../assets/header-logo.png')} height={20} width={35} />
        <Link href="/(drawer)/(account)">
          <UserCircle size={32} color={Colors.gray} />
        </Link>
      </View>
      {children ? (
        <View style={styles.container}>
          <View style={styles.header}>{children}</View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    opacity: 0.8,
  },
  gradient: {
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 24,
  },
});
