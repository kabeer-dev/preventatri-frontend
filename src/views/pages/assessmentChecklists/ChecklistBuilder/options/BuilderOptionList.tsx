'use client';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useFieldArray} from 'react-hook-form';

import {CHECKLIST_BUILDER_ICONS} from '@/shared/constants/checklistBuilder';
import useTranslation from '@/shared/hooks/useTranslation';
import {BuilderQuestionProps} from '@/shared/interfaces/checklistBuilder';
import {
  createEmptyOption,
  isPatientChecklist,
} from '@/shared/utils/checklistBuilderUtils';

import BuilderOptionRow from './BuilderOptionRow';

const BuilderOptionList = ({
  control,
  templateType,
  sectionIndex,
  questionIndex,
}: BuilderQuestionProps) => {
  const {t} = useTranslation();

  const {fields, append, remove, move} = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions.${questionIndex}.options`,
  });

  return (
    <Box className='flex flex-col gap-2'>
      <Typography variant='body2' sx={{color: 'text.secondary'}}>
        {t(
          isPatientChecklist({type: templateType})
            ? 'assessmentChecklists.builder.answersWithFlags'
            : 'assessmentChecklists.builder.answers'
        )}
      </Typography>

      {fields.map((field, optionIndex) => (
        <BuilderOptionRow
          key={field.id}
          control={control}
          templateType={templateType}
          sectionIndex={sectionIndex}
          questionIndex={questionIndex}
          optionIndex={optionIndex}
          optionCount={fields.length}
          onMove={({from, to}) => move(from, to)}
          onRemove={() => remove(optionIndex)}
        />
      ))}

      <Box>
        <Button
          size='small'
          startIcon={<Icon icon={CHECKLIST_BUILDER_ICONS.add} />}
          onClick={() => append(createEmptyOption())}
        >
          {t('assessmentChecklists.builder.actions.addAnswer')}
        </Button>
      </Box>
    </Box>
  );
};

export default BuilderOptionList;
