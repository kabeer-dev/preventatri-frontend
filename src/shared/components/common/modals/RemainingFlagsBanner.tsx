'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {radius} from '@/@core/theme/spacing';
import typography from '@/@core/theme/typography';
import {ACTIVE_FLAG_MODAL_SIZES} from '@/shared/constants/flag';
import useTranslation from '@/shared/hooks/useTranslation';
import {RemainingFlagsBannerProps} from '@/shared/interfaces/flag';

// Footer hint shown when more flags are queued behind the current one, nudging
// the handler to resolve this case to reach the next.
const RemainingFlagsBanner = ({
  count,
  accentColor,
}: RemainingFlagsBannerProps) => {
  const {t} = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        minWidth: 0,
        flex: '1 1 200px',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          minWidth: ACTIVE_FLAG_MODAL_SIZES.queueBadgeMinWidth,
          height: ACTIVE_FLAG_MODAL_SIZES.queueBadgeHeight,
          px: 2,
          borderRadius: `${radius.full}px`,
          backgroundColor: `${accentColor}.main`,
          color: `${accentColor}.contrastText`,
          display: 'grid',
          placeItems: 'center',
          fontFamily: typography.mono.fontFamily,
          fontSize: 12.5,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {t('flag.activeModal.remainingFlagsBadge', {count})}
      </Box>
      <Box sx={{minWidth: 0}}>
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {t('flag.activeModal.remainingFlagsCount', {count})}
        </Typography>
        <Typography
          sx={{color: 'text.secondary', fontSize: 12, lineHeight: 1.35}}
        >
          {t('flag.activeModal.remainingFlagsHint')}
        </Typography>
      </Box>
    </Box>
  );
};

export default RemainingFlagsBanner;
