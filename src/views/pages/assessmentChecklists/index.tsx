'use client';

import Box from '@mui/material/Box';

import AssessmentChecklistsTable from './AssessmentChecklistsTable';

const AssessmentChecklistsPage = () => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      <AssessmentChecklistsTable />
    </Box>
  );
};

export default AssessmentChecklistsPage;
