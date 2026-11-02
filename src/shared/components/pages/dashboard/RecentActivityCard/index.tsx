'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import {getInitials} from '@/@core/utils/userUtils';
import PanelCard from '@/shared/components/common/cards/PanelCard';
import SkeletonCard from '@/shared/components/common/skeletons/SkeletonCard';
import {DATE_FORMATS} from '@/shared/constants/common';
import {RECENT_ACTIVITY} from '@/shared/constants/dashboard';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import useTranslation from '@/shared/hooks/useTranslation';
import {activityLogQueries} from '@/shared/reactQuery';
import {
  getAuditLogActionColor,
  groupAuditLogsByDay,
} from '@/shared/utils/activityLogUtils';
import {formatDate} from '@/shared/utils/dateUtils';

const RecentActivityCard = () => {
  const {t} = useTranslation();
  const {useFetchActivityLogList} = activityLogQueries();

  const {data, isLoading} = useFetchActivityLogList({
    params: {limit: RECENT_ACTIVITY.previewLimit, page: 1, ...SUB_ROUTE_PARAMS},
  });

  const auditLogs = data?.auditLogs ?? [];

  const groups = groupAuditLogsByDay({auditLogs});
  const isEmpty = !isLoading && auditLogs.length === 0;

  return (
    <PanelCard
      title={t('dashboard.recentActivity.title')}
      actionLabel={t('dashboard.recentActivity.action')}
      actionHref={DASHBOARD_ROUTES.activityLog.all()}
      bodyPadding={4.5}
    >
      {isLoading && (
        <SkeletonCard
          surface='plain'
          rows={RECENT_ACTIVITY.previewLimit}
          row={{leading: 'circle', leadingSize: RECENT_ACTIVITY.nodeSize}}
        />
      )}

      {isEmpty && (
        <Typography variant='small' sx={{color: 'text.secondary'}}>
          {t('dashboard.recentActivity.empty')}
        </Typography>
      )}

      {groups.map((group) => (
        <Box key={group.day}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 2.25, pb: 2.5}}>
            <Typography variant='eyebrow'>{group.day}</Typography>
            <Box
              sx={{
                flex: '1 1 auto',
                height: '1px',
                bgcolor: 'customColors.rule',
              }}
            />
            <Typography variant='small' sx={{color: 'text.disabled'}}>
              {group.items.length}
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'relative',
              pl: `${RECENT_ACTIVITY.railOffset}px`,
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              pb: 2,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: `${(RECENT_ACTIVITY.nodeSize - RECENT_ACTIVITY.railWidth) / 2}px`,
                top: '4px',
                bottom: '8px',
                width: `${RECENT_ACTIVITY.railWidth}px`,
                bgcolor: 'customColors.ruleStrong',
              }}
            />

            {group.items.map((log) => {
              const {bg, fg} = getAuditLogActionColor({action: log.action});

              return (
                <Box
                  key={log.id}
                  sx={{position: 'relative', display: 'flex', gap: 2.5}}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `-${RECENT_ACTIVITY.railOffset}px`,
                      top: 0,
                      width: RECENT_ACTIVITY.nodeSize,
                      height: RECENT_ACTIVITY.nodeSize,
                      borderRadius: `${radius.full}px`,
                      display: 'grid',
                      placeItems: 'center',
                      flex: 'none',
                      boxSizing: 'border-box',
                      border: '2px solid',
                      borderColor: 'background.paper',
                      bgcolor: bg,
                      color: fg,
                    }}
                  >
                    <Icon icon='mdi:information-outline' fontSize={13} />
                  </Box>

                  <Box sx={{minWidth: 0, flex: '1 1 auto'}}>
                    <Typography variant='small' component='p'>
                      <Box component='span' sx={{fontWeight: 700}}>
                        {log.resourceLabel}
                      </Box>
                      {log.description ? ` – ${log.description}` : ''}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.75,
                        mt: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 19,
                          height: 19,
                          borderRadius: `${radius.full}px`,
                          display: 'grid',
                          placeItems: 'center',
                          flex: 'none',
                          fontSize: '9px',
                          fontWeight: 700,
                          bgcolor: 'customColors.brandTint',
                          color: 'primary.main',
                        }}
                      >
                        {getInitials({name: log.actor.name})}
                      </Box>
                      <Typography
                        variant='small'
                        sx={{color: 'text.secondary'}}
                      >
                        {log.actor.name}
                      </Typography>
                      <Typography variant='mono' sx={{color: 'text.disabled'}}>
                        {formatDate({
                          date: log.timestamp,
                          format: DATE_FORMATS.time,
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </PanelCard>
  );
};

export default RecentActivityCard;
