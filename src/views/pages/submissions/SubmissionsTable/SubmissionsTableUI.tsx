'use client';

import DataTable from '@/shared/components/common/table/DataTable';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useLocaleRouter from '@/shared/hooks/useLocaleRouter';
import useTranslation from '@/shared/hooks/useTranslation';
import useUserRole from '@/shared/hooks/useUserRole';
import {
  Submission,
  SubmissionsTableUIProps,
} from '@/shared/interfaces/submission';

import {getSubmissionColumns} from './columns';

const SubmissionsTableUI = ({
  submissions,
  isLoading = false,
  paginationProps,
  onEditSubmission = () => {},
  onVoidSubmission = () => {},
  onSkipSubmission = () => {},
  title,
  hidePatientColumn = false,
  hideCaregiverColumn = false,
  alwaysShowCaregiverColumn = false,
  hideActions = false,
  noRowsLabel,
  toolbar,
  titleInCard = false,
}: SubmissionsTableUIProps) => {
  const {t} = useTranslation();
  const router = useLocaleRouter();
  const {isCaregiver, isNurse, isCaseManager} = useUserRole();

  const shouldHideActions =
    isCaregiver || isNurse || isCaseManager || hideActions;

  const columns = getSubmissionColumns({
    onEdit: onEditSubmission,
    onVoid: onVoidSubmission,
    onSkip: onSkipSubmission,
    showActions: !shouldHideActions,
    showEdit: false,
    showPatient: !hidePatientColumn,
    showCaregiver:
      alwaysShowCaregiverColumn || !(isCaregiver || hideCaregiverColumn),
    showVoidedAt: !isCaregiver,
    t,
  });

  return (
    <DataTable<Submission>
      rows={submissions}
      columns={columns}
      title={title}
      loading={isLoading}
      noRowsLabel={noRowsLabel || t('submissions.table.noRowsLabel')}
      toolbar={toolbar}
      titleInCard={titleInCard}
      serverSidePagination={paginationProps}
      onRowClick={(params) =>
        router.push({
          url: DASHBOARD_ROUTES.submissions.single({id: params.row.id}),
        })
      }
    />
  );
};

export default SubmissionsTableUI;
