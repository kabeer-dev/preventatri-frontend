import {GridColDef, GridValidRowModel} from '@mui/x-data-grid';

import {ThemeColor} from '@/@core/theme/types';

import {CaseManager} from './caseManager';

// Detail stats for the case manager detail page
export interface CaseManagerDetailStats {
  caseload: number;
  followUpTasks: number;
  supervisoryVisits: number;
}

// Generic table data interface for entity detail pages
export interface CaseManagerEntityTableData<T extends GridValidRowModel> {
  title: string;
  rows: T[];
  columns: GridColDef<T>[];
  searchValue?: string;
  onSearchChange?: ({val}: {val: string}) => void;
  searchPlaceholder?: string;
  getRowId?: (row: T) => string | number;
}

// Assigned patient interface for the case manager detail page
export interface CaseManagerAssignedPatient {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  avatarColor?: ThemeColor;
  flagStatus: 'red' | 'yellow' | 'green';
}

// Case Manager details page props
export interface CaseManagerDetailsProps {
  caseManagerId: string;
}

// Case Manager details UI props
export interface CaseManagerDetailsUIProps {
  caseManager: CaseManager;
}
