'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import ConfigChip from '@/shared/components/common/chips/ConfigChip';
import Link from '@/shared/components/common/localeLink';
import {WorkItemSectionTitle} from '@/shared/components/common/WorkItemFact';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {FollowUpSourceVisitCardProps} from '@/shared/interfaces/followUp';
import {
  formatScheduleRange,
  getVisitStatusConfig,
  getVisitTypeLabel,
} from '@/shared/utils/supervisoryVisitUtils';

const FollowUpSourceVisitCard = ({visit}: FollowUpSourceVisitCardProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();

  return (
    <Card elevation={6}>
      <CardContent className='p-4'>
        <WorkItemSectionTitle>
          {t('followUps.detail.sourceVisit')}
        </WorkItemSectionTitle>

        <Box className='rounded p-3' sx={{bgcolor: 'action.hover'}}>
          <Box className='flex items-start justify-between gap-2'>
            <Typography variant='bodyStrong' className='min-w-0'>
              {getVisitTypeLabel({visit, t})}
            </Typography>
            <ConfigChip
              config={getVisitStatusConfig({status: visit.status})}
              fallbackLabel={visit.statusMeta?.label ?? visit.status}
            />
          </Box>
          <Typography
            variant='small'
            sx={{display: 'block', mt: 0.5, color: 'text.secondary'}}
          >
            {formatScheduleRange({visit, zone})}
          </Typography>
        </Box>

        {visit.canOpen && (
          <Typography
            component={Link}
            href={DASHBOARD_ROUTES.supervisoryVisits.single({id: visit.id})}
            variant='small'
            sx={{
              display: 'block',
              mt: 3,
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            {t('followUps.detail.openVisit')}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowUpSourceVisitCard;
