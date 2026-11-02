'use client';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import {useWatch} from 'react-hook-form';

import {ChecklistBuilderUIProps} from '@/shared/interfaces/checklistBuilder';

import ChecklistBuilderConfirmations from './ChecklistBuilderConfirmations';
import ChecklistBuilderDetails from './ChecklistBuilderDetails';
import ChecklistBuilderHeader from './ChecklistBuilderHeader';
import PublishIssuesPanel from './panels/PublishIssuesPanel';
import StructurePanel from './panels/StructurePanel';
import BuilderSectionList from './sections/BuilderSectionList';

const ChecklistBuilderUI = ({template, builder}: ChecklistBuilderUIProps) => {
  const {
    form,
    issues,
    stats,
    confirmAction,
    isSaving,
    isPublishing,
    isDeleting,
    saveDraft,
    requestPublish,
    requestDelete,
    cancelConfirm,
    handleConfirm,
  } = builder;

  const title = useWatch({control: form.control, name: 'title'});

  return (
    <>
      <ChecklistBuilderHeader
        template={template}
        title={title}
        isDirty={form.formState.isDirty}
        hasIssues={issues.length > 0}
        isSaving={isSaving}
        isPublishing={isPublishing}
        isDeleting={isDeleting}
        onSave={saveDraft}
        onPublish={requestPublish}
        onDelete={requestDelete}
      />

      <Grid container spacing={6}>
        <Grid size={{xs: 12, md: 8}}>
          <Stack spacing={4}>
            <ChecklistBuilderDetails control={form.control} />
            <BuilderSectionList
              control={form.control}
              templateType={template.type}
            />
          </Stack>
        </Grid>

        <Grid size={{xs: 12, md: 4}}>
          <Stack spacing={4}>
            <PublishIssuesPanel issues={issues} />
            <StructurePanel stats={stats} templateType={template.type} />
          </Stack>
        </Grid>
      </Grid>

      <ChecklistBuilderConfirmations
        confirmAction={confirmAction}
        onConfirm={handleConfirm}
        onCancel={cancelConfirm}
      />
    </>
  );
};

export default ChecklistBuilderUI;
