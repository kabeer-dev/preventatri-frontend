'use client';

import {useId, useState} from 'react';

import Box from '@mui/material/Box';
import {alpha, useTheme} from '@mui/material/styles';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import ActiveFlagField from '@/shared/components/common/activeFlag/ActiveFlagField';
import ActiveFlagFooter from '@/shared/components/common/activeFlag/ActiveFlagFooter';
import ActiveFlagHeader from '@/shared/components/common/activeFlag/ActiveFlagHeader';
import ActiveFlagPersonField from '@/shared/components/common/activeFlag/ActiveFlagPersonField';
import BaseDialog from '@/shared/components/common/modals/BaseDialog';
import {ConfirmationModal} from '@/shared/components/common/modals/ConfirmationModal';
import {
  ACTIVE_FLAG_MODAL_SIZES,
  ACTIVE_FLAG_MODAL_WIDTH,
  FLAG_TYPES,
} from '@/shared/constants/flag';
import useAcceptFlag from '@/shared/hooks/useAcceptFlag';
import useActiveFlagAccent from '@/shared/hooks/useActiveFlagAccent';
import useActiveFlagOpenedAt from '@/shared/hooks/useActiveFlagOpenedAt';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {ActiveFlagModalProps} from '@/shared/interfaces/flag';

const ActiveFlagModal = ({
  flag,
  onOpenCaseDetails,
  onExpire,
}: ActiveFlagModalProps) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {isAdmin} = useUserRole();
  const titleId = useId();
  const subtitleId = useId();

  const [isOpen, setIsOpen] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    id,
    patientName,
    caregiverName,
    reason,
    description,
    remainingRedFlags,
    remainingYellowFlags,
    expiresAt,
    flagType,
    acceptedAt,
    canAccept,
  } = flag;

  const accent = useActiveFlagAccent({flagType});
  const openedAt = useActiveFlagOpenedAt({id});
  const {acceptFlag, isAccepting} = useAcceptFlag();

  const remainingFlags = remainingRedFlags + remainingYellowFlags;

  // Yellow flags are advisory and can be dismissed. Red flags stay forced
  // until resolved: accepting only stops the escalation, it does not free the
  // caller to move on to other work.
  const isCloseable = flagType === FLAG_TYPES.YELLOW;

  const handleClose = () => setIsOpen(false);

  // On SLA expiry, close this card and ask the parent to refetch: the backend
  // drops the now-expired flag from the assigned selection, so the refetch
  // surfaces the next assigned flag (or nothing) instead of re-showing this one.
  const handleExpire = () => {
    setIsOpen(false);
    onExpire();
  };

  // Accepting stops the escalation, so it is confirmed first. The refetch
  // after accepting re-renders this card as accepted, or surfaces another flag
  // that is still waiting.
  const handleAccept = () => setIsConfirmOpen(true);

  const handleCancelAccept = () => setIsConfirmOpen(false);

  const handleConfirmAccept = () =>
    acceptFlag({escalationId: id, onAccepted: handleCancelAccept});

  const handleOpenCaseDetails = () => {
    setIsOpen(false);
    onOpenCaseDetails();
  };

  return (
    <>
      <BaseDialog
        isOpen={isOpen}
        onClose={isCloseable ? handleClose : undefined}
        width={ACTIVE_FLAG_MODAL_WIDTH}
        hideCloseButton
        ariaLabelledBy={titleId}
        ariaDescribedBy={subtitleId}
        paperSx={{
          overflow: 'hidden',
          borderRadius: `${radius.lg}px`,
          outline: `1.5px solid ${accent.edge}`,
          boxShadow: `0 0 0 ${ACTIVE_FLAG_MODAL_SIZES.outerGlow}px ${alpha(
            accent.edge,
            0.16
          )}, 0 28px 56px -16px ${alpha(theme.palette.customColors.shell, 0.45)}`,
        }}
      >
        <ActiveFlagHeader
          accent={accent}
          title={t(`flag.activeModal.title.${accent.severity}`)}
          subtitle={
            acceptedAt
              ? t('flag.activeModal.acceptedHint')
              : t(`flag.activeModal.subtitle.${accent.severity}`)
          }
          titleId={titleId}
          subtitleId={subtitleId}
          expiresAt={isAdmin ? null : expiresAt}
          openedAt={openedAt}
          acceptedAt={acceptedAt}
          onExpire={handleExpire}
          onClose={isCloseable ? handleClose : undefined}
        />

        <Box
          sx={{display: 'grid', gap: 4, p: 5, minHeight: 0, overflowY: 'auto'}}
        >
          <ActiveFlagField
            label={t('flag.activeModal.alertReason')}
            variant='key'
            accent={accent}
            startAdornment={<Icon icon='mdi:alert-outline' fontSize={18} />}
          >
            {reason}
          </ActiveFlagField>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr'},
              gap: 4,
            }}
          >
            <ActiveFlagPersonField
              label={t('flag.activeModal.patient')}
              name={patientName}
              color={accent.color}
            />
            <ActiveFlagPersonField
              label={t('flag.activeModal.caregiver')}
              name={caregiverName}
              color='primary'
            />
          </Box>

          {description && (
            <ActiveFlagField
              label={t('flag.activeModal.description')}
              variant='long'
            >
              {description}
            </ActiveFlagField>
          )}
        </Box>

        <ActiveFlagFooter
          accent={accent}
          remainingFlags={remainingFlags}
          onOpenCaseDetails={handleOpenCaseDetails}
          onDismiss={isCloseable ? handleClose : undefined}
          onAccept={canAccept && !isAdmin ? handleAccept : undefined}
          isAccepting={isAccepting}
        />
      </BaseDialog>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        title={t('flag.activeModal.acceptConfirm.title')}
        content={t('flag.activeModal.acceptConfirm.message')}
        confirmLabel={t('flag.activeModal.acceptConfirm.confirm')}
        confirmButtonColor='primary'
        confirmLoading={isAccepting}
        onConfirm={handleConfirmAccept}
        onCancel={handleCancelAccept}
      />
    </>
  );
};

export default ActiveFlagModal;
