import type { ViewStyle } from 'react-native';
import { Text } from 'react-native';

import unicodeMap from './fa-unicode-map.json';
import { theme } from '~/theme';

interface IconProps {
  color?: string;
  name: keyof typeof unicodeMap;
  size: number;
  style?: ViewStyle;
}

export const MindsherpaIcon = ({ color = theme.colors.black, name, size, style }: IconProps) => {
  const icon = unicodeMap[name]
    ? String.fromCharCode(Number.parseInt(unicodeMap[name].slice(2), 16))
    : '';

  return (
    <Text style={[{ fontFamily: 'Font Awesome Regular', color, fontSize: size }, style]}>
      {icon}
    </Text>
  );
};

export default MindsherpaIcon;
