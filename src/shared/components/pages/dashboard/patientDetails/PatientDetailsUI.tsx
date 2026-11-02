'use client';

import PinnedAction from '@/shared/components/caregiver/PinnedAction';
import DetailFactsCard from '@/shared/components/common/DetailFactsCard';
import DetailSplitLayout from '@/shared/components/common/DetailSplitLayout';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {DETAIL_EMPTY_VALUE} from '@/shared/constants/common';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {PATIENT_VIEW_VARIANT} from '@/shared/constants/patients';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  PatientCareTeamMember,
  PatientDetailsUIProps,
} from '@/shared/interfaces/patientDetails';
import {ChecklistAssignmentItem} from '@/shared/interfaces/userProfile';
import {formatDate, secondsUntilIso} from '@/shared/utils/dateUtils';
import {
  buildPatientCareTeam,
  buildPatientFacts,
} from '@/shared/utils/patientUtils';

import CaregiverPatientRecordMain from './CaregiverPatientRecordMain';
import PatientAssignmentsCard from './PatientAssignmentsCard';
import PatientCareTeamCard from './PatientCareTeamCard';
import PatientEmergencyFlagsTable from './PatientEmergencyFlagsTable';
import PatientRecordHeading from './PatientRecordHeading';
import PatientSubmissionsTable from './PatientSubmissionsTable';
import PatientTimelineCard from './PatientTimelineCard';
import SLABreachCard from './SLABreachCard';

/**
 * The patient record, in two readings. The office gets the SLA card, the
 * assignments and its own working note. The caregiver gets the same record
 * with the work of this visit first and none of the office's controls: her
 * checklists, the assignment note, the patient's submissions and flags, and on
 * a phone the pinned Start.
 *
 * Both readings compose the same rail and the same tables, so the two pages
 * cannot come to show different facts about the same person.
 */

export default function PatientDetailsUI({
  patient,
  activeYellowFlag,
  onDispatch,
  onAssignCaregiver,
  isAssignCaregiverDisabled = false,
  variant = PATIENT_VIEW_VARIANT.admin,
  checklists = [],
  assignmentNote = '',
  assignmentNoteChecklist = '',
  nextToStart,
  caregiverName = '',
}: PatientDetailsUIProps) {
  const {t} = useTranslation();

  const isDesktop = useIsDesktop();

  const isCaregiverView = variant === PATIENT_VIEW_VARIANT.caregiver;

  // The note is the office's own working note about the patient. It is not
  // the caregiver's to read, so her copy of the record leaves it out.
  const facts = buildPatientFacts({patient, t, includeNotes: !isCaregiverView});

  // The caregiver belongs on the card too, so the team reads as who is on
  // this patient rather than as a list of other people.
  const careTeam: PatientCareTeamMember[] = [
    ...buildPatientCareTeam({patient, t, includeCaregivers: !isCaregiverView}),
    ...(isCaregiverView && caregiverName
      ? [{role: t('caregiverPortal.patient.careTeamYou'), name: caregiverName}]
      : []),
  ];

  const slaCard = activeYellowFlag
    ? {
        flagType: activeYellowFlag.flagType,
        symptom: activeYellowFlag.reason,
        secondsRemaining: activeYellowFlag.expiresAt
          ? secondsUntilIso({iso: activeYellowFlag.expiresAt})
          : null,
      }
    : null;

  const rawAssignments = (patient as any).checklistAssignments || [];

  const assignments: ChecklistAssignmentItem[] = rawAssignments.map(
    (a: any) => ({
      id: a.id,
      checklistName: a.checklistTemplate?.title || DETAIL_EMPTY_VALUE,
      caregiverName:
        [
          a.caregiverProfile?.user?.firstName,
          a.caregiverProfile?.user?.lastName,
        ]
          .filter(Boolean)
          .join(' ') || DETAIL_EMPTY_VALUE,
      frequency: a.type
        ? a.type.charAt(0) + a.type.slice(1).toLowerCase()
        : DETAIL_EMPTY_VALUE,
      startDate: a.startDate
        ? formatDate({date: a.startDate})
        : DETAIL_EMPTY_VALUE,
      endDate: a.endDate ? formatDate({date: a.endDate}) : DETAIL_EMPTY_VALUE,
    })
  );

  const heading = (
    <PatientRecordHeading
      patient={patient}
      showStatus={!isCaregiverView}
      backHref={DASHBOARD_ROUTES.patients.all()}
    />
  );

  const isPhone = isCaregiverView && !isDesktop;

  return (
    <>
      <TopBarSlot side='left'>{heading}</TopBarSlot>

      <DetailSplitLayout
        main={
          <>
            {isCaregiverView ? (
              <CaregiverPatientRecordMain
                patientId={patient.id}
                checklists={checklists}
                assignmentNote={assignmentNote}
                assignmentNoteChecklist={assignmentNoteChecklist}
              />
            ) : (
              <>
                {slaCard && (
                  <SLABreachCard
                    flagType={slaCard.flagType}
                    symptom={slaCard.symptom}
                    secondsRemaining={slaCard.secondsRemaining}
                    onDispatch={onDispatch}
                  />
                )}

                <PatientEmergencyFlagsTable patientId={patient.id} />

                <PatientAssignmentsCard
                  assignments={assignments}
                  onAssignCaregiver={onAssignCaregiver}
                  isAssignDisabled={isAssignCaregiverDisabled}
                />

                <PatientSubmissionsTable
                  patientId={patient.id}
                  includeDeleted={patient.archived}
                />
              </>
            )}
          </>
        }
        rail={
          <>
            <DetailFactsCard
              title={t('patients.details.title')}
              facts={facts}
            />
            <PatientCareTeamCard members={careTeam} patient={patient} />
            {!isCaregiverView && <PatientTimelineCard patientId={patient.id} />}
          </>
        }
      />

      {isPhone && nextToStart && (
        <PinnedAction
          label={t('caregiverPortal.patient.start', {
            checklist: nextToStart.checklistName,
            interpolation: {escapeValue: false},
          })}
          href={DASHBOARD_ROUTES.checklist({id: nextToStart.id})}
        />
      )}
    </>
  );
}
