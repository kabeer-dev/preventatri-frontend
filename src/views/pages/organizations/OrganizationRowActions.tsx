import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {ORGANIZATION_STATUS_ACTIONS} from '@/shared/constants/superAdmin';
import useTranslation from '@/shared/hooks/useTranslation';
import {OrganizationRowActionsProps} from '@/shared/interfaces/superAdmin';

/** One row's actions; which ones show follows the organization's status. */
const OrganizationRowActions = ({
  row,
  onAction,
}: OrganizationRowActionsProps) => {
  const {t} = useTranslation();

  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
      {ORGANIZATION_STATUS_ACTIONS[row.status].map((action) => (
        <Button
          key={action}
          size='small'
          variant='outlined'
          color={
            action === 'approve' || action === 'reactivate'
              ? 'primary'
              : 'error'
          }
          onClick={() => onAction({organization: row, action})}
        >
          {t(`superAdmin.actions.${action}`)}
        </Button>
      ))}
    </Box>
  );
};

export default OrganizationRowActions;
