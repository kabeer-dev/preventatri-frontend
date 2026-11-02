import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CustomChip from '@/@core/components/mui/chip';
import SeverityIndicator from '@/shared/components/common/severity';
import DataTableRowActions from '@/shared/components/common/table/DataTableRowActions';
import {getRedFlagStatusConfig} from '@/shared/constants/redFlag';
import {
  EmergencyFlagListItem,
  GetEmergencyFlagColumnsOptions,
} from '@/shared/interfaces/emergencyFlag';
import {CellType} from '@/shared/interfaces/tables';
import {getReasonLabel, isFlagVoidable} from '@/shared/utils/redFlagUtils';

import FlagRaisedCell from './FlagRaisedCell';
import FlagTimestampCell from './FlagTimestampCell';

// Column order follows the alerts board: severity first, because it decides
// what gets read next, then who it is about and what was found.
export const getEmergencyFlagColumns = ({
  onEdit,
  onVoid,
  showEdit = true,
  showVoid = true,
  showActions = true,
  showPatient = true,
  showCaregiver = true,
  showVoidedAt = true,
  showSeverity = true,
  showDescription = false,
  descriptionHeader,
  splitReason = false,
  showStatus = true,
  relativeCreatedAt = false,
  t,
}: GetEmergencyFlagColumnsOptions): GridColDef[] => {
  const reasonColumn: GridColDef = {
    flex: 0.2,
    minWidth: 180,
    field: 'reason',
    headerName: t(
      splitReason
        ? 'emergencyFlags.table.headers.whatTripped'
        : 'emergencyFlags.table.headers.reason'
    ),
    renderCell: ({row}: CellType<EmergencyFlagListItem>) => (
      <Typography noWrap variant='body' sx={{color: 'text.secondary'}}>
        {getReasonLabel({reason: row.reason})}
      </Typography>
    ),
  };

  // Who and what, on one row: the finding is meaningless without the patient
  // and the patient row is unreadable without the finding. With the patient
  // column hidden the finding still has to stand on its own.
  const subjectColumn: GridColDef = showPatient
    ? {
        flex: 0.26,
        minWidth: 220,
        field: 'patientName',
        headerName: t(
          splitReason
            ? 'emergencyFlags.table.headers.patient'
            : 'emergencyFlags.table.headers.patientName'
        ),
        renderCell: ({row}: CellType<EmergencyFlagListItem>) => (
          <Box sx={{minWidth: 0}}>
            <Typography noWrap variant='bodyStrong'>
              {row.patientName}
            </Typography>
            {!splitReason && (
              <Typography noWrap variant='small' sx={{color: 'text.secondary'}}>
                {getReasonLabel({reason: row.reason})}
              </Typography>
            )}
          </Box>
        ),
      }
    : reasonColumn;

  const statusColumn: GridColDef = {
    flex: 0.14,
    minWidth: 140,
    field: 'status',
    headerName: t('emergencyFlags.table.headers.status'),
    renderCell: ({row}: CellType<EmergencyFlagListItem>) => {
      const {label, color} = getRedFlagStatusConfig({status: row.status, t});

      return <CustomChip label={label} color={color} />;
    },
  };

  const columns: GridColDef[] = [
    ...(showSeverity
      ? [
          {
            flex: 0.12,
            minWidth: 130,
            field: 'flag',
            headerName: t('emergencyFlags.table.headers.flag'),
            renderCell: ({row}: CellType<EmergencyFlagListItem>) => (
              <SeverityIndicator flag={row.flag} />
            ),
          },
        ]
      : []),
    subjectColumn,
    ...(showDescription
      ? [
          {
            flex: 0.3,
            minWidth: 220,
            field: 'description',
            headerName:
              descriptionHeader ||
              t('emergencyFlags.table.headers.description'),
            renderCell: ({row}: CellType<EmergencyFlagListItem>) => (
              <Typography
                noWrap
                variant='body'
                title={row.description}
                sx={{color: 'text.secondary'}}
              >
                {row.description || 'N/A'}
              </Typography>
            ),
          },
        ]
      : []),
    ...(showCaregiver
      ? [
          {
            flex: 0.16,
            minWidth: 160,
            field: 'caregiverName',
            headerName: t('emergencyFlags.table.headers.caregiverName'),
            renderCell: ({row}: CellType<EmergencyFlagListItem>) => (
              <Typography noWrap variant='body' sx={{color: 'text.secondary'}}>
                {row.caregiverName}
              </Typography>
            ),
          },
        ]
      : []),
    statusColumn,
    {
      flex: 0.14,
      minWidth: 140,
      field: 'createdAt',
      headerName: t('emergencyFlags.table.headers.createdAt'),
      renderCell: ({row}: CellType<EmergencyFlagListItem>) => (
        <FlagRaisedCell flag={row} relative={relativeCreatedAt} />
      ),
    },
  ];

  if (showPatient && splitReason)
    columns.splice(columns.indexOf(subjectColumn) + 1, 0, reasonColumn);

  if (!showStatus) columns.splice(columns.indexOf(statusColumn), 1);

  if (showVoidedAt) {
    columns.push({
      flex: 0.15,
      minWidth: 180,
      field: 'voidedAt',
      headerName: t('emergencyFlags.table.headers.voidedAt'),
      renderCell: ({row}: CellType<EmergencyFlagListItem>) => (
        <FlagTimestampCell date={row.voidedAt} />
      ),
    });
  }

  if (showActions) {
    columns.push({
      flex: 0.12,
      minWidth: 150,
      sortable: false,
      field: 'action',
      headerName: t('emergencyFlags.table.headers.action'),
      renderCell: ({row}: CellType<EmergencyFlagListItem>) => (
        <DataTableRowActions
          id={row.id}
          onEdit={onEdit}
          showEdit={showEdit}
          showDelete={false}
          showVoid={showVoid && isFlagVoidable(row)}
          onVoid={onVoid}
        />
      ),
    });
  }

  return columns;
};
