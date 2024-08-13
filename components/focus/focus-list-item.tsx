import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View, type PressableProps, type ViewStyle } from 'react-native';
import * as ContextMenu from 'zeego/context-menu';

import { Text } from '~/theme';
import { Colors, borderStyle, listStyles as styles } from '~/utils/styles';

export const FocusListItem = ({
  icon,
  headerRight,
  label,
  onDelete,
  showBorder,
  style,
  ...props
}: PressableProps & {
  icon?: React.ReactNode;
  headerRight: React.ReactNode;
  label: string;
  onDelete: () => void;
  showBorder?: boolean;
  style?: ViewStyle[];
}) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger action="longPress">
        <Pressable
          style={[
            styles.container,
            showBorder ? borderStyle.borderBottom : borderStyle.noBorder,
            { flexDirection: 'column' },
            style,
          ]}
          {...props}>
          <View style={{ flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
            <View>{icon}</View>
            <Text variant="body" style={[styles.text]}>
              {label}
            </Text>
          </View>
        </Pressable>
      </ContextMenu.Trigger>
      <ContextMenu.Content
        loop={false}
        alignOffset={0}
        avoidCollisions={true}
        collisionPadding={12}>
        <ContextMenu.Label>Actions</ContextMenu.Label>
        <ContextMenu.Item key="delete" onSelect={onDelete}>
          <ContextMenu.ItemIcon
            ios={{
              name: 'trash',
              size: 20,
              color: Colors.red,
            }}
          />
          <ContextMenu.ItemTitle style={{ color: Colors.red }}>Delete</ContextMenu.ItemTitle>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
