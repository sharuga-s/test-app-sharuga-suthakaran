import {Text, type TextProps} from '@shopify/polaris';
import {ReactNode} from 'react';

interface Props {
  children: ReactNode;
  as?: TextProps['as'];
  tone?: TextProps['tone'];
  fontWeight?: TextProps['fontWeight'];
}

function Base({children, as = 'p', tone = 'base', fontWeight}: Props) {
  return (
    <Text as={as} tone={tone} variant="bodySm" fontWeight={fontWeight}>
      {children}
    </Text>
  );
}

function BaseMd({children, tone, as}: Pick<Props, 'children' | 'tone' | 'as'>) {
  return (
    <Base as={as} tone={tone} fontWeight="medium">
      {children}
    </Base>
  );
}

export {Base, BaseMd};
