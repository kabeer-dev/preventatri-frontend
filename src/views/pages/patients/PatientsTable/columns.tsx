import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import SeverityIndicator from '@/shared/components/common/severity';
import {UserGridCell} from '@/shared/components/common/table/UserGridCell';
import {DETAIL_EMPTY_VALUE} from '@/shared/constants/common';
import {
  PATIENT_DRAWER_STEPS,
  PATIENT_SOURCE,
  PATIENT_VIEW_VARIANT,
} from '@/shared/constants/patients';
import {GetPatientColumnsOptions, Patient} from '@/shared/interfaces/patient';
import {CellType} from '@/shared/interfaces/tables';
import {
  buildPatientIdentityLine,
  getPatientStatusConfig,
} from '@/shared/utils/patientUtils';

import PatientCareTeamCell from './PatientCareTeamCell';
import PatientNextDueCell from './PatientNextDueCell';
import PatientTableRowActions from './PatientTableRowActions';

/**
 * Returns column definitions for the PatientsTable DataGrid
 */

export const getPatientColumns = (
  options: GetPatientColumnsOptions
): GridColDef[] => {
  const {
    onEdit,
    onDelete,
    onCareTeam,
    editLoadingId = null,
    editLoadingStep = PATIENT_DRAWER_STEPS.details,
    showEdit = true,
    showDelete = true,
    showActions = true,
    variant = PATIENT_VIEW_VARIANT.admin,
    workload = {},
    workloadStatus = 'ready',
    onRetryWorkload,
    t,
  } = options;

  // The caregiver reads the same table without the office's columns: no flag
  // history, no provenance, no row actions, and one column she acts on.
  const isCaregiverView = variant === PATIENT_VIEW_VARIANT.caregiver;

  const columns: GridColDef[] = [
    {
      flex: 0.26,
      minWidth: 232,
      field: 'name',
      headerName: t('patients.table.headers.name'),
      renderCell: ({row}: CellType<Patient>) => (
        <UserGridCell
          firstName={row.firstName}
          lastName={row.lastName}
          meta={buildPatientIdentityLine({patient: row})}
          avatar={row.avatar}
          avatarColor={row.avatarColor}
        />
      ),
    },
    {
      flex: 0.14,
      minWidth: 132,
      field: 'assignedRegion',
      headerName: t('patients.table.headers.region'),
      renderCell: ({row}: CellType<Patient>) => (
        <Typography noWrap variant='body' sx={{color: 'text.secondary'}}>
          {row.assignedRegion || row.countyName || DETAIL_EMPTY_VALUE}
        </Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 190,
      sortable: false,
      field: 'careTeam',
      headerName: t('patients.table.headers.careTeam'),
      renderCell: ({row}: CellType<Patient>) => (
        <PatientCareTeamCell patient={row} />
      ),
    },
    ...(isCaregiverView
      ? [
          {
            flex: 0.16,
            minWidth: 160,
            sortable: false,
            field: 'nextDue',
            headerName: t('patients.table.headers.nextDue'),
            renderCell: ({row}: CellType<Patient>) => (
              <PatientNextDueCell
                workload={workload[row.id]}
                workloadStatus={workloadStatus}
                onRetryWorkload={onRetryWorkload}
              />
            ),
          },
        ]
      : [
          {
            flex: 0.14,
            minWidth: 122,
            field: 'recentFlags',
            headerName: t('patients.table.headers.recentFlags'),
            sortable: false,
            renderCell: ({row}: CellType<Patient>) =>
              row.lastFlag ? (
                <SeverityIndicator flag={row.lastFlag} />
              ) : (
                <Typography
                  noWrap
                  variant='body'
                  sx={{color: 'text.secondary'}}
                >
                  {t('patients.table.noRecentFlag')}
                </Typography>
              ),
          },
        ]),
    ...(isCaregiverView
      ? []
      : [
          {
            flex: 0.12,
            minWidth: 130,
            field: 'status',
            headerName: t('patients.table.headers.status'),
            renderCell: ({row}: CellType<Patient>) => {
              const cfg = getPatientStatusConfig({patient: row});

              return (
                <CustomChip
                  skin='light'
                  size='small'
                  label={cfg.label}
                  color={cfg.color}
                  sx={{'& .MuiChip-label': {lineHeight: '18px'}}}
                />
              );
            },
          },
          {
            flex: 0.1,
            minWidth: 120,
            field: 'source',
            headerName: t('patients.table.headers.source'),
            renderCell: ({row}: CellType<Patient>) => {
              // The API returns the raw PatientSource enum; label and colour
              // are resolved here. Anything unrecognised falls back to Manual.
              const cfg =
                Object.values(PATIENT_SOURCE).find(
                  (option) => option.value === row.source
                ) ?? PATIENT_SOURCE.manual;

              return (
                <CustomChip
                  skin='light'
                  size='small'
                  label={cfg.label}
                  color={cfg.color}
                  sx={{'& .MuiChip-label': {lineHeight: '18px'}}}
                />
              );
            },
          },
        ]),
  ];

  if (showActions && !isCaregiverView) {
    columns.push({
      flex: 0.1,
      minWidth: 132,
      sortable: false,
      field: 'actions',
      headerName: t('patients.table.headers.action'),
      renderCell: ({row}: CellType<Patient>) => {
        if (row.archived) return null;

        const isLoading = editLoadingId === row.id;

        const isCareTeamLoading =
          isLoading && editLoadingStep === PATIENT_DRAWER_STEPS.careTeam;

        return (
          <PatientTableRowActions
            id={row.id}
            onEdit={onEdit}
            onCareTeam={onCareTeam}
            onDelete={onDelete}
            showEdit={showEdit}
            showDelete={showDelete}
            isEditLoading={isLoading && !isCareTeamLoading}
            isCareTeamLoading={isCareTeamLoading}
          />
        );
      },
    });
  }

  return columns;
};
