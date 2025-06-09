import type {TextProps} from '@shopify/polaris';
import type {ReactNode} from 'react';
import {BaseMd} from './Base';

interface Props {
  children: ReactNode;
  as: Extract<TextProps['as'], 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>;
}

function Heading({children, as}: Props) {
  return <BaseMd as={as}>{children}</BaseMd>;
}

function HeadingSecondary({children, as}: Props) {
  return (
    <BaseMd as={as} tone="subdued">
      {children}
    </BaseMd>
  );
}

export {Heading, HeadingSecondary};
