'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import Icon from '@/@core/components/icon';
import DataTable from '@/shared/components/common/table/DataTable';
import useTranslation from '@/shared/hooks/useTranslation';
import {PatientAssignmentsCardProps} from '@/shared/interfaces/patientDetails';
import {ChecklistAssignmentItem} from '@/shared/interfaces/userProfile';

import {getPatientAssignmentColumns} from './columns';

const PatientAssignmentsCard = ({
  assignments,
  onAssignCaregiver,
  isAssignDisabled = false,
}: PatientAssignmentsCardProps) => {
  const {t} = useTranslation();

  const columns = getPatientAssignmentColumns({t});

  return (
    <DataTable<ChecklistAssignmentItem>
      rows={assignments}
      columns={columns}
      titleInCard
      title={t('patients.details.assignments.title')}
      titleAction={
        onAssignCaregiver && (
          <Tooltip
            title={
              isAssignDisabled ? t('patients.assignmentsDisabledTooltip') : ''
            }
          >
            <Box component='span'>
              <Button
                variant='outlined'
                size='small'
                onClick={onAssignCaregiver}
                disabled={isAssignDisabled}
                startIcon={<Icon icon='mdi:plus' fontSize={14} aria-hidden />}
              >
                {t('patients.details.assignments.assignCaregiver')}
              </Button>
            </Box>
          </Tooltip>
        )
      }
      noRowsLabel={t('patients.details.assignments.empty')}
    />
  );
};

export default PatientAssignmentsCard;
