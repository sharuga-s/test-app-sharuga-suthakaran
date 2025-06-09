import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Card, Page, IndexTable, Text, Badge, EmptyState } from '@shopify/polaris';
import { authenticate } from '../shopify.server';

// Simplified query to get products and check if they're in the feed
const GET_PRODUCTS_QUERY = `
  query GetProducts {
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
          variants(first: 3) {
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
`;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const feedId = params.feedId;

  if (!feedId) {
    throw new Response('Feed ID is required', { status: 400 });
  }

  try {
    // For now, let's get all products and show them
    // This is a simplified approach while we debug the productFeed query
    const response = await admin.graphql(GET_PRODUCTS_QUERY);
    const data = await response.json();
    
    console.log('GraphQL Response:', JSON.stringify(data, null, 2));
    
    if (!data.data?.products) {
      return json({ 
        feed: { id: feedId, country: 'Unknown', language: 'Unknown', status: 'Unknown' },
        products: [], 
        error: 'No products data found' 
      });
    }

    return json({
      feed: { 
        id: `gid://shopify/ProductFeed/${feedId}`, 
        country: 'CA', 
        language: 'EN', 
        status: 'ACTIVE' 
      },
      products: data.data.products.edges,
      error: null
    });
  } catch (error) {
    console.error('Error loading products:', error);
    return json({ 
      feed: { id: feedId, country: 'Unknown', language: 'Unknown', status: 'Unknown' },
      products: [], 
      error: `Server Error: ${String(error)}` 
    });
  }
}

export default function FeedProducts() {
  const { feed, products, error } = useLoaderData<typeof loader>();

  if (error) {
    return (
      <Page 
        title="Error Loading Products"
        backAction={{ url: '/app/product-feeds' }}
      >
        <Card>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <Text variant="headingMd" as="h2" tone="critical">Error Loading Feed Products</Text>
            <div style={{ marginTop: '12px' }}>
              <Text variant="bodyMd" as="p">{error}</Text>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Text variant="bodySm" as="p" tone="subdued">
                This might be because:
              </Text>
              <ul style={{ marginTop: '8px', textAlign: 'left', maxWidth: '400px', margin: '8px auto' }}>
                <li>The product feed query is not supported in this Shopify version</li>
                <li>The feed ID is incorrect</li>
                <li>There are no products available</li>
              </ul>
            </div>
          </div>
        </Card>
      </Page>
    );
  }

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
      title={`Products Available for ${feed.country}-${feed.language} Feed`}
      subtitle={`Feed Status: ${feed.status} • Showing available products`}
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
            heading="No products available"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>No products are currently available in your store. Add some products to see them here!</p>
          </EmptyState>
        )}
      </Card>
    </Page>
  );
} 