'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import PanelCard from '@/shared/components/common/cards/PanelCard';
import SeverityIndicator from '@/shared/components/common/severity';
import SkeletonCard from '@/shared/components/common/skeletons/SkeletonCard';
import AlertAgeTimer from '@/shared/components/common/timers/AlertAgeTimer';
import {ALERT_QUEUE} from '@/shared/constants/dashboard';
import {RED_FLAG_STATUS_PRESENTATION} from '@/shared/constants/flag';
import {WIDGET_SKELETONS} from '@/shared/constants/pageSkeletons';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {SEVERITY_LEVELS} from '@/shared/constants/severity';
import useAlertQueue from '@/shared/hooks/useAlertQueue';
import useTranslation from '@/shared/hooks/useTranslation';
import {getSeverityFromFlag} from '@/shared/utils/severity';

const AlertQueueCard = () => {
  const {t} = useTranslation();
  const {alerts, isLoading} = useAlertQueue({});

  const isEmpty = !isLoading && alerts.length === 0;

  return (
    <PanelCard
      title={t('dashboard.alertQueue.title')}
      subtitle={t('dashboard.alertQueue.subtitle')}
      icon={<Icon icon={SEVERITY_LEVELS.critical.glyph} fontSize={18} />}
      iconColor='customColors.severityCriticalFg'
      iconBackground='customColors.severityCriticalBg'
      actionLabel={t('dashboard.alertQueue.action')}
      actionHref={DASHBOARD_ROUTES.emergencyFlags.all()}
      bodyPadding={0}
    >
      {isLoading && (
        <SkeletonCard
          surface='plain'
          header='none'
          rows={ALERT_QUEUE.previewLimit}
          divided
          row={{
            leading: 'circle',
            leadingSize: WIDGET_SKELETONS.alertQueue.indicatorSize,
            trailing: 'text',
            sx: {px: ALERT_QUEUE.rowPaddingX, py: ALERT_QUEUE.rowPaddingY},
          }}
        />
      )}

      {isEmpty && (
        <Typography
          variant='small'
          sx={{color: 'text.secondary', display: 'block', p: 4.5}}
        >
          {t('dashboard.alertQueue.empty')}
        </Typography>
      )}

      {alerts.map((alert) => {
        const level = getSeverityFromFlag({flag: alert.flag});

        const statusKey =
          RED_FLAG_STATUS_PRESENTATION[
            alert.status as keyof typeof RED_FLAG_STATUS_PRESENTATION
          ]?.titleKey;

        return (
          <Box
            key={alert.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              px: ALERT_QUEUE.rowPaddingX,
              py: ALERT_QUEUE.rowPaddingY,
              borderBottom: '1px solid',
              borderColor: 'customColors.rule',
              '&:last-of-type': {borderBottom: 'none'},
            }}
          >
            <SeverityIndicator flag={alert.flag} />

            <Box sx={{minWidth: 0}}>
              <Typography variant='bodyStrong' noWrap>
                {alert.patientName}
              </Typography>
              <Typography
                variant='small'
                noWrap
                sx={{color: 'text.disabled', display: 'block'}}
              >
                {alert.caregiverName}
              </Typography>
            </Box>

            <Box sx={{ml: 'auto', textAlign: 'right', flex: 'none'}}>
              <AlertAgeTimer
                createdAt={alert.createdAt}
                status={alert.status}
                resolvedAt={alert.resolvedAt}
                acceptedAt={alert.acceptedAt}
                variant='mono'
                sx={{
                  display: 'block',
                  color: level
                    ? `customColors.${SEVERITY_LEVELS[level].fg}`
                    : 'text.primary',
                }}
              />
              <Typography variant='small' sx={{color: 'text.disabled'}}>
                {statusKey ? t(statusKey) : alert.status}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </PanelCard>
  );
};

export default AlertQueueCard;
