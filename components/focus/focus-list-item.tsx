import { Pressable, View, type PressableProps, type ViewStyle } from 'react-native';

import { Text } from '~/theme';
import { borderStyle, listStyles as styles } from '~/utils/styles';

export const FocusListItem = ({
  icon,
  headerRight,
  label,
  showBorder,
  style,
  ...props
}: PressableProps & {
  icon?: React.ReactNode;
  headerRight: React.ReactNode;
  label: string;
  showBorder?: boolean;
  style?: ViewStyle[];
}) => (
  <Pressable
    style={[
      styles.container,
      showBorder ? borderStyle.borderBottom : borderStyle.noBorder,
      { flexDirection: 'column' },
      style,
    ]}
    {...props}>
    <View style={{ flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
      {icon}
      <Text variant="body" style={styles.text}>
        {label}
      </Text>
    </View>
    {/* <View style={{ alignSelf: 'flex-end' }}>{headerRight}</View> */}
  </Pressable>
);
