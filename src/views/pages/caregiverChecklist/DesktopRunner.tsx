'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import {CAREGIVER_RUNNER} from '@/shared/constants/caregiver';
import useTranslation from '@/shared/hooks/useTranslation';
import {RunnerViewProps} from '@/shared/interfaces/caregiverChecklistRunner';
import {
  formatAnswerValue,
  isAnswerEmpty,
} from '@/shared/utils/assessmentChecklistUtils';
import QuestionBody from '@/views/pages/caregiverChecklist/QuestionBody';
import RunnerFullBleed from '@/views/pages/caregiverChecklist/RunnerFullBleed';
import RunnerPatientPanel from '@/views/pages/caregiverChecklist/RunnerPatientPanel';
import RunnerTopBar from '@/views/pages/caregiverChecklist/RunnerTopBar';
import useRunnerKeyboard from '@/views/pages/caregiverChecklist/useRunnerKeyboard';
import {
  getPrimaryActionLabel,
  groupQuestionsBySection,
} from '@/views/pages/caregiverChecklist/utils';

const sectionLabelSx = {color: 'text.disabled', px: 1, pb: 2};

/** Rail, question, patient context: W02. */
const DesktopRunner = ({
  runner,
  patientName,
  patientDetail,
  patientFacts,
  checklistName,
  assignmentNote,
  onSaveAndExit,
}: RunnerViewProps) => {
  const {t} = useTranslation();

  const {containerRef} = useRunnerKeyboard({runner, isEnabled: true});

  const {
    questions,
    currentIndex,
    currentQuestion,
    answers,
    answeredCount,
    isEditingFromSummary,
  } = runner;

  if (!currentQuestion) return null;

  const railGroups = groupQuestionsBySection({questions});

  const questionNumberById = new Map(
    questions.map((question, index) => [question.id, index + 1])
  );

  return (
    <>
      <RunnerTopBar
        crumb={patientName}
        title={checklistName}
        questions={questions}
        answers={answers}
        currentIndex={currentIndex}
        answeredCount={answeredCount}
        onJump={runner.goTo}
        onSaveAndExit={onSaveAndExit}
      />

      <RunnerFullBleed
        sx={{
          display: 'grid',
          gridTemplateColumns: `${CAREGIVER_RUNNER.railWidth}px minmax(0, 1fr) ${CAREGIVER_RUNNER.contextWidth}px`,
        }}
      >
        <Box
          component='aside'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'customColors.surfaceRaised',
          }}
        >
          <Box sx={{flex: 1, overflowY: 'auto', px: 3, py: 4.5}}>
            {railGroups.map((group) => (
              <Box key={group.sectionIndex}>
                <Typography
                  variant='eyebrow'
                  component='h2'
                  sx={{...sectionLabelSx, pt: group.sectionIndex > 0 ? 5.5 : 0}}
                >
                  {`${group.sectionIndex + 1} · ${group.title}`}
                </Typography>

                {group.items.map((question) => {
                  const isCurrent = question.id === currentQuestion.id;

                  const isAnswered = !isAnswerEmpty({
                    question,
                    value: answers[question.id]?.value,
                  });

                  return (
                    <ButtonBase
                      key={question.id}
                      aria-label={t('caregiverChecklist.rail.goTo', {
                        number: questionNumberById.get(question.id),
                        title: question.title,
                        interpolation: {escapeValue: false},
                      })}
                      onClick={() => runner.goTo({questionId: question.id})}
                      sx={{
                        width: '100%',
                        gap: 2.5,
                        px: 3,
                        py: 2.5,
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        borderRadius: `${radius.sm}px`,
                        backgroundColor: isCurrent
                          ? 'customColors.brandTint'
                          : 'transparent',
                        color: isCurrent ? 'primary.dark' : 'text.primary',
                        '&:hover': {
                          backgroundColor: isCurrent
                            ? 'customColors.brandTint'
                            : 'action.hover',
                        },
                      }}
                    >
                      <Box sx={{width: 16, flex: 'none', display: 'grid'}}>
                        {isAnswered ? (
                          <Icon
                            icon='mdi:check'
                            fontSize={16}
                            color='var(--mui-palette-success-main)'
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              border: '2px solid',
                              borderColor: isCurrent
                                ? 'primary.main'
                                : 'customColors.inkFaint',
                            }}
                          />
                        )}
                      </Box>

                      <Box sx={{minWidth: 0}}>
                        <Typography
                          sx={{
                            fontSize: '0.84375rem',
                            fontWeight: isCurrent ? 600 : 500,
                          }}
                        >
                          {question.title}
                        </Typography>

                        {isAnswered && (
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              color: 'text.secondary',
                              mt: 0.25,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatAnswerValue({
                              value: answers[question.id]?.value,
                              type: question.type,
                              options: question.options,
                              t,
                            })}
                          </Typography>
                        )}
                      </Box>
                    </ButtonBase>
                  );
                })}
              </Box>
            ))}
          </Box>

          <Box sx={{flex: 'none', px: 3, pt: 4.5, pb: 4.5}}>
            <Button
              fullWidth
              variant='outlined'
              onClick={runner.goToSummary}
              sx={{borderRadius: `${radius.sm}px`, fontWeight: 600}}
            >
              {t('caregiverChecklist.goToSummary')}
            </Button>
          </Box>
        </Box>

        <Box
          component='main'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            px: 14,
            py: 11,
          }}
        >
          <Box
            ref={containerRef}
            sx={{flex: 1, overflowY: 'auto', minHeight: 0, mx: -1.5, px: 1.5}}
          >
            <QuestionBody
              runner={runner}
              isPhone={false}
              label={t('caregiverChecklist.progress.sectionPosition', {
                section: currentQuestion.sectionTitle,
                current: currentIndex + 1,
                total: questions.length,
                interpolation: {escapeValue: false},
              })}
            />
          </Box>

          <Box
            sx={{
              flex: 'none',
              pt: 7.5,
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
            }}
          >
            {currentIndex > 0 && !isEditingFromSummary && (
              <Button
                variant='outlined'
                onClick={runner.previous}
                startIcon={<Icon icon='mdi:chevron-left' fontSize={16} />}
                sx={{borderRadius: `${radius.md}px`, fontWeight: 600}}
              >
                {t('commonContent.previous')}
              </Button>
            )}

            <Button
              variant='contained'
              onClick={runner.next}
              endIcon={
                isEditingFromSummary ? undefined : (
                  <Icon icon='mdi:chevron-right' fontSize={16} />
                )
              }
              sx={{ml: 'auto', borderRadius: `${radius.md}px`, fontWeight: 700}}
            >
              {getPrimaryActionLabel({runner, t})}
            </Button>
          </Box>
        </Box>

        <RunnerPatientPanel
          patientName={patientName}
          patientDetail={patientDetail}
          patientFacts={patientFacts}
          assignmentNote={assignmentNote}
        />
      </RunnerFullBleed>
    </>
  );
};

export default DesktopRunner;
