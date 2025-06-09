import {Text} from '@shopify/polaris';
import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({children, level = 2}: HeadingProps) {
  const as = `h${level}` as const;
  const variant = level <= 2 ? 'headingLg' : level <= 4 ? 'headingMd' : 'headingSm';
  
  return <Text variant={variant} as={as}>{children}</Text>;
}
