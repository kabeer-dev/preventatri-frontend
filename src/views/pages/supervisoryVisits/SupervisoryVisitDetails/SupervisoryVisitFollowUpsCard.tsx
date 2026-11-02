'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ConfigChip from '@/shared/components/common/chips/ConfigChip';
import Link from '@/shared/components/common/localeLink';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {SupervisoryVisitFollowUpsCardProps} from '@/shared/interfaces/supervisoryVisit';
import {
  formatDueDate,
  getAssigneeName,
  getStatusConfig,
} from '@/shared/utils/followUpUtils';

// The follow-up tasks this visit spawned; new ones are added from the top bar.
const SupervisoryVisitFollowUpsCard = ({
  visit,
}: SupervisoryVisitFollowUpsCardProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const tasks = visit.followUpTasks || [];

  return (
    <Card elevation={6}>
      <CardContent className='p-4'>
        <Typography
          variant='caption'
          className='mb-3 block font-bold uppercase'
          sx={{color: 'text.secondary', letterSpacing: 0.6}}
        >
          {t('supervisoryVisits.detail.followUps')}
        </Typography>

        {tasks.length === 0 ? (
          <Typography variant='body2' sx={{color: 'text.disabled'}}>
            {t('supervisoryVisits.detail.followUpsEmpty')}
          </Typography>
        ) : (
          <Stack spacing={2}>
            {tasks.map((task) => (
              <Box
                key={task.id}
                component={Link}
                href={DASHBOARD_ROUTES.followUps.single({id: task.id})}
                className='block rounded p-3'
                sx={{
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                  textDecoration: 'none',
                }}
              >
                <Box className='flex items-start justify-between gap-2'>
                  <Typography variant='bodyStrong' className='min-w-0'>
                    {task.title}
                  </Typography>
                  <ConfigChip
                    config={getStatusConfig({status: task.status})}
                    fallbackLabel={task.status}
                  />
                </Box>
                <Typography
                  variant='small'
                  sx={{display: 'block', mt: 0.5, color: 'text.secondary'}}
                >
                  {[
                    getAssigneeName({assignee: task.assignee}),
                    t('supervisoryVisits.detail.dueOn', {
                      date: formatDueDate({dueAt: task.dueAt, zone}),
                    }),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default SupervisoryVisitFollowUpsCard;
