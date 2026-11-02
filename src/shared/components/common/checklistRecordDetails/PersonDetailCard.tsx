import {ReactNode} from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import Link from '@/shared/components/common/localeLink';
import useTranslation from '@/shared/hooks/useTranslation';

interface DetailRow {
  icon: string;
  label: string;
  value?: ReactNode;
}

interface PersonDetailCardProps {
  titleIcon: string;
  title: string;
  rows: DetailRow[];
  profileHref?: string;
}

const SidebarRow = ({icon, label, value}: DetailRow) => (
  <div className='flex items-start gap-2.5 mb-2.5'>
    <Icon
      icon={icon}
      fontSize='1.1rem'
      color='var(--mui-palette-text-secondary)'
      style={{marginTop: 2, flexShrink: 0}}
    />
    <div className='min-w-0 flex-1'>
      <Typography
        variant='caption'
        className='block uppercase font-semibold'
        sx={{
          color: 'text.disabled',
          lineHeight: 1.2,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Typography>
      {value !== null && value !== undefined && value !== '' ? (
        typeof value === 'string' ? (
          <Typography variant='body2' className='break-words'>
            {value}
          </Typography>
        ) : (
          value
        )
      ) : (
        <Typography
          variant='body2'
          className='break-words'
          sx={{color: 'text.disabled'}}
        >
          {'N/A'}
        </Typography>
      )}
    </div>
  </div>
);

const PersonDetailCard = ({
  titleIcon,
  title,
  rows,
  profileHref,
}: PersonDetailCardProps) => {
  const {t} = useTranslation();

  return (
    <Card elevation={6}>
      <CardContent className='p-4'>
        <Typography
          variant='subtitle1'
          className='font-bold mb-4 flex items-center gap-2'
        >
          <Icon
            icon={titleIcon}
            fontSize='1.25rem'
            color='var(--mui-palette-primary-main)'
          />
          {title}
        </Typography>

        {rows.map((row) => (
          <SidebarRow key={row.label} {...row} />
        ))}

        {profileHref && (
          <Button
            component={Link}
            href={profileHref}
            size='small'
            variant='outlined'
            color='primary'
            fullWidth
            className='mt-3 font-semibold'
            endIcon={<Icon icon='mdi:arrow-right' fontSize='1rem' />}
          >
            {t('submissions.detail.viewProfile')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonDetailCard;
