export const GET_PRODUCT_FEEDS = `
  query ProductFeeds {
    productFeeds(first: 50) {
      edges {
        node {
          id
          country
          language
          channelId
          status
        }
      }
    }
  }
`;

export const CREATE_PRODUCT_FEED = `
  mutation productFeedCreate($input: ProductFeedInput!) {
    productFeedCreate(input: $input) {
      productFeed {
        id
        country
        language
        channelId
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const DELETE_PRODUCT_FEED = `
  mutation productFeedDelete($id: ID!) {
    productFeedDelete(id: $id) {
      deletedId
      userErrors {
        code
        field
        message
      }
    }
  }
`;
