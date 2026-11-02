'use client';

import {ReactNode} from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import Icon from '@/@core/components/icon';
import CardRow from '@/shared/components/common/CardRow';

interface Props {
  title: string;
  subtitle: string;
  isFirst?: boolean;

  /** Left out for a row that only reports something, such as Language. */
  isOpen?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
}

/** One line in the Account card. Tapping it opens the form underneath. */
const AccountRow = ({
  title,
  subtitle,
  isFirst = false,
  isOpen = false,
  onToggle,
  children,
}: Props) => (
  <Box>
    <CardRow
      isFirst={isFirst}
      onClick={onToggle}
      trailing={
        onToggle && (
          <Icon
            icon={isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'}
            fontSize={18}
            color='var(--mui-palette-customColors-inkFaint)'
          />
        )
      }
    >
      <Typography noWrap sx={{fontSize: '0.9375rem', fontWeight: 600}}>
        {title}
      </Typography>

      <Typography
        noWrap
        sx={{fontSize: '0.78125rem', color: 'text.secondary', mt: 0.25}}
      >
        {subtitle}
      </Typography>
    </CardRow>

    {children && (
      <Collapse in={isOpen} unmountOnExit>
        <Box
          sx={{
            px: 4,
            pb: 5,
            borderTop: '1px solid',
            borderColor: 'customColors.rule',
            pt: 5,
          }}
        >
          {children}
        </Box>
      </Collapse>
    )}
  </Box>
);

export default AccountRow;
