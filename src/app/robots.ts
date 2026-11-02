import type {MetadataRoute} from 'next';
import {headers} from 'next/headers';

import {getBaseUrl} from '@/shared/utils/general';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production';

  const headersList = headers() as unknown as Headers;

  return {
    rules: {
      userAgent: '*',
      allow: isProduction ? '/' : '',
      disallow: isProduction ? ['/dashboard/'] : ['/'],
    },
    sitemap: isProduction
      ? `${getBaseUrl({headersList})}/sitemap.xml`
      : undefined,
  };
}
