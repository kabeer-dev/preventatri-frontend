import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import {SkeletonTextProps} from '@/shared/interfaces/skeletons';

const SkeletonText = ({variant = 'body1', width, sx}: SkeletonTextProps) => (
  <Typography component='div' variant={variant} sx={sx}>
    <Skeleton width={width} sx={{maxWidth: '100%'}} />
  </Typography>
);

export default SkeletonText;
