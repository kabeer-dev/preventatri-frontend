'use client';

import Typography from '@mui/material/Typography';

import ElapsedTimer from '@/shared/components/common/timers/ElapsedTimer';
import {DETAIL_EMPTY_VALUE} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {AlertAgeTimerProps} from '@/shared/interfaces/timers';
import {
  formatShortDuration,
  getRelativeTimeFromIso,
  secondsBetweenIso,
} from '@/shared/utils/dateUtils';
import {
  isAcceptedFlagStatus,
  isResolvedFlagStatus,
  isUnresolvedFlagStatus,
} from '@/shared/utils/redFlagUtils';

// Open alerts tick live until someone accepts them; accepted ones stop at
// how long that took. Resolved ones are green: how long they took when the
// API sends resolvedAt, the static "3 hours ago" when it does not.
const AlertAgeTimer = ({
  createdAt,
  status,
  resolvedAt,
  acceptedAt,
  sx,
  ...typographyProps
}: AlertAgeTimerProps) => {
  const {t} = useTranslation();

  if (!createdAt)
    return (
      <Typography sx={sx} {...typographyProps}>
        {DETAIL_EMPTY_VALUE}
      </Typography>
    );

  if (isAcceptedFlagStatus({status}) && acceptedAt)
    return (
      <Typography
        {...typographyProps}
        sx={[...(Array.isArray(sx) ? sx : [sx]), {color: 'info.main'}]}
      >
        {t('alertReview.timing.acceptedInDuration', {
          duration: formatShortDuration({
            seconds: secondsBetweenIso({from: createdAt, to: acceptedAt}),
          }),
        })}
      </Typography>
    );

  if (isUnresolvedFlagStatus({status}))
    return <ElapsedTimer since={createdAt} sx={sx} {...typographyProps} />;

  if (isResolvedFlagStatus({status}))
    return (
      <Typography
        {...typographyProps}
        sx={[
          ...(Array.isArray(sx) ? sx : [sx]),
          {color: 'customColors.severityStableFg'},
        ]}
      >
        {resolvedAt
          ? t('alertReview.timing.resolvedInDuration', {
              duration: formatShortDuration({
                seconds: secondsBetweenIso({from: createdAt, to: resolvedAt}),
              }),
            })
          : getRelativeTimeFromIso({value: createdAt})}
      </Typography>
    );

  return (
    <Typography sx={sx} {...typographyProps}>
      {getRelativeTimeFromIso({value: createdAt})}
    </Typography>
  );
};

export default AlertAgeTimer;
