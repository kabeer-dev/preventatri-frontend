'use client';

import DataTable from '@/shared/components/common/table/DataTable';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {
  EmergencyFlagListItem,
  EmergencyFlagsTableUIProps,
} from '@/shared/interfaces/emergencyFlag';

import {getEmergencyFlagColumns} from './columns';

const EmergencyFlagsTableUI = ({
  emergencyFlags,
  isLoading = false,
  paginationProps,
  onEditEmergencyFlag = () => {},
  onVoidEmergencyFlag = () => {},
  title,
  hidePatientColumn = false,
  hideCaregiverColumn = false,
  alwaysShowCaregiverColumn = false,
  hideActions = false,
  noRowsLabel,
  toolbar,
  titleInCard = false,
  compact = false,
  titleAction,
}: EmergencyFlagsTableUIProps) => {
  const {t} = useTranslation();
  const router = useLocaleRouter();
  const {isAdmin, isCaregiver} = useUserRole();

  const shouldHideActions = !isAdmin || hideActions || compact;

  const columns = getEmergencyFlagColumns({
    onEdit: onEditEmergencyFlag,
    onVoid: onVoidEmergencyFlag,
    showEdit: false,
    showVoid: isAdmin,
    showActions: !shouldHideActions,
    showPatient: !hidePatientColumn,
    showCaregiver:
      alwaysShowCaregiverColumn ||
      !(isCaregiver || hideCaregiverColumn || compact),
    showVoidedAt: !(isCaregiver || compact),
    showSeverity: !isCaregiver,
    showDescription: isCaregiver,
    descriptionHeader: isCaregiver
      ? t('caregiverPortal.patient.redFlagDescription')
      : undefined,
    splitReason: compact,
    showStatus: !compact,
    relativeCreatedAt: compact,
    t,
  });

  return (
    <DataTable<EmergencyFlagListItem>
      rows={emergencyFlags}
      columns={columns}
      title={title}
      loading={isLoading}
      noRowsLabel={noRowsLabel || t('emergencyFlags.table.noRowsLabel')}
      toolbar={toolbar}
      titleInCard={titleInCard}
      titleAction={titleAction}
      hideTotal={compact}
      serverSidePagination={paginationProps}
      onRowClick={(params) =>
        router.push({
          url: DASHBOARD_ROUTES.emergencyFlags.single({id: params.row.id}),
        })
      }
    />
  );
};

export default EmergencyFlagsTableUI;
