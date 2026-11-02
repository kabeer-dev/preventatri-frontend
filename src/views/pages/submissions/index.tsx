'use client';

import Box from '@mui/material/Box';

import SubmissionsTable from './SubmissionsTable';

const SubmissionsPage = () => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      <SubmissionsTable />
    </Box>
  );
};

export default SubmissionsPage;
