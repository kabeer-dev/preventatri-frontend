'use client';

import {ReactNode} from 'react';

import {Icon} from '@iconify/react';
import Box from '@mui/material/Box';
import {SxProps, Theme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import CustomAvatar from '@/@core/components/mui/avatar';
import {getInitials} from '@/@core/utils/userUtils';
import {Patient} from '@/shared/interfaces/patient';

interface PatientInfoBannerProps {
  patient: Patient;
  variant?: 'default' | 'error';
  subtitle?: string;
  avatarSize?: number;
  showContactInfo?: boolean;
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

const PatientInfoBanner = ({
  patient,
  variant = 'default',
  subtitle,
  avatarSize = 44,
  showContactInfo = false,
  children,
  sx,
}: PatientInfoBannerProps) => {
  const fullName = `${patient.firstName} ${patient.lastName}`;

  const address = [patient.streetAddress, patient.city, patient.zipCode]
    .filter(Boolean)
    .join(', ');

  const isError = variant === 'error';

  const textSecondaryColor = isError
    ? {color: 'error.contrastText', opacity: 0.85}
    : {color: 'text.secondary'};

  // Expanded layout when showContactInfo is true
  if (showContactInfo) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 3,
          py: 3.5,
          px: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper',
          ...(Array.isArray(sx) ? Object.assign({}, ...sx) : sx),
        }}
      >
        <CustomAvatar
          src={patient.avatar}
          skin='light'
          color={patient.avatarColor || 'primary'}
          sx={{
            width: avatarSize || 52,
            height: avatarSize || 52,
            fontSize: avatarSize && avatarSize < 48 ? '0.875rem' : '1.1rem',
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          {getInitials({name: fullName})}
        </CustomAvatar>
        <Box sx={{minWidth: 0, flex: 1}}>
          {subtitle && (
            <Typography
              variant='caption'
              sx={{
                display: 'block',
                color: 'text.disabled',
                mb: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
          <Typography
            variant='h6'
            sx={{fontWeight: 600, lineHeight: 1.3, mb: 1.5}}
            noWrap
          >
            {fullName}
          </Typography>

          <Box sx={{display: 'flex', flexDirection: 'column', gap: 0.75}}>
            {address && (
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <Icon
                  icon='mdi:map-marker-outline'
                  fontSize='0.95rem'
                  color='var(--mui-palette-text-secondary)'
                />
                <Typography
                  variant='body2'
                  noWrap
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {address}
                </Typography>
              </Box>
            )}
            {patient.phoneNo && (
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <Icon
                  icon='mdi:phone-outline'
                  fontSize='0.95rem'
                  color='var(--mui-palette-text-secondary)'
                />
                <Typography
                  variant='body2'
                  noWrap
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {patient.phoneNo}
                </Typography>
              </Box>
            )}
          </Box>
          {children}
        </Box>
      </Box>
    );
  }

  // Default compact layout (unchanged for existing usages)
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        py: 2.5,
        px: 3,
        borderRadius: 2,
        boxShadow: 3,
        ...(isError
          ? {
              background: (theme: Theme) =>
                `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
              color: 'error.contrastText',
            }
          : {
              bgcolor: 'background.paper',
            }),
        ...(Array.isArray(sx) ? Object.assign({}, ...sx) : sx),
      }}
    >
      <CustomAvatar
        src={patient.avatar}
        skin='light'
        color={isError ? 'error' : patient.avatarColor || 'primary'}
        sx={{
          width: avatarSize,
          height: avatarSize,
          fontSize: avatarSize <= 42 ? '0.875rem' : '1rem',
          flexShrink: 0,
          ...(isError && {
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'error.contrastText',
          }),
        }}
      >
        {getInitials({name: fullName})}
      </CustomAvatar>
      <Box sx={{minWidth: 0, flex: 1}}>
        {subtitle && (
          <Typography
            variant='caption'
            sx={{
              display: 'block',
              lineHeight: 1.2,
              ...(isError
                ? {color: 'error.contrastText', opacity: 0.8}
                : {color: 'text.secondary'}),
            }}
          >
            {subtitle}
          </Typography>
        )}
        <Typography
          variant='subtitle1'
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            ...(isError && {color: 'error.contrastText'}),
          }}
          noWrap
        >
          {fullName}
        </Typography>
        {address && (
          <Typography
            variant='caption'
            sx={{
              display: 'block',
              ...textSecondaryColor,
            }}
            noWrap
          >
            {address}
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default PatientInfoBanner;
