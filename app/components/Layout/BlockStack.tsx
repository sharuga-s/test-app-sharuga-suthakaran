import {BlockStack as PolarisBlockStack} from '@shopify/polaris';
import React from 'react';

interface BlockStackProps {
  children: React.ReactNode;
  gap?: "025" | "050" | "100" | "200" | "300" | "400" | "500" | "600" | "800" | "1000" | "1200" | "1600" | "2000" | "2400" | "2800" | "3200";
}

export function BlockStack({children, gap = "400"}: BlockStackProps) {
  return <PolarisBlockStack gap={gap}>{children}</PolarisBlockStack>;
}

export function BlockStackLoose({children}: {children: React.ReactNode}) {
  return <PolarisBlockStack gap="600">{children}</PolarisBlockStack>;
}

export function BlockStackTight({children}: {children: React.ReactNode}) {
  return <PolarisBlockStack gap="200">{children}</PolarisBlockStack>;
}
