import { StyleSheet } from 'react-native';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native-gesture-handler';

import { Text } from '~/theme';
import { Colors, borderStyle } from '~/utils/styles';

export const FocusListItem = ({
  icon,
  headerRight,
  label,
  onPress,
  showBorder,
}: TouchableOpacityProps & {
  icon?: React.ReactNode;
  label: string;
  headerRight: React.ReactNode;
  showBorder?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.container, showBorder ? borderStyle.borderBottom : borderStyle.noBorder]}>
    {icon}
    <Text variant="body" style={styles.text}>
      {label}
    </Text>
    {headerRight}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 12,
  },
  text: {
    flex: 1,
    alignItems: 'center',
  },
});
