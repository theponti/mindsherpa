import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MessageSquare, GalleryVerticalEnd } from 'lucide-react-native';
import React from 'react';

import Focus from './(focus)';
import Notebook from './(notebook)';
import Chat from './(sherpa)';

import { LoadingFull } from '~/components/LoadingFull';
import { Text } from '~/theme';
import { useAuth } from '~/utils/auth/auth-context';
import { Colors } from '~/utils/styles';

const Tab = createBottomTabNavigator();

const App = () => {
  const { session } = useAuth();

  if (!session) {
    return (
      <LoadingFull>
        <Text variant="title">Loading your account...</Text>
      </LoadingFull>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Home color={color} size={size} />;
          } else if (route.name === 'Chat') {
            return <MessageSquare color={color} size={size} />;
          } else if (route.name === 'Work') {
            return <GalleryVerticalEnd color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.gray,
        tabBarIconStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={Focus}
        options={{ headerShown: false, tabBarLabel: () => null }}
      />
      <Tab.Screen
        name="Chat"
        options={{ headerShown: false, tabBarLabel: () => null }}
        component={Chat}
      />
      <Tab.Screen
        name="Work"
        options={{ headerShown: false, tabBarLabel: () => null }}
        component={Notebook}
      />
    </Tab.Navigator>
  );
};

export default App;
