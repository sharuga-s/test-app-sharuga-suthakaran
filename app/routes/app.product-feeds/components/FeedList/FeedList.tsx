import {useFetcher, useLoaderData, useNavigate} from '@remix-run/react';
import {Banner, Button, Card, Layout} from '@shopify/polaris';
import {useCallback, useEffect, useState} from 'react';
import {BlockStack, BlockStackLoose} from '../../../../components/Layout/BlockStack';
import type {ProductFeed} from '../../types';
import {CreateFeedModal} from '../CreateFeedModal';
import {FeedCard} from '../FeedCard';

type LoaderData = {
  feeds: Array<{node: ProductFeed}>;
};

type FetcherData = {
  productFeed?: ProductFeed;
  deletedId?: string;
  userErrors?: Array<{message: string}>;
};

export function FeedList() {
  const {feeds} = useLoaderData<LoaderData>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const fetcher = useFetcher<FetcherData>();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle success cases
    if (fetcher.data?.productFeed || fetcher.data?.deletedId) {
      setIsModalOpen(false);
      navigate('.');
    }

    // Handle error case
    if (
      fetcher.data?.userErrors &&
      !fetcher.data?.productFeed &&
      !fetcher.data?.deletedId
    ) {
      setShowErrorBanner(true);
      setIsModalOpen(false);

      const timer = setTimeout(() => {
        setShowErrorBanner(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [fetcher.data, navigate]);

  const handleCreateFeed = useCallback(
    (country: string, language: string) => {
      fetcher.submit({country, language}, {method: 'POST'});
    },
    [fetcher],
  );

  const handleDeleteFeed = useCallback(
    (feedId: string) => {
      if (window.confirm('Are you sure you want to delete this feed?')) {
        fetcher.submit({feedId}, {method: 'DELETE'});
      }
    },
    [fetcher],
  );

  return (
    <Layout>
      <Layout.Section>
        <Card>
          <BlockStackLoose>
            <Button onClick={() => setIsModalOpen(true)}>
              Create new feed
            </Button>

            {showErrorBanner &&
              fetcher.data?.userErrors &&
              !fetcher.data?.productFeed &&
              !fetcher.data?.deletedId && (
                <Banner tone="critical">
                  {fetcher.data.userErrors.map((error: {message: string}) => (
                    <p key={error.message}>{error.message}</p>
                  ))}
                </Banner>
              )}

            <BlockStack>
              {feeds.map(({node}) => (
                <FeedCard
                  key={node.id}
                  feed={node}
                  onDelete={() => handleDeleteFeed(node.id)}
                />
              ))}
            </BlockStack>
          </BlockStackLoose>
        </Card>
      </Layout.Section>

      <CreateFeedModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateFeed}
      />
    </Layout>
  );
}
