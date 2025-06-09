import {
  BlockStack as PolarisBlockStack,
  type BlockStackProps,
} from '@shopify/polaris';

interface Props {
  children: any;
  inlineAlign?: BlockStackProps['inlineAlign'];
}

function BlockStack({children, inlineAlign}: Props) {
  return (
    <PolarisBlockStack gap="400" inlineAlign={inlineAlign}>
      {children}
    </PolarisBlockStack>
  );
}

function BlockStackTight({children, inlineAlign}: Props) {
  return (
    <PolarisBlockStack gap="200" inlineAlign={inlineAlign}>
      {children}
    </PolarisBlockStack>
  );
}

function BlockStackLoose({children, inlineAlign}: Props) {
  return (
    <PolarisBlockStack gap="600" inlineAlign={inlineAlign}>
      {children}
    </PolarisBlockStack>
  );
}

export {BlockStack, BlockStackLoose, BlockStackTight};
