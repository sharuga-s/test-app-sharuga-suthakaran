import {ActionFunctionArgs} from '@remix-run/node';
import db from '../db.server';

import {authenticate} from '../shopify.server';

export const action = async ({request}: ActionFunctionArgs) => {
  const {topic, shop, session, payload} = await authenticate.webhook(request);

  switch (topic) {
    case 'APP_UNINSTALLED':
      if (session) {
        await db.session.deleteMany({where: {shop}});
      }
      break;

    case 'PRODUCT_FEEDS_INCREMENTAL_SYNC':
    case 'PRODUCT_FEEDS_FULL_SYNC':
    case 'PRODUCT_FEEDS_FULL_SYNC_FINISH':
      await db.event.create({
        data: {
          shop,
          feedId: payload.productFeed.id,
          eventType: topic,
          action: payload.metadata.action,
          resource: payload.metadata.resource,
          rawPayload: JSON.stringify(payload),
          timestamp: payload.metadata.occurred_at
            ? new Date(payload.metadata.occurred_at)
            : new Date(payload.fullSync.createdAt),
        },
      });
      break;
    default:
      throw new Response(
        `Unhandled webhook topic: ${topic}, payload: ${JSON.stringify(payload)}`,
        {status: 404},
      );
  }
  return new Response();
};
