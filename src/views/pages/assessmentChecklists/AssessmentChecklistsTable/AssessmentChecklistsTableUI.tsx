'use client';

import Button from '@mui/material/Button';

import DataTable from '@/shared/components/common/table/DataTable';
import TopBarSlot from '@/shared/components/layout/topBarSlot';
import {ASSESSMENT_CHECKLIST_STATUS} from '@/shared/constants/assessmentChecklists';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import {
  AssessmentChecklist,
  AssessmentChecklistsTableUIProps,
} from '@/shared/interfaces/assessmentChecklist';

import {getAssessmentChecklistColumns} from './columns';

const AssessmentChecklistsTableUI = ({
  checklists,
  isLoading = false,
  paginationProps,
  title,
  toolbar,
  onAddClick,
}: AssessmentChecklistsTableUIProps) => {
  const {t} = useTranslation();
  const router = useLocaleRouter();

  const columns = getAssessmentChecklistColumns({
    t,
  });

  return (
    <>
      <TopBarSlot side='right'>
        <Button variant='contained' onClick={onAddClick}>
          {t('assessmentChecklists.table.addButton')}
        </Button>
      </TopBarSlot>

      <DataTable<AssessmentChecklist>
        rows={checklists}
        columns={columns}
        title={title}
        toolbar={toolbar}
        loading={isLoading}
        noRowsLabel={t('assessmentChecklists.table.noRowsLabel')}
        serverSidePagination={paginationProps}
        onRowClick={(params) => {
          const {id, status} = params.row;
          const isDraft = status === ASSESSMENT_CHECKLIST_STATUS.DRAFT.value;

          router.push({
            url: isDraft
              ? DASHBOARD_ROUTES.assessmentChecklists.builder({id})
              : DASHBOARD_ROUTES.assessmentChecklists.single({id}),
          });
        }}
      />
    </>
  );
};

export default AssessmentChecklistsTableUI;
