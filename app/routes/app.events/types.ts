export interface ProductFeedEvent {
  id: string;
  feedId: string;
  eventType: string;
  resource: string;
  action: string;
  rawPayload: string;
  timestamp: string;
}
