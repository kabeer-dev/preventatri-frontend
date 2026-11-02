'use client';

import Typography from '@mui/material/Typography';

import appConfig from '@/configs/appConfig';
import useTranslation from '@/shared/hooks/useTranslation';
import {AuthComplianceTextProps} from '@/shared/interfaces/auth';

const MS_PER_MINUTE = 60 * 1000;

export default function AuthComplianceText({
  className,
  sx,
}: AuthComplianceTextProps) {
  const {t} = useTranslation();

  const idleTimeoutMinutes = Math.round(
    appConfig.sessionIdleTimeoutMs / MS_PER_MINUTE
  );

  return (
    <Typography variant='small' className={className} sx={sx}>
      {t('auth.brandPanel.compliance', {minutes: idleTimeoutMinutes})}
    </Typography>
  );
}
