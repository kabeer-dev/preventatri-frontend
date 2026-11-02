'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import {SxProps, Theme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomAvatar from '@/@core/components/mui/avatar';
import CustomChip from '@/@core/components/mui/chip';
import {getInitials} from '@/@core/utils/userUtils';
import useTranslation from '@/shared/hooks/useTranslation';
import {UserProfileCardProps} from '@/shared/interfaces/userProfile';

// Common styles for the profile avatar

const avatarStyles: SxProps<Theme> = {
  width: 100,
  height: 100,
  fontWeight: 600,
  mb: 4,
};

/**
 * Generic profile card component for displaying user information.
 * Used by the nurse, caregiver and case manager detail pages.
 */

const UserProfileCard = ({
  avatar,
  avatarColor = 'warning',
  name,
  role,
  roleColor = 'primary',
  stats,
  details,
}: UserProfileCardProps) => {
  const {t} = useTranslation();

  return (
    <Card>
      <CardContent
        sx={{
          pt: 6,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {/* Avatar */}
        {avatar ? (
          <CustomAvatar
            src={avatar}
            variant='circular'
            alt={name}
            sx={avatarStyles}
          />
        ) : (
          <CustomAvatar
            skin='light'
            variant='circular'
            color={avatarColor}
            sx={{
              ...avatarStyles,
              fontSize: '2.5rem',
            }}
          >
            {getInitials({name})}
          </CustomAvatar>
        )}

        {/* Name */}
        <Typography variant='h6' sx={{mb: 1}}>
          {name}
        </Typography>

        {role && <CustomChip label={role} color={roleColor} sx={{mb: 4}} />}

        {/* Stats Row */}
        {stats && stats.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              mb: 4,
            }}
          >
            {stats.map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={stat.color}
                  sx={{mr: 2, width: 40, height: 40}}
                >
                  <Icon icon={stat.icon} fontSize='1.25rem' />
                </CustomAvatar>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: '500',
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant='caption'
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>

      <Divider sx={{my: 0}} />
      <CardContent sx={{pt: 4}}>
        <Typography variant='subtitle1' sx={{fontWeight: 600, mb: 3}}>
          {t('commonContent.details')}
        </Typography>

        {/* General Details */}
        {details && details.length > 0 && (
          <Box sx={{pb: 1}}>
            {details.map((detail, index) => (
              <Box
                key={detail.label}
                sx={{
                  display: 'flex',
                  mb: index < details.length - 1 ? 2 : 0,
                }}
              >
                <Typography
                  sx={{
                    mr: 2,
                    flexShrink: 0,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: 'text.primary',
                  }}
                >
                  {detail.label}:
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    minWidth: 0,
                    overflowWrap: 'anywhere',
                    color: 'text.secondary',
                  }}
                >
                  {detail.value}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
