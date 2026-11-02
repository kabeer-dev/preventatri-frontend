'use client';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import Icon from '@/@core/components/icon';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpOverdueBannerProps} from '@/shared/interfaces/followUp';
import {formatDueDate} from '@/shared/utils/followUpUtils';

const FollowUpOverdueBanner = ({
  summary,
  onShowOverdue,
}: FollowUpOverdueBannerProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();

  return (
    <Alert
      severity='error'
      variant='outlined'
      icon={<Icon icon='mdi:alert' fontSize={18} />}
      action={
        onShowOverdue && (
          <Button color='error' size='small' onClick={onShowOverdue}>
            {t('followUps.banner.showOverdue')}
          </Button>
        )
      }
      sx={{alignItems: 'center', mb: 3}}
    >
      <strong>
        {t('followUps.banner.overdue', {
          count: summary.count,
          date: formatDueDate({dueAt: summary.oldestDueAt, zone}),
        })}
      </strong>{' '}
      {t('followUps.banner.escalation')}
    </Alert>
  );
};

export default FollowUpOverdueBanner;
