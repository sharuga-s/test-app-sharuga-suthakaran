import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import {TitleBar} from '@shopify/app-bridge-react';
import {Page} from '@shopify/polaris';
import {authenticate} from '../../shopify.server';
import {FeedList} from './components/FeedList';
import {
  CREATE_PRODUCT_FEED,
  DELETE_PRODUCT_FEED,
  GET_PRODUCT_FEEDS,
} from './graphql/queries';

export async function loader({request}: LoaderFunctionArgs) {
  const {admin} = await authenticate.admin(request);

  const response = await admin.graphql(GET_PRODUCT_FEEDS);
  const {data} = await response.json();
  return json({feeds: data.productFeeds.edges});
}

export async function action({request}: ActionFunctionArgs) {
  const {admin} = await authenticate.admin(request);
  const formData = await request.formData();

  if (request.method === 'DELETE') {
    const feedId = formData.get('feedId');
    const response = await admin.graphql(DELETE_PRODUCT_FEED, {
      variables: {id: feedId},
    });
    return json((await response.json()).data.productFeedDelete);
  }
  const formatChannelId = (channelId: string) => {
    if (channelId === '') return '';
    if (channelId.includes('gid://shopify/Publication/')) return channelId;
    return `gid://shopify/Publication/${channelId}`;
  };

  try {
    const response = await admin.graphql(CREATE_PRODUCT_FEED, {
      variables: {
        input: {
          country: formData.get('country')?.toString().toUpperCase(),
          language: formData.get('language')?.toString().toUpperCase(),
          ...(formData.get('channelId') && {
            channelId: formatChannelId(
              formData.get('channelId')?.toString() || '',
            ),
          }),
        },
      },
    });

    return json((await response.json()).data.productFeedCreate);
  } catch (error) {
    return json({userErrors: [{message: String(error)}]});
  }
}

export default function ProductFeeds() {
  return (
    <Page>
      <TitleBar title="Product Feeds" />
      <FeedList />
    </Page>
  );
}
