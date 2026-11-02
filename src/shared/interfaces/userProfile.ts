import {ThemeColor} from '@/@core/layouts/types';

export interface UserProfileStatItem {
  icon: string;
  value: string | number;
  label: string;
  color: ThemeColor;
}

export interface UserProfileDetailItem {
  label: string;
  value: string;
}

export interface ChecklistAssignmentItem {
  id: string;
  checklistName: string;
  caregiverName: string;
  frequency: string;
  startDate: string;
  endDate: string;
}

export interface UserProfileCardProps {
  avatar?: string;
  avatarColor?: ThemeColor;
  name: string;
  role?: string;
  roleColor?: ThemeColor;
  stats?: UserProfileStatItem[];
  details?: UserProfileDetailItem[];
}
