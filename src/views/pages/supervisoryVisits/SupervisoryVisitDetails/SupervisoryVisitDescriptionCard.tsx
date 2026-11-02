'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import useTranslation from '@/shared/hooks/useTranslation';
import {SupervisoryVisitCardProps} from '@/shared/interfaces/supervisoryVisit';
import {getVisitTypeLabel} from '@/shared/utils/supervisoryVisitUtils';
import {getPersonName} from '@/shared/utils/workItemUtils';

// Why the visit was scheduled and by whom.
const SupervisoryVisitDescriptionCard = ({
  visit,
}: SupervisoryVisitCardProps) => {
  const {t} = useTranslation();

  return (
    <Card elevation={6}>
      <CardContent className='px-3 py-6 md:px-4'>
        <Typography variant='h6' className='mb-1 font-bold'>
          {t('supervisoryVisits.detail.description')}
        </Typography>
        <Typography
          variant='small'
          sx={{display: 'block', mb: 3, color: 'text.secondary'}}
        >
          {t('supervisoryVisits.detail.scheduledBy', {
            type: getVisitTypeLabel({visit, t}),
            name: getPersonName({person: visit.createdByUser}),
          })}
        </Typography>

        <Typography
          variant='body2'
          className='whitespace-pre-wrap'
          sx={{color: visit.description ? 'text.primary' : 'text.disabled'}}
        >
          {visit.description || t('supervisoryVisits.detail.noDescription')}
        </Typography>

        {visit.checklistTemplate && (
          <Box className='mt-4 rounded p-3' sx={{bgcolor: 'action.hover'}}>
            <Typography variant='small' sx={{color: 'text.secondary'}}>
              {t('supervisoryVisits.detail.templateInUse', {
                title: visit.checklistTemplate.title,
                count: visit.checklistTemplate.sections.length,
              })}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SupervisoryVisitDescriptionCard;
