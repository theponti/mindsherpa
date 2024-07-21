import { createTheme, useTheme as useRestyleTheme } from '@shopify/restyle';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { Colors } from '~/utils/styles';

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

const theme = createTheme({
  colors: {
    ...Colors,
  },
  spacing: {
    xs_4: 4,
    s_8: 8,
    sm_12: 12,
    m_16: 16,
    ml_24: 24,
    l_32: 32,
    xl_64: 64,
  },
  borderRadii: {
    s_3: 3,
    m_6: 6,
    l_12: 12,
    xl_24: 24,
  },
  textVariants: {
    body: {
      fontSize: 16,
    },
    title: { fontSize: 20, fontWeight: 'bold' },
    large: {
      fontSize: 36,
    },
    extra_large: {
      fontSize: 64,
      fontWeight: 'bold',
    },
    defaults: {
      // We can define a default text variant here.
    },
  },
});

export const useTheme = () => {
  return useRestyleTheme<Theme>();
};

export const makeStyles = <T extends NamedStyles<T> | NamedStyles<unknown>>(
  styles: (theme: Theme) => T
) => {
  return () => {
    return styles(theme);
  };
};

export type Theme = typeof theme;
export default theme;
