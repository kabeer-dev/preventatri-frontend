'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {controlHeight, layout, radius} from '@/@core/theme/spacing';
import PinnedAction from '@/shared/components/caregiver/PinnedAction';
import useTranslation from '@/shared/hooks/useTranslation';
import {RunnerViewProps} from '@/shared/interfaces/caregiverChecklistRunner';
import ProgressSegments from '@/views/pages/caregiverChecklist/ProgressSegments';
import QuestionBody from '@/views/pages/caregiverChecklist/QuestionBody';
import {getPrimaryActionLabel} from '@/views/pages/caregiverChecklist/utils';

/** One question per screen, C04 to C07: the phone shape of the runner. */
const PhoneRunner = ({runner, patientName, onSaveAndExit}: RunnerViewProps) => {
  const {t} = useTranslation();

  const {
    questions,
    currentIndex,
    currentQuestion,
    answers,
    isEditingFromSummary,
  } = runner;

  if (!currentQuestion) return null;

  return (
    <Box sx={{width: '100%', maxWidth: layout.formMaxWidth, mx: 'auto'}}>
      <Box sx={{display: 'flex', alignItems: 'center', gap: 2, minHeight: 48}}>
        <IconButton
          aria-label={t('caregiverChecklist.saveAndExit')}
          onClick={onSaveAndExit}
          sx={{color: 'text.secondary', width: 48, height: 48}}
        >
          <Icon icon='mdi:close' fontSize={22} />
        </IconButton>

        <Box sx={{flex: 1, minWidth: 0, textAlign: 'center'}}>
          <Typography
            noWrap
            sx={{
              fontSize: '0.78125rem',
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            {currentQuestion.sectionTitle}
          </Typography>
          <Typography
            noWrap
            sx={{fontSize: '0.71875rem', color: 'customColors.inkFaint'}}
          >
            {t('caregiverChecklist.progress.position', {
              current: currentIndex + 1,
              total: questions.length,
            })}
          </Typography>
        </Box>

        <Box sx={{width: 48}} />
      </Box>

      <ProgressSegments
        questions={questions}
        answers={answers}
        currentIndex={currentIndex}
        onJump={runner.goTo}
        isCentered
        jumpLabel={t('caregiverChecklist.progress.jump')}
      />

      <Typography
        sx={{
          fontSize: '0.71875rem',
          color: 'customColors.inkFaint',
          pt: 1,
          textAlign: 'center',
        }}
      >
        {t('caregiverChecklist.progress.hint')}
      </Typography>

      <QuestionBody runner={runner} isPhone label={patientName} />

      <PinnedAction
        label={getPrimaryActionLabel({runner, t})}
        onClick={runner.next}
        secondary={
          currentIndex > 0 && !isEditingFromSummary ? (
            <Button
              variant='outlined'
              onClick={runner.previous}
              sx={{
                flex: 'none',
                minHeight: controlHeight.xl,
                borderRadius: `${radius.md}px`,
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {t('commonContent.previous')}
            </Button>
          ) : undefined
        }
      />
    </Box>
  );
};

export default PhoneRunner;
