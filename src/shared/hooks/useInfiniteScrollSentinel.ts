import {useEffect, useState} from 'react';

import {NOTIFICATIONS_INFINITE_SCROLL} from '@/shared/constants/notifications';
import {UseInfiniteScrollSentinelParams} from '@/shared/interfaces/hooks';

// Loads the next page when a sentinel placed after the list scrolls into view.
// Returns a callback ref for that sentinel element.
export default function useInfiniteScrollSentinel({
  root = null,
  enabled = true,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseInfiniteScrollSentinelParams) {
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !sentinelNode || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      // eslint-disable-next-line local-rules/enforce-single-object-param
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      {
        root,
        threshold: NOTIFICATIONS_INFINITE_SCROLL.observerThreshold,
        rootMargin: NOTIFICATIONS_INFINITE_SCROLL.observerRootMargin,
      }
    );

    observer.observe(sentinelNode);

    return () => observer.disconnect();
  }, [
    enabled,
    root,
    sentinelNode,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return setSentinelNode;
}
