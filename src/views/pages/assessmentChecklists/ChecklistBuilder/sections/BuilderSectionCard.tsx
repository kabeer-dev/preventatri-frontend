'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import {useWatch} from 'react-hook-form';

import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import useTranslation from '@/shared/hooks/useTranslation';
import {BuilderSectionCardProps} from '@/shared/interfaces/checklistBuilder';
import {ChecklistBuilderFormValues} from '@/shared/types/checklistBuilder';
import {getSectionNumber} from '@/shared/utils/checklistBuilderUtils';
import BuilderRowActions from '@/views/pages/assessmentChecklists/ChecklistBuilder/BuilderRowActions';
import BuilderQuestionList from '@/views/pages/assessmentChecklists/ChecklistBuilder/questions/BuilderQuestionList';

const BuilderSectionCard = ({
  control,
  templateType,
  sectionIndex,
  sectionCount,
  onMove,
  onRemove,
}: BuilderSectionCardProps) => {
  const {t} = useTranslation();

  const questions = useWatch({
    control,
    name: `sections.${sectionIndex}.questions`,
  });

  return (
    <Card>
      <Box className='flex items-center gap-3' sx={{px: 4, py: 3}}>
        <Typography
          variant='body2'
          sx={{color: 'text.secondary', minWidth: 24}}
        >
          {getSectionNumber({sectionIndex})}
        </Typography>

        <Box sx={{flex: 1}}>
          <RHFTextField<ChecklistBuilderFormValues>
            name={`sections.${sectionIndex}.title`}
            control={control}
            placeholder={t('assessmentChecklists.builder.fields.sectionTitle')}
            size='small'
            fullWidth
          />
        </Box>

        <Typography
          noWrap
          variant='body2'
          sx={{color: 'text.secondary', minWidth: 64}}
        >
          {t('assessmentChecklists.builder.itemCount', {
            count: questions?.length ?? 0,
          })}
        </Typography>

        <BuilderRowActions
          index={sectionIndex}
          count={sectionCount}
          onMove={onMove}
          onRemove={onRemove}
        />
      </Box>

      <Divider />

      <BuilderQuestionList
        control={control}
        templateType={templateType}
        sectionIndex={sectionIndex}
      />
    </Card>
  );
};

export default BuilderSectionCard;
