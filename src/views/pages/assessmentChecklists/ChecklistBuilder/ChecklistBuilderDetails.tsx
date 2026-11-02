'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';

import RHFTextField from '@/shared/components/common/inputs/RHFTextField';
import useTranslation from '@/shared/hooks/useTranslation';
import {ChecklistBuilderDetailsProps} from '@/shared/interfaces/checklistBuilder';
import {ChecklistBuilderFormValues} from '@/shared/types/checklistBuilder';

// Name and description stay editable for as long as the checklist is a draft.
const ChecklistBuilderDetails = ({control}: ChecklistBuilderDetailsProps) => {
  const {t} = useTranslation();

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <RHFTextField<ChecklistBuilderFormValues>
            name='title'
            control={control}
            label={t('assessmentChecklists.builder.fields.name')}
            required
            fullWidth
          />
          <RHFTextField<ChecklistBuilderFormValues>
            name='description'
            control={control}
            label={t('assessmentChecklists.builder.fields.description')}
            multiline
            minRows={2}
            fullWidth
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChecklistBuilderDetails;
