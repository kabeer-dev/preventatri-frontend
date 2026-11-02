import {Icon} from '@iconify/react';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import useTranslation from '@/shared/hooks/useTranslation';
import {CHECKLIST_FIELD_TYPES} from '@/shared/interfaces/assessmentChecklistDetails';
import {
  formatAnswerValue,
  isYesAnswer,
} from '@/shared/utils/assessmentChecklistUtils';

interface AnswerValueProps {
  value: any;
  type?: string;
}

const answerTextSx = {
  fontSize: '1.0625rem',
  fontWeight: 600,
  color: 'text.primary',
  lineHeight: 1.45,
} as const;

const isEmpty = ({value}: {value: any}) =>
  value === null ||
  value === undefined ||
  value === '' ||
  (Array.isArray(value) && value.length === 0);

const YesPill = ({yes}: {yes: boolean}) => {
  const {t} = useTranslation();
  const label = yes ? t('commonContent.yes') : t('commonContent.no');
  const channel = yes ? 'success' : 'error';

  return (
    <Chip
      size='small'
      icon={
        <Icon
          icon={yes ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
          fontSize='1rem'
        />
      }
      label={label}
      sx={{
        fontWeight: 600,
        fontSize: '0.8125rem',
        height: 28,
        color: `${channel}.main`,
        bgcolor: `rgba(var(--mui-palette-${channel}-mainChannel) / 0.14)`,
        '& .MuiChip-icon': {ml: 0.5, mr: -0.25, color: `${channel}.main`},
      }}
    />
  );
};

const NotProvided = () => {
  const {t} = useTranslation();

  return (
    <Typography
      className='italic'
      sx={{...answerTextSx, fontWeight: 400, color: 'text.disabled'}}
    >
      {t('submissions.detail.notProvided')}
    </Typography>
  );
};

const AnswerValue = ({value, type = ''}: AnswerValueProps) => {
  const {t} = useTranslation();

  if (isEmpty({value})) {
    return <NotProvided />;
  }

  if (
    type === CHECKLIST_FIELD_TYPES.BOOLEAN ||
    type === CHECKLIST_FIELD_TYPES.CHECKBOX
  ) {
    return <YesPill yes={isYesAnswer({value, type})} />;
  }

  const text = formatAnswerValue({value, type, t});

  if (type === CHECKLIST_FIELD_TYPES.DATE) {
    return (
      <div className='flex items-center gap-1.5'>
        <Icon
          icon='mdi:calendar-outline'
          fontSize='1.1rem'
          color='var(--mui-palette-text-secondary)'
        />
        <Typography sx={answerTextSx}>{text}</Typography>
      </div>
    );
  }

  if (type === CHECKLIST_FIELD_TYPES.NUMBER) {
    return (
      <Typography sx={{...answerTextSx, fontSize: '1.25rem', fontWeight: 700}}>
        {text}
      </Typography>
    );
  }

  if (type === CHECKLIST_FIELD_TYPES.TEXTAREA) {
    return (
      <Typography className='whitespace-pre-wrap' sx={answerTextSx}>
        {text}
      </Typography>
    );
  }

  return <Typography sx={answerTextSx}>{text}</Typography>;
};

export default AnswerValue;
