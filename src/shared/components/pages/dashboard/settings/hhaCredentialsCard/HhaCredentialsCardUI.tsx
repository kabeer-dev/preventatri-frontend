'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomChip from '@/@core/components/mui/chip';
import SettingsSectionHeader from '@/shared/components/pages/dashboard/settings/organizationSettingsCard/SettingsSectionHeader';
import {HHA_VISIT_DATE_FORMATS} from '@/shared/constants/hhaVisits';
import useTranslation from '@/shared/hooks/useTranslation';
import {HhaCredentialsCardUIProps} from '@/shared/interfaces/settings';
import {formatIso} from '@/shared/utils/dateUtils';

import DisconnectHhaDialog from './DisconnectHhaDialog';
import HhaCredentialsForm from './HhaCredentialsForm';

const HhaCredentialsCardUI = ({
  credentials,
  formProps,
  isFormOpen,
  isDisconnectOpen,
  isDisconnecting,
  onReplace,
  onDisconnectOpen,
  onDisconnectCancel,
  onDisconnectConfirm,
}: HhaCredentialsCardUIProps) => {
  const {t} = useTranslation();

  const {isConnected, appName, lastVerifiedAt} = credentials;

  const lastChecked = formatIso({
    value: lastVerifiedAt,
    format: HHA_VISIT_DATE_FORMATS.DATE_TIME,
  });

  return (
    <Card>
      <SettingsSectionHeader
        title={t('hhaCredentials.heading')}
        subtitle={t('hhaCredentials.subheading')}
        action={
          <CustomChip
            size='small'
            skin='light'
            color={isConnected ? 'success' : 'secondary'}
            label={
              isConnected
                ? t('hhaCredentials.connected')
                : t('hhaCredentials.notConnected')
            }
          />
        }
      />

      {isFormOpen ? (
        <HhaCredentialsForm
          control={formProps.control}
          canSubmit={formProps.canSubmit}
          isSaving={formProps.isSaving}
          isReplacing={formProps.isReplacing}
          onSubmit={formProps.onSubmit}
          onCancel={formProps.onCancel}
        />
      ) : (
        <Box className='flex flex-wrap items-center justify-between gap-3 px-4.5 pb-4'>
          <Box className='min-w-0'>
            <Typography variant='body' sx={{fontWeight: 600}}>
              {t('hhaCredentials.appNameLabel', {appName})}
            </Typography>
            {lastChecked && (
              <Typography
                variant='body2'
                sx={{color: 'text.secondary', mt: 0.5}}
              >
                {t('hhaCredentials.lastChecked', {date: lastChecked})}
              </Typography>
            )}
          </Box>

          <Box className='flex flex-wrap gap-2'>
            <Button
              variant='outlined'
              size='small'
              startIcon={<Icon icon='mdi:key-change' fontSize={16} />}
              onClick={onReplace}
              disabled={isDisconnecting}
              className='w-auto'
            >
              {t('hhaCredentials.replace')}
            </Button>
            <Button
              variant='outlined'
              color='error'
              size='small'
              startIcon={<Icon icon='mdi:link-variant-off' fontSize={16} />}
              onClick={onDisconnectOpen}
              disabled={isDisconnecting}
              className='w-auto'
            >
              {t('hhaCredentials.disconnect')}
            </Button>
          </Box>
        </Box>
      )}

      <DisconnectHhaDialog
        isOpen={isDisconnectOpen}
        isPending={isDisconnecting}
        onCancel={onDisconnectCancel}
        onConfirm={onDisconnectConfirm}
      />
    </Card>
  );
};

export default HhaCredentialsCardUI;
