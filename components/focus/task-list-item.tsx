import { FontAwesome } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Pressable } from 'react-native';
import { Animated, type PressableProps, type ViewStyle, StyleSheet } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import RNAnimated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withSpring,
} from 'react-native-reanimated';
import * as ContextMenu from 'zeego/context-menu';

import { theme } from '~/theme';
import { AnimatedText } from '~/theme/Text';
import { borderStyle, listStyles } from '~/theme/styles';
import { useAppContext } from '~/utils/app-provider';
import { request } from '~/utils/query-client';
import type { FocusOutputItem } from '~/utils/schema/graphcache';

export const TaskListItem = ({
  item,
  label,
  onComplete,
  onDelete,
  showBorder,
  style,
  ...props
}: PressableProps & {
  item: FocusOutputItem;
  label: string;
  onComplete: (data: FocusOutputItem) => void;
  onDelete: () => void;
  showBorder?: boolean;
  style?: ViewStyle[];
}) => {
  const { session } = useAppContext();
  const fontColor = useSharedValue(0);
  const opacity = useSharedValue(1);
  const completeItem = useMutation({
    mutationKey: ['completeItem'],
    mutationFn: async () => {
      const { data } = await request({
        method: 'PUT',
        url: `/tasks/complete/${item.id}`,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      onComplete(data);
    },
    onError: () => {
      opacity.value = 1;
      fontColor.value = 1;
      const interval = setInterval(() => {
        fontColor.value -= 0.1;
      }, 100);
      setTimeout(() => clearInterval(interval), 1000);
    },
  });

  const renderLeftActions = (
    progressAnimatedValue: Animated.AnimatedInterpolation<string | number>,
    dragAnimatedValue: Animated.AnimatedInterpolation<string | number>,
    swipeable: Swipeable
  ) => {
    const trans = dragAnimatedValue.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={{}} onPress={() => console.log({ progressAnimatedValue })}>
        <Animated.Text
          style={[
            {
              transform: [{ translateX: trans }],
            },
          ]}>
          Archive
        </Animated.Text>
      </RectButton>
    );
  };

  const onRadioButtonPress = () => {
    opacity.value = 0.4;
    completeItem.mutate();
  };

  const textStyle = useAnimatedStyle(() => {
    const color = interpolateColor(fontColor.value, [0, 1], [theme.colors.black, theme.colors.red]);
    return {
      color,
    };
  });

  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  }, [opacity, fontColor]);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger action="longPress">
        <Swipeable renderLeftActions={renderLeftActions}>
          <RNAnimated.View style={[styles.container, opacityStyle]}>
            <Pressable
              style={[styles.iconWrap]}
              onPress={onRadioButtonPress}
              disabled={completeItem.isPending}>
              {completeItem.isPending ? (
                <ActivityIndicator size={20} color={theme.colors.black} />
              ) : (
                <FontAwesome
                  name="circle-o"
                  size={20}
                  color={theme.colors.quaternary}
                  style={[styles.icon]}
                />
              )}
            </Pressable>
            <AnimatedText variant="body" style={[listStyles.text, styles.text, textStyle]}>
              {label}
            </AnimatedText>
          </RNAnimated.View>
        </Swipeable>
      </ContextMenu.Trigger>
      <ContextMenu.Content
        alignOffset={10}
        loop={false}
        avoidCollisions={true}
        collisionPadding={12}>
        <ContextMenu.Label>Actions</ContextMenu.Label>
        <ContextMenu.Item key="delete" onSelect={onDelete}>
          <ContextMenu.ItemIcon ios={{ name: 'trash', size: 20 }} />
          <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    columnGap: 12,
    ...borderStyle.borderBottom,
  },
  text: {
    flex: 1,
    fontWeight: 500,
  },
  icon: {},
  iconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
