'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import {CHECKLIST_USAGE_ROWS} from '@/shared/constants/assessmentChecklists';
import useTranslation from '@/shared/hooks/useTranslation';
import {AssessmentChecklistUsagePanelProps} from '@/shared/interfaces/assessmentChecklistDetails';
import {formatRelativeTime} from '@/shared/utils/formatRelativeTime';

const AssessmentChecklistUsagePanel = ({
  usage,
  type,
}: AssessmentChecklistUsagePanelProps) => {
  const {t} = useTranslation();

  const formatValue = ({field}: {field: keyof typeof usage}) => {
    const value = usage[field];

    if (field === 'lastActivityAt')
      return value
        ? formatRelativeTime({dateString: String(value)})
        : t('assessmentChecklists.usage.never');

    return Number(value ?? 0).toLocaleString();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant='overline' sx={{color: 'text.secondary'}}>
          {t('assessmentChecklists.usage.title')}
        </Typography>

        {CHECKLIST_USAGE_ROWS[type].map(({field, labelKey}) => (
          <Box
            key={field}
            className='flex items-center justify-between'
            sx={{py: 1.5, borderBottom: 1, borderColor: 'divider'}}
          >
            <Typography variant='body2' sx={{color: 'text.secondary'}}>
              {t(labelKey)}
            </Typography>
            <Typography variant='body2' sx={{fontWeight: 600}}>
              {formatValue({field})}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default AssessmentChecklistUsagePanel;
