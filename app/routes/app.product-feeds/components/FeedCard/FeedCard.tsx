import {Button, Card} from '@shopify/polaris';
import {BlockStackTight} from '../../../../components/Layout/BlockStack';
import {Body, BodySecondary} from '../../../../components/Typography/Body';
import {Heading} from '../../../../components/Typography/Headings';
import type {ProductFeed} from '../../types';

interface FeedCardProps {
  feed: ProductFeed;
  onDelete: () => void;
}

export function FeedCard({feed, onDelete}: FeedCardProps) {
  return (
    <Card>
      <BlockStackTight>
        <Heading>Feed Details</Heading>
        <Body>Country: {feed.country}</Body>
        <Body>Language: {feed.language}</Body>
        <Body>Status: {feed.status}</Body>
        <Body>Channel ID: {feed.channelId}</Body>
        <BodySecondary>ID: {feed.id}</BodySecondary>
        <Button tone="critical" onClick={onDelete}>
          Delete Feed
        </Button>
      </BlockStackTight>
    </Card>
  );
}
