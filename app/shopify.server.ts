import '@shopify/shopify-app-remix/adapters/node';
import {
  ApiVersion,
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
} from '@shopify/shopify-app-remix/server';
import {PrismaSessionStorage} from '@shopify/shopify-app-session-storage-prisma';
import prisma from './db.server';

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  apiVersion: ApiVersion.Unstable,
  scopes: process.env.SCOPES?.split(','),
  appUrl: process.env.SHOPIFY_APP_URL || '',
  authPathPrefix: '/auth',
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: `${process.env.SHOPIFY_APP_URL}/webhooks`,
    },
    PRODUCT_FEEDS_INCREMENTAL_SYNC: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: `${process.env.SHOPIFY_APP_URL}/webhooks`,
    },
    PRODUCT_FEEDS_FULL_SYNC: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: `${process.env.SHOPIFY_APP_URL}/webhooks`,
    },
    PRODUCT_FEEDS_FULL_SYNC_FINISH: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: `${process.env.SHOPIFY_APP_URL}/webhooks`,
    },
  },
  hooks: {
    afterAuth: async ({session}) => {
      shopify.registerWebhooks({session});
    },
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? {customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN]}
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.Unstable;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
