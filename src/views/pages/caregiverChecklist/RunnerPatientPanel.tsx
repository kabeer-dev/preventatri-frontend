'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CustomAvatar from '@/@core/components/mui/avatar';
import {radius} from '@/@core/theme/spacing';
import {getInitials} from '@/@core/utils/userUtils';
import useTranslation from '@/shared/hooks/useTranslation';
import {RunnerPatientPanelProps} from '@/shared/interfaces/caregiverChecklistRunner';

/** The desktop runner's right rail: who the checklist is about, and the note. */
const RunnerPatientPanel = ({
  patientName,
  patientDetail,
  patientFacts = [],
  assignmentNote,
}: RunnerPatientPanelProps) => {
  const {t} = useTranslation();

  return (
    <Box
      component='aside'
      sx={{
        minHeight: 0,
        overflowY: 'auto',
        borderLeft: '1px solid',
        borderColor: 'divider',
        px: 5.5,
        py: 5.5,
      }}
    >
      <Box sx={{display: 'flex', alignItems: 'center', gap: 3}}>
        <CustomAvatar
          skin='light'
          sx={{
            width: 44,
            height: 44,
            flex: 'none',
            fontSize: '0.9375rem',
            fontWeight: 700,
          }}
        >
          {getInitials({name: patientName})}
        </CustomAvatar>
        <Box sx={{minWidth: 0}}>
          <Typography sx={{fontSize: '1rem', fontWeight: 700}}>
            {patientName}
          </Typography>
          {patientDetail && (
            <Typography sx={{fontSize: '0.78125rem', color: 'text.secondary'}}>
              {patientDetail}
            </Typography>
          )}
        </Box>
      </Box>

      {patientFacts.length > 0 && (
        <Box component='dl' sx={{m: 0, mt: 4.5}}>
          {patientFacts.map((fact) => (
            <Box
              key={fact.label}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 3,
                py: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                component='dt'
                sx={{fontSize: '0.78125rem', color: 'text.secondary'}}
              >
                {fact.label}
              </Typography>
              <Typography
                component='dd'
                sx={{
                  m: 0,
                  fontSize: '0.84375rem',
                  fontWeight: 600,
                  textAlign: 'right',
                }}
              >
                {fact.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {assignmentNote && (
        <Box
          sx={{
            mt: 5.5,
            px: 4,
            py: 3.5,
            borderRadius: `${radius.md}px`,
            backgroundColor: 'customColors.surfaceRaised',
          }}
        >
          <Typography
            variant='eyebrow'
            component='h2'
            sx={{color: 'text.disabled', px: 1, pb: 2}}
          >
            {t('caregiverChecklist.assignmentNote')}
          </Typography>
          <Typography sx={{fontSize: '0.84375rem', lineHeight: 1.55}}>
            {assignmentNote}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RunnerPatientPanel;
