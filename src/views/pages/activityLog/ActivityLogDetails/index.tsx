'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import DetailFactsCard from '@/shared/components/common/DetailFactsCard';
import DialogCloseButton from '@/shared/components/common/modals/DialogCloseButton';
import useTranslation from '@/shared/hooks/useTranslation';
import {AuditLogEntry} from '@/shared/interfaces/activityLog';
import {
  getAuditLogActionColor,
  getAuditLogActionLabel,
} from '@/shared/utils/activityLogUtils';
import {formatDate} from '@/shared/utils/dateUtils';

import ChangeRow from './ChangeRow';
import RelatedRecordCard from './RelatedRecordCard';

interface ActivityLogDetailsProps {
  log: AuditLogEntry;
  onClose: () => void;
}

const ActivityLogDetails = ({log, onClose}: ActivityLogDetailsProps) => {
  const {t} = useTranslation();

  const actionLabel = getAuditLogActionLabel({action: log.action, t});

  const {bg: actionBg, fg: actionFg} = getAuditLogActionColor({
    action: log.action,
  });

  const actorFacts = [
    {label: t('activityLog.detail.actor'), value: log.actor.name},
    {label: t('activityLog.detail.role'), value: log.actor.role},
    {
      label: t('activityLog.detail.region'),
      value: log.actor.region
        ? `${log.actor.region.name} · ${log.actor.region.county}`
        : null,
    },
    {label: t('activityLog.detail.ipAddress'), value: log.origin.ipAddress},
    {label: t('activityLog.detail.device'), value: log.origin.device},
    {label: t('activityLog.detail.origin'), value: log.origin.type},
  ].filter((fact) => Boolean(fact.value));

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5, p: 3}}>
      <Card>
        <CardContent className='flex flex-col gap-2'>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <CustomChip
              size='small'
              color='default'
              label={actionLabel}
              sx={{backgroundColor: actionBg, color: actionFg}}
            />
            <DialogCloseButton onClick={onClose} />
          </Box>

          <Typography variant='body2'>{log.description}</Typography>

          <Typography variant='small' sx={{color: 'text.secondary'}}>
            {formatDate({
              date: log.timestamp,
              format: 'EEE dd LLL yyyy · HH:mm:ss ZZZZ',
            })}
          </Typography>
        </CardContent>
      </Card>

      {log.whatChanged.length > 0 && (
        <Card>
          <CardContent className='flex flex-col gap-1'>
            <Typography
              variant='eyebrow'
              component='h2'
              sx={{color: 'text.secondary', mb: 1}}
            >
              {t('activityLog.detail.whatChanged')}
            </Typography>

            {log.whatChanged.map((change, index) => (
              <ChangeRow key={`${change.type}-${index}`} {...change} />
            ))}
          </CardContent>
        </Card>
      )}

      <DetailFactsCard
        title={t('activityLog.detail.actorAndOrigin')}
        facts={actorFacts}
        inline
      />

      {!!log.relatedRecords?.length && (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <Typography
            variant='eyebrow'
            component='h2'
            sx={{color: 'text.secondary'}}
          >
            {t('activityLog.detail.relatedRecords')}
          </Typography>

          {log.relatedRecords.map((record) => (
            <RelatedRecordCard key={record.id} {...record} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ActivityLogDetails;
