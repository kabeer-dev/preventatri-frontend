'use client';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import CaregiverChecklistTable from '@/shared/components/caregiver/CaregiverChecklistTable';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverPatientRecordMainProps} from '@/shared/interfaces/patientDetails';

import PatientEmergencyFlagsTable from './PatientEmergencyFlagsTable';
import PatientSubmissionsTable from './PatientSubmissionsTable';

/** The caregiver's main column: this visit's work first, then the patient's history. */
export default function CaregiverPatientRecordMain({
  patientId,
  checklists,
  assignmentNote,
  assignmentNoteChecklist,
}: CaregiverPatientRecordMainProps) {
  const {t} = useTranslation();

  return (
    <>
      {assignmentNote && (
        <Card sx={{px: 4, py: 3.5}}>
          <Typography
            variant='eyebrow'
            component='h2'
            sx={{color: 'text.disabled', px: 1, pb: 2}}
          >
            {t('caregiverPortal.patient.assignmentNote')}
            {assignmentNoteChecklist && ` · ${assignmentNoteChecklist}`}
          </Typography>
          <Typography sx={{fontSize: '0.90625rem', lineHeight: 1.55}}>
            {assignmentNote}
          </Typography>
        </Card>
      )}

      <CaregiverChecklistTable
        rows={checklists}
        titleInCard
        showPatient={false}
        title={t('caregiverPortal.patient.assessments')}
        emptyLabel={t('caregiverPortal.patient.empty')}
      />

      <PatientSubmissionsTable
        patientId={patientId}
        title={t('caregiverPortal.patient.submissions')}
        noRowsLabel={t('caregiverPortal.patient.submissionsEmpty')}
      />

      <PatientEmergencyFlagsTable
        patientId={patientId}
        title={t('caregiverPortal.patient.redFlags')}
        noRowsLabel={t('caregiverPortal.patient.redFlagsEmpty')}
      />
    </>
  );
}
