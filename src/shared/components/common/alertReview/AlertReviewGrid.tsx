'use client';

import Box from '@mui/material/Box';

import {ALERT_REVIEW_COLUMNS} from '@/shared/constants/alertReview';
import {AlertReviewGridProps} from '@/shared/interfaces/alertReview';

const AlertReviewGrid = ({
  people,
  history,
  evidence,
  resolution,
}: AlertReviewGridProps) => {
  const hasResolution = Boolean(resolution);

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 4,
        alignItems: 'start',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          lg: hasResolution
            ? ALERT_REVIEW_COLUMNS.wide
            : ALERT_REVIEW_COLUMNS.withoutResolution,
        },
        gridTemplateRows: {lg: 'auto 1fr'},
        gridTemplateAreas: hasResolution
          ? {
              xs: `'evidence' 'resolution' 'people' 'history'`,
              sm: `'people' 'evidence' 'resolution' 'history'`,
              lg: `'people evidence resolution' 'history evidence resolution'`,
            }
          : {
              xs: `'evidence' 'people' 'history'`,
              sm: `'people' 'evidence' 'history'`,
              lg: `'people evidence' 'history evidence'`,
            },
      }}
    >
      {people && (
        <Box
          sx={{
            gridArea: 'people',
            minWidth: 0,
            display: 'grid',
            gap: {xs: 4, lg: 3.5},
            alignItems: 'start',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'minmax(0, 1fr)',
            },
          }}
        >
          {people}
        </Box>
      )}

      {history && <Box sx={{gridArea: 'history', minWidth: 0}}>{history}</Box>}

      <Box sx={{gridArea: 'evidence', minWidth: 0}}>{evidence}</Box>

      {hasResolution && (
        <Box
          sx={{gridArea: 'resolution', minWidth: 0, display: 'grid', gap: 3.5}}
        >
          {resolution}
        </Box>
      )}
    </Box>
  );
};

export default AlertReviewGrid;
