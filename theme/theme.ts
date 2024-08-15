import { createTheme, useTheme as useRestyleTheme } from '@shopify/restyle'
import { type ImageStyle, type TextStyle, type ViewStyle } from 'react-native'

import { Colors } from '~/utils/styles'

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle
}

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
    extra_large: {
      fontFamily: 'Noto Serif',
      fontSize: 64,
    },
    header: {
      fontFamily: 'Noto Serif',
      fontSize: 42,
    },
    large: {
      fontFamily: 'Noto Sans',
      fontSize: 32,
    },
    cardHeader: {
      fontFamily: 'Noto Sans',
      fontSize: 28,
      fontWeight: 600,
    },
    title: {
      fontFamily: 'Noto Sans',
      fontSize: 20,
    },
    label: {
      fontFamily: 'Noto Sans',
      fontSize: 16,
    },
    body: {
      fontFamily: 'Noto Sans',
      fontSize: 16,
      color: 'quaternary',
    },
    bodyLarge: {
      fontFamily: 'Noto Sans',
      fontSize: 18,
      fontWeight: 'semibold',
    },
    small: {
      fontFamily: 'Noto Sans',
      fontSize: 12,
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
})

export const Shadows = {
  dark: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    shadowRadius: 1,
  },
}

export const useTheme = () => {
  return useRestyleTheme<Theme>()
}

export const makeStyles = <T extends NamedStyles<T> | NamedStyles<unknown>>(
  styles: (theme: Theme) => T
) => {
  return () => {
    return styles(theme)
  }
}

export type Theme = typeof theme
export default theme
