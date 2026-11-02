'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CustomChip from '@/@core/components/mui/chip';
import CardRow from '@/shared/components/common/CardRow';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverActivityItem} from '@/shared/interfaces/caregiverActivity';

interface Props {
  item: CaregiverActivityItem;
  isFirst: boolean;
  isDesktop: boolean;
}

/** The desktop row keeps the status in a column of its own. */
const STATUS_COLUMN_WIDTH = 260;

/** One sent thing: when, what, and where it got to. */
const ActivityRow = ({item, isFirst, isDesktop}: Props) => {
  const {t} = useTranslation();

  const status = (
    <CustomChip
      skin='light'
      size='small'
      label={item.statusLabel}
      color={item.statusColor}
    />
  );

  return (
    <CardRow
      href={item.href}
      isFirst={isFirst}
      leading={
        <Typography
          noWrap
          sx={{
            width: isDesktop ? 64 : 48,
            flex: 'none',
            alignSelf: 'flex-start',
            fontSize: '0.78125rem',
            color: 'text.secondary',
            pt: 0.25,
          }}
        >
          {item.timeLabel}
        </Typography>
      }
      trailing={
        isDesktop ? (
          <>
            <Box sx={{width: STATUS_COLUMN_WIDTH, flex: 'none'}}>{status}</Box>

            <Typography
              component='span'
              sx={{
                fontSize: '0.78125rem',
                fontWeight: 600,
                color: 'primary.main',
                whiteSpace: 'nowrap',
              }}
            >
              {t('caregiverActivity.view')}
            </Typography>
          </>
        ) : (
          <Icon
            icon='mdi:chevron-right'
            fontSize={18}
            color='var(--mui-palette-customColors-inkFaint)'
          />
        )
      }
    >
      <Box sx={{display: 'flex', alignItems: 'center', gap: 2, minWidth: 0}}>
        {item.kind === 'redFlags' && (
          <Box component='span' sx={{display: 'flex', color: 'error.main'}}>
            <Icon icon='mdi:flag-outline' fontSize={15} />
          </Box>
        )}

        <Typography noWrap sx={{fontSize: '0.9375rem', fontWeight: 600}}>
          {item.title}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: '0.78125rem',
          color: 'text.secondary',
          mt: 0.5,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
          wordBreak: 'normal',
          overflowWrap: 'break-word',
        }}
      >
        {item.detail}
      </Typography>

      {!isDesktop && <Box sx={{mt: 2}}>{status}</Box>}
    </CardRow>
  );
};

export default ActivityRow;
