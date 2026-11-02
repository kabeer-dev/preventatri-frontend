'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {SUPERVISORY_VISIT_MAX_QUEUED_FOLLOW_UPS} from '@/shared/constants/supervisoryVisits';
import {useModal} from '@/shared/hooks/modals/useModal';
import {useFollowUpAssigneeOptions} from '@/shared/hooks/useFollowUpAssigneeOptions';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {QueuedFollowUpsSectionProps} from '@/shared/interfaces/supervisoryVisit';
import {FollowUpFormPayload} from '@/shared/types/followUp';
import {
  buildFollowUpPayload,
  formatDueDateTime,
} from '@/shared/utils/followUpUtils';
import FollowUpFormModal from '@/views/pages/followUps/FollowUpFormModal';

// Follow-up tasks the nurse queues while filing; they are created together
// with the filing, so nothing exists until the visit is filed.
const QueuedFollowUpsSection = ({
  visit,
  queued,
  onChange,
  disabled = false,
}: QueuedFollowUpsSectionProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();
  const addModal = useModal();

  const {options: assigneeOptions} = useFollowUpAssigneeOptions({
    patientId: visit.patientId,
  });

  const handleAdd = (values: FollowUpFormPayload) => {
    const payload = buildFollowUpPayload({
      values,
      supervisoryVisitId: visit.id,
      zone,
    });

    onChange({
      queued: queued.concat({
        localId: `${Date.now()}-${queued.length}`,
        payload,
        assigneeLabel:
          assigneeOptions.find(
            (option) => option.value === payload.assigneeUserOrganizationId
          )?.label ?? '',
      }),
    });
    addModal.closeModal();
  };

  const handleRemove = ({localId}: {localId: string}) =>
    onChange({queued: queued.filter((entry) => entry.localId !== localId)});

  return (
    <Box>
      <Box className='mb-1.5 flex items-center justify-between gap-2'>
        <Typography
          variant='small'
          sx={{fontWeight: 600, color: 'text.secondary'}}
        >
          {t('supervisoryVisits.complete.followUps')} ·{' '}
          {t('supervisoryVisits.complete.followUpsHint')}
        </Typography>
        <Button
          size='small'
          variant='text'
          onClick={addModal.openModal}
          disabled={
            disabled || queued.length >= SUPERVISORY_VISIT_MAX_QUEUED_FOLLOW_UPS
          }
        >
          {t('supervisoryVisits.complete.addFollowUp')}
        </Button>
      </Box>

      {queued.length === 0 ? (
        <Typography variant='small' sx={{color: 'text.disabled'}}>
          {t('supervisoryVisits.complete.noFollowUps')}
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {queued.map((entry) => (
            <Box
              key={entry.localId}
              className='flex items-center justify-between gap-2 rounded px-3 py-2'
              sx={{bgcolor: 'action.hover'}}
            >
              <Box className='min-w-0'>
                <Typography noWrap variant='bodyStrong' sx={{display: 'block'}}>
                  {entry.payload.title}
                </Typography>
                <Typography
                  noWrap
                  variant='small'
                  sx={{color: 'text.secondary'}}
                >
                  {[
                    entry.assigneeLabel,
                    formatDueDateTime({dueAt: entry.payload.dueAt, zone}),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </Typography>
              </Box>
              <IconButton
                size='small'
                aria-label={t('supervisoryVisits.complete.removeFollowUp')}
                onClick={() => handleRemove({localId: entry.localId})}
                disabled={disabled}
              >
                <Icon icon='mdi:close' fontSize={18} />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}

      <FollowUpFormModal
        isOpen={addModal.isModalOpen}
        onClose={addModal.closeModal}
        onSubmit={handleAdd}
        lockedPatient={Object.assign({id: visit.patientId}, visit.patient)}
        linkedAlert={visit.source.alert}
        submitLabel={t('supervisoryVisits.complete.queueFollowUp')}
      />
    </Box>
  );
};

export default QueuedFollowUpsSection;
