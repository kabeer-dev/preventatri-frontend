'use client';

import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CardRow from '@/shared/components/common/CardRow';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverChecklist} from '@/shared/interfaces/caregiverChecklist';
import {
  getChecklistDueLabel,
  getQuestionsLine,
  getSentTimeLabel,
} from '@/shared/utils/caregiverChecklists';

/** The leading column of a Today row: the due word or the sent time, one width. */
const LEADING_WIDTH = 56;

interface Props {
  checklist: CaregiverChecklist;
  isFirst: boolean;

  /**
   * Today names the patient first and leads with when; a patient's own page
   * names the checklist and says where it stands.
   */
  showPatient?: boolean;

  /** Where a tap goes. Without it the row is plain text. */
  href?: string;
}

/** One checklist on a phone, on Today or on the patient page. */
const CaregiverChecklistRow = ({
  checklist,
  isFirst,
  showPatient = false,
  href,
}: Props) => {
  const {t} = useTranslation();

  const tone = checklist.isSent ? 'muted' : 'default';

  if (showPatient) {
    const detail = [
      checklist.checklistName,
      checklist.isSent
        ? ''
        : getQuestionsLine({questionCount: checklist.questionCount, t}),
    ]
      .filter(Boolean)
      .join(' · ');

    return (
      <CardRow
        href={href}
        isFirst={isFirst}
        tone={tone}
        leading={
          <Typography
            noWrap
            sx={{
              width: LEADING_WIDTH,
              flex: 'none',
              fontSize: '0.8125rem',
              fontWeight: checklist.isSent ? 400 : 600,
              color: checklist.isSent ? 'inherit' : 'text.secondary',
            }}
          >
            {checklist.isSent
              ? getSentTimeLabel({date: checklist.submittedAt})
              : t('caregiverPortal.today.upNext.due')}
          </Typography>
        }
        trailing={
          checklist.isSent ? (
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'success.main',
                whiteSpace: 'nowrap',
              }}
            >
              {t('caregiverPortal.today.doneToday.sent')}
            </Typography>
          ) : (
            <Icon
              icon='mdi:chevron-right'
              fontSize={18}
              color='var(--mui-palette-customColors-inkFaint)'
            />
          )
        }
      >
        <Typography
          noWrap
          sx={{
            fontSize: '0.9375rem',
            fontWeight: checklist.isSent ? 500 : 600,
          }}
        >
          {checklist.patientName}
        </Typography>
        <Typography
          noWrap
          sx={{
            fontSize: '0.78125rem',
            mt: 0.5,
            color: checklist.isSent ? 'inherit' : 'text.secondary',
          }}
        >
          {detail}
        </Typography>
      </CardRow>
    );
  }

  const trailing = checklist.isSent ? (
    <Icon
      icon='mdi:check'
      fontSize={20}
      color='var(--mui-palette-success-main)'
    />
  ) : (
    checklist.questionCount > 0 && (
      <Typography
        sx={{
          fontSize: '0.78125rem',
          color: 'text.disabled',
          flex: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {t('caregiverPortal.patient.questionCount', {
          count: checklist.questionCount,
        })}
      </Typography>
    )
  );

  return (
    <CardRow href={href} isFirst={isFirst} tone={tone} trailing={trailing}>
      <Typography
        noWrap
        sx={{
          fontSize: '0.9375rem',
          fontWeight: checklist.isSent ? 500 : 600,
        }}
      >
        {checklist.checklistName}
      </Typography>
      <Typography
        noWrap
        sx={{
          fontSize: '0.78125rem',
          mt: 0.5,
          fontWeight: checklist.isLate ? 600 : 400,
          color: checklist.isLate ? 'error.main' : 'text.secondary',
        }}
      >
        {getChecklistDueLabel({checklist, t})}
      </Typography>
    </CardRow>
  );
};

export default CaregiverChecklistRow;
