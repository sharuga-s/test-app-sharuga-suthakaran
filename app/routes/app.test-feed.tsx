import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Card, Page, Text } from '@shopify/polaris';
import { authenticate } from '../shopify.server';

const TEST_FEED_QUERY = `
  query GetProductFeed($id: ID!) {
    productFeed(id: $id) {
      id
      country
      language
      status
      products(first: 5) {
        edges {
          node {
            id
            title
            handle
            status
          }
        }
      }
    }
  }
`;

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  
  try {
    const response = await admin.graphql(TEST_FEED_QUERY, {
      variables: {
        id: "gid://shopify/ProductFeed/9464381462" // Your feed ID
      }
    });
    
    const data = await response.json();
    return json({ feedData: data.data.productFeed, error: null });
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
          <Text as="p" tone="critical">Error: {error}</Text>
        ) : feedData ? (
          <div>
            <Text as="h2" variant="headingMd">✅ Feed is Working!</Text>
            <p><strong>Feed ID:</strong> {feedData.id}</p>
            <p><strong>Country:</strong> {feedData.country}</p>
            <p><strong>Language:</strong> {feedData.language}</p>
            <p><strong>Status:</strong> {feedData.status}</p>
            <p><strong>Products in Feed:</strong> {feedData.products.edges.length}</p>
            
            <Text as="h3" variant="headingMd">Sample Products:</Text>
            <ul>
              {feedData.products.edges.map(({ node }: any) => (
                <li key={node.id}>
                  {node.title} (Handle: {node.handle}, Status: {node.status})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Text as="p">No feed data found</Text>
        )}
      </Card>
    </Page>
  );
} 