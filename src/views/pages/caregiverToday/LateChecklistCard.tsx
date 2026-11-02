'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Link from '@/shared/components/common/localeLink';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverChecklist} from '@/shared/interfaces/caregiverChecklist';
import {
  getDueDayLabel,
  getQuestionsLine,
} from '@/shared/utils/caregiverChecklists';

interface Props {
  checklist: CaregiverChecklist;

  /** Desktop puts the button on the right; the phone puts it under the text. */
  inline?: boolean;
}

/** One late checklist, shown above the day's list and never inside it. */
const LateChecklistCard = ({checklist, inline = false}: Props) => {
  const {t} = useTranslation();

  const questionsLine = getQuestionsLine({
    questionCount: checklist.questionCount,
    t,
  });

  return (
    <Card
      sx={{
        p: 5,
        minWidth: 0,
        display: 'flex',
        alignItems: inline ? 'center' : 'stretch',
        flexDirection: inline ? 'row' : 'column',
        gap: 4,
      }}
    >
      <Box sx={{minWidth: 0, flexGrow: 1}}>
        <Typography
          noWrap
          variant='eyebrow'
          sx={{
            display: 'block',

            // The theme greys every eyebrow with a nested class that outranks
            // a plain `color` here.
            '&.MuiTypography-eyebrow': {color: 'error.main'},
          }}
        >
          {t('caregiverPortal.patient.state.late', {
            date: getDueDayLabel({date: checklist.dueDate}),
          })}
        </Typography>

        <Typography noWrap sx={{fontSize: '1.125rem', fontWeight: 700, mt: 2}}>
          {checklist.patientName}
        </Typography>

        <Typography
          noWrap
          sx={{fontSize: '0.875rem', color: 'text.secondary', mt: 0.5}}
        >
          {[checklist.checklistName, questionsLine].filter(Boolean).join(' · ')}
        </Typography>
      </Box>

      <Button
        component={Link}
        href={DASHBOARD_ROUTES.checklist({id: checklist.id})}
        variant='contained'
        sx={{flexShrink: 0, whiteSpace: 'nowrap'}}
      >
        {t('caregiverPortal.today.late.start')}
      </Button>
    </Card>
  );
};

export default LateChecklistCard;
