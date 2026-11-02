'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {useWatch} from 'react-hook-form';

import RHFSelectField from '@/shared/components/common/inputs/RHFSelectField';
import RHFSwitchField from '@/shared/components/common/inputs/RHFSwitchField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {CHECKLIST_BUILDER_ICONS} from '@/shared/constants/checklistBuilder';
import useTranslation from '@/shared/hooks/useTranslation';
import {CHECKLIST_FIELD_TYPES} from '@/shared/interfaces/assessmentChecklistDetails';
import {BuilderQuestionEditorProps} from '@/shared/interfaces/checklistBuilder';
import {ChecklistBuilderFormValues} from '@/shared/types/checklistBuilder';
import {
  getQuestionNumber,
  isChoiceQuestion,
} from '@/shared/utils/checklistBuilderUtils';
import BuilderOptionList from '@/views/pages/assessmentChecklists/ChecklistBuilder/options/BuilderOptionList';

const BuilderQuestionEditor = ({
  control,
  templateType,
  sectionIndex,
  questionIndex,
  onDone,
  onRemove,
}: BuilderQuestionEditorProps) => {
  const {t} = useTranslation();
  const name = `sections.${sectionIndex}.questions.${questionIndex}` as const;
  const questionType = useWatch({control, name: `${name}.type`});

  const typeOptions = Object.values(CHECKLIST_FIELD_TYPES).map((type) => ({
    value: type,
    label: t(`assessmentChecklists.questionTypes.${type}`),
  }));

  return (
    <Box
      sx={{
        px: 4,
        py: 3,
        borderBottom: 1,
        borderColor: 'divider',
        borderLeft: 3,
        borderLeftColor: 'primary.main',
      }}
    >
      <Box className='mb-3 flex items-center justify-between'>
        <Typography variant='overline' sx={{color: 'primary.main'}}>
          {t('assessmentChecklists.builder.editingItem', {
            item: getQuestionNumber({sectionIndex, questionIndex}),
          })}
        </Typography>
        <IconButton
          size='small'
          color='error'
          aria-label={t('assessmentChecklists.builder.actions.remove')}
          onClick={onRemove}
        >
          <Icon icon={CHECKLIST_BUILDER_ICONS.delete} fontSize={18} />
        </IconButton>
      </Box>

      <Box className='flex flex-col gap-3'>
        <RHFTextField<ChecklistBuilderFormValues>
          name={`${name}.title`}
          control={control}
          label={t('assessmentChecklists.builder.fields.question')}
          fullWidth
        />

        <Box className='flex flex-wrap items-end gap-4'>
          <Box sx={{minWidth: 220}}>
            <RHFSelectField<ChecklistBuilderFormValues>
              name={`${name}.type`}
              control={control}
              label={t('assessmentChecklists.builder.fields.answerType')}
              options={typeOptions}
              size='small'
            />
          </Box>
          <RHFSwitchField<ChecklistBuilderFormValues>
            name={`${name}.required`}
            control={control}
            label={t('assessmentChecklists.builder.required')}
          />
        </Box>

        {isChoiceQuestion({type: questionType}) && (
          <BuilderOptionList
            control={control}
            templateType={templateType}
            sectionIndex={sectionIndex}
            questionIndex={questionIndex}
          />
        )}

        <Box>
          <Button variant='contained' size='small' onClick={onDone}>
            {t('assessmentChecklists.builder.actions.done')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BuilderQuestionEditor;
