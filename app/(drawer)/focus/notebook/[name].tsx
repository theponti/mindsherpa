import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, View } from 'react-native';
import { Text } from '~/theme';

export default function Notebook() {
  const { name } = useLocalSearchParams();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="header">{name}</Text>
      </View>
    </SafeAreaView>
  );
}
