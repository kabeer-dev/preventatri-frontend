'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import useTranslation from '@/shared/hooks/useTranslation';
import {CHECKLIST_FIELD_TYPES} from '@/shared/interfaces/assessmentChecklistDetails';
import {parseMultiSelectValue} from '@/shared/utils/assessmentChecklistUtils';

import {ChecklistAnswer, ChecklistQuestion} from './types';

interface ChecklistSubmittedResponseItemProps {
  index: number;
  question: ChecklistQuestion;
  answer?: ChecklistAnswer;
  hideSection?: boolean;
}

const ChecklistSubmittedResponseItem = ({
  index,
  question,
  answer,
  hideSection = false,
}: ChecklistSubmittedResponseItemProps) => {
  const {t: _t} = useTranslation();

  const isMultiSelect = question.type === CHECKLIST_FIELD_TYPES.MULTI_SELECT;

  const multiSelectValues =
    isMultiSelect && answer?.selectedOption
      ? parseMultiSelectValue({value: answer.selectedOption})
      : [];

  const displayValue =
    !answer?.selectedOption || isMultiSelect ? 'N/A' : answer.selectedOption;

  return (
    <Box className='flex' sx={{gap: 2.5}}>
      {/* Number */}
      <Typography
        variant='body2'
        className='font-semibold min-w-6 pt-0.5'
        sx={{color: 'text.disabled'}}
      >
        {index + 1}.
      </Typography>

      {/* Content */}
      <Box className='flex-1 min-w-0'>
        <Typography variant='body1' sx={{fontWeight: 600, mb: 0.25}}>
          {question.title}
        </Typography>
        {!hideSection && (
          <Typography
            variant='caption'
            className='block mb-3'
            sx={{color: 'text.disabled'}}
          >
            {question.sectionLabel}
          </Typography>
        )}
        {hideSection && <Box className='mb-2' />}

        {/* Answer */}
        {isMultiSelect && multiSelectValues.length > 0 ? (
          <Box className='flex flex-col' sx={{gap: 1}}>
            {multiSelectValues.map((val) => (
              <Box key={val} className='flex items-center' sx={{gap: 1}}>
                <Icon
                  icon='mdi:check-circle'
                  color='var(--mui-palette-success-main)'
                  fontSize='1.1rem'
                />
                <Typography variant='body2' sx={{fontWeight: 500}}>
                  {val}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Box className='flex items-center' sx={{gap: 1}}>
            <Icon
              icon='mdi:check-circle'
              color='var(--mui-palette-success-main)'
              fontSize='1.1rem'
            />
            <Typography variant='body2' sx={{fontWeight: 500}}>
              {displayValue}
            </Typography>
          </Box>
        )}

        {/* Comment */}
        {answer?.comment && (
          <Box
            sx={{
              mt: 1.5,
              pl: 2,
              borderLeft: '2px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant='caption'
              sx={{color: 'text.secondary', lineHeight: 1.6}}
            >
              {answer.comment}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChecklistSubmittedResponseItem;
