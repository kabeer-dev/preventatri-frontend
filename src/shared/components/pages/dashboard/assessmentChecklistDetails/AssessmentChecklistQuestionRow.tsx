'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import SeverityIndicator from '@/shared/components/common/severity';
import useTranslation from '@/shared/hooks/useTranslation';
import {AssessmentChecklistQuestionRowProps} from '@/shared/interfaces/assessmentChecklistDetails';
import {getOptionLabel} from '@/shared/utils/assessmentChecklistUtils';

const AssessmentChecklistQuestionRow = ({
  question,
  number,
  showFlags,
}: AssessmentChecklistQuestionRowProps) => {
  const {t} = useTranslation();

  return (
    <Box sx={{px: 4, py: 2.5, borderBottom: 1, borderColor: 'divider'}}>
      <Box className='flex items-center gap-3'>
        <Typography
          variant='body2'
          sx={{color: 'text.secondary', minWidth: 32}}
        >
          {number}
        </Typography>
        <Typography variant='body2' sx={{flex: 1, fontWeight: 500}}>
          {question.title}
        </Typography>
        <CustomChip
          skin='light'
          size='small'
          label={t(`assessmentChecklists.questionTypes.${question.type}`)}
        />
        <Typography
          variant='caption'
          sx={{color: 'text.secondary', minWidth: 56}}
        >
          {t(
            question.required
              ? 'assessmentChecklists.detail.required'
              : 'assessmentChecklists.detail.optional'
          )}
        </Typography>
      </Box>

      {question.options.length > 0 && (
        <Box className='mt-2 flex flex-wrap items-center gap-2' sx={{pl: 11}}>
          {question.options.map((option, optionIndex) => {
            const title = getOptionLabel({item: option});
            const flag = typeof option === 'string' ? null : option.flag;

            return (
              <Box
                key={`${optionIndex}-${title}`}
                className='flex items-center gap-1.5'
              >
                <Typography variant='body2' sx={{color: 'text.secondary'}}>
                  {title}
                </Typography>
                {showFlags && flag && (
                  <SeverityIndicator
                    flag={flag}
                    label={t(`assessmentChecklists.flags.${flag}`)}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default AssessmentChecklistQuestionRow;
