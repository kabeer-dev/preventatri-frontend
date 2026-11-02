'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

import Link from '@/shared/components/common/localeLink';
import {CardRowProps} from '@/shared/interfaces/uiComponents';

const TONE_SX = {
  default: {color: 'text.primary'},
  muted: {color: 'text.secondary'},
  selected: {color: 'text.primary', backgroundColor: 'customColors.brandTint'},
};

/**
 * One row in a caregiver card: a hairline above every row but the first, a
 * fixed gutter, and an optional thing on each side of the text. With `href`
 * it is a link, with `onClick` a button, otherwise plain content.
 */
const CardRow = ({
  href,
  onClick,
  leading,
  trailing,
  isFirst = false,
  tone = 'default',
  minHeight = 64,
  children,
}: CardRowProps) => {
  const isInteractive = Boolean(href || onClick);

  const sx = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    px: 4,
    py: 3.5,
    minHeight,
    textAlign: 'left',
    textDecoration: 'none',
    borderTop: isFirst ? 'none' : '1px solid',
    borderColor: 'customColors.rule',
    ...TONE_SX[tone],
    ...(isInteractive && {
      '&:hover': {backgroundColor: 'customColors.surfaceRaised'},
      '&.Mui-focusVisible, &:focus-visible': {
        outline: '2px solid',
        outlineColor: 'primary.main',
        outlineOffset: -2,
      },
    }),
  };

  const content = (
    <>
      {leading}
      <Box sx={{minWidth: 0, flexGrow: 1}}>{children}</Box>
      {trailing}
    </>
  );

  if (href) {
    return (
      <Box component={Link} href={href} sx={sx}>
        {content}
      </Box>
    );
  }

  if (onClick) {
    return (
      <ButtonBase onClick={onClick} sx={sx}>
        {content}
      </ButtonBase>
    );
  }

  return <Box sx={sx}>{content}</Box>;
};

export default CardRow;
