import {Button, Card} from '@shopify/polaris';
import {useNavigate} from '@remix-run/react';
import {BlockStackTight} from '../../../../components/Layout/BlockStack';
import {Body, BodySecondary} from '../../../../components/Typography/Body';
import {Heading} from '../../../../components/Typography/Headings';
import type {ProductFeed} from '../../types';

interface FeedCardProps {
  feed: ProductFeed;
  onDelete: () => void;
}

export function FeedCard({feed, onDelete}: FeedCardProps) {
  const navigate = useNavigate();
  const feedIdNumber = feed.id.split('/').pop(); // Extract just the number from gid://shopify/ProductFeed/123

  const handleViewProducts = () => {
    const productsUrl = `/app/product-feeds/products/${feedIdNumber}`;
    console.log('Navigating to:', productsUrl); // Debug log
    navigate(productsUrl);
  };

  return (
    <Card>
      <BlockStackTight>
        <Heading>Feed Details</Heading>
        <Body>Country: {feed.country}</Body>
        <Body>Language: {feed.language}</Body>
        <Body>Status: {feed.status}</Body>
        <BodySecondary>ID: {feed.id}</BodySecondary>
        <BodySecondary>Debug - Feed ID Number: {feedIdNumber}</BodySecondary>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <Button 
            onClick={handleViewProducts}
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
