import {
  Trans,
  useTranslation as useI18Translation,
  UseTranslationResponse,
} from 'react-i18next';

import {i18nNamespaces} from '@/i18nConfig';

type TranslationConstant = string | ((args: {t: (key: any) => any}) => any);

const useTranslation = () => {
  const useI18TranslationObj: UseTranslationResponse<string[], undefined> =
    useI18Translation(i18nNamespaces);

  const {t, ...rest} = useI18TranslationObj;

  const ct = ({constant}: {constant: TranslationConstant}) => {
    return typeof constant === 'function' ? constant({t}) : constant;
  };

  /*
   If you want to write HTML inside translation locales then we can use Trans component

   For example

   let local is like this

     {
     "dashboard": {
       "message": "<strong>Welcome to dashboard {{name}}</strong>"
     }
   }
   
    Then in component we can use like this

    <Typography variant='body1'>
        <Trans i18nKey='dashboard.message' values={{name: 'Test'}} />
      </Typography>

  */

  return {
    t,
    ct,
    Trans,
    ...rest,
  };
};

export default useTranslation;
