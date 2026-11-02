'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {alpha, useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import AlertAgeClock from '@/shared/components/common/alertReview/AlertAgeClock';
import SlaClock from '@/shared/components/common/alertReview/SlaClock';
import {
  ALERT_REVIEW_OVERLINE_SX,
  ALERT_REVIEW_PILL_SX,
  ALERT_REVIEW_SIZES,
} from '@/shared/constants/alertReview';
import {DETAIL_IDENTITY_SEPARATOR} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaseReviewHeaderProps} from '@/shared/interfaces/alertReview';

const CaseReviewHeader = ({
  tone,
  titleId,
  patientName,
  reason,
  identityParts,
  expiresAt,
  openedAt,
  onExit,
}: CaseReviewHeaderProps) => {
  const {t} = useTranslation();
  const {palette} = useTheme();

  const {shell, shellRaised, shellActive, shellText, shellMuted} =
    palette.customColors;

  return (
    <Box
      component='header'
      sx={{
        flex: 'none',
        background: `radial-gradient(55% 160% at 0% 0%, ${alpha(
          tone.bar,
          0.22
        )} 0%, ${alpha(tone.bar, 0)} 70%), ${shell}`,
        borderBottom: '1px solid',
        borderColor: shellRaised,
      }}
    >
      <Box
        sx={{
          maxWidth: ALERT_REVIEW_SIZES.contentMaxWidth,
          mx: 'auto',
          px: {xs: 3.5, md: 6.5},
          pt: 4.5,
          pb: 4,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: 4,
          rowGap: 3,
        }}
      >
        <Box
          component='span'
          sx={{
            ...ALERT_REVIEW_OVERLINE_SX,
            fontSize: 10.5,
            flex: 'none',
            px: 2.75,
            py: 1.25,
            borderRadius: ALERT_REVIEW_PILL_SX.borderRadius,
            backgroundColor: shellActive,
            color: 'primary.light',
          }}
        >
          {t('flag.caseDetailsModal.eyebrow')}
        </Box>

        <Box sx={{flex: '1 1 420px', minWidth: 0}}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              columnGap: 2.5,
              rowGap: 2,
            }}
          >
            <Typography
              id={titleId}
              component='h2'
              sx={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'common.white',
              }}
            >
              {patientName}
            </Typography>
            <Box
              component='span'
              sx={{
                ...ALERT_REVIEW_PILL_SX,
                color: tone.onDark,
                backgroundColor: alpha(tone.bar, 0.24),
                boxShadow: `inset 0 0 0 1px ${alpha(tone.bar, 0.45)}`,
              }}
            >
              <Icon icon={tone.glyph} fontSize='1.1em' aria-hidden />
              {t(tone.labelKey)}
            </Box>
            <Box
              component='span'
              sx={{
                ...ALERT_REVIEW_PILL_SX,
                color: shellText,
                backgroundColor: shellRaised,
              }}
            >
              {t('flag.caseDetailsModal.active')}
            </Box>
          </Box>

          <Typography
            variant='small'
            component='p'
            sx={{m: 0, mt: 1, color: shellMuted}}
          >
            <Box component='span' sx={{color: shellText, fontWeight: 600}}>
              {reason}
            </Box>
            {identityParts.map((part) => `${DETAIL_IDENTITY_SEPARATOR}${part}`)}
          </Typography>
        </Box>

        {(openedAt || expiresAt || onExit) && (
          <Box
            sx={{
              ml: {sm: 'auto'},
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 4.5,
              rowGap: 3,
              flex: 'none',
              maxWidth: '100%',
            }}
          >
            {openedAt && (
              <AlertAgeClock
                since={openedAt}
                color={tone.onDark}
                labelColor={shellMuted}
              />
            )}
            {expiresAt && (
              <SlaClock expiresAt={expiresAt} color={tone.onDark} />
            )}
            {onExit && (
              <Button
                variant='outlined'
                onClick={onExit}
                sx={{
                  borderColor: shellActive,
                  color: shellText,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: shellMuted,
                    backgroundColor: shellRaised,
                    color: 'common.white',
                  },
                }}
              >
                {t('flag.caseDetailsModal.exit')}
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CaseReviewHeader;
