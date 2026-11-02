'use client';

import CustomAvatar from '@/@core/components/mui/avatar';
import {getInitials} from '@/@core/utils/userUtils';
import ActiveFlagField from '@/shared/components/common/activeFlag/ActiveFlagField';
import {ACTIVE_FLAG_MODAL_SIZES} from '@/shared/constants/flag';
import {ActiveFlagPersonFieldProps} from '@/shared/interfaces/flag';

const ActiveFlagPersonField = ({
  label,
  name,
  color,
}: ActiveFlagPersonFieldProps) => (
  <ActiveFlagField
    label={label}
    startAdornment={
      <CustomAvatar
        skin='light'
        color={color}
        sx={{
          width: ACTIVE_FLAG_MODAL_SIZES.initials,
          height: ACTIVE_FLAG_MODAL_SIZES.initials,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {getInitials({name})}
      </CustomAvatar>
    }
  >
    {name}
  </ActiveFlagField>
);

export default ActiveFlagPersonField;
