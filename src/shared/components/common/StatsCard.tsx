'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {alpha} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import useThemeColors from '@/@core/hooks/useThemeColors';
import {radius} from '@/@core/theme/spacing';
import Link from '@/shared/components/common/localeLink';
import NowTag from '@/shared/components/common/NowTag';
import {
  STATS_CARD,
  STATS_CARD_SEVERITY_TILES,
} from '@/shared/constants/dashboard';
import {StatsCardProps} from '@/shared/types/stats';

const StatsCard = ({
  title,
  icon,
  severity,
  stats,
  color = 'primary',
  subtitle,
  tinted = false,
  href,
  drillLabel,
  delta,
  scopeLabel,
  compact = false,
}: StatsCardProps) => {
  const themeColors = useThemeColors();
  const {color: mainColor, backgroundColor: bgColor} = themeColors[color].light;

  const severityConfig = severity
    ? STATS_CARD_SEVERITY_TILES[severity]
    : undefined;

  return (
    <Card
      elevation={tinted ? 0 : 6}
      sx={{
        // Fill the grid cell so cards in the same row share a uniform height
        // regardless of how many lines their title/subtitle wrap to.
        height: '100%',
        minHeight: compact ? STATS_CARD.compactMinHeight : STATS_CARD.minHeight,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: tinted ? alpha(mainColor, 0.08) : undefined,
      }}
    >
      <CardContent
        sx={{
          p: STATS_CARD.padding,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box className='flex items-center gap-2.5'>
          {(icon || severityConfig) && (
            <Avatar
              variant='rounded'
              sx={{
                width: STATS_CARD.iconTileSize,
                height: STATS_CARD.iconTileSize,
                bgcolor: severityConfig
                  ? `customColors.${severityConfig.bg}`
                  : bgColor,
                color: severityConfig
                  ? `customColors.${severityConfig.fg}`
                  : mainColor,
                borderRadius: `${radius.sm}px`,
                ...(severityConfig && {fontSize: STATS_CARD.glyphSize}),
              }}
            >
              {severityConfig ? (
                <Icon icon={severityConfig.glyph} fontSize='inherit' />
              ) : (
                icon
              )}
            </Avatar>
          )}
          <Typography variant='bodyStrong' sx={{color: 'text.secondary'}}>
            {title}
          </Typography>
          {scopeLabel && <NowTag label={scopeLabel} />}
        </Box>

        <Box
          className='flex flex-wrap items-baseline gap-2'
          sx={{
            mt: compact ? STATS_CARD.compactMetricGap : STATS_CARD.metricGap,
            minWidth: 0,
          }}
        >
          <Typography variant='metric' sx={{minWidth: 0}}>
            {stats}
          </Typography>
          {delta}
        </Box>

        {subtitle && (
          <Typography variant='small' sx={{mt: 1.5, color: 'text.disabled'}}>
            {subtitle}
          </Typography>
        )}

        {href && drillLabel && (
          <Typography
            component={Link}
            href={href}
            variant='small'
            className='no-underline hover:underline'
            sx={{mt: 'auto', pt: 3, fontWeight: 600, color: 'primary.main'}}
          >
            {drillLabel}
            <Box component='span' aria-hidden>
              {' \u2192'}
            </Box>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
