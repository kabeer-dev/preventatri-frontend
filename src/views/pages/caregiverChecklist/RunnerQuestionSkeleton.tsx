'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import {radius} from '@/@core/theme/spacing';
import {CAREGIVER_RUNNER} from '@/shared/constants/caregiver';

const OPTION_COUNT = 3;

const roundedSx = {borderRadius: `${radius.md}px`};

/** QuestionBody's shape: label, title, option rows, comment field. */
const RunnerQuestionSkeleton = ({isPhone}: {isPhone: boolean}) => (
  <>
    <Skeleton width={140} height={14} sx={{mt: isPhone ? 6 : 0}} />
    <Skeleton width='85%' height={isPhone ? 40 : 44} sx={{mt: 2.5}} />

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        mt: isPhone ? 6 : 7.5,
      }}
    >
      {Array.from({length: OPTION_COUNT}, (_, index) => (
        <Skeleton
          key={index}
          variant='rounded'
          height={isPhone ? 80 : CAREGIVER_RUNNER.optionRowHeight}
          sx={roundedSx}
        />
      ))}
    </Box>

    <Box sx={{mt: isPhone ? 5 : 8.5}}>
      <Skeleton variant='rounded' height={56} sx={roundedSx} />
      <Skeleton width={300} height={14} sx={{mt: 2.5}} />
    </Box>
  </>
);

export default RunnerQuestionSkeleton;
