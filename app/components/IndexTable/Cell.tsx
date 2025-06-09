import {IndexTable} from '@shopify/polaris';

type IndexTableCellProps = React.ComponentProps<typeof IndexTable.Cell>;

interface Props
  extends Pick<IndexTableCellProps, 'children' | 'flush' | 'colSpan'> {}

function Cell({children}: Props) {
  return <IndexTable.Cell>{children}</IndexTable.Cell>;
}

export {Cell};
