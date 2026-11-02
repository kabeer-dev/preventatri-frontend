import {Patient} from '@/shared/interfaces/patient';
import {
  checklistAssignmentMutations,
  patientMutations,
} from '@/shared/reactQuery';
import {
  PatientAssignmentFormItem,
  PatientFormPayload,
} from '@/shared/types/patient';
import {
  generatePatientAssignmentsPayload,
  generatePatientPayload,
} from '@/shared/utils/patientUtils';

const usePatientDrawerSave = () => {
  const {useCreatePatientMutation, useUpdatePatientMutation} =
    patientMutations();

  const {
    useCreateChecklistAssignmentsMutation,
    useDeleteChecklistAssignmentMutation,
  } = checklistAssignmentMutations();

  const {mutateAsync: createPatient} = useCreatePatientMutation();
  const {mutateAsync: updatePatient} = useUpdatePatientMutation();

  const {mutateAsync: createAssignments} =
    useCreateChecklistAssignmentsMutation();

  const {mutateAsync: deleteAssignment} =
    useDeleteChecklistAssignmentMutation();

  const savePatient = async ({
    data,
    patient,
  }: {
    data: PatientFormPayload;
    patient: Patient | null;
  }) => {
    const response = patient?.id
      ? await updatePatient({
          payload: generatePatientPayload({data, patient}),
          params: {id: patient.id},
        })
      : await createPatient({payload: generatePatientPayload({data})});

    return response?.data?.patient;
  };

  const saveNewAssignments = ({
    assignments,
    patientId,
  }: {
    assignments: PatientAssignmentFormItem[];
    patientId: string;
  }) =>
    createAssignments({
      payload: generatePatientAssignmentsPayload({assignments, patientId}),
    });

  const deleteExistingAssignment = ({id}: {id: string}) =>
    deleteAssignment({params: {id}});

  return {savePatient, saveNewAssignments, deleteExistingAssignment};
};

export default usePatientDrawerSave;
