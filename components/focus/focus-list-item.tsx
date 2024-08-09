import { StyleSheet } from 'react-native';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native-gesture-handler';

import { Text } from '~/theme';
import { Colors } from '~/utils/styles';

export const FocusListItem = ({
  icon,
  isLastItem,
  headerRight,
  label,
  onPress,
}: TouchableOpacityProps & {
  icon?: React.ReactNode;
  isLastItem?: boolean;
  label: string;
  headerRight: React.ReactNode;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.container,
      {
        borderBottomColor: isLastItem ? 'transparent' : Colors.grayLight,
        borderBottomWidth: isLastItem ? 0 : 1,
      },
    ]}>
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
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 12,
  },
  text: {
    flex: 1,
  },
});
