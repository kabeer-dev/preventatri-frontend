import {RefObject} from 'react';

import {Control} from 'react-hook-form';

import {AudioRecorderHandle} from '@/shared/components/common/inputs/AudioRecorder';
import {CaregiverPatientOption} from '@/shared/interfaces/patient';
import {
  CaregiverRedFlagInput,
  CaregiverRedFlagValues,
} from '@/shared/types/redFlag';

/**
 * Everything the red flag form needs, built once by `useRedFlagForm` so the
 * dialog and the full screen render the same fields from the same state.
 */
export interface CaregiverRedFlagFormState {
  control: Control<CaregiverRedFlagInput, unknown, CaregiverRedFlagValues>;
  patients: CaregiverPatientOption[];
  isPatientsLoading: boolean;
  selectedPatient: CaregiverPatientOption | null;
  isOtherReason: boolean;
  images: File[];
  onImagesChange: ({files}: {files: File[]}) => void;
  onAudioChange: ({audioBlob}: {audioBlob: Blob | null}) => void;
  audioRecorderRef: RefObject<AudioRecorderHandle | null>;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;

  /** True once the nurse has it. Both shells swap to the sent state on this. */
  isSent: boolean;

  /** Who the flag was raised about, for the line on the sent state. */
  sentPatientFirstName: string;
}

/** The patient a caregiver screen is currently showing, for preselecting it. */
export interface CaregiverCurrentPatient {
  id: string;
  name: string;
}

/** What any caregiver screen may do with the red flag dialog. */
export interface CaregiverRedFlagContextValue {
  openRedFlag: ({patientId}: {patientId?: string}) => void;
  closeRedFlag: () => void;
  isOpen: boolean;
  patientId: string;

  /** The patient of the screen the caregiver is on, if any screen registered one. */
  currentPatient: CaregiverCurrentPatient | null;
  setCurrentPatient: ({
    patient,
  }: {
    patient: CaregiverCurrentPatient | null;
  }) => void;

  /**
   * The patient the phone's red flag screen opens on. Handed over in memory,
   * never in the URL, so no patient id ends up in history or a shared link.
   */
  preselectedPatientId: string | null;
  preselectPatient: ({patientId}: {patientId: string | null}) => void;
}
