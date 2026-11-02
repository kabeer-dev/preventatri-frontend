import {ThemeColor} from '@/@core/theme/types';
import {PatientViewVariant} from '@/shared/constants/patients';

import {CaregiverChecklist} from './caregiverChecklist';
import {ActiveFlagItem} from './flag';
import {Patient} from './patient';
import {ChecklistAssignmentItem} from './userProfile';

// Checklist report row interface for patient details table
export interface PatientChecklistReport {
  id: string;
  caregiverFirstName: string;
  caregiverLastName: string;
  caregiverAvatar?: string;
  caregiverAvatarColor?: ThemeColor;
  date: string;
  healthStat: 'red' | 'yellow' | 'green';
  type: 'Monthly' | 'Weekly';
}

// Patient details page props
export interface PatientDetailsProps {
  patientId: string;
}

// Patient details UI props
export interface CaregiverPatientRecordMainProps {
  patientId: string;
  checklists: CaregiverChecklist[];
  assignmentNote: string;
  assignmentNoteChecklist: string;
}

export interface PatientDetailsUIProps {
  patient: Patient;
  activeYellowFlag?: ActiveFlagItem;
  onDispatch?: () => void;
  onAssignCaregiver?: () => void;
  isAssignCaregiverDisabled?: boolean;

  /** The office's reading of the record (default) or the caregiver's. */
  variant?: PatientViewVariant;

  /**
   * The caregiver's own work for this patient, work first and sent last.
   * Read by the caregiver variant only.
   */
  checklists?: CaregiverChecklist[];

  /** The office's note on the assignment, when the API carried one. */
  assignmentNote?: string;

  /** Which checklist the note belongs to, since it is that assignment's note. */
  assignmentNoteChecklist?: string;

  /** The checklist the phone's pinned Start button opens. */
  nextToStart?: CaregiverChecklist | null;

  /** The signed-in caregiver, so she reads as part of the care team. */
  caregiverName?: string;
}

export interface PatientCareTeamMember {
  role: string;
  name: string;
}

export interface PatientCareTeamCardProps {
  members: PatientCareTeamMember[];

  /** Carries HHA's coordinators; the API sends none to a caregiver. */
  patient?: Patient;
}

export interface PatientHhaCoordinatorsProps {
  patient: Patient;
}

export interface PatientTimelineCardProps {
  patientId: string;
}

export interface PatientAssignmentsCardProps {
  assignments: ChecklistAssignmentItem[];

  /** Left out for the roles that only read the record. */
  onAssignCaregiver?: () => void;

  isAssignDisabled?: boolean;
}
