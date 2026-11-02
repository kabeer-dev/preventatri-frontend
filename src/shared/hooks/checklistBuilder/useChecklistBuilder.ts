'use client';

import {useMemo, useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, useWatch} from 'react-hook-form';

import {ASSESSMENT_CHECKLIST_STATUS} from '@/shared/constants/assessmentChecklists';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  ChecklistBuilderConfirmAction,
  UseChecklistBuilderParams,
} from '@/shared/interfaces/checklistBuilder';
import {assessmentMutations} from '@/shared/reactQuery';
import {checklistDraftSchema} from '@/shared/schemas/checklistBuilder';
import {ChecklistBuilderFormValues} from '@/shared/types/checklistBuilder';
import {
  builderFormToContentPayload,
  getChecklistPublishIssues,
  getChecklistStructureStats,
  templateToBuilderForm,
} from '@/shared/utils/checklistBuilderUtils';
import {showToast} from '@/shared/utils/toasts';

export const useChecklistBuilder = ({template}: UseChecklistBuilderParams) => {
  const {t, ct} = useTranslation();
  const router = useLocaleRouter();

  const [confirmAction, setConfirmAction] =
    useState<ChecklistBuilderConfirmAction | null>(null);

  const {
    useUpdateAssessmentTemplateMutation,
    useUpdateAssessmentTemplateStatusMutation,
    useDeleteAssessmentTemplateMutation,
  } = assessmentMutations();

  const {mutate: updateTemplate, isPending: isSaving} =
    useUpdateAssessmentTemplateMutation();

  const {mutate: updateStatus, isPending: isPublishing} =
    useUpdateAssessmentTemplateStatusMutation();

  const {mutate: deleteTemplate, isPending: isDeleting} =
    useDeleteAssessmentTemplateMutation();

  const form = useForm<ChecklistBuilderFormValues>({
    resolver: zodResolver(ct({constant: checklistDraftSchema})),
    defaultValues: templateToBuilderForm({template}),
    mode: 'onChange',
  });

  // Every field is seeded from the template, so the watched value is complete.
  const values = useWatch({
    control: form.control,
  }) as ChecklistBuilderFormValues;

  const issues = useMemo(
    () => getChecklistPublishIssues({values, type: template.type, t}),
    [values, template.type, t]
  );

  const stats = useMemo(() => getChecklistStructureStats({values}), [values]);

  const saveDraft = ({onSaved}: {onSaved?: () => void} = {}) =>
    form.handleSubmit(
      (formValues) =>
        updateTemplate({
          params: {id: template.id},
          payload: builderFormToContentPayload({
            values: formValues,
            type: template.type,
          }),
          callBackFuncs: {
            onSuccess: () => {
              form.reset(formValues);
              onSaved?.();
            },
          },
        }),
      () =>
        showToast({
          type: 'error',
          message: t('assessmentChecklists.builder.fixErrors'),
        })
    )();

  const publish = () =>
    updateStatus({
      params: {id: template.id},
      payload: {status: ASSESSMENT_CHECKLIST_STATUS.ACTIVE.value},
      callBackFuncs: {
        onSuccess: () =>
          router.replace({
            url: DASHBOARD_ROUTES.assessmentChecklists.single({
              id: template.id,
            }),
          }),
      },
    });

  const handleConfirm = () => {
    const action = confirmAction;
    setConfirmAction(null);

    if (action === 'delete') {
      deleteTemplate({
        params: {id: template.id},
        callBackFuncs: {
          onSuccess: () =>
            router.replace({url: DASHBOARD_ROUTES.assessmentChecklists.all()}),
        },
      });

      return;
    }

    if (form.formState.isDirty) saveDraft({onSaved: publish});
    else publish();
  };

  return {
    form,
    issues,
    stats,
    confirmAction,
    isSaving,
    isPublishing,
    isDeleting,
    saveDraft: () => saveDraft(),
    requestPublish: () => setConfirmAction('publish'),
    requestDelete: () => setConfirmAction('delete'),
    cancelConfirm: () => setConfirmAction(null),
    handleConfirm,
  };
};
