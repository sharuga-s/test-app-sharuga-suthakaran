import {IndexTable, type IndexTableRowProps} from '@shopify/polaris';

interface Props
  extends Pick<
    IndexTableRowProps,
    'rowType' | 'position' | 'id' | 'children' | 'tone' | 'selected'
  > {}

function Row({children, id, position, rowType, tone, selected}: Props) {
  return (
    <IndexTable.Row
      id={id}
      position={position}
      rowType={rowType}
      tone={tone}
      selected={selected}
    >
      {children}
    </IndexTable.Row>
  );
}

export {Row};
