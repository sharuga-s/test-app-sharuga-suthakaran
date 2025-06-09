import {LoaderFunctionArgs} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {IndexTable, Page} from '@shopify/polaris';
import {Cell} from '../../components/IndexTable/Cell';
import {Row} from '../../components/IndexTable/Row';
import {authenticate} from '../../shopify.server';
import db from '../../db.server';
import {IndexFilter} from './components/IndexFilter';
import {PayloadCell} from './components/PayloadCell';
import {ProductFeedEvent} from './types';

export const loader = async ({request}: LoaderFunctionArgs) => {
  const {session} = await authenticate.admin(request);
  const url = new URL(request.url);
  const eventType = url.searchParams.get('eventType');
  const feedId = url.searchParams.get('feedId');
  const sort = url.searchParams.get('sort');

  let queryConfig: any = {
    take: 100,
    orderBy: {
      timestamp: 'desc',
    },
    where: {
      shop: session.shop,
    },
  };

  if (eventType) {
    const eventTypes = eventType.split(',');
    if (eventTypes.length > 1) {
      queryConfig.where = {...queryConfig.where, eventType: {in: eventTypes}};
    } else {
      queryConfig.where = {...queryConfig.where, eventType: eventTypes[0]};
    }
  }

  if (feedId && !!Number(feedId)) {
    {
      queryConfig.where = {
        ...queryConfig.where,
        feedId: `gid://shopify/ProductFeed/${feedId}`,
      };
    }
  }

  if (sort) {
    const [field, direction] = sort.split(' ');
    queryConfig.orderBy = {
      [field]: direction,
    };
  }

  const events = await db.event.findMany(queryConfig);
  return events;
};

export default function ProductFeedsEvents() {
  let events: ProductFeedEvent[] = useLoaderData();
  const rowMarkup = events.map(
    (
      {id, feedId, action, resource, eventType, rawPayload, timestamp},
      index,
    ) => (
      <Row id={id} key={id} position={index}>
        <Cell>{feedId}</Cell>
        <Cell>{eventType}</Cell>
        <Cell>{action}</Cell>
        <Cell>{resource}</Cell>
        <Cell>{timestamp}</Cell>
        <PayloadCell payload={rawPayload} />
      </Row>
    ),
  );

  return (
    <Page fullWidth title="Product Feed Events">
      <IndexFilter />
      <IndexTable
        headings={[
          {title: 'Product Feed Id'},
          {title: 'Event Type'},
          {title: 'Action'},
          {title: 'Resource'},
          {title: 'Timestamp'},
          {title: 'Payload'},
        ]}
        itemCount={events.length}
      >
        {rowMarkup}
      </IndexTable>
    </Page>
  );
}
