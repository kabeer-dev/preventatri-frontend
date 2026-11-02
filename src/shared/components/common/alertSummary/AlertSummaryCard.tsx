'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import {radius} from '@/@core/theme/spacing';
import Link from '@/shared/components/common/localeLink';
import {ALERT_SUMMARY_CARD} from '@/shared/constants/alertSummary';
import {AlertSummaryCardProps} from '@/shared/interfaces/alertSummary';

const AlertSummaryCard = ({
  label,
  scope,
  glyph,
  tileBackground,
  tileColor,
  valueColor,
  value,
  href,
}: AlertSummaryCardProps) => (
  <Card
    elevation={1}
    {...(href && {component: Link, href})}
    sx={{
      color: 'inherit',
      textDecoration: 'none',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 3.25,
      px: 4,
      py: 3.75,
      borderRadius: `${radius.md}px`,
    }}
  >
    <Box
      component='span'
      aria-hidden
      sx={{
        width: ALERT_SUMMARY_CARD.tileSize,
        height: ALERT_SUMMARY_CARD.tileSize,
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        borderRadius: `${radius.sm}px`,
        bgcolor: tileBackground,
        color: tileColor,
        fontSize: ALERT_SUMMARY_CARD.glyphSize,
      }}
    >
      <Icon icon={glyph} fontSize='inherit' />
    </Box>

    <Box sx={{minWidth: 0}}>
      <Typography
        component='div'
        sx={{
          fontSize: ALERT_SUMMARY_CARD.valueSize,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.025em',
          color: valueColor,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          mt: 1,
          fontSize: ALERT_SUMMARY_CARD.labelSize,
          color: 'customColors.inkSoft',
        }}
      >
        {label}
      </Typography>
    </Box>

    <Box
      component='span'
      sx={{
        ml: 'auto',
        flex: 'none',
        px: 2,
        py: 0.75,
        borderRadius: `${radius.full}px`,
        bgcolor: 'customColors.rule',
        color: 'text.secondary',
        fontSize: ALERT_SUMMARY_CARD.scopeSize,
        fontWeight: 600,
      }}
    >
      {scope}
    </Box>
  </Card>
);

export default AlertSummaryCard;
