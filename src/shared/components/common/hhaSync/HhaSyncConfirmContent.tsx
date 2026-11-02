'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {CONFIRM_DIALOG_IDS} from '@/shared/constants/common';
import {HHA_SYNC_CONFIRM_SECTIONS} from '@/shared/constants/hhaSync';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncConfirmSection} from '@/shared/interfaces/hhaSync';

import HhaSyncConfirmSectionCard from './HhaSyncConfirmSectionCard';

/**
 * Body of the Sync confirmation dialog. Carries the dialog's
 * `aria-describedby` target, which ConfirmationModal only sets itself on the
 * plain-string branch.
 */
const HhaSyncConfirmContent = () => {
  const {t} = useTranslation();

  return (
    <Box id={CONFIRM_DIALOG_IDS.DESCRIPTION}>
      <Typography color='text.secondary' className='mb-5'>
        {t('hhaSync.confirm.intro')}
      </Typography>

      <Stack spacing={4}>
        {HHA_SYNC_CONFIRM_SECTIONS.map((section: HhaSyncConfirmSection) => (
          <HhaSyncConfirmSectionCard key={section.titleKey} section={section} />
        ))}
      </Stack>
    </Box>
  );
};

export default HhaSyncConfirmContent;
