'use client';

import {Icon} from '@iconify/react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {useFieldArray} from 'react-hook-form';

import {CHECKLIST_BUILDER_ICONS} from '@/shared/constants/checklistBuilder';
import useTranslation from '@/shared/hooks/useTranslation';
import {BuilderListProps} from '@/shared/interfaces/checklistBuilder';
import {createEmptySection} from '@/shared/utils/checklistBuilderUtils';

import BuilderSectionCard from './BuilderSectionCard';

const BuilderSectionList = ({control, templateType}: BuilderListProps) => {
  const {t} = useTranslation();

  const {fields, append, remove, move} = useFieldArray({
    control,
    name: 'sections',
  });

  return (
    <Stack spacing={4}>
      {fields.map((field, sectionIndex) => (
        <BuilderSectionCard
          key={field.id}
          control={control}
          templateType={templateType}
          sectionIndex={sectionIndex}
          sectionCount={fields.length}
          onMove={({from, to}) => move(from, to)}
          onRemove={() => remove(sectionIndex)}
        />
      ))}

      <Button
        variant='outlined'
        sx={{borderStyle: 'dashed', py: 3}}
        startIcon={<Icon icon={CHECKLIST_BUILDER_ICONS.add} />}
        onClick={() => append(createEmptySection())}
      >
        {t('assessmentChecklists.builder.actions.addSection')}
      </Button>
    </Stack>
  );
};

export default BuilderSectionList;
