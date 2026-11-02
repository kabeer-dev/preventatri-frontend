import Box from '@mui/material/Box';

import Container from '@/shared/components/common/container';
import FullWidthContainer from '@/shared/components/common/container/FullWidthContainer';
import Link from '@/shared/components/common/localeLink';
import {AUTH_ROUTES} from '@/shared/constants/paths';
import translationUtilsValues from '@/shared/utils/translationsUtils';

export default async function Home() {
  /* Fetch translations server-side using the locale from params. Keeping this logic server-side helps ensure the component remains a server component rather than being converted to a client component.
  If you later implement the useTranslation() hook (which runs on the client) the component would be automatically transformed into a client component.
  To maintain server-side execution, we extract the translation function (t) during the server-side render, passing the locale as the parameter*/
  const {t} = await translationUtilsValues();

  return (
    <FullWidthContainer className='flex-center'>
      <Container>
        <Box className='flex flex-col'>
          {t('home.message')}
          <Link href={AUTH_ROUTES.login()}>{t('auth.login')}</Link>
        </Box>
      </Container>
    </FullWidthContainer>
  );
}
