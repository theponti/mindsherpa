import { ChatMessagesResponse } from '~/utils/schema/schema-types';
import { Card } from './card';
import { View } from 'react-native';
import { Text } from '~/theme';
import { CircleDot, Scroll } from 'lucide-react-native';
import { Colors } from '~/utils/styles';
import { ScrollView } from 'react-native-gesture-handler';

export const ChatSummary = ({ summary }: { summary: ChatMessagesResponse['summary'] }) => {
  return (
    <View style={{ paddingHorizontal: 12 }}>
      <Card>
        <ScrollView style={{ maxHeight: 200 }}>
          <View
            style={{
              rowGap: 14,
              paddingVertical: 8,
              paddingHorizontal: 18,
            }}>
            <Text variant="title">Summary</Text>
            <View style={{ rowGap: 10, paddingVertical: 8 }}>
              {summary.map((item) => (
                <View
                  key={item.text}
                  style={{ columnGap: 8, alignItems: 'center', flexDirection: 'row' }}>
                  <CircleDot size={16} color={Colors.gray} />
                  <Text key={item.text} variant="body">
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Card>
    </View>
  );
};
