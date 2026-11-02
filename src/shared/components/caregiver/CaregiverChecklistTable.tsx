'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import {GridColDef} from '@mui/x-data-grid';

import CaregiverChecklistRow from '@/shared/components/caregiver/CaregiverChecklistRow';
import EmptyLine from '@/shared/components/common/EmptyLine';
import Link from '@/shared/components/common/localeLink';
import CardRowsSkeleton from '@/shared/components/common/skeletons/CardRowsSkeleton';
import DataTable from '@/shared/components/common/table/DataTable';
import {CAREGIVER_TABLE} from '@/shared/constants/caregiver';
import useIsDesktop from '@/shared/hooks/useIsDesktop';
import useTranslation from '@/shared/hooks/useTranslation';
import {CaregiverChecklist} from '@/shared/interfaces/caregiverChecklist';
import {CellType} from '@/shared/interfaces/tables';
import {TranslateFunction} from '@/shared/types/common';
import {
  getChecklistDueLabel,
  getChecklistHref,
  getQuestionsLine,
} from '@/shared/utils/caregiverChecklists';

// The shared grid draws the rule under the header; the design has one above
// it too.
const gridSx = {
  '& .MuiDataGrid-columnHeaders': {
    borderTop: '1px solid',
    borderTopColor: 'customColors.ruleStrong',
  },
};

/** A sent row reads quieter than work still to do, in every column. */
const rowColor = ({checklist}: {checklist: CaregiverChecklist}) =>
  checklist.isSent ? 'text.disabled' : 'text.primary';

const getColumns = ({
  showPatient,
  t,
}: {
  showPatient: boolean;
  t: TranslateFunction;
}): GridColDef[] => [
  {
    flex: 0.34,
    minWidth: CAREGIVER_TABLE.dueColumnMinWidth,
    sortable: false,
    field: 'due',
    headerName: t('caregiverPortal.today.table.due'),
    renderCell: ({row}: CellType<CaregiverChecklist>) => (
      <Typography
        noWrap
        sx={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '0.84375rem',
          fontWeight: row.isSent ? 400 : 600,
          color: row.isLate ? 'error.main' : rowColor({checklist: row}),
        }}
      >
        {getChecklistDueLabel({checklist: row, t})}
      </Typography>
    ),
  },
  ...(showPatient
    ? [
        {
          flex: 0.22,
          minWidth: 140,
          sortable: false,
          field: 'patientName',
          headerName: t('caregiverPortal.today.table.patient'),
          renderCell: ({row}: CellType<CaregiverChecklist>) => (
            <Typography
              noWrap
              sx={{
                fontSize: '0.875rem',
                fontWeight: row.isSent ? 500 : 600,
                color: rowColor({checklist: row}),
              }}
            >
              {row.patientName}
            </Typography>
          ),
        },
      ]
    : []),
  {
    flex: 0.3,
    minWidth: 128,
    sortable: false,
    field: 'checklistName',
    headerName: t('caregiverPortal.today.table.checklists'),
    renderCell: ({row}: CellType<CaregiverChecklist>) => (
      <Typography
        noWrap
        sx={{
          fontSize: '0.8125rem',
          color: row.isSent ? 'text.disabled' : 'text.secondary',
        }}
      >
        {[
          row.checklistName,
          row.isSent
            ? ''
            : getQuestionsLine({questionCount: row.questionCount, t}),
        ]
          .filter(Boolean)
          .join(' · ')}
      </Typography>
    ),
  },
  {
    flex: 0.16,
    minWidth: 88,
    sortable: false,
    field: 'assignmentNote',
    headerName: t('caregiverPortal.today.table.notes'),
    renderCell: ({row}: CellType<CaregiverChecklist>) => {
      if (row.isSent) {
        return (
          <Typography
            noWrap
            sx={{fontSize: '0.8125rem', fontWeight: 600, color: 'success.main'}}
          >
            {t('caregiverPortal.today.doneToday.sent')}
          </Typography>
        );
      }

      return (
        <Typography
          noWrap
          sx={{
            fontSize: '0.8125rem',
            color: row.assignmentNote
              ? 'text.disabled'
              : 'customColors.inkFaint',
            fontStyle: row.assignmentNote ? 'normal' : 'italic',
          }}
        >
          {row.assignmentNote || t('caregiverPortal.today.table.noNote')}
        </Typography>
      );
    },
  },
  {
    width: 112,
    sortable: false,
    align: 'right',
    field: 'open',
    headerName: '',
    renderCell: ({row}: CellType<CaregiverChecklist>) => {
      if (row.isSent) return null;

      const href = getChecklistHref({checklist: row});

      if (!href) return null;

      return (
        <Button
          component={Link}
          href={href}
          variant='outlined'
          color='secondary'
          size='small'
        >
          {t('caregiverPortal.today.table.open')}
        </Button>
      );
    },
  },
];

interface Props {
  rows: CaregiverChecklist[];
  title: string;
  subtitle?: string;
  emptyLabel: string;

  /** Today names the patient in a column; a patient's own page never does. */
  showPatient: boolean;

  /**
   * Phone rows open the checklist, or the sent submission, on tap. The patient
   * page leaves them plain and offers its pinned Start instead.
   */
  linkRows?: boolean;

  /** The card header already draws the rule above the column headers. */
  titleInCard?: boolean;

  isLoading?: boolean;
}

/**
 * The caregiver's checklist list, as a table on a desktop and as tappable rows
 * on a phone. Today and the patient page both read it, so one checklist says
 * the same thing wherever she meets it. `rows` carries the open, upcoming and
 * sent checklists in the order they should read.
 */
const CaregiverChecklistTable = ({
  rows,
  title,
  showPatient,
  subtitle,
  emptyLabel,
  linkRows = false,
  titleInCard = false,
  isLoading = false,
}: Props) => {
  const {t} = useTranslation();

  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return (
      <Box>
        <Typography
          variant='eyebrow'
          component='h2'
          sx={{color: 'text.disabled', px: 1, pb: 2}}
        >
          {title}
        </Typography>

        {isLoading ? (
          <CardRowsSkeleton row={{lines: 2}} />
        ) : rows.length === 0 ? (
          <EmptyLine text={emptyLabel} sx={{px: 1}} />
        ) : (
          <Card>
            {rows.map((checklist, index) => (
              <CaregiverChecklistRow
                key={checklist.id}
                checklist={checklist}
                isFirst={index === 0}
                showPatient={showPatient}
                href={
                  linkRows
                    ? getChecklistHref({checklist}) || undefined
                    : undefined
                }
              />
            ))}
          </Card>
        )}
      </Box>
    );
  }

  return (
    <DataTable<CaregiverChecklist>
      rows={rows}
      columns={getColumns({showPatient, t})}
      title={title}
      titleMeta={subtitle}
      titleInCard={titleInCard}
      noRowsLabel={emptyLabel}
      loading={isLoading}
      defaultPageSize={CAREGIVER_TABLE.pageSize}
      rowHeight={CAREGIVER_TABLE.rowHeight}
      gridSx={titleInCard ? undefined : gridSx}
    />
  );
};

export default CaregiverChecklistTable;
