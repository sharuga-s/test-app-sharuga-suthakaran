import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Card, Page, Text } from '@shopify/polaris';
import { authenticate } from '../shopify.server';

const GET_ALL_FEEDS_QUERY = `
  query GetAllProductFeeds {
    productFeeds(first: 10) {
      edges {
        node {
          id
          country
          language
          status
        }
      }
    }
  }
`;

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  
  try {
    const response = await admin.graphql(GET_ALL_FEEDS_QUERY);
    const data = await response.json();
    
    if (!data.data || !data.data.productFeeds) {
      return json({ 
        feedData: null, 
        error: 'No product feeds data found in response' 
      });
    }
    
    return json({ 
      feedData: data.data.productFeeds.edges, 
      error: null 
    });
  } catch (error) {
    return json({ feedData: null, error: String(error) });
  }
}

export default function TestFeed() {
  const { feedData, error } = useLoaderData<typeof loader>();

  return (
    <Page title="Product Feed Test">
      <Card>
        {error ? (
          <div>
            <Text as="h2" variant="headingMd" tone="critical">❌ Error Loading Feeds</Text>
            <Text as="p" tone="critical">Error: {error}</Text>
          </div>
        ) : feedData && feedData.length > 0 ? (
          <div>
            <Text as="h2" variant="headingMd">✅ Product Feeds Found!</Text>
            <Text as="p">Total feeds: {feedData.length}</Text>
            
            <div style={{marginTop: '1rem'}}>
              <Text as="h3" variant="headingMd">Feed Details:</Text>
              {feedData.map(({ node }: any, index: number) => (
                <div key={node.id} style={{marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px'}}>
                  <Text as="h4" variant="headingSm">Feed #{index + 1}</Text>
                  <p><strong>ID:</strong> {node.id}</p>
                  <p><strong>Country:</strong> {node.country}</p>
                  <p><strong>Language:</strong> {node.language}</p>
                  <p><strong>Status:</strong> {node.status}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Text as="h2" variant="headingMd">📋 No Product Feeds Found</Text>
            <Text as="p">No product feeds are currently configured for this store.</Text>
          </div>
        )}
      </Card>
    </Page>
  );
} 