'use client';

import Box from '@mui/material/Box';

import FollowUpsTable from './FollowUpsTable';

const FollowUpsPage = () => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      <FollowUpsTable />
    </Box>
  );
};

export default FollowUpsPage;
