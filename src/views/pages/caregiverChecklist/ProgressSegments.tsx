'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import {useTheme} from '@mui/material/styles';

import {CAREGIVER_RUNNER} from '@/shared/constants/caregiver';
import {
  RunnerAnswers,
  RunnerQuestion,
} from '@/shared/interfaces/caregiverChecklistRunner';
import {isAnswerEmpty} from '@/shared/utils/assessmentChecklistUtils';

interface Props {
  questions: RunnerQuestion[];
  answers: RunnerAnswers;
  currentIndex: number;
  onJump: ({questionId}: {questionId: string}) => void;

  /** True on the dark section break, where the light track disappears. */
  onDark?: boolean;
  isCentered?: boolean;
  jumpLabel: string;
}

/**
 * One tappable bar per question: filled when answered, ringed when current.
 * Every segment keeps the same fixed size, so a long checklist wraps onto a
 * second row rather than shrinking its bars until none of them can be seen.
 */
const ProgressSegments = ({
  questions,
  answers,
  currentIndex,
  onJump,
  onDark = false,
  isCentered = false,
  jumpLabel,
}: Props) => {
  const theme = useTheme();

  const filledColor = onDark ? 'primary.light' : 'primary.main';

  const trackColor = onDark ? 'customColors.shellRaised' : 'divider';

  const ringColor = onDark
    ? theme.palette.primary.light
    : theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: isCentered ? 'center' : 'flex-start',
        columnGap: `${CAREGIVER_RUNNER.segmentGap}px`,
      }}
    >
      {questions.map((question, index) => {
        const isAnswered = !isAnswerEmpty({
          question,
          value: answers[question.id]?.value,
        });

        const isCurrent = index === currentIndex;

        return (
          <ButtonBase
            key={question.id}
            aria-label={`${jumpLabel} ${index + 1}`}
            aria-current={isCurrent ? 'step' : undefined}
            onClick={() => onJump({questionId: question.id})}
            sx={{flex: 'none', py: 2, borderRadius: 1}}
          >
            <Box
              sx={{
                width: CAREGIVER_RUNNER.segmentWidth,
                height: CAREGIVER_RUNNER.segmentHeight,
                borderRadius: 1,
                backgroundColor: isAnswered ? filledColor : trackColor,
                boxShadow: isCurrent ? `0 0 0 1.5px ${ringColor}` : 'none',
              }}
            />
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default ProgressSegments;
