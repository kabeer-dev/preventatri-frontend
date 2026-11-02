'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {layout} from '@/@core/theme/spacing';
import PinnedAction from '@/shared/components/caregiver/PinnedAction';
import PageHeading from '@/shared/components/common/headers/PageHeading';
import SentState from '@/shared/components/common/SentState';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {CAREGIVER_DATE_FORMATS} from '@/shared/constants/caregiver';
import {DATE_FORMATS} from '@/shared/constants/common';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useCaregiverChecklists from '@/shared/hooks/useCaregiverChecklists';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useTranslation from '@/shared/hooks/useTranslation';
import {formatDate, getCurrentDateTime} from '@/shared/utils/dateUtils';

interface Props {
  submissionId: string;
  patientId: string;
  patientName: string;
  patientFirstName: string;
  checklistName: string;

  /** When the send succeeded, recorded once by the runner. */
  sentAt: string | null;
}

/** C11: the checklist is with the nurse, and here is what comes next. */
const SentView = ({
  submissionId,
  patientId,
  patientName,
  patientFirstName,
  checklistName,
  sentAt,
}: Props) => {
  const {t} = useTranslation();

  const isDesktop = useIsDesktop();

  const {late, dueToday} = useCaregiverChecklists({patientId});

  // Only work she can start right now: an UPCOMING checklist has no Start.
  const nextForPatient = [...late, ...dueToday].find(
    (checklist) => checklist.id !== submissionId
  );

  const sentAtLabel = formatDate({
    date: sentAt || getCurrentDateTime(),
    format: DATE_FORMATS.time,
  });

  return (
    <>
      <TopBarSlot side='left'>
        <PageHeading crumb={patientName} title={checklistName} />
      </TopBarSlot>

      <SentState
        icon='mdi:check'
        color='success'
        title={t('caregiverChecklist.sent.title')}
        lines={[
          t('caregiverChecklist.sent.line', {
            checklist: checklistName,
            patient: patientFirstName,
            time: sentAtLabel,
            interpolation: {escapeValue: false},
          }),
          t('caregiverChecklist.sent.reassurance'),
        ]}
        sx={{maxWidth: layout.formMaxWidth, mx: 'auto', pt: 8}}
      >
        {nextForPatient && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: isDesktop ? 'row' : 'column',
              alignItems: isDesktop ? 'baseline' : 'center',
              justifyContent: 'center',
              gap: isDesktop ? 3 : 1,
              mt: 7.5,
              py: 3,
              textAlign: isDesktop ? 'left' : 'center',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'customColors.ruleStrong',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.84375rem',
                color: 'text.secondary',
                flex: isDesktop ? 1 : 'none',
              }}
            >
              {t('caregiverChecklist.sent.nextFor', {
                patient: patientFirstName,
              })}
            </Typography>

            <Typography
              sx={{
                fontSize: '0.84375rem',
                fontWeight: 600,
                wordBreak: 'normal',
                overflowWrap: 'break-word',
              }}
            >
              {[
                nextForPatient.checklistName,
                nextForPatient.dueDate
                  ? formatDate({
                      date: nextForPatient.dueDate,
                      format: CAREGIVER_DATE_FORMATS.nextDay,
                    })
                  : '',
              ]
                .filter(Boolean)
                .join(' · ')}
            </Typography>
          </Box>
        )}

        <PinnedAction
          label={t('caregiverPortal.backToToday')}
          href={DASHBOARD_ROUTES.home()}
        />
      </SentState>
    </>
  );
};

export default SentView;
