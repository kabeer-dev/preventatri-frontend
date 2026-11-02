'use client';

import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import {Controller} from 'react-hook-form';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import {CHECKLIST_TEMPLATE_TYPES} from '@/shared/constants/assessmentChecklists';
import {CHECKLIST_TYPE_LABEL_ID} from '@/shared/constants/checklistBuilder';
import useTranslation from '@/shared/hooks/useTranslation';
import {ChecklistTypeSelectorProps} from '@/shared/interfaces/checklistBuilder';

const ChecklistTypeSelector = ({
  control,
  disabled,
  onTypeChange,
}: ChecklistTypeSelectorProps) => {
  const {t} = useTranslation();

  return (
    <Controller
      name='type'
      control={control}
      render={({field, fieldState: {error}}) => (
        <Box className='flex flex-col'>
          <FieldLabel id={CHECKLIST_TYPE_LABEL_ID}>
            {t('assessmentChecklists.create.type')}
            <Typography component='span' variant='caption' sx={{ml: 1}}>
              {t('assessmentChecklists.create.typePermanent')}
            </Typography>
          </FieldLabel>

          <RadioGroup
            aria-labelledby={CHECKLIST_TYPE_LABEL_ID}
            value={field.value}
            onChange={(event) => {
              field.onChange(event.target.value);
              onTypeChange();
            }}
            className='flex flex-col gap-2'
          >
            {Object.values(CHECKLIST_TEMPLATE_TYPES).map((type) => {
              const isSelected = field.value === type.value;

              return (
                <Box
                  key={type.value}
                  component='label'
                  className='flex cursor-pointer items-start gap-2'
                  sx={{
                    p: 3,
                    border: 1,
                    borderRadius: 1,
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    backgroundColor: isSelected
                      ? 'action.selected'
                      : 'transparent',
                  }}
                >
                  <Radio value={type.value} disabled={disabled} size='small' />
                  <Box>
                    <Typography variant='body2' sx={{fontWeight: 600}}>
                      {t(type.labelKey)}
                    </Typography>
                    <Typography
                      variant='caption'
                      sx={{color: 'text.secondary'}}
                    >
                      {t(type.hintKey)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </RadioGroup>

          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  );
};

export default ChecklistTypeSelector;
