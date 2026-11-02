import {GridColDef, GridValidRowModel} from '@mui/x-data-grid';

import {ThemeColor} from '@/@core/theme/types';

import {Nurse} from './nurse';

// Flag statistics for stats cards
export interface FlagStats {
  redFlags: number;
  yellowFlags: number;
  greenFlags: number;
}

// Generic table data interface for entity detail pages
export interface EntityTableData<T extends GridValidRowModel> {
  title: string;
  rows: T[];
  columns: GridColDef<T>[];
  searchValue?: string;
  onSearchChange?: ({val}: {val: string}) => void;
  searchPlaceholder?: string;
  getRowId?: (row: T) => string | number;
}

// Assigned patient interface
export interface AssignedPatient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatar?: string;
  avatarColor?: ThemeColor;
  caregiverFirstName: string;
  caregiverLastName: string;
  caregiverEmail: string;
  caregiverAvatar?: string;
  caregiverAvatarColor?: ThemeColor;
  flagStatus: 'red' | 'yellow' | 'green';
}

// Nurse details page props
export interface NurseDetailsProps {
  nurseId: string;
}

// Nurse details UI props
export interface NurseDetailsUIProps {
  nurse: Nurse;
}
