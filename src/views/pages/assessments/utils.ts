import {ThemeColor} from '@/@core/theme/types';
import {getDaysUntil} from '@/shared/utils/dateUtils';

// Returns chip color based on how close the assessment date is:
// - Closest upcoming date → red (error)
// - Within the next 7 days → yellow (warning)
// - Beyond 7 days → green (success)
export const getAssessmentDateChipColor = ({
  date,
}: {
  date: string;
}): ThemeColor => {
  const daysUntil = getDaysUntil({date});

  if (daysUntil <= 0) return 'error';
  if (daysUntil <= 7) return 'warning';

  return 'success';
};
