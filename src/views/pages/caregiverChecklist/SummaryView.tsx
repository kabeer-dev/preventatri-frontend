'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {controlHeight, layout, radius} from '@/@core/theme/spacing';
import PinnedAction from '@/shared/components/caregiver/PinnedAction';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useTranslation from '@/shared/hooks/useTranslation';
import {RunnerViewProps} from '@/shared/interfaces/caregiverChecklistRunner';
import {
  formatAnswerValue,
  isAnswerEmpty,
  isQuestionSatisfied,
} from '@/shared/utils/assessmentChecklistUtils';
import RunnerFullBleed from '@/views/pages/caregiverChecklist/RunnerFullBleed';
import RunnerTopBar from '@/views/pages/caregiverChecklist/RunnerTopBar';
import useRunnerKeyboard from '@/views/pages/caregiverChecklist/useRunnerKeyboard';
import {groupQuestionsBySection} from '@/views/pages/caregiverChecklist/utils';

/** C10 and W03: every answer in one list, each row a way back to its question. */
const SummaryView = ({
  runner,
  patientName,
  checklistName,
  isSubmitting,
  onSaveAndExit,
  submitLabel,
}: RunnerViewProps) => {
  const {t} = useTranslation();

  const isDesktop = useIsDesktop();

  // Cmd or Ctrl with Enter sends from here, the same key that walked her in.
  useRunnerKeyboard({runner, isEnabled: isDesktop});

  const {questions, answers} = runner;

  const missing = questions.filter(
    (question) =>
      !isQuestionSatisfied({question, value: answers[question.id]?.value})
  );

  const groups = groupQuestionsBySection({questions});

  const submitButton = (
    <Button
      variant='contained'
      onClick={runner.submit}
      loading={isSubmitting}
      disabled={missing.length > 0}
      sx={{
        minHeight: controlHeight.xl,
        px: 6,
        borderRadius: `${radius.md}px`,
        fontSize: '0.90625rem',
        fontWeight: 700,
      }}
    >
      {submitLabel ?? t('caregiverChecklist.summary.submit')}
    </Button>
  );

  const answerList = (
    <>
      <Typography sx={{fontSize: '0.90625rem', color: 'text.secondary'}}>
        {t('caregiverChecklist.summary.subtitle')}
      </Typography>

      {groups.map((group) => (
        <Box key={group.sectionIndex}>
          <Typography
            variant='eyebrow'
            component='h2'
            sx={{color: 'text.disabled', px: 1, pt: 5.5, pb: 2}}
          >
            {group.title}
          </Typography>

          {group.items.map((question) => {
            const answer = answers[question.id];

            const isMissing = !isQuestionSatisfied({
              question,
              value: answer?.value,
            });

            const isEmpty = isAnswerEmpty({question, value: answer?.value});

            const photoCount = answer?.attachments.length || 0;

            return (
              <Box
                key={question.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  px: 4,
                  py: 3.25,
                  minHeight: 56,
                  borderTop: '1px solid',
                  borderColor: 'customColors.ruleStrong',
                  '&:hover': {backgroundColor: 'action.hover'},
                }}
              >
                <Box sx={{flex: 1, minWidth: 0}}>
                  <Typography
                    sx={{fontSize: '0.8125rem', color: 'text.secondary'}}
                  >
                    {question.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      mt: 0.5,
                      color: isMissing
                        ? 'error.main'
                        : isEmpty
                          ? 'text.disabled'
                          : 'text.primary',
                    }}
                  >
                    {isEmpty
                      ? t('caregiverChecklist.summary.notAnswered')
                      : formatAnswerValue({
                          value: answer?.value,
                          type: question.type,
                          options: question.options,
                          t,
                        })}
                  </Typography>

                  {answer?.comment && (
                    <Typography
                      sx={{
                        fontSize: '0.78125rem',
                        color: 'text.secondary',
                        mt: 0.75,
                      }}
                    >
                      {`“${answer.comment}”`}
                    </Typography>
                  )}

                  {photoCount > 0 && (
                    <Typography
                      sx={{
                        fontSize: '0.78125rem',
                        color: 'text.secondary',
                        mt: 0.75,
                      }}
                    >
                      {t('caregiverChecklist.summary.photos', {
                        count: photoCount,
                      })}
                    </Typography>
                  )}
                </Box>

                <Button
                  onClick={() =>
                    runner.editFromSummary({questionId: question.id})
                  }
                  sx={{flex: 'none', fontSize: '0.78125rem', fontWeight: 600}}
                >
                  {t('caregiverChecklist.summary.change')}
                </Button>
              </Box>
            );
          })}
        </Box>
      ))}

      {missing.length > 0 && (
        <Typography sx={{fontSize: '0.8125rem', color: 'error.main', pt: 4}}>
          {t('caregiverChecklist.summary.blocked', {count: missing.length})}
        </Typography>
      )}
    </>
  );

  const topBar = (
    <RunnerTopBar
      crumb={`${patientName} · ${checklistName}`}
      title={t('caregiverChecklist.summary.heading')}
      questions={questions}
      answers={answers}
      currentIndex={runner.currentIndex}
      answeredCount={runner.answeredCount}
      onJump={runner.goTo}
      onSaveAndExit={onSaveAndExit}
    />
  );

  if (isDesktop) {
    return (
      <>
        {topBar}

        <RunnerFullBleed sx={{display: 'flex', flexDirection: 'column'}}>
          <Box sx={{flex: 1, minHeight: 0, overflowY: 'auto', px: 6, py: 8}}>
            <Box sx={{maxWidth: layout.formMaxWidth, mx: 'auto'}}>
              {answerList}
            </Box>
          </Box>

          <Box
            sx={{
              flex: 'none',
              px: 6,
              py: 5,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                maxWidth: layout.formMaxWidth,
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Button
                variant='outlined'
                onClick={runner.backToQuestions}
                sx={{borderRadius: `${radius.md}px`, fontWeight: 600}}
              >
                {t('caregiverChecklist.summary.backToQuestions')}
              </Button>

              <Box sx={{ml: 'auto'}}>{submitButton}</Box>
            </Box>
          </Box>
        </RunnerFullBleed>
      </>
    );
  }

  return (
    <Box sx={{maxWidth: layout.formMaxWidth}}>
      {answerList}

      <Typography
        sx={{
          fontSize: '0.75rem',
          color: 'customColors.inkFaint',
          textAlign: 'center',
          pt: 4,
        }}
      >
        {t('caregiverChecklist.summary.noEdit')}
      </Typography>

      <PinnedAction
        label={submitLabel ?? t('caregiverChecklist.summary.submitPhone')}
        onClick={runner.submit}
        isLoading={isSubmitting}
        isDisabled={missing.length > 0}
        secondary={
          <Button
            variant='outlined'
            onClick={runner.backToQuestions}
            startIcon={<Icon icon='mdi:chevron-left' fontSize={18} />}
            sx={{
              flex: 'none',
              minHeight: controlHeight.xl,
              px: 3.5,
              borderRadius: `${radius.md}px`,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {t('caregiverChecklist.summary.backToQuestionsPhone')}
          </Button>
        }
      />
    </Box>
  );
};

export default SummaryView;
