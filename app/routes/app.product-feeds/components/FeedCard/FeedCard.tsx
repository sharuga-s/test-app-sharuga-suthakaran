import {Button, Card} from '@shopify/polaris';
import {BlockStackTight} from '~/components/Layout/BlockStack';
import {Body, BodySecondary} from '~/components/Typography/Body';
import {Heading} from '~/components/Typography/Headings';
import type {ProductFeed} from '../../types';

interface FeedCardProps {
  feed: ProductFeed;
  onDelete: () => void;
}

export function FeedCard({feed, onDelete}: FeedCardProps) {
  return (
    <Card>
      <BlockStackTight>
        <Heading as="h3">Feed Details</Heading>
        <Body as="p">Country: {feed.country}</Body>
        <Body as="p">Language: {feed.language}</Body>
        <Body as="p">Status: {feed.status}</Body>
        <Body as="p">Channel ID: {feed.channelId}</Body>
        <BodySecondary as="p">ID: {feed.id}</BodySecondary>
        <Button tone="critical" onClick={onDelete}>
          Delete Feed
        </Button>
      </BlockStackTight>
    </Card>
  );
}
