'use client';

import Box from '@mui/material/Box';

import HhaVisitsTable from './HhaVisitsTable';

const HhaVisitsPage = () => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      <HhaVisitsTable />
    </Box>
  );
};

export default HhaVisitsPage;
