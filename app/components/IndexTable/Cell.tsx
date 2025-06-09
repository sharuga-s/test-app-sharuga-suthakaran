import {IndexTable} from '@shopify/polaris';
import React from 'react';

type IndexTableCellProps = React.ComponentProps<typeof IndexTable.Cell>;

interface Props
  extends Pick<IndexTableCellProps, 'children' | 'flush' | 'colSpan'> {}

export function Cell({children, ...props}: Props) {
  return <IndexTable.Cell {...props}>{children}</IndexTable.Cell>;
}
