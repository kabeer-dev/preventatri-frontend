'use client';

import Box from '@mui/material/Box';
import {alpha} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import useTranslation from '@/shared/hooks/useTranslation';
import {AlertReasonStripProps} from '@/shared/interfaces/alertReview';

const AlertReasonStrip = ({
  tone,
  reason,
  label,
  note,
}: AlertReasonStripProps) => {
  const {t} = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 3,
        rowGap: 1,
        mx: 4.5,
        mb: 4,
        px: 3.5,
        py: 2.75,
        borderRadius: `${radius.sm}px`,
        border: '1px solid',
        borderColor: alpha(tone.bar, 0.3),
        backgroundColor: tone.tint,
        color: tone.ink,
      }}
    >
      <Typography variant='eyebrow' sx={{color: 'inherit', opacity: 0.8}}>
        {label ?? t('alertReview.evidence.alertReason')}
      </Typography>
      <Typography sx={{fontSize: 15, fontWeight: 700, color: 'inherit'}}>
        <Box
          component='span'
          aria-hidden
          sx={{mr: 1.5, display: 'inline-flex', verticalAlign: 'middle'}}
        >
          <Icon icon={tone.glyph} fontSize='1.1em' />
        </Box>
        {reason}
      </Typography>
      {note && (
        <Typography
          variant='small'
          sx={{ml: 'auto', fontWeight: 600, color: 'inherit'}}
        >
          {note}
        </Typography>
      )}
    </Box>
  );
};

export default AlertReasonStrip;
