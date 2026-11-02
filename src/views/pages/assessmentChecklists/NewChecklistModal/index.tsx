'use client';

import {useEffect} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, useWatch} from 'react-hook-form';

import {CHECKLIST_BUILDER_EMPTY_TEXT} from '@/shared/constants/checklistBuilder';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import {SUB_ROUTE_PARAMS} from '@/shared/constants/reactQueryConstants';
import {POST_MODAL_CLEANUP_DELAY} from '@/shared/constants/scripts';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {useWorkItemChecklistOptions} from '@/shared/hooks/useWorkItemChecklistOptions';
import {AssessmentTemplateApi} from '@/shared/interfaces/assessmentChecklist';
import {NewChecklistModalProps} from '@/shared/interfaces/checklistBuilder';
import {assessmentMutations, assessmentQueries} from '@/shared/reactQuery';
import {newChecklistFormSchema} from '@/shared/schemas/checklistBuilder';
import {NewChecklistFormValues} from '@/shared/types/checklistBuilder';
import {buildCreateTemplatePayload} from '@/shared/utils/checklistBuilderUtils';

import NewChecklistModalUI from './NewChecklistModalUI';

const EMPTY_VALUES: NewChecklistFormValues = {
  title: CHECKLIST_BUILDER_EMPTY_TEXT,
  description: CHECKLIST_BUILDER_EMPTY_TEXT,
  type: CHECKLIST_BUILDER_EMPTY_TEXT,
  sourceTemplateId: CHECKLIST_BUILDER_EMPTY_TEXT,
};

const NewChecklistModal = ({
  isOpen,
  onClose,
  initialValues,
}: NewChecklistModalProps) => {
  const {ct} = useTranslation();
  const router = useLocaleRouter();

  const {useFetchAssessmentTemplate} = assessmentQueries();
  const {useCreateAssessmentTemplateMutation} = assessmentMutations();

  const {mutate: createTemplate, isPending: isCreating} =
    useCreateAssessmentTemplateMutation();

  const {control, handleSubmit, reset, setValue, formState} =
    useForm<NewChecklistFormValues>({
      resolver: zodResolver(ct({constant: newChecklistFormSchema})),
      defaultValues: EMPTY_VALUES,
    });

  const [type, sourceTemplateId] = useWatch({
    control,
    name: ['type', 'sourceTemplateId'],
  });

  const initialType = initialValues?.type ?? EMPTY_VALUES.type;

  const initialSourceTemplateId =
    initialValues?.sourceTemplateId ?? EMPTY_VALUES.sourceTemplateId;

  // Primitive deps so a parent passing a fresh object doesn't wipe what was typed.
  useEffect(() => {
    if (!isOpen) return;

    reset({
      title: EMPTY_VALUES.title,
      description: EMPTY_VALUES.description,
      type: initialType,
      sourceTemplateId: initialSourceTemplateId,
    });
  }, [isOpen, initialType, initialSourceTemplateId, reset]);

  // Content only: usage stats are left off because they are never shown here.
  const sourceQuery = useFetchAssessmentTemplate({
    id: sourceTemplateId,
    enabled: isOpen && Boolean(sourceTemplateId),
    params: {...SUB_ROUTE_PARAMS},
  });

  const sourceTemplates = useWorkItemChecklistOptions({
    type,
    status: null,
    enabled: isOpen && Boolean(type),
    seedTemplate: sourceQuery.data?.template,
  });

  const handleClose = () => {
    onClose();
    setTimeout(() => reset(EMPTY_VALUES), POST_MODAL_CLEANUP_DELAY);
  };

  const onSubmit = handleSubmit((values) => {
    if (!values.type) return;

    const source = sourceQuery.data?.template;

    // A failed source load would otherwise create an empty copy; retry instead.
    if (values.sourceTemplateId && !source) {
      sourceQuery.refetch();

      return;
    }

    createTemplate({
      payload: buildCreateTemplatePayload({
        values,
        type: values.type,
        source: values.sourceTemplateId ? source : undefined,
      }),
      callBackFuncs: {
        onSuccess: (response: {data: {template: AssessmentTemplateApi}}) =>
          router.push({
            url: DASHBOARD_ROUTES.assessmentChecklists.builder({
              id: response.data.template.id,
            }),
          }),
      },
    });
  });

  return (
    <NewChecklistModalUI
      isOpen={isOpen}
      isDirty={formState.isDirty}
      isLoading={isCreating || sourceQuery.isFetching}
      control={control}
      sourceTemplates={sourceTemplates}
      isSourceDisabled={!type}
      onClose={handleClose}
      onSubmit={onSubmit}
      onTypeChange={() =>
        setValue('sourceTemplateId', EMPTY_VALUES.sourceTemplateId)
      }
    />
  );
};

export default NewChecklistModal;
