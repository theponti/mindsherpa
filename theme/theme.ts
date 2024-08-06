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
      fontFamily: 'Noto Sans',
      fontSize: 16,
    },
    header: {
      fontFamily: 'Noto Serif',
      fontSize: 42,
    },
    title: {
      fontFamily: 'Noto Serif',
      fontSize: 20,
    },
    label: {
      fontFamily: 'Noto Serif',
      fontSize: 16,
    },
    large: {
      fontFamily: 'Noto Serif',
      fontSize: 36,
    },
    extra_large: {
      fontFamily: 'Noto Serif',
      fontSize: 64,
    },
    defaults: {
      fontFamily: 'Noto Sans',
    },
    shadow: {
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
    },
  },
});

export const Shadows = {
  dark: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    shadowRadius: 1,
  },
};

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
