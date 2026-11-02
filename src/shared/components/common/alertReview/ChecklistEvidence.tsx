'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ChecklistAnswerRow from '@/shared/components/common/alertReview/ChecklistAnswerRow';
import {ALERT_REVIEW_ROW_SX} from '@/shared/constants/alertReview';
import useTranslation from '@/shared/hooks/useTranslation';
import {ChecklistEvidenceProps} from '@/shared/interfaces/alertReview';
import {
  getChecklistFlagSummary,
  isFlaggedAnswer,
} from '@/shared/utils/alertReview';
import {padNumber} from '@/shared/utils/general';

const ChecklistEvidence = ({sections}: ChecklistEvidenceProps) => {
  const {t} = useTranslation();

  const {flagged, total} = getChecklistFlagSummary({sections});

  const [showAll, setShowAll] = useState(flagged === 0);

  const visibleSections = sections
    .map((section, index) => {
      const flaggedQuestions = section.questions.filter((question) =>
        isFlaggedAnswer({value: question.answer?.value ?? null})
      );

      return {
        section,
        number: padNumber({n: index + 1}),
        flaggedCount: flaggedQuestions.length,
        questions: showAll ? section.questions : flaggedQuestions,
      };
    })
    .filter(({questions}) => questions.length > 0);

  const canToggle = flagged > 0 && flagged < total;

  return (
    <>
      {visibleSections.map(({section, number, flaggedCount, questions}) => (
        <Box key={section.id}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 2.5,
              px: 4.5,
              pt: 3.5,
              pb: 1.5,
            }}
          >
            <Typography variant='mono' sx={{color: 'customColors.inkFaint'}}>
              {number}
            </Typography>
            <Typography
              variant='small'
              component='h3'
              sx={{
                flex: 1,
                minWidth: 0,
                fontWeight: 700,
                color: 'text.secondary',
              }}
            >
              {section.title}
            </Typography>
            <Typography
              variant='small'
              sx={{flex: 'none', color: 'customColors.inkFaint'}}
            >
              {t('alertReview.evidence.sectionFlagged', {
                flagged: flaggedCount,
                total: section.questions.length,
              })}
            </Typography>
          </Box>

          {questions.map((question) => (
            <ChecklistAnswerRow key={question.id} question={question} />
          ))}
        </Box>
      ))}

      {canToggle && (
        <Box
          sx={{
            ...ALERT_REVIEW_ROW_SX,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2.5,
            py: 1.5,
          }}
        >
          <Typography variant='small' sx={{color: 'customColors.inkFaint'}}>
            {showAll
              ? t('alertReview.evidence.showingAll', {count: total})
              : t('alertReview.evidence.withinRange', {count: total - flagged})}
          </Typography>
          <Button
            size='small'
            variant='text'
            onClick={() => setShowAll((isShowingAll) => !isShowingAll)}
            sx={{ml: 'auto'}}
          >
            {showAll
              ? t('alertReview.evidence.showFlagged')
              : t('alertReview.evidence.showAll', {count: total})}
          </Button>
        </Box>
      )}
    </>
  );
};

export default ChecklistEvidence;
