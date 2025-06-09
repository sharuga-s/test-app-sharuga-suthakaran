import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { Card, Page, IndexTable, Text, Badge, EmptyState } from '@shopify/polaris';
import { authenticate } from '../shopify.server';

const GET_FEED_PRODUCTS_QUERY = `
  query GetFeedProducts($feedId: ID!) {
    productFeed(id: $feedId) {
      id
      country
      language
      status
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            status
            vendor
            productType
            createdAt
            updatedAt
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price
                  compareAtPrice
                  availableForSale
                  inventoryQuantity
                }
              }
            }
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const feedId = params.feedId;

  if (!feedId) {
    throw new Response('Feed ID is required', { status: 400 });
  }

  try {
    const response = await admin.graphql(GET_FEED_PRODUCTS_QUERY, {
      variables: {
        feedId: `gid://shopify/ProductFeed/${feedId}`
      }
    });

    const data = await response.json();
    
    if (!data.data?.productFeed) {
      throw new Response('Product feed not found', { status: 404 });
    }

    return json({
      feed: data.data.productFeed,
      products: data.data.productFeed.products.edges
    });
  } catch (error) {
    console.error('Error loading feed products:', error);
    throw new Response('Error loading feed products', { status: 500 });
  }
}

export default function FeedProducts() {
  const { feed, products } = useLoaderData<typeof loader>();

  const rowMarkup = products.map(({ node: product }: any, index: number) => (
    <IndexTable.Row id={product.id} key={product.id} position={index}>
      <IndexTable.Cell>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {product.featuredImage && (
            <img 
              src={product.featuredImage.url} 
              alt={product.featuredImage.altText || product.title}
              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
            />
          )}
          <div>
            <Text variant="bodyMd" fontWeight="semibold" as="p">{product.title}</Text>
            <Text variant="bodySm" tone="subdued" as="p">{product.handle}</Text>
          </div>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={product.status === 'ACTIVE' ? 'success' : 'info'}>
          {product.status}
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodySm" as="p">{product.vendor || 'No vendor'}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodySm" as="p">{product.productType || 'No type'}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {product.variants.edges.length > 0 && (
          <div>
            <Text variant="bodySm" as="p">
              ${product.variants.edges[0].node.price}
            </Text>
            {product.variants.edges.length > 1 && (
              <Text variant="bodySm" tone="subdued" as="p">
                +{product.variants.edges.length - 1} more
              </Text>
            )}
          </div>
        )}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {product.variants.edges.length > 0 && (
          <Badge tone={product.variants.edges[0].node.availableForSale ? 'success' : 'critical'}>
            {product.variants.edges[0].node.availableForSale ? 'Available' : 'Unavailable'}
          </Badge>
        )}
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page 
      title={`Products in ${feed.country}-${feed.language} Feed`}
      subtitle={`Feed Status: ${feed.status}`}
      backAction={{ url: '/app/product-feeds' }}
    >
      <Card>
        {products.length > 0 ? (
          <IndexTable
            resourceName={{
              singular: 'product',
              plural: 'products',
            }}
            itemCount={products.length}
            headings={[
              { title: 'Product' },
              { title: 'Status' },
              { title: 'Vendor' },
              { title: 'Type' },
              { title: 'Price' },
              { title: 'Availability' },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        ) : (
          <EmptyState
            heading="No products in this feed"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>This product feed doesn't contain any products yet. Products will appear here when they match the feed criteria and are published to your sales channel.</p>
          </EmptyState>
        )}
      </Card>
    </Page>
  );
} 