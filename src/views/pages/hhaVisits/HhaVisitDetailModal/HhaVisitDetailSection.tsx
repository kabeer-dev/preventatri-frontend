'use client';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import DetailRow from '@/shared/components/common/DetailRow';
import {HhaVisitDetailSectionProps} from '@/shared/interfaces/hhaVisit';

/** One titled block of label/value rows inside the visit detail dialog. */
const HhaVisitDetailSection = ({section}: HhaVisitDetailSectionProps) => (
  <Box>
    <Typography variant='subtitle1' sx={{fontWeight: 600, mb: 1}}>
      {section.title}
    </Typography>
    <Divider sx={{mb: 1}} />
    {section.rows.map((row) => (
      <DetailRow
        key={row.label}
        label={`${row.label}:`}
        value={<Typography variant='body2'>{row.value}</Typography>}
      />
    ))}
  </Box>
);

export default HhaVisitDetailSection;
