import {useFetcher} from '@remix-run/react';
import {useCallback} from 'react';
import type {Feed} from '../types';

export function useFeeds() {
  const fetcher = useFetcher();

  const createFeed = useCallback((name: string) => {
    fetcher.submit(
      { name },
      { method: 'POST' }
    );
  }, [fetcher]);

  const deleteFeed = useCallback((id: string) => {
    fetcher.submit(
      { id },
      { method: 'DELETE' }
    );
  }, [fetcher]);

  return {
    createFeed,
    deleteFeed,
    isLoading: fetcher.state === 'submitting'
  };
}
