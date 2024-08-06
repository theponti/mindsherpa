import { useFocusEffect } from 'expo-router';
import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Title, Paragraph } from 'react-native-paper';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  withClamp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingFull } from './LoadingFull';
import { FeedbackBlock } from './feedback-block';

import { Text } from '~/theme';
import { Focus } from '~/utils/schema/graphcache';
import { useFocusQuery } from '~/utils/services/Focus.query.generated';
import { Colors } from '~/utils/styles';

const FadeIn = ({ children }: { children: React.ReactNode }) => {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withClamp({ min: 0, max: 200 }, withSpring(opacity.value, { duration: 2000 })),
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

const UserCard = ({
  title,
  data,
  renderItem,
}: {
  title: string;
  data: any;
  renderItem: ({ item }: { item: any }) => JSX.Element;
}) => {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withClamp({ min: 0, max: 200 }, withSpring(opacity.value, { duration: 2000 })),
    };
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: Colors.grayLight,
          borderRadius: 20,
          height: 250,
          padding: 8,
          marginBottom: 8,
        },
        animatedStyle,
      ]}>
      <View style={{ rowGap: 8 }}>
        <Text variant="title">{title}</Text>
        {data.slice(0, 3).map((item: any, index: number) => (
          <FadeIn key={index}>{renderItem({ item })}</FadeIn>
        ))}
        {/* <FlatList
          data={data}
          renderItem={renderItem}
          contentContainerStyle={{ rowGap: 12 }}
          keyExtractor={(item, index) => index.toString()}
        /> */}
      </View>
    </Animated.View>
  );
};

const renderGoal = ({ item }: { item: Focus['goals'][0] }) => (
  <Text>{`Priority: ${item.priorityGrade}, Value: ${item.value}, Sentiment: ${item.sentiment}`}</Text>
);

const renderAction = ({ item }: { item: Focus['actions'][0] }) => (
  <Text>{`Type: ${item.type}, Value: ${item.value}, Sentiment: ${item.sentiment}`}</Text>
);

const renderBelief = ({ item }: { item: Focus['beliefs'][0] }) => (
  <Text>{`Type: ${item.type}, Value: ${item.value}, Sentiment: ${item.sentiment}`}</Text>
);

const renderPreference = ({ item }: { item: Focus['preferences'][0] }) => (
  <Text>{`Type: ${item.type}, Value: ${item.value}, Sentiment: ${item.sentiment}`}</Text>
);

const renderLocation = ({ item }: { item: Focus['locations'][0] }) => (
  <Text>{`Type: ${item.type}, Value: ${item.value}, Location Type: ${item.locationType}, Country: ${item.country}`}</Text>
);

const renderDate = ({ item }: { item: Focus['dates'][0] }) => (
  <Text>{`Type: ${item.type}, Value: ${item.value}, Action: ${item.action}`}</Text>
);

export const FocusView = () => {
  const [focusResponse, getFocus] = useFocusQuery({
    pause: true,
    requestPolicy: 'network-only',
  });

  useFocusEffect(
    React.useCallback(() => {
      getFocus();
    }, [])
  );

  if (focusResponse.fetching) {
    return (
      <LoadingFull>
        <Text variant="body">getting your focus...</Text>
      </LoadingFull>
    );
  }

  if (focusResponse.error || !focusResponse.data) {
    return (
      <FeedbackBlock>
        <Text variant="body">could not get your focus</Text>
      </FeedbackBlock>
    );
  }

  const focusData = focusResponse.data.focus;
  console.log(JSON.stringify(focusData, null, 2));

  return (
    <View style={[styles.container]}>
      <Text variant="header">Focus</Text>
      <ScrollView style={styles.scrollContainer}>
        <UserCard title="Goals" data={focusData.goals} renderItem={renderGoal} />
        <UserCard title="Actions" data={focusData.actions} renderItem={renderAction} />
        <UserCard title="Beliefs" data={focusData.beliefs} renderItem={renderBelief} />
        <UserCard title="Preferences" data={focusData.preferences} renderItem={renderPreference} />
        <UserCard title="Locations" data={focusData.locations} renderItem={renderLocation} />
        <UserCard title="Dates" data={focusData.dates} renderItem={renderDate} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 75,
    paddingHorizontal: 8,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
