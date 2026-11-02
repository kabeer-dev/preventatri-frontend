'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import {radius} from '@/@core/theme/spacing';
import Link from '@/shared/components/common/localeLink';
import {PANEL_CARD} from '@/shared/constants/common';
import {PanelCardProps} from '@/shared/interfaces/uiComponents';

const PanelCard = ({
  title,
  subtitle,
  icon,
  iconColor,
  iconBackground,
  actionLabel,
  actionHref,
  bodyPadding,
  children,
}: PanelCardProps) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: PANEL_CARD.headerGap,
        px: PANEL_CARD.paddingX,
        py: PANEL_CARD.headerPaddingY,
        borderBottom: '1px solid',
        borderColor: 'customColors.ruleStrong',
      }}
    >
      {icon && (
        <Box
          sx={{
            width: PANEL_CARD.iconTileSize,
            height: PANEL_CARD.iconTileSize,
            borderRadius: `${radius.sm}px`,
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
            color: iconColor,
            backgroundColor: iconBackground,
          }}
        >
          {icon}
        </Box>
      )}

      <Box sx={{minWidth: 0}}>
        <Typography variant='h3' component='h2'>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant='small' sx={{color: 'text.disabled'}}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {actionLabel && actionHref && (
        <Typography
          component={Link}
          href={actionHref}
          variant='small'
          sx={{
            ml: 'auto',
            flex: 'none',
            fontWeight: 600,
            color: 'primary.main',
          }}
        >
          {actionLabel} &rarr;
        </Typography>
      )}
    </Box>

    <Box sx={{flex: '1 1 auto', minHeight: 0, p: bodyPadding}}>{children}</Box>
  </Card>
);

export default PanelCard;
