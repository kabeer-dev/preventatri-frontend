'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import PageHeading from '@/shared/components/common/headers/PageHeading';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  RunnerAnswers,
  RunnerQuestion,
} from '@/shared/interfaces/caregiverChecklistRunner';
import ProgressSegments from '@/views/pages/caregiverChecklist/ProgressSegments';

interface Props {
  crumb: string;
  title: string;
  questions: RunnerQuestion[];
  answers: RunnerAnswers;
  currentIndex: number;
  answeredCount: number;
  onJump: ({questionId}: {questionId: string}) => void;
  onSaveAndExit: () => void;
}

/**
 * The checklist route has no entry in the heading map, so the runner writes its
 * own crumb, title and progress into the shell's top bar. On the phone there is
 * no app bar to write into and both slots render nothing.
 */
const RunnerTopBar = ({
  crumb,
  title,
  questions,
  answers,
  currentIndex,
  answeredCount,
  onJump,
  onSaveAndExit,
}: Props) => {
  const {t} = useTranslation();

  return (
    <>
      <TopBarSlot side='left'>
        <Box
          sx={{display: 'flex', alignItems: 'center', gap: 3.5, minWidth: 0}}
        >
          <Button
            onClick={onSaveAndExit}
            startIcon={<Icon icon='mdi:close' fontSize={16} />}
            sx={{flex: 'none', color: 'text.secondary', fontWeight: 600}}
          >
            {t('caregiverChecklist.saveAndExit')}
          </Button>

          <Box
            sx={{
              flex: 'none',
              width: '1px',
              height: 22,
              backgroundColor: 'divider',
            }}
          />

          <PageHeading crumb={crumb} title={title} />
        </Box>
      </TopBarSlot>

      <TopBarSlot side='right'>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 3}}>
          <Typography
            sx={{fontSize: '0.78125rem', color: 'text.secondary', flex: 'none'}}
          >
            {t('caregiverChecklist.progress.answered', {
              answered: answeredCount,
              total: questions.length,
            })}
          </Typography>

          <ProgressSegments
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            onJump={onJump}
            jumpLabel={t('caregiverChecklist.progress.jump')}
          />
        </Box>
      </TopBarSlot>
    </>
  );
};

export default RunnerTopBar;
