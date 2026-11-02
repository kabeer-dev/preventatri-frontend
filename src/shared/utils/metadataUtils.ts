import {Metadata} from 'next';

import {BRANDING} from '@/shared/constants/general';

import translationUtilsValues from './translationsUtils';

export const getMetadataDetails = async (input?: {
  pageName?: string;
}): Promise<Metadata> => {
  const {pageName = 'mainPageTitle'} = input || {};

  const {t} = await translationUtilsValues();

  const {websiteName, websiteDescription, faviconPath, faviconSvgPath} =
    await BRANDING();

  return {
    title: `${
      pageName !== 'mainPageTitle'
        ? `${t(`${pageName}.title`)} - ${websiteName} Dashboard`
        : websiteName
    }`,
    description:
      pageName !== 'mainPageTitle'
        ? t(`${pageName}.description`)
        : websiteDescription,
    icons: {
      icon: [
        {url: faviconSvgPath, type: 'image/svg+xml'},
        {url: faviconPath, type: 'image/png'},
      ],
    },
  };
};
