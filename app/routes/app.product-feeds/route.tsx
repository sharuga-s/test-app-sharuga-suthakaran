import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, Form } from "@remix-run/react";
import { authenticate } from "../../shopify.server";
import { Page, Layout, Card, Button } from "@shopify/polaris";
import { FeedList } from "./components/FeedList/FeedList";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  
  try {
    // Query existing product feeds
    const response = await admin.graphql(`
      query {
        productFeeds(first: 10) {
          edges {
            node {
              id
              country
              language
            }
          }
        }
      }
    `);
    
    const data = await response.json();
    const feeds = data.data.productFeeds.edges.map((edge: any) => edge.node);
    
    return json({ feeds });
  } catch (error) {
    return json({ feeds: [] });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  
  try {
    const feedResponse = await admin.graphql(
      `mutation productFeedCreate($input: ProductFeedInput!) {
        productFeedCreate(input: $input) {
          productFeed { id country language }
          userErrors { field message }
        }
      }`,
      { variables: { input: { country: "US", language: "EN" } } }
    );

    const result = await feedResponse.json();
    return json({ success: true, data: result });

} catch (error: any) {
    return json({ success: false, error: error.message });
  }
  
};

export default function ProductFeeds() {
  const { feeds } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <Page title="Product Feeds">
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: '1rem' }}>
              <Form method="post">
                <Button submit>Create Product Feed</Button>
              </Form>
            </div>
          </Card>
        </Layout.Section>
        
        <Layout.Section>
          <FeedList feeds={feeds} />
        </Layout.Section>
        
        {actionData && (
          <Layout.Section>
            <Card>
              <pre style={{ fontSize: '10px', overflow: 'scroll' }}>
                {JSON.stringify(actionData, null, 2)}
              </pre>
            </Card>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
}