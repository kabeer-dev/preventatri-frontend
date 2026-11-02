'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import useTranslation from '@/shared/hooks/useTranslation';
import {StructurePanelProps} from '@/shared/interfaces/checklistBuilder';
import {isPatientChecklist} from '@/shared/utils/checklistBuilderUtils';

const StructurePanel = ({stats, templateType}: StructurePanelProps) => {
  const {t} = useTranslation();

  const rows = [
    {labelKey: 'sections', value: stats.sections},
    {labelKey: 'items', value: stats.items},
    {labelKey: 'requiredItems', value: stats.requiredItems},
  ];

  // Only patient checklists raise flags from their answers.
  const flagRows = isPatientChecklist({type: templateType})
    ? [
        {labelKey: 'canRaiseRed', value: stats.canRaiseRed},
        {labelKey: 'canRaiseYellow', value: stats.canRaiseYellow},
      ]
    : [];

  return (
    <Card>
      <CardContent>
        <Typography variant='overline' sx={{color: 'text.secondary'}}>
          {t('assessmentChecklists.builder.structure.title')}
        </Typography>

        {rows.concat(flagRows).map(({labelKey, value}) => (
          <Box
            key={labelKey}
            className='flex items-center justify-between'
            sx={{py: 1.5, borderBottom: 1, borderColor: 'divider'}}
          >
            <Typography variant='body2' sx={{color: 'text.secondary'}}>
              {t(`assessmentChecklists.builder.structure.${labelKey}`)}
            </Typography>
            <Typography variant='body2' sx={{fontWeight: 600}}>
              {value}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default StructurePanel;
