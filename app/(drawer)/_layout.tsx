import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MessageSquare, GalleryVerticalEnd } from 'lucide-react-native';
import React, { useEffect } from 'react';

import Focus from './(focus)';
import Notebook from './(notebook)';
import Chat from './(sherpa)';

import { LoadingFull } from '~/components/LoadingFull';
import { Text } from '~/theme';
import { useAppContext } from '~/utils/app-provider';
import { useProfileQuery } from '~/utils/services/profiles/Profiles.query.generated';
import { Colors } from '~/utils/styles';

const Tab = createBottomTabNavigator();

const App = () => {
  const { session, setProfile } = useAppContext();
  const [profileQueryResponse, fetchProfile] = useProfileQuery({ pause: true });

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    if (profileQueryResponse.data?.profile) {
      setProfile(profileQueryResponse.data.profile);
    }
  }, [profileQueryResponse.data]);

  if (!session || profileQueryResponse.fetching) {
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
          } else if (route.name === 'Notebook') {
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
        name="Notebook"
        options={{ headerShown: false, tabBarLabel: () => null }}
        component={Notebook}
      />
    </Tab.Navigator>
  );
};

export default App;
