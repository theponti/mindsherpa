import { createText } from '@shopify/restyle';
import Animated from 'react-native-reanimated';

import { Theme } from './theme';

const Text = createText<Theme>();

export const AnimatedText = Animated.createAnimatedComponent(Text);

export default Text;
