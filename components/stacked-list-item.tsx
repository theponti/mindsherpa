import { useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { NoteForm } from './notes/note-form';

import { Text } from '~/theme';
import { Shadows } from '~/theme/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const StackedListItem = ({
  item,
  index,
  totalItems,
  expandCard,
  isExpanded,
}: Readonly<{
  item: {
    title: string;
    count: number;
    expandedIndex: number | null;
  };
  index: number;
  totalItems: number;
  expandCard: (index: number) => void;
  isExpanded: boolean;
}>) => {
  const animatedValue = useSharedValue(0);
  const isExpandedIndex = isExpanded && index === item.expandedIndex;

  useEffect(() => {
    animatedValue.value = withTiming(isExpanded ? 1 : 0, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isExpanded]);

  const translateY = interpolate(
    animatedValue.value,
    [0, 1],
    [0, item.expandedIndex !== null && index < item.expandedIndex ? -SCREEN_HEIGHT : SCREEN_HEIGHT],
    Extrapolation.CLAMP
  );

  const scale = interpolate(
    animatedValue.value,
    [0, 1],
    [1, index === item.expandedIndex ? 1.05 : 0.95],
    Extrapolation.CLAMP
  );

  const cardStyle = {
    transform: [{ translateY }, { scale }],
    zIndex: isExpandedIndex ? 999 : -(totalItems - index),
    height: isExpandedIndex ? SCREEN_HEIGHT * 0.8 : null,
  };

  return (
    <Animated.View style={[styles.card, cardStyle, index > 0 && { marginTop: -60 }]}>
      <TouchableOpacity onPress={() => expandCard(index)} activeOpacity={0.9}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCount}>{item.count}</Text>
        </View>
        {(index === 0 || isExpandedIndex) && <NoteForm onSubmit={() => {}} />}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    ...Shadows.dark,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardCount: {
    fontSize: 18,
    color: '#999',
  },
});

export default StackedListItem;
