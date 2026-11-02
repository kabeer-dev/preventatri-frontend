'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import PanelCard from '@/shared/components/common/cards/PanelCard';
import Link from '@/shared/components/common/localeLink';
import {PANEL_CARD} from '@/shared/constants/common';
import {DASHBOARD_STAT_EMPTY_PLACEHOLDER} from '@/shared/constants/dashboard';
import {
  buildNurseSubmissionsHref,
  NURSE_ASSESSMENT_COUNTS,
} from '@/shared/constants/nurseDashboard';
import {SKELETON_TEXT_WIDTH} from '@/shared/constants/skeletons';
import useTranslation from '@/shared/hooks/useTranslation';
import {NurseAssessmentsCardProps} from '@/shared/interfaces/nurse';

const NurseAssessmentsCard = ({
  counts,
  isLoading,
}: NurseAssessmentsCardProps) => {
  const {t} = useTranslation();

  return (
    <PanelCard
      title={t('dashboard.nurseDashboard.assessments.title')}
      actionLabel={t('dashboard.nurseDashboard.assessments.action')}
      actionHref={buildNurseSubmissionsHref()}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 4.5,
          px: PANEL_CARD.paddingX,
          py: PANEL_CARD.headerPaddingY,
        }}
      >
        {NURSE_ASSESSMENT_COUNTS.map(({key, labelKey, color, tab}) => (
          <Box
            key={key}
            component={Link}
            href={buildNurseSubmissionsHref({tab})}
            sx={{
              color: 'inherit',
              '&:hover .MuiTypography-small': {color: 'primary.main'},
            }}
          >
            <Typography
              variant='mono'
              sx={{display: 'block', fontSize: 24, color}}
            >
              {isLoading ? (
                <Skeleton width={SKELETON_TEXT_WIDTH.sm} />
              ) : (
                (counts?.[key] ?? DASHBOARD_STAT_EMPTY_PLACEHOLDER)
              )}
            </Typography>
            <Typography variant='small' sx={{color: 'text.secondary'}}>
              {t(labelKey)}
            </Typography>
          </Box>
        ))}
      </Box>
    </PanelCard>
  );
};

export default NurseAssessmentsCard;
