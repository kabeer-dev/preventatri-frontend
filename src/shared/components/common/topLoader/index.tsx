'use client';

import NextTopLoader from 'nextjs-toploader';

import {TOP_LOADER_COLOR} from '@/shared/constants/loader';

/**
 * Thin progress bar shown at the very top of the viewport during every
 * client-side route change. Rendered once at the app root so it covers every
 * navigation (links, router.push, and history back/forward) without any
 * per-page wiring. `nextjs-toploader` patches history + intercepts anchor
 * clicks internally, so it works with the app's custom `useLocaleRouter` and
 * `localeLink` as-is.
 */
const TopLoader = () => (
  <NextTopLoader
    color={TOP_LOADER_COLOR}
    height={3}
    showSpinner={false}
    shadow={`0 0 10px ${TOP_LOADER_COLOR}, 0 0 5px ${TOP_LOADER_COLOR}`}
    zIndex={2000}
  />
);

export default TopLoader;
