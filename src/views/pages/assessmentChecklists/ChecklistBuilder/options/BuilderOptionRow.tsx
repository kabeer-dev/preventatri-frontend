'use client';

import Box from '@mui/material/Box';

import RHFSelectField from '@/shared/components/common/inputs/RHFSelectField';
import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import {CHECKLIST_OPTION_FLAGS} from '@/shared/constants/assessmentChecklists';
import useTranslation from '@/shared/hooks/useTranslation';
import {BuilderOptionRowProps} from '@/shared/interfaces/checklistBuilder';
import {ChecklistBuilderFormValues} from '@/shared/types/checklistBuilder';
import {isPatientChecklist} from '@/shared/utils/checklistBuilderUtils';
import BuilderRowActions from '@/views/pages/assessmentChecklists/ChecklistBuilder/BuilderRowActions';

const BuilderOptionRow = ({
  control,
  templateType,
  sectionIndex,
  questionIndex,
  optionIndex,
  optionCount,
  onMove,
  onRemove,
}: BuilderOptionRowProps) => {
  const {t} = useTranslation();

  const name =
    `sections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}` as const;

  const flagOptions = CHECKLIST_OPTION_FLAGS.map((flag) => ({
    value: flag,
    label: t(`assessmentChecklists.flags.${flag}`),
  }));

  return (
    <Box className='flex items-center gap-3'>
      <Box sx={{flex: 1}}>
        <RHFTextField<ChecklistBuilderFormValues>
          name={`${name}.title`}
          control={control}
          placeholder={t('assessmentChecklists.builder.fields.answer')}
          size='small'
          fullWidth
        />
      </Box>

      {/* No visible label: it would push the select below the answer field. */}
      {isPatientChecklist({type: templateType}) && (
        <Box sx={{width: 150}}>
          <RHFSelectField<ChecklistBuilderFormValues>
            name={`${name}.flag`}
            control={control}
            SelectDisplayProps={{
              'aria-label': t('assessmentChecklists.builder.fields.flag'),
            }}
            options={flagOptions}
            size='small'
            clearable
          />
        </Box>
      )}

      <BuilderRowActions
        index={optionIndex}
        count={optionCount}
        onMove={onMove}
        onRemove={onRemove}
      />
    </Box>
  );
};

export default BuilderOptionRow;
