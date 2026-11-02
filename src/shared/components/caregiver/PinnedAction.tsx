'use client';

import {ReactNode} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {usePathname} from 'next/navigation';

import {controlHeight, layout, radius} from '@/@core/theme/spacing';
import Link from '@/shared/components/common/localeLink';
import {CAREGIVER_LAYOUT} from '@/shared/constants/caregiver';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import {isCaregiverFullScreenPath} from '@/shared/utils/routeUtils';

interface Props {
  label: string;

  /** Give either a destination or a handler, never both. */
  href?: string;
  onClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;

  /**
   * Sits to the left of the primary action, e.g. the Previous button. It keeps
   * its own width and the primary action takes the rest of the row.
   */
  secondary?: ReactNode;

  /** 'error' for the one destructive action: sending a red flag. */
  color?: 'primary' | 'error';
}

/**
 * The screen's one primary action. On a phone it is pinned above the tab bar
 * so a thumb always reaches it; on a desktop it just sits at the end of the
 * content.
 */
const PinnedAction = ({
  label,
  href,
  onClick,
  isLoading = false,
  isDisabled = false,
  secondary,
  color = 'primary',
}: Props) => {
  const pathname = usePathname();

  const isDesktop = useIsDesktop();

  // On a screen that hides the tab bar there is nothing to clear, so the bar
  // sits on the bottom edge itself.
  const bottomOffset = isCaregiverFullScreenPath({path: pathname})
    ? 0
    : CAREGIVER_LAYOUT.tabBarHeight;

  const linkProps = href ? {component: Link, href} : {};

  const button = (
    <Button
      {...linkProps}
      onClick={onClick}
      loading={isLoading}
      disabled={isDisabled}
      variant='contained'
      color={color}
      sx={{
        width: isDesktop ? 'auto' : '100%',
        minHeight: controlHeight.xl,
        px: 6,
        borderRadius: `${radius.md}px`,
        fontSize: '1rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Button>
  );

  // The secondary action keeps its natural width so a long primary label can
  // use the rest of the row instead of wrapping onto a second line.
  const row = (
    <Box sx={{display: 'flex', alignItems: 'stretch', gap: 2.5}}>
      {secondary && (
        <Box
          sx={{
            flex: 'none',
            display: 'flex',
            '& > *': {whiteSpace: 'nowrap'},
          }}
        >
          {secondary}
        </Box>
      )}

      <Box
        sx={{
          flex: isDesktop ? 'none' : 1,
          minWidth: 0,
          display: 'flex',
        }}
      >
        {button}
      </Box>
    </Box>
  );

  if (isDesktop) return <Box sx={{display: 'flex', pt: 2}}>{row}</Box>;

  return (
    <>
      {/* Keeps the last of the content clear of the pinned bar above. */}
      <Box sx={{height: controlHeight.xl + 32}} />

      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: bottomOffset,
          zIndex: (theme) => theme.zIndex.appBar,
          px: `${layout.phoneGutter}px`,
          py: 3,
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {row}
      </Box>
    </>
  );
};

export default PinnedAction;
