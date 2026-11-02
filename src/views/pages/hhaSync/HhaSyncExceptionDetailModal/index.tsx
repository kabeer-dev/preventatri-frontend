'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import BaseDialog from '@/shared/components/common/modals/BaseDialog';
import {DETAIL_EMPTY_VALUE} from '@/shared/constants/common';
import {
  HHA_SYNC_DIALOG_WIDTH,
  HHA_SYNC_EXCEPTION_STATUS,
  HHA_SYNC_LINK_CONFLICTS,
  HHA_SYNC_WAITING_PERSON_TYPES,
} from '@/shared/constants/hhaSyncHistory';
import {useOrganizationTimeZone} from '@/shared/hooks/useOrganizationTimeZone';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaSyncExceptionDetailModalProps} from '@/shared/interfaces/hhaSyncHistory';
import {
  formatSyncDateTime,
  getExceptionCopy,
  resolveSyncChip,
} from '@/shared/utils/hhaSyncHistoryUtils';
import HhaSyncDetailRow from '@/views/pages/hhaSync/HhaSyncDetailRow';
import HhaSyncRecordLink from '@/views/pages/hhaSync/HhaSyncRecordLink';

import HhaSyncExceptionActions from './HhaSyncExceptionActions';
import HhaSyncExceptionFixRows from './HhaSyncExceptionFixRows';
import HhaSyncWaitingPatients from './HhaSyncWaitingPatients';

const EXCEPTIONS_KEY = 'hhaSyncHistory.exceptions';
const KEY = `${EXCEPTIONS_KEY}.detail`;

// One exception: what happened, what to do, where to fix it, and its actions.
const HhaSyncExceptionDetailModal = ({
  exception,
  isOpen,
  onClose,
}: HhaSyncExceptionDetailModalProps) => {
  const {t} = useTranslation();
  const {zone} = useOrganizationTimeZone();

  if (!exception) return null;

  const copy = getExceptionCopy({type: exception.type, t});

  // A reopened row still carries who last closed it and the note.
  const isReopened = Boolean(exception.reopenedAt);

  const conflict = HHA_SYNC_LINK_CONFLICTS[exception.type];
  const holder = conflict ? exception[conflict.holderField] : null;

  const isWaitingPerson = HHA_SYNC_WAITING_PERSON_TYPES.includes(
    exception.type
  );

  // Who the related user is depends on the exception: HHA's nurse or case
  // manager in a conflict, the waiting person, else the holder of an email.
  const relatedUserLabel =
    (conflict && `conflicts.${conflict.copyKey}.hhaPerson`) ||
    (isWaitingPerson && 'waiting.person') ||
    'detail.relatedUser';

  const chip = resolveSyncChip({
    map: HHA_SYNC_EXCEPTION_STATUS,
    value: exception.status,
    t,
  });

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      width={HHA_SYNC_DIALOG_WIDTH}
      ariaLabelledBy='hha-sync-exception-title'
    >
      <Box sx={{p: 6, display: 'flex', flexDirection: 'column', gap: 4}}>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 3, pr: 10}}>
          <Typography
            id='hha-sync-exception-title'
            variant='h6'
            sx={{fontWeight: 600}}
          >
            {copy.title}
          </Typography>
          <CustomChip
            skin='light'
            size='small'
            label={chip.label}
            color={chip.color}
          />
        </Box>

        <Box>
          <Typography variant='subtitle2'>
            {t(`${KEY}.whatHappened`)}
          </Typography>
          <Typography variant='body2'>{copy.happened}</Typography>
        </Box>
        <Box>
          <Typography variant='subtitle2'>{t(`${KEY}.adminAction`)}</Typography>
          <Typography variant='body2'>{copy.action}</Typography>
        </Box>

        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <HhaSyncExceptionFixRows type={exception.type} />
          {!isWaitingPerson && (
            <HhaSyncDetailRow label={t(`${KEY}.record`)}>
              <HhaSyncRecordLink
                record={exception.record}
                fallback={exception.hhaRecordId || DETAIL_EMPTY_VALUE}
              />
            </HhaSyncDetailRow>
          )}
          {exception.detail && (
            <HhaSyncDetailRow label={t(`${KEY}.detail`)}>
              {exception.detail}
            </HhaSyncDetailRow>
          )}
          {exception.relatedUser && (
            <HhaSyncDetailRow
              label={t(`${EXCEPTIONS_KEY}.${relatedUserLabel}`)}
            >
              <HhaSyncRecordLink
                record={{
                  kind: exception.relatedUser.profile.kind,
                  id: exception.relatedUser.profile.id,
                  name: `${exception.relatedUser.name} (${exception.relatedUser.email})`,
                }}
                fallback={exception.relatedUser.email}
              />
            </HhaSyncDetailRow>
          )}
          {conflict && holder && (
            <HhaSyncDetailRow
              label={t(
                `${EXCEPTIONS_KEY}.conflicts.${conflict.copyKey}.current`
              )}
            >
              <HhaSyncRecordLink record={holder} fallback={holder.name} />
            </HhaSyncDetailRow>
          )}
          <HhaSyncDetailRow label={t(`${KEY}.occurrences`)}>
            {exception.occurrences}
          </HhaSyncDetailRow>
          <HhaSyncDetailRow label={t(`${KEY}.firstSeen`)}>
            {formatSyncDateTime({value: exception.firstSeenAt, zone})}
          </HhaSyncDetailRow>
          <HhaSyncDetailRow label={t(`${KEY}.lastSeen`)}>
            {formatSyncDateTime({value: exception.lastSeenAt, zone})}
          </HhaSyncDetailRow>
          {exception.resolvedBy && (
            <HhaSyncDetailRow
              label={t(`${KEY}.${isReopened ? 'lastClosedBy' : 'closedBy'}`)}
            >
              {exception.resolvedBy.name}
            </HhaSyncDetailRow>
          )}
          {exception.resolvedAt && (
            <HhaSyncDetailRow
              label={t(`${KEY}.${isReopened ? 'lastClosedAt' : 'closedAt'}`)}
            >
              {formatSyncDateTime({value: exception.resolvedAt, zone})}
            </HhaSyncDetailRow>
          )}
          {exception.resolutionNote && (
            <HhaSyncDetailRow label={t(`${KEY}.resolution`)}>
              {exception.resolutionNote}
            </HhaSyncDetailRow>
          )}
          {isReopened && (
            <>
              <HhaSyncDetailRow label={t(`${KEY}.reopenedBy`)}>
                {exception.reopenedBy?.name || t(`${KEY}.reopenedBySync`)}
              </HhaSyncDetailRow>
              <HhaSyncDetailRow label={t(`${KEY}.reopenedAt`)}>
                {formatSyncDateTime({value: exception.reopenedAt, zone})}
              </HhaSyncDetailRow>
            </>
          )}
        </Box>

        {isWaitingPerson && <HhaSyncWaitingPatients exception={exception} />}

        <HhaSyncExceptionActions exception={exception} onDone={onClose} />
      </Box>
    </BaseDialog>
  );
};

export default HhaSyncExceptionDetailModal;
