import {IndexTable} from '@shopify/polaris';
import React from 'react';

type IndexTableRowProps = React.ComponentProps<typeof IndexTable.Row>;

interface Props extends Pick<IndexTableRowProps, 'children' | 'id' | 'position' | 'selected' | 'tone'> {}

export function Row({children, ...props}: Props) {
  return <IndexTable.Row {...props}>{children}</IndexTable.Row>;
}
