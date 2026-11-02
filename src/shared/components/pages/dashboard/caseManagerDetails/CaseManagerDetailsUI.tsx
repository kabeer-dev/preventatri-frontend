'use client';

import Grid from '@mui/material/Grid';

import Icon from '@/@core/components/icon';
import UserDetailsHeading from '@/shared/components/common/headers/UserDetailsHeading';
import StatsCard from '@/shared/components/common/StatsCard';
import DataTable from '@/shared/components/common/table/DataTable';
import UserProfileCard from '@/shared/components/common/UserProfileCard';
import {CASE_MANAGER_SOURCE} from '@/shared/constants/caseManagers';
import {PREFERRED_CONTACT_METHODS} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  CaseManagerAssignedPatient,
  CaseManagerDetailsUIProps,
} from '@/shared/interfaces/caseManagerDetails';
import {formatDate} from '@/shared/utils/dateUtils';
import {getStatusDisplayInfo} from '@/shared/utils/statusUtils';

import {getAssignedPatientColumns} from './columns';

/**
 * Dumb component for case manager details page.
 * Pure presentation, receives all data via props.
 */

export default function CaseManagerDetailsUI({
  caseManager,
}: CaseManagerDetailsUIProps) {
  const {t} = useTranslation();

  const {statusStat} = getStatusDisplayInfo({
    status: caseManager.status,
    label: t('caseManager.details.status'),
    archivedLabel: caseManager.archived
      ? t('orgUsers.archivedChip')
      : undefined,
  });

  const isHhaManaged =
    caseManager.source === CASE_MANAGER_SOURCE.hhaExchange.value;

  const contactMethodLabel =
    PREFERRED_CONTACT_METHODS[
      caseManager.preferredContactMethod as keyof typeof PREFERRED_CONTACT_METHODS
    ]?.label || caseManager.preferredContactMethod;

  const details = [
    {label: t('caseManager.details.email'), value: caseManager.email},
    {
      label: t('caseManager.details.contact'),
      value: caseManager.phoneNo || 'N/A',
    },
    {
      label: t('caseManager.details.regions'),
      value: caseManager.regionNames?.length
        ? caseManager.regionNames.join(', ')
        : 'N/A',
    },
    {
      label: t('caseManager.details.preferredContact'),
      value: contactMethodLabel || 'N/A',
    },

    // HHAeXchange provenance, shown ONLY on an imported case manager: on a
    // manually invited one "Manual / never synced" is noise rather than
    // information.
    //
    // There is no "modified date" row to pair with the sync timestamp, unlike
    // caregivers: GetCoordinators publishes none, so when the agency last
    // touched the record is simply not something HHAeXchange tells us.
    ...(isHhaManaged
      ? [
          {
            label: t('caseManager.details.source'),
            value: CASE_MANAGER_SOURCE.hhaExchange.label,
          },
          {
            label: t('caseManager.details.hhaLastSyncedAt'),
            value: caseManager.hhaLastSyncedAt
              ? formatDate({date: caseManager.hhaLastSyncedAt})
              : 'N/A',
          },
        ]
      : []),
    ...(caseManager.notes
      ? [{label: t('caseManager.details.notes'), value: caseManager.notes}]
      : []),
  ];

  const profile = {
    avatar: caseManager.avatar,
    avatarColor: caseManager.avatarColor || ('warning' as const),
    name: `${caseManager.firstName} ${caseManager.lastName}`,
    role: t('caseManager.details.role'),
    roleColor: 'primary' as const,
    stats: [
      {
        icon: 'mdi:account-plus-outline',
        value: caseManager.assignedPatients ?? 0,
        label: t('caseManager.details.patients'),
        color: 'primary' as const,
      },
      statusStat,
    ],
    details,
  };

  const tableData = {
    title: t('caseManager.details.table.title'),
    rows: (caseManager.patients || []) as CaseManagerAssignedPatient[],
    columns: getAssignedPatientColumns({t}),
  };

  return (
    <>
      <UserDetailsHeading
        name={profile.name}
        avatar={profile.avatar}
        avatarColor={profile.avatarColor}
      />

      <Grid container spacing={4}>
        {/* Left Column - Profile Card */}
        <Grid size={{xs: 12, md: 5, lg: 4}}>
          <UserProfileCard
            avatar={profile.avatar}
            avatarColor={profile.avatarColor}
            name={profile.name}
            role={profile.role}
            roleColor={profile.roleColor}
            stats={profile.stats}
            details={profile.details}
          />
        </Grid>

        {/* Right Column - Stats Cards + Table */}
        <Grid size={{xs: 12, md: 7, lg: 8}}>
          {/* Detail Stats Cards Row */}
          <Grid container spacing={3.5} sx={{mb: 3.5}}>
            <Grid size={{xs: 12, sm: 4}}>
              <StatsCard
                title={t('caseManager.details.caseload')}
                stats={'N/A'}
                icon={<Icon icon='mdi:briefcase-outline' fontSize={24} />}
                color='primary'
                subtitle={t('caseManager.details.totalAssigned')}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 4}}>
              <StatsCard
                title={t('caseManager.details.followUpTasks')}
                stats={'N/A'}
                icon={<Icon icon='mdi:clipboard-check-outline' fontSize={24} />}
                color='warning'
                subtitle={t('caseManager.details.pendingToday')}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 4}}>
              <StatsCard
                title={t('caseManager.details.supervisoryVisits')}
                stats={'N/A'}
                icon={<Icon icon='mdi:calendar-check-outline' fontSize={24} />}
                color='info'
                subtitle={t('caseManager.details.dueThisWeek')}
              />
            </Grid>
          </Grid>

          {/* Data Table */}
          <DataTable<CaseManagerAssignedPatient>
            titleInCard
            title={tableData.title}
            rows={tableData.rows}
            columns={tableData.columns}
            defaultPageSize={10}
            pageSizeOptions={[5, 10, 25]}
            noRowsLabel={t('caseManager.details.table.noRowsLabel')}
          />
        </Grid>
      </Grid>
    </>
  );
}
