import { Card, ResourceList, ResourceItem, Badge, Text } from "@shopify/polaris";

interface ProductFeed {
  id: string;
  country: string;
  language: string;
  status?: string;
}

interface FeedListProps {
  feeds: ProductFeed[];
}

export function FeedList({ feeds }: FeedListProps) {
  const renderFeedItem = (feed: ProductFeed) => {
    const { id, country, language, status } = feed;
    
    return (
      <ResourceItem
        id={id}
        onClick={() => {
          console.log('Clicked feed:', id);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text variant="bodyMd" fontWeight="bold" as="h3">
              {country}-{language}
            </Text>
            <Text variant="bodySm" as="p" tone="subdued">
              Feed ID: {id.split('/').pop()}
            </Text>
          </div>
          <Badge tone={status === 'ACTIVE' ? 'success' : 'info'}>
            {status || 'Active'}
          </Badge>
        </div>
      </ResourceItem>
    );
  };

  return (
    <Card>
      <div style={{ padding: '1rem 0' }}>
        <Text variant="headingMd" as="h2">
          📡 Active Product Feeds
        </Text>
        <Text variant="bodySm" as="p" tone="subdued">
          These feeds provide contextual product data to your sales channel
        </Text>
      </div>
      
      {feeds.length > 0 ? (
        <ResourceList
          resourceName={{ singular: 'feed', plural: 'feeds' }}
          items={feeds}
          renderItem={renderFeedItem}
        />
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <Text variant="bodyMd" tone="subdued" as="p">
            No product feeds found. Create one to get started!
          </Text>
        </div>
      )}
    </Card>
  );
}