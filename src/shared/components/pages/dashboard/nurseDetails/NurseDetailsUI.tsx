'use client';

import Grid from '@mui/material/Grid';

import UserDetailsHeading from '@/shared/components/common/headers/UserDetailsHeading';
import DataTable from '@/shared/components/common/table/DataTable';
import UserProfileCard from '@/shared/components/common/UserProfileCard';
import {PREFERRED_CONTACT_METHODS} from '@/shared/constants/common';
import {PROFESSIONAL_ROLES, NURSE_SOURCE} from '@/shared/constants/nurses';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  AssignedPatient,
  NurseDetailsUIProps,
} from '@/shared/interfaces/nurseDetails';
import {formatDate} from '@/shared/utils/dateUtils';
import {
  getLicenseStateLabel,
  isHhaManagedNurse,
} from '@/shared/utils/nurseUtils';
import {getStatusDisplayInfo} from '@/shared/utils/statusUtils';

import {getAssignedPatientColumns} from './columns';
import NurseFlagStats from './NurseFlagStats';

/**
 * Dumb component for nurse details page.
 * Pure presentation, receives all data via props.
 */
export default function NurseDetailsUI({nurse}: NurseDetailsUIProps) {
  const {t} = useTranslation();

  const {statusStat} = getStatusDisplayInfo({
    status: nurse.status,
    label: t('nurse.details.status'),
    archivedLabel: nurse.archived ? t('orgUsers.archivedChip') : undefined,
  });

  const roleLabel =
    PROFESSIONAL_ROLES[
      nurse.professionalRole as keyof typeof PROFESSIONAL_ROLES
    ]?.label || nurse.professionalRole;

  const licenseStateLabel = getLicenseStateLabel({
    stateCode: nurse.licenseState,
  });

  const contactMethodLabel =
    PREFERRED_CONTACT_METHODS[
      nurse.preferredContactMethod as keyof typeof PREFERRED_CONTACT_METHODS
    ]?.label || nurse.preferredContactMethod;

  const isHhaManaged = isHhaManagedNurse({nurse});

  const addressLine = [nurse.address, nurse.city, nurse.state]
    .filter(Boolean)
    .join(', ');

  const fullAddress = [addressLine, nurse.zipCode].filter(Boolean).join(' ');

  const details = [
    {label: t('nurse.details.email'), value: nurse.email},
    {label: t('nurse.details.phone'), value: nurse.phoneNo || 'N/A'},
    {label: t('nurse.details.address'), value: fullAddress || 'N/A'},
    {label: t('nurse.details.professionalRole'), value: roleLabel || 'N/A'},
    {
      label: t('nurse.details.licenseNumber'),
      value: nurse.licenseNumber || 'N/A',
    },
    {label: t('nurse.details.licenseState'), value: licenseStateLabel || 'N/A'},
    {
      label: t('nurse.details.licenseExpiration'),
      value: nurse.licenseExpirationDate
        ? formatDate({date: nurse.licenseExpirationDate})
        : 'N/A',
    },
    {label: t('nurse.details.npi'), value: nurse.npi || 'N/A'},
    {
      label: t('nurse.details.primaryRegions'),
      value: nurse.primaryRegionNames?.length
        ? nurse.primaryRegionNames.join(', ')
        : 'N/A',
    },
    {
      label: t('nurse.details.secondaryRegions'),
      value: nurse.secondaryRegionNames?.length
        ? nurse.secondaryRegionNames.join(', ')
        : 'N/A',
    },
    {
      label: t('nurse.details.preferredContact'),
      value: contactMethodLabel || 'N/A',
    },
    {
      label: t('nurse.details.onCall'),
      value: nurse.onCallIndicator
        ? t('nurse.details.onCallYes')
        : t('nurse.details.onCallNo'),
    },
    {
      label: t('nurse.details.joiningDate'),
      value: nurse.joiningDate ? formatDate({date: nurse.joiningDate}) : 'N/A',
    },
    ...(nurse.notes
      ? [{label: t('nurse.details.notes'), value: nurse.notes}]
      : []),

    // Provenance, shown only for imported nurses: on a manually created one
    // "Manual / never synced" is noise rather than information.
    ...(isHhaManaged
      ? [
          {
            label: t('nurse.details.source'),
            value: NURSE_SOURCE.hhaExchange.label,
          },
          {
            label: t('nurse.details.hhaLastSyncedAt'),
            value: nurse.hhaLastSyncedAt
              ? formatDate({date: nurse.hhaLastSyncedAt})
              : 'N/A',
          },
        ]
      : []),
  ];

  const profile = {
    avatar: nurse.avatar,
    avatarColor: nurse.avatarColor || ('warning' as const),
    name: `${nurse.firstName} ${nurse.lastName}`,
    role: roleLabel || t('nurse.details.role'),
    roleColor: 'primary' as const,
    stats: [
      {
        icon: 'mdi:account-plus-outline',
        value: nurse.currentPatientCount ?? 0,
        label: t('nurse.details.patients'),
        color: 'primary' as const,
      },
      statusStat,
    ],
    details,
  };

  // TODO: Replace with API data
  const tableData = {
    title: t('nurse.details.tableTitle'),
    rows: [] as AssignedPatient[],
    columns: getAssignedPatientColumns(),
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
          {/* Flag Stats Cards Row */}
          <NurseFlagStats />

          {/* Data Table */}
          <DataTable<AssignedPatient>
            titleInCard
            hideTotal
            title={tableData.title}
            rows={tableData.rows}
            columns={tableData.columns}
            defaultPageSize={10}
            pageSizeOptions={[5, 10, 25]}
          />
        </Grid>
      </Grid>
    </>
  );
}
