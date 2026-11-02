'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import {
  HHA_EMAIL_CONFLICT_STATE,
  HHA_EMAIL_MEMBER_GRID_COLUMNS,
  HHA_RECORD_KIND_LABEL_KEYS,
} from '@/shared/constants/hhaSyncHistory';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaEmailConflictMembersProps} from '@/shared/interfaces/hhaSyncHistory';
import {resolveSyncChip} from '@/shared/utils/hhaSyncHistoryUtils';
import HhaSyncRecordLink from '@/views/pages/hhaSync/HhaSyncRecordLink';

import HhaEmailConflictMemberActions from './HhaEmailConflictMemberActions';

const KEY = 'hhaSyncHistory.emails';

// Everyone sharing one HHAeXchange address: who they are, what they log in
// with, and the way to give each their own email.
const HhaEmailConflictMembers = ({
  conflict,
  onChangeEmail,
}: HhaEmailConflictMembersProps) => {
  const {t} = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        py: 2,
        width: '100%',
      }}
    >
      {conflict.members.map((member) => {
        const chip = resolveSyncChip({
          map: HHA_EMAIL_CONFLICT_STATE,
          value: member.state,
          t,
        });

        const kindKey = HHA_RECORD_KIND_LABEL_KEYS[member.profile.kind];

        const hasOwnLoginEmail =
          Boolean(member.loginEmail) && member.loginEmail !== conflict.email;

        return (
          <Box
            key={member.userId || member.pendingId}
            sx={{
              display: 'grid',
              gridTemplateColumns: HHA_EMAIL_MEMBER_GRID_COLUMNS,
              alignItems: 'center',
              columnGap: 3,
            }}
          >
            <Box sx={{minWidth: 0}}>
              <HhaSyncRecordLink
                record={
                  member.profile.id
                    ? {
                        kind: member.profile.kind,
                        id: member.profile.id,
                        name: member.name,
                      }
                    : null
                }
                fallback={member.name}
              />
              <Typography noWrap variant='small' sx={{color: 'text.disabled'}}>
                {kindKey ? t(kindKey) : member.profile.kind}
                {hasOwnLoginEmail
                  ? ` · ${t(`${KEY}.loginEmail`, {email: member.loginEmail || ''})}`
                  : ''}
              </Typography>
            </Box>
            <CustomChip
              skin='light'
              size='small'
              label={chip.label}
              color={chip.color}
              sx={{justifySelf: 'start'}}
            />
            <HhaEmailConflictMemberActions
              member={member}
              sharedEmail={conflict.email}
              onChangeEmail={onChangeEmail}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default HhaEmailConflictMembers;
