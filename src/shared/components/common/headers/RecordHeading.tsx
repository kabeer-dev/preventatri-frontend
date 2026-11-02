'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomAvatar from '@/@core/components/mui/avatar';
import {getInitials} from '@/@core/utils/userUtils';
import Link from '@/shared/components/common/localeLink';
import {RECORD_HEADING} from '@/shared/constants/common';
import useOrgName from '@/shared/hooks/useOrgName';
import {RecordHeadingProps} from '@/shared/interfaces/layout';

const RecordHeading = ({
  crumb,
  crumbHref,
  name,
  avatar,
  avatarColor = 'primary',
  status,
  identityLine,
  nameInCrumb = true,
}: RecordHeadingProps) => {
  const orgName = useOrgName();

  return (
    <Box className='flex min-w-0 items-center gap-3'>
      <CustomAvatar
        src={avatar}
        skin='light'
        color={avatarColor}
        sx={{
          width: RECORD_HEADING.avatarSize,
          height: RECORD_HEADING.avatarSize,
          fontSize: '1.0625rem',
          flex: 'none',
        }}
      >
        {getInitials({name})}
      </CustomAvatar>

      <Box className='min-w-0'>
        {crumbHref ? (
          <Typography
            noWrap
            variant='small'
            component={Link}
            href={crumbHref}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'primary.main',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': {textDecoration: 'underline'},
            }}
          >
            <Icon icon='mdi:chevron-left' fontSize={16} />
            {crumb}
          </Typography>
        ) : (
          <Typography noWrap variant='small' sx={{color: 'text.secondary'}}>
            {orgName && `${orgName} / `}
            {nameInCrumb && `${crumb} / `}
            <Box component='span' sx={{color: 'text.primary', fontWeight: 600}}>
              {nameInCrumb ? name : crumb}
            </Box>
          </Typography>
        )}

        <Box className='flex min-w-0 items-center gap-2.5'>
          <Typography
            noWrap
            component='h1'
            variant='h1'
            sx={{fontSize: RECORD_HEADING.nameFontSize}}
          >
            {name}
          </Typography>
          {status}
        </Box>

        {identityLine && (
          <Typography noWrap variant='small' sx={{color: 'text.secondary'}}>
            {identityLine}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RecordHeading;
