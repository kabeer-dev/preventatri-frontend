'use client';

import {Icon} from '@iconify/react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import CustomChip from '@/@core/components/mui/chip';
import SectionHeading from '@/shared/components/common/headers/SectionHeading';
import Link from '@/shared/components/common/localeLink';
import {CHECKLIST_SUBMISSION_STATUS} from '@/shared/constants/assessmentChecklists';
import {DASHBOARD_ROUTES} from '@/shared/constants/paths';
import useTranslation from '@/shared/hooks/useTranslation';
import {Patient} from '@/shared/interfaces/patient';
import {UpcomingAssessment} from '@/shared/interfaces/submission';
import {formatDate, isFutureDate} from '@/shared/utils/dateUtils';

import PatientAssessmentOverviewCard from './PatientAssessmentOverviewCard';

interface AssessmentsPageUIProps {
  patient: Patient;
  totalMonitoredWeeks: number;
  previousRedFlags: number;
  upcomingAssessments: UpcomingAssessment[];
  isAssessmentsError: boolean;
  onRetryAssessments: () => void;
}

const getStatusChipProps = ({status}: {status: string}) => {
  const statusConfig =
    CHECKLIST_SUBMISSION_STATUS[
      status as keyof typeof CHECKLIST_SUBMISSION_STATUS
    ];

  return {
    label: statusConfig?.label || status,
    color: (statusConfig?.color || 'default') as
      'warning' | 'error' | 'info' | 'success' | 'secondary' | 'default',
  };
};

const AssessmentsPageUI = ({
  patient,
  totalMonitoredWeeks,
  previousRedFlags,
  upcomingAssessments,
  isAssessmentsError,
  onRetryAssessments,
}: AssessmentsPageUIProps) => {
  const {t} = useTranslation();

  return (
    <Grid container spacing={4}>
      <Grid size={{xs: 12, md: 4}}>
        <PatientAssessmentOverviewCard
          patient={patient}
          totalMonitoredWeeks={totalMonitoredWeeks}
          previousRedFlags={previousRedFlags}
        />
      </Grid>

      <Grid size={{xs: 12, md: 8}}>
        <div className='flex flex-col gap-4'>
          <SectionHeading title={t('assessments.upcomingTitle')} />

          {isAssessmentsError && (
            <Card elevation={6}>
              <CardContent className='flex flex-col items-center gap-2 py-6'>
                <Icon
                  icon='mdi:alert-circle-outline'
                  fontSize='2.5rem'
                  className='text-red-500'
                />
                <Typography
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {t('assessments.loadError')}
                </Typography>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={onRetryAssessments}
                >
                  {t('assessments.retry')}
                </Button>
              </CardContent>
            </Card>
          )}

          {!isAssessmentsError && upcomingAssessments.length === 0 && (
            <Card elevation={6}>
              <CardContent className='flex flex-col items-center gap-2 py-6'>
                <Icon
                  icon='mdi:clipboard-check-outline'
                  fontSize='2.5rem'
                  className='text-gray-400'
                />
                <Typography
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {t('assessments.noUpcomingAssessments')}
                </Typography>
              </CardContent>
            </Card>
          )}

          {!isAssessmentsError &&
            upcomingAssessments.map((assessment) => {
              const checklistUrl = DASHBOARD_ROUTES.checklist({
                id: assessment.id,
              });

              const chipProps = getStatusChipProps({
                status: assessment.status,
              });

              const isFuture = assessment.dueDate
                ? isFutureDate({date: assessment.dueDate})
                : false;

              return (
                <Card key={assessment.id} elevation={6}>
                  <CardContent className='py-4 px-5'>
                    <div className='flex justify-between items-start mb-2'>
                      <div className='flex items-center gap-1.5'>
                        <Icon
                          icon='mdi:clipboard-list-outline'
                          fontSize='1.5rem'
                        />
                        <Typography variant='h6' className='font-semibold'>
                          {assessment.checklistTemplate?.title || 'Checklist'}
                        </Typography>
                      </div>
                      <CustomChip
                        label={chipProps.label}
                        color={chipProps.color}
                        size='small'
                        skin='light'
                        rounded
                      />
                    </div>

                    <div className='flex flex-wrap gap-3 mb-3'>
                      {assessment.dueDate && (
                        <div className='flex items-center gap-0.5'>
                          <Icon icon='mdi:calendar-outline' fontSize='1rem' />
                          <Typography
                            variant='body2'
                            sx={{
                              color: 'text.secondary',
                            }}
                          >
                            {t('assessments.dueDate', {
                              date: formatDate({
                                date: assessment.dueDate,
                                format: 'dd MMM yyyy',
                              }),
                            })}
                          </Typography>
                        </div>
                      )}
                      {assessment.deadline && (
                        <div className='flex items-center gap-0.5'>
                          <Icon icon='mdi:clock-outline' fontSize='1rem' />
                          <Typography
                            variant='body2'
                            sx={{
                              color: 'text.secondary',
                            }}
                          >
                            {t('assessments.deadline', {
                              date: formatDate({
                                date: assessment.deadline,
                                format: 'dd MMM yyyy',
                              }),
                            })}
                          </Typography>
                        </div>
                      )}
                      {assessment.assignment?.type && (
                        <CustomChip
                          label={assessment.assignment.type}
                          color='primary'
                          size='small'
                          skin='light'
                          rounded
                        />
                      )}
                    </div>

                    <Button
                      variant='contained'
                      color='primary'
                      fullWidth
                      startIcon={<Icon icon='mdi:clipboard-check-outline' />}
                      className='font-semibold py-1.5'
                      disabled={isFuture}
                      {...(!isFuture && {component: Link, href: checklistUrl})}
                    >
                      {t('assessments.prepareAssessment')}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </Grid>
    </Grid>
  );
};

export default AssessmentsPageUI;
