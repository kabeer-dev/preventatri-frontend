'use client';

import {useId} from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';

import AlertPeopleRail from '@/shared/components/common/alertReview/AlertPeopleRail';
import AlertReviewGrid from '@/shared/components/common/alertReview/AlertReviewGrid';
import CaseEvidenceCard from '@/shared/components/common/alertReview/CaseEvidenceCard';
import CaseReviewHeader from '@/shared/components/common/alertReview/CaseReviewHeader';
import ContentNotAvailable from '@/shared/components/common/ContentNotAvailable';
import GlobalLoader from '@/shared/components/common/loaders/GlobalLoader';
import ActionTakenForm from '@/shared/components/common/modals/ActionTakenForm';
import {ALERT_REVIEW_SIZES} from '@/shared/constants/alertReview';
import {
  FLAG_DETAIL_TYPES,
  FLAG_TYPES,
  TIMELINE_TIMESTAMP_FORMAT,
} from '@/shared/constants/flag';
import useAlertPeople from '@/shared/hooks/useAlertPeople';
import useAlertSeverityTone from '@/shared/hooks/useAlertSeverityTone';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {FlagCaseDetailsModalProps} from '@/shared/interfaces/flag';
import {useQueries as useFlagQueries} from '@/shared/reactQuery/flags/queries';
import {getFlagReportedAt} from '@/shared/utils/alertReview';
import {formatDate} from '@/shared/utils/dateUtils';

const FlagCaseDetailsModal = ({
  flag,
  isOpen,
  onClose,
  onResolve,
}: FlagCaseDetailsModalProps) => {
  const {t} = useTranslation();
  const {isAdmin} = useUserRole();
  const titleId = useId();

  const {id, flagType, reason, patientName, caregiverName, expiresAt} = flag;

  // Yellow cases are advisory and can be dismissed; red cases stay forced
  // until the case is handled (mirrors the active-flag modal behaviour).
  const isCloseable = flagType === FLAG_TYPES.YELLOW;

  const tone = useAlertSeverityTone({flag: flagType});

  const {useFetchFlagCaseDetails} = useFlagQueries();

  const {data, isLoading, isError} = useFetchFlagCaseDetails({
    id,
    enabled: isOpen,
  });

  const caseDetails = data?.flagDetails;

  const people = useAlertPeople({
    patient: caseDetails?.patient,
    submitter: caseDetails?.submitter,
    showPatientRecord: true,
  });

  const submission =
    caseDetails?.type === FLAG_DETAIL_TYPES.AUTO
      ? caseDetails.submission
      : null;

  const reportedAt = getFlagReportedAt({caseDetails});

  const identityParts = [
    reportedAt
      ? t('alertReview.header.reported', {
          date: formatDate({
            date: reportedAt,
            format: TIMELINE_TIMESTAMP_FORMAT,
          }),
        })
      : '',
    caregiverName ? t('alertReview.header.by', {name: caregiverName}) : '',
    submission?.template?.title
      ? t('alertReview.header.fromChecklist', {
          title: submission.template.title,
        })
      : '',
  ].filter(Boolean);

  const renderBody = () => {
    if (isLoading) return <GlobalLoader className='h-full' />;

    if (isError || !caseDetails) {
      return (
        <ContentNotAvailable
          title={t('flag.caseDetailsModal.notFoundTitle')}
          message={t('flag.caseDetailsModal.notFoundMessage')}
        />
      );
    }

    return (
      <AlertReviewGrid
        people={<AlertPeopleRail people={people} />}
        evidence={
          <CaseEvidenceCard
            caseDetails={caseDetails}
            tone={tone}
            caregiverName={people.caregiverName || caregiverName}
          />
        }
        resolution={
          <ActionTakenForm
            flagId={id}
            patientId={caseDetails.patientId}
            onResolved={onResolve}
          />
        }
      />
    );
  };

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={isCloseable ? onClose : undefined}
      aria-labelledby={titleId}
      slotProps={{paper: {sx: {backgroundColor: 'background.default'}}}}
    >
      <CaseReviewHeader
        tone={tone}
        titleId={titleId}
        patientName={people.patientName || patientName}
        reason={reason}
        identityParts={identityParts}
        expiresAt={isAdmin ? null : expiresAt}
        openedAt={reportedAt}
        onExit={isCloseable ? onClose : undefined}
      />

      <Box sx={{flex: 1, minHeight: 0, overflowY: 'auto'}}>
        <Box
          sx={{
            height: isLoading ? '100%' : undefined,
            maxWidth: ALERT_REVIEW_SIZES.contentMaxWidth,
            mx: 'auto',
            px: {xs: 3.5, md: 6.5},
            pt: 4,
            pb: 8,
          }}
        >
          {renderBody()}
        </Box>
      </Box>
    </Dialog>
  );
};

export default FlagCaseDetailsModal;
