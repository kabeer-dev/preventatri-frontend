'use client';

import Typography from '@mui/material/Typography';

import {ANSWER_DATE_FORMAT} from '@/shared/constants/alertReview';
import useTranslation from '@/shared/hooks/useTranslation';
import {ChecklistAnswerValueProps} from '@/shared/interfaces/alertReview';
import {getAnswerDisplay} from '@/shared/utils/alertReview';
import {formatDate} from '@/shared/utils/dateUtils';

const ChecklistAnswerValue = ({
  value,
  type,
  color,
}: ChecklistAnswerValueProps) => {
  const {t} = useTranslation();

  const display = getAnswerDisplay({value, type});
  const isEmpty = display.kind === 'empty';

  let label = t('submissions.detail.notProvided');

  if (display.kind === 'boolean') {
    label = display.yes ? t('commonContent.yes') : t('commonContent.no');
  } else if (display.kind === 'date') {
    label = formatDate({date: display.iso, format: ANSWER_DATE_FORMAT});
  } else if (display.kind === 'text') {
    label = display.text;
  }

  return (
    <Typography
      variant='bodyStrong'
      sx={{
        flex: 'none',
        maxWidth: '48%',
        textAlign: 'right',
        overflowWrap: 'anywhere',
        whiteSpace: 'pre-wrap',
        color: isEmpty ? 'text.disabled' : color,
        fontStyle: isEmpty ? 'italic' : undefined,
        fontWeight: isEmpty ? 400 : 700,
      }}
    >
      {label}
    </Typography>
  );
};

export default ChecklistAnswerValue;
