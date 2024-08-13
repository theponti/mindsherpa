import { SafeAreaView, View } from 'react-native';
import { Text } from '~/theme';

export default function NoteList() {
  return (
    <SafeAreaView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="header">Modal</Text>
      </View>
    </SafeAreaView>
  );
}
