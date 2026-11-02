import {Caregiver} from './caregiver';

// Caregiver details page props
export interface CaregiverDetailsProps {
  caregiverId: string;
}

// Caregiver statistics from GET /caregivers/:id/statistics
export interface CaregiverStatistics {
  submissionsCount: number;
  redFlagsCount: number;
}

// Caregiver details UI props
export interface CaregiverDetailsUIProps {
  caregiver: Caregiver;
  statistics?: CaregiverStatistics;
  isStatsLoading?: boolean;
}

// Caregiver stats cards row props
export interface CaregiverStatsCardsProps {
  statistics?: CaregiverStatistics;
  isStatsLoading: boolean;
}
