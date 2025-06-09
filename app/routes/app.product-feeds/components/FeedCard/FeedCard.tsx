import {Button, Card} from '@shopify/polaris';
import {BlockStackTight} from '../../../../components/Layout/BlockStack';
import {Body, BodySecondary} from '../../../../components/Typography/Body';
import {Heading} from '../../../../components/Typography/Headings';
import type {ProductFeed} from '../../types';

interface FeedCardProps {
  feed: ProductFeed;
  onDelete: () => void;
}

export function FeedCard({feed, onDelete}: FeedCardProps) {
  const feedIdNumber = feed.id.split('/').pop(); // Extract just the number from gid://shopify/ProductFeed/123

  return (
    <Card>
      <BlockStackTight>
        <Heading>Feed Details</Heading>
        <Body>Country: {feed.country}</Body>
        <Body>Language: {feed.language}</Body>
        <Body>Status: {feed.status}</Body>
        <BodySecondary>ID: {feed.id}</BodySecondary>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <Button 
            url={`/app/product-feeds/products/${feedIdNumber}`}
            variant="primary"
          >
            View Products
          </Button>
          <Button tone="critical" onClick={onDelete}>
            Delete Feed
          </Button>
        </div>
      </BlockStackTight>
    </Card>
  );
}
