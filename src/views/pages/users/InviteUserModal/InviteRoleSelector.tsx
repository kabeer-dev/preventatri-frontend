'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import FieldLabel from '@/shared/components/common/inputs/FieldLabel';
import SegmentedTabs from '@/shared/components/common/inputs/SegmentedTabs';
import {ORG_USER_ROLE_TABS} from '@/shared/constants/orgUsers';
import useTranslation from '@/shared/hooks/useTranslation';
import {InviteRoleSelectorProps} from '@/shared/interfaces/orgUser';

/**
 * Role picker at the top of the invite modal.
 *
 * Choosing a role swaps the fields below it, so it is disabled while an invite
 * is in flight -- switching mid-submit would discard the form being sent.
 */
const InviteRoleSelector = ({
  role,
  onChange,
  disabled = false,
}: InviteRoleSelectorProps) => {
  const {t} = useTranslation();

  return (
    <Box className='mb-6 flex flex-col'>
      <FieldLabel>{t('orgUsers.invite.roleLabel')}</FieldLabel>

      <SegmentedTabs
        fullWidth
        showIndicator
        value={role}
        disabled={disabled}
        ariaLabel={t('orgUsers.invite.roleLabel')}
        options={ORG_USER_ROLE_TABS.map((option) => ({
          value: option.value,
          label: t(`orgUsers.invite.roles.${option.value}`),
        }))}
        onChange={({value}) => onChange({role: value})}
      />

      <Typography
        variant='caption'
        sx={{mt: 1.75, color: 'customColors.inkSoft'}}
      >
        {t(`orgUsers.invite.roleHints.${role}`)}
      </Typography>
    </Box>
  );
};

export default InviteRoleSelector;
