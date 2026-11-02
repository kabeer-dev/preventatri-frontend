'use client';

import Typography from '@mui/material/Typography';

import Link from '@/shared/components/common/localeLink';
import {HhaSyncRecordLinkProps} from '@/shared/interfaces/hhaSyncHistory';
import {resolveRecordHref} from '@/shared/utils/hhaSyncHistoryUtils';

// The record's name, linked to its page; the HHA id when it is not here (yet).
const HhaSyncRecordLink = ({record, fallback}: HhaSyncRecordLinkProps) => {
  const href = resolveRecordHref({record});

  if (!record || !href) {
    return (
      <Typography noWrap variant='body2' sx={{color: 'text.secondary'}}>
        {record?.name || fallback}
      </Typography>
    );
  }

  // A plain inline link ignores noWrap's ellipsis and runs over its neighbours.
  return (
    <Typography
      noWrap
      variant='body2'
      component={Link}
      href={href}
      onClick={(event: React.MouseEvent) => event.stopPropagation()}
      sx={{
        display: 'inline-block',
        maxWidth: '100%',
        verticalAlign: 'top',
        fontWeight: 500,
        color: 'primary.main',
      }}
    >
      {record.name || fallback}
    </Typography>
  );
};

export default HhaSyncRecordLink;
