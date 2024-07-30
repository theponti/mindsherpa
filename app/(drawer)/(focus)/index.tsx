import { View, StyleSheet } from 'react-native';

import { Text } from '~/theme';

const FocusScreen = () => (
  <View style={workStyles.container}>
    <Text>Focus</Text>
  </View>
);

const workStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FocusScreen;
