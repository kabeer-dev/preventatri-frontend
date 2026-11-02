'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import useTranslation from '@/shared/hooks/useTranslation';

const ResolveSubmitFooter = ({disabled = false}: {disabled?: boolean}) => {
  const {t} = useTranslation();

  return (
    <Box sx={{p: 4.5}}>
      <Button
        type='submit'
        variant='contained'
        fullWidth
        disabled={disabled}
        startIcon={<Icon icon='mdi:check-circle-outline' fontSize={20} />}
        sx={{
          py: 3,
          borderRadius: `${radius.md}px`,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {t('flag.actionTaken.resolveButton')}
      </Button>
      <Typography
        variant='small'
        component='p'
        sx={{m: 0, mt: 2, textAlign: 'center', color: 'customColors.inkFaint'}}
      >
        {t('flag.actionTaken.requirements')}
      </Typography>
    </Box>
  );
};

export default ResolveSubmitFooter;
