'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {alpha} from '@mui/material/styles';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import RemainingFlagsBanner from '@/shared/components/common/modals/RemainingFlagsBanner';
import {ACTIVE_FLAG_MODAL_SIZES} from '@/shared/constants/flag';
import useTranslation from '@/shared/hooks/useTranslation';
import {ActiveFlagFooterProps} from '@/shared/interfaces/flag';

const ActiveFlagFooter = ({
  accent,
  remainingFlags,
  onOpenCaseDetails,
  onDismiss,
  onAccept,
  isAccepting = false,
}: ActiveFlagFooterProps) => {
  const {t} = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        flexShrink: 0,
        gap: 3,
        columnGap: 4,
        px: 5,
        py: 3.5,
        backgroundColor: 'customColors.surfaceRaised',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      {remainingFlags > 0 && (
        <RemainingFlagsBanner
          count={remainingFlags}
          accentColor={accent.color}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          ml: 'auto',
          width: {xs: '100%', sm: 'auto'},
          '& > .MuiButton-root': {flex: {xs: 1, sm: 'none'}},
        }}
      >
        {onDismiss && (
          <Button variant='outlined' color='secondary' onClick={onDismiss}>
            {t('flag.activeModal.dismiss')}
          </Button>
        )}
        {onAccept && (
          <Button
            variant='outlined'
            color={accent.color}
            onClick={onAccept}
            disabled={isAccepting}
            startIcon={<Icon icon='mdi:account-check-outline' fontSize={18} />}
            sx={{
              height: ACTIVE_FLAG_MODAL_SIZES.primaryActionHeight,
              borderRadius: `${radius.sm}px`,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {isAccepting
              ? t('flag.activeModal.accepting')
              : t('flag.activeModal.accept')}
          </Button>
        )}
        <Button
          variant='contained'
          color={accent.color}
          onClick={onOpenCaseDetails}
          endIcon={<Icon icon='mdi:arrow-right' fontSize={18} />}
          sx={{
            height: ACTIVE_FLAG_MODAL_SIZES.primaryActionHeight,
            px: 5.5,
            borderRadius: `${radius.sm}px`,
            fontSize: 15,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: `0 8px 18px -8px ${alpha(accent.edge, 0.7)}`,
          }}
        >
          {t('flag.activeModal.openCaseDetails')}
        </Button>
      </Box>
    </Box>
  );
};

export default ActiveFlagFooter;
