'use client';

import Box from '@mui/material/Box';

import UsersTable from './UsersTable';

const UsersPage = () => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3.5}}>
      <UsersTable />
    </Box>
  );
};

export default UsersPage;
