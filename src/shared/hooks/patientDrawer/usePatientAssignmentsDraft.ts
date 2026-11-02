import {useEffect, useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useFieldArray, useForm} from 'react-hook-form';

import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  PatientAssignmentRecord,
  UsePatientAssignmentsDraftParams,
} from '@/shared/interfaces/patient';
import {checklistAssignmentQueries} from '@/shared/reactQuery';
import {patientAssignmentsFormSchema} from '@/shared/schemas/patient';
import {PatientAssignmentsFormPayload} from '@/shared/types/patient';
import {createEmptyPatientAssignment} from '@/shared/utils/patientUtils';

const usePatientAssignmentsDraft = ({
  isOpen,
  patientId,
  startWithNewAssignment = false,
}: UsePatientAssignmentsDraftParams) => {
  const {ct} = useTranslation();

  const form = useForm<PatientAssignmentsFormPayload>({
    resolver: zodResolver(ct({constant: patientAssignmentsFormSchema})),
    defaultValues: {assignments: []},
    mode: 'onChange',
  });

  const {control, reset, trigger, getValues, getFieldState} = form;

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'assignments',
  });

  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [collapsedIds, setCollapsedIds] = useState<string[]>([]);
  const [wasOpen, setWasOpen] = useState(isOpen);

  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);

    if (isOpen) {
      setRemovedIds([]);
      setCollapsedIds([]);
    }
  }

  const {useFetchChecklistAssignmentsList} = checklistAssignmentQueries();

  const assignmentsQuery = useFetchChecklistAssignmentsList({
    params: {patientId, limit: 100, ...SUB_ROUTE_PARAMS},
    enabled: isOpen && Boolean(patientId),
  });

  const existingAssignments: PatientAssignmentRecord[] = patientId
    ? assignmentsQuery?.data?.assignments || []
    : [];

  useEffect(() => {
    if (!isOpen) return;

    reset({
      assignments: startWithNewAssignment
        ? [createEmptyPatientAssignment()]
        : [],
    });
  }, [isOpen, reset, startWithNewAssignment]);

  const addAssignment = () => append(createEmptyPatientAssignment());

  const discardAssignment = ({index}: {index: number}) => {
    const fieldId = fields[index]?.id;

    setCollapsedIds((ids) => ids.filter((id) => id !== fieldId));
    remove(index);
  };

  const collapseAssignment = async ({index}: {index: number}) => {
    const isValid = await trigger(`assignments.${index}`, {shouldFocus: true});
    const fieldId = fields[index]?.id;

    if (isValid && fieldId) setCollapsedIds((ids) => [...ids, fieldId]);
  };

  const expandAssignment = ({index}: {index: number}) => {
    const fieldId = fields[index]?.id;

    setCollapsedIds((ids) => ids.filter((id) => id !== fieldId));
  };

  const removeExistingAssignment = ({id}: {id: string}) =>
    setRemovedIds((ids) => (ids.includes(id) ? ids : [...ids, id]));

  const undoRemoveAssignment = ({id}: {id: string}) =>
    setRemovedIds((ids) => ids.filter((removedId) => removedId !== id));

  const validateNewAssignments = async () => {
    const isValid = await trigger(undefined, {shouldFocus: true});

    if (isValid) return getValues('assignments');

    setCollapsedIds((ids) =>
      ids.filter((id) => {
        const index = fields.findIndex((field) => field.id === id);

        return !getFieldState(`assignments.${index}`).invalid;
      })
    );

    return null;
  };

  const clearNewAssignments = () => {
    reset({assignments: []});
    setCollapsedIds([]);
  };

  return {
    form,
    fields,
    existingAssignments,
    isFetchingAssignments: Boolean(assignmentsQuery?.isFetching),
    removedIds,
    collapsedIds,
    addAssignment,
    discardAssignment,
    collapseAssignment,
    expandAssignment,
    removeExistingAssignment,
    undoRemoveAssignment,
    validateNewAssignments,
    clearNewAssignments,
  };
};

export default usePatientAssignmentsDraft;
