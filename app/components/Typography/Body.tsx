import {Text} from '@shopify/polaris';
import React from 'react';

interface BodyProps {
  children: React.ReactNode;
}

export function Body({children}: BodyProps) {
  return <Text variant="bodyMd" as="p">{children}</Text>;
}

export function BodySecondary({children}: BodyProps) {
  return <Text variant="bodySm" as="p" tone="subdued">{children}</Text>;
}
