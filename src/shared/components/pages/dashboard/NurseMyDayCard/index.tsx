'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import PanelCard from '@/shared/components/common/cards/PanelCard';
import Link from '@/shared/components/common/localeLink';
import {PANEL_CARD} from '@/shared/constants/common';
import {
  NURSE_DASHBOARD_ITEM_TYPE_COLORS,
  NURSE_DASHBOARD_ITEM_TYPES,
} from '@/shared/constants/nurseDashboard';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  NurseMyDayCardProps,
  NurseMyDayRowProps,
} from '@/shared/interfaces/nurse';

const MY_DAY_SKELETON_ROWS = 4;

const typeLabelKeyByValue = Object.fromEntries(
  Object.values(NURSE_DASHBOARD_ITEM_TYPES).map((type) => [
    type.value,
    type.labelKey,
  ])
);

const NurseMyDayRow = ({item, href}: NurseMyDayRowProps) => {
  const {t} = useTranslation();

  return (
    <Box
      component={href ? Link : 'div'}
      href={href}
      sx={{
        display: 'grid',
        gridTemplateColumns: '48px minmax(0, 1fr) auto',
        gap: 2.5,
        alignItems: 'baseline',
        px: PANEL_CARD.paddingX,
        py: 2.5,
        borderTop: '1px solid',
        borderColor: 'customColors.rule',
        color: 'inherit',
      }}
    >
      <Typography variant='mono' sx={{color: 'text.secondary'}}>
        {item.dueTime}
      </Typography>
      <Box sx={{minWidth: 0}}>
        <Typography variant='bodyStrong' noWrap sx={{display: 'block'}}>
          {item.title}
        </Typography>
        <Typography variant='small' noWrap sx={{color: 'text.disabled'}}>
          {item.patientName}
        </Typography>
      </Box>
      <CustomChip
        size='small'
        label={t(typeLabelKeyByValue[item.type])}
        color={NURSE_DASHBOARD_ITEM_TYPE_COLORS[item.type]}
      />
    </Box>
  );
};

const NurseMyDayCard = ({items, isLoading, isError}: NurseMyDayCardProps) => {
  const {t} = useTranslation();

  const isEmpty = !isLoading && items.length === 0;

  return (
    <PanelCard
      title={t('dashboard.nurseDashboard.myDay.title')}
      bodyPadding={0}
    >
      {isLoading &&
        Array.from({length: MY_DAY_SKELETON_ROWS}).map((_, index) => (
          <Skeleton key={index} height={48} sx={{mx: PANEL_CARD.paddingX}} />
        ))}

      {isEmpty && (
        <Typography
          variant='small'
          sx={{
            color: 'text.secondary',
            display: 'block',
            p: PANEL_CARD.paddingX,
          }}
        >
          {t(
            isError
              ? 'dashboard.nurseDashboard.myDay.error'
              : 'dashboard.nurseDashboard.myDay.empty'
          )}
        </Typography>
      )}

      {items.map((item) => (
        <NurseMyDayRow
          key={item.id}
          item={item}
          href={
            item.type === NURSE_DASHBOARD_ITEM_TYPES.FOLLOW_UP.value
              ? DASHBOARD_ROUTES.followUps.single({id: item.id})
              : undefined
          }
        />
      ))}
    </PanelCard>
  );
};

export default NurseMyDayCard;
