import type {TextProps} from '@shopify/polaris';
import type {ReactNode} from 'react';
import {Base, BaseMd} from './Base';

interface Props {
  children: ReactNode;
  as: Extract<TextProps['as'], 'p' | 'span' | 'strong' | 'legend'>;
}

function Body({children, as}: Props) {
  return <Base as={as}>{children}</Base>;
}

function BodySecondary({children, as}: Props) {
  return (
    <Base tone="subdued" as={as}>
      {children}
    </Base>
  );
}

function BodyMdSecondary({children, as}: Props) {
  return (
    <BaseMd tone="subdued" as={as}>
      {children}
    </BaseMd>
  );
}

export {Body, BodyMdSecondary, BodySecondary};
