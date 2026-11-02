import translateFunction from '@/i18n';
import {i18nConfig} from '@/i18nConfig';

const getLocale = () => {
  if (typeof window === 'undefined') {
    const params = new URLSearchParams(globalThis.location?.search || '');

    return params.get('locale') || i18nConfig.defaultLocale;
  }

  return navigator.language || i18nConfig.defaultLocale;
};

type TranslationConstant = string | ((args: {t: (key: any) => any}) => any);

const ct = async ({constant}: {constant: TranslationConstant}) => {
  const locale = getLocale();
  const {t} = await translateFunction({locale});

  return typeof constant === 'function' ? constant({t}) : constant;
};

const translate = async () => {
  const locale = getLocale();

  return await translateFunction({locale});
};

const translationUtilsValues = async () => {
  const {t, ...rest} = await translate();

  return {ct, t, ...rest};
};

export default translationUtilsValues;
