'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import UserDetailsHeading from '@/shared/components/common/headers/UserDetailsHeading';
import UserProfileCard from '@/shared/components/common/UserProfileCard';
import {
  CAREGIVER_ROLES,
  CAREGIVER_SOURCE,
  CAREGIVER_STATUS,
  RELATIONSHIPS,
  LANGUAGES,
} from '@/shared/constants/caregivers';
import {PREFERRED_CONTACT_METHODS} from '@/shared/constants/common';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverDetailsUIProps} from '@/shared/interfaces/caregiverDetails';
import {formatDate} from '@/shared/utils/dateUtils';
import {getStatusDisplayInfo} from '@/shared/utils/statusUtils';

import CaregiverEmergencyFlagsTable from './CaregiverEmergencyFlagsTable';
import CaregiverPatientsTable from './CaregiverPatientsTable';
import CaregiverStatsCards from './CaregiverStatsCards';
import CaregiverSubmissionsTable from './CaregiverSubmissionsTable';

/**
 * Dumb component for caregiver details page.
 * Pure presentation, receives all data via props.
 */

export default function CaregiverDetailsUI({
  caregiver,
  statistics,
  isStatsLoading = false,
}: CaregiverDetailsUIProps) {
  const {t} = useTranslation();

  // CAREGIVER_STATUS, not the shared two-value default: CaregiverStatus has six
  // members, and resolving TERMINATED or ON_LEAVE against the default map would
  // print the raw enum string in amber.
  const {statusStat} = getStatusDisplayInfo({
    status: caregiver.status,
    label: t('caregiver.details.status'),
    statusMap: CAREGIVER_STATUS,
    archivedLabel: caregiver.archived ? t('orgUsers.archivedChip') : undefined,
  });

  const isHhaManaged = caregiver.source === CAREGIVER_SOURCE.hhaExchange.value;

  const addressLine = [caregiver.address, caregiver.city, caregiver.state]
    .filter(Boolean)
    .join(', ');

  const fullAddress = [addressLine, caregiver.zipCode]
    .filter(Boolean)
    .join(' ');

  const roleLabel =
    CAREGIVER_ROLES[caregiver.caregiverRole as keyof typeof CAREGIVER_ROLES]
      ?.label || caregiver.caregiverRole;

  const relationshipLabel =
    RELATIONSHIPS[caregiver.relationshipToPatient as keyof typeof RELATIONSHIPS]
      ?.label || caregiver.relationshipToPatient;

  const contactMethodLabel =
    PREFERRED_CONTACT_METHODS[
      caregiver.preferredContactMethod as keyof typeof PREFERRED_CONTACT_METHODS
    ]?.label || caregiver.preferredContactMethod;

  const languageLabel =
    LANGUAGES[caregiver.language as keyof typeof LANGUAGES]?.label ||
    caregiver.language;

  const details = [
    {label: t('caregiver.details.email'), value: caregiver.email},
    {label: t('caregiver.details.phone'), value: caregiver.phoneNo || 'N/A'},
    {label: t('caregiver.details.caregiverRole'), value: roleLabel || 'N/A'},
    {
      label: t('caregiver.details.relationshipToPatient'),
      value: relationshipLabel || 'N/A',
    },
    {
      label: t('caregiver.details.preferredContact'),
      value: contactMethodLabel || 'N/A',
    },
    {label: t('caregiver.details.language'), value: languageLabel || 'N/A'},
    {label: t('caregiver.details.address'), value: fullAddress || 'N/A'},
    {
      label: t('caregiver.details.onCall'),
      value: caregiver.onCallIndicator
        ? t('caregiver.details.onCallYes')
        : t('caregiver.details.onCallNo'),
    },
    {
      label: t('caregiver.details.startDate'),
      value: caregiver.startDate
        ? formatDate({date: caregiver.startDate})
        : 'N/A',
    },

    // Only meaningful once the caregiver actually has one, so it is not shown
    // as an empty row on everyone else.
    ...(caregiver.terminationDate
      ? [
          {
            label: t('caregiver.details.terminationDate'),
            value: formatDate({date: caregiver.terminationDate}),
          },
        ]
      : []),

    // Provenance, shown only for imported caregivers: on a manually created one
    // "Manual / never synced" is noise rather than information.
    ...(isHhaManaged
      ? [
          {
            label: t('caregiver.details.source'),
            value: CAREGIVER_SOURCE.hhaExchange.label,
          },
          {
            label: t('caregiver.details.hhaLastSyncedAt'),
            value: caregiver.hhaLastSyncedAt
              ? formatDate({date: caregiver.hhaLastSyncedAt})
              : 'N/A',
          },
        ]
      : []),
    ...(caregiver.notes
      ? [{label: t('caregiver.details.notes'), value: caregiver.notes}]
      : []),
  ];

  const profile = {
    avatar: caregiver.avatar,
    avatarColor: caregiver.avatarColor || ('warning' as const),
    name: `${caregiver.firstName} ${caregiver.lastName}`,
    role: roleLabel || t('caregiver.details.role'),
    roleColor: 'primary' as const,
    stats: [
      {
        icon: 'mdi:account-plus-outline',
        value: caregiver.assignedPatients ?? 0,
        label: t('caregiver.details.patients'),
        color: 'primary' as const,
      },
      statusStat,
    ],
    details,
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

        {/* Right Column - Stats Cards + Tables */}
        <Grid size={{xs: 12, md: 7, lg: 8}}>
          {/* Flag Stats Cards Row */}
          <CaregiverStatsCards
            statistics={statistics}
            isStatsLoading={isStatsLoading}
          />

          <CaregiverPatientsTable caregiverId={caregiver.id} />

          <Box sx={{mt: 3.5}}>
            <CaregiverSubmissionsTable caregiverId={caregiver.id} />
          </Box>

          <Box sx={{mt: 3.5}}>
            <CaregiverEmergencyFlagsTable caregiverId={caregiver.id} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
