import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { LinearProgress } from '@rneui/themed';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet } from 'react-native';

import { HeaderButton } from '../../components/HeaderButton';

import { Box, Text } from '~/theme';
import { useAuth } from '~/utils/auth/auth-context';

const DrawerLayout = () => {
  const { session } = useAuth();

  if (!session) {
    return (
      <Box style={styles.loading}>
        <Text variant="title">Loading your account...</Text>
        <LinearProgress color="blue" />
      </Box>
    );
  }

  return (
    <Drawer>
      <Drawer.Screen
        name="(sherpa)"
        options={{
          // Enable this if you want the same title to be show across all views.
          // headerTitle: 'Mindsherpa',
          drawerPosition: 'left',
          drawerLabel: 'Sherpa',
          drawerIcon: ({ size, color }) => (
            <FontAwesome6 name="hat-wizard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(notebook)"
        options={{
          headerTitle: 'Notebook',
          drawerLabel: 'Notebook',
          drawerIcon: ({ size, color }) => <MaterialIcons name="book" size={size} color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="(account)"
        options={{
          headerTitle: 'Account',
          drawerLabel: 'Account',
          drawerPosition: 'left',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/account" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
    </Drawer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
});

export default DrawerLayout;
