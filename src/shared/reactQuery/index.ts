import {useQueries as activityLogQueries} from './activityLog/queries';
import {useMutations as assessmentMutations} from './assessments/mutations';
import {useQueries as assessmentQueries} from './assessments/queries';
import {useMutations as auditLogMutations} from './auditLogs/mutations';
import {useMutations as caregiverMutations} from './caregivers/mutations';
import {useQueries as caregiverQueries} from './caregivers/queries';
import {useMutations as caseManagerMutations} from './caseManagers/mutations';
import {useQueries as caseManagerQueries} from './caseManagers/queries';
import {useMutations as checklistAssignmentMutations} from './checklistAssignments/mutations';
import {useQueries as checklistAssignmentQueries} from './checklistAssignments/queries';
import {useQueries as countyQueries} from './counties/queries';
import {useMutations as followUpTaskMutations} from './followUpTasks/mutations';
import {useQueries as followUpTaskQueries} from './followUpTasks/queries';
import {useMutations as hhaExchangeMutations} from './hhaExchange/mutations';
import {useQueries as hhaExchangeQueries} from './hhaExchange/queries';
import {useQueries as hhaVisitQueries} from './hhaVisits/queries';
import {useMutations as notificationMutations} from './notifications/mutations';
import {useQueries as notificationQueries} from './notifications/queries';
import {useMutations as nurseMutations} from './nurses/mutations';
import {useQueries as nurseQueries} from './nurses/queries';
import {useMutations as organizationMutations} from './organizations/mutations';
import {useQueries as organizationQueries} from './organizations/queries';
import {useMutations as patientMutations} from './patients/mutations';
import {useQueries as patientQueries} from './patients/queries';
import {useMutations as regionMutations} from './regions/mutations';
import {useQueries as regionQueries} from './regions/queries';
import {useQueries as reportQueries} from './reports/queries';
import {useQueries as searchQueries} from './search/queries';
import {useMutations as securityMutations} from './securities/mutations';
import {useQueries as securityQueries} from './securities/queries';
import {useMutations as sessionMutations} from './sessions/mutations';
import {useQueries as sessionQueries} from './sessions/queries';
import {useMutations as superAdminMutations} from './superAdmin/mutations';
import {useQueries as superAdminQueries} from './superAdmin/queries';
import {useMutations as supervisoryVisitMutations} from './supervisoryVisits/mutations';
import {useQueries as supervisoryVisitQueries} from './supervisoryVisits/queries';
import {useMutations as userMutations} from './users/mutations';
import {useQueries as userQueries} from './users/queries';

export {
  activityLogQueries,
  auditLogMutations,
  notificationQueries,
  notificationMutations,
  userQueries,
  userMutations,
  regionQueries,
  regionMutations,
  reportQueries,
  nurseQueries,
  nurseMutations,
  caregiverQueries,
  caregiverMutations,
  caseManagerQueries,
  caseManagerMutations,
  checklistAssignmentMutations,
  checklistAssignmentQueries,
  patientQueries,
  patientMutations,
  hhaExchangeMutations,
  hhaExchangeQueries,
  hhaVisitQueries,
  countyQueries,
  assessmentQueries,
  assessmentMutations,
  supervisoryVisitQueries,
  supervisoryVisitMutations,
  followUpTaskMutations,
  followUpTaskQueries,
  sessionQueries,
  sessionMutations,
  securityQueries,
  securityMutations,
  searchQueries,
  organizationQueries,
  organizationMutations,
  superAdminQueries,
  superAdminMutations,
};
