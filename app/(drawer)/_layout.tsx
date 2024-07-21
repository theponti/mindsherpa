import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
        name="index"
        options={{
          // Enable this if you want the same title to be show across all views.
          // headerTitle: 'Mindsherpa',
          drawerPosition: 'right',
          drawerLabel: 'Home',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: 'Tabs',
          drawerLabel: 'Tabs',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
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
