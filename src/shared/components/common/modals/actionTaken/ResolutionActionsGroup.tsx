'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Controller} from 'react-hook-form';

import ResolutionActionOption from '@/shared/components/common/alertReview/ResolutionActionOption';
import {ACTION_TAKEN_CHECKBOXES} from '@/shared/constants/flag';
import useTranslation from '@/shared/hooks/useTranslation';
import {ResolutionActionsGroupProps} from '@/shared/interfaces/flag';

// "What did you do?" — the action checkboxes plus the group-level error,
// which the schema pins to the first action field.
const ResolutionActionsGroup = ({
  control,
  disabled = false,
  errorMessage,
}: ResolutionActionsGroupProps) => {
  const {t} = useTranslation();

  return (
    <>
      <Box role='group' aria-label={t('flag.actionTaken.prompt')}>
        {ACTION_TAKEN_CHECKBOXES.map(({name, labelKey}) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({field}) => (
              <ResolutionActionOption
                label={t(labelKey)}
                checked={Boolean(field.value)}
                disabled={disabled}
                onChange={field.onChange}
              />
            )}
          />
        ))}
      </Box>

      {errorMessage && (
        <Typography
          color='error'
          variant='small'
          role='alert'
          sx={{display: 'block', px: 4.5, pt: 1.5}}
        >
          {errorMessage}
        </Typography>
      )}
    </>
  );
};

export default ResolutionActionsGroup;
