import type { PropsWithChildren } from 'react';

import Text from '~/theme/Text';
import { Colors } from '~/utils/styles';
import { FocusCategory } from '../focus/focus-category';

export const Badge = ({
  children,
  color,
}: PropsWithChildren<{ color: { color: string; textColor: string } }>) => (
  <Text
    variant="body"
    style={{
      backgroundColor: color.color ?? Colors.greenLight,
      borderRadius: 20,
      color: color.textColor ?? Colors.black,
      fontSize: 10,
      paddingVertical: 4,
      paddingHorizontal: 8,
    }}>
    {children}
  </Text>
);

const CategoryColorMap = new Map();
function getCategoryColor(category: string): { color: string; textColor: string } {
  if (CategoryColorMap.has(category)) {
    return CategoryColorMap.get(category);
  }

  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const color = `rgba(${r}, ${g}, ${b}, 1)`;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const textColor = luminance < 128 ? '#FFFFFF' : '#000000';
  CategoryColorMap.set(category, { color, textColor });
  return { color, textColor };
}

export const CategoryBadge = ({ category }: { category: string }) => (
  <Badge color={getCategoryColor(category)}>
    <FocusCategory category={category as any} />
  </Badge>
);
