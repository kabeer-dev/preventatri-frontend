/**
 * -----------------------------------------------------------------------------
 * 🧭 React Query Default Configuration
 * -----------------------------------------------------------------------------
 *
 * This file defines the **default behavior** for all React Query hooks across
 * the application. It ensures a consistent approach to caching, refetching,
 * retry logic, and background data refreshing.
 *
 * 🔹 1. QUERY_TIMINGS
 *    Defines all timing-related constants used by queries.
 *
 *    • STALE_TIME:
 *        How long (in milliseconds) the fetched data is considered “fresh.”
 *        During this period, React Query will NOT automatically re-fetch data,
 *        even if components re-render. Once this time expires, the data becomes
 *        “stale,” and React Query may refetch it if triggered.
 *        Example: `30 * 60 * 1000` (30 minutes) — the data remains fresh for 30 minutes.
 *
 *    • STALE_TIME_FOR_SERVER_SIDE_QUERY_CLIENT:
 *        A shorter stale time used when creating queries on the **server side** (e.g., SSR or SSG).
 *        It ensures server-rendered data is fresh enough for hydration without
 *        performing unnecessary re-fetches on the client immediately after loading.
 *        Example: `60 * 1000` (1 minute).
 *
 *    • GC_TIME:
 *        Also known as **cache retention time**. When a query becomes inactive
 *        (no component is using it), React Query will keep it in memory for this duration.
 *        If not used again within this time, it will be garbage-collected and removed.
 *        Example: `30 * 60 * 1000` (30 minutes).
 *
 *    • MAX_RETRY_DELAY:
 *        The maximum delay (in milliseconds) between retry attempts when a query fails.
 *        Used in exponential backoff to avoid retrying too aggressively.
 *        Example: `30000` → 30 seconds maximum delay.
 *
 *    • REFETCH_INTERVAL:
 *        Defines the interval (in milliseconds) for automatic polling.
 *        When enabled, React Query will re-execute the query periodically,
 *        keeping the data “live.” Ideal for dashboards or real-time updates.
 *        Example: `30 * 60 * 1000` (every 30 minutes).
 *
 * -----------------------------------------------------------------------------
 *
 * 🔹 2. QUERY_RETRY_CONFIG
 *    Controls how React Query handles **failed requests**.
 *
 *    • ATTEMPTS:
 *        Number of times React Query should retry a failed query before giving up.
 *        Example: `2` → two retry attempts before throwing an error.
 *
 *    • DELAY_FUNCTION:
 *        Function defining how long to wait between retries.
 *        Uses an **exponential backoff** pattern (1s → 2s → 4s → …) capped
 *        by `MAX_RETRY_DELAY`. Helps avoid overwhelming the server during outages.
 *        Example: Math.min(1000 * 2 ** attemptIndex, MAX_RETRY_DELAY)
 *
 * -----------------------------------------------------------------------------
 *
 * 🔹 3. DEFAULT_QUERY_OPTIONS
 *    Defines the **base configuration** used by all queries unless overridden.
 *
 *    • staleTime / gcTime:
 *        Inherit their values from `QUERY_TIMINGS`. Together, they control
 *        how long data is considered fresh and how long inactive data stays cached.
 *
 *    • refetchOnWindowFocus:
 *        When `false`, React Query will NOT automatically refetch data
 *        when the user switches back to the browser tab. This prevents
 *        unnecessary network calls during frequent tab switching.
 *
 *    • refetchOnReconnect:
 *        When `true`, React Query will automatically refetch data when
 *        the network connection is restored. Ensures up-to-date data after
 *        temporary disconnections.
 *
 *    • refetchOnMount:
 *        When `false`, React Query will not refetch data when the component
 *        mounts again — as long as the data is still “fresh.”
 *        Prevents redundant network requests during navigation.
 *
 *    • retry / retryDelay:
 *        Configure retry behavior using `QUERY_RETRY_CONFIG`. This handles
 *        temporary errors (e.g., network timeouts) gracefully with retries.
 *
 *    • refetchInterval:
 *        Enables background polling based on `QUERY_TIMINGS.REFETCH_INTERVAL`.
 *        Useful for “live” data views that must auto-refresh.
 *
 *    • keepPreviousData:
 *        Keeps the last successful data visible while new data is being fetched.
 *        Prevents UI flickering or empty states during updates or pagination.
 *
 *    • placeholderData:
 *        Optional placeholder (or skeleton) data shown while fetching.
 *        Useful for loading states or optimistic UI.
 *
 * -----------------------------------------------------------------------------
 *
 * 🔹 4. REFETCH_MODES
 *    Defines logical modes for how queries should refresh data:
 *
 *    • STATIC → Data loads once and remains static until manually refetched.
 *    • LIVE   → Data automatically refetches periodically using refetch intervals.
 *    • CUSTOM → Allows per-query overrides for more granular refetch behavior.
 *
 * -----------------------------------------------------------------------------
 */

import {keepPreviousData} from '@tanstack/react-query';

import {ErrorResponse} from '@/shared/interfaces/common';
import {DefaultQueryOptions} from '@/shared/interfaces/hooks';

export const QUERY_TIMINGS = {
  STALE_TIME: 5 * 60 * 1000,
  STALE_TIME_FOR_SERVER_SIDE_QUERY_CLIENT: 60 * 1000,
  GC_TIME: 30 * 60 * 1000, // never pass this as 0 to avoid immediate garbage collection it will never maintain cache
  MAX_RETRY_DELAY: 30000,
  REFETCH_INTERVAL: 30 * 60 * 1000,
} as const;

export const QUERY_RETRY_CONFIG = {
  ATTEMPTS: (failureCount: number, error: ErrorResponse) => {
    if (error.statusCode === 401) return false;
    if (failureCount < 2) return true;

    return false;
  },
  DELAY_FUNCTION: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, QUERY_TIMINGS.MAX_RETRY_DELAY),
} as const;

export const DEFAULT_QUERY_OPTIONS: DefaultQueryOptions<any> = {
  staleTime: QUERY_TIMINGS.STALE_TIME,
  gcTime: QUERY_TIMINGS.GC_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  refetchOnMount: 'always',
  retry: QUERY_RETRY_CONFIG.ATTEMPTS,
  retryDelay: QUERY_RETRY_CONFIG.DELAY_FUNCTION,
  refetchInterval: QUERY_TIMINGS.REFETCH_INTERVAL,
  placeholderData: keepPreviousData,
};

/**
 * How a query that reads a whole list walks the server's pages: the page size
 * it asks for, and the page it stops at so one broken list cannot turn into an
 * endless run of requests.
 */
export const ALL_PAGES_QUERY = {
  PAGE_SIZE: 100,
  MAX_PAGES: 10,
  KEY_SUFFIX: 'allPages',
} as const;

export const INFINITE_LIST_QUERY = {
  KEY_SUFFIX: 'infinite',
  FIRST_PAGE: 1,
} as const;

export const REFETCH_MODES = {
  STATIC: 'static',
  LIVE: 'live',
} as const;

export const APP_ENVIRONMENTS = {
  development: {
    value: 'development',
  },
  staging: {
    value: 'staging',
  },
  production: {
    value: 'production',
  },
};
