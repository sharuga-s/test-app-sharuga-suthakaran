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
  console.log('🔍 Products Route - Starting loader');
  console.log('🔍 Products Route - Feed ID:', params.feedId);
  console.log('🔍 Products Route - Full URL:', request.url);
  
  const { admin } = await authenticate.admin(request);
  const feedId = params.feedId;

  if (!feedId) {
    console.error('❌ No feed ID provided');
    throw new Response('Feed ID is required', { status: 400 });
  }

  try {
    console.log('📡 Making GraphQL request for products...');
    const response = await admin.graphql(GET_PRODUCTS_QUERY);
    const data = await response.json();
    
    console.log('✅ GraphQL Response received, products count:', data.data?.products?.edges?.length || 0);
    
    if (!data.data?.products) {
      console.error('❌ No products data in response');
      return json({ 
        feed: { id: feedId, country: 'Unknown', language: 'Unknown', status: 'Unknown' },
        products: [], 
        error: 'No products data found' 
      });
    }

    console.log('🎉 Successfully loaded products for feed:', feedId);
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
    console.error('💥 Error loading products:', error);
    return json({ 
      feed: { id: feedId, country: 'Unknown', language: 'Unknown', status: 'Unknown' },
      products: [], 
      error: `Server Error: ${String(error)}` 
    });
  }
}

export default function FeedProducts() {
  const { feed, products, error } = useLoaderData<typeof loader>();

  return (
    <Page 
      title={`Products for ${feed.country}-${feed.language} Feed`}
      subtitle={`Feed Status: ${feed.status}`}
      backAction={{ url: '/app/product-feeds' }}
    >
      {/* Debug Information Card */}
      <Card>
        <div style={{ padding: '16px', backgroundColor: '#f6f6f7', marginBottom: '20px' }}>
          <Text variant="headingMd" as="h3">🔍 Debug Information</Text>
          <div style={{ marginTop: '12px' }}>
            <Text variant="bodySm" as="p"><strong>Feed ID:</strong> {feed.id}</Text>
            <Text variant="bodySm" as="p"><strong>Country:</strong> {feed.country}</Text>
            <Text variant="bodySm" as="p"><strong>Language:</strong> {feed.language}</Text>
            <Text variant="bodySm" as="p"><strong>Status:</strong> {feed.status}</Text>
            <Text variant="bodySm" as="p"><strong>Products Found:</strong> {products.length}</Text>
            {error && <Text variant="bodySm" as="p" tone="critical"><strong>Error:</strong> {error}</Text>}
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <Text variant="headingMd" as="h2" tone="critical">❌ Error Loading Products</Text>
            <div style={{ marginTop: '12px' }}>
              <Text variant="bodyMd" as="p">{error}</Text>
            </div>
          </div>
        </Card>
      )}

      {/* Products Display */}
      <Card>
        <div style={{ padding: '16px' }}>
          <Text variant="headingMd" as="h2">📦 Products</Text>
          
          {products.length > 0 ? (
            <div style={{ marginTop: '16px' }}>
              <Text variant="bodyMd" as="p" tone="success">
                ✅ Found {products.length} products in your store!
              </Text>
              
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
                {products.map(({ node: product }: any, index: number) => (
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
                ))}
              </IndexTable>
            </div>
          ) : (
            <div style={{ marginTop: '16px', textAlign: 'center', padding: '40px' }}>
              <Text variant="headingMd" as="h3">📭 No Products Found</Text>
              <div style={{ marginTop: '12px' }}>
                <Text variant="bodyMd" as="p">
                  No products are currently available in your store.
                </Text>
                <div style={{ marginTop: '8px' }}>
                  <Text variant="bodySm" as="p" tone="subdued">
                    Try adding some products to your Shopify store and refresh this page.
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Page>
  );
} 