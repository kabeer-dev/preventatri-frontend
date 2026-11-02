'use client';

import {useState} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import CustomAvatar from '@/@core/components/mui/avatar';
import {controlHeight, layout} from '@/@core/theme/spacing';
import PasswordUpdateForm from '@/shared/components/pages/dashboard/settings/passwordUpdateForm';
import PersonalDetailsForm from '@/shared/components/pages/dashboard/settings/personalDetailsForm';
import {CAREGIVER_APP_VERSION} from '@/shared/constants/caregiver';
import {DEFAULT_LOGO} from '@/shared/constants/general';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useOrgName from '@/shared/hooks/useOrgName';
import useTranslation from '@/shared/hooks/useTranslation';
import {caregiverQueries, userMutations} from '@/shared/reactQuery';
import {getOrgRoleLabel, getUserDisplayName} from '@/shared/utils/general';

import AccountRow from './AccountRow';

/**
 * C18: who the caregiver is, what she has sent, and the two account things she
 * can change. Notification preferences and support are hidden: neither has
 * anything behind it for a caregiver today.
 */
const CaregiverMeView = () => {
  const {t} = useTranslation();
  const {currentUser} = useGetLoggedInUser();
  const orgName = useOrgName();

  const [openRow, setOpenRow] = useState('');

  const {useFetchCaregiverStats} = caregiverQueries();
  const {useSignOutMutation} = userMutations();

  const {data} = useFetchCaregiverStats();
  const {mutate: signOut, isPending: isSigningOut} = useSignOutMutation();

  const displayName = getUserDisplayName({user: currentUser});

  const roleLabel = getOrgRoleLabel({
    role: currentUser?.currentActiveOrganization?.role,
  });

  const stats = [
    {
      key: 'checklistsSent',
      value: data?.stats?.assessmentsCompleted ?? 0,
    },
    {
      key: 'redFlagsRaised',
      value: data?.stats?.submittedFlags ?? 0,
    },
  ];

  const toggleRow = ({row}: {row: string}) =>
    setOpenRow((current) => (current === row ? '' : row));

  return (
    <Box sx={{maxWidth: layout.formMaxWidth}}>
      <Box sx={{display: 'flex', alignItems: 'center', gap: 3.5}}>
        {/* The shell's dark tint, where the light one would disappear. */}
        <CustomAvatar
          alt={displayName}
          src={currentUser?.profileImage?.url || DEFAULT_LOGO}
          sx={{width: 60, height: 60, flex: 'none'}}
        />

        <Box sx={{minWidth: 0}}>
          <Typography noWrap variant='h1'>
            {displayName}
          </Typography>

          <Typography
            noWrap
            sx={{fontSize: '0.84375rem', color: 'text.secondary', mt: 0.5}}
          >
            {[roleLabel, orgName].filter(Boolean).join(' · ')}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2.5,
          mt: 5,
        }}
      >
        {stats.map(({key, value}) => (
          <Card key={key} sx={{px: 3, py: 3.5, textAlign: 'center'}}>
            <Typography sx={{fontSize: '1.375rem', fontWeight: 600}}>
              {value}
            </Typography>

            <Typography
              sx={{fontSize: '0.71875rem', color: 'text.secondary', mt: 0.5}}
            >
              {t(`caregiverMe.stats.${key}`)}
            </Typography>
          </Card>
        ))}
      </Box>

      <Typography
        variant='eyebrow'
        component='h2'
        sx={{color: 'text.disabled', px: 1, pt: 5.5, pb: 2}}
      >
        {t('caregiverMe.account')}
      </Typography>

      <Card>
        <AccountRow
          isFirst
          title={t('caregiverMe.profile.title')}
          subtitle={t('caregiverMe.profile.subtitle')}
          isOpen={openRow === 'profile'}
          onToggle={() => toggleRow({row: 'profile'})}
        >
          <PersonalDetailsForm />
        </AccountRow>

        <AccountRow
          title={t('caregiverMe.password.title')}
          subtitle={t('caregiverMe.password.subtitle')}
          isOpen={openRow === 'password'}
          onToggle={() => toggleRow({row: 'password'})}
        >
          <PasswordUpdateForm />
        </AccountRow>

        <AccountRow
          title={t('caregiverMe.language.title')}
          subtitle={t('caregiverMe.language.english')}
        />
      </Card>

      <Button
        fullWidth
        variant='outlined'
        color='error'
        loading={isSigningOut}
        onClick={() => signOut({})}
        sx={{
          mt: 5.5,
          minHeight: controlHeight.xl,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {t('caregiverMe.signOut')}
      </Button>

      <Typography
        sx={{
          fontSize: '0.75rem',
          color: 'text.disabled',
          textAlign: 'center',
          mt: 3,
        }}
      >
        {t('caregiverMe.footer', {
          version: CAREGIVER_APP_VERSION,
          email: currentUser?.email || '',
        })}
      </Typography>
    </Box>
  );
};

export default CaregiverMeView;
