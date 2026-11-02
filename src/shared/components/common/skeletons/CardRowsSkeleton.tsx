import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import SkeletonRow from '@/shared/components/common/skeletons/SkeletonRow';
import SkeletonStatus from '@/shared/components/common/skeletons/SkeletonStatus';
import {CARD_ROWS_SKELETON} from '@/shared/constants/skeletons';
import {CardRowsSkeletonProps} from '@/shared/interfaces/skeletons';

const CardRowsSkeleton = ({
  rows = CARD_ROWS_SKELETON.rows,
  row,
  sx,
}: CardRowsSkeletonProps) => (
  <>
    <SkeletonStatus />

    <Card aria-busy='true' sx={sx}>
      {Array.from({length: rows}, (_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 4,
            py: 3.5,
            minHeight: CARD_ROWS_SKELETON.minHeight,
            borderTop: index === 0 ? 'none' : '1px solid',
            borderColor: 'customColors.rule',
          }}
        >
          <SkeletonRow {...row} sx={{flex: 1, minWidth: 0}} />
        </Box>
      ))}
    </Card>
  </>
);

export default CardRowsSkeleton;
