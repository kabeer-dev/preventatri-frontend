'use client';

import {useState} from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomChip from '@/@core/components/mui/chip';
import {radius} from '@/@core/theme/spacing';
import TwoStepVerificationSkeleton from '@/shared/components/common/skeletons/TwoStepVerificationSkeleton';
import {OTP_METHOD_OPTIONS} from '@/shared/constants/settings';
import useGetLoggedInUser from '@/shared/hooks/useGetLoggedInUser';
import useTranslation from '@/shared/hooks/useTranslation';
import {securityMutations, securityQueries} from '@/shared/reactQuery';
import {OtpMethodChoice, OtpMethods} from '@/shared/types/settings';
import {obscureEmail} from '@/shared/utils/emailUtils';
import {getOtpMethodChoice, getPhoneEnding} from '@/shared/utils/otpUtils';

const TwoStepVerificationCard = () => {
  const {t} = useTranslation();
  const {currentUser} = useGetLoggedInUser();
  const {useFetchOtpMethods} = securityQueries();
  const {useUpdateOtpMethodsMutation} = securityMutations();

  const {data, isLoading} = useFetchOtpMethods();

  const otpMethods: OtpMethods | undefined = data?.otpMethods;

  const {mutate: updateOtpMethods, isPending} = useUpdateOtpMethodsMutation({
    params: {id: otpMethods?.id as string},
  });

  // Unsaved choice; null means the saved one is shown.
  const [draftChoice, setDraftChoice] = useState<OtpMethodChoice | null>(null);

  if (isLoading) {
    return <TwoStepVerificationSkeleton />;
  }

  const currentChoice = getOtpMethodChoice({otpMethods});
  const selectedChoice = draftChoice ?? currentChoice;
  const hasChanges = draftChoice !== null && draftChoice !== currentChoice;
  const hasPhone = Boolean(currentUser?.phoneNo);

  // SMS choices stay selectable without a phone number, but can't be saved
  // until one is added: the user is told what to do instead.
  const needsPhoneForSelection =
    !hasPhone &&
    Boolean(
      OTP_METHOD_OPTIONS.find((option) => option.value === selectedChoice)
        ?.requiresPhone
    );

  const descriptions: Record<OtpMethodChoice, string> = {
    email: currentUser?.email ? obscureEmail({email: currentUser.email}) : '',
    phone: hasPhone
      ? t('twoStepVerification.phoneEnding', {
          ending: getPhoneEnding({phone: currentUser?.phoneNo ?? ''}),
        })
      : t('twoStepVerification.needsPhone'),
    both: t('twoStepVerification.bothDescription'),
  };

  const handleSave = () => {
    const option = OTP_METHOD_OPTIONS.find(
      (item) => item.value === draftChoice
    );

    if (!otpMethods || !option) return;

    updateOtpMethods({
      payload: {otpMethods: Object.assign({}, otpMethods, option.flags)},
      callBackFuncs: {onSuccess: () => setDraftChoice(null)},
    });
  };

  // Fills the card so the actions sit at its bottom edge, even when the card
  // is stretched to match the password card beside it.
  return (
    <Stack sx={{flex: 1}}>
      <Typography variant='h5' sx={{mb: 1}}>
        {t('twoStepVerification.heading')}
      </Typography>
      <Typography variant='body2' sx={{color: 'text.secondary', mb: 5}}>
        {t('twoStepVerification.subheading')}
      </Typography>

      <Typography
        id='otp-method-label'
        variant='body2'
        sx={{fontWeight: 600, mb: 2}}
      >
        {t('twoStepVerification.sendCodesBy')}
      </Typography>

      <Stack role='radiogroup' aria-labelledby='otp-method-label' spacing={2}>
        {OTP_METHOD_OPTIONS.map((option) => {
          const isSelected = option.value === selectedChoice;
          const isCurrent = option.value === currentChoice;
          const isDisabled = isPending;

          return (
            <Box
              key={option.value}
              component='label'
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
                border: 1,
                borderRadius: `${radius.md}px`,
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? 'customColors.brandTint' : 'transparent',
                cursor: isDisabled ? 'default' : 'pointer',
              }}
            >
              <Radio
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => setDraftChoice(option.value)}
                value={option.value}
                sx={{p: 0.5}}
              />
              <Icon icon={option.icon} fontSize={20} />

              <Stack sx={{flex: 1, minWidth: 0}}>
                <Typography variant='body' sx={{fontWeight: 600}}>
                  {t(`twoStepVerification.${option.value}`)}
                </Typography>
                <Typography
                  variant='body2'
                  noWrap
                  sx={{color: 'text.secondary'}}
                >
                  {descriptions[option.value]}
                </Typography>
              </Stack>

              {isCurrent ? (
                <CustomChip
                  size='small'
                  color='primary'
                  label={t('twoStepVerification.current')}
                  sx={{flexShrink: 0}}
                />
              ) : (
                option.isRecommended && (
                  <CustomChip
                    size='small'
                    color='secondary'
                    label={t('twoStepVerification.recommended')}
                    sx={{flexShrink: 0}}
                  />
                )
              )}
            </Box>
          );
        })}
      </Stack>

      {needsPhoneForSelection && (
        <Alert severity='warning' sx={{mt: 3}}>
          {t('twoStepVerification.addPhoneFirst')}
        </Alert>
      )}

      <Stack
        direction='row'
        spacing={2}
        sx={{justifyContent: 'flex-end', mt: 'auto', pt: 5}}
      >
        <Button
          variant='text'
          onClick={() => setDraftChoice(null)}
          disabled={!hasChanges || isPending}
          className='w-auto'
        >
          {t('twoStepVerification.cancel')}
        </Button>
        <Button
          variant='contained'
          onClick={handleSave}
          disabled={!hasChanges || isPending || needsPhoneForSelection}
          className='w-auto'
        >
          {t('twoStepVerification.save')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default TwoStepVerificationCard;
