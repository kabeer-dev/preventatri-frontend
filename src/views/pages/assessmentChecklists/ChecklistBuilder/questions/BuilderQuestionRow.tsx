'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useFormState, useWatch} from 'react-hook-form';

import CustomChip from '@/@core/components/mui/chip';
import SeverityIndicator from '@/shared/components/common/severity';
import useTranslation from '@/shared/hooks/useTranslation';
import {BuilderQuestionRowProps} from '@/shared/interfaces/checklistBuilder';
import {
  getQuestionFlags,
  getQuestionNumber,
  isPatientChecklist,
} from '@/shared/utils/checklistBuilderUtils';
import BuilderRowActions from '@/views/pages/assessmentChecklists/ChecklistBuilder/BuilderRowActions';

const BuilderQuestionRow = ({
  control,
  templateType,
  sectionIndex,
  questionIndex,
  questionCount,
  onOpen,
  onMove,
  onRemove,
}: BuilderQuestionRowProps) => {
  const {t} = useTranslation();
  const name = `sections.${sectionIndex}.questions.${questionIndex}` as const;
  const question = useWatch({control, name});
  const {errors} = useFormState({control, name});

  const hasError = Boolean(
    errors.sections?.[sectionIndex]?.questions?.[questionIndex]
  );

  const flags = isPatientChecklist({type: templateType})
    ? getQuestionFlags({question})
    : [];

  return (
    <Box
      role='button'
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        // Keys pressed on the nested move/remove buttons bubble up here.
        if (event.target !== event.currentTarget) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onOpen();
      }}
      className='flex cursor-pointer items-center gap-3'
      sx={{
        px: 4,
        py: 2.5,
        borderBottom: 1,
        borderColor: 'divider',
        '&:hover': {backgroundColor: 'action.hover'},
      }}
    >
      <Typography variant='body2' sx={{color: 'text.secondary', minWidth: 32}}>
        {getQuestionNumber({sectionIndex, questionIndex})}
      </Typography>

      {/* Details sit under the text so chips never squeeze the question away. */}
      <Box className='flex flex-col gap-1.5' sx={{flex: 1, minWidth: 0}}>
        <Typography
          noWrap
          variant='body2'
          sx={{color: hasError ? 'error.main' : 'text.primary'}}
        >
          {question.title.trim() ||
            t('assessmentChecklists.builder.untitledItem')}
        </Typography>

        <Box className='flex flex-wrap items-center gap-2'>
          <CustomChip
            skin='light'
            size='small'
            label={t(`assessmentChecklists.questionTypes.${question.type}`)}
          />

          <Typography variant='caption' sx={{color: 'text.secondary'}}>
            {t(
              question.required
                ? 'assessmentChecklists.builder.required'
                : 'assessmentChecklists.builder.optional'
            )}
          </Typography>

          {flags.map((flag) => (
            <SeverityIndicator
              key={flag}
              flag={flag}
              label={t(`assessmentChecklists.flags.${flag}`)}
            />
          ))}
        </Box>
      </Box>

      <BuilderRowActions
        index={questionIndex}
        count={questionCount}
        onMove={onMove}
        onRemove={onRemove}
      />
    </Box>
  );
};

export default BuilderQuestionRow;
