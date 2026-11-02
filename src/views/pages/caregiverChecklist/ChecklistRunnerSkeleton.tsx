'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import {controlHeight, layout} from '@/@core/theme/spacing';
import SkeletonStatus from '@/shared/components/common/skeletons/SkeletonStatus';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {CAREGIVER_RUNNER} from '@/shared/constants/caregiver';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import RunnerFullBleed from '@/views/pages/caregiverChecklist/RunnerFullBleed';
import RunnerQuestionSkeleton from '@/views/pages/caregiverChecklist/RunnerQuestionSkeleton';

const RAIL_ROWS = 6;
const FACT_ROWS = 4;

/** Mirrors PhoneRunner and DesktopRunner so the page does not jump on load. */
const ChecklistRunnerSkeleton = () => {
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return (
      <Box
        aria-busy='true'
        sx={{width: '100%', maxWidth: layout.formMaxWidth, mx: 'auto'}}
      >
        <SkeletonStatus />

        <Box
          sx={{display: 'flex', alignItems: 'center', gap: 2, minHeight: 48}}
        >
          <Skeleton variant='circular' width={48} height={48} />

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Skeleton width={90} height={16} />
            <Skeleton width={40} height={14} />
          </Box>

          <Box sx={{width: 48}} />
        </Box>

        <Box
          sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
        >
          <Skeleton width={260} height={3} sx={{my: 2, transform: 'none'}} />
          <Skeleton width={220} height={14} sx={{mt: 1}} />
        </Box>

        <RunnerQuestionSkeleton isPhone />

        <Box sx={{height: controlHeight.xl + 32}} />
      </Box>
    );
  }

  return (
    <>
      <TopBarSlot side='left'>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 3.5}}>
          <Skeleton variant='rounded' width={64} height={30} />
          <Box sx={{width: '1px', height: 22, backgroundColor: 'divider'}} />
          <Box>
            <Skeleton width={110} height={16} />
            <Skeleton width={180} height={26} />
          </Box>
        </Box>
      </TopBarSlot>

      <TopBarSlot side='right'>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 3}}>
          <Skeleton width={90} height={16} />
          <Skeleton width={200} height={3} sx={{transform: 'none'}} />
        </Box>
      </TopBarSlot>

      <RunnerFullBleed
        sx={{
          display: 'grid',
          gridTemplateColumns: `${CAREGIVER_RUNNER.railWidth}px minmax(0, 1fr) ${CAREGIVER_RUNNER.contextWidth}px`,
        }}
      >
        <SkeletonStatus />

        <Box
          aria-busy='true'
          sx={{
            borderRight: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'customColors.surfaceRaised',
            px: 3,
            py: 4.5,
          }}
        >
          <Skeleton width={120} height={14} sx={{mx: 1, mb: 2}} />

          {Array.from({length: RAIL_ROWS}, (_, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
                px: 3,
                py: 2.5,
              }}
            >
              <Skeleton variant='circular' width={14} height={14} />
              <Skeleton sx={{flex: 1}} height={18} />
            </Box>
          ))}
        </Box>

        <Box sx={{px: 14, py: 11}}>
          <RunnerQuestionSkeleton isPhone={false} />
        </Box>

        <Box sx={{borderLeft: '1px solid', borderColor: 'divider', p: 5.5}}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 3}}>
            <Skeleton variant='circular' width={44} height={44} />
            <Box sx={{flex: 1}}>
              <Skeleton width='70%' height={20} />
              <Skeleton width='50%' height={14} />
            </Box>
          </Box>

          <Box sx={{mt: 4.5}}>
            {Array.from({length: FACT_ROWS}, (_, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Skeleton width={70} height={16} />
                <Skeleton width={90} height={16} />
              </Box>
            ))}
          </Box>
        </Box>
      </RunnerFullBleed>
    </>
  );
};

export default ChecklistRunnerSkeleton;
