'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import EmptyLine from '@/shared/components/common/EmptyLine';
import ListSearchField from '@/shared/components/common/listToolbar/ListSearchField';
import CardRowsSkeleton from '@/shared/components/common/skeletons/CardRowsSkeleton';
import DataTable from '@/shared/components/common/table/DataTable';
import DataTableFooter from '@/shared/components/common/table/DataTableFooter';
import {topBarSearchFieldSx} from '@/shared/components/layout/topBarSearch/styles';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {TABLE_PAGINATION} from '@/shared/constants/common';
import {TOP_BAR_SEARCH_WIDTH} from '@/shared/constants/globalSearch';
import {WIDGET_SKELETONS} from '@/shared/constants/pageSkeletons';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {PATIENT_VIEW_VARIANT} from '@/shared/constants/patients';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {Patient, PatientsTableUIProps} from '@/shared/interfaces/patient';

import {getPatientColumns} from './columns';
import PatientRow from './PatientRow';

/**
 * Presentational component for the PatientsTable
 * Uses the generic DataTable component
 */

const PatientsTableUI = ({
  patients,
  isLoading = false,
  paginationProps,
  toolbar,
  onAddPatient = () => {},
  onEditPatient = () => {},
  onEditCareTeam,
  onDeletePatient = () => {},
  editLoadingId = null,
  editLoadingStep,
  showAddButton = true,
  readOnly = false,
  addButtonText,
  actionSlot,
  title,
  variant = PATIENT_VIEW_VARIANT.admin,
  workload,
  workloadStatus = 'ready',
  onRetryWorkload,
}: PatientsTableUIProps) => {
  const {t} = useTranslation();
  const router = useLocaleRouter();

  const isDesktop = useIsDesktop();

  const isCaregiverView = variant === PATIENT_VIEW_VARIANT.caregiver;

  // The caregiver's phone reads the same page of the same list as rows, so
  // search, paging and "late" mean the same thing on both of her screens.
  if (isCaregiverView && !isDesktop) {
    const rowCount = paginationProps?.rowCount ?? patients.length;
    const search = toolbar?.search?.value || '';

    const showPager = paginationProps && rowCount > paginationProps.pageSize;

    return (
      <Box>
        <Typography
          sx={{fontSize: '0.875rem', color: 'text.secondary', mt: -3}}
        >
          {t('caregiverPortal.patients.assigned', {count: rowCount})}
        </Typography>

        {toolbar?.search && (
          <ListSearchField
            value={search}
            placeholder={t('caregiverPortal.patients.search')}
            onChange={toolbar.search.onChange}
            sx={{mt: 4, width: '100%'}}
          />
        )}

        {isLoading && patients.length === 0 ? (
          <CardRowsSkeleton
            rows={WIDGET_SKELETONS.caregiverPatientCard.count}
            row={{
              leading: 'circle',
              leadingSize: WIDGET_SKELETONS.caregiverPatientCard.avatarSize,
              lines: 2,
            }}
            sx={{mt: 4}}
          />
        ) : patients.length === 0 ? (
          <EmptyLine
            text={
              search
                ? t('caregiverPortal.patients.noMatch')
                : t('caregiverPortal.patients.empty')
            }
            sx={{mt: 4, px: 1}}
          />
        ) : (
          <Card sx={{mt: 4}}>
            {patients.map((patient, index) => (
              <PatientRow
                key={patient.id}
                patient={patient}
                workload={workload?.[patient.id]}
                workloadStatus={workloadStatus}
                onRetryWorkload={onRetryWorkload}
                isFirst={index === 0}
              />
            ))}

            {showPager && (
              <DataTableFooter
                page={paginationProps.page}
                pageSize={paginationProps.pageSize}
                rowCount={rowCount}
                pageSizeOptions={[...TABLE_PAGINATION.pageSizeOptions]}
                onPaginationChange={paginationProps.onPaginationModelChange}
              />
            )}
          </Card>
        )}
      </Box>
    );
  }

  const columns = getPatientColumns({
    onEdit: onEditPatient,
    onDelete: onDeletePatient,
    onCareTeam: onEditCareTeam,
    editLoadingId,
    editLoadingStep,
    showEdit: !readOnly,
    showDelete: !readOnly,
    showActions: !readOnly,
    variant,
    workload,
    workloadStatus,
    onRetryWorkload,
    t,
  });

  return (
    <>
      {/* The caregiver searches from the shell top bar, so her list carries no
          toolbar of its own. The field is sized like the admin's top bar
          search so the two bars read as one. */}
      {isCaregiverView && toolbar?.search && (
        <TopBarSlot side='right'>
          <ListSearchField
            value={toolbar.search.value}
            placeholder={t('caregiverPortal.patients.search')}
            onChange={toolbar.search.onChange}
            size='small'
            sx={{
              ...topBarSearchFieldSx,
              flex: {xs: '1 1 auto', sm: 'none'},
              width: {sm: TOP_BAR_SEARCH_WIDTH},
            }}
          />
        </TopBarSlot>
      )}

      {/* The primary action rides the page header, as it does in the frame,
          rather than repeating one row below it in the list toolbar. */}
      {(showAddButton || actionSlot) && (
        <TopBarSlot side='right'>
          {actionSlot}

          {showAddButton && (
            <Button variant='contained' onClick={onAddPatient}>
              {addButtonText || t('patients.table.addButton')}
            </Button>
          )}
        </TopBarSlot>
      )}

      <DataTable<Patient>
        rows={patients}
        columns={columns}
        title={title}
        loading={isLoading}
        noRowsLabel={t('patients.table.noRowsLabel')}
        toolbar={isCaregiverView ? undefined : toolbar}
        serverSidePagination={paginationProps}
        onRowClick={(params) => {
          router.push({
            url: DASHBOARD_ROUTES.patients.single({id: params.row.id}),
          });
        }}
      />
    </>
  );
};

export default PatientsTableUI;
